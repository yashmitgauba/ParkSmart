const express = require("express")
const router = express.Router()
const { createOrder, verifyPayment } = require("../controllers/paymentController")
const { authenticateToken } = require("../middleware/auth")

router.post("/create-order", authenticateToken, createOrder)
router.post("/verify-payment", verifyPayment)

module.exports = router
