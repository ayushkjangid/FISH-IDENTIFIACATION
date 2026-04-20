import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../middleware/authMiddleware.js';
import { handleUpload } from '../controllers/uploadController.js';

import fs from 'fs';

const router = express.Router();
const uploadDir = 'E:\\fish_app_uploads';

if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create upload dir on E:", err);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('image'), handleUpload);

export default router;
