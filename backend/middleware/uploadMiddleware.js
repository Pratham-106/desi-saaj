import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/* ✅ Cloudinary Config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ✅ Cloudinary Storage */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "desisaaj-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

/* ✅ Multer Upload Setup */
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // ✅ 2MB max (Render Safe)
  },
});

export default upload;
