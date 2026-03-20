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

// GET ACTIVE GOALS
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT goal_id, goal_name, target_amount, status FROM goals WHERE user_id = ? AND status = 'active' ORDER BY goal_id DESC",
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching goals" });
  }
});

// MARK GOAL AS COMPLETED
router.put("/complete/:goalId", async (req, res) => {
  const { goalId } = req.params;

  try {
    await db.query(
      "UPDATE goals SET status = 'completed' WHERE goal_id = ?",
      [goalId]
    );

    res.json({ message: "Goal marked as completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating goal" });
  }
});

module.exports = router;