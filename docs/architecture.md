# WhoDoes - Cloud Architecture

## 🎯 Architecture Overview

WhoDoes ist eine Progressive Web App (PWA) mit Cloud-Backend, 100% kostenlos hostbar auf Vercel + Supabase.

```
┌─────────────────────────────────────────┐
│         iPhone (Partner A & B)          │
│  ┌───────────────────────────────────┐  │
│  │   Progressive Web App (PWA)       │  │
│  │   - React 18+ TypeScript          │  │
│  │   - TanStack Query (Caching)      │  │
│  │   - Supabase Client               │  │
│  │   - IndexedDB (Offline Storage)   │  │
│  │   - Service Worker (PWA)          │  │
│  └───────────────────────────────────┘  │
└─────────────────┬───────────────────────┘
                  │ HTTPS / REST API
                  │
┌─────────────────▼───────────────────────┐
│         Supabase (Cloud)                │
│  ┌───────────────────────────────────┐  │
│  │   PostgreSQL Database             │  │
│  │   Auto-generated REST API         │  │
│  │   Row Level Security (RLS)        │  │
│  │   Real-time Subscriptions         │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**🎉 Kein eigener Backend-Code nötig!**  
Supabase generiert automatisch eine REST API aus deinen Datenbank-Tabellen.

---

## 📱 Frontend Architecture

### Tech Stack

| Component | Technology | Begründung |
|-----------|-----------|------------|
| **Framework** | React 18+ | Large community, viele Ressourcen |
| **Language** | TypeScript | Type safety, bessere DX |
| **Build Tool** | Vite | Schnell, modern, PWA Support |
| **State Management** | TanStack Query | Server-state caching & sync |
| **Backend Client** | Supabase JS Client | Ready-to-use API client |
| **Offline Storage** | IndexedDB (Dexie.js) | Strukturierte Offline-Daten |
| **PWA Plugin** | Vite PWA | Service Worker Generation |
| **Styling** | TailwindCSS | Utility-first, schnelle UI |
| **UI Components** | shadcn/ui | Accessible, customizable |
| **Icons** | Lucide React | Modern, konsistent |
| **Hosting** | Vercel | Kostenloses Deployment |

### Folder Structure

```
whodoes/
├── public/
│   ├── icons/              # PWA Icons (verschiedene Größen)
│   └── manifest.json       # PWA Manifest
├── src/
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskTemplates.tsx
│   │   ├── points/
│   │   │   ├── PointsOverview.tsx
│   │   │   ├── PointsComparison.tsx
│   │   │   └── TimeRangeFilter.tsx
│   │   ├── history/
│   │   │   ├── HistoryList.tsx
│   │   │   └── HistoryItem.tsx
│   │   ├── partners/
│   │   │   ├── PartnerSelector.tsx
│   │   │   └── PartnerProfile.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── ... (shadcn components)
│   ├── hooks/
│   │   ├── useTasks.ts         # Task CRUD with Supabase
│   │   ├── useCompletions.ts   # Completion operations
│   │   ├── usePoints.ts        # Points calculations
│   │   ├── useRealtime.ts      # Real-time subscriptions
│   │   └── useOffline.ts       # Online/offline detection
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client setup
│   │   ├── db.ts               # IndexedDB setup (Dexie)
│   │   ├── sync.ts             # Offline sync engine
│   │   └── utils.ts            # Helper functions
│   ├── stores/
│   │   └── householdStore.ts   # Global state (Zustand)
│   ├── types/
│   │   ├── database.ts         # Auto-generated from Supabase
│   │   ├── task.ts
│   │   ├── partner.ts
│   │   └── completion.ts
│   ├── pages/
│   │   ├── Home.tsx            # Quick actions & overview
│   │   ├── Tasks.tsx           # Task management
│   │   ├── History.tsx         # Activity history
│   │   ├── Points.tsx          # Points comparison
│   │   ├── Settings.tsx        # Profile & reset
│   │   └── Setup.tsx           # Initial household setup
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   └── migrations/             # SQL migrations
│       └── 001_initial_schema.sql
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── package.json
```

### Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false, // Keine User-Auth, nur Household-Code
    },
  }
);
```

