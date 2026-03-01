import React, { useState, useRef } from 'react';
import axios from 'axios';

const VoiceNoteRecorder = ({ productId }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    
    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  const uploadVoiceNote = async () => {
    // Convert Blob to Base64 to send to your MongoDB/Express backend
    const response = await fetch(audioURL);
    const blob = await response.blob();
    const reader = new FileReader();
    
    reader.readAsDataURL(blob); 
    reader.onloadend = async () => {
      const base64data = reader.result;
      try {
        await axios.post('http://localhost:5000/api/upload-voice-note', {
          productId,
          audioData: base64data
        });
        alert("💖 Voice note saved successfully!");
      } catch (err) {
        console.error("Upload failed", err);
      }
    };
  };

  return (
    <div className="p-6 bg-pink-50 border-2 border-dashed border-pink-200 rounded-3xl flex flex-col items-center">
      <h3 className="text-pink-600 font-bold mb-4">Leave a Voice Review 🎀</h3>
      
      <div className="flex gap-4 mb-4">
        {!recording ? (
          <button onClick={startRecording} className="bg-pink-400 text-white px-6 py-2 rounded-full hover:bg-pink-500 transition shadow-md">
            Start Recording 🎤
          </button>
        ) : (
          <button onClick={stopRecording} className="bg-red-400 text-white px-6 py-2 rounded-full animate-pulse shadow-md">
            Stop Recording ⏹️
          </button>
        )}
      </div>

      {audioURL && (
        <div className="flex flex-col items-center gap-3">
          <audio src={audioURL} controls className="h-10 accent-pink-500" />
          <button onClick={uploadVoiceNote} className="bg-gradient-to-r from-pink-400 to-rose-400 text-white px-8 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition">
            Post Review ✨
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceNoteRecorder;