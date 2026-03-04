// const express = require("express");
// const router = express.Router();
// const PropertyRequest = require("../models/PropertyRequest");
// const Property = require("../models/Property");
// const User = require("../models/User");
// const Lease = require("../models/Lease");
// const mongoose = require("mongoose");

// // ---------------------------------------------------------------------------

// // CREATE PROPERTY REQUEST (USER)

// router.post("/create", async (req, res) => {

//     try {

//         const { property, applicantUser, propertyType, houseDetails, shopDetails, message } = req.body;

//         // Validate property exists and is available
//         const propertyData = await Property.findById(property);
//         if (!propertyData) {
//             return res.status(404).json({ message: "Property not found" });
//         }

//         if (!propertyData.isAvailable) {
//             return res.status(400).json({ message: "Property is not available for rent" });
//         }

//         const user = await User.findOne({ mobile: applicantUser });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Check if user already has a pending request for this property
//         const existingRequest = await PropertyRequest.findOne({
//             property,
//             applicantUser: user._id,
//             status: "pending"
//         });


//         if (existingRequest) {
//             return res.status(400).json({
//                 message: "You already have a pending request for this property"
//             });
//         }

//         // Create the request
//         const requestData = {
//             property,
//             applicantUser: user._id,
//             propertyType,
//             message,
//             status: "pending"
//         };

//         // Add type-specific details
//         if (propertyType === "house" && houseDetails) {
//             requestData.houseDetails = houseDetails;
//         } else if (propertyType === "shop" && shopDetails) {
//             requestData.shopDetails = shopDetails;
//         }

//         const request = await PropertyRequest.create(requestData);

//         // Populate the response with user and property details
//         const populatedRequest = await PropertyRequest.findById(request._id)
//             .populate('applicantUser', 'fullName email mobile aadhar')
//             .populate('property', 'title location rent deposit');

//         res.status(201).json({
//             success: true,
//             message: "Booking request submitted successfully",
//             data: populatedRequest
//         });

//     } catch (err) {
//         console.error("Property request error:", err);
//         res.status(500).json({
//             message: "Failed to submit request",
//             error: err.message
//         });
//     }
// });

// // ---------------------------------------------------------------------------

// // GET ALL REQUESTS (ADMIN)

// router.get("/all", async (req, res) => {

//     try {

//         const requests = await PropertyRequest.find()
//             .populate("property", "title location rent deposit")
//             .populate("applicantUser", "fullName email mobile aadhar")
//             .sort({ createdAt: -1 });

//         res.json({
//             success: true,
//             count: requests.length,
//             data: requests,
//         });
//     } catch (err) {
//         console.error("Get Requests Error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // ---------------------------------------------------------------------------

// // ACCEPT REQUEST (ONLY ONE USER)

// router.put("/accept/:id", async (req, res) => {

//     try {

//         const request = await PropertyRequest.findById(req.params.id);
//         if (!request) return res.status(404).json({ message: "Request not found" });
//         if (request.status !== "pending") return res.status(400).json({ message: `Request already ${request.status}` });

//         // Check property availability again
//         const propertyData = await Property.findById(request.property);
//         if (!propertyData || !propertyData.isAvailable) {
//             return res.status(400).json({ message: "Property already booked" });
//         }

//         // Accept request
//         request.status = "accepted";
//         request.adminResponse = "Your booking has been approved";
//         await request.save();

//         // Reject all other pending requests for the same property
//         await PropertyRequest.updateMany(
//             { _id: { $ne: request._id }, property: request.property, status: "pending" },
//             { status: "rejected", adminResponse: "Property booked by another user" }
//         );

//         // Mark property unavailable
//         propertyData.isAvailable = false;
//         await propertyData.save();

//         res.json({ success: true, message: "Request accepted successfully", data: request });
//     } catch (err) {
//         console.error("Accept Request Error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // ---------------------------------------------------------------------------

// // REJECT REQUEST (ADMIN MANUAL)

// router.put("/reject/:id", async (req, res) => {

//     try {

//         const request = await PropertyRequest.findById(req.params.id);
//         if (!request) return res.status(404).json({ message: "Request not found" });
//         if (request.status !== "pending") return res.status(400).json({ message: `Request already ${request.status}` });
//         request.status = "rejected";
//         request.adminResponse = "Rejected by admin";
//         await request.save();

//         res.json({ success: true, message: "Request rejected successfully", data: request });
//     } catch (err) {
//         console.error("Reject Request Error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // ---------------------------------------------------------------------------

// module.exports = router;


// // --------------------------------------------------------------------------------

// // Get logged-in user booking requests

// router.get("/user/:mobile", async (req, res) => {
//     try {
//         const { mobile } = req.params;

