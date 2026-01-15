import multer from "multer";
import path from "path";

// ==============================
// STORAGE CONFIG
// ==============================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ==============================
// FILE FILTER (IMAGES ONLY)
// ==============================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ==============================
// MULTER INSTANCE
// ==============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    files: 5,                 // ⬅️ MAX 5 IMAGES
    fileSize: 5 * 1024 * 1024 // ⬅️ 5MB PER IMAGE
  },
});

export default upload;
