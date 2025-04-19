"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  Calendar,
  MapPin,
  Car,
  Truck,
  Bike,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const UserBookings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedBooking, setExpandedBooking] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchBookings()

    
    const intervalId = setInterval(fetchBookings, 60000)

    return () => clearInterval(intervalId)
  }, [user, navigate])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("parkingToken")

      const response = await axios.get("http://localhost:5000/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setBookings(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("Failed to load your bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const token = localStorage.getItem("parkingToken")

        await axios.put(
          `http://localhost:5000/api/bookings/${id}/cancel`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        setSuccess("Booking cancelled successfully!")
        fetchBookings()

        
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } catch (error) {
        console.error("Error cancelling booking:", error)
        setError(error.response?.data?.message || "Failed to cancel booking. Please try again.")
      }
    }
  }

  const toggleExpand = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id)
  }

  const filteredBookings =
    statusFilter === "all" ? bookings : bookings.filter((booking) => booking.bookingStatus === statusFilter)

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h1 className="text-3xl font-bold text-gray-900 mb-6" variants={itemVariants}>
        My Bookings
      </motion.h1>

      {error && (
        <motion.div
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
          variants={itemVariants}
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700"
          variants={itemVariants}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      <motion.div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between" variants={itemVariants}>
        <div className="flex items-center mb-4 sm:mb-0">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700 mr-2">Filter by status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={() => navigate("/book")}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Book New Parking
        </button>
      </motion.div>

      {filteredBookings.length === 0 ? (
        <motion.div
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
          variants={itemVariants}
        >
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === "all"
              ? "You haven't made any bookings yet."
              : `You don't have any ${statusFilter} bookings.`}
          </p>
          <button
            onClick={() => navigate("/book")}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Book Parking Now
          </button>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
              variants={itemVariants}
              layout
            >
              <div className="p-6 cursor-pointer" onClick={() => toggleExpand(booking._id)}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">{booking.locationId.name}</h3>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(booking.startTime).toLocaleDateString()}{" "}
                        {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{booking.hours} hours</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="flex items-center mb-1">
                        {booking.vehicleType === "car" && <Car className="h-4 w-4 text-blue-600 mr-1" />}
                        {booking.vehicleType === "jeep" && <Car className="h-4 w-4 text-green-600 mr-1" />}
                        {booking.vehicleType === "truck" && <Truck className="h-4 w-4 text-red-600 mr-1" />}
                        {booking.vehicleType === "twoWheeler" && <Bike className="h-4 w-4 text-indigo-600 mr-1" />}
                        {booking.vehicleType === "auto" && <Car className="h-4 w-4 text-yellow-600 mr-1" />}
                        {booking.vehicleType === "other" && <Car className="h-4 w-4 text-purple-600 mr-1" />}
                        <span className="text-sm font-medium capitalize">{booking.vehicleType}</span>
                      </div>
                      <div className="text-sm text-gray-600">{booking.vehicleNumber}</div>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.bookingStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : booking.bookingStatus === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    {expandedBooking === booking._id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                    )}
                  </div>
                </div>
              </div>

              {expandedBooking === booking._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Booking Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Booking ID:</span>
                            <span className="font-medium">{booking._id.substring(0, 8)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Time:</span>
                            <span className="font-medium">{new Date(booking.startTime).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">End Time:</span>
                            <span className="font-medium">{new Date(booking.endTime).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{booking.hours} hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Type:</span>
                            <span className="font-medium capitalize">{booking.vehicleType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle Number:</span>
                            <span className="font-medium">{booking.vehicleNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Driver License:</span>
                            <span className="font-medium">{booking.driverLicense}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium">₹{booking.finalAmount.toFixed(2)}</span>
                          </div>
                          {booking.discountApplied > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount Applied:</span>
                              <span className="font-medium">₹{booking.discountApplied.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span
                              className={`font-medium ${
                                booking.paymentStatus === "completed" ? "text-green-600" : "text-yellow-600"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Booking Status:</span>
                            <span
                              className={`font-medium ${
                                booking.bookingStatus === "active"
                                  ? "text-green-600"
                                  : booking.bookingStatus === "completed"
                                    ? "text-blue-600"
                                    : "text-red-600"
                              }`}
                            >
                              {booking.bookingStatus}
                            </span>
                          </div>
                          {booking.razorpayPaymentId && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payment ID:</span>
                              <span className="font-medium">{booking.razorpayPaymentId}</span>
                            </div>
                          )}
                        </div>

                        {booking.bookingStatus === "active" && (
                          <div className="mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCancelBooking(booking._id)
                              }}
                              className="w-full py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                            >
                              <XCircle className="h-5 w-5 mr-2" />
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default UserBookings