### PWA Configuration

**manifest.json:**
```json
{
  "name": "WhoDoes",
  "short_name": "WhoDoes",
  "description": "Fair household task tracking for couples",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

---

## 💾 Database Schema (Supabase)

### Migrations

**supabase/migrations/001_initial_schema.sql:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- households table
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  points INTEGER NOT NULL CHECK(points >= 1),
  is_template BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(partner_id, task_id)
);

-- task_completions table
CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- task_points_history table
CREATE TABLE task_points_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  old_points INTEGER NOT NULL,
  new_points INTEGER NOT NULL,
  apply_retroactive BOOLEAN NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_household ON tasks(household_id) WHERE is_deleted = false;
CREATE INDEX idx_partners_household ON partners(household_id);
CREATE INDEX idx_favorites_partner ON favorites(partner_id);
CREATE INDEX idx_completions_date ON task_completions(completed_at);
CREATE INDEX idx_completions_partner ON task_completions(partner_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tasks.updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS)

**Alle Daten sind nach `household_id` isoliert:**

```sql
-- Enable RLS on all tables
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_points_history ENABLE ROW LEVEL SECURITY;

-- Helper function to get current household_id from request header
CREATE OR REPLACE FUNCTION get_household_id_from_header()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('request.headers', true)::json->>'x-household-id';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for households
CREATE POLICY "Users can read their own household"
  ON households FOR SELECT
  USING (id = get_household_id_from_header()::UUID);

-- RLS Policies for partners
CREATE POLICY "Users can read their household partners"
  ON partners FOR SELECT
  USING (household_id = get_household_id_from_header()::UUID);

CREATE POLICY "Users can update their household partners"
  ON partners FOR UPDATE
  USING (household_id = get_household_id_from_header()::UUID);

-- RLS Policies for tasks
CREATE POLICY "Users can manage their household tasks"
  ON tasks FOR ALL
  USING (household_id = get_household_id_from_header()::UUID);

-- RLS Policies for favorites
CREATE POLICY "Users can manage their household favorites"
  ON favorites FOR ALL
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE household_id = get_household_id_from_header()::UUID
    )
  );

-- RLS Policies for completions
CREATE POLICY "Users can manage their household completions"
  ON task_completions FOR ALL
  USING (
    partner_id IN (
      SELECT id FROM partners 
      WHERE household_id = get_household_id_from_header()::UUID
    )
  );

-- RLS Policies for points history
CREATE POLICY "Users can read their household points history"
  ON task_points_history FOR SELECT
  USING (
    task_id IN (
      SELECT id FROM tasks 
      WHERE household_id = get_household_id_from_header()::UUID
    )
  );
```

---

## 🔌 Frontend Data Access

### Using Supabase Client

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';

export const useTasks = () => {
  const householdId = useHouseholdStore((s) => s.householdId);

  return useQuery({
    queryKey: ['tasks', householdId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('household_id', householdId)
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!householdId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);

  return useMutation({
    mutationFn: async (task: { name: string; points: number }) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          household_id: householdId,
          name: task.name,
          points: task.points,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', householdId]);
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);

  return useMutation({
    mutationFn: async (completion: {
      task_id: string;
      partner_id: string;
      points_earned: number;
    }) => {
      const { data, error } = await supabase
        .from('task_completions')
        .insert({
          ...completion,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['completions', householdId]);
      queryClient.invalidateQueries(['points', householdId]);
    },
  });
};
```

### Real-time Updates (Optional)

```typescript
// hooks/useRealtime.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useHouseholdStore } from '@/stores/householdStore';

export const useRealtimeCompletions = () => {
  const queryClient = useQueryClient();
  const householdId = useHouseholdStore((s) => s.householdId);

  useEffect(() => {
    if (!householdId) return;

    const channel = supabase
      .channel('task_completions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_completions',
        },
        () => {
          // Invalidate cache when partner completes a task
          queryClient.invalidateQueries(['completions', householdId]);
          queryClient.invalidateQueries(['points', householdId]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, queryClient]);
};
```

