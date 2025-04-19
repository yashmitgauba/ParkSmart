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
function Contact() {
  return (
    <>
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Contact our team</h2>
            <p className="text-lg text-gray-600">
              Have questions or ready to get started? Our team is here to help you find the perfect parking solution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="contact-subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-200 mb-8">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email Us</h4>
                      <a href="mailto:info@parksmart.com" className="text-gray-900 hover:text-blue-600">
                        info@parksmart.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Call Us</h4>
                      <a href="tel:+15551234567" className="text-gray-900 hover:text-blue-600">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Visit Us</h4>
                      <p className="text-gray-900">
                        123 Innovation Drive
                        <br />
                        Suite 400
                        <br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 rounded-xl shadow-md p-6 md:p-8 text-white">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-6 w-6 mr-3" />
                  <h3 className="text-xl font-bold">Live Chat Support</h3>
                </div>
                <p className="mb-6">
                  Our support team is available to chat during business hours. Get immediate assistance with your
                  questions.
                </p>
                <button className="w-full py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  )
}

export default Contact
