## Minimaler Funktionsumfang & User Stories für eine Paar-Haushalts-Punkte-App

### 🔍 Zielsetzung
Eine minimalistische App, mit der **zwei Personen (ein Paar)** fair und einfach nachvollziehen können,  
**wer wie viel im Haushalt macht**, anhand von Aufgaben und Punkten.

Fokus:
- so wenig Funktionen wie möglich
- klare Übersicht: *„Wer macht wie viel?“*
- offline nutzbar, mit einfacher Cloud-Synchronisation

---

## 1. Scope & Annahmen

- Es gibt genau **zwei Personen** (Partner A und Partner B).
- Beide teilen sich **eine gemeinsame Aufgabenliste** und **eine gemeinsame Punktebasis**.
- Es gibt **keine** weiteren Haushaltsmitglieder, Teams oder Kinderkonten.
- Es gibt **kein** Gamification-System (keine Badges, keine Wettbewerbe, keine Belohnungen).
- Die App läuft auf mehreren Geräten und synchronisiert Daten über eine einfache Cloud-Lösung.

---

## 2. User Stories

### 2.1 Aufgaben erstellen & verwalten

**User Stories**

- **Als Partner** möchte ich Aufgaben anlegen können, um Haushaltstätigkeiten zu erfassen.
- **Als Partner** möchte ich aus einfachen Aufgaben-Vorlagen auswählen können (z. B. „Müll rausbringen“, „Bad putzen“), um schneller starten zu können.
- **Als Partner** möchte ich für jede Aufgabe Punkte festlegen können, um den Aufwand der Aufgabe abzubilden.
- **Als Partner** möchte ich Aufgaben bearbeiten und löschen können, um sie bei Änderungen im Alltag anpassen zu können.

**Fachliche Regeln**

- Jede Aufgabe hat:
  - einen Namen
  - eine feste Punktzahl (**mindestens 1 Punkt**, keine 0-Punkte-Aufgaben)
- Punkte sind **an die Art der Aufgabe** geknüpft, nicht an einzelne Erledigungs-Einträge.
- Eine Aufgabe kann beliebig oft im Zeitverlauf genutzt werden.

---

### 2.2 Punkte-Logik & Änderung von Punktwerten

**User Stories**

- **Als Partner** möchte ich die Punktzahl einer bestehenden Aufgabe ändern können, um die Bewertung von Aufgaben bei Bedarf anzupassen.
- **Als Partner** möchte ich beim Ändern der Punktzahl entscheiden können, ob sich diese Änderung:
  - nur auf zukünftige Erledigungen auswirkt oder
  - auch rückwirkend auf alle bisherigen Erledigungen angewendet wird.

**Fachliche Regeln**

- Beim Ändern der Punktzahl wird dem Nutzer explizit eine Auswahl angeboten:
  - Option A: „Nur für zukünftige Erledigungen übernehmen“
  - Option B: „Für alle bisherigen und zukünftigen Erledigungen übernehmen“
- Historische Einträge werden entweder:
  - unverändert gelassen (A), oder
  - komplett neu berechnet (B).

---

### 2.3 Aufgaben erledigen & Punkte sammeln

**User Stories**

- **Als Partner** möchte ich eine Aufgabe als erledigt markieren können, um Punkte für diese Aufgabe zu erhalten.
- **Als Partner** möchte ich sehen können, wie viele Punkte ich durch das Erledigen einer Aufgabe erhalte, um meinen Beitrag nachvollziehen zu können.
- **Als Partner** möchte ich eine Erledigung rückgängig machen (Undo) können, falls ich mich vertippt habe oder etwas versehentlich als erledigt markiert habe.

**Fachliche Regeln**

- Eine Aufgabe kann **mehrmals pro Tag** erledigt werden.
- Es gibt nur zwei Zustände auf Erledigungsebene:
  - erledigt (Punkte werden gutgeschrieben)
  - nicht erledigt (kein Eintrag, keine Punkte)
- Undo kann einen Erledigungs-Eintrag vollständig entfernen.

---

### 2.4 Vergleich & Übersicht (Punkte)

**User Stories**

