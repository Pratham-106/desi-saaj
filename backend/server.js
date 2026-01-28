import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

// ✅ Connect Database
connectDB();

const app = express();

/* ============================
   ✅ Middleware
============================ */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://desi-saaj.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ============================
   ✅ Serve Uploads Folder (Render Safe)
============================ */

// ✅ ESM Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Public Uploads Access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================
   ✅ API Routes
============================ */
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

/* ============================
   Root Test Route
============================ */
app.get("/", (req, res) => {
  res.send("✅ Desi Saaj API is running...");
});

/* ============================
   Start Server
============================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
