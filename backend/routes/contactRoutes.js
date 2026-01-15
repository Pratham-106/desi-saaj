import express from "express";
import {
  submitContactForm,
  getAllMessages,
  deleteMessage,
} from "../controllers/contactController.js";


const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post("/", submitContactForm);

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages
 * @access  Admin (we’ll protect later)
 */
router.get("/", getAllMessages);

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact message
 * @access  Admin
 */
router.delete("/:id", deleteMessage);


export default router;
