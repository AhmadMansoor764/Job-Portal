import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerUser,
  login,
  googleLogin,
  completeProfile,
  checkEmail,
  getCurrentUser,
  verifyEmail,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);

router.post("/check-email", checkEmail);

router.post("/login", login);

router.get("/me", authMiddleware, getCurrentUser);

router.post("/google", googleLogin);

router.put("/complete-profile", authMiddleware, completeProfile);

export default router;
