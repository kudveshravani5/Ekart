import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({
        success: true,
        cart: [],
      });
    }
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;

    
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }


    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const price = Number(product.productPrice);
    if (isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: qty,
            price,
          },
        ],
        totalPrice: price * qty,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
        cart.items[itemIndex].price = price;

        if (!cart.items[itemIndex].price) {
          cart.items[itemIndex].price = price;
        }
      } else {
        cart.items.push({
          productId,
          quantity:qty,
          price,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, type } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }
    if (type === "increase") {
      item.quantity += 1;
    }
    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }
    //Recalculate the total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    await cart.save();
    cart = await cart.populate("items.productId");
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    cart = await cart.populate("items.productId");
    await cart.save();
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Save an item for later
// Save product for later
// cartController.js — correct saveForLater backend function
export const saveForLater = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Avoid duplicates in saveForLater
    const alreadySaved = cart.saveForLater.some(
      (item) => item.productId.toString() === productId
    );
    if (alreadySaved) {
      return res.status(400).json({ success: false, message: "Already saved for later" });
    }

    // Remove from cart items if present
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Recalculate total
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );

    // Add to saveForLater
    cart.saveForLater.push({ productId });

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId")
      .populate("saveForLater.productId");

    return res.status(200).json({
      success: true,
      message: "Saved for later",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Save for later error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Move product from Save For Later to Cart
export const moveToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    // Remove from saveForLater
    cart.saveForLater = cart.saveForLater.filter(
      (item) => item.productId.toString() !== productId
    );

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const price = Number(product.productPrice);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1, price });
    }

    // Update total price
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId")
      .populate("saveForLater.productId");

    return res.status(200).json({
      success: true,
      message: "Moved to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Move to cart error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const removeSaveForLater = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.saveForLater = cart.saveForLater.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate("items.productId")
      .populate("saveForLater.productId");

    return res.status(200).json({
      success: true,
      message: "Removed from Save For Later",
      cart: populatedCart,
    });
  } catch (error) {
    console.error("Remove Save For Later error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
