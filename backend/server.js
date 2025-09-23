const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://frontend-q3lx12ext-hridoy75hubs-projects.vercel.app',
        'https://your-custom-domain.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const memberRoutes = require('./routes/memberRoutes');
app.use('/api', memberRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'PSTU Entrepreneurship Club API is running 🚀',
        version: '1.0.0',
        endpoints: {
            members: '/api/members',
            join: '/api/join'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
