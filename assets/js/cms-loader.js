/**
 * CMS Content Loader
 * Lädt Inhalte aus Markdown-Dateien und fügt sie dynamisch in die HTML-Seiten ein
 */

// Funktion zum Laden und Parsen von Markdown-Dateien
async function loadMarkdownContent(filepath) {
  try {
    const response = await fetch(filepath);
    if (!response.ok) {
      console.warn('Content file not found:', filepath);
      return null;
    }
    const text = await response.text();
    
    // Parse Frontmatter
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);
    
    if (!match) return { content: text };
    
    const frontmatter = {};
    const frontmatterText = match[1];
    const content = match[2];
    
    // Parse YAML frontmatter (verbessertes Parsing)
    const lines = frontmatterText.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes
        value = value.replace(/^["']|["']$/g, '');
        
        // Handle boolean values
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        // Handle numbers
        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }
        
        frontmatter[key] = value;
      }
    }
    
    return { frontmatter, content };
  } catch (error) {
    console.error('Error loading content:', filepath, error);
    return null;
  }
}

// Slider-Inhalte laden
async function loadSliderContent() {
  const sliderContainer = document.querySelector('.slider');
  if (!sliderContainer) {
    console.log('Slider container not found');
    return;
  }
  
  console.log('🔄 Loading slider content from CMS...');
  
  try {
    // Lade alle Slider-Dateien dynamisch (versuche bis zu 20 Slides)
    const slides = [];
    for (let i = 1; i <= 20; i++) {
      const content = await loadMarkdownContent(`content/slider/slide-${i}.md`);
      if (content && content.frontmatter) {
        // Nur aktive Slides hinzufügen
        if (content.frontmatter.active !== false) {
          slides.push({ ...content.frontmatter, index: i });
        }
      } else {
        // Wenn keine Datei gefunden, versuche weiter (für Lücken)
        // Aber stoppe nach 3 aufeinanderfolgenden Fehlern
        if (i > 3 && slides.length === 0) break;
      }
    }
    
    // Filtere leere Einträge
    const validSlides = slides.filter(slide => slide.title || slide.description);
    
    // Sortiere nach order-Feld
    validSlides.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    if (validSlides.length === 0) {
      console.log('⚠️ No CMS slides found, keeping HTML content');
      return;
    }
    
    console.log(`✅ Found ${validSlides.length} slides in CMS`);
    
    // Baue Slider neu auf mit allen CMS-Feldern
    sliderContainer.innerHTML = validSlides.map((slide, index) => {
      const desktopImage = slide.image_desktop || `assets/img/slider-placeholder-${slide.index}.svg`;
      const mobileImage = slide.image_mobile || slide.image_desktop || `assets/img/slider-placeholder-${slide.index}.svg`;
      
      console.log(`📄 Slide ${index + 1}: ${slide.title}`);
      
      return `
      <div class="slide" data-slide-index="${index}">
        <div class="slide-content">
          <div class="slide-image">
            <img src="${desktopImage}" 
                 alt="${slide.title || 'Slide'}" class="desktop-only">
            <img src="${mobileImage}" 
                 alt="${slide.title || 'Slide'}" class="mobile-only">
          </div>
          <div class="slide-text">
            ${slide.meta ? `<div class="slide-meta">${slide.meta}</div>` : ''}
            <h1 class="hero-title">${slide.title || ''}</h1>
            ${slide.subtitle ? `<h2 class="hero-subtitle">${slide.subtitle}</h2>` : ''}
            ${slide.description ? `<p class="lead">${slide.description}</p>` : ''}
            ${slide.cta_text ? `
            <div class="hero-cta">
              <a class="btn btn-primary" href="${slide.cta_link || '#'}">${slide.cta_text}</a>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      `;
    }).join('');
    
    console.log('✅ Slider HTML updated');
    
    // Update slider controls based on number of slides
    const dotsContainer = document.querySelector('.slider-dots');
    const controlsContainer = document.querySelector('.slider-controls');
    
    if (validSlides.length > 1) {
      // Multiple slides - show controls and dots
      if (dotsContainer) {
        dotsContainer.innerHTML = validSlides.map((_, index) => 
          `<div class="slider-dot ${index === 0 ? 'active' : ''}"></div>`
        ).join('');
        dotsContainer.style.display = '';
        console.log(`✅ Updated slider dots (${validSlides.length} dots)`);
      }
      if (controlsContainer) {
        controlsContainer.style.display = '';
      }
      
      // Reinitialize slider
      const sliderContainerParent = document.querySelector('.slider-container');
      if (sliderContainerParent && window.Slider) {
        setTimeout(() => {
          new window.Slider(sliderContainerParent);
          console.log('✅ Slider reinitialized');
        }, 100);
      }
    } else {
      // Single slide - hide controls and dots
      if (dotsContainer) {
        dotsContainer.style.display = 'none';
      }
      if (controlsContainer) {
        controlsContainer.style.display = 'none';
      }
      console.log('✅ Single slide mode - controls hidden');
    }
  } catch (error) {
    console.error('❌ Error loading slider content:', error);
  }
}

// Initialisiere Content-Loader wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 CMS Loader initialized');
  // Lade Slider-Inhalte
  loadSliderContent();
});
