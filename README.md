<div align="center">

  <img src="assets/logo-40.png" alt="Bharani Kumar S — Portfolio logo" width="96" height="96" />

  # BHARANI KUMAR S — Portfolio

  <p><i>A dark, lime-accented one-page personal portfolio for an AI full-stack developer — smooth-scrolling, SEO-ready, and wired to email.</i></p>

  <p>
    <a href="https://github.com/vincenzo-afk/PORTFOLIO/actions"><img src="https://img.shields.io/github/actions/workflow/status/vincenzo-afk/PORTFOLIO/deploy.yml?logo=github&label=Build" alt="Build status" /></a>
    <a href="https://github.com/vincenzo-afk/PORTFOLIO/releases"><img src="https://img.shields.io/github/v/release/vincenzo-afk/PORTFOLIO?logo=github&label=Version" alt="Version" /></a>
    <a href="https://github.com/vincenzo-afk/PORTFOLIO/blob/main/LICENSE"><img src="https://img.shields.io/github/license/vincenzo-afk/PORTFOLIO?label=License" alt="License" /></a>
    <a href="https://www.jsdelivr.com/package/gh/vincenzo-afk/PORTFOLIO"><img src="https://img.shields.io/badge/Dependencies-Vanilla%20JS-brightgreen?logo=javascript" alt="Zero dependencies" /></a>
    <a href="https://github.com/vincenzo-afk/PORTFOLIO"><img src="https://img.shields.io/github/stars/vincenzo-afk/PORTFOLIO?style=social" alt="Stars" /></a>
    <a href="https://vercel.com/new"><img src="https://img.shields.io/badge/Platform-Vercel-black?logo=vercel" alt="Deployed on Vercel" /></a>
  </p>

  <p>
    <a href="https://vincenzo-afk.github.io/PORTFOLIO/"><b>🌐 Live Demo</b></a> •
    <a href="#6-api-reference">📘 API Docs</a> •
    <a href="https://github.com/vincenzo-afk/PORTFOLIO/issues/new?labels=bug"><b>🐞 Report Bug</b></a> •
    <a href="https://github.com/vincenzo-afk/PORTFOLIO/issues/new?labels=enhancement"><b>✨ Request Feature</b></a>
  </p>

</div>

---

## Table of Contents

