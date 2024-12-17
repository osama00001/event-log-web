import { AppError } from "../utils/AppError.js";

const developmentError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const notFoundError = () => {
  return new AppError("The requested resource is not available", 404);
};

const handleSpecificErrors = (err) => {
  if (err.name === "CastError") {
    return new AppError(`Invalid ID: ${err.value}`, 400);
  }

  if (err.code === 11000) {
    const fieldName = Object.keys(err.keyValue).join(", ");
    return new AppError(`${fieldName} already exists`, 400);
  }

  if (err.name === "ValidationError") {
   
    const errors = Object.values(err.errors).map((e) => e.message);
    return new AppError(errors.join(". "), 400);
  }

  if (err.name === "JsonWebTokenError") {
    return new AppError("Invalid Token", 401);
  }

  if (err.name === "TokenExpiredError") {
    return new AppError("Token has expired", 401);
  }

  return null; // If no specific error matches
};

const productionError = (err, res) => {
  // Handle operational errors with specific messages
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Generic error for unhandled cases
  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

export const errorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong";

  if (process.env.NODE_ENV === "development") {
    return developmentError(err, res);
  }

  if (process.env.NODE_ENV === "production") {

    // Manually copy essential properties
    let error = { ...err, message: err.message, name: err.name };

    // Debugging
   

    // Handle specific errors
    const specificError = handleSpecificErrors(error);
    if (specificError) {
      error = specificError;
    }

    // Handle 404 errors explicitly
    if (error.statusCode === 404) {
      error = notFoundError();
    }

    return productionError(error, res);
  }
};
