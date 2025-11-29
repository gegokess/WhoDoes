# WhoDoes - Implementation Plan

Eine Progressive Web App (PWA) für faire Haushaltsaufgaben-Verwaltung zwischen zwei Partnern, basierend auf Vite + React + TypeScript + Supabase.

## User Review Required

> [!IMPORTANT]
> **Technologie-Stack Bestätigung**
> - Frontend: Vite + React 18 + TypeScript
> - Backend: Supabase (PostgreSQL + Auto-generated REST API)
> - Styling: TailwindCSS + Custom CSS Variables (Dusk Palette)
> - State: TanStack Query + Zustand
> - Offline: IndexedDB (Dexie.js) + Service Worker
> - Hosting: Vercel (Frontend) + Supabase (Backend)
> - Alle Services im kostenlosen Tier nutzbar

> [!WARNING]
> **Authentication-Ansatz**
> Es gibt **kein klassisches User-Login-System**. Stattdessen wird ein **Household-Code-System** verwendet:
> - Partner A erstellt einen Haushalt → erhält 6-stelligen Code (z.B. "ABC123")
> - Partner B gibt diesen Code ein → beide greifen auf dieselbe Datenbasis zu
> - Household-ID wird in `localStorage` gespeichert
> - Kein Passwort, keine E-Mail-Verifizierung im MVP

> [!IMPORTANT]
> **Offline-First mit Cloud-Sync**
> - App muss auch ohne Internet funktionieren
> - Erledigungen werden lokal in IndexedDB gespeichert
> - Bei Verbindung: automatische Synchronisation mit Supabase
> - Konflikte werden einfach behandelt: "Last Write Wins" (für MVP ausreichend)

## Proposed Changes

Die Implementierung erfolgt in **sequenziellen Phasen**, wobei jede Phase auf der vorherigen aufbaut.

---

### Phase 1: Project Setup & Infrastructure

#### [NEW] [package.json](file:///Users/gregorkessler/Documents/WhoDoes/package.json)
- Vite React TypeScript Template initialisieren
- Dependencies installieren:
  - **Core**: `react`, `react-dom`, `react-router-dom`
  - **Supabase**: `@supabase/supabase-js`
  - **State Management**: `@tanstack/react-query`, `zustand`
  - **Offline**: `dexie`, `dexie-react-hooks`
  - **Styling**: `tailwindcss`, `autoprefixer`, `postcss`
  - **PWA**: `vite-plugin-pwa`
  - **Utils**: `nanoid`, `date-fns`, `lucide-react`
- Dev Dependencies: TypeScript, Vite Plugins, Supabase CLI

#### [NEW] [vite.config.ts](file:///Users/gregorkessler/Documents/WhoDoes/vite.config.ts)
- Vite konfigurieren mit React Plugin
- PWA Plugin mit Service Worker
- Path Aliases (`@/` → `src/`)
- Build-Optimierungen für mobile Performance

#### [NEW] [tailwind.config.js](file:///Users/gregorkessler/Documents/WhoDoes/tailwind.config.js)
- TailwindCSS konfigurieren
- Dusk Color Palette als Custom Colors
- Typography Plugin (optional)
- Custom spacing scale

#### [NEW] [tsconfig.json](file:///Users/gregorkessler/Documents/WhoDoes/tsconfig.json)
- Strict TypeScript Configuration
- Path mappings für `@/` alias
- React JSX transform

#### [NEW] [vercel.json](file:///Users/gregorkessler/Documents/WhoDoes/vercel.json)
- Vercel Deployment-Konfiguration
- SPA Routing (alle Routes → `index.html`)
- Build Command und Output Directory

#### [NEW] [.env.example](file:///Users/gregorkessler/Documents/WhoDoes/.env.example)
- Environment Variables Template
- `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`

---

### Phase 2: Database Schema & Supabase Setup

#### [NEW] [supabase/migrations/001_initial_schema.sql](file:///Users/gregorkessler/Documents/WhoDoes/supabase/migrations/001_initial_schema.sql)
- Tabellen erstellen:
  - `households` (id, code, name, created_at)
  - `partners` (id, household_id, name, avatar_url)
  - `tasks` (id, household_id, name, points, is_template, is_deleted)
  - `favorites` (id, partner_id, task_id)
  - `task_completions` (id, task_id, partner_id, points_earned, completed_at)
  - `task_points_history` (id, task_id, old_points, new_points, apply_retroactive, changed_at)
- Indexes für Performance
- Trigger für `updated_at` Timestamps

