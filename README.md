# 🌿 MindPulse

**Free AI-Powered Mental Wellness Companion**
*Heal Yourself. Heal the World.*

---

## What is MindPulse?

MindPulse is a completely free, AI-powered mental wellness app that learns who you are — your pain, your patterns, your personality — and delivers personalized, evidence-based support 24/7.

As you heal, the world heals with you: every check-in, journal entry, and milestone triggers real-world impact — trees planted, oceans cleaned, water conserved.

**No subscriptions. No paywalls. No ads. No data selling.**

## Features

- **🗣️ AI Therapy Chat** — CBT/DBT-informed conversations adapted to your personality, trauma type, and astrological profile
- **🌙 Astro-Insight Engine** — Full zodiac profile integration for personalized communication style
- **📊 Mood Dashboard** — Track emotions over time, spot patterns, get predictive alerts
- **📓 Encrypted Journal** — Private entries stored locally, only you can read them
- **🌬 Breathing Exercises** — 4-7-8 technique with animated breathing circle
- **🎶 Ambient Soundscape** — Procedural lo-fi tones via Web Audio API
- **🌳 Pulse Points** — Earn points through daily engagement, drive real-world environmental impact
- **🚨 Crisis Safety Net** — 988 Lifeline and Crisis Text Line always visible

## Tech Stack — $0 Architecture

| Layer | Technology | Cost |
|-------|-----------|------|
| AI Engine | [Pollinations.ai](https://pollinations.ai) | Free |
| Storage | localStorage (client-side) | Free |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | Free |
| Frontend | React + Vite (single file) | Free |
| Music | Web Audio API (procedural) | Free |
| Impact APIs | Digital Humani, GoodAPI, 1ClickImpact | Pay-per-impact |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/mindpulse.git
cd mindpulse

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or browser.

## Deploy to Cloudflare Pages

### Option 1: GitHub Integration (Recommended)
1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Click **Create a project** → **Connect to Git**
4. Select your repo
5. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click **Save and Deploy**

Your app will be live at `https://mindpulse.pages.dev` (or custom domain).

### Option 2: Direct Upload
```bash
npm run build
npx wrangler pages deploy dist --project-name=mindpulse
```

## Privacy & Security

- **No ads. No data selling. No tracking pixels. No third-party analytics.**
- All data stored in localStorage (never leaves the user's device)
- No server-side storage of personal information
- Open source for full transparency
- Anonymous — no account required

## Impact Partners

MindPulse connects to real environmental organizations:

- 🌳 **[Digital Humani](https://digitalhumani.com)** — Nonprofit tree planting API ($1/tree)
- 🌊 **[GoodAPI](https://thegoodapi.com)** — Ocean plastic removal ($0.05/bottle)
- 🌊 **[1ClickImpact](https://1clickimpact.com)** — GPS-verified ocean cleanup
- 🌳 **[Plant-for-the-Planet](https://plant-for-the-planet.org)** — 80M+ trees funded

## Project Structure

```
mindpulse/
├── index.html          # Entry HTML with PWA meta tags
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── public/
│   └── manifest.json   # PWA manifest
└── src/
    ├── main.jsx        # React entry point
    └── MindPulse.jsx   # Full application (single file)
```

## License

MIT — Free to use, modify, and distribute.

## Contributing

This is an open-source project. PRs welcome. If you're a therapist, designer, or developer who cares about mental health accessibility, we'd love your input.

---

**Built by Anirudh Ravikumar (Roodboy) • 2026**

*Every check-in plants a seed. Every journal entry cleans a shore. Every breath you take gives the planet one too.*
