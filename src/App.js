import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --bg:        #080c14;
    --surface:   #0e1525;
    --surface2:  #141d30;
    --border:    rgba(180,148,72,0.18);
    --gold:      #c9973a;
    --gold-lt:   #e8bc6a;
    --gold-dim:  rgba(201,151,58,0.12);
    --cream:     #ede8de;
    --muted:     #6b7896;
    --white:     #ffffff;
    --green:     #3ecf8e;
    --red:       #f56565;
    --blue:      #60a5fa;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--cream); font-family: 'Outfit', sans-serif; min-height: 100vh; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

  .app-shell { display: flex; min-height: 100vh; }

  .sidebar { width: 72px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 24px 0; gap: 8px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transition: width 0.3s cubic-bezier(.4,0,.2,1); }
  .sidebar:hover { width: 200px; }
  .sidebar-logo { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: var(--gold); margin-bottom: 20px; white-space: nowrap; overflow: hidden; width: 100%; text-align: center; padding: 0 12px; line-height: 1.2; }
  .logo-full { display: none; font-size: 16px; }
  .sidebar:hover .logo-icon { display: none; }
  .sidebar:hover .logo-full { display: block; }

  .nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 20px; background: none; border: none; cursor: pointer; color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 400; transition: color 0.2s, background 0.2s; white-space: nowrap; border-left: 2px solid transparent; text-align: left; }
  .nav-btn .nav-icon { font-size: 18px; flex-shrink: 0; min-width: 24px; text-align: center; }
  .nav-btn .nav-label { opacity: 0; transition: opacity 0.2s; overflow: hidden; }
  .sidebar:hover .nav-btn .nav-label { opacity: 1; }
  .nav-btn:hover { color: var(--cream); background: var(--gold-dim); }
  .nav-btn.active { color: var(--gold-lt); border-left-color: var(--gold); background: var(--gold-dim); }

  .main { margin-left: 72px; flex: 1; min-height: 100vh; }

  .topbar { height: 60px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 36px; background: var(--surface); position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--white); font-weight: 400; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .online-badge { display: flex; align-items: center; gap: 6px; background: rgba(62,207,142,0.1); border: 1px solid rgba(62,207,142,0.2); border-radius: 100px; padding: 5px 12px; font-size: 11px; color: var(--green); letter-spacing: 0.05em; }
  .dot { width:6px; height:6px; border-radius:50%; background:var(--green); animation: blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

  .page { padding: 36px; max-width: 1100px; }
  .page-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 300; color: var(--white); margin-bottom: 6px; }
  .page-title em { font-style: italic; color: var(--gold-lt); }
  .page-sub { color: var(--muted); font-size: 13px; margin-bottom: 32px; line-height: 1.6; }

  .section-tag { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .section-tag::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; transition: border-color 0.2s; }
  .card:hover { border-color: rgba(201,151,58,0.3); }
  .card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; color: var(--white); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
  .card-body { font-size: 13.5px; color: var(--muted); line-height: 1.8; white-space: pre-wrap; }
  .card-body strong { color: var(--cream); }

  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .field { display: flex; flex-direction: column; gap: 7px; }
  .field label { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }
  .field input, .field select, .field textarea { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; color: var(--cream); font-family: 'Outfit', sans-serif; font-size: 13.5px; outline: none; transition: border-color 0.2s, background 0.2s; width: 100%; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--gold); background: rgba(201,151,58,0.05); }
  .field select option { background: #0e1525; }
  .field textarea { resize: vertical; min-height: 76px; }

  .btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold-lt)); color: var(--bg); font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.08em; border: none; border-radius: 9px; padding: 13px 28px; cursor: pointer; text-transform: uppercase; transition: opacity 0.2s, transform 0.15s; }
  .btn-gold:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-ghost { background: var(--gold-dim); color: var(--gold-lt); border: 1px solid var(--border); border-radius: 9px; padding: 10px 20px; font-family: 'Outfit', sans-serif; font-size: 12px; cursor: pointer; transition: background 0.2s; }
  .btn-ghost:hover { background: rgba(201,151,58,0.2); }
  .btn-danger { background: rgba(245,101,101,0.1); color: var(--red); border: 1px solid rgba(245,101,101,0.2); border-radius: 8px; padding: 7px 14px; font-size: 12px; cursor: pointer; font-family: 'Outfit', sans-serif; transition: background 0.2s; }
  .btn-danger:hover { background: rgba(245,101,101,0.2); }

  .upload-zone { border: 1.5px dashed var(--border); border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--gold); background: var(--gold-dim); }
  .upload-tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 12px; }
  .tag { background: var(--gold-dim); border: 1px solid rgba(201,151,58,0.3); border-radius: 100px; padding: 4px 12px; font-size: 11px; color: var(--gold-lt); }

  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 18px; }
  .spinner { width: 38px; height: 38px; border: 2px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-msg { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--muted); font-size: 1.1rem; text-align: center; }

  .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; }
  .result-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; animation: fadeUp 0.35s ease both; transition: border-color 0.2s; }
  .result-card:hover { border-color: rgba(201,151,58,0.3); }
  .result-card.wide { grid-column: 1 / -1; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:none;} }
  .rc-icon { font-size: 22px; margin-bottom: 12px; }
  .rc-title { font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: var(--white); margin-bottom: 12px; }
  .rc-body { font-size: 13px; color: var(--muted); line-height: 1.8; white-space: pre-wrap; }
  .rc-body strong { color: var(--cream); }

  .trip-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; margin-top: 24px; }
  .trip-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; cursor: pointer; animation: fadeUp 0.3s ease both; }
  .trip-card:hover { transform: translateY(-3px); border-color: rgba(201,151,58,0.35); }
  .trip-card-header { background: linear-gradient(135deg, var(--surface2), rgba(201,151,58,0.08)); padding: 20px; border-bottom: 1px solid var(--border); }
  .trip-route { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; color: var(--white); margin-bottom: 6px; }
  .trip-dates { font-size: 12px; color: var(--muted); }
  .trip-card-body { padding: 16px 20px; }
  .trip-meta { display: flex; gap: 10px; flex-wrap: wrap; }
  .trip-pill { background: var(--gold-dim); border: 1px solid var(--border); border-radius: 100px; padding: 4px 10px; font-size: 11px; color: var(--gold-lt); }
  .trip-card-actions { padding: 12px 20px; display: flex; gap: 8px; border-top: 1px solid var(--border); }

  .empty-state { text-align: center; padding: 60px 30px; color: var(--muted); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
  .empty-text { font-size: 14px; line-height: 1.7; }

  .weather-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; }
  .weather-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 18px; text-align: center; }
  .w-day { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .w-icon { font-size: 30px; margin-bottom: 8px; }
  .w-temp { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: var(--white); }
  .w-desc { font-size: 11px; color: var(--muted); margin-top: 4px; }
  .w-detail { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .schedule-day { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 16px; overflow: hidden; animation: fadeUp 0.3s ease both; }
  .day-header { background: var(--surface2); padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
  .day-label { font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: var(--white); }
  .day-date { font-size: 11px; color: var(--muted); }
  .schedule-items { padding: 18px 22px; display: flex; flex-direction: column; gap: 12px; }
  .schedule-item { display: grid; grid-template-columns: 70px 1fr; gap: 14px; align-items: start; }
  .si-time { font-size: 12px; color: var(--gold-lt); font-weight: 500; padding-top: 2px; }
  .si-content { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; }
  .si-title { font-size: 13px; color: var(--cream); font-weight: 500; margin-bottom: 3px; }
  .si-desc { font-size: 12px; color: var(--muted); }

  .pack-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .pack-cat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; animation: fadeUp 0.3s ease both; }
  .pack-cat-header { background: var(--surface2); padding: 12px 18px; font-size: 12px; font-weight: 500; color: var(--gold-lt); border-bottom: 1px solid var(--border); letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
  .pack-items { padding: 12px 18px; display: flex; flex-direction: column; gap: 8px; }
  .pack-item { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .pack-item:last-child { border-bottom: none; }
  .pack-check { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; font-size: 10px; background: transparent; cursor: pointer; color: transparent; }
  .pack-check.checked { background: var(--gold); border-color: var(--gold); color: var(--bg); }
  .pack-label { font-size: 13px; color: var(--cream); transition: color 0.2s; }
  .pack-label.done { color: var(--muted); text-decoration: line-through; }
  .pack-progress { height: 3px; background: var(--border); border-radius: 100px; overflow: hidden; margin: 0 18px 12px; }
  .pack-bar { height: 100%; background: linear-gradient(to right, var(--gold), var(--gold-lt)); border-radius: 100px; transition: width 0.3s; }

  .tabs { display: flex; gap: 4px; margin-bottom: 28px; border-bottom: 1px solid var(--border); }
  .tab { background: none; border: none; padding: 10px 20px; font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color 0.2s; }
  .tab:hover { color: var(--cream); }
  .tab.active { color: var(--gold-lt); border-bottom-color: var(--gold); }

  .toast { position: fixed; bottom: 28px; right: 28px; background: var(--surface); border: 1px solid var(--gold); border-radius: 10px; padding: 14px 22px; font-size: 13px; color: var(--gold-lt); z-index: 999; animation: toastIn 0.3s ease; }
  @keyframes toastIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:none;} }

  /* ── CHAT ── */
  .chat-page { display: flex; flex-direction: column; height: calc(100vh - 60px); overflow: hidden; }
  .chat-header { padding: 24px 36px 0; flex-shrink: 0; }
  .finn-intro { display: flex; align-items: center; gap: 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px 24px; margin-bottom: 14px; }
  .finn-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-lt)); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .finn-intro-text h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; color: var(--white); margin-bottom: 3px; }
  .finn-intro-text p { font-size: 12px; color: var(--muted); line-height: 1.6; }

  .chat-suggestions { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 36px 14px; flex-shrink: 0; }
  .chat-suggestion { background: var(--gold-dim); border: 1px solid var(--border); border-radius: 100px; padding: 6px 14px; font-size: 12px; color: var(--gold-lt); cursor: pointer; font-family: 'Outfit', sans-serif; transition: background 0.2s; white-space: nowrap; }
  .chat-suggestion:hover { background: rgba(201,151,58,0.22); }

  .chat-messages { flex: 1; overflow-y: auto; padding: 4px 36px 16px; display: flex; flex-direction: column; gap: 14px; }
  .chat-msg { display: flex; gap: 10px; align-items: flex-start; animation: fadeUp 0.2s ease both; max-width: 100%; }
  .chat-msg.user { flex-direction: row-reverse; }
  .chat-bubble { max-width: 72%; padding: 12px 16px; border-radius: 14px; font-size: 13.5px; line-height: 1.7; word-break: break-word; }
  .chat-msg.finn .chat-bubble { background: var(--surface); border: 1px solid var(--border); color: var(--cream); border-top-left-radius: 4px; }
  .chat-msg.user .chat-bubble { background: linear-gradient(135deg, var(--gold), var(--gold-lt)); color: var(--bg); font-weight: 500; border-top-right-radius: 4px; }
  .chat-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 2px; }
  .chat-msg.finn .chat-avatar { background: linear-gradient(135deg, var(--gold), var(--gold-lt)); }
  .chat-msg.user .chat-avatar { background: var(--surface2); border: 1px solid var(--border); }

  .typing-bubble { display: flex; gap: 5px; align-items: center; padding: 14px 18px; }
  .typing-bubble span { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); display: inline-block; animation: typingDot 1.2s infinite; }
  .typing-bubble span:nth-child(2) { animation-delay: 0.2s; }
  .typing-bubble span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingDot { 0%,60%,100%{opacity:0.2;transform:scale(1);} 30%{opacity:1;transform:scale(1.3);} }

  .chat-input-bar { padding: 14px 36px 22px; border-top: 1px solid var(--border); background: var(--surface); display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0; }
  .chat-input { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: var(--cream); font-family: 'Outfit', sans-serif; font-size: 13.5px; outline: none; resize: none; min-height: 46px; max-height: 120px; transition: border-color 0.2s; line-height: 1.5; }
  .chat-input:focus { border-color: var(--gold); }
  .chat-send { background: linear-gradient(135deg, var(--gold), var(--gold-lt)); border: none; border-radius: 10px; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; transition: opacity 0.2s, transform 0.15s; flex-shrink: 0; color: var(--bg); }
  .chat-send:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
  .chat-send:disabled { opacity: 0.35; cursor: not-allowed; }

  @media (max-width: 700px) {
    .sidebar { width: 0; overflow: hidden; }
    .main { margin-left: 0; }
    .page { padding: 20px; }
    .results-grid { grid-template-columns: 1fr; }
    .result-card.wide { grid-column: 1; }
    .chat-messages, .chat-input-bar, .chat-suggestions, .chat-header { padding-left: 16px; padding-right: 16px; }
  }
