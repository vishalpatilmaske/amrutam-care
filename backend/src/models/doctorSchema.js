import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  time: { type: String, required: true },
  duration: { type: Number, enum: [30, 60, 90, 120], default: 30 },
  isBooked: { type: Boolean, default: false },
  lockedUntil: { type: Date, default: null },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const availabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
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
    experience: { type: Number, required: true },
    consultationFee: { type: Number, required: true },
    bio: { type: String },
    phone: { type: String, required: true },
    clinicAddress: { type: String },
    availability: [availabilitySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);
