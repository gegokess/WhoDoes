# Testkonzept für WhoDoes

Dieses Dokument beschreibt die Strategie zur Qualitätssicherung des WhoDoes-Systems. Ziel ist es, durch eine Kombination aus automatisierten und manuellen Tests eine hohe Stabilität und Zuverlässigkeit zu gewährleisten, insbesondere im Hinblick auf die Offline-Funktionalität und Datensynchronisation.

## 1. Test-Strategie (Test-Pyramide)

Wir verfolgen einen pyramidenförmigen Ansatz: Viele schnelle Unit-Tests, eine solide Basis an Integrations-Tests und gezielte E2E-Tests für kritische Pfade.

### 1.1 Unit Tests (Basis)
**Ziel:** Testen von isolierter Logik, Funktionen und Hooks ohne UI-Rendering oder externe Abhängigkeiten (bzw. mit Mocks).

- **Tools:** `Vitest` (schnell, kompatibel mit Vite-Config).
- **Scope:**
  - **Utilities (`src/utils/`)**: Datumsformatierung, Berechnungslogik für Punkte.
  - **Hooks (`src/hooks/`)**: Testen der Business-Logik in Custom Hooks (z.B. `usePoints`, `useTasks`) mittels `renderHook`.
  - **Libraries (`src/lib/`)**:
    - `sync.ts`: Logik für die Synchronisations-Queue (Mocking von Network/DB).
    - `household.ts`: Validierung von Codes, Generierung von IDs.

### 1.2 Component / Integration Tests (Mitte)
**Ziel:** Überprüfung des Zusammenspiels von Komponenten, User-Interaktionen und State-Management.

- **Tools:** `Vitest` + `React Testing Library` + `@testing-library/user-event`.
- **Scope:**
  - **UI-Komponenten**: Rendert die `TaskCard` korrekt? Werden Events (`onComplete`) gefeuert?
  - **Formulare**: Validierung in `TaskForm`, Input-Handling.
  - **Stores**: Interaktion zwischen Komponenten und Zustand-Stores (Mocking der Store-Initialisierung).
  - **Datenbank-Integration**: Tests gegen eine In-Memory Instanz von Dexie.js (IndexedDB Mock).

### 1.3 End-to-End (E2E) Tests (Spitze)
**Ziel:** Simulation echter User-Journeys in einer realen Browser-Umgebung. Verifikation des Gesamtsystems inkl. Routing, Persistenz und Flows.

- **Tools:** `Playwright` (bietet exzellente Unterstützung für Offline-Simulation und Multi-Tab Tests).
- **Scope:**
  - **Onboarding Flow**: Haushalt erstellen -> Partner anlegen -> Dashboard.
  - **Core Loop**: Task erstellen -> Task erledigen -> Punkte verifizieren.
  - **Offline/Sync**:
    1. Netzwerk deaktivieren (Playwright Network Interception).
    2. Aktion durchführen (Task erledigen).
    3. Netzwerk aktivieren.
    4. Prüfen, ob Daten synchronisiert wurden.

---

## 2. Empfohlenes Tooling & Setup

Um diesen Plan umzusetzen, müssen folgende Dev-Dependencies installiert werden:

### Unit & Integration
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/dom
```

### E2E
```bash
npm init playwright@latest
```

### Skripte in `package.json`
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

---

## 3. Detaillierte Test-Szenarien

### 3.1 Kritische Pfade (E2E)

| ID | Szenario | Erwartetes Ergebnis |
|----|----------|---------------------|
| **E2E-01** | **Initial Setup** | User kann Haushalt erstellen, erhält Code, landet auf Home. `localStorage` enthält `householdId`. |
| **E2E-02** | **Task Lifecycle** | User erstellt "Test Task" (5 Pkt). Task erscheint in Liste. User klickt "Erledigen". Punkte steigen um 5. |
| **E2E-03** | **Offline Resilience** | App lädt ohne Netz. User erledigt Task offline. UI zeigt Update optimistisch. Nach Reconnect wird Sync getriggert. |
| **E2E-04** | **Partner Join** | User B gibt Code von User A ein. Beide sehen denselben Haushalt. |

### 3.2 Logik-Tests (Unit/Integration)

- **Punkte-Berechnung**:
  - Input: Liste von Completions mit verschiedenen Timestamps.
  - Test: Filterung nach "Heute", "Woche", "Monat" liefert korrekte Summen.
  - Test: Retroaktive Punkteänderung berechnet Historie neu (wenn Flag gesetzt).

- **Synchronisation (`sync.ts`)**:
  - Test: `pushChanges` sendet nur "dirty" Records.
  - Test: Konfliktlösung (Last Write Wins) bei gleichzeitigen Edits (simuliert).

---

## 4. Manuelle Verifikation (Ergänzend)

Trotz Automatisierung sind manuelle Tests für UX und "Look & Feel" essentiell.

- **Geräte-Tests**:
  - iPhone (Safari): Prüfen von Safe-Area Insets, PWA-Installation, Touch-Response.
  - Android (Chrome): PWA-Installation, Back-Button Verhalten.
- **Visuelle Prüfung**:
  - Dark Mode / Farben (Dusk Palette).
  - Animationen (Ruckelfreiheit).
- **Edge Cases**:
  - App öffnen mit sehr schlechter Verbindung (Flaky Network).
  - App killen und neu starten (State Persistence).

## 5. CI/CD Integration

Ein GitHub Actions Workflow sollte bei jedem Push/PR folgende Checks ausführen:

1. **Linting**: `npm run lint` (Code Style).
2. **Type Check**: `tsc -b` (TypeScript Fehler).
3. **Unit Tests**: `npm run test` (Logik & Komponenten).
4. **Build**: `npm run build` (Sicherstellen, dass der Build durchläuft).

*E2E Tests können optional nightly oder nur bei PRs auf `main` laufen, da sie ressourcenintensiver sind.*
