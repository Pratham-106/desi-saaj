import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/* ============================
   ✅ ADMIN LOGIN
   POST /api/admin/login
============================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find Admin User
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // ✅ Must be Admin
    if (!adminUser.isAdmin) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    // ✅ Password Match
    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate Token
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

/* ============================
   ✅ GET ALL USERS (ADMIN)
   GET /api/admin/users
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
   ✅ DELETE USER (ADMIN)
   DELETE /api/admin/users/:id
============================ */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Prevent deleting admin itself
    if (user.isAdmin) {
      return res.status(400).json({
        message: "Cannot delete admin user",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully ✅",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
