const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const financeRoutes = require("./routes/finance");
const goalRoutes = require("./routes/goals");

const db = require("./config/db");

const app = express();

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 120
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/goals", goalRoutes);

//route test
app.get("/", (req, res) => {
    res.send("backend is running");
});

//db connection testing
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.send("Database connected successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});