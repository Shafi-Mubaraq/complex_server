// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// require("dotenv").config();

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors({
//     origin: process.env.CORS_ORIGIN
// }));

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));

// // Start
// connectDB();
// app.listen(process.env.PORT, () => {
//     console.log(`Server running on ${process.env.PORT}`);
// });



const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const AdminRoute=require("./routes/authRoutes");

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