`;

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const LOADING_MSGS = [
  "Finn is checking the maps…",
  "Finn is calculating time zones…",
  "Finn is scouting hidden gems…",
  "Finn is curating your packing list…",
  "Finn is mapping your itinerary…",
  "Finn is checking exchange rates…",
  "Finn is asking the locals…",
  "Finn is finalising your guide…",
];

const CHAT_SUGGESTIONS = [
  "Best time to visit Japan? 🇯🇵",
  "Do I need a visa for Thailand?",
  "What to pack for a beach trip?",
  "Solo travel tips for Europe?",
  "How do I avoid tourist traps?",
  "Best travel translation apps?",
];

const FINN_SYSTEM = `You are Finn, a warm and knowledgeable travel buddy inside the "Ask Finn" travel app. You speak like a well-travelled friend — enthusiastic, practical, and honest. You give specific, real-world advice, not generic tips. You love sharing hidden gems and local secrets. Keep replies conversational and concise. Use emojis naturally. You're an expert on destinations, visas, packing, culture, safety, food, transport, and all things travel.`;

const WEATHER_ICONS = {
  sunny:"☀️", clear:"☀️", cloudy:"☁️", overcast:"☁️", rain:"🌧️", rainy:"🌧️",
  drizzle:"🌦️", storm:"⛈️", snow:"❄️", fog:"🌫️", wind:"🌬️", hot:"🌡️",
  warm:"🌤️", cool:"🍃", cold:"🧊", thunderstorm:"⛈️", partly:"🌤️",
};
const weatherIcon = (desc = "") => {
  const d = desc.toLowerCase();
  for (const [k, v] of Object.entries(WEATHER_ICONS)) if (d.includes(k)) return v;
  return "🌡️";
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
function daysBetween(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
}
function getDaysList(start, end) {
  const days = [];
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) days.push(new Date(d));
  return days;
}
function html(str = "") {
  return str.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────
async function callClaude(messages) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.content?.map(c => c.text || "").join("") || "";
}

