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

// dashboard calculations
router.get("/summary/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const [incomeRows] = await db.query(
      "SELECT COALESCE(SUM(amount), 0) AS total_income FROM income WHERE user_id = ?",
      [userID] 
    );

    const [expenseRows] = await db.query(
      "SELECT COALESCE(SUM(amount), 0) AS total_expense FROM expenses WHERE user_id = ?",
      [userID]
    );

    const total_income = Number(incomeRows[0].total_income);
    const total_expense = Number(expenseRows[0].total_expense);
    const balance = total_income - total_expense;

    res.json({
      total_income,
      total_expense,
      balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error fetching summary"});
  }
});

// get all expenses
router.get("/expenses/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT expense_id, category, amount, date_spent FROM expenses WHERE user_id = ? ORDER BY date_spent DESC, expense_id DESC",
      [userID]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error fetching expenses"});
  }
});

// GET RECENT TRANSACTIONS (income + expenses)
router.get("/transactions/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [incomeRows] = await db.query(
      `
      SELECT 
        income_id AS entry_id,
        amount,
        source AS label,
        date_received AS date,
        'income' AS type
      FROM income
      WHERE user_id = ?
      `,
      [userId]
    );

    const [expenseRows] = await db.query(
      `
      SELECT 
        expense_id AS entry_id,
        amount,
        category AS label,
        date_spent AS date,
        'expense' AS type
      FROM expenses
      WHERE user_id = ?
      `,
      [userId]
    );

    const allTransactions = [...incomeRows, ...expenseRows]
      .sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;
        return b.entry_id - a.entry_id;
      })
      .slice(0, 8);

    res.json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// GET EXPENSES GROUPED BY CATEGORY
router.get("/expense-chart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT category, SUM(amount) AS total
      FROM expenses
      WHERE user_id = ?
      GROUP BY category
      ORDER BY total DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chart data" });
  }
});

module.exports = router;