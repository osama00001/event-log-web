import express from "express"
import { loginUser, logout, registerUser, updateUserProfile, userProfile, forgotPassword, resetPassword } from "../controllers/userController.js"
import authProtected from "../middlewares/protected.js"
const userRouter = express.Router({ mergeParams: true })

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgot-password', forgotPassword) 
userRouter.post('/reset-password/:token', resetPassword)

// Protected routes
userRouter.use(authProtected)
userRouter.get("/profile", userProfile)
userRouter.put('/updateProfile', updateUserProfile)
userRouter.post('/logout', logout)

  
export default userRouter