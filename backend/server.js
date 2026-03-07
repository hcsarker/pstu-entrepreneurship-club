const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
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
        'http://localhost:5000',
        'https://frontend-q3lx12ext-hridoy75hubs-projects.vercel.app',
        // Production domains
        'https://www.pstuec.com',
        'https://api.pstuec.com',
        'https://pstuec.com'
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
// Env check that bypasses DB gate (placed before requireDb)
app.get('/api/env-check', (req, res) => {
    res.json({
        hasMongoUri: !!process.env.MONGO_URI,
        nodeEnv: process.env.NODE_ENV || 'development',
        vercel: !!process.env.VERCEL
    });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection with in-memory fallback for development
async function connectDatabase() {
    const uri = process.env.MONGO_URI;
    try {
        if (uri) {
            await mongoose.connect(uri);
            console.log('✅ MongoDB connected successfully!');
            app.locals.dbReady = true;
            return;
        }
        throw new Error('MONGO_URI not provided');
    } catch (err) {
        const canUseMemory = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
        if (!canUseMemory) {
            console.error('❌ MongoDB connection failed and in-memory DB is disabled in this environment.');
            app.locals.dbReady = false;
            // Do not throw to avoid crashing the serverless function.
            return;
        }
        console.warn('⚠️ MongoDB connection failed, enabling in-memory fallback:', err.message || err);
        try {
            const mongod = await MongoMemoryServer.create({
                binary: { version: '7.0.3' }
            });
            const memUri = mongod.getUri();
            await mongoose.connect(memUri);
            app.locals.mongod = mongod;
            console.log('🧪 In-memory MongoDB started for development.');
            app.locals.dbReady = true;
        } catch (memErr) {
            console.error('❌ Failed to start in-memory MongoDB:', memErr);
            app.locals.dbReady = false;
        }
    }
}

// Require DB connection for API routes in production/Vercel
const requireDb = (req, res, next) => {
    const ready = mongoose.connection && mongoose.connection.readyState === 1;
    if (!ready) {
        return res.status(503).json({
            error: 'Database not connected',
            message: 'The API is temporarily unavailable. Ensure MONGO_URI is set in the environment and accessible from Vercel.',
            hint: 'Vercel → Project → Settings → Environment Variables → MONGO_URI'
        });
    }
    next();
};
app.use('/api', requireDb);

// Public integrations that don't require DB
const youtubeRoutes = require('./routes/youtubeRoutes');
// Allow permissive CORS on integrations (feeds) so static frontends can fetch without strict origin list
app.use('/integrations', cors(), youtubeRoutes);

connectDatabase();

// Routes
const memberRoutes = require('./routes/memberRoutes');
const contentRoutes = require('./routes/contentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const api = require('./api');
app.use('/api', memberRoutes);
app.use('/api/content', contentRoutes);
app.use('/api', registrationRoutes);
// Admin routes (authentication required)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

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
        uptime: process.uptime(),
        dbReady: mongoose.connection ? mongoose.connection.readyState === 1 : false
    });
});

// 404 handler (Express 5 compatible)
app.use((req, res) => {
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

// In Vercel, export the handler instead of listening
if (process.env.VERCEL) {
    module.exports = app;
} else {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Graceful shutdown for in-memory MongoDB
process.on('SIGINT', async () => {
    if (app.locals.mongod) {
        await app.locals.mongod.stop();
        console.log('🧹 In-memory MongoDB stopped');
    }
    process.exit(0);
});
