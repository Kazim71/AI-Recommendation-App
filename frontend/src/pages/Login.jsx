import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authAPI";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIXED: send object instead of separate args
      const { data } = await loginUser({
        email: form.email,
        password: form.password,
      });

      // ✅ Ensure correct shape for AuthContext
      if (data.token && data.user) {
        login({ user: data.user, token: data.token });
      } else if (data.token && !data.user) {
        // if backend sends only token + maybe name/email
        login({ user: { email: form.email }, token: data.token });
      } else {
        throw new Error("Invalid login response structure");
      }

      navigate("/dashboard");
    } catch (err) {
      const errorData = err.response?.data || {};
      const errorMessage = errorData.message || errorData.error || "Login failed";
      const hint = errorData.hint || "";
      const solution = errorData.solution || "";
      
      // Log full error details for debugging
      console.error("Login error:", {
        message: errorMessage,
        hint: hint,
        solution: solution,
        fullError: errorData
      });
      
      // Show user-friendly error with hint if available
      if (hint && hint.includes("MongoDB Atlas")) {
        toast.error(`${errorMessage}\n\n${hint}\n\nCheck console for fix steps.`, {
          duration: 8000,
        });
      } else {
        toast.error(errorMessage, {
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md card">
        <h2 className="mb-6 text-2xl font-semibold text-center text-blue-600 dark:text-blue-400">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 text-gray-900 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 text-gray-900 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
