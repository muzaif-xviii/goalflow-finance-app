const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

//signup route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.send("User registered successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

//login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(401).send("User not found");
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(403).send("Invalid credentials");
    }

    res.json({
      message: "Login successful",
      user_id: user.user_id
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
module.exports = router;