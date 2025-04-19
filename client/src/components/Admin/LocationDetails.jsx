"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  Car,
  Truck,
  Bike,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react"

const LocationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        setLoading(true)
        const locationResponse = await axios.get(`http://localhost:5000/api/parking-locations/${id}`)
        setLocation(locationResponse.data)

        
        const bookingsResponse = await axios.get("http://localhost:5000/api/bookings")
        const locationBookings = bookingsResponse.data.filter((booking) => booking.locationId._id === id)
        setBookings(locationBookings)

        setError("")
      } catch (error) {
        console.error("Error fetching location details:", error)
        setError("Failed to load location details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchLocationDetails()
  }, [id])

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`)
        setSuccess("Booking deleted successfully!")

        
        setBookings(bookings.filter((booking) => booking._id !== bookingId))

        
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } catch (error) {
        console.error("Error deleting booking:", error)
        setError(error.response?.data?.message || "Failed to delete booking. Please try again.")
      }
    }
  }

  
  const calculateSlotStats = () => {
    if (!location) return {}

    const totalSlots = {
      car: location.slots.car.total,
      jeep: location.slots.jeep.total,
      truck: location.slots.truck.total,
      twoWheeler: location.slots.twoWheeler.total,
      auto: location.slots.auto.total,
      other: location.slots.other.total,
    }

    const bookedSlots = {
      car: 0,
      jeep: 0,
      truck: 0,
      twoWheeler: 0,
      auto: 0,
      other: 0,
    }

    
    bookings.forEach((booking) => {
      if (booking.bookingStatus === "active") {
        bookedSlots[booking.vehicleType]++
      }
    })

    
    const availableSlots = {
      car: totalSlots.car - bookedSlots.car,
      jeep: totalSlots.jeep - bookedSlots.jeep,
      truck: totalSlots.truck - bookedSlots.truck,
      twoWheeler: totalSlots.twoWheeler - bookedSlots.twoWheeler,
      auto: totalSlots.auto - bookedSlots.auto,
      other: totalSlots.other - bookedSlots.other,
    }

    return { totalSlots, bookedSlots, availableSlots }
  }

  const slotStats = calculateSlotStats()


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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Location not found</h3>
          <p className="text-gray-600 mb-4">
            The parking location you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/parking-locations")}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Locations
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div className="p-6 bg-gray-50 min-h-screen" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex items-center mb-6" variants={itemVariants}>
        <button
          onClick={() => navigate("/admin/parking-locations")}
          className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{location.name}</h1>
      </motion.div>

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
          exit={{ opacity: 0, y: -10 }}
        >
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      
      <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6" variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span>
                {location.address}, {location.city}, {location.state}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Total Slots: {location.totalSlots}
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active Bookings: {bookings.filter((b) => b.bookingStatus === "active").length}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      
      <motion.div className="mb-6 border-b border-gray-200" variants={itemVariants}>
        <div className="flex space-x-8">
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "bookings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
        </div>
      </motion.div>

      
      {activeTab === "overview" ? (
        <motion.div variants={itemVariants}>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Slot Availability</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Cars</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900">₹{location.slots.car.hourlyRate}/hr</div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {slotStats.availableSlots?.car || 0} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {slotStats.totalSlots?.car || 0} Total
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{
                        width: `${
                          slotStats.totalSlots?.car
                            ? ((slotStats.totalSlots.car - slotStats.availableSlots.car) / slotStats.totalSlots.car) *
                              100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    ></div>
                  </div>
                </div>
              </div>

              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Jeeps</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900">₹{location.slots.jeep.hourlyRate}/hr</div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-green-600">
                        {slotStats.availableSlots?.jeep || 0} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {slotStats.totalSlots?.jeep || 0} Total
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                    <div
                      style={{
                        width: `${
                          slotStats.totalSlots?.jeep
                            ? (
                                (slotStats.totalSlots.jeep - slotStats.availableSlots.jeep) / slotStats.totalSlots.jeep
                              ) * 100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-600"
                    ></div>
                  </div>
                </div>
              </div>

              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Trucks</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900">₹{location.slots.truck.hourlyRate}/hr</div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-red-600">
                        {slotStats.availableSlots?.truck || 0} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {slotStats.totalSlots?.truck || 0} Total
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                    <div
                      style={{
                        width: `${
                          slotStats.totalSlots?.truck
                            ? (
                                (slotStats.totalSlots.truck - slotStats.availableSlots.truck) /
                                  slotStats.totalSlots.truck
                              ) * 100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600"
                    ></div>
                  </div>
                </div>
              </div>

              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Bike className="h-5 w-5 text-indigo-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Two Wheelers</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900">₹{location.slots.twoWheeler.hourlyRate}/hr</div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {slotStats.availableSlots?.twoWheeler || 0} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {slotStats.totalSlots?.twoWheeler || 0} Total
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      style={{
                        width: `${
                          slotStats.totalSlots?.twoWheeler
                            ? (
                                (slotStats.totalSlots.twoWheeler - slotStats.availableSlots.twoWheeler) /
                                  slotStats.totalSlots.twoWheeler
                              ) * 100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                    ></div>
                  </div>
                </div>
              </div>


              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Autos</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900">₹{location.slots.auto.hourlyRate}/hr</div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-yellow-600">
                        {slotStats.availableSlots?.auto || 0} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {slotStats.totalSlots?.auto || 0} Total
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
                    <div
                      style={{
                        width: `${
                          slotStats.totalSlots?.auto
                            ? (
                                (slotStats.totalSlots.auto - slotStats.availableSlots.auto) / slotStats.totalSlots.auto
                              ) * 100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-600"
                    ></div>
                  </div>
                </div>
              </div>


              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Others</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900">₹{location.slots.other.hourlyRate}/hr</div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        {slotStats.availableSlots?.other || 0} Available
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {slotStats.totalSlots?.other || 0} Total
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div
                      style={{
                        width: `${
                          slotStats.totalSlots?.other
                            ? (
                                (slotStats.totalSlots.other - slotStats.availableSlots.other) /
                                  slotStats.totalSlots.other
                              ) * 100
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-800">Total Bookings</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-gray-800">Active Bookings</h4>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.filter((b) => b.bookingStatus === "active").length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="font-medium text-gray-800">Total Revenue</h4>
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{bookings.reduce((sum, booking) => sum + booking.finalAmount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{booking.userId.username}</div>
                              <div className="text-sm text-gray-500">{booking.userId.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{booking.vehicleType}</div>
                          <div className="text-sm text-gray-500">{booking.vehicleNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.hours} hours</div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.startTime).toLocaleDateString()}{" "}
                            {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{booking.finalAmount.toFixed(2)}</div>
                          {booking.discountApplied > 0 && (
                            <div className="text-xs text-green-600">Saved ₹{booking.discountApplied.toFixed(2)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.bookingStatus === "active"
                                ? "bg-green-100 text-green-800"
                                : booking.bookingStatus === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No bookings found for this location
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default LocationDetails
