const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// API test
app.get('/api/hello', (req, res) => {
    res.json({ 
        message: 'Backend is running successfully!',
        timestamp: new Date().toISOString()
    });
});

// Student routes
app.use('/api', studentRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   GET    /api/hello`);
    console.log(`   GET    /api/students`);
    console.log(`   POST   /api/students`);
    console.log(`   PUT    /api/students/:id`);
    console.log(`   DELETE /api/students/:id`);
});