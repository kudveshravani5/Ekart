import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: {
      type: String,
      required: true,
    },
    productDesc: {
      type: String,
      required: true,
    },
    productImg: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    productPrice: {
      type: Number,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    // ✨ AI VOICE ADDITION: Store voice review URLs and AI transcriptions
    voiceReviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        audioUrl: String,
        transcription: String,
        rating: { type: Number, default: 5 },
        images: [{ url: String, public_id: String }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    relatedCatgegories: [String]
  },
  { timestamps: true },
);
export const Product = mongoose.model("Product", productSchema);
