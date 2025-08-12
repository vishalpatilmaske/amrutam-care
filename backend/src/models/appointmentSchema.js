import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slot: {
      date: { type: String, required: true },
      time: { type: String, required: true }, // start time
      duration: { type: Number, enum: [30, 60, 90, 120], default: 30 }, // in minutes
    },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
    },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