//         const user = await User.findOne({ mobile });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         const requests = await PropertyRequest.find({
//             applicantUser: user._id
//         })
//         .populate("property")
//         .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: requests
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// });


const express = require("express");
const router = express.Router();
const PropertyRequest = require("../models/PropertyRequest");
const Property = require("../models/Property");
const User = require("../models/User");
const Lease = require("../models/Lease");


// ---------------------------------------------------------------------------
// CREATE PROPERTY REQUEST (USER)
// ---------------------------------------------------------------------------

router.post("/create", async (req, res) => {
    try {

        const { property, applicantUser, propertyType, houseDetails, shopDetails, message } = req.body;

        const propertyData = await Property.findById(property);
        if (!propertyData) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (!propertyData.isAvailable) {
            return res.status(400).json({ message: "Property not available" });
        }

        const user = await User.findOne({ mobile: applicantUser });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingRequest = await PropertyRequest.findOne({
            property,
            applicantUser: user._id,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "You already have a pending request"
            });
        }

        const requestData = {
            property,
            applicantUser: user._id,
            propertyType,
            message,
            status: "pending"
        };

        if (propertyType === "house" && houseDetails) {
            requestData.houseDetails = houseDetails;
        }

        if (propertyType === "shop" && shopDetails) {
            requestData.shopDetails = shopDetails;
        }

        const request = await PropertyRequest.create(requestData);

        res.status(201).json({
            success: true,
            message: "Booking request submitted successfully",
            data: request
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ---------------------------------------------------------------------------
// GET ALL REQUESTS (ADMIN)
// ---------------------------------------------------------------------------

router.get("/all", async (req, res) => {
    try {

        const requests = await PropertyRequest.find()
            .populate("property", "title location rent deposit")
            .populate("applicantUser", "fullName email mobile aadhar")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: requests.length,
            data: requests,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ---------------------------------------------------------------------------
// ACCEPT REQUEST (ONLY APPROVE)
// ---------------------------------------------------------------------------

router.put("/accept/:id", async (req, res) => {
    try {

        const request = await PropertyRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.status !== "pending") {
            return res.status(400).json({ message: `Request already ${request.status}` });
        }

        const propertyData = await Property.findById(request.property);
        if (!propertyData || !propertyData.isAvailable) {
            return res.status(400).json({ message: "Property already booked" });
        }

        request.status = "accepted";
        request.adminResponse = "Approved by owner";
        await request.save();

        propertyData.isAvailable = false;
        propertyData.currentTenant = request.applicantUser;
        await propertyData.save();

        await PropertyRequest.updateMany(
            {
                _id: { $ne: request._id },
                property: request.property,
                status: "pending"
            },
            {
                status: "rejected",
                adminResponse: "Property booked by another user"
            }
        );

        res.json({
            success: true,
            message: "Request accepted. Now create lease."
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ---------------------------------------------------------------------------
// CREATE LEASE (OWNER MANUAL ENTRY)
// ---------------------------------------------------------------------------

router.post("/create-lease/:requestId", async (req, res) => {
    try {

        const { startDate, endDate, monthlyRent, depositAmount } = req.body;

        if (!startDate || !monthlyRent) {
            return res.status(400).json({
                message: "Start date and monthly rent are required"
            });
        }

        const request = await PropertyRequest.findById(req.params.requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "accepted") {
            return res.status(400).json({
                message: "Request must be accepted before creating lease"
            });
        }

        const propertyData = await Property.findById(request.property);

        const existingLease = await Lease.findOne({
            property: request.property,
            tenant: request.applicantUser,
            status: "active"
        });

        if (existingLease) {
            return res.status(400).json({
                message: "Lease already exists for this tenant"
            });
        }

        const lease = await Lease.create({
            property: request.property,
            tenant: request.applicantUser,
            owner: propertyData.owner,
            startDate,
            endDate,
            monthlyRent,
            depositAmount,
            status: "active"
        });

        res.status(201).json({
            success: true,
            message: "Lease created successfully",
            lease
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ---------------------------------------------------------------------------
// REJECT REQUEST
// ---------------------------------------------------------------------------

router.put("/reject/:id", async (req, res) => {
    try {

        const request = await PropertyRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });

        if (request.status !== "pending") {
            return res.status(400).json({ message: `Request already ${request.status}` });
        }

        request.status = "rejected";
        request.adminResponse = "Rejected by admin";
        await request.save();

        res.json({
            success: true,
            message: "Request rejected successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ---------------------------------------------------------------------------
// GET USER REQUESTS
// ---------------------------------------------------------------------------

router.get("/user/:mobile", async (req, res) => {
    try {

        const user = await User.findOne({ mobile: req.params.mobile });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const requests = await PropertyRequest.find({
            applicantUser: user._id
        })
        .populate("property")
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;