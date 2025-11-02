import express from "express";
import { db } from "../server.js";
const router = express.Router();

// Register Owner
router.post("/register-owner", (req, res) => {
  const { name, email, pet_type, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const sql = "INSERT INTO owners (name, email, pet_type, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, pet_type, password], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Owner registered successfully!" });
  });
});

// Register Clinic
router.post("/register-clinic", (req, res) => {
  const { name, email, phone, address, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const sql = "INSERT INTO clinics (name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, email, phone, address, password], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Clinic registered successfully!" });
  });
});

// Unified Login: Admin / Clinic / Owner
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  // Admin
  db.query("SELECT * FROM admins WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length && results[0].password === password)
      return res.json({ role: "admin", user: results[0] });

    // Clinic
    db.query("SELECT * FROM clinics WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (results.length && results[0].password === password)
        return res.json({ role: "clinic", user: results[0] });

      // Owner
      db.query("SELECT * FROM owners WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });
        if (!results.length) return res.status(404).json({ message: "User not found" });
        if (results[0].password !== password)
          return res.status(400).json({ message: "Invalid credentials" });
        return res.json({ role: "owner", user: results[0] });
      });
    });
  });
});

export default router;
