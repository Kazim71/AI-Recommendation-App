import Recommendation from "../models/Recommendation.js";
import Product from "../models/Product.js";
import { getRecommendations } from "../services/perplexityService.js";
import { getImageForProduct } from "../services/unsplashService.js";
import axios from "axios";
import { getCache, setCache } from "../utils/cache.js";

/* ---------------------- Utility: Preprocess + Similarity ---------------------- */

function tokenize(str) {
  return str.toLowerCase().split(/\W+/).filter(Boolean);
}

function tokenScore(tokensA, tokensB) {
  const setB = new Set(tokensB);
  let common = 0;
  for (const t of tokensA) if (setB.has(t)) common++;
  return common / ((tokensA.length + tokensB.length) / 2);
}

/* ---------------------- AI Reasoning (cached Perplexity) ---------------------- */

async function getRawPerplexityResponse(prompt, apiKey) {
  const cacheKey = `ai:${prompt}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const res = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar",
        messages: [
          {
            role: "system",
            content:
              "You are a professional product analyst. Provide structured, human-friendly recommendations with concise reasoning and optional tables if relevant.",
          },
          {
            role: "user",
            content: `Recommend the best products for: "${prompt}". Give 5 structured results with name, price, and reasoning.`,
          },
        ],
        temperature: 0.4,
        max_tokens: 500,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const text = res.data?.choices?.[0]?.message?.content?.trim();
    setCache(cacheKey, text, 3600); // 1h cache
    console.log("🧠 AI Reasoned Text Cached:", text?.slice(0, 150) + "...");
    return text;
  } catch (err) {
    console.error("❌ Perplexity reasoning error:", err.response?.data || err.message);
    return "AI reasoning unavailable right now.";
  }
}

/* ----------------------------- Main Controller ----------------------------- */

export const generateRecommendations = async (req, res) => {
  try {
    const { query, mode = "hybrid" } = req.body;
    if (!query?.trim()) return res.status(400).json({ message: "Missing query" });

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const cacheKey = `recommend:${mode}:${query}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    /* -------------------------- MODE 1: AI-ONLY -------------------------- */
    if (mode === "ai-only") {
      const text = await getRawPerplexityResponse(query, process.env.PERPLEXITY_API_KEY);
      const result = { type: "ai-only", recommendations: [{ explanation: text }] };

      setCache(cacheKey, result, 3600);
      await Recommendation.create({
        user: userId,
        query,
        results: [{ name: "AI Text Output", description: text }],
      });

      return res.json(result);
    }

    /* -------------------------- MODE 2: HYBRID -------------------------- */
    const [products, aiNames] = await Promise.all([
      Product.find({}, "name price category").lean(),
      getRecommendations([], query, process.env.PERPLEXITY_API_KEY),
    ]);

    const tokenized = products.map((p) => ({ ...p, tokens: tokenize(p.name) }));
    const aiTokens = aiNames.map(tokenize);
    const matched = [];

    for (const p of tokenized) {
      const bestScore = Math.max(...aiTokens.map((t) => tokenScore(p.tokens, t)));
      if (bestScore > 0.4) matched.push(p);
    }

    // Fallback: ensure we always have some results
    if (matched.length < 3) {
      const scores = tokenized
        .map((p) => ({
          product: p,
          score: Math.max(...aiTokens.map((t) => tokenScore(p.tokens, t))),
        }))
        .sort((a, b) => b.score - a.score);

      for (const s of scores) {
        if (matched.length >= 5) break;
        if (!matched.find((m) => m._id.equals(s.product._id))) matched.push(s.product);
      }
    }

    const hybrid = [
      ...matched.slice(0, 5),
      ...aiNames
        .filter((name) => !matched.some((p) => p.name.toLowerCase() === name.toLowerCase()))
        .slice(0, 3)
        .map((name, i) => ({
          _id: `ai-${i}`,
          name,
          description: "AI-suggested product (not in DB)",
          category: "AI Suggested",
          price: "—",
        })),
    ];

    // Parallel image fetching
    await Promise.all(
      hybrid.map(async (item) => {
        try {
          const img = await getImageForProduct(item.name);
          item.image = img || "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
        } catch {
          item.image = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
        }
      })
    );

    const result = { type: "hybrid", recommendations: hybrid };
    setCache(cacheKey, result, 1800); // 30min cache

    await Recommendation.create({
      user: userId,
      query,
      results: hybrid.map((p) => ({
        name: p.name,
        price: p.price,
        category: p.category,
      })),
    });

    res.json(result);
  } catch (err) {
    console.error("⚠️ Recommendation Error:", err);
    res.status(500).json({ message: "Recommendation failed", error: err.message });
  }
};

/* ----------------------------- User History ----------------------------- */

export const getUserHistory = async (req, res) => {
  try {
    const history = await Recommendation.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ history });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

/* ---------------------- Get Single Recommendation ---------------------- */

export const getRecommendationById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Invalid recommendation ID" });
    }

    const rec = await Recommendation.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!rec) return res.status(404).json({ message: "Recommendation not found" });

    // Normalize legacy + modern data formats
    let finalResults = [];

    if (rec.results?.length > 0) {
      finalResults = rec.results;
    } else if (rec.recommendations?.[0]?.explanation) {
      finalResults = [
        {
          name: "AI Recommendation",
          description: rec.recommendations[0].explanation,
        },
      ];
    } else if (rec.description) {
      finalResults = [{ name: rec.query, description: rec.description }];
    } else {
      finalResults = [
        {
          name: "AI Recommendation",
          description:
            "No structured data available. This was generated before structured saving.",
        },
      ];
    }

    const normalized = {
      _id: rec._id,
      query: rec.query || "Untitled Query",
      results: finalResults,
      createdAt: rec.createdAt,
    };

    res.json(normalized);
  } catch (err) {
    console.error("Fetch single recommendation error:", err);
    res.status(500).json({ message: "Failed to load recommendation." });
  }
};
