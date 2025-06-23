const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require('../routes/auth');
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "user@SQL",     // Change if you set a MySQL root password
  database: "internconnect"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

// ------------------------
// Admin Signup Route
// ------------------------
app.post("/api/auth/admin/signup", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkQuery = "SELECT * FROM admins WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const insertQuery = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err) => {
      if (err) return res.status(500).json({ error: "Signup failed" });

      res.status(201).json({ message: "Admin registered successfully" });
    });
  });
});
//
// ------------------------
// Admin Login Route
// ------------------------
// app.post("/api/auth/admin/login", (req, res) => {
//   const { email, password } = req.body;
//
//   const query = "SELECT * FROM admins WHERE email = ? AND password = ?";
//   db.query(query, [email, password], (err, results) => {
//     if (err) return res.status(500).json({ error: "Login error" });
//
//     if (results.length === 0) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }
//
//     const admin = results[0];
//     res.status(200).json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
//   });
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
+