import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Lightbulb } from "lucide-react";

export default function HistoryDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!id || id === "undefined") {
        setError("Invalid recommendation reference.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/recommendations/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecord(res.data);
      } catch (err) {
        console.error("Error fetching recommendation:", err);
        setError("Failed to load this recommendation.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, token]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          Loading recommendation...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="mt-10 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );

  const hasMarkdown =
    record.results?.[0]?.description ||
    record.results?.[0]?.explanation ||
    record.results?.[0]?.reasoning;

  const hasStructuredResults =
    record.results?.length > 1 ||
    (record.results?.length === 1 &&
      record.results[0].name &&
      !record.results[0].description);

  return (
    <div className="max-w-5xl px-4 py-10 mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition border border-gray-300 rounded-lg hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800 dark:border-gray-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 border border-gray-200 shadow-xl rounded-2xl bg-white/90 dark:bg-gray-900/70 dark:border-gray-700"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {record.query}
          </h2>
        </div>

        <div className="mt-4 prose text-gray-800 dark:prose-invert max-w-none dark:text-gray-100">
          {/* MARKDOWN CONTENT (AI text mode) */}
          {hasMarkdown ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.results?.[0]?.description ||
                record.results?.[0]?.explanation ||
                record.results?.[0]?.reasoning}
            </ReactMarkdown>
          ) : hasStructuredResults ? (
            // STRUCTURED RESULTS
            <ul className="pl-6 space-y-2 list-disc">
              {record.results.map((r, i) => (
                <li key={i}>
                  <strong>{r.name}</strong>{" "}
                  {r.category && (
                    <span className="text-sm text-gray-500">
                      ({r.category})
                    </span>
                  )}
                  {r.price && (
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      💰 {r.price}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            // FALLBACK (legacy record)
            <p className="italic text-gray-500 dark:text-gray-400">
              No structured data available (legacy record).
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
