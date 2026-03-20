const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD EXPENSE
router.post("/expense", async (req, res) => {
  const { user_id, amount, category, date_spent } = req.body;

  try {
    await db.query(
      "INSERT INTO expenses (user_id, amount, category, date_spent) VALUES (?, ?, ?, ?)",
      [user_id, amount, category, date_spent]
    );

    res.json({message : "Expense added successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message : "Error adding expense" });
  }
});

//add income
router.post("/income", async (req, res) => {
  const { user_id, amount, source, date_received } = req.body;

  try{
    await db.query(
      "INSERT INTO income (user_id, amount, source, date_received) VALUES (?,?,?,?)",
      [user_id, amount, source, date_received]
    );

    res.json({ message : "income added succesfully"});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error adding income"});
  }
});

module.exports = router;