const express = require("express");
const Property = require("../models/Property");
const upload = require("../middleware/upload");
const router = express.Router();


// --------------------------------------------------------------------
// CREATE PROPERTY
router.post("/create", upload.array("images", 10), async (req, res) => {
    try {
        const ownerId = req.body.owner;

        if (!ownerId) {
            return res.status(400).json({ message: "Owner is required" });
        }

        const imagePaths = req.files
            ? req.files.map(file => `/uploads/properties/${file.filename}`)
            : [];

        const property = await Property.create({
            owner: ownerId,
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
            images: imagePaths
        });

        res.status(201).json({
            success: true,
            message: "Property created successfully",
            property
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------------
// UPDATE PROPERTY


// router.put("/update/:id", upload.array("images", 10), async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id);
//         if (!property) {
//             return res.status(404).json({ message: "Property not found" });
//         }

//         // Images user wants to keep (sent from frontend)
//         let keepImages = [];
//         if (req.body.existingImages) {
//             keepImages = JSON.parse(req.body.existingImages);
//         }

//         // New uploaded images
//         const newImages = req.files?.map(
//             file => `/uploads/properties/${file.filename}`
//         ) || [];

//         const finalImages = [...keepImages, ...newImages];

//         const updatedProperty = await Property.findByIdAndUpdate(
//             req.params.id,
//             {
//                 title: req.body.title,
//                 propertyType: req.body.propertyType,
//                 rent: Number(req.body.rent),
//                 deposit: Number(req.body.deposit),
//                 floor: req.body.floor,
//                 doorNumber: req.body.doorNumber,
//                 area: Number(req.body.area),
//                 location: req.body.location,
//                 isAvailable: req.body.isAvailable === "true",
//                 amenities: req.body.amenities?.split(",") || [],
//                 images: finalImages
//             },
//             { new: true }
//         );

//         res.json({
//             success: true,
//             message: "Property updated successfully",
//             property: updatedProperty
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.put("/update/:id", upload.array("images", 10), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });

        // ----------------- SAFE PARSE EXISTING IMAGES -----------------
        let keepImages = [];
        try {
            keepImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : JSON.parse(req.body.existingImages || "[]");
        } catch (err) {
            keepImages = [];
        }

        // New uploaded images
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
