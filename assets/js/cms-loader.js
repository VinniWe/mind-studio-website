/**
 * CMS Content Loader
 * Loads slider content from JSON and updates the website dynamically
 */

// Load slider content
async function loadSliderContent() {
  const sliderContainer = document.querySelector('.slider');
  const sliderContainerParent = document.querySelector('.slider-container');
  
  if (!sliderContainer) {
    console.log('Slider container not found');
    return;
  }
  
  // DON'T hide during load - keep HTML visible
  console.log('🔄 Loading slider content from JSON...');
  
  try {
    // Load slides from JSON file
    const response = await fetch('data/slides.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const slides = await response.json();
    
    // Filter nur aktive Slides
    const validSlides = slides.filter(slide => 
      slide.active !== false && (slide.title || slide.description)
    );
    
    // Sortiere nach order-Feld
    validSlides.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    if (validSlides.length === 0) {
      console.log('⚠️ No CMS slides found - keeping HTML fallback');
      // Keep the HTML fallback content, don't replace it
      return;
    }
    
    console.log(`✅ Found ${validSlides.length} slides in CMS`);
    
    // Baue Slider neu auf mit allen CMS-Feldern
    sliderContainer.innerHTML = validSlides.map((slide, index) => {
      const desktopImage = slide.image_desktop || `assets/img/slider-placeholder-${index + 1}.svg`;
      const mobileImage = slide.image_mobile || slide.image_desktop || `assets/img/slider-placeholder-${index + 1}.svg`;
      
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
      if (sliderContainerParent && window.Slider) {
        sliderContainerParent.dataset.initialized = 'true';
        setTimeout(() => {
          new window.Slider(sliderContainerParent);
          console.log('✅ Slider reinitialized from CMS');
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
    // Keep HTML fallback on error
    return;
  }
}

// Initialisiere Content-Loader wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 CMS Loader initialized');
  // Lade Slider-Inhalte
  loadSliderContent();
});
