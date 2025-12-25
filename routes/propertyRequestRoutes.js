const express = require("express");
const router = express.Router();

const PropertyRequest = require("../models/PropertyRequestModel");
const Property = require("../models/Property"); // ✅ REQUIRED

/* =========================================================
   0. CREATE PROPERTY REQUEST (USER)
========================================================= */
router.post("/create", async (req, res) => {
    try {
        const request = new PropertyRequest(req.body);
        await request.save();

        res.status(201).json({
            success: true,
            message: "Property request stored successfully",
        });
    } catch (error) {
        console.error("PropertyRequest Create Error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

/* =========================================================
   1. GET ALL REQUESTS (ADMIN)
========================================================= */
router.get("/all", async (req, res) => {
    try {
        const requests = await PropertyRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* =========================================================
   2. ACCEPT REQUEST (ONLY ONE USER)
========================================================= */
router.put("/accept/:id", async (req, res) => {
    try {
        const request = await PropertyRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        /* 1️⃣ Accept selected request */
        request.status = "accepted";
        request.adminResponse = "Your booking has been approved";
        await request.save();

        /* 2️⃣ Reject all other requests for same property */
        await PropertyRequest.updateMany(
            {
                _id: { $ne: request._id },
                property: request.property,
                propertyType: request.propertyType,
                status: "pending",
            },
            {
                status: "rejected",
                adminResponse: "Property booked by another user",
            }
        );

        /* 3️⃣ Mark property unavailable */
        await Property.findOneAndUpdate(
            { title: request.property },
            { isAvailable: false }
        );

        res.json({
            success: true,
            message: "Request accepted successfully",
        });
    } catch (err) {
        console.error("Accept Request Error:", err);
        res.status(500).json({ message: err.message });
    }
});

/* =========================================================
   3. REJECT REQUEST (ADMIN MANUAL)
========================================================= */
router.put("/reject/:id", async (req, res) => {
    try {
        await PropertyRequest.findByIdAndUpdate(req.params.id, {
            status: "rejected",
            adminResponse: "Rejected by admin",
        });

        res.json({ success: true });
    } catch (err) {
        console.error("Reject Request Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
