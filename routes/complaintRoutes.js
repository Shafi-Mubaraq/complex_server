const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");


// ------------------------------------------------
// Create Complaint (Tenant)
// ------------------------------------------------
router.post("/create", async (req, res) => {
    try {

        const complaint = new Complaint(req.body);

        await complaint.save();

        res.json({
            success: true,
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ------------------------------------------------
// Tenant complaints
// ------------------------------------------------
router.get("/tenant/:tenantId", async (req, res) => {

    try {

        const complaints = await Complaint.find({
            tenant: req.params.tenantId
        }).populate("property");

        res.json(complaints);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


// ------------------------------------------------
// Owner complaints
// ------------------------------------------------
router.get("/owner/:ownerId", async (req, res) => {

    try {

        const complaints = await Complaint.find({
            owner: req.params.ownerId
        }).populate("property tenant");

        res.json(complaints);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


// ------------------------------------------------
// Update complaint status (Owner)
// ------------------------------------------------
router.put("/update/:id", async (req, res) => {

    try {

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(complaint);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


module.exports = router;


