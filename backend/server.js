import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import authRoutes from "./routes/authRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // new

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/admin", adminRoutes); // admin routes

app.get("/", (req, res) => {
  res.send("Pet Clinic System API running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
