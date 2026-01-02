const mongoose = require("mongoose");

const propertyRequestSchema = new mongoose.Schema({

    property: { type: String, required: true },
    propertyType: { type: String, enum: ["house", "shop"], required: true },

    applicantDetails: {
        fullName: { type: String, required: true },
        familyType: { type: String, enum: ["nuclear", "joint", "bachelor"], required: true },
        numberOfMembers: { type: Number, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        aadharNumber: { type: String, required: true },
    },

    message: { type: String },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    adminResponse: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("PropertyRequest", propertyRequestSchema);
