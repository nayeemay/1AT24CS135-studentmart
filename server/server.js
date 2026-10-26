const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); // Uncommented!

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // Uncommented!

app.get("/", (req, res) => {
    res.json({
        message: "StudentMart API is running"
    });
});

const PORT = process.env.PORT || 5002;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });