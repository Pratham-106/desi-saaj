import jwt from "jsonwebtoken";

/* 🔐 ADMIN LOGIN */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // TEMP HARDCODED ADMIN (as agreed)
    if (email === "admin@desisaaj.com" && password === "admin123") {
      const token = jwt.sign(
        { id: "admin-id", isAdmin: true },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d", // ✅ optional but recommended
        }
      );

      return res.status(200).json({
        _id: "admin-id",
        email,
        isAdmin: true,
        token,
      });
    }

    return res.status(401).json({
      message: "Invalid admin credentials",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Admin login failed",
    });
  }
};
