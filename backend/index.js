const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const { PORT } = require("./config/config")
const { updateCompletedBookings } = require("./utils/bookingUpdater")

const authRoutes = require("./routes/authRoutes")
const parkingLocationRoutes = require("./routes/parkingLocationRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

const app = express()

connectDB()

app.use(express.json())
app.use(cors())

app.use("/api", authRoutes)
app.use("/api/parking-locations", parkingLocationRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api", paymentRoutes)
app.use("/api/stats", dashboardRoutes)

setInterval(updateCompletedBookings, 60000)

updateCompletedBookings()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
