import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ParkingCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <ParkingCircle className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  ParkSmart
                </span>
              </Link>
            </div>

            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/book" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Book 
              </Link>
              <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                My Bookings
              </Link>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Testimonials
              </a>
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Admin
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">Hi,{user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                      Log In
                    </button>
                  </Link>
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </>
              )}
            </div>

            
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4 px-2">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#solutions"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solutions
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="pt-2 flex flex-col space-y-3">
                  {user ? (
                    <>
                      <span className="text-gray-700 font-medium">{user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <button className="px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                          Log In
                        </button>
                      </Link>
                      <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
