// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// // require("dotenv").config({ queit: true, debug: false });
// require("dotenv").config();


// const AdminRoute = require("./routes/authRoutes");

// const app = express();

// app.use(express.json());
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));

// app.use("/api/auth", AdminRoute);

// connectDB();

// app.listen(process.env.PORT, () => {
//     console.log(`Server running on ${process.env.PORT}`);
// });




const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ,
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







