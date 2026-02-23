import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validate.middleware";
import { register, login, getMe, logout } from "../controllers/auth.controller";
const router = Router();

// POST /api/v1/auth/register
router.post("/register", validateRegister, register);

// POST /api/v1/auth/login
router.post("/login", validateLogin, login);

// GET /api/v1/auth/me
router.get("/me", protect, getMe);

// POST /api/v1/auth/logout
router.post("/logout", protect, logout);

export default router;
