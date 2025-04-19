const User = require("../models/User")
const ParkingLocation = require("../models/ParkingLocation")
const Booking = require("../models/Booking")

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()

    const totalLocations = await ParkingLocation.countDocuments()

    const activeBookings = await Booking.countDocuments({ bookingStatus: "active" })

    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    const bookingsByVehicleType = await Booking.aggregate([{ $group: { _id: "$vehicleType", count: { $sum: 1 } } }])

    const recentBookings = await Booking.find()
      .populate("userId", "username")
      .populate("locationId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("vehicleType totalAmount createdAt bookingStatus")

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$finalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    res.json({
      totalUsers,
      totalLocations,
      activeBookings,
      totalRevenue,
      bookingsByVehicleType,
      recentBookings,
      monthlyRevenue,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error while fetching stats" })
  }
}

module.exports = {
  getDashboardStats,
}