#### [NEW] [supabase/migrations/002_rls_policies.sql](file:///Users/gregorkessler/Documents/WhoDoes/supabase/migrations/002_rls_policies.sql)
- Row Level Security (RLS) aktivieren
- Helper Function: `get_household_id_from_header()`
- Policies für alle Tabellen:
  - Nur Zugriff auf eigene Household-Daten
  - Basierend auf `x-household-id` Header

---

### Phase 3: Core Frontend Infrastructure

#### [NEW] [src/lib/supabase.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/lib/supabase.ts)
- Supabase Client initialisieren
- Auto-inject `x-household-id` Header aus `localStorage`
- TypeScript Typing mit auto-generated `Database` type

#### [NEW] [src/lib/db.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/lib/db.ts)
- Dexie (IndexedDB) Setup
- Stores: `tasks`, `completions`, `partners`
- Offline-Sync Queue Tracking

#### [NEW] [src/lib/sync.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/lib/sync.ts)
- Offline-Sync Engine
- `syncOfflineData()`: Upload pending changes zu Supabase
- Online/Offline Event Listener
- Auto-Sync bei Reconnect

#### [NEW] [src/stores/householdStore.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/stores/householdStore.ts)
- Zustand Store für globalen Household State
- State: `householdId`, `householdCode`, `currentPartnerId`
- Actions: `setHousehold()`, `setCurrentPartner()`, `reset()`

#### [NEW] [src/lib/household.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/lib/household.ts)
- `createHousehold(name)`: Neuen Haushalt erstellen + Code generieren
- `joinHousehold(code)`: Zu Haushalt beitreten
- `validateHouseholdCode(code)`: Code validieren

#### [NEW] [src/types/database.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/types/database.ts)
- Auto-generated von Supabase CLI (`supabase gen types typescript`)
- TypeScript Interfaces für alle Tabellen

#### [NEW] [src/types/index.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/types/index.ts)
- Custom Types: `Task`, `Partner`, `Completion`, `TimeRange`
- Enums: `TimeRangeFilter` ('today' | 'week' | 'month')

---

### Phase 4: Design System & Base Components

#### [NEW] [src/index.css](file:///Users/gregorkessler/Documents/WhoDoes/src/index.css)
- TailwindCSS Imports
- CSS Variables (Design Tokens):
  - Dusk Color Palette
  - Typography Scale
  - Spacing System
  - Border Radius
  - Shadows
- Global Styles (Reset, Base Typography)

#### [NEW] [src/components/ui/Button.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/ui/Button.tsx)
- Variants: `primary`, `secondary`, `accent`, `icon`
- Sizes: `sm`, `md`, `lg`
- States: default, hover, active, disabled
- Full Touch-optimiert (min 44px)

#### [NEW] [src/components/ui/Card.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/ui/Card.tsx)
- Variants: `standard`, `compact`, `completion`, `info`
- Hover effects mit Shadow + Transform
- Border Radius: 20px (wie Design)

#### [NEW] [src/components/ui/Modal.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/ui/Modal.tsx)
- Bottom Sheet Style (slide up from bottom)
- Backdrop mit Click-to-Close
- Animationen: Slide + Fade

#### [NEW] [src/components/ui/Toast.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/ui/Toast.tsx)
- Toast Notifications für Feedback
- Variants: `success`, `error`, `info`
- Auto-dismiss nach 3 Sekunden

---

### Phase 5: Navigation & Layout

#### [NEW] [src/components/layout/BottomNavigation.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/layout/BottomNavigation.tsx)
- Fixed Bottom Tab Bar
- Tabs: Home, Aufgaben, Punkte, Einstellungen
- Active State mit Terracotta Color
- Safe Area Insets für iPhone

#### [NEW] [src/components/layout/Header.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/layout/Header.tsx)
- Page Title
- Optional: Back Button
- Optional: Action Button (z.B. "+")

#### [NEW] [src/components/layout/PageLayout.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/layout/PageLayout.tsx)
- Wrapper für alle Pages
- Header + Content + BottomNavigation
- Safe Area Handling

---

### Phase 6: Data Hooks (API Layer)

#### [NEW] [src/hooks/useTasks.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/hooks/useTasks.ts)
- `useTasks()`: Fetch alle Tasks (filtered by household)
- `useCreateTask()`: Neue Task erstellen
- `useUpdateTask()`: Task bearbeiten (Name, Punkte)
- `useDeleteTask()`: Task soft-delete
- TanStack Query für Caching + Auto-Refetch

