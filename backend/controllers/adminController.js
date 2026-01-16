import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // TEMP HARDCODED (as you wanted)
  if (email === "admin@desisaaj.com" && password === "admin123") {
    const token = jwt.sign(
      { id: "admin-id", isAdmin: true },
      process.env.JWT_SECRET
    );

    return res.json({
      _id: "admin-id",
      email,
      isAdmin: true,
      token,
    });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
};
