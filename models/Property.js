    const mongoose = require("mongoose");

    const propertySchema = new mongoose.Schema(
        {
            propertyType: {
                type: String,
                enum: ["house", "shop"],
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            rent: {
                type: Number,
                required: true
            },
            deposit: {
                type: Number
            },
            area: {
                type: Number
            },
            location: {
                type: String,
                required: true
            },
            amenities: [
                {
                    type: String
                }
            ],
            images: [
                {
                    type: String
                }
            ],
            isAvailable: {
                type: Boolean,
                default: true
            },
        },
        { timestamps: true }
    );

    module.exports = mongoose.model("Property", propertySchema);
