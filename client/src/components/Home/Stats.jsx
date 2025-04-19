import React,{useRef} from 'react'
import { useInView } from "react-intersection-observer"
import CountUp from "react-countup"
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
function Stats() {
    const statsRef = useRef(null)

  
  const [statsRefView, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  return (
    <>
     <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white" ref={statsRefView}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statsInView && <CountUp start={0} end={85} duration={2} suffix="%" />}
              </div>
              <div className="text-blue-200">Reduction in parking disputes</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statsInView && <CountUp start={0} end={32} duration={2} suffix="%" />}
              </div>
              <div className="text-blue-200">Increase in space utilization</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statsInView && <CountUp start={0} end={12} duration={2} suffix="min" />}
              </div>
              <div className="text-blue-200">Average time saved per driver</div>
            </div>

            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {statsInView && <CountUp start={0} end={500} duration={2} suffix="+" />}
              </div>
              <div className="text-blue-200">Facilities using our system</div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  )
}

export default Stats
