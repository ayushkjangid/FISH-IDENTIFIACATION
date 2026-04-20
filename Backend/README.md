AAIDES Server Skeleton
======================

This is a Node.js + Express backend skeleton for the AAIDES project.

Features:
- Express server
- Firebase Admin SDK integration (token verification)
- Multer file upload for images
- MongoDB (mongoose) connection scaffold
- Route/controllers/middleware structure
- Mock prediction endpoint (replace with real model integration)

Quick start:
1. Copy this folder to your machine.
2. Run: npm install
3. Create a file .env with the variables from .env.example
4. Start dev server: npm run dev

Endpoints:
- GET  /                       -> health
- POST /auth/verify            -> verify token
- POST /upload                -> upload image (protected)
- POST /predict               -> mock predict (protected/internal)
- GET  /results/:userId       -> get user results (protected)
- GET  /admin/users           -> admin only (protected)

