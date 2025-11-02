// backend/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await Admin.findOne({username:'admin'});
  if(existing){ console.log('admin exists'); process.exit(); }
  const hash = await bcrypt.hash('admin123', 10);
  const a = new Admin({ username:'admin', passwordHash: hash, email:'admin@petclinic.local' });
  await a.save();
  console.log('Admin created: username=admin password=admin123');
  process.exit();
}
seed();
