import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

/**
 * Props:
 *  - aiResponse (string) : full markdown/text returned by AI
 *  - parsedItems (array) : optional parsed objects [{ name, price, reason }]
 *  - loading (bool)
 */
export default function ResultsList({ aiResponse = "", parsedItems = [], loading = false }) {
  const [openIds, setOpenIds] = useState(new Set());
  const [expandedAll, setExpandedAll] = useState(false);

  // Build a normalized results array. Prefer structured parsedItems; fallback to markdown parsing
  const results = useMemo(() => {
    if (parsedItems && parsedItems.length) return parsedItems;
    // fallback: try to parse from markdown lines like "1. Name — Price"
    const lines = aiResponse.split("\n").map((l) => l.trim()).filter(Boolean);
    const items = [];
    let current = null;
    for (const line of lines) {
      const numbered = line.match(/^\d+\.\s*(.+)/);
      if (numbered) {
        if (current) items.push(current);
        current = { name: numbered[1], price: "", reason: "" };
      } else if (line.toLowerCase().startsWith("price")) {
        if (!current) current = { name: "Item", price: line, reason: "" };
        else current.price = line;
      } else {
        if (!current) current = { name: "Intro", price: "", reason: line };
        else current.reason += (current.reason ? "\n\n" : "") + line;
      }
    }
    if (current) items.push(current);
    return items;
  }, [parsedItems, aiResponse]);

  const winner = results[0] || null;

  function toggle(id) {
    const s = new Set(openIds);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setOpenIds(s);
    if (s.size !== results.length) setExpandedAll(false);
  }

  function toggleAll() {
    if (!expandedAll) {
      setOpenIds(new Set(results.map((_, i) => i)));
      setExpandedAll(true);
    } else {
      setOpenIds(new Set());
      setExpandedAll(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Loader / fetching microinteraction */}
      {loading && (
        <div className="flex items-center gap-4 p-4 border border-gray-200 shadow-md rounded-xl bg-white/90 dark:bg-gray-900/70 dark:border-gray-700">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-gray-800"
          >
            <ChevronDown className="text-blue-600" />
          </motion.div>
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">Fetching curated insights…</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">This can take a few seconds — better than bad choices.</div>
          </div>
        </div>
      )}

      {/* Winner summary */}
      {winner && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border border-blue-100 shadow-md rounded-2xl bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-gray-900 dark:border-gray-700"
        >
          <div className="flex items-start gap-4">
            <div className="flex-none mt-1">
              <Star className="text-yellow-400 w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Best pick</div>
              <h3 className="text-2xl font-bold leading-snug text-blue-600 dark:text-blue-400">
                {winner.name}
              </h3>
              {winner.price && <div className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">Price: {winner.price}</div>}
              <p className="mt-3 leading-relaxed text-gray-700 dark:text-gray-300">
                {/* show short part of reasoning */}
                {winner.reason ? (winner.reason.length > 280 ? `${winner.reason.slice(0, 280)}…` : winner.reason) : (aiResponse.split("\n\n")[0] || "").slice(0, 280)}
              </p>
              <div className="mt-4">
                <button
                  onClick={toggleAll}
                  className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
                >
                  {expandedAll ? "Collapse all" : "See all details"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards grid (responsive) */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {results.map((item, i) => {
            const open = openIds.has(i);
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 border border-gray-200 shadow-sm rounded-2xl bg-white/90 dark:bg-gray-900/70 dark:border-gray-700 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      <span className="mr-2 font-medium text-blue-600">{i + 1}.</span>
                      {item.name}
                    </h4>
                    {item.price && <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Price: {item.price}</div>}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggle(i)}
                      aria-expanded={open}
                      className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {open ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" /> See more
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="mt-4 prose text-gray-700 dark:prose-invert max-w-none dark:text-gray-200"
                    >
                      {/* render rich text properly if available */}
                      {item.reason ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.reason}</ReactMarkdown>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiResponse}</ReactMarkdown>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* If no structured results, show full markdown viewer */}
      {results.length === 0 && aiResponse && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border border-gray-200 shadow-md rounded-2xl bg-white/90 dark:bg-gray-900/70 dark:border-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose text-gray-800 dark:prose-invert max-w-none dark:text-gray-100">
            {aiResponse}
          </ReactMarkdown>
        </motion.div>
      )}
    </div>
  );
}
