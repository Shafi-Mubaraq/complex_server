


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ------------------------------------
// SIGNUP
// ------------------------------------
// router.post("/signup", async (req, res) => {
//     try {
//         const { fullName, email, password, aadhar, mobile, additionalNumber, city, state } = req.body;

//         // Check mobile exists
//         const exist = await User.findOne({ mobile });
//         if (exist) {
//             return res.status(409).json({ message: "Mobile number already registered" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             fullName,
//             email,
//             password: hashedPassword,
//             aadhar,
//             mobile,
//             additionalNumber,
//             city,
//             state
//         });

//         res.status(201).json({
//             message: "Signup successful",
//             userId: user._id
//         });

//     } catch (err) {
//         res.status(500).json({ message: "Signup error", error: err.message });
//     }
// });



// CREATE USER
router.post("/signup", async (req, res) => {
    try {
        const exist = await User.findOne({ mobile: req.body.mobile });

        if (exist) return res.status(409).json({ message: "Mobile already exists" });

        const user = await User.create(req.body);
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        res.status(500).json({ message: "Signup error", error: err.message });
    }
});

// GET ALL USERS
router.get("/all-users", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Fetch error" });
    }
});

// UPDATE USER
router.put("/edit/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Updated", user });
    } catch (err) {
        res.status(500).json({ message: "Update error" });
    }
});

// DELETE USER
router.delete("/delete/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete error" });
    }
});
// ------------------------------------
// SIGNIN
// ------------------------------------
router.post("/signin", async (req, res) => {
    // console.log("HELLO")
    // console.log(req.body)
    try {
        const { mobile, password } = req.body;
        // console.log(mobile, password)
        const user = await User.findOne({ mobile });
        if (!user)
            return res.status(404).json({ message: "User Not Found" });
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }


        res.status(200).json({
            message: "Login success"
            // userId: user._id
        });

    } catch (err) {
        res.status(500).json({ message: "Signin error", error: err.message });
    }
});

module.exports = router;
