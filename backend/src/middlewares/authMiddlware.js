// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

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
