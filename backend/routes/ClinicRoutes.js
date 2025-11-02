import express from "express";
import { db } from "../server.js";

const router = express.Router();

// --------------------
// Add Query
// --------------------
router.post("/add", (req, res) => {
  const { owner_id, title, description, category } = req.body;

  // Validate input
  if (!owner_id || !title) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    "INSERT INTO queries (owner_id, title, description, category) VALUES (?, ?, ?, ?)",
    [owner_id, title, description || "", category || ""],
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

  if (!query_id || !clinic_id || !response_text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if query exists
  db.query("SELECT id FROM queries WHERE id = ?", [query_id], (err, queryRows) => {
    if (err) return res.status(500).json({ message: "DB error checking query" });
    if (queryRows.length === 0) return res.status(404).json({ message: "Query not found" });

    // Check if clinic exists
    db.query("SELECT id FROM clinics WHERE id = ?", [clinic_id], (err, clinicRows) => {
      if (err) return res.status(500).json({ message: "DB error checking clinic" });
      if (clinicRows.length === 0) return res.status(404).json({ message: "Clinic not found" });

      // Prevent duplicate responses
      db.query(
        "SELECT * FROM responses WHERE query_id = ? AND clinic_id = ?",
        [query_id, clinic_id],
        (err, rows) => {
          if (err) return res.status(500).json({ message: "DB error checking duplicates" });
          if (rows.length > 0) return res.status(400).json({ message: "Already responded" });

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
        }
      );
    });
  });
});

// --------------------
// Get all queries with responses
// --------------------
router.get("/all", (req, res) => {
  db.query(
    `
    SELECT 
      q.id,
      q.owner_id,
      q.title,
      q.description,
      q.category,
      q.date_posted,
      r.response_text,
      c.name AS clinic_name
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

export default router;
