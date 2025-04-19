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
function How() {
  return (
    <>
         <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">How our parking system works</h2>
            <p className="text-lg text-gray-600">
              Our intuitive platform makes parking management effortless for both operators and users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-blue-200 z-0"></div>

            {[
              {
                icon: <Search className="h-8 w-8 text-white" />,
                title: "Analyze & Configure",
                description: "We analyze your parking facility and configure the system to meet your specific needs.",
              },
              {
                icon: <Settings className="h-8 w-8 text-white" />,
                title: "Install & Integrate",
                description:
                  "Our team installs the necessary hardware and integrates the software with your existing systems.",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-white" />,
                title: "Manage & Optimize",
                description:
                  "Use our intuitive dashboard to manage your parking operations and continuously optimize performance.",
              },
            ].map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-6">
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-center text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center mx-auto">
              Learn More About Implementation
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default How
