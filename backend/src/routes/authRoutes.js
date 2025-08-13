import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/me", getUser);

export default router;
