// routes/queries.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all queries (with optional responses)
router.get("/all", (req, res) => {
  const sql = "SELECT * FROM queries"; // simple test query

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching queries:", err); // show error in backend terminal
      return res.status(500).json({ error: err.message }); // show error in frontend
    }

    console.log("Fetched queries:", result.length);
    res.json(result);
  });
});


// ✅ Get clinic-specific report (includes owners and responses)
router.get("/report", (req, res) => {
  const { clinic_id } = req.query;

  if (!clinic_id) {
    return res.status(400).json({ message: "Missing clinic_id" });
  }

  const sql = `
    SELECT 
      q.id AS query_id,
      o.name AS owner_name,
      o.email AS owner_email,
      q.title AS question_title,
      q.description AS question_description,
      r.response_text AS clinic_response,
      r.date_posted AS response_date
    FROM queries q
    JOIN owners o ON q.owner_id = o.id
    LEFT JOIN responses r 
      ON q.id = r.query_id AND r.clinic_id = ?
    ORDER BY r.date_posted DESC, q.date_posted DESC
  `;

  db.query(sql, [clinic_id], (err, results) => {
    if (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Clinic responds to a query
router.post("/respond", (req, res) => {
  const { query_id, clinic_id, response_text } = req.body;

  if (!query_id || !clinic_id || !response_text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO responses (query_id, clinic_id, response_text) VALUES (?, ?, ?)";
  db.query(sql, [query_id, clinic_id, response_text], (err) => {
    if (err) {
      console.error("Error saving response:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Response submitted successfully" });
  });
});

// ✅ Add a new query (for owner side)
router.post("/add", (req, res) => {
  const { owner_id, title, description, category } = req.body;

  if (!owner_id || !title || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql =
    "INSERT INTO queries (owner_id, title, description, category) VALUES (?, ?, ?, ?)";
  db.query(sql, [owner_id, title, description, category || "General"], (err) => {
    if (err) {
      console.error("Error adding query:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Query added successfully" });
  });
});

module.exports = router;
