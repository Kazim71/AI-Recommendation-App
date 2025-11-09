import axios from "axios";

/**
 * Use Perplexity's web-connected model for real-time product info.
 */
export async function getRecommendations(products, preferences, apiKey) {
  const productNames = products.map(p => p.name);

  const prompt = `
You are an AI product recommendation engine with access to the web.
Given the user's request: "${preferences}"
1. Search the web for *real* products relevant to the query.
2. Cross-check with this local list (if useful): ${JSON.stringify(productNames.slice(0, 30))}
3. Return a pure JSON array of up to 6 **real product names** — no commentary, no markdown.
Example:
["Sony WH-1000XM5", "Samsung Galaxy Buds2 Pro", "JBL Tune 760NC"]
`;

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",   // ✅ web-connected model
        messages: [
          { role: "system", content: "You are a concise, web-connected product recommender." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    let raw = response.data?.choices?.[0]?.message?.content || "";
    raw = raw.replace(/```json|```/gi, "").trim();

    let names = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) names = parsed;
    } catch {
      const matches = raw.match(/"([^"]+)"/g);
      if (matches) names = matches.map(m => m.replace(/"/g, ""));
    }

    names = Array.from(new Set(names)).slice(0, 6);
    console.log("🧠 Web-sourced recommendations:", names);
    return names;
  } catch (err) {
    console.error("❌ Perplexity API Error:", err.response?.data || err.message);
    return [];
  }
}