#### [NEW] [src/hooks/useCompletions.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/hooks/useCompletions.ts)
- `useCompletions()`: Fetch completions (filtered by time range)
- `useCompleteTask()`: Task als erledigt markieren
- `useUndoCompletion()`: Completion rückgängig machen
- Optimistic Updates für instant UI feedback

#### [NEW] [src/hooks/usePoints.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/hooks/usePoints.ts)
- `usePoints(timeRange)`: Punkte-Berechnung pro Partner
- `useTopTasks(timeRange)`: Meistgenutzte Tasks
- Client-side Aggregation der Completions

#### [NEW] [src/hooks/useFavorites.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/hooks/useFavorites.ts)
- `useFavorites()`: Partner-spezifische Favoriten
- `useToggleFavorite()`: Favorit hinzufügen/entfernen

#### [NEW] [src/hooks/usePartners.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/hooks/usePartners.ts)
- `usePartners()`: Beide Partner des Haushalts
- `useUpdatePartner()`: Partner Name/Avatar ändern

#### [NEW] [src/hooks/useRealtime.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/hooks/useRealtime.ts)
- `useRealtimeCompletions()`: Real-time Subscription für Completions
- Invalidate TanStack Query Cache bei Updates vom Partner

---

### Phase 7: Task Components

#### [NEW] [src/components/tasks/TaskCard.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/tasks/TaskCard.tsx)
- Anzeige: Task Name, Points, "Erledigen" Button, Favoriten-Stern
- Props: `task`, `onComplete`, `onToggleFavorite`, `isFavorite`
- Completion Animation bei Click
- Hover Effects

#### [NEW] [src/components/tasks/TaskForm.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/tasks/TaskForm.tsx)
- Modal Form für Create/Edit Task
- Fields: Name (Text Input), Points (Number Input mit +/- Buttons), Optional Emoji
- Validation: Name required, Points >= 1
- Bei Edit: "Apply retroactive?" Checkbox

#### [NEW] [src/components/tasks/TaskList.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/tasks/TaskList.tsx)
- Listet Tasks (getrennt: Favoriten + Alle)
- Scroll Container
- Empty State wenn keine Tasks

#### [NEW] [src/components/tasks/TaskTemplates.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/tasks/TaskTemplates.tsx)
- Vordefinierte Task-Vorlagen:
  - 🗑️ Müll rausbringen (5 Pkt)
  - 🧹 Bad putzen (8 Pkt)
  - 🍽️ Geschirrspüler (3 Pkt)
  - 🧺 Wäsche waschen (6 Pkt)
  - etc.
- Quick-Add aus Template

---

### Phase 8: Points & History Components

#### [NEW] [src/components/points/PointsOverview.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/points/PointsOverview.tsx)
- Punkte-Vergleich zwischen beiden Partnern
- Progress Bars mit Partner-Farben (Burgundy vs. Terracotta)
- Prozentanzeige
- Props: `partnerAPoints`, `partnerBPoints`

#### [NEW] [src/components/points/PointsComparison.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/points/PointsComparison.tsx)
- Detail-View mit Top Tasks Breakdown
- "Wer hat was gemacht" Übersicht
- Animierte Zahlen-Updates

#### [NEW] [src/components/points/TimeRangeFilter.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/points/TimeRangeFilter.tsx)
- Segmented Control: "Heute" | "Woche" | "Monat"
- Active State mit Underline + Primary Color

#### [NEW] [src/components/history/HistoryList.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/history/HistoryList.tsx)
- Chronologische Liste aller Completions
- Gruppiert nach Tag ("Heute", "Gestern", etc.)

#### [NEW] [src/components/history/HistoryItem.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/history/HistoryItem.tsx)
- Einzelner Completion Entry
- Anzeige: Task Name, Partner, Punkte, Zeitstempel
- Border-left in Partner-Farbe

---

### Phase 9: Partner & Setup Components

#### [NEW] [src/components/partners/PartnerSelector.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/partners/PartnerSelector.tsx)
- "Wer bist du?" Auswahl
- Zwei große Buttons mit Avatar/Emoji
- Speichert Auswahl in `householdStore`

#### [NEW] [src/components/partners/PartnerProfile.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/components/partners/PartnerProfile.tsx)
- Partner Name + Avatar Bearbeitung
- Used in Settings Screen

---

### Phase 10: Main Pages

