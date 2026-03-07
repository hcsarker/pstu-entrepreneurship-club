const TeamMember = require('../models/TeamMember');
const Advisor = require('../models/Advisor');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../middleware/auth');

// Auth: login admin
async function adminLogin(req, res){
  try{
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ success:false, message:'Missing credentials' });
    const user = await AdminUser.findOne({ username });
    if(!user) return res.status(401).json({ success:false, message:'Invalid credentials' });
    const ok = await user.verifyPassword(password);
    if(!ok) return res.status(401).json({ success:false, message:'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '8h' });
    res.json({ success:true, token });
  } catch(err){
    console.error('Admin login error', err);
    res.status(500).json({ success:false, message:'Login failed' });
  }
}

// Create initial admin (dev only or with ADMIN_SETUP_KEY)
async function setupAdmin(req, res){
  try{
    const allow = process.env.NODE_ENV !== 'production' || (!!process.env.ADMIN_SETUP_KEY && req.query.key === process.env.ADMIN_SETUP_KEY);
    if(!allow) return res.status(403).json({ success:false, message:'Setup disabled' });
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({ success:false, message:'Missing username/password' });
    const existing = await AdminUser.findOne({ username });
    if(existing) return res.status(409).json({ success:false, message:'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({ username, passwordHash: hash });
    res.json({ success:true, user: { id: user._id, username: user.username } });
  } catch(err){ console.error('setup admin', err); res.status(500).json({ success:false }); }
}

// TEAM CRUD
const listTeam = async (req, res) => {
  try{
    const items = await TeamMember.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success:true, count: items.length, items });
  } catch(err){
    console.error(err); res.status(500).json({ success:false });
  }
};

const createTeam = async (req, res) => {
  try{
    const doc = await TeamMember.create(req.body);
    res.json({ success:true, item: doc });
  } catch(err){ console.error(err); res.status(500).json({ success:false, message:'Create failed' }); }
};

const updateTeam = async (req, res) => {
  try{
    const id = req.params.id;
    const doc = await TeamMember.findByIdAndUpdate(id, req.body, { new:true });
    res.json({ success:true, item: doc });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
};

const deleteTeam = async (req, res) => {
  try{
    const id = req.params.id;
    await TeamMember.findByIdAndDelete(id);
    res.json({ success:true });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
};

// ADVISOR CRUD
const listAdvisors = async (req, res) => {
  try{
    const items = await Advisor.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success:true, count: items.length, items });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
};

const createAdvisor = async (req, res) => {
  try{
    const doc = await Advisor.create(req.body);
    res.json({ success:true, item: doc });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
};

const updateAdvisor = async (req, res) => {
  try{
    const id = req.params.id;
    const doc = await Advisor.findByIdAndUpdate(id, req.body, { new:true });
    res.json({ success:true, item: doc });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
};

const deleteAdvisor = async (req, res) => {
  try{
    const id = req.params.id;
    await Advisor.findByIdAndDelete(id);
    res.json({ success:true });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
};

module.exports = {
  adminLogin,
  setupAdmin,
  listTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  listAdvisors,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor
};
