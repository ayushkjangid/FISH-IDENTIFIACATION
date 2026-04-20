# Fish Identification Project

A comprehensive system for fish species identification using deep learning, featuring a React frontend, Node.js backend, and a specialized ML service.

## Project Structure

- **Frontend**: Vite + React application for the user interface.
- **Backend**: Express.js server handling authentication, stats, and API orchestration.
- **ML_Service**: Python-based service running YOLOv8 and MobileNet for fish detection and classification.

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.10+)
- MongoDB (Atlas or local)
- Firebase Account (for authentication/storage)

### Setup

1. **Backend**:
   ```bash
   cd Backend
   npm install
   # Configure .env with MONGO_URI, FIREBASE_CONFIG, etc.
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **ML Service**:
   ```bash
   cd ML_Service
   pip install -r requirements.txt
   python main.py
   ```

## Key Technologies

- **Frontend**: React, Vite, Framer Motion, Axios, Recharts.
- **Backend**: Node.js, Express, Mongoose, Firebase Admin.
- **ML**: Python, TensorFlow/Keras (MobileNetV2), Ultralytics (YOLOv8).

## Repository

[GitHub Repository](https://github.com/ayushkjangid/FISH-IDENTIFIACATION)
