import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/* =========================
   PROTECT ROUTES (USER)
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

      // Handle admin token (id: "admin-id")
      if (decoded.id === "admin-id") {
        req.user = { _id: "admin-id", isAdmin: true };
      } else {
        req.user = await User.findById(decoded.id).select("-password");
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

/* =========================
   ADMIN ONLY
========================= */
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access denied" });
  }
};
