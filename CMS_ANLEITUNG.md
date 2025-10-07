# CMS Anleitung - Wie Änderungen sichtbar werden

## 🤔 Warum zeigen meine Änderungen nicht sofort?

Dein CMS ist als **"Git-basiertes CMS"** konfiguriert. Das bedeutet:

1. ✅ Du bearbeitest Inhalte im CMS
2. ✅ CMS speichert Änderungen in Markdown-Dateien
3. ✅ Änderungen werden zu GitHub gepusht
4. ❌ **ABER:** Die HTML-Dateien müssen noch aktualisiert werden

---

## 🔧 **Zwei Lösungen:**

### **Lösung 1: Automatischer Build mit Netlify (Empfohlen)**

Netlify kann die Markdown-Dateien automatisch in HTML umwandeln:

#### **Setup:**
1. Füge `netlify.toml` Konfiguration hinzu
2. Installiere einen Static Site Generator (z.B. 11ty oder Hugo)
3. Netlify baut die Site bei jedem Push automatisch

**Vorteil:** Vollautomatisch  
**Nachteil:** Etwas Setup erforderlich

---

### **Lösung 2: Direkte HTML-Bearbeitung (Schnell)**

Bearbeite die HTML-Dateien direkt im CMS:

#### **So geht's:**

1. **Gehe ins CMS:** https://mind-studio.netlify.app/admin/

2. **Füge eine neue Collection hinzu** in `admin/config.yml`:

```yaml
  - name: "html-pages"
    label: "Webseiten (Direkt)"
    files:
      - label: "Homepage"
        name: "index"
        file: "index.html"
        fields:
          - {label: "Inhalt", name: "body", widget: "code"}
```

3. **Jetzt kannst du HTML direkt bearbeiten**

**Vorteil:** Sofort sichtbar  
**Nachteil:** HTML-Kenntnisse erforderlich

---

### **Lösung 3: JavaScript Data Files (Hybrid - Ich empfehle diese!)**

Ändere die Content-Struktur auf JSON statt Markdown:

1. CMS speichert Daten als JSON
2. JavaScript lädt JSON und aktualisiert HTML
3. Funktioniert auf GitHub Pages ohne Build

**Das setze ich jetzt für dich um!** ⬇️

---

## 🚀 Was ich jetzt mache:

Ich konvertiere das System zu JSON-basierten Daten:
- CMS → JSON-Dateien
- JavaScript lädt JSON
- Inhalte werden dynamisch eingefügt
- **Funktioniert sofort ohne Build!**

Einen Moment...

