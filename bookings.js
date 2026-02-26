const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = 5500;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "8096",
    database: process.env.DB_NAME || "wheels_for_women"
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.code, "-", err.sqlMessage);
        process.exit(1);
    } else {
        console.log("✅ Connected to MySQL database!");

        // Test basic query to confirm connection
        db.query("SELECT 1", (err, result) => {
            if (err) console.error("❌ Database Query Test Failed:", err.sqlMessage || err);
            else console.log("✅ Database is reachable!");
        });
    }
});

// Graceful Shutdown Handling
process.on("SIGINT", () => {
    db.end((err) => {
        if (err) console.error("❌ Error closing database connection:", err.sqlMessage || err);
        console.log("🔴 Database connection closed.");
        process.exit(0);
    });
});

// 📌 Handle Booking Requests (POST /book)
app.post("/book", (req, res) => {
    console.log("📝 Booking Request Received:", req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
        console.error("❌ Empty request body received.");
        return res.status(400).json({ message: "❌ Request body is required!" });
    }

    const { pickup_location, drop_location, vehicle_type } = req.body;

    // Validate input
    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "❌ All fields are required!" });
    }

    // Insert booking into database
    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    console.log("📝 Running SQL Query:", query, [pickup_location, drop_location, vehicle_type]);

    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error Code:", err.code);
            console.error("❌ SQL Message:", err.sqlMessage);
            return res.status(500).json({ message: "Database error!", details: err.sqlMessage });
        }
        console.log("✅ Booking Saved:", result);
        res.status(201).json({ message: "🎉 Booking confirmed!", booking_id: result.insertId });
    });
});

// 📌 GET route for `/book` to verify API status
app.get("/book", (req, res) => {
    res.send("🚀 Booking API is running! Use a POST request to book a ride.");
});

// 📌 Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
app.post("/book", (req, res) => {
    console.log("📝 Booking Request Received:", req.body); // ✅ Log received request

    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err.sqlMessage || err); // 🔍 Logs the exact error!
            return res.status(500).json({ message: "Database error!", error: err.sqlMessage || err });
        }
        console.log("✅ Booking Saved:", result);
        res.status(201).json({ message: "🎉 Booking confirmed!", booking_id: result.insertId });
    });
});
app.post("/book", (req, res) => {
    console.log("📝 Booking Request Received:", req.body);

    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error Code:", err.code);
            console.error("❌ MySQL Error Message:", err.sqlMessage);
            return res.status(500).json({ message: "Database error!", error: err.sqlMessage });
        }
        console.log("✅ Booking Saved:", result);

        res.status(201).json({
            message: "🎉 Booking confirmed!",
            booking_id: result.insertId,
            pickup_location,
            drop_location,
            vehicle_type
        });
    });
});
app.post("/book", (req, res) => {
    console.log("📝 Booking Request Received:", req.body);

    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error Code:", err.code);
            console.error("❌ SQL Message:", err.sqlMessage);
            return res.status(500).json({ message: "Database error!", error: err.sqlMessage });
        }

        console.log("✅ Booking Saved:", result);
        res.status(201).json({
            message: "🎉 Booking confirmed!",
            booking_id: result.insertId,
            pickup_location,
            drop_location,
            vehicle_type
        });
    });
});
app.post("/book", (req, res) => {
    console.log("📝 Booking Request Received:", req.body);

    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error Code:", err.code);
            console.error("❌ MySQL Error Message:", err.sqlMessage);
            return res.status(500).json({ message: "Database error!", error: err.sqlMessage });
        }
        console.log("✅ Booking Saved:", result);
        res.status(201).json({
            message: "🎉 Booking confirmed!",
            booking_id: result.insertId,
            pickup_location,
            drop_location,
            vehicle_type
        });
    });
});
app.post("/book", (req, res) => {
    console.log("📝 Booking Request Received:", req.body);

    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error Code:", err.code);
            console.error("❌ MySQL Error Message:", err.sqlMessage);
            return res.status(500).json({ message: "Database error!", error: err.sqlMessage });
        }
        console.log("✅ Booking Saved:", result);
        res.status(201).json({
            message: "🎉 Booking confirmed!",
            booking_id: result.insertId,
            pickup_location,
            drop_location,
            vehicle_type
        });
    });
});
app.post("/new-book", (req, res) => {
    console.log("📩 New Booking Request Received:", req.body);

    const { pickup_location, drop_location, vehicle_type } = req.body;

    if (!pickup_location || !drop_location || !vehicle_type) {
        console.error("❌ Missing fields:", req.body);
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "INSERT INTO bookings (pickup_location, drop_location, vehicle_type) VALUES (?, ?, ?)";
    db.query(query, [pickup_location, drop_location, vehicle_type], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error Code:", err.code);
            console.error("❌ MySQL Error Message:", err.sqlMessage);
            return res.status(500).json({ message: "Database error!", error: err.sqlMessage });
        }

        console.log("✅ New Booking Saved:", result);
        res.status(201).json({
            message: "🎉 New Booking confirmed!",
            booking_id: result.insertId,
            pickup_location,
            drop_location,
            vehicle_type
        });
    });
});