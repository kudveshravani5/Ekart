import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } =
      req.body;
    const userId = req.id;
    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //Handle multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", //claudinary folder name
        });
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    //create product in DB
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productImg,
      productPrice: Number(productPrice),
      category: category.trim().toLowerCase(),
      brand: brand.trim().toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllProducts = async (_, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No products found",
        products: [],
      });
    }
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // Delete images from Cloudinary
    for (let img of product.productImg) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    // Delete product from MongoDB
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      existingImages,
    } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    let updatedImages = [];
    // keep existing images
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id),
      );
      //delete only removed images
      const removedImages = product.productImg.filter(
        (img) => !keepIds.includes(img.public_id),
      );
      for (let img of removedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } else {
      updatedImages = product.productImg; //keep all if nothing sent
    }
    //upload new images if any
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", //claudinary folder name
        });
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    //update product in DB
    product.productName = productName || product.productName;
    product.productDesc = productDesc || product.productDesc;
    product.productPrice = productPrice || product.productPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.productImg = updatedImages;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ✨ AI VOICE ADDITION: Upload a Voice Note Review
export const uploadVoiceReview = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.id;

    if (!req.file) {
      return res.status(400).json({ message: "Audio file required" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID missing" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "voice_reviews",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.voiceReviews.push({
      user: userId,
      audioUrl: result.secure_url,
      transcription: "",
    });

    await product.save();

    res.status(200).json({
      success: true,
      message: "Voice review added!",
      audioUrl: result.secure_url,
    });

  } catch (error) {
    console.error("VOICE UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✨ AI VOICE INTEGRATION: Controller to save voice reviews
export const addVoiceReview = async (req, res) => {
  try {
    const { productId, transcription, audioUrl } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.voiceReviews.push({
      user: req.id,
      audioUrl,
      transcription
    });

    await product.save();
    res.status(200).json({ success: true, message: "Voice review saved! 💖" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
