const mongoose = require("mongoose");

const propertyRequestSchema = new mongoose.Schema({

    property: { type: String, required: true },
    propertyType: { type: String, enum: ["house", "shop"], required: true },

    applicantBasic: {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        aadharNumber: { type: String, required: true },
    },

    houseDetails: {
        familyType: { type: String, enum: ["nuclear", "joint", "bachelor"], required: function () { return this.propertyType === "house"; } },
        numberOfMembers: { type: Number, required: function () { return this.propertyType === "house"; } },
    },

    shopDetails: {
        businessName: { type: String, required: function () { return this.propertyType === "shop"; } },
        businessType: { type: String, required: function () { return this.propertyType === "shop"; } },
        gstNumber: { type: String, required: function () { return this.propertyType === "shop"; } },
        numberOfEmployees: { type: Number, required: function () { return this.propertyType === "shop"; } },
        yearsOfExperience: { type: Number, required: function () { return this.propertyType === "shop"; } },
    },

    message: { type: String },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    adminResponse: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("PropertyRequest", propertyRequestSchema);