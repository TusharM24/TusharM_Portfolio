// SCROLL PROGRESS
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  scrollProgress.style.width = (pct * 100) + '%';
});

// HEADER SCROLL EFFECT
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// HAMBURGER / MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const navLinks = document.getElementById('nav-links');

function buildOverlay() {
  mobileOverlay.innerHTML = '';
  navLinks.querySelectorAll('li').forEach(li => {
    const clone = li.cloneNode(true);
    mobileOverlay.appendChild(clone);
    clone.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  });
}

function openMenu() {
  buildOverlay();
  mobileOverlay.classList.add('active');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileOverlay.classList.remove('active');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => mobileOverlay.classList.contains('active') ? closeMenu() : openMenu());
mobileOverlay.addEventListener('click', e => { if (e.target === mobileOverlay) closeMenu(); });

// TYPEWRITER
const roles = ['AI Engineer', 'ML Engineer'];
const tw = document.getElementById('typewriter');
let ri = 0, ci = 0, deleting = false;

function type() {
  const word = roles[ri];
  tw.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
  deleting ? ci-- : ci++;
  if (!deleting && ci === word.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
  if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(type, deleting ? 55 : 95);
}
type();

// SCROLL REVEAL
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ACTIVE NAV
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

// EXPERIENCE EXPAND
document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    const open = !details.classList.contains('hidden');
    details.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', !open);
    btn.querySelector('span').textContent = open ? 'Responsibilities' : 'Hide';
  });
});

// BACK TO TOP
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// WEB3FORMS
function initWeb3Forms() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    formMessage.style.display = 'none';
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    if (formData.get('botcheck')) { showMsg(formMessage, 'Spam detected.', 'error'); resetBtn(btnText, btnLoading, submitBtn); return; }

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg(formMessage, "Thank you! Your message has been sent. I'll get back to you soon.", 'success');
        form.reset();
        if (typeof gtag !== 'undefined') gtag('event', 'form_submission', { event_category: 'contact' });
      } else {
        showMsg(formMessage, data.message || 'Error sending. Please try again.', 'error');
      }
    } catch { showMsg(formMessage, 'Network error. Check your connection.', 'error'); }
    finally { resetBtn(btnText, btnLoading, submitBtn); }
  });
}

function showMsg(el, text, type) {
  el.textContent = text; el.className = 'form-message ' + type; el.style.display = 'block';
  if (type === 'success') setTimeout(() => { el.style.display = 'none'; }, 5000);
}
function resetBtn(t, l, b) { t.style.display = 'inline'; l.style.display = 'none'; b.disabled = false; }

// ANALYTICS
class PortfolioAnalytics {
  constructor() {
    this.views = this.get('totalViews', 1247);
    this.today = this.get('todayViews', 23);
    this.clicks = this.get('totalClicks', 156);
    this.lastDate = localStorage.getItem('lastDate') || '';
    this.init();
  }
  get(k, d) { try { const v = localStorage.getItem(k); return v ? parseInt(v) : d; } catch { return d; } }
  set(k, v) { try { localStorage.setItem(k, v.toString()); } catch {} }

  init() {
    const today = new Date().toDateString();
    if (this.lastDate !== today) { this.today = 1; this.lastDate = today; } else { this.today++; }
    this.views++;
    this.set('totalViews', this.views); this.set('todayViews', this.today); this.set('lastDate', this.lastDate);
    this.animate('totalViews', this.views);
    this.animate('todayViews', this.today);
    this.animate('totalClicks', this.clicks);
    this.track();
  }

  animate(id, target) {
    const el = document.getElementById(id); if (!el) return;
    const start = parseInt(el.textContent.replace(/,/g, '')) || 0;
    const t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1000, 1);
      el.textContent = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 4))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  trackClick(action) {
    this.clicks++; this.set('totalClicks', this.clicks);
    this.animate('totalClicks', this.clicks);
    if (typeof gtag !== 'undefined') gtag('event', 'click', { event_category: 'engagement', event_label: action });
  }

  track() {
    document.querySelectorAll('.project-card, .featured-project').forEach(el => el.addEventListener('click', () => this.trackClick('project')));
    document.querySelectorAll('.btn, .expand-btn, .flip-btn').forEach(el => el.addEventListener('click', () => this.trackClick('button')));
    document.querySelectorAll('.footer-socials a, .hero-socials a').forEach(el => el.addEventListener('click', () => this.trackClick('social')));
    document.querySelectorAll('.nav-link').forEach(el => el.addEventListener('click', () => this.trackClick('nav')));
  }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initWeb3Forms();
  let done = false;
  function startAnalytics() { if (!done) { window.portfolioAnalytics = new PortfolioAnalytics(); done = true; } }
  function waitGA() { if (typeof gtag !== 'undefined') startAnalytics(); else if (!done) setTimeout(waitGA, 100); }
  waitGA();
  setTimeout(startAnalytics, 3000);
  if (typeof gtag !== 'undefined') gtag('event', 'page_view', { page_title: document.title, page_location: window.location.href });
});
