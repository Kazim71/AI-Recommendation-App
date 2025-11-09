import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/recommendations/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("History fetch error:", err.response?.data || err.message);
        toast.error("Failed to load history.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [token]);

  return (
    <div className="max-w-6xl px-4 py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-semibold text-blue-600 dark:text-blue-400">
        Recommendation History
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No history yet. Try generating some recommendations.
        </p>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {history.map((item, index) => (
            <motion.div
              key={item._id || index}
              whileHover={{ scale: 1.02 }}
              className="p-5 transition bg-white border border-gray-100 shadow-md dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
              <h3 className="mb-2 text-lg font-semibold text-blue-600 dark:text-blue-400 line-clamp-2">
                {item.query || "User Query"}
              </h3>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                {item.resultSummary || "AI generated product suggestions"}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>

                {item._id ? (
                  <Link
                    to={`/history/${item._id}`}
                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Again
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      toast("This record can’t be opened (missing ID).", {
                        icon: "⚠️",
                      })
                    }
                    className="text-gray-400 cursor-not-allowed"
                  >
                    View Again
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
