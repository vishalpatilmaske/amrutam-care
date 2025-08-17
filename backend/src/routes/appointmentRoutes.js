// routes/appointment.routes.js
import { Router } from "express";
import { auth, allow } from "../middlewares/authMiddlware.js";
import {
  lockSlot,
  confirmBooking,
  releaseSlot,
} from "../controllers/appointmentController.js";

const router = Router();

router.post("/lock", lockSlot);
router.post("/confirm", auth, allow("user"), confirmBooking);
router.post("/release", auth, allow("user"), releaseSlot);

export default router;
