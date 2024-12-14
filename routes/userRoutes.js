import express from "express";
import {
  deleteUser,
  login,
  logout,
  register,
  updateUser,
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/register", isAuthenticated, isAuthorized("admin"), register);
router.put("/user/:id", isAuthenticated, isAuthorized("admin"), updateUser);
router.delete("/user/:id", isAuthenticated, isAuthorized("admin"), deleteUser);

export default router;
