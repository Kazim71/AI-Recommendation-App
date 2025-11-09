import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children }) {
  const { user, token } = useAuth();

  // While checking auth, render nothing (avoid flashing)
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          Checking authorization...
        </motion.div>
      </div>
    );
  }

  // If no user or token, hide everything → redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Authorized → show protected content
  return <>{children}</>;
}
