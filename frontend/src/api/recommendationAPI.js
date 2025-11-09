import axios from "axios";

// Backend API base
const API_URL = `${import.meta.env.VITE_API_URL}/api/recommendations`;

/**
 * Fetch recommendations from backend.
 *
 * @param {string} query - User query (e.g. “Best smartwatches under 15000”)
 * @param {string} mode - "hybrid" (default) or "ai-only"
 * @param {string} token - Auth token for user session
 * @returns {object} Data from backend (hybrid = product list, ai-only = text)
 */
export const getRecommendations = async (query, mode = "hybrid", token) => {
  if (!token) throw new Error("Missing authentication token.");

  try {
    const response = await axios.post(
      API_URL,
      { query, mode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log for debugging (optional)
    console.log(
      `✅ ${mode.toUpperCase()} Recommendations Received:`,
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("❌ Recommendation API Error:", error.response?.data || error.message);
    throw error;
  }
};
