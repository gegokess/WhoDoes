# WhoDoes - UI/UX Design System

## 🎨 Design Philosophy

**WhoDoes** nutzt ein modernes, klares Design basierend auf einer **"Modern Teal" Color Palette**. Die App orientiert sich an modernen Smart-Home-Interfaces (wie Amazon Alexa App).

Die App soll:
- ✅ **Clean & Strukturiert** wirken (Weißer Hintergrund, klare Karten)
- ✅ **Modern** sein (Teal/Cyan Akzente, abgerundete Ecken)
- ✅ **Übersichtlich** sein (Gute Lesbarkeit, klare Hierarchie)
- ✅ **Funktional** wirken (Fokus auf Aktionen und Status)

**Design-Inspiration:** Modern Smart Home Apps - clean, card-based, Teal Akzente.

---

## 🎨 Farbschema: "Modern Teal" Palette

Das Design verzichtet auf warme Erdtöne und setzt auf einen cleanen Look mit kühlen, modernen Akzenten.

### Basis-Farben

```css
:root {
  /* Primary Brand Colors */
  --color-primary: #007A87;      /* Teal/Cyan - Hauptakzent, Icons, Links */
  --color-primary-dark: #005F69; /* Darker Teal - Hover, Active */
  --color-primary-light: #E0F2F1; /* Very Light Teal - Backgrounds for active items */

  /* Backgrounds */
  --color-background: #F2F4F8;   /* Light Gray/Blueish - App Background */
  --color-surface: #FFFFFF;      /* White - Cards, Header, Bottom Nav */
  
  /* Text */
  --color-text: #1D1D1D;         /* Almost Black - Primary Text */
  --color-text-secondary: #555555; /* Dark Gray - Secondary Text */
  --color-text-muted: #888888;   /* Gray - Muted Text, Placeholders */

  /* Borders & Dividers */
  --color-border: #E0E0E0;       /* Light Gray - Borders */
  --color-divider: #F0F0F0;      /* Very Light Gray - Dividers */

  /* Status Colors */
  --color-success: #007A87;      /* Teal (oft als Success genutzt in diesem Style) oder #4CAF50 */
  --color-warning: #FF9800;      /* Orange */
  --color-error: #D32F2F;        /* Red */
}
```

---

## 📝 Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Styles

- **Headings:** Fett (Bold/SemiBold), Dunkel (`--color-text`).
- **Body:** Regular, Dunkelgrau (`--color-text` oder `--color-text-secondary`).
- **Links/Actions:** Teal (`--color-primary`), oft Medium weight.

---

## 🧩 Spacing & Shapes

### Border Radius
Das Design nutzt durchgängig abgerundete Ecken, aber etwas subtiler als zuvor.

```css
--radius-sm: 8px;   /* Buttons, Inputs */
--radius-md: 12px;  /* Cards, Dialogs */
--radius-lg: 16px;  /* Large Cards */
--radius-full: 9999px; /* Avatars, Pills */
```

### Shadows
Subtile Schatten für Tiefe auf dem hellen Hintergrund.

```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
--shadow-floating: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
```

---

## 🎴 UI Komponenten

### 1. Cards (Container)
Das zentrale Element des Designs.
- **Hintergrund:** Weiß (`#FFFFFF`)
- **Schatten:** Subtil oder gar keiner (dafür Border oder Kontrast zum grauen Hintergrund)
- **Padding:** 16px - 20px
- **Inhalt:** Oft Icon links (Teal), Text mitte, Action rechts (+ Button).

**Beispiel (Activity Card):**
```
┌─────────────────────────────────────┐
│  [Icon]  Titel der Karte       [+]  │
│          Subtext / Beschreibung     │
└─────────────────────────────────────┘
```

### 2. Buttons
- **Primary Button:** Teal Hintergrund, Weißer Text, abgerundet.
- **Secondary/Ghost Button:** Transparenter Hintergrund, Teal Text (z.B. "See All").
- **Icon Button:** Oft Kreisrund oder nur das Icon in Teal.

### 3. Bottom Navigation
- **Hintergrund:** Weiß (`#FFFFFF`)
- **Icons:** Grau (inaktiv), Teal/Blau (aktiv).
- **Labels:** Optional oder klein unter den Icons.
- **Besonderheit:** Zentraler Action-Button oder Input Field (wie "Message Alexa").

### 4. Header
- **Hintergrund:** Weiß oder Transparent.
- **Elemente:** Titel links ("Home"), Aktionen rechts (+, Glocke, Profil).
- **Profil:** Farbiger Kreis mit Initiale (z.B. Blau mit weißem Text).

---

## 📱 Screen Layouts (Angepasst)

### Home Screen
- **Header:** "Home", Add Button, Notifications, Profile Avatar.
- **Section "Activity":**
    - Link "See All" rechts.
    - Liste von breiten Cards (z.B. "Create a reminder", "Add an alarm").
    - Jede Card hat ein farbiges Icon links (Teal) und einen Action-Button rechts (+).
- **Section "Favorites":**
    - Grid von quadratischen oder rechteckigen Cards.
    - Inhalt: Status (z.B. "Light Off"), Name ("Alex's Echo Pop"), Icon.
    - "Edit" Link rechts oben.

### Tasks Screen
- Ähnlich wie "Activity" Section.
- Liste von Aufgaben als Cards.
- Checkbox oder Check-Circle links.

### Points Screen
- Clean Charts oder Progress Bars in Teal.

---

## 🌟 Design Tokens (Zusammenfassung)

```css
:root {
  /* Colors */
  --color-primary: #007A87;
  --color-bg-app: #F2F4F8;
  --color-bg-card: #FFFFFF;
  --color-text-main: #1D1D1D;
  --color-text-sub: #555555;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  
  /* Radius */
  --radius-card: 12px;
  --radius-button: 8px;
}
```
