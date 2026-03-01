import React, { useState } from 'react';
import axios from 'axios';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");

  // Setup Web Speech API (Browser Built-in)
 const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setTranscript(text);
    handleVoiceCommand(text); // Send to AI
  };
  recognition.onerror = (err) => {
    console.error("Speech Error:", err);
    setIsListening(false);
  };
  recognition.start();
  

  const startListening = () => {
    setIsListening(true);
    setAiReply("");
    recognition.start();
  };

  const handleVoiceCommand = async (command) => {
    setIsListening(false);
    try {
      const response = await axios.post('http://localhost:5000/api/voice-chat', { prompt: command });
      setAiReply(response.data.reply);
      
      // Use TTS to speak back to the user
      const utterance = new SpeechSynthesisUtterance(response.data.reply);
      utterance.pitch = 1.2; // A bit higher for a "friendly/pink" vibe
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("AI Error:", err);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end">
      {/* AI Speech Bubble */}
      {aiReply && (
        <div className="mb-4 p-4 bg-pink-100 border-2 border-pink-300 rounded-2xl text-pink-700 shadow-lg max-w-xs animate-bounce">
          {aiReply}
        </div>
      )}

      {/* Main Voice Button */}
      <button
        onClick={startListening}
        className={`h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl 
          ${isListening ? 'bg-pink-600 scale-110 animate-pulse' : 'bg-pink-400 hover:bg-pink-500'}`}
      >
        <span className="text-white text-3xl">
          {isListening ? '🌸' : '🎤'}
        </span>
      </button>
      
      <p className="mt-2 text-pink-400 font-medium">
        {isListening ? "Listening..." : "Tap to speak"}
      </p>
      
      {transcript && <p className="text-xs text-pink-300 mt-1 italic">"{transcript}"</p>}
    </div>
  );
};

export default VoiceAssistant;