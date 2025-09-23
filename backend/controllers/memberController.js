const Member = require('../models/Member');

const joinClub = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            studentId,
            department, 
            phone,
            year,
            interests,
            experience,
            message 
        } = req.body;

        // Basic validation
        if (!name || !email || !department || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: name, email, department, and message' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Check if member already exists
        const existingMember = await Member.findOne({ email: email.toLowerCase() });
        if (existingMember) {
            return res.status(409).json({ 
                success: false, 
                message: 'A member with this email address already exists' 
            });
        }

        // Create new member
        const memberData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            department: department.trim(),
            message: message.trim()
        };

        // Add optional fields if provided
        if (studentId) memberData.studentId = studentId.trim();
        if (phone) memberData.phone = phone.trim();
        if (year) memberData.year = year.trim();
        if (interests) memberData.interests = interests.trim();
        if (experience) memberData.experience = experience.trim();

        const newMember = new Member(memberData);
        await newMember.save();

        res.status(201).json({ 
            success: true, 
            message: 'Application submitted successfully! We will contact you soon.',
            member: {
                name: newMember.name,
                email: newMember.email,
                department: newMember.department,
                createdAt: newMember.createdAt
            }
        });

    } catch (error) {
        console.error('Member registration error:', error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: 'A member with this email address already exists' 
            });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Please check your input data and try again',
                details: error.message
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Unable to process your application. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all members (for future admin functionality)
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find()
            .select('-__v')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: members.length,
            members
        });
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch members'
        });
    }
};

module.exports = { joinClub, getAllMembers };
