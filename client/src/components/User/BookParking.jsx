"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  Search,
  MapPin,
  Car,
  Truck,
  Bike,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Tag,
  Loader,
} from "lucide-react"

const BookParking = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [filteredLocations, setFilteredLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState("")
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingForm, setBookingForm] = useState({
    vehicleNumber: "",
    driverLicense: "",
    hours: 1,
    startTime: new Date().toISOString().slice(0, 16),
    couponCode: "",
  })
  const [couponApplied, setCouponApplied] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [razorpayData, setRazorpayData] = useState(null)
  const [createdBookingId, setCreatedBookingId] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchLocations()

    
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [user, navigate])

  useEffect(() => {
    if (locations.length > 0) {
      applyFilters()
    }
  }, [locations, searchTerm])

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bookingStep === 1) {
        fetchLocations()
      }
    }, 30000)

    return () => clearInterval(intervalId)
  }, [bookingStep])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/parking-locations")
      setLocations(response.data)
      setFilteredLocations(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching parking locations:", error)
      setError("Failed to load parking locations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...locations]

    if (searchTerm) {
      result = result.filter(
        (location) =>
          location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.state.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredLocations(result)
  }

  const handleLocationSelect = async (location) => {
    try {
      
      const response = await axios.get(`http://localhost:5000/api/parking-locations/${location._id}`)
      setSelectedLocation(response.data)
      setBookingStep(2)
    } catch (error) {
      console.error("Error fetching location details:", error)
      setError("Failed to load location details. Please try again.")
    }
  }

  const handleVehicleTypeSelect = (type) => {
    
    if (selectedLocation.slots[type].available <= 0) {
      setError(`No available slots for ${type}. Please select another vehicle type.`)
      setTimeout(() => setError(""), 3000)
      return
    }

    setSelectedVehicleType(type)
    setBookingStep(3)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingForm({
      ...bookingForm,
      [name]: value,
    })
  }

  const applyCoupon = () => {
    if (bookingForm.couponCode === "PARK10") {
      setCouponApplied(true)
    } else {
      setError("Invalid coupon code")
      setTimeout(() => setError(""), 3000)
    }
  }

  const calculatePrice = () => {
    if (!selectedLocation || !selectedVehicleType) return 0

    const hourlyRate = selectedLocation.slots[selectedVehicleType].hourlyRate
    const totalPrice = hourlyRate * bookingForm.hours

    if (couponApplied) {
      return totalPrice * 0.9 
    }

    return totalPrice
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    try {
      setPaymentProcessing(true)
      const token = localStorage.getItem("parkingToken")

      const bookingData = {
        locationId: selectedLocation._id,
        vehicleType: selectedVehicleType,
        vehicleNumber: bookingForm.vehicleNumber,
        driverLicense: bookingForm.driverLicense,
        hours: Number.parseInt(bookingForm.hours),
        startTime: bookingForm.startTime,
        couponCode: couponApplied ? "PARK10" : "",
      }

      const response = await axios.post("http://localhost:5000/api/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setCreatedBookingId(response.data.booking._id)
      setRazorpayData(response.data.paymentDetails)

      
      openRazorpayCheckout(response.data.paymentDetails, response.data.booking)
    } catch (error) {
      console.error("Error creating booking:", error)
      setError(error.response?.data?.message || "Failed to create booking. Please try again.")
      setPaymentProcessing(false)
    }
  }

  const openRazorpayCheckout = (paymentDetails, booking) => {
    const options = {
      key: paymentDetails.keyId,
      amount: paymentDetails.amount * 100, 
      currency: paymentDetails.currency,
      name: "ParkSmart",
      description: `Booking for ${selectedVehicleType} at ${selectedLocation.name}`,
      order_id: paymentDetails.orderId,
      handler: (response) => {
        handlePaymentSuccess(response, booking._id)
      },
      prefill: {
        name: user.username,
        email: user.email,
        contact: user.phone,
      },
      notes: {
        bookingId: booking._id,
        vehicleType: selectedVehicleType,
        location: selectedLocation.name,
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: () => {
          setPaymentProcessing(false)
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const handlePaymentSuccess = async (response, bookingId) => {
    try {
      const paymentData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        bookingId: bookingId || createdBookingId,
      }

      await axios.post("http://localhost:5000/api/verify-payment", paymentData)

      setBookingSuccess(true)
      setPaymentProcessing(false)

      
      setTimeout(() => {
        setBookingSuccess(false)
        setSelectedLocation(null)
        setSelectedVehicleType("")
        setBookingForm({
          vehicleNumber: "",
          driverLicense: "",
          hours: 1,
          startTime: new Date().toISOString().slice(0, 16),
          couponCode: "",
        })
        setCouponApplied(false)
        setBookingStep(1)
        navigate("/my-bookings")
      }, 3000)
    } catch (error) {
      console.error("Error verifying payment:", error)
      setError("Payment verification failed. Please contact support.")
      setPaymentProcessing(false)
    }
  }

  
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

  if (loading && locations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h1 className="text-3xl font-bold text-gray-900 mb-6" variants={itemVariants}>
        Book Parking
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

      {bookingSuccess && (
        <motion.div
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700"
          variants={itemVariants}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Payment successful! Booking confirmed. Redirecting to your bookings...</span>
        </motion.div>
      )}

      {paymentProcessing && (
        <motion.div
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center text-blue-700"
          variants={itemVariants}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Loader className="h-5 w-5 mr-2 flex-shrink-0 animate-spin" />
          <span>Processing payment. Please do not close this window...</span>
        </motion.div>
      )}

      
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`h-2 rounded-full ${bookingStep >= 1 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              bookingStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className="flex-1 mx-2">
            <div className={`h-2 rounded-full ${bookingStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              bookingStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className="flex-1 mx-2">
            <div className={`h-2 rounded-full ${bookingStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              bookingStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
          <div className="flex-1">
            <div className={`h-2 rounded-full ${bookingStep >= 4 ? "bg-blue-600" : "bg-gray-200"}`}></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="text-center">
            <span className={bookingStep >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}>Select Location</span>
          </div>
          <div className="text-center">
            <span className={bookingStep >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}>Choose Vehicle</span>
          </div>
          <div className="text-center">
            <span className={bookingStep >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}>Enter Details</span>
          </div>
          <div className="text-center">
            <span className={bookingStep >= 4 ? "text-blue-600 font-medium" : "text-gray-500"}>Confirm</span>
          </div>
        </div>
      </motion.div>

      
      {bookingStep === 1 && (
        <>
          <motion.div className="mb-6 relative" variants={itemVariants}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for parking locations..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            {filteredLocations.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No parking locations found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((location) => (
                  <motion.div
                    key={location._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="p-6 cursor-pointer">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{location.name}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">
                          {location.address}, {location.city}, {location.state}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(location.slots).map(
                          ([type, data]) =>
                            data.total > 0 && (
                              <div
                                key={type}
                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                                  data.available > 0 ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {type === "car" && <Car className="h-3 w-3 mr-1" />}
                                {type === "jeep" && <Car className="h-3 w-3 mr-1" />}
                                {type === "truck" && <Truck className="h-3 w-3 mr-1" />}
                                {type === "twoWheeler" && <Bike className="h-3 w-3 mr-1" />}
                                {type === "auto" && <Car className="h-3 w-3 mr-1" />}
                                {type === "other" && <Car className="h-3 w-3 mr-1" />}
                                {type.charAt(0).toUpperCase() + type.slice(1)}: {data.available}/{data.total}
                              </div>
                            ),
                        )}
                      </div>

                      <button className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                        Select Location
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}

      
      {bookingStep === 2 && selectedLocation && (
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Selected Location</h2>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span>
                {selectedLocation.name} - {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Vehicle Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(selectedLocation.slots).map(
              ([type, data]) =>
                data.total > 0 && (
                  <motion.div
                    key={type}
                    className={`p-4 rounded-lg border cursor-pointer hover:border-blue-500 transition-colors ${
                      data.available > 0 ? "bg-gray-50 border-gray-200" : "bg-red-50 border-red-200 opacity-60"
                    }`}
                    whileHover={{ scale: data.available > 0 ? 1.03 : 1 }}
                    onClick={() => data.available > 0 && handleVehicleTypeSelect(type)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {type === "car" && <Car className="h-6 w-6 text-blue-600 mr-2" />}
                        {type === "jeep" && <Car className="h-6 w-6 text-green-600 mr-2" />}
                        {type === "truck" && <Truck className="h-6 w-6 text-red-600 mr-2" />}
                        {type === "twoWheeler" && <Bike className="h-6 w-6 text-indigo-600 mr-2" />}
                        {type === "auto" && <Car className="h-6 w-6 text-yellow-600 mr-2" />}
                        {type === "other" && <Car className="h-6 w-6 text-purple-600 mr-2" />}
                        <h4 className="font-medium text-gray-800 capitalize">{type}</h4>
                      </div>
                      <div className="text-sm font-bold text-gray-900">₹{data.hourlyRate}/hr</div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Available Slots: {data.available} / {data.total}
                    </div>
                    <button
                      className={`w-full py-2 font-medium rounded-md transition-colors ${
                        data.available > 0
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={data.available <= 0}
                    >
                      {data.available > 0 ? "Select" : "No Slots Available"}
                    </button>
                  </motion.div>
                ),
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setBookingStep(1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </div>
        </motion.div>
      )}

      
      {bookingStep === 3 && selectedLocation && selectedVehicleType && (
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Details</h2>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              <span>{selectedLocation.name}</span>
            </div>
            <div className="flex items-center text-gray-600">
              {selectedVehicleType === "car" && <Car className="h-5 w-5 mr-2 text-blue-600" />}
              {selectedVehicleType === "jeep" && <Car className="h-5 w-5 mr-2 text-green-600" />}
              {selectedVehicleType === "truck" && <Truck className="h-5 w-5 mr-2 text-red-600" />}
              {selectedVehicleType === "twoWheeler" && <Bike className="h-5 w-5 mr-2 text-indigo-600" />}
              {selectedVehicleType === "auto" && <Car className="h-5 w-5 mr-2 text-yellow-600" />}
              {selectedVehicleType === "other" && <Car className="h-5 w-5 mr-2 text-purple-600" />}
              <span className="capitalize">{selectedVehicleType}</span>
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                ₹{selectedLocation.slots[selectedVehicleType].hourlyRate}/hr
              </span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setBookingStep(4)
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={bookingForm.vehicleNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., MH01AB1234"
                  required
                />
              </div>

              <div>
                <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700 mb-1">
                  Driver License Number
                </label>
                <input
                  type="text"
                  id="driverLicense"
                  name="driverLicense"
                  value={bookingForm.driverLicense}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DL1234567890123"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      value={bookingForm.startTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (hours)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="hours"
                      name="hours"
                      value={bookingForm.hours}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="24"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code (Optional)
                </label>
                <div className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="couponCode"
                      name="couponCode"
                      value={bookingForm.couponCode}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter coupon code"
                      disabled={couponApplied}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={couponApplied || !bookingForm.couponCode}
                    className={`px-4 py-2 rounded-r-lg font-medium ${
                      couponApplied ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors`}
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {couponApplied && <p className="mt-1 text-sm text-green-600">10% discount applied successfully!</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setBookingStep(2)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        </motion.div>
      )}

      
      {bookingStep === 4 && selectedLocation && selectedVehicleType && (
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirm Booking</h2>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Parking Location</p>
                    <p className="font-medium">{selectedLocation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Type</p>
                    <p className="font-medium capitalize">{selectedVehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Number</p>
                    <p className="font-medium">{bookingForm.vehicleNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Driver License</p>
                    <p className="font-medium">{bookingForm.driverLicense}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Time Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Start Time</p>
                      <p className="font-medium">{new Date(bookingForm.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{bookingForm.hours} hours</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Time</p>
                      <p className="font-medium">
                        {new Date(
                          new Date(bookingForm.startTime).getTime() + bookingForm.hours * 60 * 60 * 1000,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Hourly Rate</p>
                      <p className="font-medium">₹{selectedLocation.slots[selectedVehicleType].hourlyRate}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{bookingForm.hours} hours</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="font-medium">
                        ₹{selectedLocation.slots[selectedVehicleType].hourlyRate * bookingForm.hours}
                      </p>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <p className="text-sm">Discount (10%)</p>
                        <p className="font-medium">
                          -₹
                          {(selectedLocation.slots[selectedVehicleType].hourlyRate * bookingForm.hours * 0.1).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <p className="font-medium">Total Amount</p>
                      <p className="font-bold text-lg">₹{calculatePrice().toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setBookingStep(3)}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              disabled={paymentProcessing}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={paymentProcessing}
              className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                paymentProcessing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {paymentProcessing ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default BookParking
