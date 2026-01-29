import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/userModel.js";

dotenv.config({ path: "./.env" });
connectDB();

const createAdmin = async () => {
  const exists = await User.findOne({ email: "admin@desisaaj.com" });

  if (exists) {
    console.log("✅ Admin already exists");
    process.exit();
  }

  const adminUser = new User({
    name: "Admin",
    email: "admin@desisaaj.com",
    password: "admin123",
    isAdmin: true,
  });

  await adminUser.save();

  console.log("✅ Admin created successfully!");
  process.exit();
};

createAdmin();
