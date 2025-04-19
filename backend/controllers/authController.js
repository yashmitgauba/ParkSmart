const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const User = require("../models/User")
const { JWT_SECRET } = require("../config/config")


const signup = async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { username, email, password, phone, state, city } = req.body

  try {

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    const user = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      state,
      city,
    })


    await user.save()


    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    })

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      state: user.state,
      city: user.city,
    }

    res.status(201).json({ user: userData, token })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: "Server error during signup" })
  }
}


const login = async (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }


    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    })


    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      state: user.state,
      city: user.city,
    }

    res.status(200).json({ user: userData, token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
}


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  signup,
  login,
  getUserProfile,
}