---

## 🔄 Offline-First Strategy

### IndexedDB für Offline Storage

```typescript
// lib/db.ts
import Dexie, { Table } from 'dexie';

interface OfflineTask {
  id: string;
  household_id: string;
  name: string;
  points: number;
  is_deleted: boolean;
  synced: boolean;
}

interface OfflineCompletion {
  id: string;
  task_id: string;
  partner_id: string;
  points_earned: number;
  completed_at: string;
  synced: boolean;
}

class WhoDoesDB extends Dexie {
  tasks!: Table<OfflineTask>;
  completions!: Table<OfflineCompletion>;

  constructor() {
    super('WhoDoes');
    this.version(1).stores({
      tasks: 'id, household_id, synced',
      completions: 'id, partner_id, completed_at, synced',
    });
  }
}

export const db = new WhoDoesDB();
```

### Sync Queue

```typescript
// lib/sync.ts
import { supabase } from './supabase';
import { db } from './db';

export const syncOfflineData = async (householdId: string) => {
  // Sync unsynced completions
  const unsyncedCompletions = await db.completions
    .where('synced')
    .equals(false)
    .toArray();

  for (const completion of unsyncedCompletions) {
    try {
      const { error } = await supabase
        .from('task_completions')
        .insert({
          task_id: completion.task_id,
          partner_id: completion.partner_id,
          points_earned: completion.points_earned,
          completed_at: completion.completed_at,
        });

      if (!error) {
        await db.completions.update(completion.id, { synced: true });
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }
};

// Auto-sync when online
window.addEventListener('online', () => {
  const householdId = localStorage.getItem('household_id');
  if (householdId) {
    syncOfflineData(householdId);
  }
});
```

---

## 🚀 Deployment

### Vercel Deployment

**vercel.json:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Deployment Steps:**

1. **GitHub Repository erstellen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<username>/whodoes.git
   git push -u origin main
   ```

2. **Vercel verbinden:**
   - Gehe zu [vercel.com](https://vercel.com)
   - "Import Project" → GitHub Repository auswählen
   - Auto-detected: Vite
   - Environment Variables:
     - `VITE_SUPABASE_URL`: (von Supabase Dashboard)
     - `VITE_SUPABASE_ANON_KEY`: (von Supabase Dashboard)
   - Deploy! ✨

3. **Domain:**
   - Automatisch: `whodoes.vercel.app`
   - Optional: Custom Domain hinzufügen

### Supabase Setup

1. **Projekt erstellen:**
   - Gehe zu [supabase.com](https://supabase.com)
   - "New Project"
   - Region: Frankfurt (näher = schneller)
   - Password setzen

2. **Migrations ausführen:**
   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

3. **API Keys kopieren:**
   - Project Settings → API
   - `URL` → `VITE_SUPABASE_URL`
   - `anon/public` key → `VITE_SUPABASE_ANON_KEY`

4. **RLS Policies aktivieren:**
   - Über Supabase Dashboard SQL Editor
   - Migration Script ausführen

---

## 🔐 Authentication: Household Code System

### Household Setup Flow

```typescript
// lib/household.ts
import { supabase } from './supabase';
import { nanoid } from 'nanoid';

export const createHousehold = async (name: string) => {
  // Generate 6-character code (A-Z, 0-9)
  const code = nanoid(6).toUpperCase().replace(/[^A-Z0-9]/g, '');

  const { data, error } = await supabase
    .from('households')
    .insert({ name, code })
    .select()
    .single();

  if (error) throw error;

  // Store household_id locally
  localStorage.setItem('household_id', data.id);
  localStorage.setItem('household_code', data.code);

  return data;
};

