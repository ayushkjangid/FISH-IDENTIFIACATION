import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cluster from "cluster";
import os from "os";

import authRoutes from "./routes/authRoutes.js";
import predictRoutes from "./routes/predictRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

} else {

  // ✅ CORS Configuration
  app.use(cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin.endsWith(".netlify.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }));

  app.options("*", cors());

  // ✅ Middleware
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  // ✅ Health Check Route
  app.get("/", (req, res) => {
    res.send("AAIDES Backend API is running 🚀");
  });

  // ✅ API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/predict", predictRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/stats", statsRoutes);

  // ✅ MongoDB Connection
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "user",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log(`✅ Connected to MongoDB: user (Worker ${process.pid})`);
    })
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
    });

  // ✅ Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT} (Worker ${process.pid})`);
  });
}
