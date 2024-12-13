import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler("User Must be Logged In to access this data", 400)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded._id);

  next();
});

export const isAuthorized = (...allowedRoles) => {
  return catchAsyncError(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} cant access this resource`)
      );
    }
    next();
  });
};
