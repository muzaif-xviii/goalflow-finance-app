const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD EXPENSE
router.post("/expense", async (req, res) => {
  const { user_id, amount, category, date } = req.body;

  try {
    await db.query(
      "INSERT INTO expenses (user_id, amount, category, date_spent) VALUES (?,?,?,?)",
      [user_id, amount, category, date]
    );

    res.send("Expense added successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding expense");
  }
});

module.exports = router;