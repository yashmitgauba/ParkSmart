"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import {
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  X,
} from "lucide-react"

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [vehicleFilter, setVehicleFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [bookings, searchTerm, statusFilter, vehicleFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/bookings")
      setBookings(response.data)
      setFilteredBookings(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching bookings:", error)
      setError("Failed to load bookings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...bookings]

    
    if (searchTerm) {
      result = result.filter(
        (booking) =>
          booking.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.locationId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    
    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.bookingStatus === statusFilter)
    }

    
    if (vehicleFilter !== "all") {
      result = result.filter((booking) => booking.vehicleType === vehicleFilter)
    }

    setFilteredBookings(result)
  }

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`)
        setSuccess("Booking deleted successfully!")
        fetchBookings()

        
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } catch (error) {
        console.error("Error deleting booking:", error)
        setError(error.response?.data?.message || "Failed to delete booking. Please try again.")
      }
    }
  }

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedBooking(null)
  }

  const exportToCSV = () => {
    
    const headers = ["User", "Email", "Location", "Vehicle Type", "Vehicle Number", "Hours", "Amount", "Status", "Date"]
    const csvRows = [headers]

    filteredBookings.forEach((booking) => {
      const row = [
        booking.userId?.username || "Unknown",
        booking.userId?.email || "Unknown",
        booking.locationId?.name || "Unknown",
        booking.vehicleType,
        booking.vehicleNumber,
        booking.hours,
        booking.finalAmount.toFixed(2),
        booking.bookingStatus,
        new Date(booking.createdAt).toLocaleDateString(),
      ]
      csvRows.push(row)
    })

    
    const csvContent = csvRows.map((row) => row.join(",")).join("\n")

    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  const filterVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
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
    <motion.div className="p-6 bg-gray-50 min-h-screen" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bookings</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
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

      
      <motion.div className="mb-6 relative" variants={itemVariants}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by user, email, vehicle number or location..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>


      {showFilters && (
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6"
          variants={filterVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Booking Status
              </label>
              <select
                id="statusFilter"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label htmlFor="vehicleFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                id="vehicleFilter"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="all">All Vehicles</option>
                <option value="car">Car</option>
                <option value="jeep">Jeep</option>
                <option value="truck">Truck</option>
                <option value="twoWheeler">Two Wheeler</option>
                <option value="auto">Auto</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" variants={itemVariants}>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Bookings</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter((b) => b.bookingStatus === "active").length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {bookings.filter((b) => b.bookingStatus === "completed").length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{bookings.reduce((sum, booking) => sum + booking.finalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.userId?.username || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500">{booking.userId?.email || "Unknown"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.locationId?.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">
                        {booking.locationId?.city}, {booking.locationId?.state}
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Booking"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Booking ID</h3>
                  <p className="text-base font-medium text-gray-900 mb-4">{selectedBooking._id}</p>

                  <h3 className="text-sm font-medium text-gray-500 mb-1">User</h3>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        {selectedBooking.userId?.username || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">{selectedBooking.userId?.email || "Unknown"}</p>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-base font-medium text-gray-900 mb-1">
                    {selectedBooking.locationId?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedBooking.locationId?.address}, {selectedBooking.locationId?.city},{" "}
                    {selectedBooking.locationId?.state}
                  </p>

                  <h3 className="text-sm font-medium text-gray-500 mb-1">Vehicle Details</h3>
                  <p className="text-base font-medium text-gray-900 mb-1 capitalize">{selectedBooking.vehicleType}</p>
                  <p className="text-sm text-gray-500 mb-4">{selectedBooking.vehicleNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Booking Status</h3>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mb-4 ${
                      selectedBooking.bookingStatus === "active"
                        ? "bg-green-100 text-green-800"
                        : selectedBooking.bookingStatus === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedBooking.bookingStatus}
                  </span>

                  <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <p className="text-base font-medium text-gray-900 mb-1">{selectedBooking.hours} hours</p>
                  <p className="text-sm text-gray-500 mb-4">
                    From: {new Date(selectedBooking.startTime).toLocaleString()}
                    <br />
                    To:{" "}
                    {new Date(
                      new Date(selectedBooking.startTime).getTime() + selectedBooking.hours * 60 * 60 * 1000,
                    ).toLocaleString()}
                  </p>

                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Details</h3>
                  <p className="text-base font-medium text-gray-900 mb-1">₹{selectedBooking.finalAmount.toFixed(2)}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Base Price: ₹{selectedBooking.baseAmount?.toFixed(2) || "N/A"}</p>
                    {selectedBooking.discountApplied > 0 && (
                      <p className="text-green-600">Discount: ₹{selectedBooking.discountApplied.toFixed(2)}</p>
                    )}
                    {selectedBooking.paymentId && <p className="mt-1">Payment ID: {selectedBooking.paymentId}</p>}
                  </div>

                  <h3 className="text-sm font-medium text-gray-500 mb-1">Booking Date</h3>
                  <p className="text-base font-medium text-gray-900 mb-4">
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              
              {selectedBooking.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes / Special Requests</h3>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminBookings
