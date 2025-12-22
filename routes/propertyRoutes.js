const express = require("express");
const Property = require("../models/Property");
const router = express.Router();

// -------------------------------------------------------------------------------------------------------------------------------------------

// CREATE PROPERTY

router.post("/create", async (req, res) => {

    try {
        const property = await Property.create(req.body);
        res.status(201).json({ message: "Property created", property });
    } catch (err) {
        res.status(500).json({ message: "Property creation failed", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

// UPDATE PROPERTY

router.put("/update/:id", async (req, res) => {

    try {
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true,  runValidators: true, });
        res.status(200).json({ message: "Property updated successfully", property: updatedProperty });
    } catch (err) {
        res.status(500).json({ message: "Property update failed", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

// DELETE PROPERTY

router.delete("/delete/:id", async (req, res) => {

    try {
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Property delete failed", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;