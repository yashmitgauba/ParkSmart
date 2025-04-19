"use client"

import { useState } from "react"
import { Outlet, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { LayoutDashboard, ParkingCircle, MapPin, Calendar, LogOut, Menu, X, ChevronRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const AdminLayout = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Parking Locations", icon: <MapPin size={20} />, path: "/admin/parking-locations" },
    { name: "Bookings", icon: <Calendar size={20} />, path: "/admin/bookings" },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      
      <motion.div
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-full flex flex-col">
          
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
              <ParkingCircle className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                ParkSmart
              </span>
            </Link>
            <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
          </div>


          <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  window.location.pathname === item.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {window.location.pathname === item.path && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            ))}
          </nav>

          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
