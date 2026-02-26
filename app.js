const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = 3000;

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "8096",
    database: process.env.DB_NAME || "wheels_for_women"
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL database!");
});

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

// Routes
app.post("/register", async (req, res) => {
    const { name, email, gender, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO users (name, email, gender, role, password) VALUES (?, ?, ?, ?, ?)",
        [name, email, gender, role, hashedPassword],
        (err) => {
            if (err) return res.status(500).send("Registration failed.");
            res.redirect("/login");
        }
    );
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send("User not found.");

        const user = results[0];
        if (await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.redirect("/profile.html");
        } else {
            res.status(401).send("Incorrect password.");
        }
    });
});

// Protect Profile Page
app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + "/profile.html");
    } else {
        res.redirect("/login");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));