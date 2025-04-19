

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);

      
      localStorage.setItem('parkingUser', JSON.stringify(response.data.user));
      localStorage.setItem('parkingToken', response.data.token);

      
      login(response.data.user);

      setSuccess('Login successful! Redirecting...');

      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        
        if (error.response.data.errors) {
          setError(error.response.data.errors[0].msg);
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else if (error.request) {
        
        setError('No response from server. Please try again later.');
      } else {
        
        setError('Login failed. Please try again.');
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 z-10"></div>
        <img
          src="/images/parking-garage.jpg"
          alt="Parking Garage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 p-12">
          <div className="text-white max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome Back to ParkSmart</h2>
              <p className="text-lg text-blue-100 mb-8">
                Log in to access your account and manage your parking reservations, view history, and more.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-300" />
                </div>
                <p className="text-blue-100">Secure, fast, and reliable parking management</p>
              </div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login to Your Account</h1>
              <p className="text-gray-600">Enter your credentials to access your account</p>
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
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
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
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
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
                      Sign In
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </motion.div>
            </motion.div>
          </form>

          <motion.div
            className="mt-8 text-center"
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