#### [NEW] [src/pages/Setup.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/pages/Setup.tsx)
- **Initial Setup Flow** (nur beim ersten Start)
- Schritt 1: "Neuen Haushalt erstellen" oder "Bestehendem beitreten"
- Schritt 2: Partner-Namen eingeben
- Schritt 3: Partner-Auswahl ("Wer bist du?")
- Nach Completion: Redirect zu Home

#### [NEW] [src/pages/Home.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/pages/Home.tsx)
- **Home Screen**: Hauptseite
- Komponenten:
  - Greeting: "Hallo [Partner]! 👋"
  - `PointsOverview` (Diese Woche, kompakt)
  - `QuickActionGrid` (Favoriten als große Buttons)
- CTA: "Aufgabe erledigen" führt zu Tasks

#### [NEW] [src/pages/Tasks.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/pages/Tasks.tsx)
- **Tasks Screen**: Vollständige Task-Verwaltung
- Header mit FAB (+) Button
- `TaskList` mit Favoriten + Alle Tasks
- Modal: `TaskForm` zum Erstellen/Bearbeiten

#### [NEW] [src/pages/Points.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/pages/Points.tsx)
- **Points Screen**: Detaillierte Punkte-Ansicht
- `TimeRangeFilter` (Heute/Woche/Monat)
- `PointsComparison` (Progress Bars + Prozent)
- `TopTasksList` (Breakdown nach Tasks)

#### [NEW] [src/pages/History.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/pages/History.tsx)
- **History Screen**: Alle Erledigungen
- `TimeRangeFilter`
- `HistoryList` (gruppiert nach Tag)
- Undo-Funktion pro Entry

#### [NEW] [src/pages/Settings.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/pages/Settings.tsx)
- **Settings Screen**:
  - Partner-Profile (`PartnerProfile` für beide Partner)
  - Household Code anzeigen + Teilen-Button
  - Dark Mode Toggle (optional für später)
  - **Gefahrenzone**: "App zurücksetzen" Button

---

### Phase 11: Routing & App Entry

#### [NEW] [src/App.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/App.tsx)
- React Router Setup
- Routes:
  - `/setup` - Initial Setup
  - `/` - Home
  - `/tasks` - Tasks
  - `/points` - Points
  - `/history` - History
  - `/settings` - Settings
- Protected Routes (redirect to `/setup` wenn kein Household)
- TanStack Query Provider
- Toast Provider

#### [NEW] [src/main.tsx](file:///Users/gregorkessler/Documents/WhoDoes/src/main.tsx)
- React Entry Point
- Register Service Worker (PWA)
- Mount `<App />`

---

### Phase 12: PWA Configuration

