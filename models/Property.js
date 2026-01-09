const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    propertyType: { type: String, enum: ["house", "shop"], required: true },
    title: { type: String, required: true },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    currentTenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    rent: { type: Number, required: true },
    deposit: Number,
    area: Number,
    location: { type: String, },
    floor: String,
    doorNumber: String,
    amenities: [String],
    images: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);