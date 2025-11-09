import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import HistoryDetail from "./pages/HistoryDetail";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 transition-colors duration-300 bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow pt-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Protected routes below */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }            
          />
          <Route path="/history/:id" element={<ProtectedRoute><HistoryDetail /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
