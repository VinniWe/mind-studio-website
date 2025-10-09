/**
 * CMS Content Loader
 * Loads content from JSON and updates the website dynamically
 * Prevents flash of static content by loading before display
 */

// Global content cache
let contentData = null;

/**
 * Load all content from JSON
 */
async function loadContent() {
  if (contentData) return contentData;
  
  try {
    console.log('📥 Fetching content.json...');
    const response = await fetch('/data/content.json');
    if (!response.ok) {
      console.warn(`⚠️ content.json returned ${response.status}, trying relative path...`);
      const altResponse = await fetch('data/content.json');
      if (!altResponse.ok) {
        throw new Error(`HTTP error! status: ${altResponse.status}`);
      }
      contentData = await altResponse.json();
    } else {
      contentData = await response.json();
    }
    console.log('✅ content.json loaded successfully');
    return contentData;
  } catch (error) {
    console.error('❌ Error loading content.json:', error);
    console.log('💡 Using HTML fallback content');
    return null;
  }
}

/**
 * Load slider content (existing functionality)
 */
async function loadSliderContent() {
  const sliderContainer = document.querySelector('.slider');
  const sliderContainerParent = document.querySelector('.slider-container');
  
  if (!sliderContainer) {
    return;
  }
  
  console.log('🔄 Loading slider content from JSON...');
  
  try {
    // Load slides from JSON file - try absolute path first, then relative
    let response = await fetch('/data/slides.json');
    if (!response.ok) {
      console.warn(`⚠️ slides.json returned ${response.status}, trying relative path...`);
      response = await fetch('data/slides.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
      return;
    }
    
    console.log(`✅ Found ${validSlides.length} slides in CMS`);
    
    // Baue Slider neu auf mit allen CMS-Feldern
    sliderContainer.innerHTML = validSlides.map((slide, index) => {
      const desktopImage = slide.image_desktop || `assets/img/slider-placeholder-${index + 1}.svg`;
      const mobileImage = slide.image_mobile || slide.image_desktop || `assets/img/slider-placeholder-${index + 1}.svg`;
      
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
    }
  } catch (error) {
    console.error('❌ Error loading slider content:', error);
  }
}

/**
 * Load homepage content
 */
async function loadHomeContent(content) {
  if (!content.home) return;
  
  const home = content.home;
  console.log('🔄 Loading home page content...');
  
  // Stats section
  if (home.stats) {
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = home.stats.map(stat => `
        <blockquote class="stat-block">
          <p><strong>${stat.text}</strong></p>
          <cite>${stat.source}</cite>
        </blockquote>
      `).join('');
    }
  }
  
  // Services section
  if (home.services_section) {
    const section = home.services_section;
    const servicesSection = document.querySelector('.section-services .container');
    if (servicesSection) {
      const titleEl = servicesSection.querySelector('h2');
      const leadEl = servicesSection.querySelector('.lead');
      
      if (titleEl) titleEl.textContent = section.title;
      if (leadEl) leadEl.textContent = section.subtitle;
      
      const grid = servicesSection.querySelector('.grid-2');
      if (grid) {
        grid.innerHTML = `
          <a class="card service-card" href="${section.individual.link}">
            <div class="eyebrow">${section.individual.eyebrow}</div>
            <h3>${section.individual.title}</h3>
            <p>${section.individual.description}</p>
          </a>
          <a class="card service-card" href="${section.organizations.link}">
            <div class="eyebrow">${section.organizations.eyebrow}</div>
            <h3>${section.organizations.title}</h3>
            <p>${section.organizations.description}</p>
          </a>
        `;
      }
    }
  }
  
  // Approach section
  if (home.approach_section) {
    const approachGrid = document.querySelector('.section-approach .grid-3');
    if (approachGrid) {
      approachGrid.innerHTML = home.approach_section.map(item => `
        <div class="card">
          <div class="eyebrow">${item.eyebrow}</div>
          <h3>${item.title}</h3>
          <p class="muted">${item.description}</p>
        </div>
      `).join('');
    }
  }
  
  // Testimonials section
  if (home.testimonials) {
    const testimonialsSection = document.querySelector('.section-testimonials .container');
    if (testimonialsSection) {
      const titleEl = testimonialsSection.querySelector('h2');
      const leadEl = testimonialsSection.querySelector('.lead');
      
      if (titleEl) titleEl.textContent = home.testimonials.title;
      if (leadEl) leadEl.textContent = home.testimonials.subtitle;
      
      const grid = testimonialsSection.querySelector('.grid-3');
      if (grid) {
        grid.innerHTML = home.testimonials.items.map(item => `
          <figure class="card">
            <blockquote class="muted">${item.quote}</blockquote>
            <figcaption><strong>${item.author}</strong> – ${item.role}</figcaption>
          </figure>
        `).join('');
      }
    }
  }
  
  console.log('✅ Home page content loaded');
}

/**
 * Load services individual page content
 */
async function loadServicesIndividualContent(content) {
  if (!content.services_individual) return;
  
  const page = content.services_individual;
  console.log('🔄 Loading services individual page content...');
  
  // Hero section
  if (page.hero) {
    const hero = document.querySelector('.hero .container');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const title = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      const ctaLink = hero.querySelector('.hero-cta a');
      
      if (eyebrow) eyebrow.textContent = page.hero.eyebrow;
      if (title) title.textContent = page.hero.title;
      if (lead) lead.textContent = page.hero.lead;
      if (ctaLink) {
        ctaLink.textContent = page.hero.cta_text;
        ctaLink.href = page.hero.cta_link;
      }
    }
  }
  
  // Cards section
  const cards = document.querySelectorAll('.grid-2 .card');
  
  if (cards.length >= 1 && page.concerns) {
    const concernsCard = cards[0];
    const title = concernsCard.querySelector('h3');
    const list = concernsCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.concerns.title;
    if (list) {
      list.innerHTML = page.concerns.items.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  if (cards.length >= 2 && page.process) {
    const processCard = cards[1];
    const title = processCard.querySelector('h3');
    const list = processCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.process.title;
    if (list) {
      list.innerHTML = page.process.items.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  console.log('✅ Services individual page content loaded');
}

/**
 * Load services organizations page content
 */
async function loadServicesOrganizationsContent(content) {
  if (!content.services_organizations) return;
  
  const page = content.services_organizations;
  console.log('🔄 Loading services organizations page content...');
  
  // Hero section
  if (page.hero) {
    const hero = document.querySelector('.hero .container');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const title = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      const ctaLink = hero.querySelector('.hero-cta a');
      
      if (eyebrow) eyebrow.textContent = page.hero.eyebrow;
      if (title) title.textContent = page.hero.title;
      if (lead) lead.textContent = page.hero.lead;
      if (ctaLink) {
        ctaLink.textContent = page.hero.cta_text;
        ctaLink.href = page.hero.cta_link;
      }
    }
  }
  
  // Cards section
  const cards = document.querySelectorAll('.grid-2 .card');
  
  if (cards.length >= 1 && page.formats) {
    const formatsCard = cards[0];
    const title = formatsCard.querySelector('h3');
    const list = formatsCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.formats.title;
    if (list) {
      list.innerHTML = page.formats.items.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  if (cards.length >= 2 && page.procedure) {
    const procedureCard = cards[1];
    const title = procedureCard.querySelector('h3');
    const list = procedureCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.procedure.title;
    if (list) {
      list.innerHTML = page.procedure.items.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  console.log('✅ Services organizations page content loaded');
}

/**
 * Load approach page content
 */
async function loadApproachContent(content) {
  if (!content.approach) return;
  
  const page = content.approach;
  console.log('🔄 Loading approach page content...');
  
  // Hero section
  if (page.hero) {
    const hero = document.querySelector('.hero .container');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const title = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      
      if (eyebrow) eyebrow.textContent = page.hero.eyebrow;
      if (title) title.textContent = page.hero.title;
      if (lead) lead.textContent = page.hero.lead;
    }
  }
  
  // Principles section
  if (page.principles) {
    const sections = document.querySelectorAll('section');
    const principlesSection = Array.from(sections).find(s => 
      s.querySelector('.grid-3') && s.querySelectorAll('.grid-3 .card').length === 3
    );
    
    if (principlesSection) {
      const grid = principlesSection.querySelector('.grid-3');
      if (grid) {
        grid.innerHTML = page.principles.map(item => `
          <div class="card">
            <h3>${item.title}</h3>
            <p class="muted">${item.description}</p>
          </div>
        `).join('');
      }
    }
  }
  
  // Framework and Methods section
  const cards = document.querySelectorAll('.grid-2 .card');
  
  if (cards.length >= 1 && page.framework) {
    const frameworkCard = cards[0];
    const title = frameworkCard.querySelector('h3');
    const list = frameworkCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.framework.title;
    if (list) {
      list.innerHTML = page.framework.items.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  if (cards.length >= 2 && page.methods) {
    const methodsCard = cards[1];
    const title = methodsCard.querySelector('h3');
    const list = methodsCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.methods.title;
    if (list) {
      list.innerHTML = page.methods.items.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  console.log('✅ Approach page content loaded');
}

/**
 * Load about page content
 */
async function loadAboutContent(content) {
  if (!content.about) return;
  
  const page = content.about;
  console.log('🔄 Loading about page content...');
  
  // Hero section
  if (page.hero) {
    const hero = document.querySelector('.hero .container');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const title = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      
      if (eyebrow) eyebrow.textContent = page.hero.eyebrow;
      if (title) title.textContent = page.hero.name;
      if (lead) lead.textContent = page.hero.lead;
    }
  }
  
  // Cards section
  const cards = document.querySelectorAll('.grid-2 .card');
  
  if (cards.length >= 1 && page.biography) {
    const bioCard = cards[0];
    const title = bioCard.querySelector('h3');
    const text = bioCard.querySelector('p.muted');
    const list = bioCard.querySelector('.feature-list');
    
    if (title) title.textContent = page.biography.title;
    if (text) text.textContent = page.biography.text;
    if (list) {
      list.innerHTML = page.biography.qualifications.map(item => `<li>${item}</li>`).join('');
    }
  }
  
  if (cards.length >= 2 && page.working_style) {
    const workCard = cards[1];
    const titles = workCard.querySelectorAll('h3');
    const lists = workCard.querySelectorAll('.feature-list');
    const text = workCard.querySelector('p.muted');
    const ctaLink = workCard.querySelector('a.btn');
    
    if (titles.length >= 1) titles[0].textContent = page.working_style.title;
    if (lists.length >= 1) {
      lists[0].innerHTML = page.working_style.items.map(item => `<li>${item}</li>`).join('');
    }
    if (titles.length >= 2) titles[1].textContent = page.working_style.attitude_title;
    if (text) text.textContent = page.working_style.attitude_text;
    if (ctaLink) {
      ctaLink.textContent = page.working_style.cta_text;
      ctaLink.href = page.working_style.cta_link;
    }
  }
  
  console.log('✅ About page content loaded');
}

/**
 * Load contact page content
 */
async function loadContactContent(content) {
  if (!content.contact) return;
  
  const page = content.contact;
  console.log('🔄 Loading contact page content...');
  
  // Hero section
  if (page.hero) {
    const hero = document.querySelector('.hero .container');
    if (hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const title = hero.querySelector('h1');
      const lead = hero.querySelector('.lead');
      
      if (eyebrow) eyebrow.textContent = page.hero.eyebrow;
      if (title) title.textContent = page.hero.title;
      if (lead) lead.textContent = page.hero.lead;
    }
  }
  
  // Contact info card
  if (page.contact_info) {
    const cards = document.querySelectorAll('.grid-2 .card');
    if (cards.length >= 1) {
      const contactCard = cards[0];
      const title = contactCard.querySelector('h3');
      const name = contactCard.querySelector('.muted');
      const links = contactCard.querySelectorAll('a');
      const infoText = contactCard.querySelector('p.muted');
      
      if (title) title.textContent = page.contact_info.title;
      if (name) name.textContent = page.contact_info.name;
      if (links.length >= 1) {
        links[0].textContent = page.contact_info.email;
        links[0].href = `mailto:${page.contact_info.email}`;
      }
      if (links.length >= 2) {
        links[1].textContent = page.contact_info.phone;
        links[1].href = `tel:${page.contact_info.phone}`;
      }
      if (infoText) infoText.textContent = page.contact_info.info_text;
    }
  }
  
  console.log('✅ Contact page content loaded');
}

/**
 * Detect current page and load appropriate content
 */
async function loadPageContent() {
  const content = await loadContent();
  if (!content) {
    console.log('⚠️ No content data available, using HTML fallback');
    return;
  }
  
  // Detect current page based on body class or URL
  const body = document.body;
  const path = window.location.pathname;
  
  if (body.classList.contains('page-individual') || path.includes('leistungen-einzel')) {
    await loadServicesIndividualContent(content);
  } else if (body.classList.contains('page-organizations') || path.includes('leistungen-organisationen')) {
    await loadServicesOrganizationsContent(content);
  } else if (body.classList.contains('page-approach') || path.includes('ansatz')) {
    await loadApproachContent(content);
  } else if (body.classList.contains('page-about') || path.includes('ueber-mich')) {
    await loadAboutContent(content);
  } else if (body.classList.contains('page-contact') || path.includes('kontakt')) {
    await loadContactContent(content);
  } else {
    // Default to home page
    await loadHomeContent(content);
  }
}

/**
 * Initialize CMS content loader
 */
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 CMS Loader initialized');
  
  // Load slider (home page only)
  if (document.querySelector('.slider-container')) {
    await loadSliderContent();
  }
  
  // Load page-specific content
  await loadPageContent();
});
