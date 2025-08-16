// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ status: false, message: "Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      status: false,
      message: "Access denied !",
    });
  }
  next();
};

export const auth = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.split(" ")[1] : null;
    if (!token)
      return res.status(401).json({ status: false, message: "No token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userSchema.findById(payload.id).select("_id role");
    if (!req.user)
      return res.status(401).json({ status: false, message: "Invalid token" });
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired token" });
  }
};

export const allow =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: false, message: "Access denied" });
    }
    next();
  };
