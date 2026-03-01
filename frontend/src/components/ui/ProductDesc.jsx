import { Input } from "@/components/ui/input";
import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'

const ProductDesc = ({ product : initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);
  const accessToken = localStorage.getItem("accessToken")
  const [recording, setRecording] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch()

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 🎤 Start Recording
  const startRecordingLogic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      toast.error("Microphone access denied. Please enable it in settings.");
      console.log(err)
    }
  };

  const stopAndUploadLogic = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      // Release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

      const formData = new FormData();
      // Match multer middleware key ("image") from your multer.js
      formData.append("image", audioBlob); 
      formData.append("productId", product._id);

      try {
        const loadingToast = toast.loading("AI is transcribing your voice...");
        
        const res = await axios.post(
          "http://localhost:5000/api/v1/user/upload-voice-note",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        toast.dismiss(loadingToast);

        if (res.data.success) {
          toast.success("Review posted successfully! ✨");
          // Logic: Local update so the user sees the review immediately
          const newReview = {
            transcription: res.data.transcription,
            audioUrl: res.data.audioUrl,
            user: { firstname: "You" }, // Temporary display name
            createdAt: new Date()
          };
          setProduct(prev => ({
            ...prev,
            voiceReviews: [newReview, ...prev.voiceReviews]
          }));
        }
      } catch (err) {
        toast.error("Could not connect to server. Is the backend running?");
        console.error(err);
      }
    };
  };

 

  // 🛒 Add to Cart
  const addToCart = async (productId) => {
    if (!accessToken) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/v1/cart/add',
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        toast.success('Product added to cart');
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error("Add to cart failed");
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Voice Recorder UI */}
      <div className="mt-6 p-6 bg-pink-50 rounded-3xl border-2 border-dashed border-pink-200 text-center">
        <p className="text-pink-500 font-medium mb-4 text-sm">
          Too tired to type? Leave a voice note review! 🎀
        </p>
        <button 
          onClick={recording ? stopAndUploadLogic : startRecordingLogic}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg mx-auto ${
            recording ? "bg-red-500 animate-pulse scale-110" : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {recording ? <span className="text-white text-xl">🛑</span> : <span className="text-white text-2xl">🎤</span>}
        </button>
        {recording && <p className="text-red-500 text-xs mt-2 font-bold animate-bounce">Listening...</p>}
      </div>

      <h1 className='font-bold text-4xl text-gray-800 mt-4'>{product.productName}</h1>
      <h2 className='text-pink-500 font-bold text-2xl'>₹{product.productPrice}</h2>
      <p className='text-muted-foreground'>{product.productDesc}</p>
      <div className="flex gap-2 items-center w-[300px]"> <p className='text-gray-800 font-semibold'>Quantity:</p> <Input type='number' className='w-14' value={quantity} min={1} onChange={(e) => setQuantity(Number(e.target.value))} /> </div>
      <Button onClick={() => addToCart(product._id)} className='bg-pink-600 w-max' > Add to Cart </Button>
      <div className="mt-10">
        <h3 className="font-bold text-xl mb-6 border-b pb-2 flex items-center gap-2">
           Community Voice Reviews 🎙️
        </h3>
        
        {product?.voiceReviews?.length > 0 ? (
          <div className="space-y-4">
            {product.voiceReviews.map((rev, i) => (
              <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                    {rev.user?.firstname?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-gray-800">{rev.user?.firstname || "Verified User"}</span>
                    <span className="text-[10px] text-gray-400 italic">Voice Review</span>
                  </div>
                </div>
                
                {/* Transcribed Text Display */}
                <div className="bg-gray-50 p-3 rounded-xl mb-3 border-l-4 border-pink-400">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{rev.transcription || "Transcribing..."}"
                  </p>
                </div>

                <audio controls src={rev.audioUrl} className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dotted">
            <p className="text-gray-400 text-sm italic">Be the first to leave a voice review!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDesc;