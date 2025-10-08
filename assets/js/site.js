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

// Initialize slider when DOM is ready
// NOTE: Slider initialization is now handled by cms-loader.js
// This ensures CMS content loads first, then slider initializes
document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    // Only initialize if CMS loader hasn't already done it
    // Wait a bit to let CMS loader run first
    setTimeout(() => {
      if (!sliderContainer.dataset.initialized) {
        console.log('🎯 Initializing slider from site.js (fallback)');
        const apiUrl = sliderContainer.dataset.apiUrl || '';
        
        if (apiUrl) {
          new ResponsiveSlider(sliderContainer, apiUrl);
        } else {
          new Slider(sliderContainer);
        }
        sliderContainer.dataset.initialized = 'true';
      }
    }, 500); // Wait for CMS loader
  }
});



