import React ,{useState}from 'react'
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
function Faq() {
    const [openFaq, setOpenFaq] = useState(null)
    const faqs = [
        {
          question: "How does the parking allocation system work?",
          answer:
            "Our system uses advanced algorithms to optimize parking space allocation based on various factors including vehicle size, duration of stay, and special requirements. Users can reserve spaces through our app or website, and the system automatically assigns the most suitable spot.",
        },
        {
          question: "Can I integrate this with my existing building management system?",
          answer:
            "Yes! ParkSmart is designed with open APIs that allow seamless integration with most building management systems, access control systems, and payment platforms. Our technical team will work with you to ensure smooth integration.",
        },
        {
          question: "What hardware is required for implementation?",
          answer:
            "The basic system requires minimal hardware - just our smart controller unit and optional license plate recognition cameras. For advanced features like guided parking, additional sensors may be needed. We provide a complete assessment and recommendation based on your facility.",
        },
        {
          question: "How long does implementation typically take?",
          answer:
            "For standard parking facilities, implementation typically takes 2-4 weeks from initial assessment to full deployment. Larger or more complex facilities may require 6-8 weeks. Our team works efficiently to minimize disruption to your operations.",
        },
        {
          question: "Do you offer maintenance and support?",
          answer:
            "All our plans include 24/7 technical support. We also offer preventive maintenance packages to ensure your system runs optimally. Software updates are provided automatically at no additional cost.",
        },
      ]
      const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index)
      }
  return (
    <>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Common Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our parking allocation system.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left font-medium flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <span className="text-gray-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        openFaq === index ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 py-4 bg-gray-50">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 rounded-xl p-6 flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-6 flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 text-gray-900">Still have questions?</h3>
                <p className="text-gray-600">
                  If you couldn't find the answer to your question, please contact our support team.
                </p>
                <a href="#contact" className="inline-block mt-3 text-blue-600 font-medium hover:text-blue-700">
                  Contact Support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Faq
