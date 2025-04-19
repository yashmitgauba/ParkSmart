


import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import AdminLayout from "./components/Layout/AdminLayout"
import Home from "./pages/Home"
import Login from "./components/Auth/Login"
import Signup from "./components/Auth/Signup"
import AdminDashboard from "./components/Admin/AdminDashboard"
import ParkingLocations from "./components/Admin/ParkingLocations"
import LocationDetails from "./components/Admin/LocationDetails"
import AdminBookings from "./components/Admin/AdminBookings"
import BookParking from "./components/User/BookParking"
import UserBookings from "./components/User/UserBookings"
import ProtectedRoute from "./Protected_routes/ProtectedRoute"
import AdminRoute from "./Protected_routes/AdminRoute"
import { AuthProvider } from "./context/AuthContext"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="book" element={<BookParking />} />
              <Route path="my-bookings" element={<UserBookings />} />
            </Route>
          </Route>


          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="parking-locations" element={<ParkingLocations />} />
              <Route path="parking-locations/:id" element={<LocationDetails />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>
          </Route>


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
