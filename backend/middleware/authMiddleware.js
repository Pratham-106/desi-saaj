import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/* ============================
   ✅ PROTECT ROUTES (USER + ADMIN)
============================ */
export const protect = async (req, res, next) => {
  let token;

  // ✅ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Get user from MongoDB (Admin is also stored here)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found, token invalid",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

/* ============================
   ✅ ADMIN ONLY MIDDLEWARE
============================ */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(403).json({
      message: "Admin access denied",
    });
  }
};
