(() => {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }
})();

// Slider functionality
class Slider {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.slide');
    this.prevBtn = container.querySelector('.slider-btn[data-direction="prev"]');
    this.nextBtn = container.querySelector('.slider-btn[data-direction="next"]');
    this.dots = container.querySelectorAll('.slider-dot');
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000; // 5 seconds
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    this.updateSlider();
    this.bindEvents();
    this.startAutoPlay();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Pause auto-play on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/swipe support
    let startX = 0;
    let endX = 0;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    this.container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
    });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  updateSlider() {
    const translateX = -this.currentIndex * 100;
    const slider = this.container.querySelector('.slider');
    slider.style.transform = `translateX(${translateX}%)`;

    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });

    // Update button states
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
    }
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentIndex = index;
      this.updateSlider();
    }
  }

  startAutoPlay() {
    if (this.slides.length <= 1) return;
    
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      if (this.currentIndex === this.slides.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
      this.updateSlider();
    }, this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Responsive image loader
class ResponsiveImageLoader {
  static isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static createResponsiveImage(slideData, baseUrl = '') {
    if (!slideData.images) return null;

    const isMobile = this.isMobile();
    const imageUrl = isMobile && slideData.images.mobile ? slideData.images.mobile : slideData.images.desktop;
    
    if (!imageUrl) return null;

    const img = document.createElement('img');
    img.src = baseUrl + imageUrl;
    img.alt = slideData.title || '';
    img.className = isMobile && slideData.images.mobile ? 'mobile-only' : 'desktop-only';
    img.loading = 'lazy';
    
    // Fallback: if mobile image fails to load and we have desktop image
    if (isMobile && slideData.images.desktop) {
      img.addEventListener('error', () => {
        if (slideData.images.desktop) {
          img.src = baseUrl + slideData.images.desktop;
          img.className = 'desktop-only';
        }
      });
    }

    return img;
  }

  static updateSliderImages(sliderContainer, slidesData, baseUrl = '') {
    const slideImages = sliderContainer.querySelectorAll('.slide-image');
    
    slideImages.forEach((imageContainer, index) => {
      if (slidesData[index] && slidesData[index].images) {
        // Clear existing images
        imageContainer.innerHTML = '';
        
        // Create responsive image
        const img = this.createResponsiveImage(slidesData[index], baseUrl);
        if (img) {
          imageContainer.appendChild(img);
        }
      }
    });
  }
}

// Enhanced Slider class with responsive images
class ResponsiveSlider extends Slider {
  constructor(container, apiUrl = '') {
    super(container);
    this.apiUrl = apiUrl;
    this.slidesData = [];
    this.loadSlidesFromAPI();
  }

  async loadSlidesFromAPI() {
    try {
      const response = await fetch(`${this.apiUrl}/api/slider`);
      const slides = await response.json();
      
      // Filter active slides and sort by order
      this.slidesData = slides
        .filter(slide => slide.active)
        .sort((a, b) => a.order - b.order);
      
      this.updateSliderWithAPI();
    } catch (error) {
      console.warn('Could not load slides from API, using static content:', error);
    }
  }

  updateSliderWithAPI() {
    if (this.slidesData.length === 0) return;

    const slider = this.container.querySelector('.slider');
    if (!slider) return;

    // Update slide count
    this.slides = slider.querySelectorAll('.slide');
    
    // Update responsive images
    ResponsiveImageLoader.updateSliderImages(this.container, this.slidesData, this.apiUrl);
    
    // Update dots if needed
    this.updateDots();
  }

  updateDots() {
    if (this.slidesData.length !== this.dots.length) {
      // Recreate dots if slide count changed
      const dotsContainer = this.container.querySelector('.slider-dots');
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < this.slidesData.length; i++) {
          const dot = document.createElement('div');
          dot.className = 'slider-dot';
          dot.addEventListener('click', () => this.goToSlide(i));
          dotsContainer.appendChild(dot);
        }
        this.dots = this.container.querySelectorAll('.slider-dot');
      }
    }
    
    super.updateSlider();
  }
}

// Initialize slider when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    // Check if we have API URL (for dynamic content)
    const apiUrl = sliderContainer.dataset.apiUrl || '';
    
    if (apiUrl) {
      new ResponsiveSlider(sliderContainer, apiUrl);
    } else {
      new Slider(sliderContainer);
    }
  }
});



