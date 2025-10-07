const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Liest eine Markdown-Datei und parsed Frontmatter
 */
function readMarkdownFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  
  if (!match) return { frontmatter: {}, body: content };
  
  const frontmatter = yaml.load(match[1]);
  const body = match[2];
  
  return { frontmatter, body };
}

/**
 * Aktualisiert index.html mit Slider-Inhalten
 */
function updateIndexHTML() {
  console.log('📄 Aktualisiere index.html...');
  
  const indexPath = path.join(process.cwd(), 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Lade Slider-Dateien
  const slides = [];
  for (let i = 1; i <= 3; i++) {
    const slidePath = path.join(process.cwd(), `content/slider/slide-${i}.md`);
    if (fs.existsSync(slidePath)) {
      const { frontmatter } = readMarkdownFile(slidePath);
      slides.push(frontmatter);
    }
  }
  
  // Ersetze Slider-Inhalte
  slides.forEach((slide, index) => {
    const slideNum = index + 1;
    
    // Finde und ersetze Titel
    const titleRegex = new RegExp(`(<h1 class="hero-title">)([^<]*)(</h1>)`, 'g');
    let matchCount = 0;
    html = html.replace(titleRegex, (match, p1, p2, p3) => {
      matchCount++;
      if (matchCount === slideNum && slide.title) {
        return `${p1}${slide.title}${p3}`;
      }
      return match;
    });
    
    // Finde und ersetze Untertitel
    if (slide.subtitle) {
      const subtitleRegex = new RegExp(`(<h2 class="hero-subtitle">)([^<]*)(</h2>)`, 'g');
      matchCount = 0;
      html = html.replace(subtitleRegex, (match, p1, p2, p3) => {
        matchCount++;
        if (matchCount === slideNum) {
          return `${p1}${slide.subtitle}${p3}`;
        }
        return match;
      });
    }
    
    // Finde und ersetze Beschreibung
    if (slide.description) {
      const descRegex = new RegExp(`(<p class="lead">)([^<]*)(</p>)`, 'g');
      matchCount = 0;
      html = html.replace(descRegex, (match, p1, p2, p3) => {
        matchCount++;
        if (matchCount === slideNum) {
          return `${p1}${slide.description}${p3}`;
        }
        return match;
      });
    }
    
    console.log(`✅ Slide ${slideNum} aktualisiert: ${slide.title}`);
  });
  
  // Schreibe aktualisierte Datei
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ index.html gespeichert!');
}

// Führe Update aus
try {
  updateIndexHTML();
  console.log('\n🎉 Alle Updates erfolgreich!');
} catch (error) {
  console.error('❌ Fehler beim Update:', error);
  process.exit(1);
}

