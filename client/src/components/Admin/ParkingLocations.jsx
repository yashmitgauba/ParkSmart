"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Car,
  Truck,
  Bike,
  AlertCircle,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const ParkingLocations = () => {
  const navigate = useNavigate()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedLocation, setExpandedLocation] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    totalSlots: 0,
    slots: {
      car: { total: 0, hourlyRate: 0 },
      jeep: { total: 0, hourlyRate: 0 },
      truck: { total: 0, hourlyRate: 0 },
      twoWheeler: { total: 0, hourlyRate: 0 },
      auto: { total: 0, hourlyRate: 0 },
      other: { total: 0, hourlyRate: 0 },
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/parking-locations")
      setLocations(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching parking locations:", error)
      setError("Failed to load parking locations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [category, field] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        slots: {
          ...prev.slots,
          [category]: {
            ...prev.slots[category],
            [field]: Number.parseFloat(value) || 0,
          },
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "totalSlots" ? Number.parseInt(value) || 0 : value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/parking-locations/${editId}`, formData)
        setSuccess("Parking location updated successfully!")
      } else {
        await axios.post("http://localhost:5000/api/parking-locations", formData)
        setSuccess("Parking location added successfully!")
      }

      
      resetForm()
      fetchLocations()

      
      setTimeout(() => {
        setSuccess("")
      }, 3000)
    } catch (error) {
      console.error("Error saving parking location:", error)
      setError(error.response?.data?.message || "Failed to save parking location. Please try again.")
    }
  }

  const handleEdit = (location) => {
    setFormData({
      name: location.name,
      address: location.address,
      state: location.state,
      city: location.city,
      totalSlots: location.totalSlots,
      slots: {
        car: {
          total: location.slots.car.total,
          hourlyRate: location.slots.car.hourlyRate,
        },
        jeep: {
          total: location.slots.jeep.total,
          hourlyRate: location.slots.jeep.hourlyRate,
        },
        truck: {
          total: location.slots.truck.total,
          hourlyRate: location.slots.truck.hourlyRate,
        },
        twoWheeler: {
          total: location.slots.twoWheeler.total,
          hourlyRate: location.slots.twoWheeler.hourlyRate,
        },
        auto: {
          total: location.slots.auto.total,
          hourlyRate: location.slots.auto.hourlyRate,
        },
        other: {
          total: location.slots.other.total,
          hourlyRate: location.slots.other.hourlyRate,
        },
      },
    })
    setIsEditing(true)
    setEditId(location._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this parking location? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:5000/api/parking-locations/${id}`)
        setSuccess("Parking location deleted successfully!")
        fetchLocations()

        
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } catch (error) {
        console.error("Error deleting parking location:", error)
        setError(error.response?.data?.message || "Failed to delete parking location. Please try again.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      state: "",
      city: "",
      totalSlots: 0,
      slots: {
        car: { total: 0, hourlyRate: 0 },
        jeep: { total: 0, hourlyRate: 0 },
        truck: { total: 0, hourlyRate: 0 },
        twoWheeler: { total: 0, hourlyRate: 0 },
        auto: { total: 0, hourlyRate: 0 },
        other: { total: 0, hourlyRate: 0 },
      },
    })
    setIsEditing(false)
    setEditId(null)
    setShowForm(false)
  }

  const toggleExpand = (id) => {
    setExpandedLocation(expandedLocation === id ? null : id)
  }

  const viewLocationDetails = (id) => {
    navigate(`/admin/parking-locations/${id}`)
  }

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  
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

  const formVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3 },
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
    <motion.div className="p-6 bg-gray-50 min-h-screen" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-center mb-6">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-gray-900" variants={itemVariants}>
          Parking Locations
        </motion.h1>
        <motion.button
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
          onClick={() => setShowForm(!showForm)}
          variants={itemVariants}
        >
          {showForm ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Location
            </>
          )}
        </motion.button>
      </div>

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

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isEditing ? "Edit Parking Location" : "Add New Parking Location"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Downtown Parking"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="California"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="San Francisco"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="totalSlots" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    id="totalSlots"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>

              <h3 className="text-md font-medium text-gray-800 mb-3">Slot Distribution & Pricing</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Car className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Cars</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="car.total" className="block text-sm text-gray-600 mb-1">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        id="car.total"
                        name="car.total"
                        value={formData.slots.car.total}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="car.hourlyRate" className="block text-sm text-gray-600 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        id="car.hourlyRate"
                        name="car.hourlyRate"
                        value={formData.slots.car.hourlyRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Car className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Jeeps</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="jeep.total" className="block text-sm text-gray-600 mb-1">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        id="jeep.total"
                        name="jeep.total"
                        value={formData.slots.jeep.total}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="jeep.hourlyRate" className="block text-sm text-gray-600 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        id="jeep.hourlyRate"
                        name="jeep.hourlyRate"
                        value={formData.slots.jeep.hourlyRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Truck className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Trucks</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="truck.total" className="block text-sm text-gray-600 mb-1">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        id="truck.total"
                        name="truck.total"
                        value={formData.slots.truck.total}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="truck.hourlyRate" className="block text-sm text-gray-600 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        id="truck.hourlyRate"
                        name="truck.hourlyRate"
                        value={formData.slots.truck.hourlyRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Bike className="h-5 w-5 text-indigo-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Two Wheelers</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="twoWheeler.total" className="block text-sm text-gray-600 mb-1">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        id="twoWheeler.total"
                        name="twoWheeler.total"
                        value={formData.slots.twoWheeler.total}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="twoWheeler.hourlyRate" className="block text-sm text-gray-600 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        id="twoWheeler.hourlyRate"
                        name="twoWheeler.hourlyRate"
                        value={formData.slots.twoWheeler.hourlyRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Car className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Autos</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="auto.total" className="block text-sm text-gray-600 mb-1">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        id="auto.total"
                        name="auto.total"
                        value={formData.slots.auto.total}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="auto.hourlyRate" className="block text-sm text-gray-600 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        id="auto.hourlyRate"
                        name="auto.hourlyRate"
                        value={formData.slots.auto.hourlyRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    <Car className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-gray-800">Others</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="other.total" className="block text-sm text-gray-600 mb-1">
                        Number of Slots
                      </label>
                      <input
                        type="number"
                        id="other.total"
                        name="other.total"
                        value={formData.slots.other.total}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="other.hourlyRate" className="block text-sm text-gray-600 mb-1">
                        Hourly Rate (₹)
                      </label>
                      <input
                        type="number"
                        id="other.hourlyRate"
                        name="other.hourlyRate"
                        value={formData.slots.other.hourlyRate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? "Update Location" : "Add Location"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      
      <motion.div className="mb-6 relative" variants={itemVariants}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search locations by name, address, city or state..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>


      {filteredLocations.length === 0 ? (
        <motion.div
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
          variants={itemVariants}
        >
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parking locations found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Add your first parking location to get started"}
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Location
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          {filteredLocations.map((location) => (
            <motion.div
              key={location._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
              whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
              layout
            >
              <div className="p-6 cursor-pointer" onClick={() => toggleExpand(location._id)}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{location.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="text-sm">
                        {location.address}, {location.city}, {location.state}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        viewLocationDetails(location._id)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors mr-2"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(location)
                      }}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors mr-2"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(location._id)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {expandedLocation === location._id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 ml-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    Cars: {location.slots.car.total}
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    Jeeps: {location.slots.jeep.total}
                  </div>
                  <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    Trucks: {location.slots.truck.total}
                  </div>
                  <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium flex items-center">
                    <Bike className="h-3 w-3 mr-1" />
                    Two Wheelers: {location.slots.twoWheeler.total}
                  </div>
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    Autos: {location.slots.auto.total}
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    Others: {location.slots.other.total}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedLocation === location._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 overflow-hidden"
                  >
                    <div className="p-6 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-3">Pricing Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium">Cars</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">₹{location.slots.car.hourlyRate}/hr</span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium">Jeeps</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ₹{location.slots.jeep.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 text-red-600 mr-2" />
                              <span className="text-sm font-medium">Trucks</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ₹{location.slots.truck.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Bike className="h-4 w-4 text-indigo-600 mr-2" />
                              <span className="text-sm font-medium">Two Wheelers</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ₹{location.slots.twoWheeler.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 text-yellow-600 mr-2" />
                              <span className="text-sm font-medium">Autos</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ₹{location.slots.auto.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 text-purple-600 mr-2" />
                              <span className="text-sm font-medium">Others</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">
                              ₹{location.slots.other.hourlyRate}/hr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default ParkingLocations
