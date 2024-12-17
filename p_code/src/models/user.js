import { mongoose, Schema, model } from "mongoose"
import validator from 'validator';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from 'crypto';

const userSchema = new Schema(
    {
      email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        index: true,
        validate: {
          validator: (value) => validator.isEmail(value),
          message: "Please provide a valid email address",
        },
      },
      userName:{
        type: String, 
        unique: true,
        lowercase: true,
        index: true,
        required: [true, "Username is required"],
      },
      phoneNumber:{
        type: String,
        default:""
      },
      avatar: {
        type: String,
      },
      password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
      },
      refreshToken: {
        type: String,
      },
      role: {
        type: String,
        enum: ["operator", "control"],
        default: "operator",
        required: false,
      },
      resetToken: String,
      resetTokenExpiry: Date,
      operations: [{ type: Schema.Types.ObjectId, ref: "Operation" }],
    },
    {
      timestamps: true,
      toJSON: {
        transform: (doc, ret) => {
          delete ret.password;
          delete ret.refreshToken;
          delete ret.resetToken;
          delete ret.resetTokenExpiry;
          delete ret.__v;
          return ret;
        },
      },
    }
  );

userSchema.pre('save', async function (next) { 
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function (user) {
    return await jwt.sign({_id:this._id, username: this.userName, email: this.email, image: this.avatar, fullName: this.fullName }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

userSchema.methods.generateRefreshToken = async function (user) {
    return await jwt.sign({ _id:this._id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
}

userSchema.methods.createResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

userSchema.methods.clearResetToken = function() {
  this.resetToken = undefined;
  this.resetTokenExpiry = undefined;
};

const UserModel = model("User", userSchema)

export default UserModel