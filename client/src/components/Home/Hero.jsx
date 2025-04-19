import React,{useRef} from 'react'
import {
    Menu,
    X,
    Car,
    Clock,
    Calendar,
    CreditCard,
    MapPin,
    Shield,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Search,
    Smartphone,
    Settings,
    ArrowRight,
    ExternalLink,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Star,
    ParkingCircle,
    Ticket,
    AlertCircle,
    MessageSquare,
  } from "lucide-react"
function Hero() {
    const heroRef = useRef(null)
  return (
    <>
      <section className="pt-24 md:pt-32 pb-16 md:pb-24" ref={heroRef}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <div className="max-w-xl mx-auto lg:mx-0">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-6">
                  Intelligent Parking Management
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                  Smart Parking <span className="text-blue-600">Allocation</span> System
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  Optimize your parking resources with our AI-powered allocation system. Reduce congestion, improve user
                  experience, and maximize space utilization.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                    Request Demo
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center">
                    Learn More
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </button>
                </div>

                <div className="mt-12 flex items-center space-x-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                        <img src={`/images/avatar-${i}.jpg`} alt={`User ${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">500+</span> property managers trust our solution
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-200 rounded-full opacity-70 blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-70 blur-xl"></div>

                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-12 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <div className="flex items-center mb-4">
                        <Search className="h-5 w-5 text-gray-500 mr-2" />
                        <div className="text-gray-500 text-sm">Find parking spaces...</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Location</div>
                          <div className="text-sm font-medium flex items-center">
                            <MapPin className="h-4 w-4 text-blue-600 mr-1" />
                            Downtown Office
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-md border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Date</div>
                          <div className="text-sm font-medium flex items-center">
                            <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                            Today
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { id: "A12", type: "Premium", available: true },
                        { id: "B05", type: "Standard", available: true },
                        { id: "C18", type: "Compact", available: true },
                        { id: "D22", type: "Standard", available: false },
                      ].map((spot, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            spot.available ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                  spot.available ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                                }`}
                              >
                                <Car className="h-5 w-5" />
                              </div>
                              <div className="ml-3">
                                <div className="font-medium">Spot {spot.id}</div>
                                <div className="text-sm text-gray-500">{spot.type}</div>
                              </div>
                            </div>

                            <button
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                spot.available
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={!spot.available}
                            >
                              {spot.available ? "Reserve" : "Occupied"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  )
}

export default Hero
