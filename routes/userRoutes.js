import express from "express";
import { login, logout } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

export default router;
