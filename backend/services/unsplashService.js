import axios from "axios";

const FALLBACK =
  "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";

/**
 * Fetches an image for a product name using smart query mapping
 * (brand + category-based fallback).
 */
export async function getImageForProduct(productName) {
  if (!productName) return FALLBACK;

  // Step 1. Infer a category (e.g., phone, watch, earbuds)
  const category = detectCategoryKeyword(productName);

  // Step 2. Build smarter queries for Unsplash
  const searchQueries = buildSmartQueries(productName, category);

  for (const q of searchQueries) {
    const url = await fetchUnsplash(q);
    if (url) return url;
  }

  // Step 3. Try Pexels as a fallback (if you’ve set PEXELS_KEY)
  const pexelsUrl = await fetchPexels(`${productName} ${category}`);
  if (pexelsUrl) return pexelsUrl;

  // Step 4. Default image if all fail
  return FALLBACK;
}

function buildSmartQueries(name, category) {
  const brand = name.split(" ")[0]; // first word (brand)
  return [
    `${brand} ${category}`,
    `${name} ${category}`,
    category,
  ];
}

async function fetchUnsplash(query) {
  try {
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 1, orientation: "landscape" },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` },
    });
    return res.data.results?.[0]?.urls?.small || null;
  } catch {
    return null;
  }
}

async function fetchPexels(query) {
  if (!process.env.PEXELS_KEY) return null;
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      params: { query, per_page: 1 },
      headers: { Authorization: process.env.PEXELS_KEY },
    });
    return res.data.photos?.[0]?.src?.medium || null;
  } catch {
    return null;
  }
}

function detectCategoryKeyword(name = "") {
  const lower = name.toLowerCase();
  if (lower.includes("buds") || lower.includes("ear")) return "earbuds";
  if (lower.includes("watch")) return "smartwatch";
  if (lower.includes("laptop")) return "laptop";
  if (lower.includes("tablet")) return "tablet";
  if (lower.includes("tv")) return "television";
  if (lower.includes("camera")) return "camera";
  if (
    lower.includes("phone") ||
    lower.includes("mobile") ||
    lower.includes("pro") ||
    lower.includes("plus")
  )
    return "smartphone";
  return "electronics";
}
