const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Property = require("../models/Property");

const router = express.Router();

// -------------------------------------------------------------------------------------------------------------------------------------------

// REGISTER USER

router.post("/signup", async (req, res) => {

    try {

        const exist = await User.findOne({ mobile: req.body.mobile });

        if (exist) {
            return res.status(409).json({ message: "Mobile already exists" });
        }

        const user = await User.create(req.body);
        res.status(201).json({ message: "User created", user });

    } catch (err) {
        console.error('Error in creating user : ', error)
        res.status(500).json({ message: "Signup error", error: err.message });
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------

// LOGIN USER

router.post("/signin", async (req, res) => {

    try {

        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({ message: "Mobile and password required" });
        }

        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, mobile: user.mobile, role: user.role },
            process.env.JWT_SECRET || "mySecretKey",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login success",
            token: token, fullName: user.fullName,
            mobile: user.mobile, role: user.role
        });

    } catch (err) {
        console.error("Signin Error:", err);
        res.status(500).json({ message: "Signin error", error: err.message });
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// PROPERTY ROUTES


// GET ALL PROPERTIES
router.get("/all-properties", async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch properties", error: err.message });
    }
});





module.exports = router;