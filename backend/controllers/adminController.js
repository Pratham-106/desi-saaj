import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/* ============================
   ADMIN LOGIN
   POST /api/admin/login
============================ */
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@desisaaj.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { id: "admin-id", isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Admin login successful",
      token,
    });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
};

/* ============================
   GET ALL USERS (ADMIN ONLY)
   GET /api/users
============================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/* ============================
   DELETE USER (ADMIN ONLY)
   DELETE /api/users/:id
============================ */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Safety: Prevent deleting admin users
    if (user.isAdmin) {
      return res.status(400).json({
        message: "Cannot delete admin user",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
