import React,{useState} from 'react'
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
  import a1 from "../../assets/images/a3.jpg"
  import a2 from "../../assets/images/a4.jpg"
  import a3 from "../../assets/images/a5.jpg"
function Solutions() {
    const [activeTab, setActiveTab] = useState("individuals")

  return (
    <>
    <section id="solutions" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Tailored Solutions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Solutions for every parking challenge</h2>
            <p className="text-lg text-gray-600">
              Whether you're managing a small lot or a multi-level garage, we have the right solution for you.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap justify-center border-b border-gray-200">
              <button
                className={`px-6 py-3 font-medium text-sm md:text-base ${
                  activeTab === "individuals"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("individuals")}
              >
                For Individuals
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm md:text-base ${
                  activeTab === "businesses"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("businesses")}
              >
                For Businesses
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm md:text-base ${
                  activeTab === "municipalities"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("municipalities")}
              >
                For Municipalities
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {activeTab === "individuals" && (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Find and reserve parking with ease</h3>
                  <p className="text-gray-600 mb-6">
                    Never circle for parking again. Our user-friendly app helps you find and reserve parking spaces in
                    advance, saving you time and reducing stress.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Search for available parking near your destination",
                      "Compare prices and choose the best option",
                      "Reserve and pay in advance to guarantee your spot",
                      "Receive directions and access instructions",
                      "Extend your parking duration remotely if needed",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                      Download the App
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-70 blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full opacity-70 blur-xl"></div>

                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <img src={a1} alt="Mobile app for individuals" className="w-full h-auto" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "businesses" && (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Optimize your parking resources</h3>
                  <p className="text-gray-600 mb-6">
                    Maximize the value of your parking assets while providing a better experience for employees,
                    visitors, and customers.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Allocate spaces based on employee roles and schedules",
                      "Manage visitor parking with pre-registration",
                      "Generate detailed usage reports and analytics",
                      "Integrate with your existing building management systems",
                      "Reduce administrative overhead with automated management",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                      Schedule a Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-70 blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full opacity-70 blur-xl"></div>

                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <img src={a2} alt="Business dashboard" className="w-full h-auto" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "municipalities" && (
              <>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart city parking solutions</h3>
                  <p className="text-gray-600 mb-6">
                    Reduce congestion and improve urban mobility with our comprehensive municipal parking management
                    system.
                  </p>

                  <ul className="space-y-4">
                    {[
                      "Centralized management of all public parking facilities",
                      "Dynamic pricing based on demand and time of day",
                      "Integration with traffic management systems",
                      "Real-time data for urban planning and decision making",
                      "Reduced emissions from cars searching for parking",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                      Contact Our Team
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-200 rounded-full opacity-70 blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-200 rounded-full opacity-70 blur-xl"></div>

                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <img src={a3} alt="City parking management" className="w-full h-auto" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      
    </>
  )
}

export default Solutions