- **Als Partner** möchte ich eine Übersicht sehen, wie viele Punkte ich gesammelt habe und wie viele Punkte mein Partner gesammelt hat, um vergleichen zu können, wer wie viel gemacht hat.
- **Als Partner** möchte ich eine **Punkteübersicht pro Zeitraum** (Tag, Woche, Monat) sehen können, um Fairness und Trends über die Zeit zu erkennen.

**Fachliche Regeln**

- Anzeige von:
  - Gesamtpunkte Partner A
  - Gesamtpunkte Partner B
- Zeitraumfilter:
  - Heute
  - Diese Woche
  - Dieser Monat
- Es reicht eine **numerische Übersicht** (keine Charts nötig im MVP).

---

### 2.5 Historie

**User Stories**

- **Als Partner** möchte ich eine Liste der erledigten Aufgaben sehen, um nachvollziehen zu können, wer was gemacht hat.
- **Als Partner** möchte ich die Historie nach Zeitraum (z. B. Heute / Woche / Monat) filtern können, um nicht von alten Einträgen erschlagen zu werden.

**Fachliche Regeln**

- Ein Eintrag in der Historie enthält:
  - welche Aufgabe erledigt wurde
  - von welchem Partner
  - an welchem Tag (Tag-Genauigkeit reicht)
  - wie viele Punkte vergeben wurden (gemäß aktueller oder rückwirkend angepasster Logik)
- Keine zusätzlichen Details wie Uhrzeit, Gerät oder Standort.
- Einzelne Historieneinträge sind **nicht editierbar**; Korrekturen erfolgen über Undo oder Anpassung der Aufgabe + ggf. Neuberechnung.

---

### 2.6 Profile & Identität im Haushalt

**User Stories**

- **Als Partner** möchte ich mich in der App als „Ich“ (Partner A oder Partner B) auswählen können, um meine Erledigungen richtig zuzuordnen.
- **Als Partner** möchte ich meinen Namen und optional einen Avatar einstellen können, um mich vom anderen Partner optisch und namentlich zu unterscheiden.

**Fachliche Regeln**

- Es gibt genau zwei Profile in einem Haushalt (z. B. „Person 1“ und „Person 2“ beim Start, später umbenennbar).
- Kein komplexes Login-System: Die App fragt „Wer bist du?“ und ordnet Erledigungen dem gewählten Partner zu.
- Keine Trennung oder Verwaltung verschiedener Paare/Haushalte im MVP.

---

### 2.7 Reset / Neustart

**User Stories**

- **Als Partner** möchte ich die Möglichkeit haben, die App vollständig zurückzusetzen, um mit einem neuen Zeitraum oder einer neuen Haushaltsorganisation bei Null zu beginnen.

**Fachliche Regeln**

- Reset setzt **alles** zurück:
  - alle Aufgaben
  - alle Profileinstellungen (optional auf Default)
  - gesamte Punkte-Historie
- Es gibt **kein** automatisches Reset (weder wöchentlich noch monatlich).
- Reset erfordert eine deutliche Sicherheitsabfrage (z. B. „LÖSCHEN“ eingeben).

---

## 3. Erweiterte Minimalfunktionen

### 3.1 Quick Actions / Favoriten

**User Stories**

- **Als Partner** möchte ich häufig genutzte Aufgaben als Favoriten markieren können, um sie schneller erledigen zu können.
- **Als Partner** möchte ich auf meine Favoriten direkt zugreifen können, ohne die komplette Aufgabenliste durchsuchen zu müssen.

**Fachliche Regeln**

- Jede Person hat ihre **eigenen Favoriten**, die nicht mit dem Partner geteilt werden.
- Favoritenanzahl ist technisch **nicht begrenzt**, die UI wird jedoch für ca. **bis zu 10 Favoriten pro Person** ausgelegt.
- Favoriten sind einfach Markierungen auf bestehenden Aufgaben (keine Duplikate).

---

### 3.2 Gemeinsame Aufgabenliste

**User Stories**

