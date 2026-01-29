import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ============================
   ✅ ADMIN LOGIN (REAL)
   POST /api/admin/login
============================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find user in DB
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // ✅ Must be admin
    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: adminUser._id,
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      isAdmin: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Admin login failed",
      error: error.message,
    });
  }
};
