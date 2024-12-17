import express from "express"
import authProtected from "../middlewares/protected.js"
import { createUserOperation, getAllOperations, updateOperation } from "../controllers/usreOperations.js"
import { upload } from "../middlewares/multer.js"
const userOperationRouter = express.Router({ mergeParams: true })

//securedRoutes
userOperationRouter.use(authProtected)

userOperationRouter.post("/",upload.single("attachedImage"),createUserOperation)
userOperationRouter.get("/",getAllOperations)
userOperationRouter.patch("/status",updateOperation)

export default userOperationRouter