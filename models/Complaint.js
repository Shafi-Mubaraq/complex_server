const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["open", "resolved"],
        default: "open"
    }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);