- **Als Partner** möchte ich dieselbe Aufgabenliste wie mein Partner sehen, damit wir gemeinsam und transparent mit denselben Aufgaben arbeiten.
- **Als Partner** möchte ich Änderungen, die mein Partner an den Aufgaben vornimmt (neue Aufgabe, gelöschte Aufgabe, geänderte Punkte), automatisch übernommen bekommen, um immer auf dem gleichen Stand zu sein.

**Fachliche Regeln**

- Die Aufgabenliste ist zentral, nicht pro Person.
- Jede Änderung an Aufgaben (Erstellen, Bearbeiten, Löschen) ist sofort für beide Partner sichtbar (lokal und nach Sync).

---

### 3.3 Cloud-Synchronisation & Offline-Funktion

**User Stories**

- **Als Paar** möchten wir die App auf mehreren Geräten nutzen können und überall denselben Stand sehen.
- **Als Partner** möchte ich die App auch offline nutzen können, damit ich unabhängig von der Internetverbindung Aufgaben erledigen und Punkte sammeln kann.
- **Als Partner** möchte ich, dass Änderungen automatisch synchronisiert werden, sobald wieder eine Verbindung zur Cloud besteht.

**Fachliche Regeln**

- Ein Haushalt = eine gemeinsame Datenbasis (Tasks, Historie, Punkte).
- Geräte arbeiten offline; bei Verbindung erfolgt Abgleich mit der Cloud.
- Es gibt keine komplexe Account-Struktur im MVP:
  - Einfache Haushaltskennung (z. B. beim ersten Start erstellt, per Code oder QR auf weitere Geräte übertragbar) **oder**
  - später erweiterbar; im MVP reicht eine einfache technische Lösung, die das oben genannte Verhalten ermöglicht.

---

## 4. Out of Scope (bewusst NICHT enthalten)

Folgende Funktionen sind **explizit ausgeschlossen**, um den Umfang minimal zu halten:

- Kein Gamification-System (keine Badges, Levels, Wettbewerbe, Leaderboards).
- Keine Belohnungs- oder Straflogik.
- Keine zusätzlichen Rollen (keine Kinder, keine weiteren Mitbewohner).
- Keine Integration mit Kalendern, To-Do-Apps oder Smart-Home.
- Keine Benachrichtigungen (weder bei Erledigungen noch als Erinnerung).
- Kein Export (z. B. CSV, PDF).
- Kein Dark Mode als Muss-Kriterium (später erweiterbar).
- Keine Suche, keine Tags, keine Kategorien für Aufgaben.
- Keine Trennung / „Trennen“ des Paars oder Multi-Haushalts-Verwaltung.

---

## 5. MVP-Scope Übersicht

### 5.1 Must-Haves (MVP)

- Aufgaben:
  - erstellen, bearbeiten, löschen
  - Vorlagen für typische Haushaltstätigkeiten
  - Punktwert (mind. 1 Punkt)
- Aufgaben erledigen:
  - Erledigen (mehrfach pro Tag möglich)
  - Undo für Erledigungen
- Punkte:
  - Punkte nach Partner getrennt
  - Punkteübersicht (Heute / Woche / Monat)
- Historie:
  - Liste erledigter Aufgaben mit Tag, Partner, Punkte
- Profile:
  - Zwei Partner im Haushalt, auswählbar („Wer bist du?“)
  - Namen und optional Avatare
- Reset:
  - vollständiger Reset von Aufgaben, Punkten, Historie
- Gemeinsame Aufgabenliste:
  - geteilte Liste für beide Partner
- Cloud & Offline:
  - gemeinsame Datengrundlage pro Haushalt
  - Offline nutzbar, später Sync mit Cloud

### 5.2 Should-Haves

- Quick Actions / Favoriten je Partner (bis ca. 10 sinnvoll abbildbar)
- Konfiguration beim Ändern von Punktwerten:
  - nur zukünftig
  - oder inkl. Historie

### 5.3 Could-Haves (für später, nicht im initialen MVP nötig)

- Visuelle Charts zur Punkteentwicklung
- Erweiterte Vorlagenverwaltung
- Einfacher Dark Mode
- Soft-Login/Haushalts-ID mit minimaler Registrierung

---
