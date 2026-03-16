const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

// ==============================
// CREATE FEEDBACK
// ==============================

router.post("/create", async (req, res) => {

    try {

        const { complaintId, mobile, rating, comment } = req.body;
          console.log("Request Data:", req.body);

        const tenant = await User.findOne({ mobile });

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        if (complaint.status !== "resolved") {
            return res.status(400).json({
                message: "Feedback allowed only after complaint resolved"
            });
        }

        const existing = await Feedback.findOne({ complaint: complaintId });

        if (existing) {
            return res.status(400).json({
                message: "Feedback already submitted"
            });
        }

        const feedback = await Feedback.create({

            property: complaint.property,
            tenant: tenant._id,
            owner: complaint.owner,
            complaint: complaintId,
            rating,
            comment

        });
        console.log("Feedback stored:", feedback);

        res.json({
            message: "Feedback submitted",
            feedback
        });

    } catch (err) {

        res.status(500).json({ message: err.message });

    }

});


// ==================================
// GET OWNER COMPLAINTS WITH FEEDBACK
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

        const complaintsWithFeedback = await Promise.all(

            complaints.map(async (c) => {

                const feedback = await Feedback.findOne({
                    complaint: c._id
                });

                return {
                    ...c.toObject(),
                    feedback
                };

            })

        );

        res.json(complaintsWithFeedback);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching owner complaints",
            error: error.message
        });

    }

});
module.exports = router;