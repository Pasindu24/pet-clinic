// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const Clinic = require('./models/Clinic');
const Owner = require('./models/Owner');
const Admin = require('./models/Admin');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ','');
  if(!token) return res.status(401).json({message: 'No token'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch(err){
    res.status(401).json({message: 'Invalid token'});
  }
};

const requireRole = (role) => (req, res, next) => {
  if(!req.user) return res.status(401).json({message: 'Not authenticated'});
  if(req.user.role !== role) return res.status(403).json({message: 'Forbidden'});
  next();
};

module.exports = { auth, requireRole };
