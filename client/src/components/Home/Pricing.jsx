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
function Pricing() {
  return (
    <>
      <section id="pricing" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Flexible Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Choose the right plan for your needs</h2>
            <p className="text-lg text-gray-600">
              We offer scalable solutions to fit facilities of all sizes, from small lots to multi-level garages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "₹299",
                period: "per month",
                description: "Perfect for small parking lots with basic management needs.",
                features: [
                  "Up to 50 parking spaces",
                  "Basic allocation system",
                  "Mobile app for users",
                  "Email support",
                  "Monthly reports",
                ],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Professional",
                price: "₹599",
                period: "per month",
                description: "Ideal for medium-sized facilities requiring advanced features.",
                features: [
                  "Up to 200 parking spaces",
                  "Advanced allocation algorithms",
                  "Real-time monitoring",
                  "Payment processing",
                  "Priority support",
                  "Custom branding",
                  "API access",
                ],
                cta: "Get Started",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "Tailored solutions for large or complex parking operations.",
                features: [
                  "Unlimited parking spaces",
                  "AI-powered optimization",
                  "Multiple location management",
                  "Advanced analytics",
                  "Dedicated account manager",
                  "Custom integrations",
                  "24/7 premium support",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl overflow-hidden border ${
                  plan.popular ? "border-blue-600 shadow-xl" : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">Most Popular</div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-md font-medium ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <Ticket className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Need a custom solution?</h3>
                <p className="text-gray-600 mb-4">
                  Contact our sales team for a personalized quote tailored to your specific requirements.
                </p>
                <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
                  Contact Sales
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Pricing
