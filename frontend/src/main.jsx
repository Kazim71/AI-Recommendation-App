import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; // ✅ correct import

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--bg-light)",
              color: "var(--text-light)",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "0.9rem",
              boxShadow:
                "0 2px 6px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08)",
            },
            success: {
              iconTheme: { primary: "#3b82f6", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
