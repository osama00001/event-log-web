import express from "express"
import cors from "cors"
import userRouter from "./routes/user.js"
import cookieParser from "cookie-parser"
import { test } from "./middlewares/testing.js"
import { errorHandling } from "./middlewares/globleErrorHandling.js"
import { AppError } from "./utils/AppError.js"
import rateLimit from 'express-rate-limit';
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import hpp from "hpp"
import userOperationRouter from "./routes/operationRoutes.js"



const app = express()

// Configure CORS with specific options
app.use(cors());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true })); 
app.use(express.static("public"))
app.use(cookieParser())
app.use(helmet())
app.use(express.json())
app.use(hpp());

//data senatization ag ainst nosql query injection
app.use(mongoSanitize());

const limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'To many request from this IP, Please try again in hour'
})

// app.use(test)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/operations",userOperationRouter)

//unreached routes
app.all("*", (req, _, next) => {
    next(new AppError(`Path ${req.originalUrl} does not exist for ${req.method} method`, 404));
  });
  
app.use(errorHandling)

export default app