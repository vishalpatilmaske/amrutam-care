// controllers/doctor.controller.js
import doctorSchema from "../models/doctorSchema.js";
import dayjs from "dayjs";

// helper: find doctor by logged-in userId
const byUser = async (userId) => {
  const doc = await doctorSchema.findOne({ userId });
  if (!doc) throw new Error("Doctor profile not found");
  return doc;
};

// Doctor: profile
export const getMyDoctorProfile = async (req, res) => {
  try {
    const doc = await byUser(req.user._id);
    return res.json({ status: true, doctor: doc });
  } catch (e) {
    return res.status(404).json({ status: false, message: e.message });
  }
};

// Doctor: get availability for a date
export const getMyAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const doc = await byUser(req.user._id);

    if (!date)
      return res.json({ status: true, availability: doc.availability });

    const day = doc.availability.find((a) => a.date === date);
    return res.json({ status: true, availability: day || { date, slots: [] } });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Doctor: add one or many slots for a given date
// body: { date: "YYYY-MM-DD", slots: [{ time:"09:00 AM", duration:30 }, ...] }
export const addSlots = async (req, res) => {
  try {
    const { date, slots = [] } = req.body;
    if (!date || !slots.length) {
      return res
        .status(400)
        .json({ status: false, message: "date & slots required" });
    }
    const doc = await byUser(req.user._id);

    let day = doc.availability.find((a) => a.date === date);
    if (!day) {
      day = { date, slots: [] };
      doc.availability.push(day);
    }

    // Simple dedupe by time
    const existingTimes = new Set(day.slots.map((s) => s.time));
    slots.forEach((s) => {
      if (!existingTimes.has(s.time)) {
        day.slots.push({
          time: s.time,
          duration: s.duration || 30,
          isBooked: false,
          lockedUntil: null,
          lockedBy: null,
        });
      }
    });

    await doc.save();
    return res.json({
      status: true,
      message: "Slots added",
      availability: day,
    });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Doctor: delete one slot by slotId on a date
export const deleteSlot = async (req, res) => {
  try {
    const { date, slotId } = req.params;
    const doc = await byUser(req.user._id);
    const idx = doc.availability.findIndex((a) => a.date === date);
    if (idx === -1)
      return res.status(404).json({ status: false, message: "Date not found" });

    const before = doc.availability[idx].slots.length;
    doc.availability[idx].slots = doc.availability[idx].slots.filter(
      (s) => `${s._id}` !== slotId
    );
    if (before === doc.availability[idx].slots.length) {
      return res.status(404).json({ status: false, message: "Slot not found" });
    }
    await doc.save();
    return res.json({ status: true, message: "Slot deleted" });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};

// Users: get only AVAILABLE slots for a doctor on a date
export const getDoctorAvailableSlotsForUsers = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // required
    if (!date)
      return res
        .status(400)
        .json({ status: false, message: "date is required" });

    const doc = await Doctor.findById(doctorId);
    if (!doc)
      return res
        .status(404)
        .json({ status: false, message: "Doctor not found" });

    const day = doc.availability.find((a) => a.date === date);
    if (!day) return res.json({ status: true, slots: [] });

    const now = dayjs();
    const free = day.slots.filter((s) => {
      const lockExpired = !s.lockedUntil || dayjs(s.lockedUntil).isBefore(now);
      return !s.isBooked && lockExpired;
    });

    // sort by soonest (optional: convert "09:00 AM" to comparable)
    const to24 = (t) => dayjs(t, ["hh:mm A"]).format("HH:mm");
    free.sort((a, b) => (to24(a.time) < to24(b.time) ? -1 : 1));

    return res.json({ status: true, slots: free });
  } catch (e) {
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
