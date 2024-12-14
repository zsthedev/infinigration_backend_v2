import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler";
import { sendToken } from "../utils/sendToken.js";

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter All Felids", 400));
  }

  let user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 409));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  sendToken(res, user, `Welcome Back ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      sameSite: "none",
      secure: true,

      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged Out Successfully",
    });
});

export const register = catchAsyncError(async (req, res, next) => {
  const {
    name,
    fatherName,
    cnic,
    mobile,
    email,
    password,
    gender,
    dob,
    maritalStatus,
    relegion,
    nationality,
    jobTitle,
    role,
    salary,
  } = req.body;

  if (
    !name ||
    !fatherName ||
    !cnic ||
    !mobile ||
    !email ||
    !password ||
    !gender ||
    !dob ||
    !maritalStatus ||
    !relegion ||
    !nationality ||
    !jobTitle ||
    !role ||
    !salary
  ) {
    return next(new ErrorHandler("Please enter all feilds", 401));
  }

  let user = await User.findOne({ email: email });

  if (user) {
    return next(new ErrorHandler("User already exists", 401));
  }

  user = await User.create({
    name,
    fatherName,
    cnic,
    mobile,
    email,
    password,
    gender,
    dob,
    maritalStatus,
    religion,
    nationality,
    jobTitle,
    role,
    salary,
  });

  res.status(200).json({
    success: true,
    message: "Account Created Successfully",
  });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let selectedUser = await User.findById(id);
  const file = req.file;
  const { name, email } = req.body;

  if (!selectedUser) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  if (name) selectedUser.name = name;
  if (email) selectedUser.email = email;

  await selectedUser.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.parms;
  const selectedUser = await User.findById(id);

  if (!selectedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  await selectedUser.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
