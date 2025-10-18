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
