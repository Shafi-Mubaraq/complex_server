const express = require("express");
const Property = require("../models/Property");
const User = require('../models/User')
const upload = require("../middleware/upload");
const router = express.Router();

// --------------------------------------------------------------------
// This is the new code you need for your HousePage and ShopsPage
// --------------------------------------------------------------------

router.get("/fetch/:type", async (req, res) => {

    try {
        const { type } = req.params;
        const properties = await Property.find({ propertyType: type })
            .sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: "Error fetching properties", error: err.message });
    }
});

// --------------------------------------------------------------------
// CREATE PROPERTY
// --------------------------------------------------------------------

router.post("/create", upload.array("images", 10), async (req, res) => {

    try {

        const adminUser = await User.findOne({ role: "owner" });

        if (!adminUser) {
            return res.status(404).json({
                message: "Admin user not found"
            });
        }

        const ownerId = adminUser._id;

        const imagePaths = req.files?.map(
            file => `/uploads/properties/${file.filename}`
        ) || [];

        const property = await Property.create({
            owner: ownerId,
            title: req.body.title,
            propertyType: req.body.propertyType,
            rent: Number(req.body.rent),
            deposit: Number(req.body.deposit),
            area: Number(req.body.area),
            location: req.body.location,
            floor: req.body.floor,
            doorNumber: req.body.doorNumber,
            isAvailable: req.body.isAvailable === "true",
            amenities: req.body.amenities?.split(",") || [],
            images: imagePaths
        });

        res.status(201).json({ success: true, message: "Property created by admin", property });

    } catch (err) {
        console.log('Error in creating property : ', err.message)
        res.status(500).json({ message: err.message });
    }
}
);

// --------------------------------------------------------------------
// UPDATE PROPERTY
// --------------------------------------------------------------------

router.put("/update/:id", upload.array("images", 10), async (req, res) => {

    try {

        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        let keepImages = [];
        try {
            keepImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : JSON.parse(req.body.existingImages || "[]");
        } catch (err) {
            keepImages = [];
        }

        const newImages = req.files?.map(file => `/uploads/properties/${file.filename}`) || [];
        const finalImages = [...keepImages, ...newImages];

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                propertyType: req.body.propertyType,
                rent: Number(req.body.rent),
                deposit: Number(req.body.deposit),
                floor: req.body.floor,
                doorNumber: req.body.doorNumber,
                area: Number(req.body.area),
                location: req.body.location,
                isAvailable: req.body.isAvailable === "true",
                amenities: req.body.amenities?.split(",") || [],
                images: finalImages
            },
            { new: true }
        );

        res.json({
            success: true,
            message: "Property updated successfully",
            property: updatedProperty
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------------
// DELETE PROPERTY
// ---------------------------------------------------------------------------

router.delete("/delete/:id", async (req, res) => {

    try {

        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
});

module.exports = router;