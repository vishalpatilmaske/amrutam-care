import express from "express";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api", appointmentRoutes);

export default app;
