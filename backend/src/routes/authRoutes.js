import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  createDoctor,
  getAllUsers,
  getAllDoctors,
} from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import validateRequest from "../middlewares/validateRequest.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddlware.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/me", getUser);

router.post("/doctors", isAuthenticated, isAdmin, createDoctor);
router.get("/doctors", isAuthenticated, getAllDoctors);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);

export default router;
