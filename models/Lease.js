const mongoose = require("mongoose");

const leaseSchema = new mongoose.Schema({
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    monthlyRent: {
        type: Number,
        required: true
    },
    depositAmount: Number,
    status: {
        type: String,
        enum: ["active", "terminated", "expired"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Lease", leaseSchema);