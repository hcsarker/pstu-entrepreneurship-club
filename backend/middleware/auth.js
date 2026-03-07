const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireAuth(req, res, next){
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success:false, message:'Missing authorization' });
  const token = auth.slice(7);
  try{
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch(err){
    return res.status(401).json({ success:false, message:'Invalid or expired token' });
  }
}

module.exports = { requireAuth, jwtSecret };
