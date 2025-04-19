const Booking = require("../models/Booking")

const updateCompletedBookings = async () => {
  try {
    const now = new Date()

    const completedBookings = await Booking.find({
      bookingStatus: "active",
      endTime: { $lte: now },
    })

    for (const booking of completedBookings) {
      booking.bookingStatus = "completed"
      await booking.save()
      console.log(`Booking ${booking._id} automatically marked as completed`)
    }
  } catch (error) {
    console.error("Error updating completed bookings:", error)
  }
}

module.exports = {
  updateCompletedBookings,
}
