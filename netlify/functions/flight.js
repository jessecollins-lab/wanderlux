// netlify/functions/flight.js
// Fetches live flight status from AviationStack

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: "AVIATIONSTACK_API_KEY not set" }) };

  const { flightNumber } = event.queryStringParameters || {};
  if (!flightNumber) return { statusCode: 400, headers, body: JSON.stringify({ error: "flightNumber required" }) };

  // Clean flight number: remove spaces, uppercase
  const clean = flightNumber.replace(/\s+/g, "").toUpperCase();

  try {
    const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${clean}&limit=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ found: false, flightNumber: clean }) };
    }

    const f = data.data[0];
    const result = {
      found: true,
      flightNumber: f.flight?.iata || clean,
      airline: f.airline?.name || "",
      status: f.flight_status || "unknown",
      departure: {
        airport: f.departure?.airport || "",
        iata: f.departure?.iata || "",
        scheduled: f.departure?.scheduled || null,
        estimated: f.departure?.estimated || null,
        actual: f.departure?.actual || null,
        delay: f.departure?.delay || 0,
        gate: f.departure?.gate || null,
        terminal: f.departure?.terminal || null,
      },
      arrival: {
        airport: f.arrival?.airport || "",
        iata: f.arrival?.iata || "",
        scheduled: f.arrival?.scheduled || null,
        estimated: f.arrival?.estimated || null,
        actual: f.arrival?.actual || null,
        delay: f.arrival?.delay || 0,
        gate: f.arrival?.gate || null,
        terminal: f.arrival?.terminal || null,
      },
    };

    return { statusCode: 200, headers, body: JSON.stringify(result) };
  } catch (err) {
    console.error("Flight error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
