import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      const user = await User.findOne({
        email
      });
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstname ,
      lastname ,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email); //send email here
    newUser.token = token;
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authentication token is missing or invalid",
      });
    }
    const token = authHeader.split(" ")[1]; // ["Bearer" jfjkfakfbka]
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    user.token = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified sucessfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email sent again sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      token: user.token,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "User Credentials",
      });
    }
    if (existingUser.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Verify your account then login",
      });
    }
    //generate token
    const accessToken = jwt.sign(
      { id: existingUser._id,
        role: existingUser.role
      },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id,
        role: existingUser.role
      },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );
    existingUser.isLoggedIn = true;
    await existingUser.save();
    //Check for existing session and delete it
    const existingSession = await Session.findOneAndDelete({ userId: existingUser._id });
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id });
    }
    
    //Create a new session
    await Session.create({ userId: existingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.firstname}`,
      user: existingUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    const userId = req.id;

    // delete session
    await Session.findOneAndDelete({ userId });

    // update user login status
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const forgetPassword = async (req,res)=> {
  try {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      });
      
    }
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    const otpExpiry = new Date(Date.now()+10*60*1000);//10mins
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save()
    await sendOTPMail(otp,email);
    return res.status(200).json({
      success:true,
      message:"Otp sent to email sucessfully"
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
    
  }
}
export const verifyOTP = async(req,res)=>{
  try {
    const {otp} = req.body;
    const email = req.params.email;
    if(!otp){
      return res.status(400).json({
        success:false,
        message:"Otp is required"
      });
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      });
    }
    if(!user.otp || !user.otpExpiry){
      return res.status(400).json({
        success:false,
        message:"Otp is not generated or already verified"
      });
    }
    if(user.otpExpiry < new Date()){
      return res.status(400).json({
        success:false,
        message:"Otp has expired please request a new one"
      });
    }
    if(otp !== user.otp){
      return res.status(400).json({
        success:false,
        message:"Otp is invalid"
      });
    }
    user.otp = null
    user.otpExpiry = null
    await user.save();
    return res.status(200).json({
      success:true,
      message:"Otp verified sucessfully"

    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
    
  }
}
export const changePassword = async(req,res)=>{
  try {
    const {newPassword,confirmPassword} = req.body;
    const {email} = req.params
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
      success:false,
      message:"User not found"
    });
    }
    if(!newPassword ||!confirmPassword){
      return res.status(400).json({
      success:false,
      message:"All fields are required"
    });
  }
  if(newPassword !== confirmPassword){
    return res.status(400).json({
      success:false,
      message:"password do not match"
    });
  }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    await user.save();
    return res.status(200).json({
      success:true,
      message:"Password changed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}
export const allUser=async(_,res)=>{
  try {
    const users = await User.find();
    return res.status(200).json({
      success:true,
      users
    });
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message

    });
    
  }
}
export const getUserById = async(req,res)=>{
  try {
    const {userId} = req.params; //extract userId from  request params
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token");
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }
    res.status(200).json({
      success:true,
      user
    });
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message

    });
    
  }

}
export const updateUser = async(req,res)=>{
  try {
    const userIdToUpdate = req.params.id
    const loggedInUser = await User.findById(req.user.id);
    const {firstname,lastname,address,city,zipCode,phoneNo,role} = req.body
    if(loggedInUser._id.toString()!== userIdToUpdate && loggedInUser.role !== 'admin'){
      return res.status(403).json({
        success:false,
        message:"You are not allowed to update this profile"
      })
    }
    let user = await User.findById(userIdToUpdate);
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    //if a new file is uploaded
    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;



    if(req.file){
      if(profilePicPublicId){
        await cloudinary.uploader.destroy(profilePicPublicId)
        


      }
      const uploadResult = await new Promise((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
          {folder:"profile"},
          (error,result)=>{
            if(error) reject(error)
              else resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
      user.profilePic = profilePicUrl;
      user.profilePicPublicId = profilePicPublicId;
    }
    //update files
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    user.role = role || user.role;
  

    const updatedUser = await user.save()

    return res.status(200).json({
      success:true,
      message:"Profile Updated Successfully",
      user:updatedUser,
    })

    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:error.message
    })
    
  }
}