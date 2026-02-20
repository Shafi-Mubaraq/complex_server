const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: Date,

    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);