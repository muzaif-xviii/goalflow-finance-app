const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

// SIGNUP
router.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields required");
    }

    try {
        // check if user exists
        const [results] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (results.length > 0) {
            return res.status(400).send("User already exists");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user
        await db.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        return res.send("User registered successfully");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields required");
    }

    try {
        const [results] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (results.length === 0) {
            return res.status(401).send("User not found");
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(403).send("Invalid credentials");
        }

        return res.json({
            message: "login successful",
            user_id: user.id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
});

module.exports = router;
