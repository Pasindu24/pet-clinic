import express from "express";
import { db } from "../server.js"; // now works because db is exported
const router = express.Router();

// GET all clinics
router.get("/clinics", (req, res) => {
  db.query("SELECT * FROM clinics", (err, rows) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(rows);
  });
});

// PUT update clinic status (approve/reject)
router.put("/clinics/:id", (req, res) => {
  const { status } = req.body;
  db.query(
    "UPDATE clinics SET status=? WHERE id=?",
    [status, req.params.id],
    (err) => {
      if (err) {
        console.error("❌ DB error:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Clinic status updated" });
    }
  );
});

// GET all owners
router.get("/owners", (req, res) => {
  db.query("SELECT * FROM owners", (err, rows) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(rows);
  });
});

export default router;
