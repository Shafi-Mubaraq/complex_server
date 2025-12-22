const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

//  ------------------------------------------------------------------------------------------------------------------------------------------

const Property = require("./models/Property");

//  ------------------------------------------------------------------------------------------------------------------------------------------

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

connectDB();

// ---------------------------------------------------------------------------------------------------------------------------------

app.use("/uploads", express.static("uploads"));

//  ------------------------------------------------------------------------------------------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

//  ------------------------------------------------------------------------------------------------------------------------------------------

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/userManage", require("./routes/userRoutes"));
app.use("/api/property", require("./routes/propertyRoutes"));

//  ------------------------------------------------------------------------------------------------------------------------------------------

app.get("/api/house/fetchData", async (req, res) => {

    try {
        const houses = await Property.find({ propertyType: "house" });
        res.json(houses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve property data due to a server error.",
            error: error.message,
        });
    }
});

//  ------------------------------------------------------------------------------------------------------------------------------------------

app.get("/api/shop/fetchData", async (req, res) => {

    try {
        const shops = await Property.find({ propertyType: "shop" });
        res.json(shops);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve commercial property data due to a server error.",
            error: error.message,
        });
    }
});

//  ------------------------------------------------------------------------------------------------------------------------------------------