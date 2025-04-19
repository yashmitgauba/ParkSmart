const { validationResult } = require("express-validator")
const ParkingLocation = require("../models/ParkingLocation")
const Booking = require("../models/Booking")

const createParkingLocation = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const parkingLocation = new ParkingLocation(req.body)
    await parkingLocation.save()
    res.status(201).json(parkingLocation)
  } catch (error) {
    console.error("Create parking location error:", error)
    res.status(500).json({ message: "Server error during parking location creation" })
  }
}

const getAllParkingLocations = async (req, res) => {
  try {
    const parkingLocations = await ParkingLocation.find().sort({ createdAt: -1 })

    const activeBookings = await Booking.find({ bookingStatus: "active" })

    const locationsWithAvailableSlots = parkingLocations.map((location) => {
      const locationObj = location.toObject()

      const locationBookings = activeBookings.filter(
        (booking) => booking.locationId.toString() === location._id.toString(),
      )

      Object.keys(locationObj.slots).forEach((vehicleType) => {
        const bookedSlots = locationBookings.filter((booking) => booking.vehicleType === vehicleType).length

        locationObj.slots[vehicleType].available = locationObj.slots[vehicleType].total - bookedSlots
      })

      return locationObj
    })

    res.json(locationsWithAvailableSlots)
  } catch (error) {
    console.error("Get parking locations error:", error)
    res.status(500).json({ message: "Server error while fetching parking locations" })
  }
}

const getParkingLocationById = async (req, res) => {
  try {
    const parkingLocation = await ParkingLocation.findById(req.params.id)
    if (!parkingLocation) {
      return res.status(404).json({ message: "Parking location not found" })
    }

    const activeBookings = await Booking.find({
      locationId: req.params.id,
      bookingStatus: "active",
    })

    const locationObj = parkingLocation.toObject()

    Object.keys(locationObj.slots).forEach((vehicleType) => {
      const bookedSlots = activeBookings.filter((booking) => booking.vehicleType === vehicleType).length

      locationObj.slots[vehicleType].available = locationObj.slots[vehicleType].total - bookedSlots
    })

    res.json(locationObj)
  } catch (error) {
    console.error("Get parking location error:", error)
    res.status(500).json({ message: "Server error while fetching parking location" })
  }
}

const updateParkingLocation = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const parkingLocation = await ParkingLocation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!parkingLocation) {
      return res.status(404).json({ message: "Parking location not found" })
    }
    res.json(parkingLocation)
  } catch (error) {
    console.error("Update parking location error:", error)
    res.status(500).json({ message: "Server error during parking location update" })
  }
}

const deleteParkingLocation = async (req, res) => {
  try {
    const parkingLocation = await ParkingLocation.findByIdAndDelete(req.params.id)
    if (!parkingLocation) {
      return res.status(404).json({ message: "Parking location not found" })
    }
    await Booking.deleteMany({ locationId: req.params.id })
    res.json({ message: "Parking location deleted successfully" })
  } catch (error) {
    console.error("Delete parking location error:", error)
    res.status(500).json({ message: "Server error during parking location deletion" })
  }
}

module.exports = {
  createParkingLocation,
  getAllParkingLocations,
  getParkingLocationById,
  updateParkingLocation,
  deleteParkingLocation,
}
