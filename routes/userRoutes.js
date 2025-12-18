const express = require("express");
const User = require("../models/User");
const router = express.Router();

// -------------------------------------------------------------------------------------------------------------------------------------------

// GET ALL USERS

router.get("/all-users", async (req, res) => {

    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Fetch error", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

// UPDATE USER

router.put("/edit/:id", async (req, res) => {

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Updated", user });
    } catch (err) {
        res.status(500).json({ message: "Update error", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

// DELETE USER

router.delete("/delete/:id", async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete error", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;