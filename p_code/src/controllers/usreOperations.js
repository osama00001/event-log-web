import asyncHandler from "express-async-handler";
import { uploadfileToCloudinary } from "../utils/cloudinary.js";
import { AppError } from "../utils/AppError.js";
import OperationModel from "../models/operation.js";
import UserModel from "../models/user.js";

const getAllOperations=asyncHandler(async(req,res,next)=>{
    let currentUser = await UserModel.findById(req.user._id)
  if(!currentUser) return next(new AppError("User not Authorized",401))
    let operations = await OperationModel.find()
if(!operations?.length) return next(new AppError("no operation found",401))
 return res.status(200).json({
    status:'success',
    operations
})

})
const createUserOperation = asyncHandler(async(req,res,next)=>{
    let currentUser = await UserModel.findById(req.user._id)
    if(!currentUser) return next(new AppError("User not Authorized",401))
    const {
        jobNumber,
        operatorName,
        date,
        time,
        location,
        substation,
        panelId,
        operationType,
        operations,
        additionalNotes,
        attachedImage,
        status,
        timestamps,
      } = req.body; 
    
   let fileURL=""
    if(req.file)
    {
        fileURL = await uploadfileToCloudinary(req.file.path)
        if (!fileURL) {
           return next( new AppError("attachedFile path is required",401))
        }
    }
    let payload ={
        jobNumber,
        operatorName,
        date,
        time,
        location,
        substation,
        panelId,
        operationType,
        operations,
        additionalNotes,
        attachedImage:fileURL?.secure_url||'',
        status,
        timestamps,
      } 

    let operation = await OperationModel.create(payload)
    res.status(200).json({operation})

})

const updateOperation =asyncHandler(async(req,res,next)=>{

  let currentUser = await UserModel.findById(req.user._id)
  if(!currentUser) return next(new AppError("User not Authorized",401))
    
    const { operationId, status } = req.query;
      const operation = await OperationModel.findById(operationId);
  
      if (!operation) {
        return res.status(404).json({ message: 'Operation not found' });
      }
  
      operation.status = status;
      operation.timestamps[status] = new Date();
      await operation.save();
  
      return res.status(200).json({
        status:'success',
        operations:operation
    })
})
export {createUserOperation,getAllOperations,updateOperation}