export const joinHousehold = async (code: string) => {
  const { data, error } = await supabase
    .from('households')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) {
    throw new Error('Invalid household code');
  }

  // Store household_id locally
  localStorage.setItem('household_id', data.id);
  localStorage.setItem('household_code', data.code);

  return data;
};
```

### Supabase Client mit Household-Header

```typescript
// lib/supabase.ts (erweitert)
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        // Automatisch household_id aus localStorage
        get 'x-household-id'() {
          return localStorage.getItem('household_id') || '';
        },
      },
    },
  }
);
```

---

## 📦 Dependencies

### Package.json

```json
{
  "name": "whodoes",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "vercel"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.51.0",
    "dexie": "^4.0.8",
    "dexie-react-hooks": "^1.1.7",
    "zustand": "^4.5.4",
    "nanoid": "^5.0.7",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.424.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.0",
    "vite-plugin-pwa": "^0.20.1",
    "tailwindcss": "^3.4.7",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "@supabase/cli": "^1.187.0"
  }
}
```

---

## 📊 Performance & Costs

### Vercel Free Tier
- ✅ 100GB Bandwidth/Monat
- ✅ Unlimited Deployments
- ✅ Automatic HTTPS
- ✅ Global CDN

### Supabase Free Tier
- ✅ 500MB Database Storage
- ✅ 50,000 monatlich aktive User
- ✅ 2GB File Storage
- ✅ 5GB Bandwidth

**Für 2 Personen mehr als ausreichend!** 🎉

### Geschätzte Nutzung
- **Database**: ~1-5 MB (1000+ Completions)
- **Bandwidth**: <100 MB/Monat
- **Users**: 2 (weit unter Limit)

→ **100% kostenlos, auch langfristig** ✅

---

## 🧪 Testing Strategy

### Frontend Tests
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### E2E Tests (Optional)
```bash
npm install -D @playwright/test
```

### Database Tests
- Supabase bietet Test-Datenbank in jedem Projekt
- Separate `test` Branch für Migrations

---

## 🚀 Development Workflow

### Initial Setup

```bash
# 1. Create project
npm create vite@latest whodoes -- --template react-ts
cd whodoes

# 2. Install dependencies
npm install @supabase/supabase-js @tanstack/react-query dexie zustand nanoid

# 3. Setup Supabase
npm install -D @supabase/cli
npx supabase init
npx supabase start  # Local development DB

# 4. Setup TailwindCSS (optional)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. Setup PWA
npm install -D vite-plugin-pwa
```

### Local Development

```bash
# Start Supabase locally
npx supabase start

# Start Vite dev server
npm run dev

# Access at http://localhost:5173
```

### Database Migrations

```bash
# Create new migration
npx supabase migration new <name>

# Apply migrations locally
npx supabase db push

# Apply to production
npx supabase db push --linked
```

### Deploy

```bash
# Push code to GitHub
git push

# Vercel auto-deploys on git push!
# Or manual: npx vercel --prod
```

---

## 📝 Next Steps

### Phase 1: Setup (1 Tag)
- [x] Architecture definiert
- [ ] Vite Projekt erstellen
- [ ] Supabase Projekt erstellen
- [ ] Database Schema deployen
- [ ] Vercel verbinden

### Phase 2: Core Features (1 Woche)
- [ ] Household Setup Flow
- [ ] Task CRUD
- [ ] Task Completion
- [ ] Points Übersicht
- [ ] Basic UI Components

### Phase 3: Polish (3-4 Tage)
- [ ] Offline-Sync
- [ ] PWA Setup
- [ ] Real-time (optional)
- [ ] Favorites
- [ ] Historie

### Phase 4: Deploy (1 Tag)
- [ ] Production Deploy
- [ ] iPhone Testing
- [ ] PWA Installation
- [ ] Final Tweaks

**Total: ~2 Wochen (Teilzeit)** oder **1 Woche (Vollzeit)**

---

## 🎉 Vorteile dieser Architektur

✅ **Kein Backend-Code** - Supabase generiert REST API  
✅ **Kostenlos** - Vercel + Supabase Free Tier  
✅ **Schnell** - Global CDN, schnelle Response  
✅ **Skalierbar** - Falls es wächst, einfach upgraden  
✅ **Modern** - React, TypeScript, PWA  
✅ **Real-time möglich** - Für spätere Features  
✅ **Backups** - Automatisch durch Supabase  
✅ **SSL/HTTPS** - Automatisch durch Vercel  
✅ **CI/CD** - Git push = Auto-Deploy
