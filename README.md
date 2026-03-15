# Locali11y 🌍♿

<p align="center">
  <img src="https://img.shields.io/badge/Lingo.dev-Multilingual Hackathon 3rd-6B46C1?style=for-the-badge" alt="Lingo.dev Multilingual Hackathon">
  <img src="https://img.shields.io/badge/Next.js 16-000000?style=for-the-badge&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Groq AI-F3692B?style=for-the-badge" alt="Groq AI">
</p>

<p align="center">
  <strong>Find the accessibility your translations broke.</strong><br>
  Audit website accessibility across every language version. Discover untranslated ARIA labels, missing alt text, and broken locale attributes — before your users do.
</p>

---

## ✨ Features

### 🔍 Comprehensive Accessibility Auditing
- **20 targeted accessibility checks** specifically designed for the i18n × a11y intersection
- Compares every locale against your source language
- Identifies issues that **only exist in translated versions**

### 🌍 Multilingual Support
- Auto-detects language versions from hreflang tags, URLs, and content
- Supports any locale (tested: en, es, ja, zh)
- Smart locale URL pattern detection (e.g., `/us/en/` → `/jp/ja/`)

### 🤖 AI-Powered Fix Suggestions
- Uses **Groq AI** to generate translation fix suggestions
- Exports fixes as JSON ready to paste into your locale files

### 📊 Visual Dashboards
- Comparative score cards across all locales
- Issue severity ratings (Critical, Important, Info)
- Filter by locale-specific issues vs baseline issues

### 🔐 Full Auth System
- Supabase-powered authentication
- User dashboard with audit history
- Protected routes with middleware

---

## 🚀 Demo

Try it now: **[locali11y.io](https://locali11y.io)**

Or run locally:
```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **AI** | Groq API (LLM for fix suggestions) |
| **i18n** | Custom i18n with JSON message files |
| **Styling** | Tailwind CSS + Framer Motion |
| **HTTP** | Cheerio (HTML parsing) |

---

## 📋 Accessibility Checks (20 Total)

| Category | Checks |
|----------|--------|
| **Language** | html lang attribute, hreflang tags, dir attribute (RTL) |
| **ARIA** | aria-label present, aria-label translated, aria-describedby valid |
| **Images** | img alt present, img alt translated |
| **Meta/SEO** | page title translated, meta description translated, Open Graph tags |
| **Forms** | form labels present, placeholder translated, submit button translated |
| **Navigation** | skip navigation link, heading hierarchy |
| **Interactive** | button text present, link text present, empty interactive elements |
| **Links** | title attributes |

---

## 📁 Project Structure

```
locali11y/
├── messages/                 # Translation JSON files (en, es, ja, zh)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── [locale]/        # Localized pages (en, es, ja, zh)
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── dashboard/   # User dashboard
│   │   │   └── page.tsx     # Landing page
│   │   └── api/            # API routes
│   │       ├── audits/      # Audit CRUD
│   │       ├── auth/        # Authentication
│   │       └── detect-locales/  # Locale detection
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   ├── auth/           # Auth forms
│   │   ├── audit/          # Audit components
│   │   └── dashboard/      # Dashboard components
│   ├── engine/             # Audit engine
│   │   ├── checks/         # 20 accessibility checks
│   │   ├── audit-runner.ts
│   │   ├── comparator.ts
│   │   ├── scorer.ts
│   │   └── ignore-rules.ts
│   ├── lib/               # Utilities
│   │   ├── audit/         # Audit utilities
│   │   ├── db/            # Supabase clients
│   │   ├── i18n/          # Internationalization
│   │   └── validations/   # Zod schemas
│   └── types/             # TypeScript types
├── supabase/migrations/   # Database migrations
├── i18n.json             # Lingo.dev config
└── package.json
```

---

## 🏗️ Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
LINGO_API_KEY=your_lingo_api_key
```

### 3. Run Database Migrations
```bash
psql $SUPABASE_DB_URL -f supabase/migrations/001_initial.sql
```

### 4. Start Development Server
```bash
pnpm dev
```

---

## 🧪 Testing

```bash
# Run build
pnpm build

# Start production
pnpm start
```

---

## 🎯 Hackathon Highlights

- ✅ **Real Problem**: Multilingual websites often have accessibility issues that only appear in translated versions
- ✅ **Novel Solution**: First tool specifically designed for i18n × a11y intersection
- ✅ **Production-Ready**: Full auth, database, API, and polished UI
- ✅ **AI-Powered**: Groq generates fix suggestions
- ✅ **Lingo.dev Integration**: Built for the hackathon theme

---

## 📄 License

MIT

---

<p align="center">
  Built for the <strong>Lingo.dev Multilingual Hackathon #3</strong>
</p>
