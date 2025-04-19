const express = require("express")
const router = express.Router()
const {
  createParkingLocation,
  getAllParkingLocations,
  getParkingLocationById,
  updateParkingLocation,
  deleteParkingLocation,
} = require("../controllers/parkingLocationController")
const { validateParkingLocation } = require("../middleware/validators")

router.post("/", validateParkingLocation, createParkingLocation)
router.get("/", getAllParkingLocations)
router.get("/:id", getParkingLocationById)
router.put("/:id", validateParkingLocation, updateParkingLocation)
router.delete("/:id", deleteParkingLocation)

module.exports = router
