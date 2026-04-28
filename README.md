# Insighta Labs — Web Portal

A browser-based interface for the Insighta Labs platform. Allows analysts and admins to log in via GitHub OAuth, browse demographic profiles, search using natural language, and manage their account.

---

## System Architecture

The platform is split into three repositories:

- **Backend** — Express.js API server with PostgreSQL via Prisma, deployed on Vercel
- **CLI** — Globally installable terminal tool
- **Web Portal** (this repo) — React + Vite SPA that communicates with the backend API

All interfaces share the same backend as a single source of truth.

---

## Tech Stack

- **Framework:** React + Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Deployment:** Vercel

---

## Authentication Flow

1. User clicks **Continue with GitHub** on the login page
2. Browser redirects to the backend `GET /auth/github`
3. Backend redirects to GitHub OAuth
4. User authorizes the app on GitHub
5. GitHub redirects to the backend callback `GET /auth/github/callback`
6. Backend exchanges the code, upserts the user, and sets HTTP-only cookies
7. Browser is redirected to `/dashboard`

---

## Token Handling

- **Access token** and **refresh token** are stored in **HTTP-only cookies** — not accessible via JavaScript
- On a `401` response, the Axios interceptor automatically calls `POST /auth/refresh` to get a new token pair
- If the refresh fails, the user is redirected to the login page
- Tokens are never exposed to the frontend JavaScript

---

## CSRF Protection

- An Axios request interceptor automatically fetches a CSRF token from `GET /auth/csrf-token` before every `POST`, `PUT`, `PATCH`, and `DELETE` request
- The token is cached in memory and attached as an `X-CSRF-Token` header
- On a `403` response the token is cleared and re-fetched once to handle expiry
- The backend validates the token against the `csrf_token` cookie before processing

---

## Role Enforcement

The backend enforces two roles:

| Role | Permissions |
|---|---|
| `admin` | Create profiles, delete profiles, list, search, export |
| `analyst` | List, search, export profiles (read-only) |

The web portal reflects these roles in two ways:
- Admin-only UI elements (e.g. the Create Profile button and Dashboard quick action) are conditionally rendered and hidden from analysts
- Restricted API actions return `403 Forbidden` from the backend as a second line of enforcement

---

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/` | GitHub OAuth login |
| Dashboard | `/dashboard` | Metrics and quick actions |
| Profiles | `/profiles` | List with filters and pagination |
| Profile Detail | `/profiles/:id` | Full profile information |
| Search | `/search` | Natural language search |
| Account | `/account` | User info and logout |

---

## Natural Language Parsing

The search page sends plain English queries to `GET /api/profiles/search?q=`. The backend parses keywords to extract filters:

- **Gender:** male, female, men, women
- **Age group:** child, teenager, adult, senior
- **Age range:** young, above N, below N, between N and M
- **Country:** from [country name]

Example: `"young females from nigeria"` → `gender=female, min_age=16, max_age=24, country_id=NG`

---

## Environment Variables

```env
VITE_BACKEND_URL=https://mesh-data-persistence.vercel.app
```

---

## Getting Started

```bash
git clone https://github.com/OluchiEzeifedikwa/insighta-web
cd insighta-web
npm install
cp .env.example .env  # set VITE_BACKEND_URL
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deployment

Deployed on Vercel. On every push to `main`, Vercel automatically rebuilds and redeploys the app.
