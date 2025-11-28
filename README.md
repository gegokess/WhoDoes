# WhoDoes

Eine Progressive Web App (PWA) für faire Haushaltsaufgaben-Verwaltung zwischen zwei Partnern.

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm oder yarn

### Setup

1. **Dependencies installieren:**
   ```bash
   cd whodoes
   npm install
   ```

2. **Environment Variables einrichten:**
   ```bash
   cp .env.example .env
   # Dann VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY eintragen
   ```

3. **Dev Server starten:**
   ```bash
   npm run dev
   ```

4. **Build für Production:**
   ```bash
   npm run build
   ```

## 📦 Tech Stack

- **Frontend:** Vite + React 18 + TypeScript
- **Styling:** TailwindCSS + Custom Design System (Dusk Palette)
- **State Management:** TanStack Query + Zustand
- **Backend:** Supabase (PostgreSQL + Auto-generated REST API)
- **Offline:** IndexedDB (Dexie.js) + Service Worker
- **Hosting:** Vercel (Frontend) + Supabase (Backend)

## 🗄️ Database Setup

### Supabase Project erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Kopiere die API Credentials

### Migrations ausführen

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

## 🎨 Design System

Das Projekt verwendet die **Dusk Color Palette** für ein warmes, minimalistisches Design:

- **Primary:** Terracotta (#A45F48)
- **Accent:** Burgundy (#6E363C)
- **Background:** Warm Beige (#E5E6E0)

Alle Design Tokens sind in `src/index.css` definiert.

## 📱 PWA Features

- ✅ Offline-First Architecture
- ✅ Installierbar auf iOS/Android
- ✅ Service Worker für Caching
- ✅ IndexedDB für lokale Datenspeicherung
- ✅ Automatische Sync bei Reconnect

## 🏗️ Project Structure

```
whodoes/
├── src/
│   ├── components/     # UI Komponenten
│   ├── hooks/          # React Query Hooks
│   ├── lib/            # Core Libraries (Supabase, DB, Sync)
│   ├── pages/          # Page Components
│   ├── stores/         # Zustand Stores
│   ├── types/          # TypeScript Types
│   └── utils/          # Helper Functions
├── supabase/
│   └── migrations/     # Database Migrations
└── public/            # Static Assets
```

## 📄 License

Private Project
