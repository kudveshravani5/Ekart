import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/ekart`);
        console.log("Mongoose connected successfully");
        
    } catch (error) {
        console.log("MongoDB connection failed:", error); 
        
    }
};
export default connectDB;