const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// -------------------------------
// SIGN UP (CREATE ACCOUNT)
// -------------------------------
router.post("/signup", async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            aadhar,
            mobile,
            additionalNumber,
            city,
            state
        } = req.body;
        console.log(req.body)
        // Check if email exists
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: "Email already registered" });

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            aadhar,
            mobile,
            additionalNumber,
            city,
            state
        });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -------------------------------
// SIGN IN (LOGIN)
// -------------------------------
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email" });

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid password" });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
