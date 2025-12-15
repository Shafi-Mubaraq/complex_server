const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Property = require("./models/Property");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(express.json());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

/* Routes */
app.use("/api/auth", require("./routes/authRoutes"));

/* DB Connect */
connectDB();

/* Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on ${PORT}`);
});


app.get('/api/house/fetchData', async (req, res) => {
    // Start of the try block to wrap code that might fail
    try {
        console.log('Attempting to fetch houses...');
        
        // 1. Await the database query
        // Mongoose/MongoDB query is the operation that needs error handling
        const houses = await Property.find({ propertyType: 'house' });
        
        console.log(`Successfully fetched ${houses.length} documents.`);
        
        // 2. Respond with the fetched data (Success: 200 OK is default)
        res.json(houses);
        
    } catch (error) {
        // Start of the catch block to handle any errors that occurred in the try block

        // 3. Log the detailed error on the server side
        console.error('Error fetching house data:', error.message);
        
        // 4. Send an appropriate HTTP error response to the client
        // 500 Internal Server Error is standard for database/server issues
        res.status(500).json({ 
            message: 'Failed to retrieve property data due to a server error.', 
            error: error.message 
        });
    }
});

app.get('/api/shop/fetchData', async (req, res) => {
    // Start of the try block
    try {
        console.log('Attempting to fetch shops...');
        
        // 1. Await the database query, specifically finding properties with propertyType: 'shop'
        const shops = await Property.find({ propertyType: 'shop' });
        
        console.log(`Successfully fetched ${shops.length} commercial documents.`);
        
        // 2. Respond with the fetched data upon success (Success: 200 OK)
        res.json(shops);
        
    } catch (error) {
        // Start of the catch block to handle errors during the database operation

        // 3. Log the detailed error on the server side for debugging
        console.error('Error fetching shop data:', error.message);
        
        // 4. Send an appropriate HTTP error response (500 Internal Server Error) to the client
        res.status(500).json({ 
            message: 'Failed to retrieve commercial property data due to a server error.', 
            error: error.message 
        });
    }
});