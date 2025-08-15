import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import DoctorSchema from "../models/doctorSchema.js";

// signup user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// get user
export const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.json({
      status: true,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      mode,
      experience,
      consultationFee,
      bio,
      phone,
      clinicAddress,
    } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }

    // Create user account with role "doctor"
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    // Create doctor profile linked to userId
    const newDoctor = await DoctorSchema.create({
      userId: newUser._id,
      specialization,
      mode,
      experience,
      consultationFee,
      bio,
      phone,
      clinicAddress,
      availability: [],
    });

    res.status(201).json({
      status: true,
      message: "Doctor created successfully",
      data: { user: newUser, doctor: newDoctor },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
};

// get all doctors data
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorSchema.find().populate(
      "userId",
      "name email role"
    );

    res.status(200).json({
      status: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error while fetching doctors",
      error: error.message,
    });
  }
};
