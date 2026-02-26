const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pickup and drop.html"));
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "8096",
    database: process.env.DB_NAME || "wheels_for_women",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
        process.exit(1);
    }
    console.log("✅ Connected to MySQL database!");
    connection.release();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const validateBooking = (data) => {
    const { user_id, pickup_location, drop_location, pickup_time, fare_amount, vehicle_type, distance } = data;
    if (!user_id || !pickup_location || !drop_location || !pickup_time || !fare_amount || !vehicle_type || !distance) {
        return { valid: false, message: "All fields are required!" };
    }
    if (!['Scooty', 'Auto', 'Cab'].includes(vehicle_type)) {
        return { valid: false, message: "Invalid vehicle type!" };
    }
    if (isNaN(fare_amount) || fare_amount <= 0) {
        return { valid: false, message: "Fare amount must be a positive number!" };
    }
    if (isNaN(distance) || distance <= 0) {
        return { valid: false, message: "Distance must be a positive number!" };
    }
    if (!/^\d+$/.test(user_id.toString())) {
        return { valid: false, message: "User ID must be a valid integer!" };
    }
    return { valid: true };
};

app.post("/bookings", async (req, res) => {
    console.log("✅ Request received at /bookings");
    console.log("Received Booking Data:", req.body);

    const validation = validateBooking(req.body);
    if (!validation.valid) {
        console.error("❌ Validation failed:", validation.message);
        return res.status(400).json({ message: validation.message });
    }

    const { user_id, pickup_location, drop_location, pickup_time, vehicle_type, distance, fare_amount } = req.body;
    const status = "Pending";

    try {
        const formattedPickupTime = new Date(pickup_time).toISOString().slice(0, 19).replace("T", " ");
        const query = "INSERT INTO bookings (user_id, pickup_location, drop_location, pickup_time, vehicle_type, distance, fare_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const [result] = await pool.query(query, [user_id, pickup_location, drop_location, formattedPickupTime, vehicle_type, distance, fare_amount, status]);

        console.log("✅ Booking Inserted Successfully:", result);
        res.status(201).json({ message: "Booking saved successfully!", booking_id: result.insertId });
    } catch (err) {
        console.error("❌ MySQL Insert Error:", err.sqlMessage || err.message);
        res.status(500).json({ message: `Booking failed due to database error: ${err.sqlMessage || err.message}` });
    }
});

app.get("/bookings", async (req, res) => {
    try {
        const [bookings] = await pool.query("SELECT * FROM bookings");
        console.log("✅ Fetched Bookings:", bookings);
        res.json(bookings);
    } catch (err) {
        console.error("❌ Error fetching bookings:", err.sqlMessage || err.message);
        res.status(500).json({ message: "Failed to fetch bookings!" });
    }
});

app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received. Closing server...");
    server.close(() => {
        pool.end().then(() => {
            console.log("🛑 Database pool closed. Server stopped.");
            process.exit(0);
        });
    });
});