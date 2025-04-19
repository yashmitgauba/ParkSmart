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

function Features() {
    const [activeTab, setActiveTab] = useState("individuals")
  return (
    <>
    <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Everything you need for efficient parking management
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive platform provides all the tools necessary to transform your parking operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ParkingCircle className="h-8 w-8 text-blue-600" />,
                title: "Smart Allocation",
                description:
                  "AI-powered algorithms assign parking spaces based on vehicle type, duration, and user preferences.",
              },
              {
                icon: <Smartphone className="h-8 w-8 text-blue-600" />,
                title: "Mobile Access",
                description: "Users can find, reserve, and pay for parking spaces directly from their smartphones.",
              },
              {
                icon: <Clock className="h-8 w-8 text-blue-600" />,
                title: "Real-time Monitoring",
                description: "Track space availability and occupancy in real-time with our intuitive dashboard.",
              },
              {
                icon: <CreditCard className="h-8 w-8 text-blue-600" />,
                title: "Seamless Payments",
                description: "Integrated payment processing with support for multiple payment methods.",
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Access Control",
                description: "Secure entry and exit with license plate recognition and QR code verification.",
              },
              {
                icon: <Settings className="h-8 w-8 text-blue-600" />,
                title: "Customizable Rules",
                description: "Set specific allocation rules based on your facility's unique requirements.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </>
  )
}

export default Features
