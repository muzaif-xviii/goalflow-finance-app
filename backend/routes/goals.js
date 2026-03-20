const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD GOAL
router.post("/", async (req, res) => {
  const { user_id, goal_name, target_amount } = req.body;

  try {
    await db.query(
      "INSERT INTO goals (user_id, goal_name, target_amount) VALUES (?, ?, ?)",
      [user_id, goal_name, target_amount]
    );

    res.json({ message: "Goal added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding goal" });
  }
});

module.exports = router;