"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const AdminRoute = () => {
  const { user, loading } = useAuth()
  const adminEmail = "yashmitgauba0@gmail.com"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || user.email !== adminEmail) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default AdminRoute
