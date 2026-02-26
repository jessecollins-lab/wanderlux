// netlify/functions/rates.js
// Fetches live exchange rates from ExchangeRate-API (free, no key needed)

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const { base = "USD", symbols = "EUR,GBP,JPY,AUD,CAD,CHF,CNY,MXN,THB,SGD" } = event.queryStringParameters || {};

  try {
    const url = `https://open.er-api.com/v6/latest/${base}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.result !== "success") {
      return { statusCode: 200, headers, body: JSON.stringify({ rates: {}, base }) };
    }

    const wantedSymbols = symbols.split(",");
    const filtered = {};
    for (const sym of wantedSymbols) {
      if (data.rates[sym]) filtered[sym] = data.rates[sym];
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        base,
        rates: filtered,
        updated: data.time_last_update_utc || "",
      }),
    };
  } catch (err) {
    console.error("Rates error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
