import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import logo from "../assets/App Logo.png";

export default function Navbar() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Helper function to check if route is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition border-b border-gray-200 shadow-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-md dark:border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-2">
            <motion.img
              src={logo}
              alt="AI Product Recommender"
              className="w-8 h-8 rounded-md"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            />
            <span className="text-lg font-semibold tracking-tight text-blue-600 transition sm:text-xl dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <span className="hidden sm:inline">AI Product Recommender</span>
              <span className="sm:hidden">AI Recommender</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="items-center hidden space-x-6 text-sm font-medium text-gray-700 md:flex dark:text-gray-300">
            <Link
              to="/"
              className={`transition ${
                isActive("/")
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:text-blue-500 dark:hover:text-blue-400"
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`transition ${
                    isActive("/dashboard")
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "hover:text-blue-500 dark:hover:text-blue-400"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className={`transition ${
                    isActive("/history")
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "hover:text-blue-500 dark:hover:text-blue-400"
                  }`}
                >
                  History
                </Link>
              </>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`transition ${
                    isActive("/login")
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "hover:text-blue-500 dark:hover:text-blue-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 text-white transition rounded-lg ${
                    isActive("/register")
                      ? "bg-blue-700 dark:bg-blue-700 shadow-lg"
                      : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  }`}
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-red-500 transition hover:text-red-600 dark:hover:text-red-400"
              >
                Logout
              </button>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileTap={{ rotate: 180 }}
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
              className="p-2 transition border border-gray-300 rounded-full dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme Toggle Mobile */}
            <motion.button
              whileTap={{ rotate: 180 }}
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
              className="p-2 transition border border-gray-300 rounded-full dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>

            {/* Hamburger Menu */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 transition border border-gray-300 rounded-lg dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 z-[70] w-80 h-full bg-white dark:bg-gray-900 shadow-2xl md:hidden"
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-5 bg-white border-b border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Menu
                </span>
                <button
                  onClick={closeMenu}
                  className="flex items-center justify-center w-10 h-10 transition-colors bg-gray-100 rounded-lg dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-6 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                    isActive("/")
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Home
                </Link>

                {user && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                        isActive("/dashboard")
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/history"
                      onClick={closeMenu}
                      className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                        isActive("/history")
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      History
                    </Link>
                  </>
                )}

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                          isActive("/login")
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className={`block px-6 py-3 mt-2 text-base font-semibold text-center text-white transition-colors rounded-lg active:scale-95 ${
                          isActive("/register")
                            ? "bg-blue-700 dark:bg-blue-700 shadow-lg"
                            : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        }`}
                      >
                        Register
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-base font-medium text-left text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 active:scale-95"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}