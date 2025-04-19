const { validationResult } = require("express-validator")
const Booking = require("../models/Booking")
const ParkingLocation = require("../models/ParkingLocation")
const { createRazorpayOrder } = require("../utils/razorpay")

const createBooking = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { locationId, vehicleType, vehicleNumber, driverLicense, hours, startTime, couponCode } = req.body
    const userId = req.user.id

    const parkingLocation = await ParkingLocation.findById(locationId)
    if (!parkingLocation) {
      return res.status(404).json({ message: "Parking location not found" })
    }

    const activeBookings = await Booking.find({
      locationId,
      vehicleType,
      bookingStatus: "active",
    })

    const vehicleSlots = parkingLocation.slots[vehicleType]
    if (!vehicleSlots || vehicleSlots.total <= 0) {
      return res.status(400).json({ message: `No slots available for ${vehicleType}` })
    }

    if (activeBookings.length >= vehicleSlots.total) {
      return res.status(400).json({ message: `No available slots for ${vehicleType}` })
    }

    const hourlyRate = vehicleSlots.hourlyRate
    const totalAmount = hourlyRate * hours

    let discountApplied = 0
    if (couponCode === "PARK10") {
      discountApplied = totalAmount * 0.1
    }

    const finalAmount = totalAmount - discountApplied

    const endTimeDate = new Date(startTime)
    endTimeDate.setHours(endTimeDate.getHours() + hours)

    const order = await createRazorpayOrder({
      amount: Math.round(finalAmount * 100), 
      currency: "INR",
      receipt: `booking_${Date.now()}`,
      notes: {
        userId,
        locationId,
        vehicleType,
      },
    })

    const booking = new Booking({
      userId,
      locationId,
      vehicleType,
      vehicleNumber,
      driverLicense,
      hours,
      startTime,
      endTime: endTimeDate,
      totalAmount,
      discountApplied,
      finalAmount,
      paymentStatus: "pending",
      bookingStatus: "active",
      razorpayOrderId: order.id,
    })

    await booking.save()

    res.status(201).json({
      booking,
      paymentDetails: {
        orderId: order.id,
        amount: finalAmount,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_jnFll4vBKCwPho",
      },
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: "Server error during booking creation" })
  }
}

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username email phone")
      .populate("locationId", "name address city state")
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Server error while fetching bookings" })
  }
}

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("locationId", "name address city state")
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    console.error("Get user bookings error:", error)
    res.status(500).json({ message: "Server error while fetching user bookings" })
  }
}

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "username email phone")
      .populate("locationId", "name address city state slots")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({ message: "Server error while fetching booking" })
  }
}

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }

    if (booking.bookingStatus !== "active") {
      return res.status(400).json({ message: `Booking is already ${booking.bookingStatus}` })
    }

    booking.bookingStatus = "cancelled"
    await booking.save()

    const parkingLocation = await ParkingLocation.findById(booking.locationId)
    if (parkingLocation) {
      parkingLocation.slots[booking.vehicleType].total += 1
      await parkingLocation.save()
    }

    res.json(booking)
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(500).json({ message: "Server error during booking cancellation" })
  }
}

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.bookingStatus === "active") {
      const parkingLocation = await ParkingLocation.findById(booking.locationId)
      if (parkingLocation) {
        parkingLocation.slots[booking.vehicleType].total += 1
        await parkingLocation.save()
      }
    }

    res.json({ message: "Booking deleted successfully" })
  } catch (error) {
    console.error("Delete booking error:", error)
    res.status(500).json({ message: "Server error during booking deletion" })
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  deleteBooking,
}
