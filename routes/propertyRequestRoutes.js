const express = require("express");
const router = express.Router();
const PropertyRequest = require("../models/PropertyRequest");
const Property = require("../models/Property");

// ---------------------------------------------------------------------------

// CREATE PROPERTY REQUEST (USER)

router.post("/create", async (req, res) => {

    try {
        
        const { property, applicantUser, propertyType, houseDetails, shopDetails, message } = req.body;

        // Validate property exists and is available
        const propertyData = await Property.findById(property);
        if (!propertyData) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (!propertyData.isAvailable) {
            return res.status(400).json({ message: "Property is not available for rent" });
        }

        // Validate user exists
        if (!mongoose.Types.ObjectId.isValid(applicantUser)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(applicantUser);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user already has a pending request for this property
        const existingRequest = await PropertyRequest.findOne({
            property,
            applicantUser,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You already have a pending request for this property"
            });
        }

        // Create the request
        const requestData = {
            property,
            applicantUser,
            propertyType,
            message,
            status: "pending"
        };

        // Add type-specific details
        if (propertyType === "house" && houseDetails) {
            requestData.houseDetails = houseDetails;
        } else if (propertyType === "shop" && shopDetails) {
            requestData.shopDetails = shopDetails;
        }

        const request = await PropertyRequest.create(requestData);

        // Populate the response with user and property details
        const populatedRequest = await PropertyRequest.findById(request._id)
            .populate('applicantUser', 'fullName email mobile aadhar')
            .populate('property', 'title location rent deposit');

        res.status(201).json({
            success: true,
            message: "Booking request submitted successfully",
            data: populatedRequest
        });

    } catch (err) {
        console.error("Property request error:", err);
        res.status(500).json({
            message: "Failed to submit request",
            error: err.message
        });
    }
});

// ---------------------------------------------------------------------------

// GET ALL REQUESTS (ADMIN)

router.get("/all", async (req, res) => {

    try {

        const requests = await PropertyRequest.find()
            .populate("property applicant", "title fullName phoneNumber")
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

// ---------------------------------------------------------------------------

module.exports = router;
