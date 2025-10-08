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

### Slider bearbeiten:

1. **Slider** in Sidebar anklicken
2. Slide auswählen
3. Felder bearbeiten:
   - **Title**: Hauptüberschrift
   - **Subtitle**: Unterüberschrift
   - **Description**: Beschreibungstext
   - **Meta**: Kategorie-Label (z.B. "Einzelpersonen")
   - **Desktop Image**: Bild für Desktop
   - **Mobile Image**: Bild für Mobile (optional)
   - **CTA Text**: Button-Text
   - **CTA Link**: Button-Ziel
   - **Order**: Reihenfolge (1, 2, 3...)
   - **Active**: An/Aus Schalter
4. **"Publish"** klicken
5. Warten (~2 Minuten)
6. Änderungen sind live! 🎊

### Neue Slides hinzufügen:

1. **"New Slide"** klicken
2. Alle Felder ausfüllen
3. **Order** setzen (bestimmt Position)
4. **"Publish"**
5. Slide erscheint automatisch!

### Slides löschen:

1. Slide öffnen
2. **"Delete"** klicken
3. Bestätigen
4. Slide verschwindet von der Website

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
- **Markdown** (content/slider/*.md) → **GitHub Action** → **JSON** (data/slides.json) → **JavaScript** → **Website**

### Files:
- `admin/config.yml` - CMS Konfiguration
- `admin/index.html` - CMS Interface
- `data/slides.json` - Slider-Daten (auto-generiert)
- `assets/js/cms-loader.js` - Lädt CMS-Inhalte
- `.github/workflows/sync-cms-to-json.yml` - Auto-Sync

---

## 🆘 Troubleshooting

### Änderungen nicht sichtbar:

**Lösung:**
1. Warte 2-3 Minuten
2. Hard Refresh: Cmd+Shift+R (Mac) oder Ctrl+Shift+R (Windows)
3. Prüfe Browser Console (F12) für Fehler
4. Prüfe GitHub Actions: https://github.com/VinniWe/mind-studio-website/actions

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

---

## 📞 Support

Bei Problemen:
1. Browser Console prüfen (F12)
2. GitHub Actions Logs prüfen
3. Netlify Deploy Logs prüfen

**Alles läuft über:**
- Repository: https://github.com/VinniWe/mind-studio-website
- Netlify: https://app.netlify.com/sites/mind-studio

---

Erstellt mit ❤️ für Mind Studio

