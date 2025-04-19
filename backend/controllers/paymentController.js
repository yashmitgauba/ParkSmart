const crypto = require("crypto")
const Booking = require("../models/Booking")
const { RAZORPAY_SECRET } = require("../config/config")
const { createRazorpayOrder } = require("../utils/razorpay")

const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = req.body

    const order = await createRazorpayOrder({
      amount: amount * 100, 
      currency,
      receipt,
      notes,
    })

    res.json(order)
  } catch (error) {
    console.error("Create Razorpay order error:", error)
    res.status(500).json({ message: "Failed to create payment order" })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", RAZORPAY_SECRET).update(body.toString()).digest("hex")

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      await Booking.findByIdAndUpdate(bookingId, {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "completed",
      })

      res.json({ success: true, message: "Payment verified successfully" })
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" })
    }
  } catch (error) {
    console.error("Verify payment error:", error)
    res.status(500).json({ success: false, message: "Server error during payment verification" })
  }
}

module.exports = {
  createOrder,
  verifyPayment,
}
