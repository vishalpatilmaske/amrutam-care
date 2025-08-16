import { Router } from "express";
import { auth, allow } from "../middlewares/authMiddlware.js";
import {
  getMyDoctorProfile,
  getMyAvailability,
  addSlots,
  deleteSlot,
  getDoctorAvailableSlotsForUsers,
} from "../controllers/doctorController.js";

const router = Router();

router.get("/me", auth, allow("doctor"), getMyDoctorProfile);
router.get("/me/availability", auth, allow("doctor"), getMyAvailability);
router.post("/me/availability/slots", auth, allow("doctor"), addSlots);
router.delete(
  "/me/availability/slots/:date/:slotId",
  auth,
  allow("doctor"),
  deleteSlot
);

router.get(
  "/:doctorId/availability",
  auth,
  allow("user", "admin", "doctor"),
  getDoctorAvailableSlotsForUsers
);

export default router;
