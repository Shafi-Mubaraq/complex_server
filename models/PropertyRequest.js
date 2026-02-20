const mongoose = require("mongoose");

const propertyRequestSchema = new mongoose.Schema({

    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    applicantUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyType: {
        type: String,
        enum: ["house", "shop"],
        required: true
    },
    houseDetails: {
        familyType: String,
        numberOfMembers: Number
    },
    shopDetails: {
        businessName: String,
        businessType: String,
        numberOfEmployees: Number
    },
    message: String,
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    adminResponse: String
}, { timestamps: true });

module.exports = mongoose.model("PropertyRequest", propertyRequestSchema);