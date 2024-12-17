import jwt from 'jsonwebtoken'
import asyncHandler from "express-async-handler"
import UserModel from '../models/user.js';
import { AppError } from '../utils/AppError.js';


const authProtected = asyncHandler(async (req, res, next) => {
 
    let token;
    if ((req.headers.authorization && req.headers.authorization.startsWith('Bearer'))|| req.cookies?.accessToken) {
      token =  req.cookies?.accessToken || req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next( new AppError("User Not authorized", 404))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?._id) {
        return next(new AppError("User Not authorized", 401));
      }
    let currentUser = await UserModel.findById(decoded._id);
    if(!currentUser) return next( new AppError("User Not authorized", 404))
    req.user = currentUser
    next();
})

export default authProtected