# Mind Studio CMS - Setup & Bedienungsanleitung

## 🎯 Überblick

Ihre Website nutzt **Netlify CMS** für Content-Management mit **GitHub OAuth** Authentifizierung.

**Live URLs:**
- **Website:** https://mind-studio.netlify.app
- **CMS:** https://mind-studio.netlify.app/admin/

---

## 🚀 Zugriff auf das CMS

### Login:
1. Gehe zu: https://mind-studio.netlify.app/admin/
2. Klicke auf **"Mit GitHub einloggen"**
3. Autorisiere die App (nur beim ersten Mal)
4. Fertig! ✅

---

## ✏️ Content bearbeiten

### 📊 Slider bearbeiten:

1. **"Slider"** in Sidebar anklicken
2. Slide auswählen oder **"New Slide"** erstellen
3. Felder bearbeiten:
   - **Title**: Hauptüberschrift
   - **Subtitle**: Unterüberschrift
   - **Description**: Beschreibungstext
   - **Meta**: Kategorie-Label (z.B. "Einzelpersonen")
   - **Desktop Image**: Bild für Desktop
   - **Mobile Image**: Bild für Mobile (optional)
   - **CTA Text**: Button-Text
   - **CTA Link**: Button-Ziel
   - **Order**: Reihenfolge (0, 1, 2...)
   - **Active**: An/Aus Schalter
4. **"Publish"** klicken
5. Warten (~2 Minuten)
6. Änderungen sind live! 🎊

### 📄 Seiteninhalte bearbeiten:

Unter **"Seiten Inhalte"** können Sie alle Texte und Inhalte der Website bearbeiten:

#### **Startseite:**
- **Statistiken**: Die 3 Statistik-Blöcke unter dem Slider
- **Angebot Sektion**: Überschrift, Untertitel und beide Service-Cards
- **Ansatz Sektion**: Die 3 Prinzipien-Cards (Haltung, Arbeitsweise, Format)
- **Testimonials**: Überschrift und alle Zitate

#### **Leistungen Einzelpersonen:**
- **Hero**: Eyebrow, Titel, Lead-Text, CTA Button
- **Typische Anliegen**: Titel und Liste der Anliegen
- **Ablauf**: Titel und Ablauf-Schritte

#### **Leistungen Organisationen:**
- **Hero**: Eyebrow, Titel, Lead-Text, CTA Button
- **Formate**: Titel und Liste der Formate
- **Vorgehen**: Titel und Vorgehen-Schritte

#### **Ansatz:**
- **Hero**: Eyebrow, Titel, Lead-Text
- **Prinzipien**: 3 Cards (Ressourcenorientiert, Kontextsensibel, Lösungsfokussiert)
- **Rahmen**: Titel und Liste
- **Methoden**: Titel und Liste

#### **Über mich:**
- **Hero**: Eyebrow, Name, Lead-Text
- **Kurzbiografie**: Titel, Text, Qualifikationen-Liste
- **Arbeitsweise**: Titel, Liste, Haltung-Titel, Haltung-Text, CTA Button

#### **Kontakt:**
- **Hero**: Eyebrow, Titel, Lead-Text
- **Kontakt Informationen**: Titel, Name, E-Mail, Telefon, Info-Text

**Wichtig:** Nach jeder Änderung **"Publish"** klicken und ~2 Minuten warten.

---

## 🖼️ Bilder hochladen

1. Klicke auf Bildfeld
2. **"Choose an image"**
3. **Upload** Tab
4. Bild hochladen (empfohlen: max 500KB)
5. **"Insert"**
6. Fertig!

**Bild-Empfehlungen:**
- Desktop: 1920x1080px (Querformat)
- Mobile: 1080x1920px (Hochformat)  
- Format: JPG oder WebP
- Größe: unter 500KB

---

## ⚙️ Wie Änderungen live gehen

```
CMS Edit → GitHub → GitHub Action → JSON Update → Netlify → Live!
```

1. **Du bearbeitest** im CMS
2. **CMS speichert** in GitHub (Markdown)
3. **GitHub Action** konvertiert zu JSON
4. **Netlify** erkennt Änderung
5. **Netlify baut** Website neu
6. **Änderungen live** (~2 Minuten)

---

## 🔧 Technische Details

### Architektur:
- **Hosting:** Netlify
- **CMS:** Netlify CMS 2.10.192
- **Auth:** GitHub OAuth via Netlify
- **Storage:** Git (GitHub Repository)
- **Build:** Automatic bei jedem Push

