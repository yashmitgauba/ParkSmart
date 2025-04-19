const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingLocation",
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["car", "jeep", "truck", "twoWheeler", "auto", "other"],
  },
  vehicleNumber: {
    type: String,
    required: true,
    trim: true,
  },
  driverLicense: {
    type: String,
    required: true,
    trim: true,
  },
  hours: {
    type: Number,
    required: true,
    min: 1,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  discountApplied: {
    type: Number,
    default: 0,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  bookingStatus: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Booking", bookingSchema)
