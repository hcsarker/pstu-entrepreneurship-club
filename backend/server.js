const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas connected successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Default route
app.get('/', (req, res) => {
    res.send('PSTU Entrepreneurship Club API is running 🚀');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const memberRoutes = require('./routes/memberRoutes');
app.use('/api', memberRoutes);
