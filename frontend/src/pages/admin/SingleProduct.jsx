import React from 'react'
import Breadcrums from '@/components/ui/Breadcrums'
import ProductImg from '@/components/ui/ProductImg'
import ProductDesc from '@/components/ui/ProductDesc'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Mic, PlayCircle } from "lucide-react";

const SingleProduct = () => {
  const params  = useParams()
  const productId = params.id
  const {products} = useSelector(store=>store.product)
  const product = products.find ((item)=>item._id === productId)
  if (!product) {
    return (
      <div className="pt-24 text-center text-gray-500">
        Loading product...
      </div>
    )
  }
  return (
    <div className='pt-24 py-10 max-w-7xl mx-auto'>
        <Breadcrums product={product}/>
        <div className="mt-10 grid grid-cols-2 items-center">
            <ProductImg images = {product.productImg}/>
            <ProductDesc product = {product} />
        </div>
        {/* ✨ AI VOICE INTEGRATION: Voice Review Section */}
        <div className="mt-12 p-8 bg-pink-50 rounded-3xl border border-pink-100 shadow-inner">
            <h2 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                <Mic className="text-pink-500" /> Community Voice Reviews
            </h2>
            
            {/* Display existing Voice Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {product.voiceReviews?.map((rv, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-4">
                        <button className="text-pink-500 hover:scale-110 transition"><PlayCircle size={32}/></button>
                        <div>
                            <p className="text-xs text-gray-400 italic">" {rv.transcription} "</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Record New Voice Note */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-pink-200 rounded-2xl bg-white/50">
                <p className="text-pink-400 text-sm mb-3">Too tired to type? Leave a voice note review!</p>
                <button className="bg-pink-500 hover:bg-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-pink-200 transition-all active:scale-90">
                    <Mic size={28} />
                </button>
            </div>
        </div>
    </div>
  )
}


export default SingleProduct