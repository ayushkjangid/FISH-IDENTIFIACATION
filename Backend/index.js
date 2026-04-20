import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import predictRoutes from "./routes/predictRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker on death
  });
} else {
  // ✅ Middleware
  app.use(cors({
    origin: ["http://localhost:5173", "https://aaides.netlify.app"], // Allow your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));
  app.use(express.json());
  app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

  // ✅ Test route
  app.get("/", (req, res) => {
    res.send("AAIDES Backend API is running 🚀");
  });

  // ✅ Auth routes
  app.use("/api/auth", authRoutes);
  app.use("/api/predict", predictRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/stats", statsRoutes);

  // ✅ MongoDB connection
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "user", // 👈 ensure this matches your database name in MongoDB Compass
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log(`✅ Connected to MongoDB: user (Worker ${process.pid})`))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

  // ✅ Server start
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT} (Worker ${process.pid})`));
}