### Content-Flow:
- **Markdown** (content/slider/*.md & content/pages/*.md) → **GitHub Action** → **JSON** (data/slides.json & data/content.json) → **JavaScript** → **Website**

### Wichtige Dateien:
- `admin/config.yml` - CMS Konfiguration
- `admin/index.html` - CMS Interface
- `data/slides.json` - Slider-Daten (auto-generiert)
- `data/content.json` - Seiten-Inhalte (auto-generiert)
- `assets/js/cms-loader.js` - Lädt CMS-Inhalte dynamisch
- `.github/workflows/sync-cms-to-json.yml` - Auto-Sync Workflow

### Markdown-Dateien:
- `content/slider/*.md` - Slider-Slides
- `content/pages/home.md` - Startseite
- `content/pages/services-individual.md` - Leistungen Einzelpersonen
- `content/pages/services-organizations.md` - Leistungen Organisationen
- `content/pages/approach.md` - Ansatz
- `content/pages/about.md` - Über mich
- `content/pages/contact.md` - Kontakt

---

## 🎨 Design-Hinweise

### Kein Flash-of-Content:
- Der Slider wird **ohne statisches HTML** geladen, um einen "Flash" zu vermeiden
- Alle anderen Inhalte haben minimales Fallback-HTML
- Content wird dynamisch aus JSON geladen

### Mobile-First:
- Alle Inhalte sind responsive
- Mobile und Desktop werden automatisch angepasst
- Slider unterstützt separate Mobile/Desktop-Bilder

---

## 🆘 Troubleshooting

### Änderungen nicht sichtbar:

**Lösung:**
1. Warte 2-3 Minuten
2. Hard Refresh: Cmd+Shift+R (Mac) oder Ctrl+Shift+R (Windows)
3. Prüfe Browser Console (F12) für Fehler
4. Prüfe GitHub Actions: https://github.com/VinniWe/mind-studio-website/actions
5. Prüfe Netlify Deploy: https://app.netlify.com/sites/mind-studio/deploys

### Login funktioniert nicht:

**Lösung:**
1. Stelle sicher, dass du GitHub Zugriff auf das Repository hast
2. Prüfe ob OAuth in Netlify konfiguriert ist
3. Lösche Browser Cookies und versuche erneut

### Bilder laden nicht:

**Lösung:**
1. Prüfe Bildgröße (max 5MB)
2. Verwende JPG, PNG, WebP oder SVG
3. Stelle sicher dass Upload abgeschlossen ist
4. Prüfe Pfad (sollte `/uploads/...` sein)

### Content lädt nicht:

**Lösung:**
1. Öffne Browser Console (F12)
2. Suche nach Fehlermeldungen
3. Prüfe ob `data/content.json` und `data/slides.json` existieren
4. Prüfe GitHub Actions Logs für Fehler bei der Konvertierung

---

## 🌐 Mehrsprachigkeit

- **Deutsche Version**: Alle Hauptseiten (/, /leistungen-einzel.html, etc.)
- **Englische Version**: `/en/` Verzeichnis
- CMS unterstützt aktuell nur deutsche Inhalte
- Englische Inhalte müssen manuell im Code aktualisiert werden

**Hinweis:** Falls Sie auch englische Inhalte über CMS verwalten möchten, kann dies als zukünftige Erweiterung implementiert werden.

---

## 📞 Support

Bei Problemen:
1. Browser Console prüfen (F12)
2. GitHub Actions Logs prüfen: https://github.com/VinniWe/mind-studio-website/actions
3. Netlify Deploy Logs prüfen: https://app.netlify.com/sites/mind-studio/deploys

**Alles läuft über:**
- Repository: https://github.com/VinniWe/mind-studio-website
- Netlify: https://app.netlify.com/sites/mind-studio

---

## ✅ Was wurde integriert

### Vollständig CMS-verwaltbar:
- ✅ **Slider** (mit Bildern, Text, CTAs, Order, Active-Status)
- ✅ **Startseite** (Stats, Services, Approach, Testimonials)
- ✅ **Leistungen Einzelpersonen** (Hero, Anliegen, Ablauf)
- ✅ **Leistungen Organisationen** (Hero, Formate, Vorgehen)
- ✅ **Ansatz** (Hero, Prinzipien, Rahmen, Methoden)
- ✅ **Über mich** (Hero, Biografie, Arbeitsweise)
- ✅ **Kontakt** (Hero, Kontaktinformationen)

### Technische Features:
- ✅ Kein Flash-of-Content beim Laden
- ✅ Automatische GitHub Action für JSON-Konvertierung
- ✅ Dynamisches Laden aller Inhalte
- ✅ Fallback-Inhalte falls CMS nicht lädt
- ✅ Mobile-responsive
- ✅ SEO-optimiert

---

Erstellt mit ❤️ für Mind Studio

**Letzte Aktualisierung:** Oktober 2024
