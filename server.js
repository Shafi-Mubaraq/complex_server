const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// require("dotenv").config({ queit: true, debug: false });
require("dotenv").config();


const AdminRoute = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use("/api/auth", AdminRoute);

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});











