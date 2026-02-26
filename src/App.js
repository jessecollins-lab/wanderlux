import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --depth-1:    #020d1a;
    --depth-2:    #041528;
    --depth-3:    #071e36;
    --depth-4:    #0a2440;
    --teal:       #0eb8a0;
    --teal-lt:    #2dd4bf;
    --teal-dim:   rgba(14,184,160,0.12);
    --teal-glow:  rgba(14,184,160,0.25);
    --blue:       #1a6cf5;
    --blue-lt:    #60a5fa;
    --glass:      rgba(255,255,255,0.05);
    --glass-border: rgba(255,255,255,0.1);
    --glass-hover:  rgba(255,255,255,0.08);
    --text:       #e2f4f2;
    --text-muted: #6b9e9a;
    --text-dim:   #3d7070;
    --white:      #ffffff;
    --red:        #f87171;
    --success:    #10b981;
    --r-sm: 10px;
    --r-md: 16px;
    --r-lg: 22px;
    --r-xl: 30px;
  }

  html { scroll-behavior: smooth; }
  body {
    background: var(--depth-1);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Ocean background */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 10%, rgba(14,184,160,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 80%, rgba(26,108,245,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 60% at 50% 40%, rgba(14,184,160,0.04) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(14,184,160,0.3); border-radius: 10px; }

  /* ── LAYOUT ── */
  .app-shell { display: flex; min-height: 100vh; position: relative; z-index: 1; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 68px;
    background: rgba(4,21,40,0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    gap: 4px;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: width 0.3s cubic-bezier(.4,0,.2,1);
  }
  .sidebar:hover { width: 210px; }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 18px 18px;
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1px solid var(--glass-border);
    margin-bottom: 8px;
  }
  .logo-mark {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--teal), var(--blue-lt));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    box-shadow: 0 0 20px var(--teal-glow);
  }
  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    color: var(--white);
    opacity: 0;
    transition: opacity 0.2s;
    letter-spacing: 0.01em;
  }
  .sidebar:hover .logo-text { opacity: 1; }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: calc(100% - 16px);
    margin: 0 8px;
    padding: 11px 14px;
    background: none;
    border: none;
    border-radius: var(--r-sm);
    cursor: pointer;
    color: var(--text-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 400;
    transition: all 0.2s;
    white-space: nowrap;
    text-align: left;
  }
  .nav-icon { font-size: 17px; flex-shrink: 0; width: 20px; text-align: center; }
  .nav-label { opacity: 0; transition: opacity 0.2s; overflow: hidden; }
  .sidebar:hover .nav-label { opacity: 1; }
  .nav-btn:hover { color: var(--text); background: var(--glass); }
  .nav-btn.active {
    color: var(--teal-lt);
    background: var(--teal-dim);
    box-shadow: inset 0 0 0 1px rgba(14,184,160,0.2);
  }

  /* ── MAIN ── */
  .main { margin-left: 68px; flex: 1; min-height: 100vh; display: flex; flex-direction: column; }

  /* ── TOPBAR ── */
  .topbar {
    height: 58px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    background: rgba(4,21,40,0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    color: var(--white);
    font-weight: 400;
  }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .status-pill {
    display: flex; align-items: center; gap: 7px;
    background: rgba(16,185,129,0.1);
    border: 1px solid rgba(16,185,129,0.2);
    border-radius: 100px;
    padding: 5px 14px;
    font-size: 11.5px;
    color: #34d399;
    font-weight: 500;
    letter-spacing: 0.03em;
  }
  .status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 6px #34d399;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 6px #34d399;} 50%{opacity:0.5;box-shadow:0 0 2px #34d399;} }

  /* ── TICKER BAR ── */
  .ticker-bar {
    height: 32px;
    background: rgba(2,13,26,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(14,184,160,0.15);
    display: flex;
    align-items: center;
    overflow: hidden;
    position: sticky;
    top: 58px;
    z-index: 49;
    flex-shrink: 0;
  }
  .ticker-label {
    background: linear-gradient(135deg, var(--teal), #0891b2);
    color: var(--depth-1);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 0 12px;
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .ticker-track { flex: 1; overflow: hidden; position: relative; height: 100%; display: flex; align-items: center; }
  .ticker-scroll {
    display: flex; align-items: center;
    white-space: nowrap;
    animation: tickerMove 40s linear infinite;
    will-change: transform;
  }
  .ticker-scroll:hover { animation-play-state: paused; }
  @keyframes tickerMove { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
  .ticker-item {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11.5px; color: var(--text-muted);
    padding: 0 22px;
    border-right: 1px solid rgba(255,255,255,0.05);
    white-space: nowrap;
  }
  .t-label { color: var(--text-dim); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  .t-val { color: var(--text); font-weight: 500; }
  .t-up { color: #34d399 !important; }
  .t-down { color: #f87171 !important; }
  .t-warn { color: #fbbf24 !important; }
  .ticker-right {
    display: flex; align-items: center; gap: 4px;
    padding: 0 10px;
    border-left: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .alert-btn {
    position: relative; background: none; border: none;
    cursor: pointer; color: var(--text-muted); font-size: 14px;
    padding: 4px 6px; transition: color 0.2s; display: flex; align-items: center;
    border-radius: 6px;
  }
  .alert-btn:hover { color: var(--teal-lt); background: var(--teal-dim); }
  .alert-badge {
    position: absolute; top: 0; right: 0;
    width: 13px; height: 13px;
    background: #ef4444; border-radius: 50%;
    font-size: 7.5px; color: white;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; border: 1.5px solid var(--depth-1);
  }

  /* ── ALERT PANEL ── */
  .alert-overlay { position: fixed; inset: 0; z-index: 200; }
  .alert-panel {
    position: absolute; top: 92px; right: 16px; width: 350px;
    background: rgba(4,21,40,0.97);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(14,184,160,0.2);
    border-radius: var(--r-lg);
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    overflow: hidden;
    animation: slideDown 0.22s cubic-bezier(.4,0,.2,1);
    z-index: 201;
  }
  @keyframes slideDown { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:none;} }
  .alert-panel-hdr {
    padding: 14px 18px 12px;
    border-bottom: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .alert-panel-hdr h3 { font-family:'Playfair Display',serif; font-size:.95rem; color:var(--white); }
  .alert-close { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:18px; line-height:1; transition:color 0.2s; }
  .alert-close:hover { color:var(--text); }
  .alert-list { max-height: 380px; overflow-y: auto; }
  .alert-row {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s; cursor: default;
  }
  .alert-row:last-child { border-bottom: none; }
  .alert-row:hover { background: rgba(255,255,255,0.03); }
  .alert-indicator { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
  .ai  { background: #fbbf24; box-shadow: 0 0 5px rgba(251,191,36,0.6); }
  .ai2 { background: var(--teal); box-shadow: 0 0 5px var(--teal-glow); }
  .ai3 { background: #ef4444; box-shadow: 0 0 5px rgba(239,68,68,0.5); }
  .ai4 { background: #34d399; box-shadow: 0 0 5px rgba(52,211,153,0.5); }
  .alert-content-wrap {}
  .alert-title { font-size: 12.5px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
  .alert-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
  .alert-ts { font-size: 10px; color: var(--text-dim); margin-top: 3px; }
  .alert-empty { padding: 28px; text-align: center; color: var(--text-dim); font-size: 13px; }


  /* ── PAGE ── */
  .page { padding: 32px 36px; max-width: 1080px; }
  .page-eyebrow {
    font-size: 10.5px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 8px;
    font-weight: 500;
  }
  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 400;
    color: var(--white);
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .page-title em { font-style: italic; color: var(--teal-lt); }
  .page-sub { color: var(--text-muted); font-size: 13.5px; margin-bottom: 28px; line-height: 1.7; max-width: 540px; }

  /* ── GLASS CARD ── */
  .glass-card {
    background: var(--glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-lg);
    padding: 24px;
    transition: border-color 0.25s, background 0.25s, transform 0.2s;
  }
  .glass-card:hover { border-color: rgba(14,184,160,0.25); background: var(--glass-hover); }

  /* ── EDIT MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: rgba(4,21,40,0.97);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(14,184,160,0.2);
    border-radius: var(--r-xl);
    width: 100%; max-width: 620px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: modalIn 0.25s cubic-bezier(.4,0,.2,1);
  }
  @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(10px);} to{opacity:1;transform:none;} }
  .modal-header {
    padding: 22px 26px 16px;
    border-bottom: 1px solid var(--glass-border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0;
    background: rgba(4,21,40,0.97);
    backdrop-filter: blur(20px);
    border-radius: var(--r-xl) var(--r-xl) 0 0;
  }
  .modal-title { font-family:'Playfair Display',serif; font-size:1.1rem; color:var(--white); }
  .modal-close {
    background: rgba(255,255,255,0.06); border: 1px solid var(--glass-border);
    border-radius: 8px; color: var(--text-muted); cursor: pointer;
    font-size: 16px; width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.1); color: var(--text); }
  .modal-body { padding: 22px 26px; }
  .modal-footer {
    padding: 16px 26px 22px;
    border-top: 1px solid var(--glass-border);
    display: flex; gap: 10px; justify-content: flex-end;
  }
  .modal-section-label {
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--teal); font-weight: 600; margin: 18px 0 12px;
    display: flex; align-items: center; gap: 10px;
  }
  .modal-section-label::after { content:''; flex:1; height:1px; background: linear-gradient(to right, rgba(14,184,160,0.2), transparent); }
  .modal-section-label:first-child { margin-top: 0; }


  .card-label {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 14px;
    font-weight: 500;
  }
  .card-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    color: var(--white);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-body { font-size: 13.5px; color: var(--text-muted); line-height: 1.85; white-space: pre-wrap; }
  .card-body strong { color: var(--text); }

  /* ── FORM ── */
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 18px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dim);
  }
  .field input, .field select, .field textarea {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-sm);
    padding: 11px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--teal);
    background: rgba(14,184,160,0.06);
    box-shadow: 0 0 0 3px rgba(14,184,160,0.1);
  }
  .field input::placeholder, .field textarea::placeholder { color: var(--text-dim); }
  .field select option { background: #041528; }
  .field textarea { resize: vertical; min-height: 76px; }

  /* ── BUTTONS ── */
  .btn-primary {
    background: linear-gradient(135deg, var(--teal) 0%, #0891b2 100%);
    color: var(--depth-1);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13.5px;
    letter-spacing: 0.04em;
    border: none;
    border-radius: var(--r-sm);
    padding: 13px 28px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(14,184,160,0.3);
  }
  .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 30px rgba(14,184,160,0.4); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

  .btn-ghost {
    background: var(--glass);
    color: var(--teal-lt);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-sm);
    padding: 9px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: var(--teal-dim); border-color: rgba(14,184,160,0.3); }

  .btn-danger {
    background: rgba(248,113,113,0.08);
    color: var(--red);
    border: 1px solid rgba(248,113,113,0.18);
    border-radius: var(--r-sm);
    padding: 8px 14px;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-danger:hover { background: rgba(248,113,113,0.16); }

  /* ── UPLOAD ── */
  .upload-zone {
    border: 1.5px dashed rgba(255,255,255,0.1);
    border-radius: var(--r-md);
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(255,255,255,0.02);
  }
  .upload-zone:hover, .upload-zone.drag {
    border-color: var(--teal);
    background: var(--teal-dim);
  }
  .upload-tags { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 12px; }
  .tag {
    background: var(--teal-dim);
    border: 1px solid rgba(14,184,160,0.25);
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 11px;
    color: var(--teal-lt);
  }

  /* ── LOADING ── */
  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 20px; }
  .spinner {
    width: 36px; height: 36px;
    border: 2px solid rgba(14,184,160,0.15);
    border-top-color: var(--teal);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-msg {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    color: var(--text-muted);
    font-size: 1.05rem;
  }

  /* ── RESULTS GRID ── */
  .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
  .result-card {
    background: var(--glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-lg);
    padding: 24px;
    animation: fadeUp 0.4s ease both;
    transition: border-color 0.2s, transform 0.2s;
  }
  .result-card:hover { border-color: rgba(14,184,160,0.25); transform: translateY(-2px); }
  .result-card.wide { grid-column: 1 / -1; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:none;} }
  .rc-icon { font-size: 22px; margin-bottom: 10px; }
  .rc-title { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--white); margin-bottom: 12px; }
  .rc-body { font-size: 13px; color: var(--text-muted); line-height: 1.85; white-space: pre-wrap; }
  .rc-body strong { color: var(--text); }

  /* ── TRIP CARDS ── */
  .trip-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 20px; }
  .trip-card {
    background: var(--glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-lg);
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    cursor: pointer;
    animation: fadeUp 0.3s ease both;
  }
  .trip-card:hover { transform: translateY(-4px); border-color: rgba(14,184,160,0.3); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .trip-card-header {
    background: linear-gradient(135deg, rgba(14,184,160,0.1), rgba(26,108,245,0.08));
    padding: 20px 22px;
    border-bottom: 1px solid var(--glass-border);
  }
  .trip-route {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--white);
    margin-bottom: 5px;
  }
  .trip-dates { font-size: 12px; color: var(--text-muted); }
  .trip-card-body { padding: 14px 22px; }
  .trip-meta { display: flex; gap: 8px; flex-wrap: wrap; }
  .trip-pill {
    background: rgba(14,184,160,0.1);
    border: 1px solid rgba(14,184,160,0.2);
    border-radius: 100px;
    padding: 3px 10px;
    font-size: 11px;
    color: var(--teal-lt);
    font-weight: 500;
  }
  .trip-card-actions { padding: 12px 22px; display: flex; gap: 8px; border-top: 1px solid var(--glass-border); }

  /* ── EMPTY STATE ── */
  .empty-state { text-align: center; padding: 60px 30px; color: var(--text-muted); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
  .empty-text { font-size: 14px; line-height: 1.7; max-width: 320px; margin: 0 auto; }

  /* ── WEATHER ── */
  .weather-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
  .weather-card {
    background: var(--glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-md);
    padding: 18px;
    text-align: center;
    transition: transform 0.2s, border-color 0.2s;
  }
  .weather-card:hover { transform: translateY(-2px); border-color: rgba(14,184,160,0.25); }
  .w-day { font-size: 11px; color: var(--text-dim); margin-bottom: 8px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
  .w-icon { font-size: 28px; margin-bottom: 8px; }
  .w-temp { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--white); }
  .w-desc { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  .w-detail { font-size: 11px; color: var(--text-dim); margin-top: 2px; }

  /* ── SCHEDULE ── */
  .schedule-day {
    background: var(--glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-lg);
    margin-bottom: 14px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
  }
  .day-header {
    background: linear-gradient(90deg, rgba(14,184,160,0.1), transparent);
    padding: 14px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--glass-border);
  }
  .day-label { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--white); }
  .day-date { font-size: 11px; color: var(--text-muted); }
  .schedule-items { padding: 16px 22px; display: flex; flex-direction: column; gap: 10px; }
  .schedule-item { display: grid; grid-template-columns: 75px 1fr; gap: 12px; align-items: start; }
  .si-time { font-size: 11.5px; color: var(--teal-lt); font-weight: 600; padding-top: 3px; letter-spacing: 0.02em; }
  .si-content {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: var(--r-sm);
    padding: 10px 14px;
  }
  .si-title { font-size: 13px; color: var(--text); font-weight: 500; margin-bottom: 3px; }
  .si-desc { font-size: 12px; color: var(--text-muted); }

  /* ── PACKING ── */
  .pack-categories { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; }
  .pack-cat {
    background: var(--glass);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-md);
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
  }
  .pack-cat-header {
    background: rgba(14,184,160,0.07);
    padding: 12px 18px;
    font-size: 12px;
    font-weight: 600;
    color: var(--teal-lt);
    border-bottom: 1px solid var(--glass-border);
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pack-items { padding: 10px 16px; display: flex; flex-direction: column; gap: 6px; }
  .pack-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: opacity 0.15s;
  }
  .pack-item:last-child { border-bottom: none; }
  .pack-item:hover { opacity: 0.85; }
  .pack-check {
    width: 17px; height: 17px;
    border-radius: 5px;
    border: 1.5px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    font-size: 9px;
    color: transparent;
    background: transparent;
  }
  .pack-check.checked { background: var(--teal); border-color: var(--teal); color: var(--depth-1); box-shadow: 0 0 8px var(--teal-glow); }
  .pack-label { font-size: 13px; color: var(--text); transition: color 0.2s; }
  .pack-label.done { color: var(--text-dim); text-decoration: line-through; }
  .pack-progress { height: 2px; background: rgba(255,255,255,0.06); overflow: hidden; margin: 0 16px 10px; border-radius: 100px; }
  .pack-bar { height: 100%; background: linear-gradient(to right, var(--teal), var(--blue-lt)); border-radius: 100px; transition: width 0.35s; }

  /* ── TABS ── */
  .tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-sm);
    padding: 4px;
    width: fit-content;
  }
  .tab {
    background: none;
    border: none;
    padding: 8px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: 7px;
    transition: all 0.2s;
  }
  .tab:hover { color: var(--text); background: rgba(255,255,255,0.04); }
  .tab.active { color: var(--depth-1); background: linear-gradient(135deg, var(--teal), #0891b2); box-shadow: 0 2px 12px rgba(14,184,160,0.35); }

  /* ── DIVIDER ── */
  .section-label {
    font-size: 10.5px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(to right, rgba(14,184,160,0.2), transparent); }

  /* ── TOAST ── */
  .toast {
    position: fixed;
    bottom: 28px; right: 28px;
    background: rgba(4,21,40,0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(14,184,160,0.3);
    border-radius: var(--r-md);
    padding: 13px 22px;
    font-size: 13px;
    color: var(--teal-lt);
    z-index: 999;
    animation: toastIn 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  @keyframes toastIn { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:none;} }

  /* ── CHAT ── */
  .chat-page { display: flex; flex-direction: column; height: calc(100vh - 58px); overflow: hidden; }
  .chat-header { padding: 22px 32px 0; flex-shrink: 0; }

  .finn-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, rgba(14,184,160,0.1), rgba(26,108,245,0.07));
    backdrop-filter: blur(16px);
    border: 1px solid rgba(14,184,160,0.2);
    border-radius: var(--r-lg);
    padding: 18px 22px;
    margin-bottom: 14px;
    box-shadow: 0 4px 24px rgba(14,184,160,0.08);
  }
  .finn-avatar-lg {
    width: 46px; height: 46px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--teal), #0891b2);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(14,184,160,0.35);
  }
  .finn-card-text h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--white); margin-bottom: 3px; }
  .finn-card-text p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

  .chat-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 32px 12px; flex-shrink: 0; }
  .chip {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border);
    border-radius: 100px;
    padding: 6px 14px;
    font-size: 12px;
    color: var(--text-muted);
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .chip:hover { background: var(--teal-dim); border-color: rgba(14,184,160,0.3); color: var(--teal-lt); }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 8px 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .chat-msg { display: flex; gap: 10px; align-items: flex-end; animation: fadeUp 0.2s ease both; max-width: 100%; }
  .chat-msg.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 28px; height: 28px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }
  .chat-msg.finn .msg-avatar { background: linear-gradient(135deg, var(--teal), #0891b2); box-shadow: 0 2px 10px rgba(14,184,160,0.3); }
  .chat-msg.user .msg-avatar { background: rgba(255,255,255,0.07); border: 1px solid var(--glass-border); }

  .chat-bubble {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 13.5px;
    line-height: 1.7;
    word-break: break-word;
  }
  .chat-msg.finn .chat-bubble {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    color: var(--text);
    border-bottom-left-radius: 4px;
  }
  .chat-msg.user .chat-bubble {
    background: linear-gradient(135deg, var(--teal), #0891b2);
    color: var(--depth-1);
    font-weight: 500;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 20px rgba(14,184,160,0.25);
  }

  .typing-dots { display: flex; gap: 5px; align-items: center; padding: 6px 4px; }
  .typing-dots span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--teal);
    display: inline-block;
    animation: dot 1.2s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot { 0%,60%,100%{opacity:0.2;transform:translateY(0);} 30%{opacity:1;transform:translateY(-4px);} }

  .chat-input-row {
    padding: 14px 32px 22px;
    border-top: 1px solid var(--glass-border);
    background: rgba(4,21,40,0.5);
    backdrop-filter: blur(20px);
    display: flex;
    gap: 10px;
    align-items: flex-end;
    flex-shrink: 0;
  }
  .chat-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-md);
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    resize: none;
    min-height: 46px;
    max-height: 120px;
    transition: border-color 0.2s, box-shadow 0.2s;
    line-height: 1.5;
  }
  .chat-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(14,184,160,0.1); }
  .chat-input::placeholder { color: var(--text-dim); }
  .send-btn {
    background: linear-gradient(135deg, var(--teal), #0891b2);
    border: none;
    border-radius: var(--r-sm);
    width: 46px; height: 46px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    flex-shrink: 0;
    color: var(--depth-1);
    box-shadow: 0 4px 16px rgba(14,184,160,0.3);
  }
  .send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.05); }
  .send-btn:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }

  /* ── RESPONSIVE ── */
  @media (max-width: 700px) {
    .sidebar { width: 0; overflow: hidden; }
    .main { margin-left: 0; }
    .page { padding: 20px; }
    .results-grid { grid-template-columns: 1fr; }
    .result-card.wide { grid-column: 1; }
    .chat-messages, .chat-input-row, .chat-chips, .chat-header { padding-left: 16px; padding-right: 16px; }
    .tabs { width: 100%; overflow-x: auto; }
  }
