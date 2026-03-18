const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

//signup route
router.post("/signup", async (req, res) => {
    const {username, email, password } = req.body;

    try {
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, results) => {
                if (err) return res.status(500).send("Server error");

                if (results.length > 0) {
                    return res.status(400).send("User already exists");
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                    [username, email, hashedPassword],
                    (err, result) => {
                        if (err) return res.status(500).send("Error creating user");

                        res.send("User registered successfully");
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).send("Server error");
    }
});

//login route
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
                    return res.status(400).send("All feilds required");
                }

    try {
        const [results] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]);
                
                if(results.length === 0) {
                    return res.status(401).send("User Not Found");
                }

                const user = results[0];

                const isMatch = await bcrypt.compare(password, user.password_hash);

                if(!isMatch) {
                    return res.status(403).send("Invalid credentials");
                }
                res.json({
                    message: "login successful",
                    user_id: user.user_id
                });
    } catch (error) {
        res.status(500).send("Server error");
    }
});
module.exports = router;