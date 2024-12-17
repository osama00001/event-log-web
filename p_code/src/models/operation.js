import mongoose from "mongoose"
import STATUS_ENUM from "../constant.js"

const OperationSchema = new mongoose.Schema(
  {
    jobNumber: { type: String, required: true, trim: true },
    operatorName: { type: String, required: true, trim: true },
    date: { type: String, required: true,  },
    time: { type: String, required: true, },
    location: { type: String, required: true, trim: true },
    substation: { type: String, required: true, trim: true },
    panelId: { type: String, required: true, trim: true },
    operationType: { type: String, required: true, trim: true },
    operations: [{ type: String }],
    additionalNotes: { type: String, default: '' },
    attachedImage: { type: String, default: '' },
    status: {
      type: String,
      enum: STATUS_ENUM,
      default: 'requested'
    },
    timestamps: {
      requested: { type: Date, default: null },
      issued: { type: Date, default: null },
      received: { type: Date, default: null },
      completed: { type: Date, default: null },
      acknowledged: { type: Date, default: null }
    }
  },
  {
    timestamps: true, 
    versionKey: false 
  }
);




OperationSchema.index({ jobNumber: 1 });
OperationSchema.index({ status: 1 });

const OperationModel =mongoose.model('Operation', OperationSchema);
export default OperationModel
