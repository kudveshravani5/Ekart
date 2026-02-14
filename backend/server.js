import express from 'express';
import productRoute from './routes/productRoute.js';
import 'dotenv/config';
import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import router from "./routes/chatbotRoute.js"







// Create express app
const app = express();

/*
  CORS configuration
  This allows frontend (Vite runs on 5173) to call backend APIs
*/
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5179"],
  credentials: true
}));

// Middleware to read JSON data from request body
app.use(express.json());

app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/chatbot',router)






const PORT = process.env.PORT || 5000;



const startServer = async () => {
  try {
    
    await connectDB();

    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    
    console.error("Failed to start server:", error.message);
  }
};


startServer();
