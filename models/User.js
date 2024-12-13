import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
  },
  cnic: {
    type: String,
    required: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: true,
  },

  avatar: {
    public_id: {
      type: String,
      default: "temp_id",
    },

    url: {
      type: String,
      default: "temp_url",
    },
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
  },

  dob: {
    type: String,
    required: true,
  },

  maritalStatus: {
    type: String,
    enum: ["married", "single"],
    default: "single",
  },

  religion: {
    type: String,
  },

  nationality: {
    type: String,
  },

  jobTitle: {
    type: String,
  },

  role: {
    type: String,
    enum: ["marketing", "sales", "operations", "finance", "admin"],
    default: "marketing",
  },

  salary: {
    type: Number,
    default: 0,
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

schema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", schema);
