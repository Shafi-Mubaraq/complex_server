const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    lease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lease",
        required: true
    },
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMonth: {
        type: String, // Example: "March 2026"
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "upi", "bank_transfer", "card"],
        default: "upi"
    },
    transactionId: String,
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed"
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);