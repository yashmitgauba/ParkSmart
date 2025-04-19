"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { ParkingCircle, Users, Calendar, DollarSign, ChevronRight, AlertCircle } from "lucide-react"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLocations: 0,
    activeBookings: 0,
    totalRevenue: 0,
    bookingsByVehicleType: [],
    recentBookings: [],
    monthlyRevenue: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/api/stats")
        setStats(response.data)
        setError("")
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  
  const formatMonthlyRevenue = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return stats.monthlyRevenue.map((item) => ({
      name: months[item._id.month - 1],
      revenue: item.total,
    }))
  }

  
  const formatVehicleTypeData = () => {
    const vehicleTypeNames = {
      car: "Cars",
      jeep: "Jeeps",
      truck: "Trucks",
      twoWheeler: "Two Wheelers",
      auto: "Autos",
      other: "Others",
    }

    return stats.bookingsByVehicleType.map((item) => ({
      name: vehicleTypeNames[item._id] || item._id,
      value: item.count,
    }))
  }

  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]


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

  return (
    <motion.div className="p-6 bg-gray-50 min-h-screen" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
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


      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center"
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center"
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <ParkingCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Parking Locations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalLocations}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center"
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Active Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center"
          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
          </div>
        </motion.div>
      </motion.div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formatMonthlyRevenue()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#93c5fd" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        
        <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings by Vehicle Type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatVehicleTypeData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {formatVehicleTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} bookings`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        
        <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Booking Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { hour: "6-9 AM", bookings: 12 },
                  { hour: "9-12 PM", bookings: 19 },
                  { hour: "12-3 PM", bookings: 15 },
                  { hour: "3-6 PM", bookings: 18 },
                  { hour: "6-9 PM", bookings: 22 },
                  { hour: "9-12 AM", bookings: 8 },
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>


        <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Occupancy Rate</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { day: "Mon", rate: 65 },
                  { day: "Tue", rate: 59 },
                  { day: "Wed", rate: 80 },
                  { day: "Thu", rate: 81 },
                  { day: "Fri", rate: 90 },
                  { day: "Sat", rate: 78 },
                  { day: "Sun", rate: 70 },
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#3b82f6" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>


      <motion.div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8" variants={itemVariants}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentBookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.userId?.username || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.locationId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {booking.vehicleType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{booking.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString()}
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
                </tr>
              ))}
              {stats.recentBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center">
            View all bookings
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
