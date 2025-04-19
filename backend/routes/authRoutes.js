const express = require("express")
const router = express.Router()
const { signup, login, getUserProfile } = require("../controllers/authController")
const { validateSignup, validateLogin } = require("../middleware/validators")
const { authenticateToken } = require("../middleware/auth")

router.post("/signup", validateSignup, signup)
router.post("/login", validateLogin, login)
router.get("/user", authenticateToken, getUserProfile)

module.exports = router
