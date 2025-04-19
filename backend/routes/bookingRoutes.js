const express = require("express")
const router = express.Router()
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  deleteBooking,
} = require("../controllers/bookingController")
const { validateBooking } = require("../middleware/validators")
const { authenticateToken } = require("../middleware/auth")

router.post("/", authenticateToken, validateBooking, createBooking)
router.get("/", getAllBookings)
router.get("/user", authenticateToken, getUserBookings)
router.get("/:id", getBookingById)
router.put("/:id/cancel", authenticateToken, cancelBooking)
router.delete("/:id", deleteBooking)

module.exports = router
