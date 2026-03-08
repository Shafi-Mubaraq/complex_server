const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const User = require("../models/User");
const Booking = require("../models/Booking");
const PropertyRequest = require("../models/PropertyRequest");
const Lease = require("../models/Lease");

// Get all dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        // Get total counts
        const totalProperties = await Property.countDocuments();
        const availableProperties = await Property.countDocuments({ isAvailable: true });
        const occupiedProperties = await Property.countDocuments({ isAvailable: false });
        
        const totalTenants = await User.countDocuments({ role: "tenant" });
        const totalOwners = await User.countDocuments({ role: "owner" });
        
        const pendingRequests = await PropertyRequest.countDocuments({ status: "pending" });
        const activeLeases = await Lease.countDocuments({ status: "active" });

        // Get monthly revenue data
        const leases = await Lease.find({ status: "active" }).populate('property');
        const totalMonthlyRevenue = leases.reduce((sum, lease) => sum + (lease.monthlyRent || 0), 0);
        
        // Property type distribution
        const houses = await Property.countDocuments({ propertyType: "house" });
        const shops = await Property.countDocuments({ propertyType: "shop" });

        res.json({
            success: true,
            data: {
                properties: {
                    total: totalProperties,
                    available: availableProperties,
                    occupied: occupiedProperties,
                    houses,
                    shops
                },
                users: {
                    totalTenants,
                    totalOwners
                },
                requests: {
                    pending: pendingRequests
                },
                leases: {
                    active: activeLeases,
                    totalMonthlyRevenue
                }
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get monthly requests data for charts
router.get("/monthly-requests", async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const requests = await PropertyRequest.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Format data for charts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = months[date.getMonth()];
            
            const monthRequests = requests.filter(r => 
                r._id.month === date.getMonth() + 1 && 
                r._id.year === date.getFullYear()
            );

            monthlyData.push({
                month: monthName,
                pending: monthRequests.find(r => r._id.status === 'pending')?.count || 0,
                accepted: monthRequests.find(r => r._id.status === 'accepted')?.count || 0,
                rejected: monthRequests.find(r => r._id.status === 'rejected')?.count || 0
            });
        }

        res.json({
            success: true,
            data: monthlyData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get property distribution by location
router.get("/property-distribution", async (req, res) => {
    try {
        const distribution = await Property.aggregate([
            {
                $group: {
                    _id: "$location",
                    houses: {
                        $sum: { $cond: [{ $eq: ["$propertyType", "house"] }, 1, 0] }
                    },
                    shops: {
                        $sum: { $cond: [{ $eq: ["$propertyType", "shop"] }, 1, 0] }
                    },
                    total: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            },
            {
                $limit: 5
            }
        ]);

        res.json({
            success: true,
            data: distribution
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recent activities
router.get("/recent-activities", async (req, res) => {
    try {
        const recentRequests = await PropertyRequest.find()
            .populate('applicantUser', 'fullName')
            .populate('property', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentLeases = await Lease.find()
            .populate('tenant', 'fullName')
            .populate('property', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        const activities = [];

        recentRequests.forEach(request => {
            activities.push({
                type: 'request',
                description: `${request.applicantUser?.fullName || 'Someone'} requested for ${request.property?.title || 'a property'}`,
                status: request.status,
                date: request.createdAt,
                icon: '📝'
            });
        });

        recentLeases.forEach(lease => {
            activities.push({
                type: 'lease',
                description: `New lease created for ${lease.property?.title} with ${lease.tenant?.fullName}`,
                status: lease.status,
                date: lease.createdAt,
                icon: '📄'
            });
        });

        // Sort by date and take latest 5
        activities.sort((a, b) => b.date - a.date);
        activities.splice(5);

        res.json({
            success: true,
            data: activities
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;