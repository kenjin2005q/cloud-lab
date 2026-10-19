const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Cho phép CORS linh hoạt
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Health Check Endpoint (PHẢI ĐẶT TRÊN CÁC ROUTE KHÁC VÀ TRÊN 404 HANDLER)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API test
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Backend is running successfully v2.0!",
    timestamp: new Date().toISOString(),
  });
});

// Student routes
app.use("/api", studentRoutes);

// 404 handler (Luôn đặt ở phía dưới cùng các routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler (Cũng đặt ở dưới cùng)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   GET    /health`);
  console.log(`   GET    /api/hello`);
  console.log(`   GET    /api/students`);
  console.log(`   POST   /api/students`);
  console.log(`   PUT    /api/students/:id`);
  console.log(`   DELETE /api/students/:id`);
});
