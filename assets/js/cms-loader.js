// CMS Content Loader for Mind Studio
// This script can load content from the PHP CMS backend

class CMSLoader {
    constructor() {
        this.apiBase = '/backend/api.php';
        this.useCMS = false; // Set to true to enable CMS integration
    }

    async loadSliderContent() {
        if (!this.useCMS) {
            return null; // Use static HTML content
        }

        try {
            const response = await fetch(`${this.apiBase}?action=slider`);
            if (response.ok) {
                const slides = await response.json();
                return slides;
            }
        } catch (error) {
            console.warn('Failed to load CMS slider content, using static content:', error);
        }
        return null;
    }

    async loadHomepageContent() {
        if (!this.useCMS) {
            return null; // Use static HTML content
        }

        try {
            const response = await fetch(`${this.apiBase}?action=homepage`);
            if (response.ok) {
                const content = await response.json();
                return content;
            }
        } catch (error) {
            console.warn('Failed to load CMS homepage content, using static content:', error);
        }
        return null;
    }

    // Update slider with CMS content
    async updateSlider() {
        const slides = await this.loadSliderContent();
        if (!slides || slides.length === 0) {
            return; // Keep static content
        }

        const sliderContainer = document.querySelector('.slider');
        if (!sliderContainer) return;

        // Clear existing slides
        sliderContainer.innerHTML = '';

        // Create new slides from CMS data
        slides.forEach((slideData, index) => {
            const slideElement = this.createSlideElement(slideData, index);
            sliderContainer.appendChild(slideElement);
        });

        // Update dots
        this.updateSliderDots(slides.length);

        // Reinitialize slider if needed
        if (window.Slider) {
            new window.Slider(document.querySelector('.slider-container'));
        }
    }

    createSlideElement(slideData, index) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <div class="slide-content">
                <div class="slide-image">
                    ${this.createResponsiveImage(slideData)}
                </div>
                <div class="slide-text">
                    ${slideData.meta ? `<div class="slide-meta">${slideData.meta}</div>` : ''}
                    <h1 class="hero-title">${slideData.title}</h1>
                    ${slideData.subtitle ? `<h2 class="hero-subtitle">${slideData.subtitle}</h2>` : ''}
                    ${slideData.description ? `<p class="lead">${slideData.description}</p>` : ''}
                    <div class="hero-cta">
                        <a class="btn btn-primary" href="${this.getSlideCTA(index)}">${this.getSlideCTAText(index)}</a>
                    </div>
                </div>
            </div>
        `;
        return slide;
    }

    createResponsiveImage(slideData) {
        const desktopImg = slideData.image_desktop ? `/uploads/${slideData.image_desktop}` : '';
        const mobileImg = slideData.image_mobile ? `/uploads/${slideData.image_mobile}` : '';
        
        if (desktopImg && mobileImg) {
            return `
                <img src="${desktopImg}" alt="${slideData.title}" class="desktop-only">
                <img src="${mobileImg}" alt="${slideData.title}" class="mobile-only">
            `;
        } else if (desktopImg) {
            return `<img src="${desktopImg}" alt="${slideData.title}">`;
        } else if (mobileImg) {
            return `<img src="${mobileImg}" alt="${slideData.title}">`;
        } else {
            // Fallback to placeholder
            return `<img src="assets/img/slider-placeholder-${index + 1}.svg" alt="${slideData.title}">`;
        }
    }

    updateSliderDots(count) {
        const dotsContainer = document.querySelector('.slider-dots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            if (i === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        }
    }

    getSlideCTA(index) {
        const ctas = [
            'mailto:hello@mind-studio.me',
            'leistungen-einzel.html',
            'leistungen-organisationen.html'
        ];
        return ctas[index] || '#';
    }

    getSlideCTAText(index) {
        const texts = [
            'Erstgespräch Buchen',
            'Mehr erfahren',
            'Mehr erfahren'
        ];
        return texts[index] || 'Mehr erfahren';
    }

    // Update homepage content
    async updateHomepage() {
        const content = await this.loadHomepageContent();
        if (!content) return;

        // Update stats
        if (content.stats) {
            this.updateStats(content.stats);
        }

        // Update services section
        if (content.services) {
            this.updateServices(content.services);
        }
    }

    updateStats(stats) {
        const statsContainer = document.querySelector('.stats-grid');
        if (!statsContainer || !stats) return;

        const statBlocks = statsContainer.querySelectorAll('.stat-block');
        stats.forEach((stat, index) => {
            if (statBlocks[index]) {
                const p = statBlocks[index].querySelector('p strong');
                const cite = statBlocks[index].querySelector('cite');
                if (p) p.textContent = stat.text;
                if (cite) cite.textContent = stat.source;
            }
        });
    }

    updateServices(services) {
        // Update services section content
        if (services.title) {
            const titleEl = document.querySelector('.services-section h2');
            if (titleEl) titleEl.textContent = services.title;
        }

        if (services.subtitle) {
            const subtitleEl = document.querySelector('.services-section p');
            if (subtitleEl) subtitleEl.textContent = services.subtitle;
        }

        // Update individual services
        if (services.individual) {
            this.updateServiceCard('.services-grid a[href*="leistungen-einzel"]', services.individual);
        }

        if (services.organizations) {
            this.updateServiceCard('.services-grid a[href*="leistungen-organisationen"]', services.organizations);
        }
    }

    updateServiceCard(selector, serviceData) {
        const card = document.querySelector(selector);
        if (!card) return;

        if (serviceData.title) {
            const metaEl = card.querySelector('.eyebrow');
            if (metaEl) metaEl.textContent = serviceData.title;
        }

        if (serviceData.heading) {
            const headingEl = card.querySelector('h3');
            if (headingEl) headingEl.textContent = serviceData.heading;
        }

        if (serviceData.description) {
            const descEl = card.querySelector('p');
            if (descEl) descEl.textContent = serviceData.description;
        }
    }

    // Initialize CMS integration
    async init() {
        if (!this.useCMS) {
            console.log('CMS integration disabled, using static content');
            return;
        }

        console.log('Loading content from CMS...');
        
        // Update slider
        await this.updateSlider();
        
        // Update homepage content
        await this.updateHomepage();
        
        console.log('CMS content loaded successfully');
    }
}

// Initialize CMS loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const cmsLoader = new CMSLoader();
    
    // Enable CMS integration by setting useCMS to true
    // cmsLoader.useCMS = true;
    
    cmsLoader.init();
});

// Make CMSLoader available globally for manual initialization
window.CMSLoader = CMSLoader;
