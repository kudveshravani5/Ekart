import razorpayInstance from "../config/razorpay.js";
import {Order} from "../models/orderModel.js";
import crypto from "crypto";
import {Cart} from "../models/cartModel.js"
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";


export const createOrder = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { products, amount, tax, shipping, currency } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder
    });

  } catch (error) {
    console.error("❌ Error in create Order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
  


};

export const verifyPayment = async (req,res) =>{
    try {
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature,paymentFailed} = req.body;
        const userId = req.user._id;
        if(paymentFailed){
            const order = await Order.findOneAndUpdate(
                {razorpayOrderId : razorpay_order_id},
                {status: "Failed"},
                {new: true}
            );
            return res.status(400).json({success:false, message:"Payment Failed", order})
        }
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_SECRET_KEY)
        .update(sign.toString())
        .digest("hex")
        
        if(expectedSignature === razorpay_signature){
            const order = await Order.findOneAndUpdate(
                {razorpayOrderId : razorpay_order_id},
                {
                    status: "Paid",
                    razorpayPaymentId:razorpay_payment_id,
                    razorpaySignature:razorpay_signature
                },
                {new: true}
            );
            await Cart.findOneAndUpdate({user:userId}, {$set : {items:[],totalPrice:0}})
            return res.json({success:true, message:"Payment Successfull",order})
        }else{
            await Order.findOneAndUpdate(
                {razorpayOrderId : razorpay_order_id},
                {status: "Failed"},
                {new: true}
            );
            return res.status(400).json({success:false, message:"Invalid signature"})
        }

        
        
    } catch (error) {
        console.error("❌ Error in verify Payment:",error)
        res.status(500).json({success:false , message:error.message});
        
    }
}
export const getMyOrder = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg"
      })
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: error.message });
  }
};
//Admins only
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params; // userId will come from URL

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg"
      }) // fetch product details
      .populate("user", "firstName lastName email"); // fetch user info

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.log("Error fetching user order: ", error);
    res.status(500).json({ message: error.message });
  }
};
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email") // populate user info
      .populate("products.productId", "productName productPrice"); // populate product info

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message
    });
  }
};
export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({ status: "Paid" })

        // Total sales amount
        const totalSaleAgg = await Order.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log("totalSaleAgg",totalSaleAgg)

        const totalSales = totalSaleAgg[0]?.total || 0;

        // Sales grouped by date (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await Order.aggregate([
            {
                $match: {
                    status: "Paid",
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" },
                }
            },
            { $sort: { _id: 1 } }
        ])

        

        const formattedSales = salesByDate.map((item) => ({
            date: item._id,
            amount: item.amount
        }))

        
        res.json({
          success:true,
          totalUsers,
          totalProducts,
          totalOrders,
          totalSales,
          sales: formattedSales
        })

    } catch (error) {
      console.error("Error fetching sales data:",error);
      res.status(500).json({success:false,message:error.message})
        
    }
}