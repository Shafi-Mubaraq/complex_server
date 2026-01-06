const express = require("express");
const Property = require("../models/Property");
const upload = require("../middleware/upload");
const router = express.Router();

// ---------------------------------------------------------------------------
// CREATE PROPERTY
router.post("/create", upload.array("images", 10), async (req, res) => {
    try {
        const imagePaths = req.files?.map(file => `/uploads/properties/${file.filename}`) || [];

        const property = await Property.create({
            ...req.body,
            amenities: req.body.amenities?.split(",") || [],
            images: imagePaths,
        });

        res.status(201).json({ message: "Property created", property });
    } catch (err) {
        res.status(500).json({ message: "Creation failed", error: err.message });
    }
});

// ---------------------------------------------------------------------------
// UPDATE PROPERTY
router.put("/update/:id", upload.array("images", 10), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        // Merge existing images with new uploads
        let images = property.images || [];
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/properties/${file.filename}`);
            images = [...images, ...newImages];
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            { ...req.body, amenities: req.body.amenities?.split(",") || [], images },
            { new: true }
        );

        res.json({ message: "Property updated successfully", property: updatedProperty });
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
});

// ---------------------------------------------------------------------------
// DELETE PROPERTY
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
