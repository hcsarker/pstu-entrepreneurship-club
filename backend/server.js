const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
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

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter basic
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', apiLimiter);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const memberRoutes = require('./routes/memberRoutes');
const contentRoutes = require('./routes/contentRoutes');
app.use('/api', memberRoutes);
app.use('/api/content', contentRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'PSTU Entrepreneurship Club API is running 🚀',
        version: '1.0.0',
        endpoints: {
            members: '/api/members',
            join: '/api/join',
            events: '/api/content/events',
            products: '/api/content/products',
            posts: '/api/content/posts',
            startups: '/api/content/startups',
            team: '/api/content/team'
        },
        docs: 'Add documentation endpoint in future'
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
