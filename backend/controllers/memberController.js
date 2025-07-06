const Member = require('../models/Member');

const joinClub = async (req, res) => {
    try {
        const { name, email, department, message } = req.body;

        const newMember = new Member({ name, email, department, message });
        await newMember.save();

        res.status(201).json({ success: true, message: 'Member registered successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

module.exports = { joinClub };
