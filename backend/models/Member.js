const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    studentId: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    year: {
        type: String,
        trim: true
    },
    interests: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create index for faster queries
memberSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Member', memberSchema);
