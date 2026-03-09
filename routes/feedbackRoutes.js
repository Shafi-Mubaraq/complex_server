const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");


// create feedback
router.post("/create", async (req, res) => {

    try {

        const feedback = new Feedback(req.body);

        await feedback.save();

        res.json({
            success: true,
            message: "Feedback submitted",
            feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

module.exports = router;