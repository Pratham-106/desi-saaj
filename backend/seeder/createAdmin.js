import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@desisaaj.com" });

    if (adminExists) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    const adminUser = new User({
      name: "Admin",
      email: "admin@desisaaj.com",
      password: await bcrypt.hash("admin123", 10),
      isAdmin: true,
    });

    await adminUser.save();
    console.log("✅ Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
};

createAdmin();
