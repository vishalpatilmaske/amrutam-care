import express from "express";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api", authRoutes);

export default app;
