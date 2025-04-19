const mongoose = require("mongoose")

const parkingLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1,
  },
  slots: {
    car: {
      total: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 0 },
    },
    jeep: {
      total: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 0 },
    },
    truck: {
      total: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 0 },
    },
    twoWheeler: {
      total: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 0 },
    },
    auto: {
      total: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 0 },
    },
    other: {
      total: { type: Number, default: 0 },
      hourlyRate: { type: Number, default: 0 },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("ParkingLocation", parkingLocationSchema)
