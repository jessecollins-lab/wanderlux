// netlify/functions/news.js
// Fetches travel news from NewsData.io

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: "NEWSDATA_API_KEY not set" }) };

  const { q } = event.queryStringParameters || {};
  const query = q || "travel tourism destinations";

  try {
    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en&category=travel&size=8`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "success") {
      return { statusCode: 200, headers, body: JSON.stringify({ articles: [] }) };
    }

    const articles = (data.results || []).slice(0, 8).map(a => ({
      title: a.title || "",
      source: a.source_name || "",
      url: a.link || "",
      pubDate: a.pubDate || "",
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ articles }) };
  } catch (err) {
    console.error("News error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
