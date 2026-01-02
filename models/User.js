const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        aadhar: { type: String, required: true },
        mobile: { type: String, required: true, unique: true },
        additionalNumber: { type: String },
        city: { type: String },
        state: { type: String },
        role: { type: Number, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);