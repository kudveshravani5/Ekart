import razorpayInstance from "../config/razorpay";

export const createOrder = async (req,res) =>{
    try {
        const {products, amount,tax,shipping,currency} = req.body;
        const options ={
            amount:Math.round(Number(amount) *100),
            currency:currency||"INR",
            receipt:`receipt_${Data.now()}`

        }
        const razorpayOrder = await razorpayInstance.orders.create(options)
        const newOrder = new Order({
            user:req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status:"Pending",
            razorpayOrderId : razorpayOrder.id


        })
        await newOrder.save()
        res.json({
            success:true,
            order:razorpayOrder,
            dbOrder : newOrder
        })
    } catch (error) {
        console.error("❌ Error in create Order:" ,error);
        res.status(500).json({success:false,message:error.message})
        
    }
}