

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight, User, Mail, Phone, MapPin } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    state: "",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!formData.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!formData.city.trim()) {
      setError("City is required");
      return false;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/signup", formData);

      
      localStorage.setItem("parkingUser", JSON.stringify(response.data.user));
      localStorage.setItem("parkingToken", response.data.token);

      setSuccess("Account created successfully! Redirecting...");

      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response) {
        
        if (error.response.data.errors) {
          setError(error.response.data.errors[0].msg);
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Signup failed. Please try again.");
        }
      } else if (error.request) {
        
        setError("No response from server. Please try again later.");
      } else {
        
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const slideVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: -100, opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 z-10"></div>
        <img
          src="/images/parking-city.jpg"
          alt="Smart Parking"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 p-12">
          <div className="text-white max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join ParkSmart Today</h2>
              <p className="text-lg text-blue-100 mb-8">
                Create your account to access our smart parking allocation system and enjoy hassle-free parking
                management.
              </p>
              <ul className="space-y-4">
                {[
                  "Find and reserve parking spaces with ease",
                  "Manage your parking preferences",
                  "Access detailed parking history",
                  "Receive real-time notifications",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-blue-300 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-100">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      
      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          <motion.div variants={itemVariants}>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">
                {step === 1 ? "Enter your basic information to get started" : "Complete your profile details"}
              </p>
            </div>
          </motion.div>

          
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${step >= 1 ? "text-blue-600" : "text-gray-500"}`}>Account</p>
                </div>
              </div>
              <div className={`flex-1 h-1 mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div className="ml-2">
                  <p className={`text-sm font-medium ${step >= 2 ? "text-blue-600" : "text-gray-500"}`}>Profile</p>
                </div>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div className="space-y-6" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="johndoe"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Password must be at least 6 characters</p>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div className="space-y-6" variants={slideVariants} initial="hidden" animate="visible" exit="exit">
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="1234567890"
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Enter a 10-digit phone number</p>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="California"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="San Francisco"
                        required
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    variants={itemVariants}
                  >
                    Back
                  </motion.button>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={`w-1/2 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    variants={itemVariants}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          <motion.div
            className="mt-8 text-center"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
