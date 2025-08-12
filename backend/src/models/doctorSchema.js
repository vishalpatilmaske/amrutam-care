import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true }, // start time "09:00 AM"
  duration: { type: Number, enum: [30, 60, 90, 120], default: 30 }, // in minutes
  isBooked: { type: Boolean, default: false },
  lockedUntil: { type: Date, default: null },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true }, // "YYYY-MM-DD"
  slots: [slotSchema],
});

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: { type: String, required: true },
    mode: { type: String, enum: ["online", "in-person"], required: true },
    availability: [availabilitySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
