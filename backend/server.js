import express from 'express';
import productRoute from './routes/productRoute.js';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import routers from "./routes/chatbotRoute.js";
import ordrouter from './routes/orderRoute.js';
import router from './routes/cartRoute.js';
import http from 'http';
import mongoose from 'mongoose';
import voiceReviewRoute from "./routes/productRoute.js";
import { singleUpload } from './middleware/multer.js';

 









// Create express app
const app = express();

/*
  CORS configuration
  This allows frontend (Vite runs on 5173) to call backend APIs
*/
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5179", "https://ekart-kudveshravani5s-projects.vercel.app"],
  credentials: true
}));

// Middleware to read JSON data from request body

const server = http.createServer(app);
app.use(express.json());

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/chatbot',routers);
app.use('/api/v1/orders',ordrouter);
app.use('/api/v1/cart',router);
app.use("/api/v1/voice", voiceReviewRoute);





app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
app.get("/", (req, res) => {
  res.send("E-Kart Backend Running 🚀");
});


 

// AI Chat Route (Gemini Integration)
app.post('/api/voice-chat', async (req, res) => {
  const { prompt } = req.body;
  
  try {
    // You can replace this with your existing Gemini logic
    // For now, we simulate the AI thinking about the user's voice command
    const aiResponse = `I found some cute items for "${prompt}"! Would you like to see them?`;
    
    res.json({ reply: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "AI grew tired. Try again!" });
  }
});
// Schema for Voice Notes/Reviews
const voiceNoteSchema = new mongoose.Schema({
  productId: String,
  audioBase64: String, // Storing as string (fine for short notes)
  createdAt: { type: Date, default: Date.now }
});
const VoiceNote = mongoose.model('VoiceNote', voiceNoteSchema);

// Endpoint to save voice review


  
  
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
// ... existing imports ...


// ✨ AI VOICE ADDITION: NLP Voice Command Parser
// This endpoint takes text (from frontend Speech-to-Text) and determines the action
app.post('/api/upload-voice-note', singleUpload, async (req, res) => {
  try {
    const { productId } = req.body;
    let audioData;

    // Check if it's coming as a file (FormData) or Base64 (JSON)
    if (req.file) {
      audioData = req.file.buffer.toString('base64');
    } else {
      audioData = req.body.audioData;
    }

    const newNote = new VoiceNote({ 
      productId, 
      audioBase64: audioData 
    });
    await newNote.save();
    res.status(201).json({ message: "Voice note saved! 🌸" });
  } catch (error) {
    res.status(500).json({ error: "Could not save audio." });
  }
});




const PORT = process.env.PORT || 5000;




const startServer = async () => {
  try {
    
    await connectDB();

    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    
    console.error("Failed to start server:", error.message);
  }
};



startServer();






export default app;
