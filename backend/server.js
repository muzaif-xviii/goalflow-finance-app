const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const db = require("./config/db");

const app = express();

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100
});

app.use(cors());
app.use(express.json());

app.use(limiter);

app.use("/api/auth", authRoutes);

//route test
app.get("/", (req, res) => {
    res.send("backend is running");
});

//db connection testing
app.get("/test-db", (req, res) => {
    db.query("SELECT 1", (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("database connection failed");
        } else {
            res.send("database connected succesfully");
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});