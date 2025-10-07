/**
 * CMS Content Loader
 * Lädt Inhalte aus Markdown-Dateien und fügt sie dynamisch in die HTML-Seiten ein
 */

// Funktion zum Laden und Parsen von Markdown-Dateien
async function loadMarkdownContent(filepath) {
  try {
    const response = await fetch(filepath);
    if (!response.ok) return null;
    const text = await response.text();
    
    // Parse Frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);
    
    if (!match) return { content: text };
    
    const frontmatter = {};
    const frontmatterText = match[1];
    const content = match[2];
    
    // Parse YAML frontmatter (einfaches Parsing)
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = value;
      }
    });
    
    return { frontmatter, content };
  } catch (error) {
    console.error('Error loading content:', filepath, error);
    return null;
  }
}

// Slider-Inhalte laden
async function loadSliderContent() {
  const sliderContainer = document.querySelector('.slider');
  if (!sliderContainer) return;
  
  try {
    // Lade alle Slider-Dateien
    const slides = [];
    for (let i = 1; i <= 3; i++) {
      const content = await loadMarkdownContent(`content/slider/slide-${i}.md`);
      if (content) slides.push(content);
    }
    
    if (slides.length === 0) return; // Keine CMS-Inhalte, behalte HTML
    
    // Baue Slider neu auf
    sliderContainer.innerHTML = slides.map((slide, index) => `
      <div class="slide">
        <div class="slide-content">
          <div class="slide-image">
            <img src="${slide.frontmatter.image_desktop || 'assets/img/slider-placeholder-1.svg'}" 
                 alt="${slide.frontmatter.title}" class="desktop-only">
            <img src="${slide.frontmatter.image_mobile || slide.frontmatter.image_desktop || 'assets/img/slider-placeholder-1.svg'}" 
                 alt="${slide.frontmatter.title}" class="mobile-only">
          </div>
          <div class="slide-text">
            ${slide.frontmatter.meta ? `<div class="slide-meta">${slide.frontmatter.meta}</div>` : ''}
            <h1 class="hero-title">${slide.frontmatter.title}</h1>
            ${slide.frontmatter.subtitle ? `<h2 class="hero-subtitle">${slide.frontmatter.subtitle}</h2>` : ''}
            ${slide.frontmatter.description ? `<p class="lead">${slide.frontmatter.description}</p>` : ''}
            <div class="hero-cta">
              <a class="btn btn-primary" href="${slide.frontmatter.cta_link || '#'}">${slide.frontmatter.cta_text || 'Mehr erfahren'}</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    // Reinitialize slider
    if (window.Slider) {
      new window.Slider(document.querySelector('.slider-container'));
    }
  } catch (error) {
    console.error('Error loading slider content:', error);
  }
}

// Statistics-Section laden
async function loadStatistics() {
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;
  
  const content = await loadMarkdownContent('content/homepage/statistics.md');
  if (!content || !content.frontmatter) return;
  
  // Parse stats array aus Frontmatter
  // (Dies ist vereinfacht - in Produktion würde man einen richtigen YAML-Parser verwenden)
  // Für jetzt behalten wir die HTML-Inhalte
}

// Services-Section laden
async function loadServices() {
  const servicesSection = document.querySelector('.section-services .container');
  if (!servicesSection) return;
  
  const content = await loadMarkdownContent('content/homepage/services.md');
  if (!content || !content.frontmatter) return;
  
  // Aktualisiere nur wenn CMS-Daten vorhanden sind
  // Für jetzt behalten wir die HTML-Inhalte
}

// Initialisiere Content-Loader wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
  // Lade Slider-Inhalte
  loadSliderContent();
  
  // Weitere Content-Loader können hier hinzugefügt werden
  // loadStatistics();
  // loadServices();
});
