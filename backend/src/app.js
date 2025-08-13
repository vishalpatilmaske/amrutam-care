import express from "express";
import router from "./routes/authRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api", router);

export default app;
