import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Basic/Footer'
import Navbar from '../Basic/Navbar'

function Layout() {
  return (
    <>
      <Navbar/>

      <Outlet/>
      <Footer/>
    </>
  )
}

export default Layout
