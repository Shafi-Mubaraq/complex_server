const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB has been connected successfully");
    } catch (err) {
        console.error("Error in connecting MongoDB : ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;