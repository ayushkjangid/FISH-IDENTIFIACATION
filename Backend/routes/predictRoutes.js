import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { runPrediction, getUserPredictions } from '../controllers/predictController.js';
import multer from 'multer';
import os from 'os';

import fs from 'fs';

const router = express.Router();
const tempDir = 'E:\\fish_app_temp';

// Ensure temp dir exists
if (!fs.existsSync(tempDir)) {
    try {
        fs.mkdirSync(tempDir, { recursive: true });
    } catch (err) {
        console.error("Failed to create temp dir on E:, uploads might fail if C: is full", err);
    }
}

const upload = multer({ dest: tempDir }); // temp storage on E: drive

// protected prediction endpoint
router.get('/history', verifyToken, getUserPredictions);
router.post('/', verifyToken, upload.single('image'), runPrediction);

export default router;
