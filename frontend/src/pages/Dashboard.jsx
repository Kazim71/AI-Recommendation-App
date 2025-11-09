import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Lightbulb,
  Smartphone,
  Trophy,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";

export default function Dashboard() {
  const { token } = useAuth();
  const [preferences, setPreferences] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [parsedItems, setParsedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [winner, setWinner] = useState("");
  const [expanded, setExpanded] = useState(false);

  // ----------------------------------------------------------------------
  // FETCH RECOMMENDATIONS
  // ----------------------------------------------------------------------
  async function getRecommendations() {
    if (!preferences.trim()) return;
    setError("");
    setLoading(true);
    setAiResponse("");
    setParsedItems([]);
    setWinner("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/recommendations`,
        { query: preferences, mode: "ai-only" },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );
const { recommendations } = res.data || {};
if (!recommendations || recommendations.length === 0) {
  throw new Error("No AI recommendations found");
}

// 🧩 Handle structured vs markdown gracefully
if (recommendations[0].explanation) {
  setAiResponse(recommendations[0].explanation);
  parseMarkdownToCards(recommendations[0].explanation);
} else {
  // Build a markdown summary for consistent rendering
  const markdown = recommendations
    .map((r, i) => 
      `${i + 1}. **${r.name}**\n- **Price:** ${r.price || "—"}\n- **Reasoning:** ${r.reasoning || r.description || "No reasoning provided."}`
    )
    .join("\n\n");
  setAiResponse(markdown);
  parseMarkdownToCards(markdown);
}

    } catch (err) {
      console.error("Recommendation error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError("Failed to fetch recommendations. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

// ----------------------------------------------------------------------
// PARSE AI MARKDOWN TO STRUCTURED CARDS (OPTIMIZED & ROBUST)
// ----------------------------------------------------------------------
function parseMarkdownToCards(text) {
  if (!text || typeof text !== "string") return;

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const data = [];
  let current = null;

  // Matches common price formats like ₹40,000 / ₹1,40,000–₹1,50,000 (approx)
  const priceRegex =
    /(₹|INR|\$|USD)\s?[\d,.\s]*?(?:[-–]\s?[\d,.\s]*)?(?:\s*\(.*?\))?/i;

  for (const line of lines) {
    // Skip junk or table headers
    if (/^\|/.test(line) || /Table Name|Price|Reason/i.test(line)) continue;

    // Detect numbered product headings like "1. Lenovo Legion 5"
    const productMatch = line.match(/^\d+\.\s*(?:\*\*|__)?(.+?)(?:\*\*|__)?$/);
    if (productMatch) {
      if (current && current.name) data.push(current);
      current = {
        name: productMatch[1].trim(),
        price: "",
        reason: "",
        highlights: [],
      };
      continue;
    }

    // Detect price lines (more flexible and tolerant)
    if (/price/i.test(line)) {
      const priceMatch = line.match(priceRegex);
      if (priceMatch) {
        current.price = priceMatch[0]
          .replace(/\*\*/g, "")
          .replace(/Price[:\-]*/i, "")
          .trim();
      } else {
        // fallback if AI formats oddly
        const fallback = line
          .replace(/[*_`]/g, "")
          .replace(/Price[:\-]*/i, "")
          .trim();
        if (fallback) current.price = fallback;
      }
      continue;
    }

    // Detect and clean reasoning
    if (/reason/i.test(line)) {
      const reasonText = line
        .replace(/[*_\-:]/g, "")
        .replace(/Reasoning/gi, "")
        .trim();
      current.reason += (current.reason ? " " : "") + reasonText;
      continue;
    }

    // Detect highlights section
    if (/highlights/i.test(line)) continue;
    if (/^[-•*]\s*/.test(line) && current) {
      const cleanHighlight = line
        .replace(/^[-•*]\s*/, "")
        .replace(/\*\*/g, "")
        .trim();
      if (cleanHighlight) current.highlights.push(cleanHighlight);
      continue;
    }

    // Fallback: merge any leftover descriptive text into reasoning
    if (current) {
      const cleanText = line.replace(/\*\*/g, "").trim();
      if (cleanText) {
        current.reason += (current.reason ? " " : "") + cleanText;
      }
    }
  }

  // Push last product if exists
  if (current && current.name) data.push(current);

  // Clean invalid or header-like entries
  const clean = data.filter(
    (d) => d.name && !/intro|summary|overview/i.test(d.name)
  );

  // Merge highlights into reasoning for better UX context
  clean.forEach((item) => {
    if (item.highlights.length) {
      item.reason +=
        (item.reason ? " " : "") +
        "Highlights: " +
        item.highlights.join(" • ");
    }
  });

  // Save parsed result + best pick
  setParsedItems(clean);
  if (clean.length > 0) setWinner(clean[0].name);
}


  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------
  return (
    <div className="max-w-6xl px-4 py-10 mx-auto">
      {/* HEADER */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-3xl font-bold text-center text-blue-600 dark:text-blue-400"
      >
        AI-Powered Product Insights
      </motion.h1>

      {/* INPUT BOX */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 mb-10 border border-gray-200 shadow-lg bg-white/80 dark:bg-gray-900/70 rounded-2xl dark:border-gray-700 backdrop-blur-lg"
      >
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          What are you looking for?
        </label>
        <textarea
          rows={3}
          className="w-full p-3 text-gray-900 placeholder-gray-400 border outline-none resize-none rounded-xl bg-white/70 dark:bg-gray-800/70 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
          placeholder="e.g. Best laptops under ₹1.5L with RTX 4070 GPU"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="px-6 py-3 text-white transition bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Get Recommendations"}
          </button>
        </div>
        {error && (
          <div className="p-2 mt-3 text-sm text-red-500 border border-red-200 rounded bg-red-50 dark:bg-red-900/40 dark:border-red-800">
            {error}
          </div>
        )}
      </motion.div>

      {/* OUTPUT */}
      {loading ? (
        <div className="p-6 border border-gray-200 shadow-md rounded-2xl bg-white/80 dark:bg-gray-900/60 dark:border-gray-700">
          <Skeleton count={10} />
        </div>
      ) : aiResponse ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          {/* SUMMARY HEADER */}
          <div className="p-6 border border-gray-200 shadow-xl rounded-2xl bg-white/90 dark:bg-gray-900/70 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                AI Recommendation Insights
              </h2>
            </div>
            <p className="leading-relaxed text-gray-700 dark:text-gray-200">
              Curated results based on expert reviews, verified specifications,
              and real-world benchmarks. Designed for clarity, detail, and
              usability balance.
            </p>
          </div>

          {/* WINNER CARD */}
          {winner && (
            <div className="p-5 border border-yellow-300 shadow-sm bg-yellow-50 dark:bg-yellow-900/40 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">
                  🏆 Best Overall Pick: {winner}
                </h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Based on performance, reliability, and overall value — this
                model ranked highest.
              </p>
            </div>
          )}

          {/* PRODUCT GRID */}
          {parsedItems.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {parsedItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative p-6 transition-all border border-gray-100 shadow-sm bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 dark:border-gray-800 rounded-2xl hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                      {item.name}
                    </h3>
                  </div>

                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                    <strong>Price:</strong> {item.price || "—"}
                  </p>

                  {item.highlights?.length > 0 && (
                    <ul className="pl-4 mb-2 text-sm text-gray-700 list-disc dark:text-gray-200">
                      {item.highlights.slice(0, 3).map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}

                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
                    {item.reason || "No reasoning provided."}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* EXPANDABLE DETAILS */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 transition rounded-lg bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              {expanded ? (
                <>
                  <ChevronUp size={16} /> Hide Details
                </>
              ) : (
                <>
                  <ChevronDown size={16} /> See More Details
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="p-8 mt-6 leading-relaxed prose border border-gray-100 shadow-sm bg-gradient-to-b from-blue-50/40 to-white dark:from-gray-800/60 dark:to-gray-900 rounded-2xl dark:border-gray-800 dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiResponse}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Enter your query above to get AI recommendations.
        </p>
      )}
    </div>
  );
}
