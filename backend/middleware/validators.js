const { body } = require("express-validator")

const validateSignup = [
  body("username").isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters").trim(),
  body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Please enter a valid 10-digit phone number"),
  body("state").notEmpty().withMessage("State is required"),
  body("city").notEmpty().withMessage("City is required"),
]

const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
]

const validateParkingLocation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("totalSlots").isInt({ min: 1 }).withMessage("Total slots must be at least 1"),
  body("slots.car.total").isInt({ min: 0 }).withMessage("Car slots must be a non-negative integer"),
  body("slots.car.hourlyRate").isFloat({ min: 0 }).withMessage("Car hourly rate must be a non-negative number"),
  body("slots.jeep.total").isInt({ min: 0 }).withMessage("Jeep slots must be a non-negative integer"),
  body("slots.jeep.hourlyRate").isFloat({ min: 0 }).withMessage("Jeep hourly rate must be a non-negative number"),
  body("slots.truck.total").isInt({ min: 0 }).withMessage("Truck slots must be a non-negative integer"),
  body("slots.truck.hourlyRate").isFloat({ min: 0 }).withMessage("Truck hourly rate must be a non-negative number"),
  body("slots.twoWheeler.total").isInt({ min: 0 }).withMessage("Two-wheeler slots must be a non-negative integer"),
  body("slots.twoWheeler.hourlyRate")
    .isFloat({ min: 0 })
    .withMessage("Two-wheeler hourly rate must be a non-negative number"),
  body("slots.auto.total").isInt({ min: 0 }).withMessage("Auto slots must be a non-negative integer"),
  body("slots.auto.hourlyRate").isFloat({ min: 0 }).withMessage("Auto hourly rate must be a non-negative number"),
  body("slots.other.total").isInt({ min: 0 }).withMessage("Other slots must be a non-negative integer"),
  body("slots.other.hourlyRate").isFloat({ min: 0 }).withMessage("Other hourly rate must be a non-negative number"),
]

const validateBooking = [
  body("locationId").notEmpty().withMessage("Location ID is required"),
  body("vehicleType").isIn(["car", "jeep", "truck", "twoWheeler", "auto", "other"]).withMessage("Invalid vehicle type"),
  body("vehicleNumber").notEmpty().withMessage("Vehicle number is required"),
  body("driverLicense").notEmpty().withMessage("Driver license is required"),
  body("hours").isInt({ min: 1 }).withMessage("Hours must be at least 1"),
  body("startTime").isISO8601().withMessage("Start time must be a valid date"),
]

module.exports = {
  validateSignup,
  validateLogin,
  validateParkingLocation,
  validateBooking,
}
