const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadhar: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    additionalNumber: String,
    city: String,
    state: String,
    role: {
        type: String,
        enum: ["owner", "tenant"],
        default: "tenant"
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);