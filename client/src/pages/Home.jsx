"use client"
import Hero from "../components/Home/Hero"
import Stats from "../components/Home/Stats"
import Features from "../components/Home/Features"
import Solutions from "../components/Home/Solutions"
import How from "../components/Home/How"
import Pricing from "../components/Home/Pricing"
import Testimonials from "../components/Home/Testimonials"
import Cta from "../components/Home/Cta"
import Faq from "../components/Home/Faq"
import Contact from "../components/Home/Contact"

const Home = () => {
 
  return (
    <div className="min-h-screen bg-white">
    <Hero/>
    <Stats/>
    <Features/>
    <Solutions/>
    <How/>
    <Pricing/>
    <Testimonials/>
    <Cta/>
    <Faq/>
    <Contact/>

    </div>
  )
}

export default Home