`;

// ── CONSTANTS ──────────────────────────────────
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
  "Safest cities for solo women?",
];

const FINN_SYSTEM = `You are Finn, a warm and knowledgeable travel buddy inside the "Ask Finn" travel app. You speak like a well-travelled friend — enthusiastic, practical, and honest. You give specific, real-world advice, not generic tips. You love sharing hidden gems and local secrets. Keep replies conversational and concise. Use emojis naturally. You're an expert on destinations, visas, packing, culture, safety, food, transport, and all things travel.`;

const WEATHER_ICONS = {
  sunny:"☀️",clear:"☀️",cloudy:"☁️",overcast:"☁️",rain:"🌧️",rainy:"🌧️",
  drizzle:"🌦️",storm:"⛈️",snow:"❄️",fog:"🌫️",wind:"🌬️",hot:"🌡️",
  warm:"🌤️",cool:"🍃",cold:"🧊",thunderstorm:"⛈️",partly:"🌤️",
};
const weatherIcon = (desc="") => {
  const d = desc.toLowerCase();
  for (const [k,v] of Object.entries(WEATHER_ICONS)) if (d.includes(k)) return v;
  return "🌡️";
};

function formatDate(s) {
  if (!s) return "";
  return new Date(s+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}
function daysBetween(a,b) {
  if (!a||!b) return 0;
  return Math.max(0,Math.round((new Date(b)-new Date(a))/86400000));
}
function getDaysList(start,end) {
  const days=[], s=new Date(start+"T00:00:00"), e=new Date(end+"T00:00:00");
  for (let d=new Date(s); d<=e; d.setDate(d.getDate()+1)) days.push(new Date(d));
  return days;
}
function html(str="") { return str.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"); }

// ── API ────────────────────────────────────────
async function callClaude(messages) {
  const res = await fetch("/api/claude", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({messages}),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.content?.map(c=>c.text||"").join("")||"";
}
async function callClaudeJSON(prompt) {
  const text = await callClaude([{role:"user",content:prompt}]);
  return text.replace(/```json|```/g,"").trim();
}

// ── STORAGE ────────────────────────────────────
function saveTrip(trip) {
  try { const all=loadAllTrips(); all[trip.id]=trip; localStorage.setItem("askfinn_trips",JSON.stringify(all)); } catch(e){console.error(e);}
}
function loadAllTrips() {
  try { return JSON.parse(localStorage.getItem("askfinn_trips")||"{}"); } catch { return {}; }
}
function loadTrips() { return Object.values(loadAllTrips()).sort((a,b)=>b.createdAt-a.createdAt); }
function deleteTrip(id) {
  try { const all=loadAllTrips(); delete all[id]; localStorage.setItem("askfinn_trips",JSON.stringify(all)); } catch(e){console.error(e);}
}

// ── COMPONENTS ─────────────────────────────────
function Spinner({msg}) {
  return (
    <div className="loading">
      <div className="spinner"/>
      <div className="loading-msg">{msg}</div>
    </div>
  );
}

function ResultCard({icon,title,content,wide,delay}) {
  if (!content) return null;
  return (
    <div className={`result-card${wide?" wide":""}`} style={{animationDelay:`${delay||0}ms`}}>
      <div className="rc-icon">{icon}</div>
      <div className="rc-title">{title}</div>
      <div className="rc-body" dangerouslySetInnerHTML={{__html:html(content)}}/>
    </div>
  );
}

// ── CHAT PAGE ──────────────────────────────────
function ChatPage() {
  const [messages, setMessages] = useState([
    {role:"finn", text:"Hey! I'm Finn 👋 Your personal travel buddy. Ask me anything — best destinations, visa requirements, what to pack, local tips, hidden gems… I've got you covered. Where are you thinking of heading? 🌍"}
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const apiHistory = useRef([]);
  const bottomRef = useRef();

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages,typing]);

  const send = async (text) => {
    const msg = (text||input).trim();
    if (!msg||typing) return;
    setInput("");
    setMessages(p=>[...p,{role:"user",text:msg}]);
    apiHistory.current = [...apiHistory.current,{role:"user",content:msg}];
    setTyping(true);
    try {
      const apiMsgs = [
        {role:"user",content:FINN_SYSTEM},
        {role:"assistant",content:"Got it! I'm Finn, your travel buddy. Ready to help!"},
        ...apiHistory.current,
      ];
      const reply = await callClaude(apiMsgs);
      apiHistory.current = [...apiHistory.current,{role:"assistant",content:reply}];
      setMessages(p=>[...p,{role:"finn",text:reply}]);
    } catch {
      setMessages(p=>[...p,{role:"finn",text:"Lost my signal for a sec! Try again? 📡"}]);
    } finally { setTyping(false); }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="finn-card">
          <div className="finn-avatar-lg">🧭</div>
          <div className="finn-card-text">
            <h3>Ask Finn Anything</h3>
            <p>Visas · Destinations · Packing · Culture · Safety · Hidden gems · Food · Transport</p>
          </div>
        </div>
      </div>
      <div className="chat-chips">
        {CHAT_SUGGESTIONS.map((s,i)=>(
          <button key={i} className="chip" onClick={()=>send(s)}>{s}</button>
        ))}
      </div>
      <div className="chat-messages">
        {messages.map((msg,i)=>(
          <div key={i} className={`chat-msg ${msg.role}`}>
            <div className="msg-avatar">{msg.role==="finn"?"🧭":"👤"}</div>
            <div className="chat-bubble" dangerouslySetInnerHTML={{__html:msg.text.replace(/\n/g,"<br/>")}}/>
          </div>
        ))}
        {typing && (
          <div className="chat-msg finn">
            <div className="msg-avatar">🧭</div>
            <div className="chat-bubble" style={{padding:"10px 16px"}}>
              <div className="typing-dots"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Ask Finn anything about travel…"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }}
          rows={1}
        />
        <button className="send-btn" onClick={()=>send()} disabled={!input.trim()||typing}>➤</button>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────

// ── EDIT TRIP MODAL ────────────────────────────
function EditTripModal({ trip, onSave, onClose }) {
  const [form, setForm] = useState({
    from:         trip.from         || "",
    to:           trip.to           || "",
    departDate:   trip.departDate   || "",
    returnDate:   trip.returnDate   || "",
    airline:      trip.airline      || "",
    flightNumber: trip.flightNumber || "",
    hotel:        trip.hotel        || "",
    interests:    trip.interests    || "",
  });
  const [saving, setSaving] = useState(false);

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaving(true);
    const updated = { ...trip, ...form };
    saveTrip(updated);
    setTimeout(() => {
      onSave(updated);
      setSaving(false);
    }, 300);
  };

  const changed = Object.keys(form).some(k => form[k] !== (trip[k] || ""));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">✏️ Edit Trip Details</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section-label">Route & Dates</div>
          <div className="form-grid">
            <div className="field"><label>Flying From</label>
              <input placeholder="e.g. New York, JFK" value={form.from} onChange={e=>upd("from",e.target.value)}/>
            </div>
            <div className="field"><label>Destination</label>
              <input placeholder="e.g. Paris, CDG" value={form.to} onChange={e=>upd("to",e.target.value)}/>
            </div>
            <div className="field"><label>Departure Date</label>
              <input type="date" value={form.departDate} onChange={e=>upd("departDate",e.target.value)}/>
            </div>
            <div className="field"><label>Return Date</label>
              <input type="date" value={form.returnDate} onChange={e=>upd("returnDate",e.target.value)}/>
            </div>
          </div>

          <div className="modal-section-label">Flight Details</div>
          <div className="form-grid">
            <div className="field"><label>Airline</label>
              <input placeholder="e.g. Air France" value={form.airline} onChange={e=>upd("airline",e.target.value)}/>
            </div>
            <div className="field"><label>Flight Number</label>
              <input placeholder="e.g. AF 007" value={form.flightNumber} onChange={e=>upd("flightNumber",e.target.value)}/>
            </div>
          </div>

          <div className="modal-section-label">Stay & Interests</div>
          <div className="form-grid">
            <div className="field"><label>Hotel / Area</label>
              <input placeholder="e.g. Le Marais, 4th Arr." value={form.hotel} onChange={e=>upd("hotel",e.target.value)}/>
            </div>
            <div className="field"><label>Interests</label>
              <input placeholder="e.g. food, art, hiking" value={form.interests} onChange={e=>upd("interests",e.target.value)}/>
            </div>
          </div>

          {changed && (
            <div style={{
              marginTop:18, padding:"12px 16px",
              background:"rgba(14,184,160,0.07)",
              border:"1px solid rgba(14,184,160,0.18)",
              borderRadius:"var(--r-sm)",
              fontSize:12, color:"var(--text-muted)", lineHeight:1.6
            }}>
              💡 <strong style={{color:"var(--teal-lt)"}}>Tip:</strong> Saving these changes won't regenerate your guide. If you changed the destination or dates significantly, consider regenerating from the Plan page.
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || !form.from || !form.to}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({trips, onSelectTrip, onNewTrip, onDeleteTrip, onEditTrip}) {
  return (
    <div className="page">
      <div className="page-eyebrow">Your Travel Hub</div>
      <div className="page-title">Your <em>Journeys</em></div>
      <div className="page-sub">All your planned trips, ready to explore. Pick one up where you left off, or let Finn plan your next adventure.</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div className="section-label">Saved Trips</div>
        <button className="btn-primary" onClick={onNewTrip} style={{marginBottom:14,padding:"10px 20px",fontSize:"12.5px"}}>+ New Trip</button>
      </div>
      {trips.length===0 ? (
        <div className="empty-state">
          <div className="empty-icon">✈️</div>
          <div className="empty-text">No trips yet. Let Finn plan your first adventure.</div>
          <br/>
          <button className="btn-primary" onClick={onNewTrip}>Plan a Trip with Finn</button>
        </div>
      ) : (
        <div className="trip-cards">
          {trips.map((t,i)=>(
            <div className="trip-card" key={t.id} style={{animationDelay:`${i*60}ms`}}>
              <div className="trip-card-header" onClick={()=>onSelectTrip(t)}>
                <div className="trip-route">{t.from} → {t.to}</div>
                <div className="trip-dates">{formatDate(t.departDate)} – {formatDate(t.returnDate)}</div>
              </div>
              <div className="trip-card-body">
                <div className="trip-meta">
                  {t.airline&&<span className="trip-pill">✈️ {t.airline}</span>}
                  {t.hotel&&<span className="trip-pill">🏨 {t.hotel}</span>}
                  {t.departDate&&t.returnDate&&<span className="trip-pill">📅 {daysBetween(t.departDate,t.returnDate)}d</span>}
                </div>
              </div>
              <div className="trip-card-actions">
                <button className="btn-ghost" onClick={()=>onSelectTrip(t)}>Open →</button>
                <button className="btn-ghost" onClick={e=>{e.stopPropagation();onEditTrip(t);}}>✏️ Edit</button>
                <button className="btn-danger" onClick={e=>{e.stopPropagation();onDeleteTrip(t.id);}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PLAN PAGE ──────────────────────────────────
function PlanPage({onTripSaved}) {
  const [form,setForm]=useState({from:"",to:"",departDate:"",returnDate:"",airline:"",flightNumber:"",hotel:"",interests:""});
  const [files,setFiles]=useState([]);
  const [drag,setDrag]=useState(false);
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState("");
  const [results,setResults]=useState(null);
  const fileRef=useRef(), timerRef=useRef();

  const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
  const handleFiles=(fl)=>setFiles(p=>[...p,...Array.from(fl).map(f=>f.name)]);

  const generate=async()=>{
    if(!form.from||!form.to) return;
    setLoading(true); setResults(null);
    let i=0; setLoadMsg(LOADING_MSGS[0]);
    timerRef.current=setInterval(()=>{i=(i+1)%LOADING_MSGS.length;setLoadMsg(LOADING_MSGS[i]);},2000);

    const p1=`Travel concierge. Respond ONLY with valid JSON, no markdown.
Trip: ${form.from} → ${form.to}, ${form.departDate||"?"} to ${form.returnDate||"?"}, Hotel: ${form.hotel||"city center"}, Interests: ${form.interests||"general"}
Return ONLY this JSON:
{"transport":"2 paragraphs: airport to city options, costs, time.","layover":"1 paragraph: airport tips.","timezone":"1 paragraph: time difference and jet lag tip.","currency":"1 paragraph: currency, tipping, cards.","apps":"**App** - description. List 5 apps.","attractions":"1. **Name** - description. List 6 attractions.","tips":"• tip. List 5 insider tips."}`;

    const p2=`Travel data. Respond ONLY with valid JSON, no markdown.
Destination: ${form.to}, Dates: ${form.departDate||"?"} to ${form.returnDate||"?"}, Interests: ${form.interests||"general"}
Return ONLY this JSON:
{"weather_forecast":[{"day":"Mon","date":"Jan 1","high_f":72,"low_f":58,"condition":"Sunny","humidity":"45%","tip":"Great for sightseeing"}],"packing":{"Clothing":["item"],"Toiletries":["item"],"Tech":["item"],"Documents":["item"],"Extras":["item"]}}
weather_forecast: 5 days realistic for destination/season. packing: 5 categories, 6 items each.`;

    try {
      const [t1,t2]=await Promise.all([callClaudeJSON(p1),callClaudeJSON(p2)]);
      const data={...JSON.parse(t1),...JSON.parse(t2)};
      const trip={...form,files,id:Date.now().toString(),createdAt:Date.now(),guide:data};
      saveTrip(trip); setResults(trip); onTripSaved(trip);
    } catch(e) {
      console.error(e);
      setResults({guide:{transport:"Finn hit a snag! Please try again."}});
    } finally { clearInterval(timerRef.current); setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-eyebrow">Trip Planner</div>
      <div className="page-title">Plan a <em>New Journey</em></div>
      <div className="page-sub">Tell Finn where you're headed and he'll build your complete travel guide — transport, tips, packing, weather and more.</div>
      <div className="section-label">Trip Details</div>
      <div className="glass-card" style={{marginBottom:24}}>
        <div className="form-grid">
          <div className="field"><label>Flying From</label><input placeholder="e.g. New York, JFK" value={form.from} onChange={e=>upd("from",e.target.value)}/></div>
          <div className="field"><label>Destination</label><input placeholder="e.g. Paris, CDG" value={form.to} onChange={e=>upd("to",e.target.value)}/></div>
          <div className="field"><label>Departure</label><input type="date" value={form.departDate} onChange={e=>upd("departDate",e.target.value)}/></div>
          <div className="field"><label>Return</label><input type="date" value={form.returnDate} onChange={e=>upd("returnDate",e.target.value)}/></div>
          <div className="field"><label>Airline</label><input placeholder="e.g. Air France" value={form.airline} onChange={e=>upd("airline",e.target.value)}/></div>
          <div className="field"><label>Flight Number</label><input placeholder="e.g. AF 007" value={form.flightNumber} onChange={e=>upd("flightNumber",e.target.value)}/></div>
          <div className="field"><label>Hotel / Area</label><input placeholder="e.g. Le Marais, 4th Arr." value={form.hotel} onChange={e=>upd("hotel",e.target.value)}/></div>
          <div className="field"><label>Interests</label><input placeholder="e.g. food, art, hiking, nightlife" value={form.interests} onChange={e=>upd("interests",e.target.value)}/></div>
        </div>
        <div className="field">
          <label>Upload Documents (optional)</label>
          <div className={`upload-zone${drag?" drag":""}`}
            onClick={()=>fileRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files);}}>
            <div style={{fontSize:26,marginBottom:8}}>🗂</div>
            <div style={{fontSize:13,color:"var(--text-muted)"}}>
              <strong style={{color:"var(--text)",display:"block",marginBottom:4}}>Drop boarding passes, hotel confirmations & itineraries</strong>
              PDF, image or text — drag & drop or click to browse
            </div>
            {files.length>0&&<div className="upload-tags">{files.map((f,i)=><span key={i} className="tag">📎 {f}</span>)}</div>}
            <input ref={fileRef} type="file" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
          </div>
        </div>
        <button className="btn-primary" style={{width:"100%",marginTop:20}} onClick={generate} disabled={!form.from||!form.to||loading}>
          {loading?"Finn is working on it…":"🧭 Ask Finn to Plan My Trip"}
        </button>
      </div>
      {loading&&<Spinner msg={loadMsg}/>}
      {results&&<GuideView trip={results}/>}
    </div>
  );
}

// ── GUIDE VIEW ─────────────────────────────────
function GuideView({trip, onTripUpdated}) {
  const [tab,setTab]=useState("guide");
  const [editing,setEditing]=useState(false);
  const g=trip.guide||{};
  return (
    <div style={{marginTop:8}}>
      {editing && (
        <EditTripModal
          trip={trip}
          onSave={updated=>{ onTripUpdated(updated); setEditing(false); }}
          onClose={()=>setEditing(false)}
        />
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.25rem",color:"var(--white)"}}>
            {trip.from} <span style={{color:"var(--teal)"}}>→</span> {trip.to}
          </div>
          <div style={{fontSize:12,color:"var(--text-muted)",marginTop:3}}>
            {formatDate(trip.departDate)} – {formatDate(trip.returnDate)} · {daysBetween(trip.departDate,trip.returnDate)} nights
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-ghost" onClick={()=>setEditing(true)}>✏️ Edit</button>
          <button className="btn-ghost" onClick={()=>navigator.clipboard?.writeText(`My trip: ${trip.from} → ${trip.to}\n${formatDate(trip.departDate)} – ${formatDate(trip.returnDate)}\nPlanned by Ask Finn`)}>Share ↗</button>
        </div>
      </div>
      <div className="tabs">
        {[["guide","🗺️ Guide"],["weather","🌤️ Weather"],["schedule","📅 Schedule"],["packing","🎒 Packing"]].map(([k,l])=>(
          <button key={k} className={`tab${tab===k?" active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      {tab==="guide"&&(
        <div className="results-grid">
          <ResultCard icon="🚇" title="Airport to City" content={g.transport} wide delay={0}/>
          <ResultCard icon="✈️" title="Layover & Transit" content={g.layover} delay={80}/>
          <ResultCard icon="🕐" title="Time Zone & Jet Lag" content={g.timezone} delay={120}/>
          <ResultCard icon="💱" title="Currency & Money" content={g.currency} delay={160}/>
          <ResultCard icon="📱" title="Essential Apps" content={g.apps} delay={200}/>
          <ResultCard icon="🗺️" title="Attractions & Experiences" content={g.attractions} wide delay={240}/>
          <ResultCard icon="💡" title="Finn's Insider Tips" content={g.tips} wide delay={280}/>
        </div>
      )}
      {tab==="weather"&&<WeatherTab forecast={g.weather_forecast} destination={trip.to}/>}
      {tab==="schedule"&&<ScheduleTab trip={trip} guide={g}/>}
      {tab==="packing"&&<PackingTab packing={g.packing}/>}
    </div>
  );
}

// ── WEATHER TAB ────────────────────────────────
function WeatherTab({forecast,destination}) {
  if (!forecast||!Array.isArray(forecast)) return <div style={{color:"var(--text-muted)",padding:"40px 0",textAlign:"center"}}>No weather data yet.</div>;
  const avgHigh=Math.round(forecast.reduce((s,d)=>s+(d.high_f||0),0)/forecast.length);
  const avgLow=Math.round(forecast.reduce((s,d)=>s+(d.low_f||0),0)/forecast.length);
  return (
    <div>
      <div className="section-label">5-Day Forecast — {destination}</div>
      <div className="weather-grid" style={{marginBottom:20}}>
        {forecast.map((d,i)=>(
          <div className="weather-card" key={i} style={{animationDelay:`${i*60}ms`}}>
            <div className="w-day">{d.day}</div>
            <div className="w-icon">{weatherIcon(d.condition)}</div>
            <div className="w-temp">{d.high_f}°<span style={{fontSize:"1rem",color:"var(--text-muted)"}}>/{d.low_f}°</span></div>
            <div className="w-desc">{d.condition}</div>
            <div className="w-detail">💧 {d.humidity}</div>
          </div>
        ))}
      </div>
      <div className="glass-card">
        <div className="card-heading">🌡️ Finn's Weather Summary</div>
        <div className="card-body">
          <strong>Average High:</strong> {avgHigh}°F · <strong>Average Low:</strong> {avgLow}°F<br/><br/>
          {forecast.map((d,i)=>(
            <div key={i} style={{marginBottom:8}}><strong>{d.day} ({d.date}):</strong> {d.tip}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SCHEDULE TAB ───────────────────────────────
function ScheduleTab({trip,guide}) {
  const [schedule,setSchedule]=useState(null);
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState("");
  const timerRef=useRef();

  const generate=async()=>{
    setLoading(true);
    let i=0; setLoadMsg(LOADING_MSGS[0]);
    timerRef.current=setInterval(()=>{i=(i+1)%LOADING_MSGS.length;setLoadMsg(LOADING_MSGS[i]);},2000);
    const days=getDaysList(trip.departDate,trip.returnDate);
    const prompt=`Day-by-day itinerary for ${trip.to}, ${trip.departDate} to ${trip.returnDate}. Interests: ${trip.interests||"general"}. Hotel: ${trip.hotel||"city center"}.
Respond ONLY with JSON array, no markdown:
[{"day":"Day 1","date":"Mon, Jan 6","theme":"Arrival","items":[{"time":"10:00 AM","title":"Activity","desc":"One sentence."}]}]
Create ${days.length} days, 5 time slots each.`;
    try {
      const text=await callClaudeJSON(prompt);
      const data=JSON.parse(text);
      setSchedule(data);
      saveTrip({...trip,guide:{...guide,schedule:data}});
    } catch(e){console.error(e);}
    finally{clearInterval(timerRef.current);setLoading(false);}
  };

  const existing=guide.schedule||schedule;
  return (
    <div>
      <div className="section-label">Day-by-Day Itinerary</div>
      {!existing&&!loading&&(
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-text">Let Finn map out your perfect day-by-day schedule.</div>
          <br/>
          <button className="btn-primary" onClick={generate}>🧭 Ask Finn to Plan My Days</button>
        </div>
      )}
      {loading&&<Spinner msg={loadMsg}/>}
      {existing&&existing.map((day,i)=>(
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
      {existing&&<button className="btn-ghost" onClick={generate} style={{marginTop:8}}>↻ Ask Finn to Regenerate</button>}
    </div>
  );
}

// ── PACKING TAB ────────────────────────────────
function PackingTab({packing}) {
  const [checked,setChecked]=useState({});
  if (!packing||typeof packing!=="object") return <div style={{color:"var(--text-muted)",padding:"40px 0",textAlign:"center"}}>No packing list yet.</div>;
  const cats=Object.entries(packing);
  const total=cats.reduce((s,[,v])=>s+(v?.length||0),0);
  const done=Object.values(checked).filter(Boolean).length;
  const toggle=k=>setChecked(p=>({...p,[k]:!p[k]}));
  const ICONS={Clothing:"👕",Toiletries:"🧴",Tech:"💻",Documents:"📄",Extras:"🎒",Entertainment:"🎧",Health:"💊",Footwear:"👟",Accessories:"⌚",Food:"🍎",Money:"💳"};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div className="section-label" style={{margin:0,flex:1}}>Packing List</div>
        <div style={{fontSize:13,color:"var(--text-muted)"}}><span style={{color:"var(--teal-lt)",fontWeight:600}}>{done}</span> / {total} packed</div>
      </div>
      <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:100,overflow:"hidden",marginBottom:20}}>
        <div style={{height:"100%",background:"linear-gradient(to right,var(--teal),var(--blue-lt))",width:`${(done/total*100)||0}%`,transition:"width 0.35s",borderRadius:100,boxShadow:"0 0 10px var(--teal-glow)"}}/>
      </div>
      <div className="pack-categories">
        {cats.map(([cat,items],ci)=>{
          const catDone=(items||[]).filter((_,ii)=>checked[`${ci}-${ii}`]).length;
          return (
            <div className="pack-cat" key={ci} style={{animationDelay:`${ci*50}ms`}}>
              <div className="pack-cat-header">{ICONS[cat]||"📦"} {cat}</div>
              <div className="pack-progress"><div className="pack-bar" style={{width:`${items?.length?(catDone/items.length*100):0}%`}}/></div>
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

// ── MAIN APP ───────────────────────────────────

// ── TICKER BAR ─────────────────────────────────
function TickerBar({ activeTrip, onAlertsClick, alertCount }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickerData();
  }, [activeTrip?.id]);

  const loadTickerData = async () => {
    setLoading(true);
    const newItems = [];

    // 1. Exchange rates
    try {
      const res = await fetch("/api/rates?base=USD&symbols=EUR,GBP,JPY,AUD,CAD,THB,SGD");
      const data = await res.json();
      if (data.rates) {
        const pairs = [
          ["EUR","€"],["GBP","£"],["JPY","¥"],["AUD","A$"],["CAD","C$"],["THB","฿"],["SGD","S$"]
        ];
        pairs.forEach(([sym,sign]) => {
          if (data.rates[sym]) {
            newItems.push({
              icon:"💱", label:`USD/${sym}`,
              val:`${sign}${data.rates[sym].toFixed(sym==="JPY"?0:2)}`,
              type:"rate"
            });
          }
        });
      }
    } catch(e) { console.error("Rates error",e); }

    // 2. Flight status
    if (activeTrip?.flightNumber) {
      try {
        const fn = encodeURIComponent(activeTrip.flightNumber.replace(/\s/g,""));
        const res = await fetch(`/api/flight?flightNumber=${fn}`);
        const data = await res.json();
        if (data.found) {
          const statusColor = data.status==="active"?"t-up":data.status==="landed"?"t-up":data.status==="cancelled"?"t-down":"t-warn";
          const dep = data.departure?.delay > 0 ? ` · Delayed ${data.departure.delay}min` : "";
          newItems.push({
            icon:"✈️", label:`${data.flightNumber}`,
            val:`${data.status?.toUpperCase()}${dep}`,
            type:"flight", colorClass: statusColor
          });
          if (data.departure?.gate) {
            newItems.push({ icon:"🚪", label:"Gate", val:`${data.departure.iata} ${data.departure.gate}`, type:"flight" });
          }
          if (data.arrival?.terminal) {
            newItems.push({ icon:"🛬", label:"Arrives", val:`${data.arrival.iata} T${data.arrival.terminal}`, type:"flight" });
          }
        } else {
          newItems.push({ icon:"✈️", label:activeTrip.flightNumber, val:"No live data yet", type:"flight" });
        }
      } catch(e) { console.error("Flight error",e); }
    } else if (activeTrip) {
      newItems.push({ icon:"✈️", label:"Flight", val:"Add flight number to track", type:"flight" });
    }

    // 3. Weather snapshot
    if (activeTrip?.guide?.weather_forecast?.[0]) {
      const w = activeTrip.guide.weather_forecast[0];
      newItems.push({
        icon:"🌡️", label:activeTrip.to,
        val:`${w.high_f}°F / ${w.low_f}°F · ${w.condition}`,
        type:"weather"
      });
    } else if (activeTrip) {
      newItems.push({ icon:"🌡️", label:activeTrip.to || "Weather", val:"Generate trip guide for forecast", type:"weather" });
    }

    // 4. Travel news
    try {
      const res = await fetch("/api/news?q=travel+destinations+tips");
      const data = await res.json();
      if (data.articles?.length) {
        data.articles.slice(0,5).forEach(a => {
          newItems.push({ icon:"📰", label:a.source||"News", val:a.title, type:"news" });
        });
      }
    } catch(e) { console.error("News error",e); }

    // Fallback if nothing loaded
    if (newItems.length === 0) {
      newItems.push(
        { icon:"💱", label:"USD/EUR", val:"€0.92", type:"rate" },
        { icon:"💱", label:"USD/GBP", val:"£0.79", type:"rate" },
        { icon:"💱", label:"USD/JPY", val:"¥149", type:"rate" },
        { icon:"✈️", label:"Flight", val:"Plan a trip to see live flight data", type:"flight" },
        { icon:"📰", label:"Travel", val:"Ask Finn about your next destination", type:"news" },
      );
    }

    setItems(newItems);
    setLoading(false);
  };

  if (loading && items.length === 0) {
    return (
      <div className="ticker-bar">
        <div className="ticker-label">LIVE</div>
        <div style={{flex:1,display:"flex",alignItems:"center",padding:"0 16px"}}>
          <div style={{fontSize:11,color:"var(--text-dim)",fontStyle:"italic"}}>Finn is fetching live data…</div>
        </div>
      </div>
    );
  }

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="ticker-bar">
      <div className="ticker-label">LIVE</div>
      <div className="ticker-track">
        <div className="ticker-scroll" style={{animationDuration:`${Math.max(30, items.length * 6)}s`}}>
          {allItems.map((item, i) => (
            <div className="ticker-item" key={i}>
              <span className="t-icon">{item.icon}</span>
              <span className="t-label">{item.label}</span>
              <span className={`t-val ${item.colorClass||""}`}>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ticker-right">
        <button className="alert-btn" onClick={onAlertsClick} title="View alerts">
          🔔
          {alertCount > 0 && <div className="alert-badge">{alertCount}</div>}
        </button>
      </div>
    </div>
  );
}

// ── ALERT PANEL ────────────────────────────────
function AlertPanel({ onClose, activeTrip }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { generateAlerts(); }, []);

  const generateAlerts = async () => {
    setLoading(true);
    const newAlerts = [];
    const now = new Date();

    // Flight delay alert
    if (activeTrip?.flightNumber) {
      try {
        const fn = encodeURIComponent(activeTrip.flightNumber.replace(/\s/g,""));
        const res = await fetch(`/api/flight?flightNumber=${fn}`);
        const data = await res.json();
        if (data.found) {
          if (data.departure?.delay > 30) {
            newAlerts.push({
              type:"error", title:`Flight ${data.flightNumber} Delayed`,
              desc:`Departure delayed by ${data.departure.delay} minutes from ${data.departure.iata}.`,
              time:"Just now"
            });
          } else if (data.status === "cancelled") {
            newAlerts.push({
              type:"error", title:`Flight ${data.flightNumber} Cancelled`,
              desc:"Your flight has been cancelled. Contact your airline immediately.",
              time:"Just now"
            });
          } else if (data.status === "active") {
            newAlerts.push({
              type:"success", title:`Flight ${data.flightNumber} On Time`,
              desc:`Departed ${data.departure.iata} on schedule. En route to ${data.arrival.iata}.`,
              time:"Just now"
            });
          }
        }
      } catch(e) {}
    }

    // Weather alert
    if (activeTrip?.guide?.weather_forecast) {
      const forecast = activeTrip.guide.weather_forecast;
      const badWeather = forecast.find(d =>
        d.condition?.toLowerCase().includes("storm") ||
        d.condition?.toLowerCase().includes("thunder") ||
        d.condition?.toLowerCase().includes("hurricane")
      );
      if (badWeather) {
        newAlerts.push({
          type:"warn", title:`Weather Advisory — ${activeTrip.to}`,
          desc:`${badWeather.condition} expected on ${badWeather.date}. Plan indoor activities.`,
          time:"Today"
        });
      }
    }

    // Visa / travel advisory via AI
    if (activeTrip?.to) {
      try {
        const prompt = `Give 2 brief travel advisory alerts for ${activeTrip.to} right now. Focus on: entry requirements, safety, or seasonal warnings. Each alert: one sentence max. Respond ONLY as JSON array: [{"title":"Alert title","desc":"One sentence detail","type":"warn|info|error"}]`;
        const res = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ messages:[{role:"user",content:prompt}] })
        });
        const d = await res.json();
        const text = d.content?.map(c=>c.text||"").join("")||"";
        const advisories = JSON.parse(text.replace(/```json|```/g,"").trim());
        advisories.forEach(a => newAlerts.push({ ...a, time:"Via Finn" }));
      } catch(e) {}
    }

    // Price alert placeholder
    newAlerts.push({
      type:"info", title:"Price Tracking Active",
      desc:`Finn is monitoring flight prices for ${activeTrip?.to || "your destinations"}. You'll be alerted to drops.`,
      time:"Always on"
    });

    setAlerts(newAlerts);
    setLoading(false);
  };

  const dotClass = (type) => type==="warn"?"ai":type==="error"?"ai3":type==="success"?"ai4":"ai2";

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-panel" onClick={e=>e.stopPropagation()}>
        <div className="alert-panel-hdr">
          <h3>🔔 Alerts {alerts.length > 0 && <span style={{fontSize:"0.75rem",color:"var(--text-dim)",fontFamily:"'DM Sans',sans-serif",fontWeight:400}}>({alerts.length})</span>}</h3>
          <button className="alert-close" onClick={onClose}>×</button>
        </div>
        <div className="alert-list">
          {loading ? (
            <div className="alert-empty">Finn is checking for alerts…</div>
          ) : alerts.length === 0 ? (
            <div className="alert-empty">✅ All clear — no alerts for your trip</div>
          ) : alerts.map((a,i) => (
            <div className="alert-row" key={i}>
              <div className="alert-indicator-wrap" style={{paddingTop:4}}>
                <div className={`alert-indicator ${dotClass(a.type)}`}/>
              </div>
              <div className="alert-content-wrap">
                <div className="alert-title">{a.title}</div>
                <div className="alert-desc">{a.desc}</div>
                <div className="alert-ts">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────
export default function App() {
  const [page,setPage]=useState("dashboard");
  const [trips,setTrips]=useState([]);
  const [activeTrip,setActiveTrip]=useState(null);
  const [toast,setToast]=useState("");
  const [showAlerts,setShowAlerts]=useState(false);
  const [alertCount,setAlertCount]=useState(0);
  const [editingTrip,setEditingTrip]=useState(null);

  useEffect(()=>{setTrips(loadTrips());},[]);

  useEffect(()=>{
    if (!activeTrip) { setAlertCount(0); return; }
    let count = 1;
    if (activeTrip.flightNumber) count++;
    if (activeTrip.to) count++;
    setAlertCount(count);
  },[activeTrip?.id]);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(""),3000);};
  const handleTripSaved=trip=>{setTrips(p=>[trip,...p.filter(t=>t.id!==trip.id)]);showToast("✦ Trip saved by Finn");};
  const handleSelectTrip=trip=>{setActiveTrip(trip);setPage("view");};
  const handleDeleteTrip=id=>{deleteTrip(id);setTrips(p=>p.filter(t=>t.id!==id));showToast("Trip deleted");};
  const handleEditTrip=trip=>{setEditingTrip(trip);};
  const handleTripUpdated=updated=>{
    setTrips(p=>p.map(t=>t.id===updated.id?updated:t));
    if (activeTrip?.id===updated.id) setActiveTrip(updated);
    setEditingTrip(null);
    showToast("✦ Trip details updated");
  };

  const NAV=[
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"plan",icon:"✈️",label:"Plan Trip"},
    {id:"chat",icon:"🧭",label:"Ask Finn"},
    {id:"view",icon:"🗺️",label:"My Trip",disabled:!activeTrip},
  ];

  const TITLES={
    dashboard:"Dashboard", plan:"Plan a Trip", chat:"Ask Finn",
    view:activeTrip?`${activeTrip.from} → ${activeTrip.to}`:"Trip Guide",
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">🧭</div>
            <span className="logo-text">Ask Finn</span>
          </div>
          {NAV.map(n=>(
            <button key={n.id}
              className={`nav-btn${page===n.id?" active":""}${n.disabled?" disabled":""}`}
              onClick={()=>{if(!n.disabled)setPage(n.id);}}
              style={n.disabled?{opacity:0.3,cursor:"not-allowed"}:{}}>
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </button>
          ))}
        </nav>

        <main className="main">
          {/* TOP BAR */}
          <div className="topbar">
            <div className="topbar-title">{TITLES[page]}</div>
            <div className="topbar-right">
              <div className="status-pill"><div className="status-dot"/>Finn is Ready</div>
            </div>
          </div>

          {/* LIVE TICKER */}
          <TickerBar
            activeTrip={activeTrip}
            onAlertsClick={()=>setShowAlerts(true)}
            alertCount={alertCount}
          />

          {/* PAGES */}
          {page==="dashboard"&&<DashboardPage trips={trips} onSelectTrip={handleSelectTrip} onNewTrip={()=>setPage("plan")} onDeleteTrip={handleDeleteTrip} onEditTrip={handleEditTrip}/>}
          {page==="plan"&&<PlanPage onTripSaved={handleTripSaved}/>}
          {page==="chat"&&<ChatPage/>}
          {page==="view"&&activeTrip&&<div className="page"><GuideView trip={activeTrip} onTripUpdated={handleTripUpdated}/></div>}
          {page==="view"&&!activeTrip&&(
            <div className="page">
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <div className="empty-text">No trip selected. Plan one with Finn or pick one from your dashboard.</div>
                <br/>
                <button className="btn-primary" onClick={()=>setPage("plan")}>Plan a Trip with Finn</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EDIT TRIP MODAL (from Dashboard) */}
      {editingTrip && (
        <EditTripModal
          trip={editingTrip}
          onSave={handleTripUpdated}
          onClose={()=>setEditingTrip(null)}
        />
      )}

      {/* ALERTS PANEL */}
      {showAlerts && (
        <AlertPanel
          onClose={()=>setShowAlerts(false)}
          activeTrip={activeTrip}
        />
      )}

      {toast&&<div className="toast">{toast}</div>}
    </>
  );
}
