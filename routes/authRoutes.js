const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// -------------------------------------------------------------------------------------------------------------------------------------------

// SIGNUP

router.post("/signup", async (req, res) => {
    try {
        const exist = await User.findOne({ mobile: req.body.mobile });

        if (exist) {
            return res.status(409).json({ message: "Mobile already exists" });
        }

        const user = await User.create(req.body);

        res.status(201).json({ message: "User created", user });
    } catch (err) {
        res.status(500).json({ message: "Signup error", error: err.message });
    }
});

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

// SIGNIN

router.post("/signin", async (req, res) => {

    try {

        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login success" });
    } catch (err) {
        res.status(500).json({ message: "Signin error", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------

module.exports = router;