const Razorpay = require("razorpay")
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET } = require("../config/config")

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET,
})

const createRazorpayOrder = async (options) => {
  try {
    const order = await razorpay.orders.create(options)
    return order
  } catch (error) {
    console.error("Razorpay order creation error:", error)
    throw new Error("Failed to create payment order")
  }
}

module.exports = {
  razorpay,
  createRazorpayOrder,
}
