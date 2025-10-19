// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', () => {
const expandButtons = document.querySelectorAll('.expand-btn');
expandButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const details = button.nextElementSibling; // the .timeline-description
    details.classList.toggle('hidden');
    button.textContent = details.classList.contains('hidden') 
      ? 'Show More' 
      : 'Show Less';
  });
});
  
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('skillsSlider');
    const skillCards = slider.querySelectorAll('.skill-category');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
  
    let currentIndex = 0;
    const totalCards = skillCards.length;  // e.g. 5
    const cardsPerView = 3;               // we want 3 visible at once on desktop
    
    // Max index is how many times we can shift before running out of cards
    // e.g. if we have 5 cards and 3 per view, last index is 5 - 3 = 2
    const maxIndex = totalCards - cardsPerView; // 2
  
    // We'll measure actual card width (including gap) to get precise slides:
    function getCardWidth() {
      // Because we have a gap of 20px in the CSS, add it.
      // offsetWidth is the actual card width including padding/border.
      const cardWidth = skillCards[0].offsetWidth + 20;
      return cardWidth;
    }
  
    function updateSlider() {
      const cardWidth = getCardWidth();
      // Slide track by currentIndex * cardWidth
      const translateX = -(currentIndex * cardWidth);
      slider.style.transform = `translateX(${translateX}px)`;
    }
  
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });
  
    // Initialize
    updateSlider();
  });

// Analytics Counter Functionality
class PortfolioAnalytics {
  constructor() {
    this.totalViews = this.getStoredValue('totalViews', 1247);
    this.todayViews = this.getStoredValue('todayViews', 23);
    this.totalClicks = this.getStoredValue('totalClicks', 156);
    this.lastVisitDate = this.getStoredValue('lastVisitDate', '');
    
    this.init();
  }
  
  init() {
    this.updateCounters();
    this.trackPageView();
    this.setupEventTracking();
    this.animateCounters();
  }
  
  getStoredValue(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? parseInt(stored) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  
  setStoredValue(key, value) {
    try {
      localStorage.setItem(key, value.toString());
    } catch (e) {
      console.log('LocalStorage not available');
    }
  }
  
  updateCounters() {
    const today = new Date().toDateString();
    
    // Check if this is a new day
    if (this.lastVisitDate !== today) {
      this.todayViews = 1;
      this.lastVisitDate = today;
    } else {
      this.todayViews++;
    }
    
    this.totalViews++;
    
    // Store updated values
    this.setStoredValue('totalViews', this.totalViews);
    this.setStoredValue('todayViews', this.todayViews);
    this.setStoredValue('lastVisitDate', this.lastVisitDate);
  }
  
  trackPageView() {
    // Track page view with Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }
  
  trackClick(element, action) {
    this.totalClicks++;
    this.setStoredValue('totalClicks', this.totalClicks);
    
    // Update counter display
    this.animateCounter('totalClicks', this.totalClicks);
    
    // Track with Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'engagement',
        event_label: action,
        value: this.totalClicks
      });
    }
  }
  
  setupEventTracking() {
    // Track project card clicks
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        this.trackClick(card, 'project_view');
      });
    });
    
    // Track button clicks
    document.querySelectorAll('.btn, .expand-btn, .flip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.trackClick(btn, 'button_click');
      });
    });
    
    // Track social media clicks
    document.querySelectorAll('.footer-social a').forEach(link => {
      link.addEventListener('click', () => {
        this.trackClick(link, 'social_click');
      });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        this.trackClick(link, 'navigation_click');
      });
    });
  }
  
  animateCounters() {
    this.animateCounter('totalViews', this.totalViews);
    this.animateCounter('todayViews', this.todayViews);
    this.animateCounter('totalClicks', this.totalClicks);
  }
  
  animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 1000; // 1 second
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
      
      element.textContent = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// Flag to prevent double initialization
let analyticsInitialized = false;

// Wait for Google Analytics to load before initializing custom analytics
function waitForGoogleAnalytics() {
  if (typeof gtag !== 'undefined' && !analyticsInitialized) {
    // Google Analytics is ready, initialize our custom analytics
    window.portfolioAnalytics = new PortfolioAnalytics();
    analyticsInitialized = true;
  } else if (!analyticsInitialized) {
    // Google Analytics not ready yet, wait a bit more
    setTimeout(waitForGoogleAnalytics, 100);
  }
}

// Fallback: Initialize analytics after 3 seconds even if Google Analytics isn't ready
setTimeout(() => {
  if (!analyticsInitialized) {
    // Google Analytics still not ready, initialize anyway
    window.portfolioAnalytics = new PortfolioAnalytics();
    analyticsInitialized = true;
  }
}, 3000);

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Start checking for Google Analytics availability
  waitForGoogleAnalytics();
});