#### [NEW] [public/manifest.json](file:///Users/gregorkessler/Documents/WhoDoes/public/manifest.json)
- PWA Manifest
- Name: "WhoDoes"
- Display: "standalone"
- Theme Color: Dusk Terracotta (#A45F48)
- Icons: 192x192, 512x512

#### [NEW] [public/icons/icon-192.png](file:///Users/gregorkessler/Documents/WhoDoes/public/icons/icon-192.png)
- PWA Icon 192x192
- Design: Einfaches "WD" Logo in Dusk-Farben

#### [NEW] [public/icons/icon-512.png](file:///Users/gregorkessler/Documents/WhoDoes/public/icons/icon-512.png)
- PWA Icon 512x512

#### [MODIFY] [vite.config.ts](file:///Users/gregorkessler/Documents/WhoDoes/vite.config.ts)
- PWA Plugin konfigurieren:
  - Service Worker: `workbox`
  - Strategies: NetworkFirst für API, CacheFirst für Assets
  - Offline Fallback Page

---

### Phase 13: Polish & Micro-interactions

#### [NEW] [src/utils/animations.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/utils/animations.ts)
- CSS-in-JS Animations:
  - `completionAnimation()`: Checkmark + Points Badge
  - `favoriteToggleAnimation()`: Star Rotate + Scale
  - `pointsUpdateAnimation()`: Counter Animation

#### [MODIFY] Task Components
- Add Completion Animation zu `TaskCard`
- Add Favorite Toggle Animation zu `TaskCard`

---

### Phase 14: Testing Utilities

#### [NEW] [src/lib/testData.ts](file:///Users/gregorkessler/Documents/WhoDoes/src/lib/testData.ts)
- Mock Data für Development:
  - Beispiel-Household
  - Beispiel-Partner
  - Beispiel-Tasks
  - Beispiel-Completions
- Seed Function für lokales Testen

---

## Verification Plan

### Automated Tests

```bash
# E2E Flow Tests (mit Playwright - optional für später)
npm run test:e2e

# Test Cases:
# - Household Setup Flow
# - Task Creation
# - Task Completion
# - Points Calculation
# - Offline Sync
```

### Manual Verification

#### 1. Setup & Onboarding
- [ ] Neuen Haushalt erstellen → Code wird generiert
- [ ] Mit Code auf zweitem Gerät beitreten
- [ ] Partner-Namen eingeben
- [ ] Partner-Auswahl funktioniert

#### 2. Task Management
- [ ] Task aus Template erstellen
- [ ] Custom Task erstellen
- [ ] Task bearbeiten (Name + Punkte)
- [ ] Task löschen (soft delete)
- [ ] Task als Favorit markieren

#### 3. Task Completion & Points
- [ ] Task erledigen → Punkte werden gutgeschrieben
- [ ] Completion Animation abspielt
- [ ] Undo Completion funktioniert
- [ ] Punkte-Vergleich aktualisiert sich
- [ ] Retroaktive Punkte-Änderung funktioniert

#### 4. Offline Functionality
- [ ] Airplane Mode aktivieren
- [ ] Task erledigen (lokal gespeichert)
- [ ] WiFi wieder aktivieren → Auto-Sync
- [ ] Änderungen auf anderem Gerät sichtbar

#### 5. Real-time Sync
- [ ] Partner erledigt Task auf Gerät A
- [ ] Gerät B zeigt Update in Echtzeit (innerhalb 2-3 Sekunden)

#### 6. PWA
- [ ] App auf iPhone Home Screen installieren
- [ ] App im Standalone Mode (ohne Browser-UI) läuft
- [ ] Splash Screen wird angezeigt
- [ ] Icons korrekt dargestellt

#### 7. UI/UX
- [ ] Dusk Color Palette korrekt angewendet
- [ ] Touch Targets >= 44px (Apple HIG)
- [ ] Smooth Animations (60fps)
- [ ] Responsive auf iPhone SE bis iPhone 14 Pro Max

#### 8. Reset Functionality
- [ ] Reset-Dialog mit Sicherheitsabfrage
- [ ] Nach Reset: Alle Daten gelöscht, zurück zu Setup

### Browser Testing

- **Primary**: iPhone Safari (iOS 16+)
- **Secondary**: Chrome Mobile, Firefox Mobile
- **Desktop**: Chrome, Safari (für Development)

### Performance Metrics

- [ ] Time to Interactive (TTI) < 2 Sekunden
- [ ] First Contentful Paint (FCP) < 1 Sekunde
- [ ] Lighthouse PWA Score >= 90
- [ ] Lighthouse Performance Score >= 80

---

## Deployment Steps

### 1. Supabase Deployment

```bash
# Create Supabase Project
# Via Dashboard: supabase.com

# Link local project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npx supabase db push

# Copy API Keys
# Project Settings → API → Copy URL + anon key
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Connect GitHub Repository
# Via Dashboard: vercel.com → Import Project

# Set Environment Variables in Vercel Dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY

# Deploy
git push origin main  # Auto-deploys via Vercel GitHub Integration
```

### 3. Post-Deployment Checks

- [ ] Production URL funktioniert
- [ ] Environment Variables korrekt gesetzt
- [ ] Supabase Connection funktioniert
- [ ] PWA Installation auf iPhone testen
- [ ] Offline Sync testen

---

## Timeline Estimate

| Phase | Estimated Time |
|-------|---------------|
| **1-2: Setup + Database** | 2-3 Stunden |
| **3-4: Core Infrastructure + Design System** | 3-4 Stunden |
| **5-6: Navigation + Data Hooks** | 2-3 Stunden |
| **7-8: Task + Points Components** | 4-5 Stunden |
| **9-10: Main Pages** | 4-5 Stunden |
| **11-12: Routing + PWA** | 2-3 Stunden |
| **13: Polish** | 2-3 Stunden |
| **14: Testing** | 2-3 Stunden |
| **15: Deployment** | 1-2 Stunden |
| **Total** | **22-31 Stunden** |

→ **Realistische Schätzung für MVP: 3-4 Arbeitstage** (bei fokussierter Arbeit)

---

## Next Steps

1. ✅ Implementierungsplan genehmigen lassen
2. Phase 1 starten: Project Setup
3. Iterativ durch alle Phasen arbeiten
4. Regelmäßig auf iPhone testen
5. Nach MVP: Feedback einholen und iterieren
