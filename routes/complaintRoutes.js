const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Property = require("../models/Property");
const Feedback = require("../models/Feedback");


// ==============================
// CREATE COMPLAINT
// ==============================

router.post("/create", async (req, res) => {

    try {

        const { mobile, propertyId, title, description } = req.body;

        const tenant = await User.findOne({ mobile });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        const complaint = new Complaint({
            property: property._id,
            tenant: tenant._id,
            owner: property.owner,
            title,
            description
        });

        await complaint.save();

        res.status(201).json({
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            message: "Error creating complaint",
            error: error.message
        });

    }

});


// ==============================
// GET TENANT COMPLAINTS
// ==============================

router.get("/tenant/:mobile", async (req, res) => {

    try {

        const { mobile } = req.params;

        const tenant = await User.findOne({ mobile });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const complaints = await Complaint.find({ tenant: tenant._id })
            .populate("property")
            .populate("owner", "fullName mobile")
            .sort({ createdAt: -1 });

        res.status(200).json(complaints);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching complaints",
            error: error.message
        });

    }

});



// ==================================
// GET OWNER COMPLAINTS
// ==================================

router.get("/owner/:mobile", async (req, res) => {

    try {

        const owner = await User.findOne({ mobile: req.params.mobile });

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        const complaints = await Complaint.find({ owner: owner._id })
            .populate("tenant", "fullName mobile")
            .populate("property", "title location")
            .sort({ createdAt: -1 });

        res.json(complaints);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching owner complaints",
            error: error.message
        });

    }

});

// ==================================

// ==================================
// UPDATE COMPLAINT STATUS
// ==================================

router.put("/update/:id", async (req, res) => {

    try {

        const { status, response } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                status,
                response,
                resolvedDate: status === "resolved" ? new Date() : null
            },
            { new: true }
        );

        res.json({
            message: "Complaint updated",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            message: "Error updating complaint",
            error: error.message
        });

    }

});

module.exports = router;