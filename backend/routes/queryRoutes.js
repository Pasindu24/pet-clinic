import express from "express";
import { db } from "../server.js";

const router = express.Router();

// --------------------
// Add Query
// --------------------
router.post("/add", (req, res) => {
  const { owner_id, title, description } = req.body;

  // Validate inputs
  if (!owner_id || !title || !description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    "INSERT INTO queries (owner_id, title, description) VALUES (?, ?, ?)",
    [owner_id, title, description],
    (err, result) => {
      if (err) {
        console.error("❌ DB error in /add:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Query added successfully", queryId: result.insertId });
    }
  );
});

// --------------------
// Respond to Query
// --------------------
router.post("/respond", (req, res) => {
  const { query_id, clinic_id, response_text } = req.body;

  console.log("Respond payload:", req.body);

  // Validate inputs
  if (!query_id || !clinic_id || !response_text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Optional: check if query_id exists
  db.query("SELECT id FROM queries WHERE id = ?", [query_id], (err, rows) => {
    if (err) {
      console.error("❌ DB error checking query_id:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Query not found" });
    }

    // Insert response
    db.query(
      "INSERT INTO responses (query_id, clinic_id, response_text) VALUES (?, ?, ?)",
      [query_id, clinic_id, response_text],
      (err, result) => {
        if (err) {
          console.error("❌ DB error inserting response:", err);
          return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Response added successfully", responseId: result.insertId });
      }
    );
  });
});

// --------------------
// Get All Queries with Responses
// --------------------
router.get("/all", (req, res) => {
  db.query(
    `
    SELECT q.id, q.owner_id, q.title, q.description, q.date_posted,
           r.response_text AS response_text, c.name AS clinic_name
    FROM queries q
    LEFT JOIN responses r ON q.id = r.query_id
    LEFT JOIN clinics c ON r.clinic_id = c.id
    ORDER BY q.date_posted DESC
    `,
    (err, rows) => {
      if (err) {
        console.error("❌ Error fetching queries:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.json(rows);
    }
  );
});

// --------------------
// Export router
// --------------------
export default router;
