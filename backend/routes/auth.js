// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const Clinic = require('./models/Clinic');
const Owner = require('../models/Owner');
const Admin = require('./models/Admin');

// register owner
Router.post('/register-owner', async (req,res)=>{
  const { name, email, password, phone, petType } = req.body;
  if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
  try {
    const existing = await Owner.findOne({email});
    if(existing) return res.status(400).json({message:'Email exists'});
    const hash = await bcrypt.hash(password, 10);
    const owner = new Owner({ name, email, passwordHash:hash, phone, petType});
    await owner.save();
    res.json({message:'Owner registered'});
  } catch(err){ res.status(500).json({message:err.message}); }
});

// clinic registration request (pending)
Router.post('/register-clinic', async (req,res)=>{
  const { name, email, password, phone, address, regNumber, specialization } = req.body;
  if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
  try {
    const existing = await Clinic.findOne({email});
    if(existing) return res.status(400).json({message:'Email exists'});
    const hash = await bcrypt.hash(password, 10);
    const clinic = new Clinic({ name, email, passwordHash:hash, phone, address, regNumber, specialization, status:'pending' });
    await clinic.save();
    res.json({message:'Clinic registration request sent'});
  } catch(err){ res.status(500).json({message:err.message}); }
});

// generic login for owner/clinic/admin
Router.post('/login', async (req,res)=>{
  const { email, password, role } = req.body;
  if(!email || !password || !role) return res.status(400).json({message:'Missing fields'});
  try {
    if(role === 'admin'){
      const admin = await Admin.findOne({username: email});
      if(!admin) return res.status(400).json({message:'Admin not found'});
      const ok = await bcrypt.compare(password, admin.passwordHash);
      if(!ok) return res.status(400).json({message:'Invalid credentials'});
      const token = jwt.sign({ id: admin._id, role:'admin', email: admin.username }, process.env.JWT_SECRET, { expiresIn:'8h' });
      return res.json({ token, role:'admin' });
    } else if(role === 'clinic'){
      const clinic = await Clinic.findOne({email});
      if(!clinic) return res.status(400).json({message:'Clinic not found'});
      if(clinic.status !== 'approved') return res.status(403).json({message:'Clinic not approved'});
      const ok = await bcrypt.compare(password, clinic.passwordHash);
      if(!ok) return res.status(400).json({message:'Invalid credentials'});
      const token = jwt.sign({ id: clinic._id, role:'clinic', email: clinic.email }, process.env.JWT_SECRET, { expiresIn:'8h' });
      return res.json({ token, role:'clinic' });
    } else if(role === 'owner'){
      const owner = await Owner.findOne({email});
      if(!owner) return res.status(400).json({message:'Owner not found'});
      const ok = await bcrypt.compare(password, owner.passwordHash);
      if(!ok) return res.status(400).json({message:'Invalid credentials'});
      const token = jwt.sign({ id: owner._id, role:'owner', email: owner.email }, process.env.JWT_SECRET, { expiresIn:'8h' });
      return res.json({ token, role:'owner' });
    } else {
      res.status(400).json({message:'Invalid role'});
    }
  } catch(err){ res.status(500).json({message:err.message}); }
});

module.exports = Router;
