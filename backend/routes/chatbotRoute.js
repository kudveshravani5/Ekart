import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { multipleUploadChatfiles } from "../middleware/multer.js";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: "You are Luxe Concierge, a high-end E-commerce AI assistant. Analyze images, videos, and documents to provide luxury shopping advice and product insights."
});

// Helper function for Mandatory Exponential Backoff
const generateWithRetry = async (contents, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent({ contents });
    } catch (error) {
      if (i === retries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

router.post("/", multipleUploadChatfiles, async (req, res) => {
  try {
    const { question, editedImage, annotations } = req.body;
    const files = req.files;

    let parts = [{ text: question || "Analyze the provided assets." }];

    // Handle normal uploaded files via multer
    if (files && files.length > 0) {
      files.forEach((file) => {
        let inlineDataObj = {
          data: file.buffer.toString("base64"),
          mimeType: file.mimetype,
        };

        // Attach annotations if they exist and match the filename
        if (annotations) {
          try {
            const parsedAnnotations = typeof annotations === 'string' ? JSON.parse(annotations) : annotations;
            if (parsedAnnotations && parsedAnnotations[file.originalname]) {
              inlineDataObj.annotations = parsedAnnotations[file.originalname];
            }
          } catch (e) {
            // Silently ignore malformed JSON
          }
        }

        parts.push({
          inlineData: inlineDataObj,
        });
      });
    }

    // Handle edited image from frontend canvas
    if (editedImage) {
      const base64Data = editedImage.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      });
    }

    // Generate response using retry logic for stability
    const data = await generateWithRetry([{ role: "user", parts }]);
    const finalData = data.response.text();

    res.json({
      status: true,
      finalData,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

export default router;