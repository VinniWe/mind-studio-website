/**
 * CMS Content Loader – v18
 * Lädt Inhalte aus JSON und befüllt die v18-HTML-Struktur
 */

let contentData = null;

async function loadContent() {
  if (contentData) return contentData;
  try {
    let res = await fetch('/data/content.json');
    if (!res.ok) res = await fetch('data/content.json');
    contentData = await res.json();
    return contentData;
  } catch (e) {
    console.warn('CMS content.json nicht geladen – HTML-Fallback aktiv', e);
    return null;
  }
}

/* ─── SLIDER ──────────────────────────────────────────────── */
async function loadSliderContent() {
  const slider = document.querySelector('.slider');
  const sliderWrap = document.querySelector('.slider-container');
  if (!slider) return;

  try {
    let res = await fetch('/data/slides.json');
    if (!res.ok) res = await fetch('data/slides.json');
    const slides = await res.json();

    const active = slides
      .filter(s => s.active !== false && (s.title || s.description))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (!active.length) return;

    slider.innerHTML = active.map((slide, i) => {
      const imgD = slide.image_desktop || '';
      const imgM = slide.image_mobile || imgD;
      return `
      <div class="slide" data-slide-index="${i}">
        <div class="slide-content">
          <div class="slide-image">
            ${imgD ? `<img src="${imgD}" alt="${slide.title || ''}" class="desktop-only">` : ''}
            ${imgM ? `<img src="${imgM}" alt="${slide.title || ''}" class="mobile-only">` : ''}
          </div>
          <div class="slide-text">
            ${slide.meta ? `<div class="eyebrow">${slide.meta}</div>` : ''}
            <h1 class="hero-title">${slide.title || ''}</h1>
            ${slide.subtitle ? `<h2 class="hero-subtitle">${slide.subtitle}</h2>` : ''}
            ${slide.description ? `<p class="lead">${slide.description}</p>` : ''}
            ${slide.cta_text ? `
              <div class="hero-cta">
                <a class="btn btn-primary" href="${slide.cta_link || '#'}">${slide.cta_text}</a>
              </div>` : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    const dots = document.querySelector('.slider-dots');
    const controls = document.querySelector('.slider-controls');

    if (active.length > 1) {
      if (dots) {
        dots.innerHTML = active.map((_, i) =>
          `<div class="slider-dot ${i === 0 ? 'active' : ''}"></div>`
        ).join('');
        dots.style.display = '';
      }
      if (controls) controls.style.display = '';
      if (sliderWrap && window.Slider) {
        setTimeout(() => new window.Slider(sliderWrap), 100);
      }
    } else {
      if (dots) dots.style.display = 'none';
      if (controls) controls.style.display = 'none';
    }
  } catch (e) {
    console.warn('Slider-Inhalte konnten nicht geladen werden', e);
  }
}

/* ─── GLOBALE EINSTELLUNGEN (Announcement Bar + Marquees) ─── */
async function loadGlobalSettings(content) {
  if (!content?.settings) return;
  const s = content.settings;

  // Announcement Bar
  const bar = s.announcement_bar;
  if (bar?.active) {
    const el = document.querySelector('.announcement-bar');
    if (el) el.innerHTML = `${bar.text} – <a href="${bar.link_url}">${bar.link_text}</a>`;
  }

  // Homepage: Laufband 1 (orange, nicht .alt)
  if (s.marquee_primary?.length) {
    const band = document.querySelector('.marquee-band:not(.alt)');
    fillMarqueeBand(band, s.marquee_primary);
  }

  // Homepage: Laufband 2 (dunkel, .alt)
  if (s.marquee_secondary?.length) {
    const band = document.querySelector('.marquee-band.alt');
    fillMarqueeBand(band, s.marquee_secondary);
  }
}

/* ─── STARTSEITE ──────────────────────────────────────────── */
async function loadHomeContent(content) {
  if (!content?.home) return;
  const home = content.home;

  // Statistiken
  if (home.stats) {
    const grid = document.querySelector('.stats-grid');
    if (grid) {
      grid.innerHTML = home.stats.map(s => `
        <blockquote class="stat-block">
          <p>${s.text}</p>
          <cite>${s.source}</cite>
        </blockquote>`).join('');
    }
  }

  // Angebot-Sektion
  if (home.services_section) {
    const s = home.services_section;
    const sec = document.querySelector('.section-services .container');
    if (sec) {
      const h2 = sec.querySelector('h2');
      const lead = sec.querySelector('.lead');
      if (h2) h2.textContent = s.title;
      if (lead) lead.textContent = s.subtitle;

      const grid = sec.querySelector('.grid-2');
      if (grid) {
        grid.innerHTML = `
          <a class="service-card" href="${s.individual.link}">
            <div class="eyebrow">${s.individual.eyebrow}</div>
            <h3>${s.individual.title}</h3>
            <p>${s.individual.description}</p>
          </a>
          <a class="service-card" href="${s.organizations.link}">
            <div class="eyebrow">${s.organizations.eyebrow}</div>
            <h3>${s.organizations.title}</h3>
            <p>${s.organizations.description}</p>
          </a>`;
      }
    }
  }

  // Approach-Grid (v18: .approach-grid mit .approach-item)
  if (home.approach_section) {
    const grid = document.querySelector('.approach-grid');
    if (grid) {
      grid.innerHTML = home.approach_section.map(item => `
        <div class="approach-item">
          <div class="approach-icon">${item.icon || '✦'}</div>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>`).join('');
    }
  }

  // Testimonials (v18: zentriertes Einzelzitat mit Dot-Nav)
  if (home.testimonials?.items?.length) {
    const items = home.testimonials.items;
    const quoteEl = document.getElementById('testimonial-quote');
    const citeEl  = document.getElementById('testimonial-cite');
    const navEl   = document.querySelector('.testimonial-nav');

    // Erstes Zitat einsetzen
    if (quoteEl) quoteEl.textContent = items[0].quote;
    if (citeEl)  citeEl.innerHTML = `${items[0].author}${items[0].role ? ' – ' + items[0].role : ''}`;

    // Dots neu rendern
    if (navEl) {
      navEl.innerHTML = items.map((_, i) =>
        `<button class="testimonial-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Testimonial ${i + 1}"></button>`
      ).join('');

      navEl.querySelectorAll('.testimonial-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const i = parseInt(dot.dataset.index);
          if (quoteEl) quoteEl.textContent = items[i].quote;
          if (citeEl)  citeEl.innerHTML = `${items[i].author}${items[i].role ? ' – ' + items[i].role : ''}`;
          navEl.querySelectorAll('.testimonial-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
        });
      });
    }
  }
}

/* ─── HELPER: Marquee-Band befüllen ──────────────────────── */
function fillMarqueeBand(band, items) {
  if (!band || !items?.length) return;
  const track = band.querySelector('.marquee-track');
  if (!track) return;
  // Duplizieren für nahtlose Endlosschleife
  const html = [...items, ...items].map(text =>
    `<div class="marquee-item">${text} <span class="marquee-sep">☺</span></div>`
  ).join('');
  track.innerHTML = html;
}

/* ─── HELPER: Page-Hero befüllen ─────────────────────────── */
function fillPageHero(hero) {
  // v18 nutzt .page-hero statt .hero
  const container = document.querySelector('.page-hero .container') ||
                    document.querySelector('.hero .container');
  if (!container || !hero) return;
  const eyebrow = container.querySelector('.eyebrow');
  const h1      = container.querySelector('h1');
  const lead    = container.querySelector('.lead');
  const cta     = container.querySelector('.hero-cta a, a.btn');
  if (eyebrow) eyebrow.textContent = hero.eyebrow || '';
  if (h1)      h1.textContent      = hero.name || hero.title || '';
  if (lead)    lead.textContent    = hero.lead || '';
  if (cta && hero.cta_text) {
    cta.textContent = hero.cta_text;
    if (hero.cta_link) cta.href = hero.cta_link;
  }
}

/* ─── EINZELPERSONEN ─────────────────────────────────────── */
async function loadServicesIndividualContent(content) {
  if (!content?.services_individual) return;
  const page = content.services_individual;

  fillPageHero(page.hero);
  fillMarqueeBand(document.querySelector('.marquee-band'), page.marquee_items);

  const cards = document.querySelectorAll('.grid-2 .card');
  if (cards[0] && page.concerns) {
    const h3   = cards[0].querySelector('h3');
    const list = cards[0].querySelector('.feature-list');
    if (h3) h3.textContent = page.concerns.title;
    if (list) list.innerHTML = page.concerns.items.map(i => `<li>${i}</li>`).join('');
  }
  if (cards[1] && page.process) {
    const h3   = cards[1].querySelector('h3');
    const list = cards[1].querySelector('.feature-list');
    if (h3) h3.textContent = page.process.title;
    if (list) list.innerHTML = page.process.items.map(i => `<li>${i}</li>`).join('');
  }
}

/* ─── ORGANISATIONEN ─────────────────────────────────────── */
async function loadServicesOrganizationsContent(content) {
  if (!content?.services_organizations) return;
  const page = content.services_organizations;

  fillPageHero(page.hero);
  fillMarqueeBand(document.querySelector('.marquee-band'), page.marquee_items);

  const cards = document.querySelectorAll('.grid-2 .card');
  if (cards[0] && page.formats) {
    const h3   = cards[0].querySelector('h3');
    const list = cards[0].querySelector('.feature-list');
    if (h3) h3.textContent = page.formats.title;
    if (list) list.innerHTML = page.formats.items.map(i => `<li>${i}</li>`).join('');
  }
  if (cards[1] && page.procedure) {
    const h3   = cards[1].querySelector('h3');
    const list = cards[1].querySelector('.feature-list');
    if (h3) h3.textContent = page.procedure.title;
    if (list) list.innerHTML = page.procedure.items.map(i => `<li>${i}</li>`).join('');
  }
}

/* ─── ANSATZ ──────────────────────────────────────────────── */
async function loadApproachContent(content) {
  if (!content?.approach) return;
  const page = content.approach;

  fillPageHero(page.hero);
  fillMarqueeBand(document.querySelector('.marquee-band'), page.marquee_items);

  // Prinzipien → approach-grid (v18)
  if (page.principles) {
    const grid = document.querySelector('.approach-grid');
    if (grid) {
      grid.innerHTML = page.principles.map(p => `
        <div class="approach-item">
          <div class="approach-icon">${p.icon || '✦'}</div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>`).join('');
    }
  }

  const cards = document.querySelectorAll('.grid-2 .card');
  if (cards[0] && page.framework) {
    const h3   = cards[0].querySelector('h3');
    const list = cards[0].querySelector('.feature-list');
    if (h3) h3.textContent = page.framework.title;
    if (list) list.innerHTML = page.framework.items.map(i => `<li>${i}</li>`).join('');
  }
  if (cards[1] && page.methods) {
    const h3   = cards[1].querySelector('h3');
    const list = cards[1].querySelector('.feature-list');
    if (h3) h3.textContent = page.methods.title;
    if (list) list.innerHTML = page.methods.items.map(i => `<li>${i}</li>`).join('');
  }
}

/* ─── ÜBER MICH ───────────────────────────────────────────── */
async function loadAboutContent(content) {
  if (!content?.about) return;
  const page = content.about;

  fillPageHero(page.hero);
  fillMarqueeBand(document.querySelector('.marquee-band'), page.marquee_items);

  // Profil-Foto (optional)
  if (page.hero?.photo) {
    const img = document.querySelector('.about-photo');
    if (img) { img.src = page.hero.photo; img.style.display = ''; }
  }

  const cards = document.querySelectorAll('.grid-2 .card');
  if (cards[0] && page.biography) {
    const h3   = cards[0].querySelector('h3');
    const text = cards[0].querySelector('p.muted');
    const list = cards[0].querySelector('.feature-list');
    if (h3)   h3.textContent   = page.biography.title;
    if (text) text.textContent = page.biography.text;
    if (list) list.innerHTML   = page.biography.qualifications.map(i => `<li>${i}</li>`).join('');
  }
  if (cards[1] && page.working_style) {
    const ws = page.working_style;
    const titles = cards[1].querySelectorAll('h3');
    const lists  = cards[1].querySelectorAll('.feature-list');
    const text   = cards[1].querySelector('p.muted');
    const cta    = cards[1].querySelector('a.btn');
    if (titles[0]) titles[0].textContent = ws.title;
    if (lists[0])  lists[0].innerHTML    = ws.items.map(i => `<li>${i}</li>`).join('');
    if (titles[1]) titles[1].textContent = ws.attitude_title;
    if (text)      text.textContent      = ws.attitude_text;
    if (cta)       { cta.textContent = ws.cta_text; cta.href = ws.cta_link || '#'; }
  }
}

/* ─── KONTAKT ─────────────────────────────────────────────── */
async function loadContactContent(content) {
  if (!content?.contact) return;
  const page = content.contact;

  fillPageHero(page.hero);

  if (page.contact_info) {
    const ci    = page.contact_info;
    const cards = document.querySelectorAll('.grid-2 .card');
    if (cards[0]) {
      const h3    = cards[0].querySelector('h3');
      const name  = cards[0].querySelector('.muted');
      const links = cards[0].querySelectorAll('a');
      const info  = cards[0].querySelector('p.muted');
      if (h3)      h3.textContent      = ci.title;
      if (name)    name.textContent    = ci.name;
      if (links[0]) { links[0].textContent = ci.email; links[0].href = `mailto:${ci.email}`; }
      if (links[1]) { links[1].textContent = ci.phone; links[1].href = `tel:${ci.phone}`; }
      if (info)    info.textContent    = ci.info_text;
    }
  }
}

/* ─── ROUTING ─────────────────────────────────────────────── */
async function loadPageContent() {
  const content = await loadContent();
  if (!content) return;

  // Globale Einstellungen (Announcement Bar etc.)
  await loadGlobalSettings(content);

  const cls  = document.body.className;
  const path = window.location.pathname;

  if (cls.includes('page-individual') || path.includes('leistungen-einzel'))
    return loadServicesIndividualContent(content);
  if (cls.includes('page-organizations') || path.includes('leistungen-organisationen'))
    return loadServicesOrganizationsContent(content);
  if (cls.includes('page-approach') || path.includes('ansatz'))
    return loadApproachContent(content);
  if (cls.includes('page-about') || path.includes('ueber-mich'))
    return loadAboutContent(content);
  if (cls.includes('page-contact') || path.includes('kontakt'))
    return loadContactContent(content);

  return loadHomeContent(content);
}

/* ─── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  if (document.querySelector('.slider-container')) await loadSliderContent();
  await loadPageContent();
});
