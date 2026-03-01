import express from "express";
import {isAdmin, isAuthenticated} from "../middleware/isAuthenticated.js"
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalesData, getUserOrders, verifyPayment } from "../controllers/orderController.js";
const ordrouter = express.Router();
ordrouter.post("/create-order",isAuthenticated,createOrder);
ordrouter.post("/verify-payment",isAuthenticated,verifyPayment);
ordrouter.get("/myorder",isAuthenticated,getMyOrder);
ordrouter.get("/all",isAuthenticated,isAdmin,getAllOrdersAdmin);
ordrouter.get("/user-order/:userId",isAuthenticated,isAdmin,getUserOrders);
ordrouter.get("/sales",isAuthenticated,isAdmin,getSalesData);
export default ordrouter;