import express from "express";
import { adminLogin } from "../controllers/adminController.js";

const router = express.Router();

/* =========================
   ADMIN LOGIN
========================= */
router.post("/login", adminLogin);

export default router;