async function callClaudeJSON(prompt) {
  const text = await callClaude([{ role: "user", content: prompt }]);
  return text.replace(/```json|```/g, "").trim();
}

// ─────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────
function saveTrip(trip) {
  try { const all = loadAllTrips(); all[trip.id] = trip; localStorage.setItem("askfinn_trips", JSON.stringify(all)); } catch (e) { console.error(e); }
}
function loadAllTrips() {
  try { return JSON.parse(localStorage.getItem("askfinn_trips") || "{}"); } catch { return {}; }
}
function loadTrips() {
  return Object.values(loadAllTrips()).sort((a, b) => b.createdAt - a.createdAt);
}
function deleteTrip(id) {
  try { const all = loadAllTrips(); delete all[id]; localStorage.setItem("askfinn_trips", JSON.stringify(all)); } catch (e) { console.error(e); }
}

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────
function Spinner({ msg }) {
  return (
    <div className="loading">
      <div className="spinner" />
      <div className="loading-msg">{msg}</div>
    </div>
  );
}

function ResultCard({ icon, title, content, wide, delay }) {
  if (!content) return null;
  return (
    <div className={`result-card${wide ? " wide" : ""}`} style={{ animationDelay: `${delay || 0}ms` }}>
      <div className="rc-icon">{icon}</div>
      <div className="rc-title">{title}</div>
      <div className="rc-body" dangerouslySetInnerHTML={{ __html: html(content) }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// CHAT PAGE
// ─────────────────────────────────────────────
function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "finn", text: "Hey! I'm Finn 👋 Your personal travel buddy. Ask me anything — best destinations, visa requirements, what to pack, local tips, hidden gems… I've got you covered. Where are you thinking of heading? 🌍" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const apiHistory = useRef([]);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || typing) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    apiHistory.current = [...apiHistory.current, { role: "user", content: userText }];
    setTyping(true);
    try {
      const apiMessages = [
        { role: "user", content: FINN_SYSTEM },
        { role: "assistant", content: "Got it! I'm Finn, your travel buddy. Ready to help!" },
        ...apiHistory.current,
      ];
      const reply = await callClaude(apiMessages);
      apiHistory.current = [...apiHistory.current, { role: "assistant", content: reply }];
      setMessages(prev => [...prev, { role: "finn", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "finn", text: "Lost my signal for a sec! Try again? 📡" }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="finn-intro">
          <div className="finn-avatar">🧭</div>
          <div className="finn-intro-text">
            <h3>Ask Finn Anything</h3>
            <p>Visas · Destinations · Packing · Local tips · Culture · Safety · Hidden gems · Food · Transport</p>
          </div>
        </div>
      </div>
      <div className="chat-suggestions">
        {CHAT_SUGGESTIONS.map((s, i) => (
          <button key={i} className="chat-suggestion" onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            <div className="chat-avatar">{msg.role === "finn" ? "🧭" : "👤"}</div>
            <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }} />
          </div>
        ))}
        {typing && (
          <div className="chat-msg finn">
            <div className="chat-avatar">🧭</div>
            <div className="chat-bubble" style={{ padding: "8px 14px" }}>
              <div className="typing-bubble"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          placeholder="Ask Finn anything about travel…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="chat-send" onClick={() => sendMessage()} disabled={!input.trim() || typing}>➤</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function DashboardPage({ trips, onSelectTrip, onNewTrip, onDeleteTrip }) {
  return (
    <div className="page">
      <div className="page-title">Your <em>Journeys</em></div>
      <div className="page-sub">All your planned trips, saved and ready. Select one to explore your guide, or let Finn plan your next adventure.</div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div className="section-tag">Saved Trips</div>
        <button className="btn-gold" onClick={onNewTrip} style={{ marginBottom:16 }}>+ New Trip</button>
      </div>
      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <div className="empty-text">No trips yet. Let Finn plan your first adventure.</div>
          <br />
          <button className="btn-gold" onClick={onNewTrip}>Plan a Trip with Finn</button>
        </div>
      ) : (
        <div className="trip-cards">
          {trips.map((t, i) => (
            <div className="trip-card" key={t.id} style={{ animationDelay:`${i*60}ms` }}>
              <div className="trip-card-header" onClick={() => onSelectTrip(t)}>
                <div className="trip-route">{t.from} → {t.to}</div>
                <div className="trip-dates">{formatDate(t.departDate)} – {formatDate(t.returnDate)}</div>
              </div>
              <div className="trip-card-body">
                <div className="trip-meta">
                  {t.airline && <span className="trip-pill">✈️ {t.airline}</span>}
                  {t.hotel && <span className="trip-pill">🏨 {t.hotel}</span>}
                  {t.departDate && t.returnDate && <span className="trip-pill">📅 {daysBetween(t.departDate,t.returnDate)}d</span>}
                </div>
              </div>
              <div className="trip-card-actions">
                <button className="btn-ghost" onClick={() => onSelectTrip(t)}>Open →</button>
                <button className="btn-danger" onClick={e => { e.stopPropagation(); onDeleteTrip(t.id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PLAN PAGE
// ─────────────────────────────────────────────
function PlanPage({ onTripSaved }) {
  const [form, setForm] = useState({ from:"", to:"", departDate:"", returnDate:"", airline:"", flightNumber:"", hotel:"", interests:"" });
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [results, setResults] = useState(null);
  const fileRef = useRef();
  const timerRef = useRef();

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handleFiles = (fl) => setFiles(p => [...p, ...Array.from(fl).map(f => f.name)]);

  const generate = async () => {
    if (!form.from || !form.to) return;
    setLoading(true); setResults(null);
    let i = 0; setLoadMsg(LOADING_MSGS[0]);
    timerRef.current = setInterval(() => { i=(i+1)%LOADING_MSGS.length; setLoadMsg(LOADING_MSGS[i]); }, 2000);

    const p1 = `Travel concierge. Respond ONLY with valid JSON, no markdown.
Trip: ${form.from} → ${form.to}, ${form.departDate||"?"} to ${form.returnDate||"?"}, Hotel: ${form.hotel||"city center"}, Interests: ${form.interests||"general"}
Return ONLY this JSON:
{"transport":"2 paragraphs: airport to city options, costs, time.","layover":"1 paragraph: airport tips.","timezone":"1 paragraph: time difference and jet lag tip.","currency":"1 paragraph: currency, tipping, cards.","apps":"**App** - description. List 5 apps.","attractions":"1. **Name** - description. List 6 attractions.","tips":"• tip. List 5 insider tips."}`;

    const p2 = `Travel data. Respond ONLY with valid JSON, no markdown.
Destination: ${form.to}, Dates: ${form.departDate||"?"} to ${form.returnDate||"?"}, Interests: ${form.interests||"general"}
Return ONLY this JSON:
{"weather_forecast":[{"day":"Mon","date":"Jan 1","high_f":72,"low_f":58,"condition":"Sunny","humidity":"45%","tip":"Great for sightseeing"}],"packing":{"Clothing":["item"],"Toiletries":["item"],"Tech":["item"],"Documents":["item"],"Extras":["item"]}}
weather_forecast: 5 days realistic for destination/season. packing: 5 categories, 6 items each.`;

    try {
      const [t1, t2] = await Promise.all([callClaudeJSON(p1), callClaudeJSON(p2)]);
      const data = { ...JSON.parse(t1), ...JSON.parse(t2) };
      const trip = { ...form, files, id: Date.now().toString(), createdAt: Date.now(), guide: data };
      saveTrip(trip);
      setResults(trip);
      onTripSaved(trip);
    } catch (e) {
      console.error(e);
      setResults({ guide: { transport: "Finn hit a snag! Please try again." } });
    } finally {
      clearInterval(timerRef.current);
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-title">Plan a <em>New Journey</em></div>
      <div className="page-sub">Tell Finn where you're headed and he'll build your complete travel guide.</div>
      <div className="section-tag">Trip Details</div>
      <div className="card" style={{ marginBottom:24 }}>
        <div className="form-grid">
          <div className="field"><label>Flying From</label><input placeholder="e.g. New York, JFK" value={form.from} onChange={e=>upd("from",e.target.value)} /></div>
          <div className="field"><label>Destination</label><input placeholder="e.g. Paris, CDG" value={form.to} onChange={e=>upd("to",e.target.value)} /></div>
          <div className="field"><label>Departure</label><input type="date" value={form.departDate} onChange={e=>upd("departDate",e.target.value)} /></div>
          <div className="field"><label>Return</label><input type="date" value={form.returnDate} onChange={e=>upd("returnDate",e.target.value)} /></div>
          <div className="field"><label>Airline</label><input placeholder="e.g. Air France" value={form.airline} onChange={e=>upd("airline",e.target.value)} /></div>
          <div className="field"><label>Flight Number</label><input placeholder="e.g. AF 007" value={form.flightNumber} onChange={e=>upd("flightNumber",e.target.value)} /></div>
          <div className="field"><label>Hotel / Area</label><input placeholder="e.g. Le Marais, 4th Arr." value={form.hotel} onChange={e=>upd("hotel",e.target.value)} /></div>
          <div className="field"><label>Interests</label><input placeholder="e.g. food, art, hiking, nightlife" value={form.interests} onChange={e=>upd("interests",e.target.value)} /></div>
        </div>
        <div className="field">
          <label>Upload Documents (optional)</label>
          <div className={`upload-zone${drag?" drag":""}`}
            onClick={()=>fileRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files);}}>
            <div style={{fontSize:26,marginBottom:8}}>🗂</div>
            <div style={{fontSize:13,color:"var(--muted)"}}>
              <strong style={{color:"var(--cream)",display:"block",marginBottom:4}}>Drop boarding passes, hotel confirmations & itineraries</strong>
              PDF, image or text — drag & drop or click to browse
            </div>
            {files.length>0 && <div className="upload-tags">{files.map((f,i)=><span key={i} className="tag">📎 {f}</span>)}</div>}
            <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)} />
          </div>
        </div>
        <button className="btn-gold" style={{width:"100%",marginTop:20}} onClick={generate} disabled={!form.from||!form.to||loading}>
          {loading ? "Finn is working on it…" : "🧭 Ask Finn to Plan My Trip"}
        </button>
      </div>
      {loading && <Spinner msg={loadMsg} />}
      {results && <GuideView trip={results} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// GUIDE VIEW
// ─────────────────────────────────────────────
function GuideView({ trip }) {
  const [tab, setTab] = useState("guide");
  const g = trip.guide || {};
  return (
    <div style={{marginTop:8}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",color:"var(--white)"}}>
            {trip.from} <span style={{color:"var(--gold)"}}>→</span> {trip.to}
          </div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>
            {formatDate(trip.departDate)} – {formatDate(trip.returnDate)} · {daysBetween(trip.departDate,trip.returnDate)} nights
          </div>
        </div>
        <button className="btn-ghost" onClick={()=>navigator.clipboard?.writeText(`My trip: ${trip.from} → ${trip.to}\n${formatDate(trip.departDate)} – ${formatDate(trip.returnDate)}\nPlanned by Ask Finn`)}>Share ↗</button>
      </div>
      <div className="tabs">
        {[["guide","🗺️ Guide"],["weather","🌤️ Weather"],["schedule","📅 Schedule"],["packing","🎒 Packing"]].map(([k,l])=>(
          <button key={k} className={`tab${tab===k?" active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      {tab==="guide" && (
        <div className="results-grid">
          <ResultCard icon="🚇" title="Airport to City" content={g.transport} wide delay={0} />
          <ResultCard icon="✈️" title="Layover & Transit Tips" content={g.layover} delay={80} />
          <ResultCard icon="🕐" title="Time Zone & Jet Lag" content={g.timezone} delay={120} />
          <ResultCard icon="💱" title="Currency & Money" content={g.currency} delay={160} />
          <ResultCard icon="📱" title="Essential Apps" content={g.apps} delay={200} />
          <ResultCard icon="🗺️" title="Attractions & Experiences" content={g.attractions} wide delay={240} />
          <ResultCard icon="💡" title="Finn's Insider Tips" content={g.tips} wide delay={280} />
        </div>
      )}
      {tab==="weather" && <WeatherTab forecast={g.weather_forecast} destination={trip.to} />}
      {tab==="schedule" && <ScheduleTab trip={trip} guide={g} />}
      {tab==="packing" && <PackingTab packing={g.packing} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// WEATHER TAB
// ─────────────────────────────────────────────
function WeatherTab({ forecast, destination }) {
  if (!forecast || !Array.isArray(forecast)) return <div style={{color:"var(--muted)",padding:"40px 0",textAlign:"center"}}>No weather data yet.</div>;
  const avgHigh = Math.round(forecast.reduce((s,d)=>s+(d.high_f||0),0)/forecast.length);
  const avgLow  = Math.round(forecast.reduce((s,d)=>s+(d.low_f||0),0)/forecast.length);
  return (
    <div>
      <div className="section-tag">5-Day Forecast — {destination}</div>
      <div className="weather-grid" style={{marginBottom:24}}>
        {forecast.map((d,i)=>(
          <div className="weather-card" key={i} style={{animationDelay:`${i*60}ms`}}>
            <div className="w-day">{d.day} · {d.date}</div>
            <div className="w-icon">{weatherIcon(d.condition)}</div>
            <div className="w-temp">{d.high_f}°<span style={{fontSize:"1rem",color:"var(--muted)"}}>/{d.low_f}°</span></div>
            <div className="w-desc">{d.condition}</div>
            <div className="w-detail">💧 {d.humidity}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">🌡️ Finn's Weather Summary</div>
        <div className="card-body">
          <strong>Average High:</strong> {avgHigh}°F · <strong>Average Low:</strong> {avgLow}°F<br /><br />
          {forecast.map((d,i)=>(
            <div key={i} style={{marginBottom:8}}><strong>{d.day} ({d.date}):</strong> {d.tip}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCHEDULE TAB
// ─────────────────────────────────────────────
function ScheduleTab({ trip, guide }) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const timerRef = useRef();

  const generate = async () => {
    setLoading(true);
    let i = 0; setLoadMsg(LOADING_MSGS[0]);
    timerRef.current = setInterval(()=>{ i=(i+1)%LOADING_MSGS.length; setLoadMsg(LOADING_MSGS[i]); }, 2000);
    const days = getDaysList(trip.departDate, trip.returnDate);
    const prompt = `Day-by-day itinerary for ${trip.to}, ${trip.departDate} to ${trip.returnDate}. Interests: ${trip.interests||"general"}. Hotel: ${trip.hotel||"city center"}.
Respond ONLY with JSON array, no markdown:
[{"day":"Day 1","date":"Mon, Jan 6","theme":"Arrival","items":[{"time":"10:00 AM","title":"Activity","desc":"One sentence."}]}]
Create ${days.length} days, 5 time slots each.`;
    try {
      const text = await callClaudeJSON(prompt);
      const data = JSON.parse(text);
      setSchedule(data);
      saveTrip({ ...trip, guide: { ...guide, schedule: data } });
    } catch(e) { console.error(e); }
    finally { clearInterval(timerRef.current); setLoading(false); }
  };

  const existing = guide.schedule || schedule;
  return (
    <div>
      <div className="section-tag">Day-by-Day Itinerary</div>
      {!existing && !loading && (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-text">Let Finn map out your perfect day-by-day schedule.</div>
          <br />
          <button className="btn-gold" onClick={generate}>🧭 Ask Finn to Plan My Days</button>
        </div>
      )}
      {loading && <Spinner msg={loadMsg} />}
      {existing && existing.map((day,i)=>(
        <div className="schedule-day" key={i} style={{animationDelay:`${i*60}ms`}}>
          <div className="day-header">
            <div className="day-label">{day.day} — {day.theme||""}</div>
            <div className="day-date">{day.date}</div>
          </div>
          <div className="schedule-items">
            {(day.items||[]).map((item,j)=>(
              <div className="schedule-item" key={j}>
                <div className="si-time">{item.time}</div>
                <div className="si-content">
                  <div className="si-title">{item.title}</div>
                  <div className="si-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {existing && <button className="btn-ghost" onClick={generate} style={{marginTop:8}}>↻ Ask Finn to Regenerate</button>}
    </div>
  );
}

// ─────────────────────────────────────────────
// PACKING TAB
// ─────────────────────────────────────────────
function PackingTab({ packing }) {
  const [checked, setChecked] = useState({});
  if (!packing || typeof packing !== "object") return <div style={{color:"var(--muted)",padding:"40px 0",textAlign:"center"}}>No packing list yet.</div>;
  const cats = Object.entries(packing);
  const total = cats.reduce((s,[,v])=>s+(v?.length||0),0);
  const done = Object.values(checked).filter(Boolean).length;
  const toggle = k => setChecked(p=>({...p,[k]:!p[k]}));
  const ICONS = { Clothing:"👕", Toiletries:"🧴", Tech:"💻", Documents:"📄", Extras:"🎒", Entertainment:"🎧", Health:"💊", Footwear:"👟", Accessories:"⌚", Food:"🍎", Money:"💳" };
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div className="section-tag" style={{margin:0,flex:1}}>Packing List</div>
        <div style={{fontSize:13,color:"var(--muted)"}}><span style={{color:"var(--gold-lt)",fontWeight:500}}>{done}</span> / {total} packed</div>
      </div>
      <div style={{height:4,background:"var(--border)",borderRadius:100,overflow:"hidden",marginBottom:24}}>
        <div style={{height:"100%",background:"linear-gradient(to right,var(--gold),var(--gold-lt))",width:`${(done/total*100)||0}%`,transition:"width 0.3s",borderRadius:100}} />
      </div>
      <div className="pack-categories">
        {cats.map(([cat,items],ci)=>{
          const catDone=(items||[]).filter((_,ii)=>checked[`${ci}-${ii}`]).length;
          return (
            <div className="pack-cat" key={ci} style={{animationDelay:`${ci*50}ms`}}>
              <div className="pack-cat-header">{ICONS[cat]||"📦"} {cat}</div>
              <div className="pack-progress"><div className="pack-bar" style={{width:`${items?.length?(catDone/items.length*100):0}%`}} /></div>
              <div className="pack-items">
                {(items||[]).map((item,ii)=>{
                  const k=`${ci}-${ii}`;
                  return (
                    <div className="pack-item" key={ii} onClick={()=>toggle(k)}>
                      <div className={`pack-check${checked[k]?" checked":""}`}>{checked[k]?"✓":""}</div>
                      <div className={`pack-label${checked[k]?" done":""}`}>{item}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => { setTrips(loadTrips()); }, []);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""), 3000); };
  const handleTripSaved = trip => { setTrips(prev=>[trip,...prev.filter(t=>t.id!==trip.id)]); showToast("✦ Trip saved by Finn"); };
  const handleSelectTrip = trip => { setActiveTrip(trip); setPage("view"); };
  const handleDeleteTrip = id => { deleteTrip(id); setTrips(prev=>prev.filter(t=>t.id!==id)); showToast("Trip deleted"); };

  const NAV = [
    { id:"dashboard", icon:"🏠", label:"Dashboard" },
    { id:"plan",      icon:"✈️", label:"Plan Trip"  },
    { id:"chat",      icon:"🧭", label:"Ask Finn"   },
    { id:"view",      icon:"🗺️", label:"My Trip", disabled:!activeTrip },
  ];

  const TITLES = {
    dashboard:"Dashboard", plan:"Plan a Trip", chat:"Ask Finn",
    view: activeTrip ? `${activeTrip.from} → ${activeTrip.to}` : "Trip Guide",
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        <nav className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-icon">🧭</span>
            <span className="logo-full">Ask Finn</span>
          </div>
          {NAV.map(n=>(
            <button key={n.id}
              className={`nav-btn${page===n.id?" active":""}${n.disabled?" disabled":""}`}
              onClick={()=>{ if(!n.disabled) setPage(n.id); }}
              style={n.disabled?{opacity:0.35,cursor:"not-allowed"}:{}}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>

        <main className="main">
          <div className="topbar">
            <div className="topbar-title">{TITLES[page]}</div>
            <div className="topbar-right">
              <div className="online-badge"><div className="dot" />Finn is Ready</div>
            </div>
          </div>

          {page==="dashboard" && <DashboardPage trips={trips} onSelectTrip={handleSelectTrip} onNewTrip={()=>setPage("plan")} onDeleteTrip={handleDeleteTrip} />}
          {page==="plan"      && <PlanPage onTripSaved={handleTripSaved} />}
          {page==="chat"      && <ChatPage />}
          {page==="view" && activeTrip  && <div className="page"><GuideView trip={activeTrip} /></div>}
          {page==="view" && !activeTrip && (
            <div className="page">
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <div className="empty-text">No trip selected. Plan one with Finn or pick one from your dashboard.</div>
                <br />
                <button className="btn-gold" onClick={()=>setPage("plan")}>Plan a Trip with Finn</button>
              </div>
            </div>
          )}
        </main>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
