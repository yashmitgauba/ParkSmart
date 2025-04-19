import React,{useState,useEffect} from 'react'
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
  import u1 from "../../assets/images/u1.jpg"
  import u2 from "../../assets/images/u2.jpg"
  import u3 from "../../assets/images/u3.jpg"
function Testimonials() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const testimonials = [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Business Owner",
          image: u1,
          quote:
            "ParkSmart transformed how we manage employee parking. The allocation system is intuitive and has eliminated all the parking disputes we used to deal with.",
          rating: 5,
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Property Manager",
          image: u2,
          quote:
            "Managing parking for our commercial building was a nightmare until we implemented ParkSmart. Now it's automated, efficient, and our tenants love it!",
          rating: 5,
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          role: "Event Coordinator",
          image: u3,
          quote:
            "For large events, parking coordination used to be our biggest headache. ParkSmart's allocation system has streamlined the entire process.",
          rating: 4,
        },
      ]
      const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
      }
    
      const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
      }
      useEffect(() => {
        const interval = setInterval(() => {
          nextTestimonial()
        }, 8000)
    
        return () => clearInterval(interval)
      }, [])
  return (
    <>
       <section id="testimonials" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-medium text-sm rounded-full mb-4">
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">What our clients say</h2>
            <p className="text-lg text-gray-600">
              Hear from businesses that have transformed their parking operations with our system.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-70 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full opacity-70 blur-xl"></div>

            <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-opacity duration-500 ${
                    currentTestimonial === index ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-blue-200">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <blockquote className="text-xl md:text-2xl font-medium text-gray-700 mb-6">
                      "{testimonial.quote}"
                    </blockquote>

                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 md:-translate-x-12">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 transform rotate-180" />
                </button>
              </div>

              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 md:translate-x-12">
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full mx-1 ${
                    currentTestimonial === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Testimonials
