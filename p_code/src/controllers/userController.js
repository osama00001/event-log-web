import asyncHandler from "express-async-handler"
import UserModel from "../models/user.js";
import { AppError } from "../utils/AppError.js";
import {clearTokensFromCookies, setTokensAsCookies} from "../utils/setCookies.js";
import crypto from 'crypto';
import sendMail from "../utils/Email.js";
const registerUser = asyncHandler(async(req,res,next) => {
  const { email, password, role, userName } = req.body;

  // Input validation
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters long", 400));
  }

  let payload = {email, password,userName}
  if (role) payload.role = role; // Only add role if provided

  const userExists = await UserModel.findOne({ email });
  if(userExists){
    return next(new AppError("Email already registered",409))
  }

  const user = await UserModel.create(payload);
  
  // Generate tokens immediately after registration
  let accessToken = await user.generateAccessToken()
  let refreshToken = await user.generateRefreshToken()
  user.refreshToken = refreshToken
  await user.save({validateBeforeSave:false})

  setTokensAsCookies(res, accessToken, refreshToken);

  res.status(201).json({
    status: 'success',
    user,
    accessToken,
    message: 'User registered successfully'
  });
})

const loginUser = asyncHandler(async(req,res,next)=>{
  const {email, password, role} = req.body

  // Input validation
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  let userExist = await UserModel.findOne({email})
  if(!userExist) return next(new AppError("Invalid credentials",401))
  
  let isPasswordVerified = await userExist.verifyPassword(password)
  if(!isPasswordVerified) return next(new AppError("Invalid credentials",401))
  
  // Only check role if it's provided
  if (role && userExist.role !== role) {
    return next(new AppError("Unauthorized role access", 403));
  }

  let accessToken = await userExist.generateAccessToken()
  let refreshToken = await userExist.generateRefreshToken()
  userExist.refreshToken = refreshToken
  let updatedUser = await userExist.save({validateBeforeSave:false})
  
  setTokensAsCookies(res, accessToken, refreshToken);
  
  res.status(200).json({
    status: 'success',
    user: updatedUser,
    accessToken,
    message: 'Logged in successfully'
  })
})

const logout = asyncHandler(async (req,res,next)=>{
  let user = await UserModel.findByIdAndUpdate(req.user._id,{refreshToken:''},{new:true})
  req.user=null
  clearTokensFromCookies(res);
  return res.status(200).json({ message: "Logged out successfully",status: 'success',user:user });
  
})

const userProfile = asyncHandler(async(req,res,next)=>{
  let currentUser = await UserModel.findById(req.user._id)
  if(!currentUser) return next(new AppError("User not Authorized",401))
  res.status(200).json({
   status:'success',
    user:currentUser
  
  })
})

const updateUserProfile = asyncHandler(async(req,res,next)=>{
  let currentUser = await UserModel.findById(req.user._id)
  if(!currentUser) return next(new AppError("User not Authorized",401))
    let updateData = req.body
  const userExists = await UserModel.findOne({ email:updateData.email });
  if(userExists&&!userExists?.email==updateData.email){
    if(userExists){
      return next(new AppError("Email already registered",409))
    }
  }
 
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id, // ID of the user to update
      updateData, // Fields to update
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the update adheres to the schema validators
      }
    );
  res.status(200).json({
   status:'success',
    user:updatedUser
  
  })
})

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if(!user) return next(new AppError("User email is not registered",400))


  // Generate reset token
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });


  let options = {
    from: process.env.EMAIL_HOST,
    to: user.email,
    subject: "Reset Your Password",
    text: `Hi ${user?.userName},
  
  We received a request to reset your password. Please click the link below to reset your password:
  
  http://localhost:8080/reset-password?token=${resetToken}
  
  If you did not request a password reset, please ignore this email or contact support if you have concerns.
  
  This link will expire in 30 minutes for security reasons.
  
  Thank you,
  YourApp Team`
  };
  
try {
    await sendMail(options)
    res.status(200).json({
        status: 'success',
        message: 'Reset token generated successfully'
    })
} catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined; // Token expires in 1 hour
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Something went wronsg", 404))
}






  // res.status(200).json({
  //   status: 'success',
  //   message: 'Reset token generated successfully',
  //   resetToken // In production, this would be sent via email
  // });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return next(new AppError('Please provide a valid password (min 6 characters)', 400));
  }

  // Find user by reset token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await UserModel.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  // Update password and clear reset token
  user.password = password;
  user.clearResetToken();
  await user.save();

  // Log user in
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokensAsCookies(res, accessToken, refreshToken);

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful',
    accessToken
  });
});

export { registerUser, loginUser, logout, userProfile, updateUserProfile, forgotPassword, resetPassword };
