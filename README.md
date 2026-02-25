# Wanderlux — AI Travel Companion

An AI-powered travel guide app built with React + Netlify Functions + Claude API.

## Project Structure

```
wanderlux/
├── netlify/
│   └── functions/
│       └── claude.js        # Serverless function (API proxy)
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.js               # Full React application
├── .env.example
├── .gitignore
├── netlify.toml             # Netlify build + redirect config
└── package.json
```

## Deploy to Netlify

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/wanderlux.git
git push -u origin main
```

### 2. Connect to Netlify
- Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
- Select your repository
- Build settings are auto-detected from `netlify.toml`

### 3. Set Environment Variable
- In Netlify: **Site Settings → Environment Variables**
- Add: `ANTHROPIC_API_KEY` = your Anthropic API key
- Redeploy the site

### Local Development
```bash
npm install
npm install -g netlify-cli
cp .env.example .env          # Add your API key
netlify dev                   # Runs React + Functions together
```

## How It Works

- The React frontend calls `/api/claude` for all AI requests
- `netlify.toml` redirects `/api/*` → `/.netlify/functions/:splat`
- `netlify/functions/claude.js` proxies requests to Anthropic with your server-side API key
- Trip data is stored in `localStorage` (persists across sessions per browser)
