import React from 'react'
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
function Cta() {
  return (
    <>
     <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your parking operations?</h2>
                <p className="text-xl text-blue-100 mb-8">
                  Join hundreds of satisfied clients who have optimized their parking resources with our smart
                  allocation system.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors">
                    Schedule a Demo
                  </button>
                  <button className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors">
                    Contact Sales
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Request Information</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="Your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                      placeholder="Tell us about your parking needs"
                    ></textarea>
                  </div>

                  <button className="w-full px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors">
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  )
}

export default Cta
