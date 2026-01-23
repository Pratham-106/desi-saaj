import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/* =========================
   PROTECT ROUTES (USER / ADMIN)
========================= */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔐 ADMIN TOKEN HANDLING
      if (decoded.isAdmin) {
        req.user = {
          _id: decoded.id,
          isAdmin: true,
        };
        return next();
      }

      // 👤 NORMAL USER
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
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

/* =========================
   ADMIN ONLY
========================= */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      message: "Admin access denied",
    });
  }
};
