// const mongoose = require("mongoose");

// const propertyRequestSchema = new mongoose.Schema({
//     property: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Property",
//         required: true
//     },

//     applicant: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },

//     propertyType: {
//         type: String,
//         enum: ["house", "shop"],
//         required: true
//     },

//     houseDetails: {
//         familyType: { type: String, enum: ["nuclear", "joint", "bachelor"] },
//         numberOfMembers: Number
//     },

//     shopDetails: {
//         businessName: String,
//         businessType: String,
//         gstNumber: String,
//         numberOfEmployees: Number,
//         yearsOfExperience: Number
//     },

//     message: String,

//     status: {
//         type: String,
//         enum: ["pending", "accepted", "rejected"],
//         default: "pending"
//     },

//     adminResponse: String
// }, { timestamps: true });

// module.exports = mongoose.model("PropertyRequest", propertyRequestSchema);


// models/PropertyRequest.js
const mongoose = require("mongoose");

const propertyRequestSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true
  },

  applicant: {
    fullName: String,
    phoneNumber: String,
    address: String,
    aadharNumber: String
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