1. [About the Project](#1-about-the-project)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Configuration](#4-configuration)
5. [Usage](#5-usage)
6. [API Reference](#6-api-reference)
7. [Project Structure](#7-project-structure)
8. [Features & Roadmap](#8-features--roadmap)
9. [Testing](#9-testing)
10. [Deployment](#10-deployment)
11. [Contributing](#11-contributing)
12. [Security](#12-security)
13. [License](#13-license)
14. [Acknowledgments](#14-acknowledgments)
15. [Contact & Support](#15-contact--support)

---

## 1. About the Project

BHARANI is a personal portfolio website for [Bharani Kumar S](https://github.com/vincenzo-afk), an AI full-stack developer and second-year B.E. CSE student at Kingston Engineering College, Vellore. The site presents his work — 55+ public repositories, 70+ AI projects, and six service areas spanning LLM integration, frontend engineering, backend APIs, computer vision, mobile development, and DevOps — in a single, fast-loading page with a distinctive dark-and-lime visual identity.

The project deliberately avoids frameworks and build tooling. It is one hand-tuned `index.html` file that deploys as static content, with a single Vercel serverless function handling contact-form email delivery. This keeps the site lightweight, easy to audit, and trivial to host anywhere.

### Key Features

- 🎨 Distinctive dark theme with lime accent color and Space Grotesk typography
- 🚀 Zero-dependency frontend: vanilla HTML, CSS, and JavaScript — no build step
- 📧 Contact form powered by Resend with server-side validation and reply-to forwarding
- 🔍 Full SEO suite: meta tags, Open Graph and Twitter cards, `Person` JSON-LD, sitemap
- 🖼️ Optimized assets: pre-cropped portrait images, favicon, and social sharing card
- 📱 Fully responsive layout with a mobile navigation drawer
- ✨ Smooth scroll navigation and staggered reveal animations
- ⚡ Performance-optimized: batched scroll handling with `requestAnimationFrame`, lazy loading, and high fetch priority for above-the-fold assets

### Site Architecture

The site is a single static page divided into five sections — Home, About, Services, Projects, and Contact. The navigation header stays fixed and gains a translucent background on scroll. Project cards link out to their GitHub repositories and live demos. The contact form submits to the `/api/send` serverless endpoint, which forwards the message by email through Resend.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | HTML5, CSS3, ES2022 JavaScript | Single `index.html`, no framework, no build tool |
| Typography | Space Grotesk + Inter (Google Fonts) | `display=swap` for non-blocking font loading |
| Serverless Backend | Vercel Functions (Edge) | `api/send.js` processes contact form submissions |
| Email Service | Resend API | Transactional delivery with reply-to support |
| Hosting | Vercel (primary) / GitHub Pages (static only) | Auto-deploy on push to `main` |
| Images | PNG (quantized palette) | Pre-cropped to exact rendered dimensions |

The project has **zero npm dependencies**. There is no `package.json` in the site root because nothing needs to be installed to build or serve it.

---

## 3. Getting Started

### Prerequisites

| Requirement | Minimum Version | Why |
|---|---|---|
| Git | 2.30+ | Clone the repository |
| Any static web server | — | `python3 -m http.server` or VS Code Live Server is enough |
| Node.js (local dev only) | 18+ | Optional; only needed to run the mock test server |
| Vercel account | — | Required for the contact-form email endpoint |
| Resend account | — | Free tier provides 3,000 emails/month |
| A Resend API key | — | Created in the Resend dashboard |

### Installation

**Clone the repository:**

```bash
git clone https://github.com/vincenzo-afk/PORTFOLIO.git
cd PORTFOLIO
```

**Run it locally (static preview):**

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The contact form will show "Email service is not configured yet" locally, which is expected — the email endpoint only works when deployed to Vercel with the API key set.

**Run the mock test server (exercises the form UI end-to-end):**

```bash
node test_server.mjs   # serves static files + mocks POST /api/send
# open http://localhost:8000 and submit the contact form
```

**Production deployment:** push to `main` — Vercel builds and deploys automatically (see [Deployment](#10-deployment)). No build command is required because `vercel.json` declares the site as static output.

---

## 4. Configuration

The site reads three environment variables, all configured in the Vercel dashboard under **Settings → Environment Variables**:

```env
# Required — without it the contact form politely refuses to send.
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional — who the email appears to come from.
# Resend's onboarding sender is used if unset.
RESEND_FROM=Portfolio Contact <contact@yourdomain.com>

# Optional — where contact messages are delivered (defaults to the owner's email).
RESEND_TO=you@example.com
```

Configuration behavior notes:

- `api/send.js` validates `name`, `email`, and `message` on the server and rejects oversized or malformed input with a `400` response.
- The sender address in `RESEND_FROM` must be a **verified domain** in Resend, otherwise the API rejects the send and the form reports an error.
- `vercel.json` routes `/api/*` to serverless functions, caches `assets/` for one year, and falls all other requests back to `index.html`.

---

## 5. Usage

**Visitors** browse the site and click through project cards to GitHub repositories and live demos. Recruiters and clients can reach the owner through the contact form or the linked email and social profiles.

**Submitting the contact form (browser):** fill in name, email, and message, then press **Send Message**. A "Sending…" state disables the button while the request is in flight, and a green success banner confirms delivery.

**Submitting the contact form (curl):**

```bash
curl -X POST https://your-deployment.vercel.app/api/send \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Jane Recruiter",
    "email": "jane@example.com",
    "message": "I would love to discuss an opening with you."
  }'
```

A successful submission returns:

```json
{ "received": true }
```

---

## 6. API Reference

### `POST /api/send`

Serverless endpoint that emails the site owner a contact form submission via Resend.

**Request headers**

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |

**Request body**

| Field | Type | Limits | Description |
|---|---|---|---|
| `name` | string | ≤ 120 chars | Visitor's full name |
| `email` | string | ≤ 320 chars, valid format | Visitor's reply-to address |
| `message` | string | ≤ 10,000 chars | The message body |

**Responses**

| Status | Body | Meaning |
|---|---|---|
| `200` | `{"received": true}` | Email sent successfully |
| `400` | `{"error": "…"}` | Missing/invalid/oversized fields |
| `405` | `{"error": "Method not allowed"}` | Non-POST request |
| `502` | `{"error": "Email service error (…)"}` | Resend rejected the send |
| `503` | `{"error": "Email service is not configured yet."}` | No `RESEND_API_KEY` set |

**Rate limiting:** Resend's default API limits apply (3 requests/second on the free tier); the endpoint does not add additional throttling.

---

## 7. Project Structure

```
PORTFOLIO/
├── index.html              # The entire site: markup, styles, and scripts in one file
├── api/
│   └── send.js             # Vercel serverless function → Resend email
├── assets/
│   ├── logo-40.png         # Navigation logo badge (from GitHub avatar)
│   ├── favicon-32.png      # Browser tab icon
│   ├── og-portfolio.png    # 1200×630 social sharing card
│   ├── portrait-hero.png   # Optimized hero portrait (280×380)
│   ├── portrait-intro.png  # Optimized intro portrait (450×600)
│   ├── bk-avatar.png       # Source avatar used by asset scripts
│   ├── avatar-raw.png      # Untouched downloaded avatar
│   └── github-mark.svg     # Octocat mark used by the Source button
├── scripts/
│   ├── prepare_logo.py     # Regenerates logo, favicon, and OG card
│   ├── prepare_portraits.py# Crops and resizes hero/intro portraits
│   └── compress_portraits.py # Palette-quantizes portraits for smaller size
├── sitemap.xml             # Search-engine index of site URLs
├── vercel.json             # Static build + route configuration
├── LICENSE                 # MIT License
├── test_server.mjs         # Local mock server for form testing
└── README.md               # This file
```

| File | Responsibility |
|---|---|
| `index.html` | Structure, styling (CSS variables + responsive breakpoints), and behavior (scroll loop, reveal observer, accordion, form submission) |
| `api/send.js` | Input validation, Resend API call, error mapping |
| `vercel.json` | Deployment routing, caching headers, static build declaration |
| `scripts/*` | Deterministic asset regeneration so brand images can be reproduced from the avatar source |

---

## 8. Features & Roadmap

### Current Features

- [x] Responsive one-page layout (hero, about, services, projects, contact)
- [x] Fixed navbar with scroll state and mobile drawer
- [x] Six expandable service accordions
- [x] Project gallery with external GitHub/live links
- [x] Resend-powered contact form with validation and status feedback
- [x] SEO metadata, Open Graph, Twitter cards, JSON-LD, sitemap
- [x] Optimized local portrait assets and sharing card
- [x] Batched passive scroll handling for smooth animations
- [x] GitHub Source button linking to this repository

### Upcoming

- [ ] GitHub Actions CI: link-check, HTML validation, and Lighthouse score gate
- [ ] Project filtering by technology tag
- [ ] Dark/light theme toggle
- [ ] Blog or writing section
- [ ] RSS feed of project updates

### Known Limitations

- The contact endpoint requires a Vercel deployment; GitHub Pages hosting alone cannot run `api/send.js`.
- Country and visitor analytics are intentionally not collected to preserve privacy.
- Asset scripts require Python 3 with Pillow installed.

---

## 9. Testing

There is no automated test suite in the repository yet; quality is maintained through a local mock server that exercises the full form flow without touching the real Resend API:

```bash
node test_server.mjs          # starts server on port 8000
# in a browser: fill the contact form and submit
# confirm: success banner appears, mock logs the JSON payload
```

The mock verifies the client builds `{name, email, message}`, handles the `200` response, resets the form, and restores the submit button. Manual checks cover navigation links, the mobile drawer, accordion expansion, and responsive breakpoints before every release.

**CI/CD pipeline:** pushes to `main` trigger Vercel's automatic build and deploy. An optional `deploy.yml` workflow can be added to run static checks on pull requests; the workflow badge in the header will then report live status.

---

## 10. Deployment

### Vercel (recommended — required for the contact form)

1. Import this repository at [vercel.com/new](https://vercel.com/new).
2. Leave build settings at their defaults — `vercel.json` declares everything.
3. Add `RESEND_API_KEY` (and optionally `RESEND_FROM`, `RESEND_TO`) in **Settings → Environment Variables**.
4. Every push to `main` redeploys automatically.

### GitHub Pages (static only)

Enable Pages on the `main` branch in repository Settings. The site renders identically, but contact-form submissions will show the "not configured" message because serverless functions are unavailable on Pages.

### Other platforms

The site is plain static content, so Netlify, Cloudflare Pages, or any static host works for the frontend — pair it with a small serverless function elsewhere if you need email delivery.

---

## 11. Contributing

Contributions are welcome. Please follow this workflow:

1. Fork the repository and create a feature branch: `feature/short-description`.
2. Make your changes. Keep the single-file architecture in mind — styles and scripts live inside `index.html`.
3. Test the contact form flow with `node test_server.mjs`.
4. Open a pull request describing what changed and why.

**Commit conventions:** use conventional commits such as `feat:`, `fix:`, `docs:`, and `perf:`.

**Code of conduct:** be respectful and constructive in issues and pull requests.

---

## 12. Security

**Reporting vulnerabilities:** email [itsmebk2007@gmail.com](mailto:itsmebk2007@gmail.com) with a description of the issue; do not open a public issue for security matters.

Implemented security practices:

- Contact input is validated **server-side** (length limits, email format) before any external call.
- The Resend API key never ships to the browser — it lives only in Vercel's encrypted environment variables.
- The site contains no cookies, trackers, fingerprinting scripts, or third-party analytics.
- Static assets are served with long-lived immutable caching; `index.html` is never cached.

---

## 13. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for the full text.

> MIT License — Copyright (c) 2026 BHARANI KUMAR S

---

## 14. Acknowledgments

- [Resend](https://resend.com) for reliable transactional email delivery.
- [Vercel](https://vercel.com) for zero-config hosting and serverless functions.
- [Google Fonts](https://fonts.google.com) for Space Grotesk and Inter.
- Project links point to the owner's own repositories — NOVA, IRIS, NEXUS ENGINE, SocialGuard-RL, and others.
- GitHub for avatar assets used in the site branding.

---

## 15. Contact & Support

Reach Bharani Kumar S through any of these channels:

| Channel | Link |
|---|---|
| Email | [itsmebk2007@gmail.com](mailto:itsmebk2007@gmail.com) |
| GitHub | [github.com/vincenzo-afk](https://github.com/vincenzo-afk) |
| LinkedIn | [linkedin.com/in/vincenzo-afk](https://linkedin.com/in/vincenzo-afk) |
| X / Twitter | [x.com/vincenzo-afk](https://x.com/vincenzo-afk) |
| Instagram | [instagram.com/vincenzo-afk](https://instagram.com/vincenzo-afk) |

<div align="center">

  <a href="#bharani-kumar-s--portfolio">⬆ Back to top</a>

  **Built with ❤️ by Bharani Kumar S**

</div>
