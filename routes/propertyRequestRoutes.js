const express = require("express");
const router = express.Router();
const PropertyRequest = require("../models/PropertyRequest");
const Property = require("../models/Property");

// ---------------------------------------------------------------------------
// CREATE PROPERTY REQUEST (USER)
router.post("/create", async (req, res) => {
    try {
        const { property, propertyType } = req.body;

        // 1️⃣ Check property exists & availability
        const propertyData = await Property.findOne({
            title: property,
            isAvailable: true,
        });

        if (!propertyData) {
            return res.status(400).json({
                success: false,
                message: "Property not available",
            });
        }

        // 2️⃣ Create request
        const request = await PropertyRequest.create(req.body);

        res.status(201).json({
            success: true,
            message: "Property request stored successfully",
            data: request,
        });
    } catch (error) {
        console.error("PropertyRequest Create Error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});

// ---------------------------------------------------------------------------
// GET ALL REQUESTS (ADMIN)
router.get("/all", async (req, res) => {
    try {
        const requests = await PropertyRequest.find()
            .populate("property applicant", "title fullName phoneNumber") // Populate related data
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (err) {
        console.error("Get Requests Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------------
// ACCEPT REQUEST (ONLY ONE USER)
router.put("/accept/:id", async (req, res) => {
    try {
        const request = await PropertyRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        if (request.status !== "pending") return res.status(400).json({ message: `Request already ${request.status}` });

        // Check property availability again
        const propertyData = await Property.findById(request.property);
        if (!propertyData || !propertyData.isAvailable) {
            return res.status(400).json({ message: "Property already booked" });
        }

        // Accept request
        request.status = "accepted";
        request.adminResponse = "Your booking has been approved";
        await request.save();

        // Reject all other pending requests for the same property
        await PropertyRequest.updateMany(
            { _id: { $ne: request._id }, property: request.property, status: "pending" },
            { status: "rejected", adminResponse: "Property booked by another user" }
        );

        // Mark property unavailable
        propertyData.isAvailable = false;
        await propertyData.save();

        res.json({ success: true, message: "Request accepted successfully", data: request });
    } catch (err) {
        console.error("Accept Request Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ---------------------------------------------------------------------------
// REJECT REQUEST (ADMIN MANUAL)
router.put("/reject/:id", async (req, res) => {
    try {
        const request = await PropertyRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        if (request.status !== "pending") return res.status(400).json({ message: `Request already ${request.status}` });

        request.status = "rejected";
        request.adminResponse = "Rejected by admin";
        await request.save();

        res.json({ success: true, message: "Request rejected successfully", data: request });
    } catch (err) {
        console.error("Reject Request Error:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
