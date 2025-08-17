// controllers/appointment.controller.js
import dayjs from "dayjs";
import doctorSchema from "../models/doctorSchema.js";
import appointmentSchema from "../models/appointmentSchema.js";

// body: { doctorId, date:"YYYY-MM-DD", time:"09:00 AM", duration }
export const lockSlot = async (req, res) => {
  try {
    const { doctorId, date, time, duration } = req.body;
    const doc = await doctorSchema.findById(doctorId);
    if (!doc)
      return res
        .status(404)
        .json({ status: false, message: "Doctor not found" });

    const day = doc.availability.find((a) => a.date === date);
    if (!day)
      return res
        .status(404)
        .json({ status: false, message: "No availability for date" });

    const slot = day.slots.find(
      (s) => s.time === time && s.duration === Number(duration || 30)
    );
    if (!slot)
      return res.status(404).json({ status: false, message: "Slot not found" });

    const now = dayjs();
    const lockExpired =
      !slot.lockedUntil || dayjs(slot.lockedUntil).isBefore(now);

    if (
      slot.isBooked ||
      (!lockExpired && `${slot.lockedBy}` !== `${req.user._id}`)
    ) {
      return res
        .status(409)
        .json({ status: false, message: "Slot already taken/locked" });
    }

    // lock for 5 minutes
    slot.lockedUntil = now.add(5, "minute").toDate();
    slot.lockedBy = req.user._id;
    await doc.save();

    return res.json({ status: true, message: "Slot locked for 5 minutes" });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// body: { doctorId, date, time, duration }
export const confirmBooking = async (req, res) => {
  try {
    const { doctorId, date, time, duration } = req.body;
    const doc = await DoctorSchema.findById(doctorId);
    if (!doc)
      return res
        .status(404)
        .json({ status: false, message: "Doctor not found" });

    const day = doc.availability.find((a) => a.date === date);
    if (!day)
      return res
        .status(404)
        .json({ status: false, message: "No availability for date" });

    const slot = day.slots.find(
      (s) => s.time === time && s.duration === Number(duration || 30)
    );
    if (!slot)
      return res.status(404).json({ status: false, message: "Slot not found" });

    const now = dayjs();
    const lockValid =
      slot.lockedBy &&
      `${slot.lockedBy}` === `${req.user._id}` &&
      slot.lockedUntil &&
      dayjs(slot.lockedUntil).isAfter(now);
    if (!lockValid || slot.isBooked) {
      return res
        .status(409)
        .json({ status: false, message: "Slot not locked by you or expired" });
    }

    // mark booked and clear lock
    slot.isBooked = true;
    slot.lockedUntil = null;
    slot.lockedBy = null;
    await doc.save();

    const appt = await appointmentSchema.create({
      userId: req.user._id,
      doctorId: doc._id,
      slot: { date, time, duration: Number(duration || 30) },
      status: "booked",
    });

    return res.json({
      status: true,
      message: "Appointment booked",
      appointment: appt,
    });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// body: { doctorId, date, time, duration }
export const releaseSlot = async (req, res) => {
  try {
    const { doctorId, date, time, duration } = req.body;
    const doc = await DoctorSchema.findById(doctorId);
    if (!doc)
      return res
        .status(404)
        .json({ status: false, message: "Doctor not found" });

    const day = doc.availability.find((a) => a.date === date);
    if (!day)
      return res
        .status(404)
        .json({ status: false, message: "No availability for date" });

    const slot = day.slots.find(
      (s) => s.time === time && s.duration === Number(duration || 30)
    );
    if (!slot)
      return res.status(404).json({ status: false, message: "Slot not found" });

    // Only the same user who locked it can release early
    if (`${slot.lockedBy}` !== `${req.user._id}`) {
      return res.status(403).json({ status: false, message: "Not your lock" });
    }

    slot.lockedUntil = null;
    slot.lockedBy = null;
    await doc.save();

    return res.json({ status: true, message: "Slot released" });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
