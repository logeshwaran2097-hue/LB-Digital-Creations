// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');

  setTimeout(() => {
    loader.classList.add('hidden');
    // Remove loader from DOM after fade-out so it doesn't block clicks
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  }, 1800);
});

// ===== DETECT MOBILE / TOUCH DEVICE =====
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// ===== CUSTOM CURSOR (Desktop only) =====
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (!isMobile && dot && ring) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let cursorActive = false;
  const trails = [];
  const TRAIL_COUNT = 8;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
  }

  document.addEventListener('mousemove', (e) => {
    if (!cursorActive) {
      document.body.classList.add('custom-cursor-active');
      cursorActive = true;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX - 4 + 'px';
    dot.style.top = mouseY - 4 + 'px';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX - 20 + 'px';
    ring.style.top = ringY - 20 + 'px';

    let prevX = mouseX, prevY = mouseY;
    trails.forEach((t, i) => {
      t.x += (prevX - t.x) * (0.3 - i * 0.025);
      t.y += (prevY - t.y) * (0.3 - i * 0.025);
      t.el.style.left = t.x - 2.5 + 'px';
      t.el.style.top = t.y - 2.5 + 'px';
      t.el.style.opacity = (1 - i / TRAIL_COUNT) * 0.5;
      t.el.style.transform = `scale(${1 - i / TRAIL_COUNT})`;
      prevX = t.x;
      prevY = t.y;
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effect on interactive elements
  document.querySelectorAll('a, button, .service-card, .stat-card, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = isMobile ? 25 : 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(201, 168, 76, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const curr = window.scrollY;
  navbar.classList.toggle('scrolled', curr > 50);
  // Only auto-hide navbar on desktop — on mobile it's confusing
  if (!isMobile) {
    if (curr > lastScroll && curr > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  }
  lastScroll = curr;
});

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * ease) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ===== MAGNETIC BUTTONS (Desktop only) =====
if (!isMobile) {
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ===== TILT EFFECT ON SERVICE CARDS (Desktop only) =====
if (!isMobile) {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Don't block plain "#" links (logo/home)
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu and reset hamburger icon
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
});

// ===== TEXT TYPING EFFECT =====
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  const words = [
    'Celebration Websites',
    'Royal Wedding Portals',
    'Milestone Birthday Sites',
    'Golden Anniversary Tributes',
    'Interactive VIP Invitations',
    'Digital Moment Heirlooms'
  ];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function typeEffect() {
    const current = words[wordIndex];
    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(typeEffect, 40);
    } else {
      typingEl.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1800);
      } else {
        setTimeout(typeEffect, 90);
      }
    }
  }
  typeEffect();
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    
    // Close all other items for clean single-accordion experience
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    
    if (!wasActive) {
      item.classList.add('active');
    }
  });
});

// ===== LUXURY TOAST HELPER =====
function showLuxuryToast(message) {
  const toast = document.getElementById('luxury-toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ========================================================
// 50 BESPOKE CELEBRATION TEMPLATES DATASET
// ========================================================
const TEMPLATES_DATA = [
  {
    "id": "royal-maharaja-wedding",
    "title": "Royal Maharaja Wedding",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Royal Luxury",
    "badgeClass": "royal",
    "icon": "👑",
    "bgGradient": "linear-gradient(135deg, #780206, #061161)",
    "colors": [
      "#d4af37",
      "#800020",
      "#1a0b2e"
    ],
    "rating": "4.9 ★",
    "desc": "Grand Indian palace wedding theme featuring ornate gold filigree, shehnai background score, auspicious muhurtham countdown, and Google Maps venue.",
    "features": [
      "Ornate Golden Crest",
      "Orchestral Shehnai Audio",
      "Live RSVP via WhatsApp",
      "Venue Google Maps",
      "4K Gallery Grid"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Ananya & Karthik",
      "date": "Saturday, December 19, 2026 • Grand Palace Ballroom",
      "subheading": "We request the honor of your gracious presence as we embark upon the sacred journey of holy matrimony surrounded by loved ones.",
      "musicTitle": "Royal Shehnai & Sitar Symphonic Raga",
      "story": "From our very first conversation over filter coffee to realizing that our souls had found their eternal home, every moment brought us here.",
      "author": "— Forever & Always",
      "portraitIcon": "👑👰🤵",
      "portraitBadge": "Royal Couple",
      "venueName": "The Leela Grand Palace, Ballroom Hall",
      "venueAddress": "Adyar Seaface Road, MRC Nagar, Chennai, Tamil Nadu",
      "itinerary": [
        {
          "time": "08:30 AM",
          "title": "Baraat Grand Procession",
          "desc": "Traditional dhol procession and welcome ceremony"
        },
        {
          "time": "10:15 AM",
          "title": "Auspicious Muhurtham",
          "desc": "Sacred Vedic wedding vows & mangalsutra ceremony"
        },
        {
          "time": "12:30 PM",
          "title": "Royal Traditional Sadya Feast",
          "desc": "Grand authentic wedding banquet"
        },
        {
          "time": "07:00 PM",
          "title": "Evening Reception & Musical Gala",
          "desc": "Stage congratulations, live music & dinner"
        }
      ]
    }
  },
  {
    "id": "minimal-champagne-rose",
    "title": "Minimal Champagne & Rose",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Trending",
    "badgeClass": "trending",
    "icon": "🥂",
    "bgGradient": "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "colors": [
      "#f5d0c5",
      "#d4af37",
      "#ffffff"
    ],
    "rating": "4.9 ★",
    "desc": "Soft blush pink & champagne editorial layout. Clean typography, bridal party portraits, and digital RSVP confirmation.",
    "features": [
      "Editorial Serif Typography",
      "Bridal Party Showcase",
      "Countdown Timer",
      "Gift Registry Link",
      "Photo Timeline"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "tuscan-vineyard-nuptials",
    "title": "Tuscan Vineyard Nuptials",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Bestseller",
    "badgeClass": "bestseller",
    "icon": "🍇",
    "bgGradient": "linear-gradient(135deg, #2c3e50, #27ae60)",
    "colors": [
      "#556b2f",
      "#d4af37",
      "#e8d8c8"
    ],
    "rating": "5.0 ★",
    "desc": "Warm rustic vineyard celebration with acoustic melody, dinner menu preview, and travel guide for out-of-town guests.",
    "features": [
      "Rustic Olive & Gold Palette",
      "Acoustic Audio Player",
      "Interactive Dinner Menu",
      "Accommodations Guide",
      "Guestbook"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "modern-monochrome-vows",
    "title": "Modern Monochrome Vows",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Vogue Style",
    "badgeClass": "royal",
    "icon": "🖤",
    "bgGradient": "linear-gradient(135deg, #1f1c2c, #928dab)",
    "colors": [
      "#000000",
      "#ffffff",
      "#c5a059"
    ],
    "rating": "4.8 ★",
    "desc": "High-fashion editorial aesthetic inspired by Vogue. Sleek monochrome with golden accents and full-width parallax imagery.",
    "features": [
      "Parallax Photo Reveal",
      "High-Fashion Aesthetic",
      "Interactive Vows Player",
      "Instant RSVP",
      "Social Tag Feed"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "emerald-royalty-gala",
    "title": "Emerald Royalty Gala",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Exclusive",
    "badgeClass": "royal",
    "icon": "✨",
    "bgGradient": "linear-gradient(135deg, #051937, #008793)",
    "colors": [
      "#046307",
      "#d4af37",
      "#0f2b1d"
    ],
    "rating": "4.9 ★",
    "desc": "Deep emerald velvet and polished gold accents. Perfect for grand destination weddings and luxury evening receptions.",
    "features": [
      "Emerald Velvet Shimmer",
      "Reception Itinerary",
      "Dress Code Guide",
      "Digital Wish Wall",
      "Live Stream Link"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "golden-palace-vivah",
    "title": "Golden Palace Vivah",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Traditional Gold",
    "badgeClass": "bestseller",
    "icon": "🪔",
    "bgGradient": "linear-gradient(135deg, #ff4e50, #f9d423)",
    "colors": [
      "#ffd700",
      "#ff0033",
      "#4a0e17"
    ],
    "rating": "5.0 ★",
    "desc": "Traditional Vedic ceremony motifs, auspicious muhurtham countdown, live wedding stream embedding, and family blessings tree.",
    "features": [
      "Vedic Shloka Background",
      "Muhurtham Countdown",
      "Live YouTube Stream Embed",
      "Family Tree Blessings",
      "Haldi/Sangeet Events"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "sunset-beachfront-romance",
    "title": "Sunset Beachfront Romance",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Popular",
    "badgeClass": "trending",
    "icon": "🌅",
    "bgGradient": "linear-gradient(135deg, #fa709a, #fee140)",
    "colors": [
      "#ff7e5f",
      "#feb47b",
      "#0072ff"
    ],
    "rating": "4.9 ★",
    "desc": "Sun-drenched coastal tones, wave breeze ambient audio, beach dress code guide, and resort directions.",
    "features": [
      "Coastal Wave Audio FX",
      "Resort Itinerary",
      "Beach Attire Guide",
      "Interactive RSVP",
      "Sunset Photo Deck"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "celestial-starry-night",
    "title": "Celestial Starry Night Wedding",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Dreamy",
    "badgeClass": "royal",
    "icon": "🌌",
    "bgGradient": "linear-gradient(135deg, #0f2027, #2c5364)",
    "colors": [
      "#0f172a",
      "#38bdf8",
      "#fbbf24"
    ],
    "rating": "4.9 ★",
    "desc": "Constellation sky animation, custom starry love story timeline, and luminescent lanterns guest wishes.",
    "features": [
      "Constellation Animations",
      "Twinkling Stardust Theme",
      "Romantic Audio Track",
      "Lantern Guestbook",
      "Event Map"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "vintage-victorian-knot",
    "title": "Vintage Victorian Knot",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Classic",
    "badgeClass": "bestseller",
    "icon": "📜",
    "bgGradient": "linear-gradient(135deg, #3a1c71, #d76d77)",
    "colors": [
      "#4b2e39",
      "#d4af37",
      "#fdfbf7"
    ],
    "rating": "4.8 ★",
    "desc": "Antique cursive calligraphy, interactive wax seal opening effect, lace filigree borders, and heartfelt letters.",
    "features": [
      "Wax Seal Break Animation",
      "Antique Script Typography",
      "Romantic Photo Frame",
      "Ceremony Order of Events",
      "RSVP Pass"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "bohemian-meadow-vows",
    "title": "Bohemian Meadow Celebration",
    "category": "wedding",
    "categoryLabel": "Wedding",
    "badge": "Organic",
    "badgeClass": "trending",
    "icon": "🌾",
    "bgGradient": "linear-gradient(135deg, #d38312, #a83279)",
    "colors": [
      "#c2a688",
      "#e87a5d",
      "#3f4e4f"
    ],
    "rating": "4.9 ★",
    "desc": "Earth tones, dried pampas grass florals, polaroid photo slider, and embedded Spotify playlist link.",
    "features": [
      "Polaroid Photo Reel",
      "Spotify Playlist Widget",
      "Interactive RSVP",
      "Festival Style Timeline",
      "Direction Map"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Meera & Siddharth",
      "date": "Sunday, February 14, 2027 • Emerald Coastline Estate",
      "subheading": "Two hearts, one lifelong promise. Join us as we exchange vows under the open skies and celebrate the start of forever.",
      "musicTitle": "Acoustic Strings & Soft Cello Harmony",
      "story": "A journey of boundless laughter, shared dreams, and finding peace in one another's presence.",
      "author": "— With Endless Love",
      "portraitIcon": "💍🌸",
      "portraitBadge": "Bride & Groom",
      "venueName": "The Emerald Coastline Estate",
      "venueAddress": "East Coast Road, Kovalam, Chennai",
      "itinerary": [
        {
          "time": "04:30 PM",
          "title": "Sunset Vow Exchange",
          "desc": "Ceremony by the beach with ocean breeze"
        },
        {
          "time": "06:00 PM",
          "title": "Cocktail Hour & Jazz Trio",
          "desc": "Hors d'oeuvres and acoustic melodies"
        },
        {
          "time": "07:30 PM",
          "title": "First Dance & Dinner Banquet",
          "desc": "Celebratory feast and heartfelt toasts"
        }
      ]
    }
  },
  {
    "id": "romantic-birthday-magic",
    "title": "Romantic Birthday Wonderland",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Viral Sensation",
    "badgeClass": "trending",
    "icon": "🎂",
    "bgGradient": "linear-gradient(135deg, #ff758c 0%, #ff7eb3 50%, #7afcff 100%)",
    "colors": [
      "#ff477e",
      "#ffd166",
      "#7b2cbf"
    ],
    "rating": "5.0 ★",
    "desc": "Interactive 3D cake cutting with candle blow-out, pop-up wishing balloons, polaroid memory lane, secret love letter reveal, and celebration audio.",
    "features": [
      "3D Candle Blow-Out",
      "Pop Wishing Balloons",
      "Polaroid Memory Lane",
      "Secret Love Letter",
      "Confetti & Fireworks FX"
    ],
    "animationType": "animated",
    "liveDemoUrl": "birthday-magic.html",
    "demo": {
      "celebrants": "Happy Birthday, My Love",
      "date": "A Very Special Day Sculpted With Love ✨",
      "subheading": "Every single moment with you is a celebration, but today is especially magical. Welcome to your personalized digital wonderland!",
      "musicTitle": "Romantic Birthday Melody & Chords",
      "story": "On this extraordinary day that the universe chose to bring you into the world, my heart is overflowing with love and gratitude.",
      "author": "— Forever Your Biggest Fan ❤️",
      "portraitIcon": "🎂💖",
      "portraitBadge": "Birthday Star",
      "venueName": "Grand Celebration Gala & Sunset Terrace",
      "venueAddress": "Adyar Seaface Road, MRC Nagar, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Welcome Mocktails & Polaroids",
          "desc": "Arrival photos & memory lane gallery"
        },
        {
          "time": "07:30 PM",
          "title": "Interactive Cake Cutting Ceremony",
          "desc": "Candle blow-out & confetti shower"
        },
        {
          "time": "08:30 PM",
          "title": "Pop Wishing Balloons Surprise",
          "desc": "Secret promise reveal and memory notes"
        },
        {
          "time": "09:30 PM",
          "title": "Grand Fireworks Finale",
          "desc": "Midnight starlight and celebration music"
        }
      ]
    }
  },
  {
    "id": "sweet-sixteen-sparkle",
    "title": "Sweet Sixteen Sparkle",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Trending",
    "badgeClass": "trending",
    "icon": "💖",
    "bgGradient": "linear-gradient(135deg, #ff9a9e, #fecfef)",
    "colors": [
      "#f43f5e",
      "#fb7185",
      "#d4af37"
    ],
    "rating": "4.9 ★",
    "desc": "Glitter particles, pastel pink and rose gold tones, 16 wishes submission box, and trendy Instagram photo reel.",
    "features": [
      "Confetti & Glitter Burst",
      "Birthday Wish Wall",
      "Party Music Player",
      "Party Outfit Dress Code",
      "Map to Venue"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Zara's Sweet Sixteen Gala",
      "date": "Saturday, November 28, 2026 • The Crystal Ballroom",
      "subheading": "Join us for an unforgettable evening of glitter, gourmet desserts, signature mocktails, and dancing under the chandeliers!",
      "musicTitle": "Sweet Sixteen Pop Anthem & Sparkle Beats",
      "story": "From early morning dance rehearsals to cherished laughs with friends, Zara is stepping into sixteen with radiant joy and big dreams.",
      "author": "— Forever 16 & Glowing",
      "portraitIcon": "🎂💖",
      "portraitBadge": "Sweet 16 Star",
      "venueName": "The Crystal Ballroom, Leela Palace",
      "venueAddress": "MRC Nagar, Raja Annamalaipuram, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Pink Carpet & Mocktail Welcome",
          "desc": "Arrival photos, glitter lounge & welcome drinks"
        },
        {
          "time": "07:30 PM",
          "title": "Zara's Grand Tiara Entrance",
          "desc": "Spotlight entrance, 16 wishes tributes"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Confetti Shower",
          "desc": "Sparklers, tiered cake cutting ceremony"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Dance Floor & Midnight Dessert",
          "desc": "Non-stop dance party & chocolate fountain"
        }
      ]
    }
  },
  {
    "id": "royal-18th-debutante",
    "title": "Royal 18th Debutante",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Luxury Debut",
    "badgeClass": "royal",
    "icon": "👑",
    "bgGradient": "linear-gradient(135deg, #667eea, #764ba2)",
    "colors": [
      "#7c3aed",
      "#d4af37",
      "#ffffff"
    ],
    "rating": "5.0 ★",
    "desc": "Regal violet & tiara celebration. 18 roses and 18 candles itinerary, grand entrance countdown, and gift registry.",
    "features": [
      "18 Roses/Candles Schedule",
      "Tiara Gold Accents",
      "VIP Entry QR Pass",
      "Guest Attendance Form",
      "Glamour Photo Grid"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Lady Miraya's Royal 18th Debut",
      "date": "Friday, December 11, 2026 • The Grand Regency Hall",
      "subheading": "An evening of imperial poise and distinction, honoring eighteen magnificent years as our beloved debutante enters adulthood.",
      "musicTitle": "Viennese Waltz & Royal String Quartet",
      "story": "Eighteen chapters of grace, brilliance, and tender kindness. Tonight we honor the 18 roses, the 18 candles, and a lifetime of high destiny.",
      "author": "— With Royal Splendor",
      "portraitIcon": "👑✨",
      "portraitBadge": "Debutante Princess",
      "venueName": "The Grand Regency Hall, Taj Coromandel",
      "venueAddress": "Nungambakkam High Road, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Grand Promenade & Arrival",
          "desc": "Formal gown red carpet arrival & chamber quartet"
        },
        {
          "time": "07:45 PM",
          "title": "The 18 Roses & 18 Candles",
          "desc": "Cherished traditional family presentations"
        },
        {
          "time": "08:45 PM",
          "title": "Debutante Father-Daughter Waltz",
          "desc": "Opening dance followed by royal banquet"
        },
        {
          "time": "10:00 PM",
          "title": "Celebratory Ball & Toasts",
          "desc": "Champagne flute toasts and open floor"
        }
      ]
    }
  },
  {
    "id": "golden-50th-jubilee",
    "title": "Golden 50th Jubilee",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Milestone",
    "badgeClass": "bestseller",
    "icon": "🏆",
    "bgGradient": "linear-gradient(135deg, #ffe259, #ffa751)",
    "colors": [
      "#ffd700",
      "#1c1917",
      "#e2e8f0"
    ],
    "rating": "5.0 ★",
    "desc": "Celebrating half a century of greatness! Retro life journey timeline from birth year to today with video tributes.",
    "features": [
      "50-Year Milestone Timeline",
      "Video Tribute Player",
      "Warm Family Photo Album",
      "Guest Blessings Book",
      "Party Details"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Rajesh Kumar • Golden 50th Milestone",
      "date": "Sunday, October 25, 2026 • Hyatt Regency Grand Ballroom",
      "subheading": "Honoring half a century of wisdom, boundless laughter, and mentorship. Five decades of an extraordinary journey!",
      "musicTitle": "Timeless 70s Classic Guitar & Soul",
      "story": "Fifty years of building family, founding dreams, and lighting the path for everyone around him with unwavering generosity.",
      "author": "— Half A Century Of Greatness",
      "portraitIcon": "🏆🥂",
      "portraitBadge": "Golden Legend",
      "venueName": "Hyatt Regency Grand Ballroom",
      "venueAddress": "Anna Salai, Teynampet, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Golden Retrospective Exhibition",
          "desc": "Archive photo gallery walk & welcome cocktails"
        },
        {
          "time": "07:30 PM",
          "title": "Life Milestones Video Premiere",
          "desc": "Heartfelt documentary by children & friends"
        },
        {
          "time": "08:15 PM",
          "title": "Golden Jubilee Cake & Toasts",
          "desc": "Speeches, golden cake cutting & blessings"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner & Acoustic Melodies",
          "desc": "Lavish buffet dinner with live music"
        }
      ]
    }
  },
  {
    "id": "neon-cyberpunk-bash",
    "title": "Neon Cyberpunk Bash",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Electric Modern",
    "badgeClass": "trending",
    "icon": "⚡",
    "bgGradient": "linear-gradient(135deg, #00f2fe, #4facfe)",
    "colors": [
      "#00f2fe",
      "#f43f5e",
      "#0f172a"
    ],
    "rating": "4.8 ★",
    "desc": "Glow-in-the-dark neon cyan and hot pink design. Animated beat-drop countdown, party playlist, and club venue map.",
    "features": [
      "Neon Glow Audio Player",
      "Futuristic Countdown",
      "DJ Lineup & Playlist",
      "1-Tap Location GPS",
      "WhatsApp RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "pastel-princess-wonderland",
    "title": "Pastel Princess Wonderland",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Cute & Magical",
    "badgeClass": "trending",
    "icon": "🦄",
    "bgGradient": "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    "colors": [
      "#f472b6",
      "#c084fc",
      "#fde047"
    ],
    "rating": "4.9 ★",
    "desc": "Floating balloons, magical castles, fairytale typography, and cute photo stickers for young princesses.",
    "features": [
      "Floating Balloon Physics",
      "Fairytale Storybook Frame",
      "Party Games Schedule",
      "Cake Cutting Countdown",
      "RSVP Form"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "vintage-gatsby-30th",
    "title": "Vintage Gatsby 30th",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Art Deco",
    "badgeClass": "bestseller",
    "icon": "🍸",
    "bgGradient": "linear-gradient(135deg, #232526, #414345)",
    "colors": [
      "#d4af37",
      "#000000",
      "#f5f5f5"
    ],
    "rating": "4.9 ★",
    "desc": "1920s Great Gatsby Roaring Twenties motif with gold geometric borders, speakeasy secret password RSVP, and jazz audio.",
    "features": [
      "Art Deco Gold Geometry",
      "Vintage Jazz Score",
      "Speakeasy Secret RSVP",
      "1920s Dress Code Guide",
      "Photo Booth Gallery"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "superhero-kid-adventure",
    "title": "Superhero Kid Adventure",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Kids Favorite",
    "badgeClass": "trending",
    "icon": "🦸‍♂️",
    "bgGradient": "linear-gradient(135deg, #eb3349, #f45c43)",
    "colors": [
      "#ef4444",
      "#3b82f6",
      "#fbbf24"
    ],
    "rating": "4.9 ★",
    "desc": "Comic-book burst explosions, action superhero badge icons, obstacle games schedule, and mission headquarters map.",
    "features": [
      "Comic Action Sound Effects",
      "Mission Headquarters Map",
      "Superhero Training Games",
      "Hero Badge Generator",
      "Party RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "galactic-space-odyssey",
    "title": "Galactic Space Odyssey",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Outer Space",
    "badgeClass": "royal",
    "icon": "🚀",
    "bgGradient": "linear-gradient(135deg, #141e30, #243b55)",
    "colors": [
      "#38bdf8",
      "#818cf8",
      "#0f172a"
    ],
    "rating": "4.8 ★",
    "desc": "Orbiting planets, nebula starlight, rocket launch countdown, and astronaut helmet photo frames.",
    "features": [
      "Orbiting Planetary Physics",
      "Launch Countdown Timer",
      "Cosmic Audio Ambience",
      "Astronaut Photo Wall",
      "Venue Coordinates"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "retro-90s-nostalgia",
    "title": "Retro 90s Nostalgia",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Funky Throwback",
    "badgeClass": "trending",
    "icon": "📼",
    "bgGradient": "linear-gradient(135deg, #ff0844, #ffb199)",
    "colors": [
      "#ec4899",
      "#06b6d4",
      "#eab308"
    ],
    "rating": "4.8 ★",
    "desc": "Retro cassette audio player, arcade pixel art, throwback childhood photos, and neon pop graphics.",
    "features": [
      "Cassette Tape Audio FX",
      "Arcade High Scores Board",
      "Childhood Memories Slider",
      "90s Dress Code",
      "WhatsApp RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "diamond-60th-celebration",
    "title": "Diamond 60th Jubilee",
    "category": "birthday",
    "categoryLabel": "Birthday",
    "badge": "Diamond Tier",
    "badgeClass": "bestseller",
    "icon": "💎",
    "bgGradient": "linear-gradient(135deg, #89f7fe, #66a6ff)",
    "colors": [
      "#e2e8f0",
      "#38bdf8",
      "#d4af37"
    ],
    "rating": "5.0 ★",
    "desc": "Diamond sparkles and platinum elegance honoring 60 remarkable years of wisdom, accomplishments, and family legacy.",
    "features": [
      "Diamond Shimmer Particles",
      "Life Legacy Showcase",
      "Family Video Tributes",
      "Grand Celebration Venue",
      "Blessings Guestbook"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Aarav's 25th Birthday Bash",
      "date": "Saturday, November 14, 2026 • Sky Lounge Terrace",
      "subheading": "Get ready for high energy, rooftop skyline views, signature cocktails, and non-stop music into the night!",
      "musicTitle": "Electropop Rooftop Sunset Beats",
      "story": "Twenty-five years of chasing passions, building brotherhood, and creating unforgettable memories.",
      "author": "— Ready For Year 25",
      "portraitIcon": "🎂⚡",
      "portraitBadge": "Birthday Star",
      "venueName": "The Sky Lounge & Terrace",
      "venueAddress": "100ft Road, Indiranagar, Bengaluru",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "Rooftop Welcome Drinks",
          "desc": "Cocktails, mocktails and sunset golden hour"
        },
        {
          "time": "08:30 PM",
          "title": "Cake Cutting & Fireworks",
          "desc": "Birthday cake cutting with sparkling candle flares"
        },
        {
          "time": "09:15 PM",
          "title": "DJ Set & Dance Floor",
          "desc": "Live DJ set and celebration feast"
        }
      ]
    }
  },
  {
    "id": "silver-25th-milestone",
    "title": "Silver 25th Milestone",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Milestone",
    "badgeClass": "bestseller",
    "icon": "💍",
    "bgGradient": "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    "colors": [
      "#e2e8f0",
      "#94a3b8",
      "#d4af37"
    ],
    "rating": "5.0 ★",
    "desc": "Polished silver accents, crisp pearl white typography, 25 years of love timeline, and renewal of vows details.",
    "features": [
      "Silver Leaf Styling",
      "25-Year Love Timeline",
      "Vow Renewal Schedule",
      "Couples Love Letter",
      "Family Wishes Wall"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "golden-50th-eternity",
    "title": "Golden 50th Eternity",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Royal Gold",
    "badgeClass": "royal",
    "icon": "🏆",
    "bgGradient": "linear-gradient(135deg, #f7971e, #ffd200)",
    "colors": [
      "#ffd700",
      "#d4af37",
      "#1a0d00"
    ],
    "rating": "5.0 ★",
    "desc": "Celebration of 50 years of timeless unity. Radiant golden jubilee palette, multigenerational family tree, and video reel.",
    "features": [
      "24k Gold Crest Aesthetic",
      "Generational Family Tree",
      "Golden Memories Scrapbook",
      "Audio Anniversary Song",
      "Dinner Reception RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "ruby-40th-romance",
    "title": "Ruby 40th Romance",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Luxury",
    "badgeClass": "royal",
    "icon": "❤️",
    "bgGradient": "linear-gradient(135deg, #e52d27, #b31217)",
    "colors": [
      "#991b1b",
      "#d4af37",
      "#fef2f2"
    ],
    "rating": "4.9 ★",
    "desc": "Deep crimson ruby aesthetic, heart-warming love letter section, before & after 40 years photo comparison slider.",
    "features": [
      "Ruby Red Velvet Finish",
      "Before & Now Photo Slider",
      "Children & Grandkids Note",
      "Event Schedule",
      "Venue Directions"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "paris-whispers-couple",
    "title": "Paris Whispers Couple Story",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Romantic",
    "badgeClass": "trending",
    "icon": "🗼",
    "bgGradient": "linear-gradient(135deg, #485563, #29323c)",
    "colors": [
      "#fda4af",
      "#f8fafc",
      "#d4af37"
    ],
    "rating": "4.9 ★",
    "desc": "French romantic ambience, Eiffel Tower fairy lights, personalized love audio track, and memories photo journal.",
    "features": [
      "Fairy Lights Ambience",
      "French Accordion Melody",
      "Paris Memories Journal",
      "Romantic Timeline",
      "Celebration Dinner Map"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "candlelight-memory-lane",
    "title": "Candlelight Memory Lane",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Heartwarming",
    "badgeClass": "bestseller",
    "icon": "🕯️",
    "bgGradient": "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    "colors": [
      "#fbbf24",
      "#f59e0b",
      "#18181b"
    ],
    "rating": "4.9 ★",
    "desc": "Soft glowing candle lanterns animation, heartfelt anniversary milestones, and glowing digital wish submission.",
    "features": [
      "Flickering Candle Animations",
      "Interactive Wish Lanterns",
      "Acoustic Love Song",
      "Photo Scrapbook",
      "RSVP Attendance"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "endless-horizon-journey",
    "title": "Endless Horizon Journey",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Travel Theme",
    "badgeClass": "trending",
    "icon": "✈️",
    "bgGradient": "linear-gradient(135deg, #13547a, #80d0c7)",
    "colors": [
      "#0284c7",
      "#38bdf8",
      "#d4af37"
    ],
    "rating": "4.8 ★",
    "desc": "Interactive world map with pinned locations visited as a couple over the years, flight boarding pass RSVP styling.",
    "features": [
      "Interactive Travel Pin Map",
      "Boarding Pass Style RSVP",
      "Travel Photography Gallery",
      "Trip Memories Timeline",
      "Anniversary Gala Details"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "classic-cinema-romance",
    "title": "Classic Cinema Romance",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Vintage Film",
    "badgeClass": "royal",
    "icon": "🎬",
    "bgGradient": "linear-gradient(135deg, #283048, #859398)",
    "colors": [
      "#18181b",
      "#d4af37",
      "#f4f4f5"
    ],
    "rating": "4.9 ★",
    "desc": "Vintage Hollywood movie poster layout, romantic film reel animation, premiere countdown, and red carpet RSVP.",
    "features": [
      "Vintage Film Reel Effects",
      "Movie Poster Hero Frame",
      "Premiere Date Countdown",
      "Red Carpet Dress Code",
      "Digital Wishes Board"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "enchanted-forest-love",
    "title": "Enchanted Forest Love",
    "category": "anniversary",
    "categoryLabel": "Anniversary",
    "badge": "Earthy Luxury",
    "badgeClass": "trending",
    "icon": "🌿",
    "bgGradient": "linear-gradient(135deg, #134e5e, #71b280)",
    "colors": [
      "#14532d",
      "#86efac",
      "#d4af37"
    ],
    "rating": "4.9 ★",
    "desc": "Mystical forest canopy, glowing fireflies, deep moss & gold hues celebrating years of blooming love together.",
    "features": [
      "Floating Fireflies FX",
      "Botanical Gold Framing",
      "Love Story Chapter Book",
      "Photo Forest Gallery",
      "Celebration Location Map"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Vikram & Sneha • Silver 25th Milestone",
      "date": "Sunday, January 10, 2027 • The Heritage Courtyard",
      "subheading": "25 years of unconditional love, shared laughter, raising a wonderful family, and standing strong side-by-side.",
      "musicTitle": "Romantic Nostalgia & Acoustic Romance",
      "story": "Quarter of a century ago we promised to stand together through every storm and sunshine. Today, our hearts beat with even greater gratitude.",
      "author": "— 25 Years of Bliss",
      "portraitIcon": "💍🥂",
      "portraitBadge": "Silver Couple",
      "venueName": "The Heritage Courtyard, Taj Connemara",
      "venueAddress": "Binny Road, Triplicane, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Renewal of Vows",
          "desc": "Exchanging renewed silver rings with family"
        },
        {
          "time": "07:45 PM",
          "title": "25-Year Love Story Video",
          "desc": "Memories retrospective spanning 1999 to 2026"
        },
        {
          "time": "08:30 PM",
          "title": "Silver Jubilee Feast & Toasts",
          "desc": "Dinner banquet and cake cutting"
        }
      ]
    }
  },
  {
    "id": "ring-under-the-stars",
    "title": "Ring Under The Stars",
    "category": "engagement",
    "categoryLabel": "Engagement",
    "badge": "Bestseller",
    "badgeClass": "bestseller",
    "icon": "💍",
    "bgGradient": "linear-gradient(135deg, #141e30, #243b55)",
    "colors": [
      "#38bdf8",
      "#d4af37",
      "#0f172a"
    ],
    "rating": "5.0 ★",
    "desc": "Twinkling constellation background, proposal spotlight video, 3D ring reveal effect, and engagement party RSVP.",
    "features": [
      "Ring Reveal Zoom Effect",
      "Proposal Video Spotlight",
      "Engagement Countdown",
      "Gift Wishes Registry",
      "Google Maps Venue"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aditya & Diya",
      "date": "Friday, December 4, 2026 • The Starlight Terrace",
      "subheading": "She said YES! We are thrilled to invite you to celebrate our engagement and the beginning of our forever journey together.",
      "musicTitle": "Enchanting Acoustic Guitar & Piano Melody",
      "story": "Under a blanket of stars overlooking the city skyline, the question was popped, tears flowed, and forever was promised.",
      "author": "— Officially Engaged",
      "portraitIcon": "💍✨",
      "portraitBadge": "Newly Engaged",
      "venueName": "The Starlight Terrace & Lounge",
      "venueAddress": "Alwarpet, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Welcome Drinks & Ring Reveal",
          "desc": "Arrival cocktail lounge and congratulations"
        },
        {
          "time": "07:45 PM",
          "title": "Traditional Ring Ceremony",
          "desc": "Ring exchange and elders' blessings"
        },
        {
          "time": "08:45 PM",
          "title": "Dinner Buffet & Celebration",
          "desc": "Gourmet multi-cuisine dinner & music"
        }
      ]
    }
  },
  {
    "id": "paris-rooftop-proposal",
    "title": "Paris Rooftop Proposal",
    "category": "engagement",
    "categoryLabel": "Engagement",
    "badge": "Trending",
    "badgeClass": "trending",
    "icon": "🥂",
    "bgGradient": "linear-gradient(135deg, #f857a6, #ff5858)",
    "colors": [
      "#f43f5e",
      "#fda4af",
      "#d4af37"
    ],
    "rating": "4.9 ★",
    "desc": "Sunset rooftop skyline, champagne toast glasses animation, official \"She Said Yes!\" banner, and event details.",
    "features": [
      "\"She Said Yes!\" Banner",
      "Champagne Toast Clink FX",
      "Proposal Photo Album",
      "Ring Details Showcase",
      "WhatsApp RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aditya & Diya",
      "date": "Friday, December 4, 2026 • The Starlight Terrace",
      "subheading": "She said YES! We are thrilled to invite you to celebrate our engagement and the beginning of our forever journey together.",
      "musicTitle": "Enchanting Acoustic Guitar & Piano Melody",
      "story": "Under a blanket of stars overlooking the city skyline, the question was popped, tears flowed, and forever was promised.",
      "author": "— Officially Engaged",
      "portraitIcon": "💍✨",
      "portraitBadge": "Newly Engaged",
      "venueName": "The Starlight Terrace & Lounge",
      "venueAddress": "Alwarpet, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Welcome Drinks & Ring Reveal",
          "desc": "Arrival cocktail lounge and congratulations"
        },
        {
          "time": "07:45 PM",
          "title": "Traditional Ring Ceremony",
          "desc": "Ring exchange and elders' blessings"
        },
        {
          "time": "08:45 PM",
          "title": "Dinner Buffet & Celebration",
          "desc": "Gourmet multi-cuisine dinner & music"
        }
      ]
    }
  },
  {
    "id": "secret-garden-engagement",
    "title": "Secret Garden Ring Ceremony",
    "category": "engagement",
    "categoryLabel": "Engagement",
    "badge": "Floral",
    "badgeClass": "trending",
    "icon": "🌸",
    "bgGradient": "linear-gradient(135deg, #ffafbd, #ffc3a0)",
    "colors": [
      "#ec4899",
      "#10b981",
      "#fef08a"
    ],
    "rating": "4.8 ★",
    "desc": "Blooming garden roses, lush greenery framing, romantic engagement ceremony schedule, and venue itinerary.",
    "features": [
      "Blooming Rose Transitions",
      "Ceremony Schedule Guide",
      "Attire & Dress Code",
      "Family Blessings Section",
      "1-Click RSVP"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Aditya & Diya",
      "date": "Friday, December 4, 2026 • The Starlight Terrace",
      "subheading": "She said YES! We are thrilled to invite you to celebrate our engagement and the beginning of our forever journey together.",
      "musicTitle": "Enchanting Acoustic Guitar & Piano Melody",
      "story": "Under a blanket of stars overlooking the city skyline, the question was popped, tears flowed, and forever was promised.",
      "author": "— Officially Engaged",
      "portraitIcon": "💍✨",
      "portraitBadge": "Newly Engaged",
      "venueName": "The Starlight Terrace & Lounge",
      "venueAddress": "Alwarpet, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Welcome Drinks & Ring Reveal",
          "desc": "Arrival cocktail lounge and congratulations"
        },
        {
          "time": "07:45 PM",
          "title": "Traditional Ring Ceremony",
          "desc": "Ring exchange and elders' blessings"
        },
        {
          "time": "08:45 PM",
          "title": "Dinner Buffet & Celebration",
          "desc": "Gourmet multi-cuisine dinner & music"
        }
      ]
    }
  },
  {
    "id": "sunset-yacht-proposal",
    "title": "Sunset Yacht Ring Ceremony",
    "category": "engagement",
    "categoryLabel": "Engagement",
    "badge": "Luxury",
    "badgeClass": "royal",
    "icon": "⛵",
    "bgGradient": "linear-gradient(135deg, #2b5876, #4e4376)",
    "colors": [
      "#0284c7",
      "#f59e0b",
      "#d4af37"
    ],
    "rating": "4.9 ★",
    "desc": "Golden hour ocean waves, luxury yacht atmosphere, evening cocktail reception details, and harbor location GPS.",
    "features": [
      "Golden Hour Horizon Light",
      "Cocktail Menu Preview",
      "Harbor Coordinates & Map",
      "Sunset Party Playlist",
      "Instant RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Aditya & Diya",
      "date": "Friday, December 4, 2026 • The Starlight Terrace",
      "subheading": "She said YES! We are thrilled to invite you to celebrate our engagement and the beginning of our forever journey together.",
      "musicTitle": "Enchanting Acoustic Guitar & Piano Melody",
      "story": "Under a blanket of stars overlooking the city skyline, the question was popped, tears flowed, and forever was promised.",
      "author": "— Officially Engaged",
      "portraitIcon": "💍✨",
      "portraitBadge": "Newly Engaged",
      "venueName": "The Starlight Terrace & Lounge",
      "venueAddress": "Alwarpet, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Welcome Drinks & Ring Reveal",
          "desc": "Arrival cocktail lounge and congratulations"
        },
        {
          "time": "07:45 PM",
          "title": "Traditional Ring Ceremony",
          "desc": "Ring exchange and elders' blessings"
        },
        {
          "time": "08:45 PM",
          "title": "Dinner Buffet & Celebration",
          "desc": "Gourmet multi-cuisine dinner & music"
        }
      ]
    }
  },
  {
    "id": "royal-regal-engagement",
    "title": "Royal Regal Engagement Saga",
    "category": "engagement",
    "categoryLabel": "Engagement",
    "badge": "Royal Gold",
    "badgeClass": "royal",
    "icon": "👑",
    "bgGradient": "linear-gradient(135deg, #4b134f, #c94b4b)",
    "colors": [
      "#581c87",
      "#d4af37",
      "#fef08a"
    ],
    "rating": "5.0 ★",
    "desc": "Traditional royal engagement shagun aesthetic with gold crests, auspicious muhurtham card, and family blessings.",
    "features": [
      "Traditional Shagun Motif",
      "Auspicious Muhurtham Clock",
      "Family Introductions",
      "Engagement Photo Gallery",
      "Reception Details"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Aditya & Diya",
      "date": "Friday, December 4, 2026 • The Starlight Terrace",
      "subheading": "She said YES! We are thrilled to invite you to celebrate our engagement and the beginning of our forever journey together.",
      "musicTitle": "Enchanting Acoustic Guitar & Piano Melody",
      "story": "Under a blanket of stars overlooking the city skyline, the question was popped, tears flowed, and forever was promised.",
      "author": "— Officially Engaged",
      "portraitIcon": "💍✨",
      "portraitBadge": "Newly Engaged",
      "venueName": "The Starlight Terrace & Lounge",
      "venueAddress": "Alwarpet, Chennai",
      "itinerary": [
        {
          "time": "06:30 PM",
          "title": "Welcome Drinks & Ring Reveal",
          "desc": "Arrival cocktail lounge and congratulations"
        },
        {
          "time": "07:45 PM",
          "title": "Traditional Ring Ceremony",
          "desc": "Ring exchange and elders' blessings"
        },
        {
          "time": "08:45 PM",
          "title": "Dinner Buffet & Celebration",
          "desc": "Gourmet multi-cuisine dinner & music"
        }
      ]
    }
  },
  {
    "id": "little-prince-arrival",
    "title": "Little Prince Royal Arrival",
    "category": "babyshower",
    "categoryLabel": "Baby Shower",
    "badge": "Trending",
    "badgeClass": "trending",
    "icon": "👶",
    "bgGradient": "linear-gradient(135deg, #2193b0, #6dd5ed)",
    "colors": [
      "#38bdf8",
      "#d4af37",
      "#ffffff"
    ],
    "rating": "4.9 ★",
    "desc": "Royal blue & gold crown motif welcoming the baby boy. Baby milestone countdown, ultrasound photo, and registry.",
    "features": [
      "Royal Prince Crown Motif",
      "Ultrasound Photo Spotlight",
      "Baby Shower Countdown",
      "Baby Gift Wishlist",
      "Venue Google Map"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Welcoming Baby Aarohi • Mom & Dad Kavya & Arjun",
      "date": "Sunday, November 22, 2026 • The Blossom Pavilion",
      "subheading": "A little bundle of joy is on the way! Join us as we shower mom-to-be and dad-to-be with love, laughter, and blessings.",
      "musicTitle": "Gentle Lullaby & Acoustic Chimes",
      "story": "Ten little fingers, ten little toes, and a love that grows every single day. We cannot wait to welcome our angel into this world.",
      "author": "— With Joyful Anticipation",
      "portraitIcon": "👶🍼",
      "portraitBadge": "Parents-To-Be",
      "venueName": "The Blossom Pavilion",
      "venueAddress": "Besant Nagar, Chennai",
      "itinerary": [
        {
          "time": "04:00 PM",
          "title": "Welcome & High Tea Refreshments",
          "desc": "Pastries, mocktails, and photobooth snapshots"
        },
        {
          "time": "05:15 PM",
          "title": "Baby Shower Games & Polls",
          "desc": "Fun guessing games, baby bingo, and advice cards"
        },
        {
          "time": "06:30 PM",
          "title": "Blessings Ceremony & Gift Reveal",
          "desc": "Traditional blessings followed by dinner"
        }
      ]
    }
  },
  {
    "id": "cloud-rainbow-dream",
    "title": "Cloud & Rainbow Dream",
    "category": "babyshower",
    "categoryLabel": "Baby Shower",
    "badge": "Cute & Whimsical",
    "badgeClass": "trending",
    "icon": "🌈",
    "bgGradient": "linear-gradient(135deg, #a8edea, #fed6e3)",
    "colors": [
      "#fb7185",
      "#38bdf8",
      "#fef08a"
    ],
    "rating": "4.9 ★",
    "desc": "Whimsical pastel clouds, floating hot air balloons, lullaby music player, and adorable baby shower games.",
    "features": [
      "Floating Clouds & Balloon FX",
      "Gentle Lullaby Audio",
      "Baby Shower Games Guide",
      "Baby Wishes Guestbook",
      "RSVP Pass"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Welcoming Baby Aarohi • Mom & Dad Kavya & Arjun",
      "date": "Sunday, November 22, 2026 • The Blossom Pavilion",
      "subheading": "A little bundle of joy is on the way! Join us as we shower mom-to-be and dad-to-be with love, laughter, and blessings.",
      "musicTitle": "Gentle Lullaby & Acoustic Chimes",
      "story": "Ten little fingers, ten little toes, and a love that grows every single day. We cannot wait to welcome our angel into this world.",
      "author": "— With Joyful Anticipation",
      "portraitIcon": "👶🍼",
      "portraitBadge": "Parents-To-Be",
      "venueName": "The Blossom Pavilion",
      "venueAddress": "Besant Nagar, Chennai",
      "itinerary": [
        {
          "time": "04:00 PM",
          "title": "Welcome & High Tea Refreshments",
          "desc": "Pastries, mocktails, and photobooth snapshots"
        },
        {
          "time": "05:15 PM",
          "title": "Baby Shower Games & Polls",
          "desc": "Fun guessing games, baby bingo, and advice cards"
        },
        {
          "time": "06:30 PM",
          "title": "Blessings Ceremony & Gift Reveal",
          "desc": "Traditional blessings followed by dinner"
        }
      ]
    }
  },
  {
    "id": "starlight-twinkle-baby",
    "title": "Starlight Twinkle Baby",
    "category": "babyshower",
    "categoryLabel": "Baby Shower",
    "badge": "Dreamy",
    "badgeClass": "bestseller",
    "icon": "⭐",
    "bgGradient": "linear-gradient(135deg, #2c3e50, #3498db)",
    "colors": [
      "#facc15",
      "#93c5fd",
      "#1e293b"
    ],
    "rating": "4.8 ★",
    "desc": "\"Twinkle Twinkle Little Star\" theme with gender reveal countdown, baby name guessing poll, and celebratory gallery.",
    "features": [
      "Twinkling Star Animations",
      "Baby Name Guessing Poll",
      "Gender Reveal Countdown",
      "Parents-to-Be Message",
      "Event Map"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Welcoming Baby Aarohi • Mom & Dad Kavya & Arjun",
      "date": "Sunday, November 22, 2026 • The Blossom Pavilion",
      "subheading": "A little bundle of joy is on the way! Join us as we shower mom-to-be and dad-to-be with love, laughter, and blessings.",
      "musicTitle": "Gentle Lullaby & Acoustic Chimes",
      "story": "Ten little fingers, ten little toes, and a love that grows every single day. We cannot wait to welcome our angel into this world.",
      "author": "— With Joyful Anticipation",
      "portraitIcon": "👶🍼",
      "portraitBadge": "Parents-To-Be",
      "venueName": "The Blossom Pavilion",
      "venueAddress": "Besant Nagar, Chennai",
      "itinerary": [
        {
          "time": "04:00 PM",
          "title": "Welcome & High Tea Refreshments",
          "desc": "Pastries, mocktails, and photobooth snapshots"
        },
        {
          "time": "05:15 PM",
          "title": "Baby Shower Games & Polls",
          "desc": "Fun guessing games, baby bingo, and advice cards"
        },
        {
          "time": "06:30 PM",
          "title": "Blessings Ceremony & Gift Reveal",
          "desc": "Traditional blessings followed by dinner"
        }
      ]
    }
  },
  {
    "id": "royal-cradle-naming",
    "title": "Royal Cradle Naming Ceremony",
    "category": "babyshower",
    "categoryLabel": "Baby Shower",
    "badge": "Traditional",
    "badgeClass": "royal",
    "icon": "🪔",
    "bgGradient": "linear-gradient(135deg, #f12711, #f5af19)",
    "colors": [
      "#b91c1c",
      "#d4af37",
      "#fef3c7"
    ],
    "rating": "5.0 ★",
    "desc": "Traditional Indian naming ceremony (Namakaran) with silk cradle motifs, Vedic blessings, and family tree greetings.",
    "features": [
      "Traditional Cradle Motif",
      "Name Reveal Card",
      "Vedic Blessing Audio Track",
      "Family Tree Introductions",
      "Muhurtham Timing"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Welcoming Baby Aarohi • Mom & Dad Kavya & Arjun",
      "date": "Sunday, November 22, 2026 • The Blossom Pavilion",
      "subheading": "A little bundle of joy is on the way! Join us as we shower mom-to-be and dad-to-be with love, laughter, and blessings.",
      "musicTitle": "Gentle Lullaby & Acoustic Chimes",
      "story": "Ten little fingers, ten little toes, and a love that grows every single day. We cannot wait to welcome our angel into this world.",
      "author": "— With Joyful Anticipation",
      "portraitIcon": "👶🍼",
      "portraitBadge": "Parents-To-Be",
      "venueName": "The Blossom Pavilion",
      "venueAddress": "Besant Nagar, Chennai",
      "itinerary": [
        {
          "time": "04:00 PM",
          "title": "Welcome & High Tea Refreshments",
          "desc": "Pastries, mocktails, and photobooth snapshots"
        },
        {
          "time": "05:15 PM",
          "title": "Baby Shower Games & Polls",
          "desc": "Fun guessing games, baby bingo, and advice cards"
        },
        {
          "time": "06:30 PM",
          "title": "Blessings Ceremony & Gift Reveal",
          "desc": "Traditional blessings followed by dinner"
        }
      ]
    }
  },
  {
    "id": "sweet-blossom-welcoming",
    "title": "Sweet Blossom Baby Shower",
    "category": "babyshower",
    "categoryLabel": "Baby Shower",
    "badge": "Floral",
    "badgeClass": "trending",
    "icon": "🌸",
    "bgGradient": "linear-gradient(135deg, #fbc2eb, #a18cd1)",
    "colors": [
      "#ec4899",
      "#a855f7",
      "#d4af37"
    ],
    "rating": "4.9 ★",
    "desc": "Delicate watercolor peony blossoms, mom & dad love letter, gift registry links, and afternoon tea party schedule.",
    "features": [
      "Watercolor Peony Floral Frame",
      "Mom & Dad Heartfelt Note",
      "Afternoon High Tea Itinerary",
      "Baby Registry Link",
      "RSVP Submission"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Welcoming Baby Aarohi • Mom & Dad Kavya & Arjun",
      "date": "Sunday, November 22, 2026 • The Blossom Pavilion",
      "subheading": "A little bundle of joy is on the way! Join us as we shower mom-to-be and dad-to-be with love, laughter, and blessings.",
      "musicTitle": "Gentle Lullaby & Acoustic Chimes",
      "story": "Ten little fingers, ten little toes, and a love that grows every single day. We cannot wait to welcome our angel into this world.",
      "author": "— With Joyful Anticipation",
      "portraitIcon": "👶🍼",
      "portraitBadge": "Parents-To-Be",
      "venueName": "The Blossom Pavilion",
      "venueAddress": "Besant Nagar, Chennai",
      "itinerary": [
        {
          "time": "04:00 PM",
          "title": "Welcome & High Tea Refreshments",
          "desc": "Pastries, mocktails, and photobooth snapshots"
        },
        {
          "time": "05:15 PM",
          "title": "Baby Shower Games & Polls",
          "desc": "Fun guessing games, baby bingo, and advice cards"
        },
        {
          "time": "06:30 PM",
          "title": "Blessings Ceremony & Gift Reveal",
          "desc": "Traditional blessings followed by dinner"
        }
      ]
    }
  },
  {
    "id": "woodland-safari-nursery",
    "title": "Woodland Safari Nursery",
    "category": "babyshower",
    "categoryLabel": "Baby Shower",
    "badge": "Playful",
    "badgeClass": "trending",
    "icon": "🦁",
    "bgGradient": "linear-gradient(135deg, #56ab2f, #a8e063)",
    "colors": [
      "#15803d",
      "#eab308",
      "#78350f"
    ],
    "rating": "4.9 ★",
    "desc": "Adorable baby jungle animal illustrations, tropical leaf animations, baby prediction games, and location map.",
    "features": [
      "Jungle Leaves Ambient Float",
      "Baby Prediction Games",
      "Adorable Safari Animal Icons",
      "Party Venue Directions",
      "WhatsApp RSVP"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Welcoming Baby Aarohi • Mom & Dad Kavya & Arjun",
      "date": "Sunday, November 22, 2026 • The Blossom Pavilion",
      "subheading": "A little bundle of joy is on the way! Join us as we shower mom-to-be and dad-to-be with love, laughter, and blessings.",
      "musicTitle": "Gentle Lullaby & Acoustic Chimes",
      "story": "Ten little fingers, ten little toes, and a love that grows every single day. We cannot wait to welcome our angel into this world.",
      "author": "— With Joyful Anticipation",
      "portraitIcon": "👶🍼",
      "portraitBadge": "Parents-To-Be",
      "venueName": "The Blossom Pavilion",
      "venueAddress": "Besant Nagar, Chennai",
      "itinerary": [
        {
          "time": "04:00 PM",
          "title": "Welcome & High Tea Refreshments",
          "desc": "Pastries, mocktails, and photobooth snapshots"
        },
        {
          "time": "05:15 PM",
          "title": "Baby Shower Games & Polls",
          "desc": "Fun guessing games, baby bingo, and advice cards"
        },
        {
          "time": "06:30 PM",
          "title": "Blessings Ceremony & Gift Reveal",
          "desc": "Traditional blessings followed by dinner"
        }
      ]
    }
  },
  {
    "id": "royal-wax-seal-scroll",
    "title": "Royal Wax Seal Scroll",
    "category": "invitation",
    "categoryLabel": "Digital Invite",
    "badge": "Exclusive",
    "badgeClass": "royal",
    "icon": "📜",
    "bgGradient": "linear-gradient(135deg, #302b63, #24243e)",
    "colors": [
      "#d4af37",
      "#7f1d1d",
      "#f8fafc"
    ],
    "rating": "5.0 ★",
    "desc": "Interactive digital parchment scroll with click-to-break 3D wax seal animation that unfolds the luxury event invitation.",
    "features": [
      "Interactive Wax Seal Animation",
      "Unfolding Parchment Effect",
      "1-Click Calendar Add (.ics)",
      "WhatsApp Instant RSVP",
      "Google Map Directions"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "The Singhania Luxury Gala",
      "date": "Saturday, January 16, 2027 • The Imperial Hall",
      "subheading": "Cordially inviting you to an exclusive evening of high distinction, culinary excellence, and cherished fellowship.",
      "musicTitle": "Grand Orchestral Prelude & Harp",
      "story": "Honoring our esteemed patrons and family legacy with a banquet fit for royalty.",
      "author": "— Cordially Invited",
      "portraitIcon": "💌🎫",
      "portraitBadge": "VIP Pass",
      "venueName": "The Imperial Hall",
      "venueAddress": "Mount Road, Chennai",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "VIP Red Carpet Welcome",
          "desc": "Cocktail reception & string quartet"
        },
        {
          "time": "08:15 PM",
          "title": "Keynote Address & Honors",
          "desc": "Celebration addresses and awards"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner Banquet",
          "desc": "Five-course chef curated dinner"
        }
      ]
    }
  },
  {
    "id": "velvet-gold-vip-pass",
    "title": "Velvet & Gold VIP Pass",
    "category": "invitation",
    "categoryLabel": "Digital Invite",
    "badge": "VIP Exclusive",
    "badgeClass": "bestseller",
    "icon": "🎫",
    "bgGradient": "linear-gradient(135deg, #000000, #434343)",
    "colors": [
      "#d4af37",
      "#000000",
      "#e5e7eb"
    ],
    "rating": "5.0 ★",
    "desc": "Dark velvet texture with holographic gold foil embossing. Generates a personalized VIP QR code ticket for every guest.",
    "features": [
      "Personalized Guest QR Ticket",
      "Holographic Gold Foil Sheen",
      "Dress Code & Entry Pass",
      "1-Tap RSVP Confirmation",
      "Exclusive Event Map"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "The Singhania Luxury Gala",
      "date": "Saturday, January 16, 2027 • The Imperial Hall",
      "subheading": "Cordially inviting you to an exclusive evening of high distinction, culinary excellence, and cherished fellowship.",
      "musicTitle": "Grand Orchestral Prelude & Harp",
      "story": "Honoring our esteemed patrons and family legacy with a banquet fit for royalty.",
      "author": "— Cordially Invited",
      "portraitIcon": "💌🎫",
      "portraitBadge": "VIP Pass",
      "venueName": "The Imperial Hall",
      "venueAddress": "Mount Road, Chennai",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "VIP Red Carpet Welcome",
          "desc": "Cocktail reception & string quartet"
        },
        {
          "time": "08:15 PM",
          "title": "Keynote Address & Honors",
          "desc": "Celebration addresses and awards"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner Banquet",
          "desc": "Five-course chef curated dinner"
        }
      ]
    }
  },
  {
    "id": "modern-minimal-hologram",
    "title": "Modern Minimal Hologram",
    "category": "invitation",
    "categoryLabel": "Digital Invite",
    "badge": "High Tech",
    "badgeClass": "trending",
    "icon": "✨",
    "bgGradient": "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    "colors": [
      "#38bdf8",
      "#c084fc",
      "#d4af37"
    ],
    "rating": "4.8 ★",
    "desc": "Frosted glass card with iridescent holographic light gleam following cursor. Ultra-fast loading and 1-tap WhatsApp RSVP.",
    "features": [
      "Interactive Light Refraction",
      "Ultra-Minimalist Layout",
      "1-Tap WhatsApp RSVP",
      "Direct Phone Call Button",
      "Calendar Integration"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "The Singhania Luxury Gala",
      "date": "Saturday, January 16, 2027 • The Imperial Hall",
      "subheading": "Cordially inviting you to an exclusive evening of high distinction, culinary excellence, and cherished fellowship.",
      "musicTitle": "Grand Orchestral Prelude & Harp",
      "story": "Honoring our esteemed patrons and family legacy with a banquet fit for royalty.",
      "author": "— Cordially Invited",
      "portraitIcon": "💌🎫",
      "portraitBadge": "VIP Pass",
      "venueName": "The Imperial Hall",
      "venueAddress": "Mount Road, Chennai",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "VIP Red Carpet Welcome",
          "desc": "Cocktail reception & string quartet"
        },
        {
          "time": "08:15 PM",
          "title": "Keynote Address & Honors",
          "desc": "Celebration addresses and awards"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner Banquet",
          "desc": "Five-course chef curated dinner"
        }
      ]
    }
  },
  {
    "id": "animated-countdown-pass",
    "title": "Animated Countdown Pass",
    "category": "invitation",
    "categoryLabel": "Digital Invite",
    "badge": "Dynamic",
    "badgeClass": "trending",
    "icon": "⏳",
    "bgGradient": "linear-gradient(135deg, #ff416c, #ff4b2b)",
    "colors": [
      "#f43f5e",
      "#d4af37",
      "#18181b"
    ],
    "rating": "4.9 ★",
    "desc": "Live ticking seconds countdown hero with event schedule tabs, dress code guidance, and venue GPS navigation.",
    "features": [
      "Live Ticking Countdown Clock",
      "Tabbed Event Schedule",
      "Venue GPS Navigation",
      "Guest Wishes Box",
      "WhatsApp RSVP Link"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "The Singhania Luxury Gala",
      "date": "Saturday, January 16, 2027 • The Imperial Hall",
      "subheading": "Cordially inviting you to an exclusive evening of high distinction, culinary excellence, and cherished fellowship.",
      "musicTitle": "Grand Orchestral Prelude & Harp",
      "story": "Honoring our esteemed patrons and family legacy with a banquet fit for royalty.",
      "author": "— Cordially Invited",
      "portraitIcon": "💌🎫",
      "portraitBadge": "VIP Pass",
      "venueName": "The Imperial Hall",
      "venueAddress": "Mount Road, Chennai",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "VIP Red Carpet Welcome",
          "desc": "Cocktail reception & string quartet"
        },
        {
          "time": "08:15 PM",
          "title": "Keynote Address & Honors",
          "desc": "Celebration addresses and awards"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner Banquet",
          "desc": "Five-course chef curated dinner"
        }
      ]
    }
  },
  {
    "id": "floral-botanical-savethedate",
    "title": "Floral Botanical Save-The-Date",
    "category": "invitation",
    "categoryLabel": "Digital Invite",
    "badge": "Elegant",
    "badgeClass": "trending",
    "icon": "🌿",
    "bgGradient": "linear-gradient(135deg, #11998e, #38ef7d)",
    "colors": [
      "#047857",
      "#d4af37",
      "#fdfbf7"
    ],
    "rating": "4.9 ★",
    "desc": "Hand-drawn botanical flora with gently falling green leaves, interactive RSVP check-in, and calendar sync.",
    "features": [
      "Falling Petals/Leaves Effect",
      "Botanical Hand-drawn Art",
      "Calendar Sync Feature",
      "Venue Directions",
      "Attendance RSVP Form"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "The Singhania Luxury Gala",
      "date": "Saturday, January 16, 2027 • The Imperial Hall",
      "subheading": "Cordially inviting you to an exclusive evening of high distinction, culinary excellence, and cherished fellowship.",
      "musicTitle": "Grand Orchestral Prelude & Harp",
      "story": "Honoring our esteemed patrons and family legacy with a banquet fit for royalty.",
      "author": "— Cordially Invited",
      "portraitIcon": "💌🎫",
      "portraitBadge": "VIP Pass",
      "venueName": "The Imperial Hall",
      "venueAddress": "Mount Road, Chennai",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "VIP Red Carpet Welcome",
          "desc": "Cocktail reception & string quartet"
        },
        {
          "time": "08:15 PM",
          "title": "Keynote Address & Honors",
          "desc": "Celebration addresses and awards"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner Banquet",
          "desc": "Five-course chef curated dinner"
        }
      ]
    }
  },
  {
    "id": "luxury-video-invitation-hub",
    "title": "Luxury Video Invitation Hub",
    "category": "invitation",
    "categoryLabel": "Digital Invite",
    "badge": "Video Teaser",
    "badgeClass": "royal",
    "icon": "🎥",
    "bgGradient": "linear-gradient(135deg, #1f4037, #99f2c8)",
    "colors": [
      "#10b981",
      "#d4af37",
      "#0f172a"
    ],
    "rating": "5.0 ★",
    "desc": "Embedded 4K invitation teaser video player with sound controls, interactive program schedule, and guest check-in.",
    "features": [
      "4K Video Teaser Player",
      "Sound Toggle Controls",
      "Interactive Schedule Guide",
      "Venue Map with Uber Link",
      "RSVP Pass"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "The Singhania Luxury Gala",
      "date": "Saturday, January 16, 2027 • The Imperial Hall",
      "subheading": "Cordially inviting you to an exclusive evening of high distinction, culinary excellence, and cherished fellowship.",
      "musicTitle": "Grand Orchestral Prelude & Harp",
      "story": "Honoring our esteemed patrons and family legacy with a banquet fit for royalty.",
      "author": "— Cordially Invited",
      "portraitIcon": "💌🎫",
      "portraitBadge": "VIP Pass",
      "venueName": "The Imperial Hall",
      "venueAddress": "Mount Road, Chennai",
      "itinerary": [
        {
          "time": "07:00 PM",
          "title": "VIP Red Carpet Welcome",
          "desc": "Cocktail reception & string quartet"
        },
        {
          "time": "08:15 PM",
          "title": "Keynote Address & Honors",
          "desc": "Celebration addresses and awards"
        },
        {
          "time": "09:00 PM",
          "title": "Gala Dinner Banquet",
          "desc": "Five-course chef curated dinner"
        }
      ]
    }
  },
  {
    "id": "eternal-bloom-memorial",
    "title": "Eternal Bloom Tribute",
    "category": "special",
    "categoryLabel": "Special Occasion",
    "badge": "Reverent",
    "badgeClass": "bestseller",
    "icon": "🕊️",
    "bgGradient": "linear-gradient(135deg, #2b5876, #4e4376)",
    "colors": [
      "#f8fafc",
      "#94a3b8",
      "#d4af37"
    ],
    "rating": "5.0 ★",
    "desc": "Peaceful white lilies, soft candlelight flicker, cherished memories life timeline, and digital condolence tribute book.",
    "features": [
      "Candlelight Tribute Flicker",
      "Life Journey Memories Album",
      "Digital Condolence Messages",
      "Memorial Service Program",
      "Charity Donation Link"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Celebration Gala & Milestone Event",
      "date": "Saturday, December 26, 2026 • Grand Hall",
      "subheading": "An auspicious celebration honoring milestones, unity, and joyous memories with all our loved ones.",
      "musicTitle": "Celebration Harmony & Uplifting Orchestral",
      "story": "Every milestone is a testament to perseverance, love, and community. Tonight we rejoice together.",
      "author": "— With Gratitude",
      "portraitIcon": "🎉✨",
      "portraitBadge": "Guest of Honor",
      "venueName": "The Grand Hall",
      "venueAddress": "Cathedral Road, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Arrival & Welcome",
          "desc": "Photo wall and welcome drinks"
        },
        {
          "time": "07:30 PM",
          "title": "Main Ceremony",
          "desc": "Speeches, awards, and commemorative moments"
        },
        {
          "time": "08:45 PM",
          "title": "Celebration Dinner",
          "desc": "Gourmet feast & music"
        }
      ]
    }
  },
  {
    "id": "sacred-diwali-gala",
    "title": "Sacred Diwali Grand Celebration",
    "category": "special",
    "categoryLabel": "Special Occasion",
    "badge": "Festive",
    "badgeClass": "royal",
    "icon": "🪔",
    "bgGradient": "linear-gradient(135deg, #f12711, #f5af19)",
    "colors": [
      "#ea580c",
      "#d4af37",
      "#fef08a"
    ],
    "rating": "4.9 ★",
    "desc": "Glowing earthen diyas, sparkling fireworks animation on click, festive banquet menu, and digital greeting card sender.",
    "features": [
      "Click-to-Burst Fireworks FX",
      "Glowing Diya Animations",
      "Festive Dinner Menu",
      "Send Digital Diwali Wishes",
      "Venue GPS"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Celebration Gala & Milestone Event",
      "date": "Saturday, December 26, 2026 • Grand Hall",
      "subheading": "An auspicious celebration honoring milestones, unity, and joyous memories with all our loved ones.",
      "musicTitle": "Celebration Harmony & Uplifting Orchestral",
      "story": "Every milestone is a testament to perseverance, love, and community. Tonight we rejoice together.",
      "author": "— With Gratitude",
      "portraitIcon": "🎉✨",
      "portraitBadge": "Guest of Honor",
      "venueName": "The Grand Hall",
      "venueAddress": "Cathedral Road, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Arrival & Welcome",
          "desc": "Photo wall and welcome drinks"
        },
        {
          "time": "07:30 PM",
          "title": "Main Ceremony",
          "desc": "Speeches, awards, and commemorative moments"
        },
        {
          "time": "08:45 PM",
          "title": "Celebration Dinner",
          "desc": "Gourmet feast & music"
        }
      ]
    }
  },
  {
    "id": "christmas-newyear-gala",
    "title": "Christmas & New Year Gala",
    "category": "special",
    "categoryLabel": "Special Occasion",
    "badge": "Festive",
    "badgeClass": "trending",
    "icon": "🎄",
    "bgGradient": "linear-gradient(135deg, #1e3c72, #2a5298)",
    "colors": [
      "#15803d",
      "#dc2626",
      "#ffd700"
    ],
    "rating": "4.9 ★",
    "desc": "Gentle falling snow effect, gold holiday ribbons, New Year midnight countdown timer, and holiday feast RSVP.",
    "features": [
      "Realistic Falling Snow Canvas",
      "Midnight NYE Countdown",
      "Holiday Party Food Menu",
      "Santa Photo Booth",
      "Guest RSVP Form"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Celebration Gala & Milestone Event",
      "date": "Saturday, December 26, 2026 • Grand Hall",
      "subheading": "An auspicious celebration honoring milestones, unity, and joyous memories with all our loved ones.",
      "musicTitle": "Celebration Harmony & Uplifting Orchestral",
      "story": "Every milestone is a testament to perseverance, love, and community. Tonight we rejoice together.",
      "author": "— With Gratitude",
      "portraitIcon": "🎉✨",
      "portraitBadge": "Guest of Honor",
      "venueName": "The Grand Hall",
      "venueAddress": "Cathedral Road, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Arrival & Welcome",
          "desc": "Photo wall and welcome drinks"
        },
        {
          "time": "07:30 PM",
          "title": "Main Ceremony",
          "desc": "Speeches, awards, and commemorative moments"
        },
        {
          "time": "08:45 PM",
          "title": "Celebration Dinner",
          "desc": "Gourmet feast & music"
        }
      ]
    }
  },
  {
    "id": "academic-graduation-triumph",
    "title": "Academic Graduation Triumph",
    "category": "special",
    "categoryLabel": "Special Occasion",
    "badge": "Achievement",
    "badgeClass": "trending",
    "icon": "🎓",
    "bgGradient": "linear-gradient(135deg, #000428, #004e92)",
    "colors": [
      "#1d4ed8",
      "#d4af37",
      "#ffffff"
    ],
    "rating": "4.8 ★",
    "desc": "Tossing graduation caps animation, academic honors list, graduate video message, and family congratulations guestbook.",
    "features": [
      "Cap Toss Interactive Physics",
      "Academic Honors Spotlight",
      "Graduate Speech Video",
      "Congratulations Guestbook",
      "Grad Party Location"
    ],
    "animationType": "animated",
    "demo": {
      "celebrants": "Celebration Gala & Milestone Event",
      "date": "Saturday, December 26, 2026 • Grand Hall",
      "subheading": "An auspicious celebration honoring milestones, unity, and joyous memories with all our loved ones.",
      "musicTitle": "Celebration Harmony & Uplifting Orchestral",
      "story": "Every milestone is a testament to perseverance, love, and community. Tonight we rejoice together.",
      "author": "— With Gratitude",
      "portraitIcon": "🎉✨",
      "portraitBadge": "Guest of Honor",
      "venueName": "The Grand Hall",
      "venueAddress": "Cathedral Road, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Arrival & Welcome",
          "desc": "Photo wall and welcome drinks"
        },
        {
          "time": "07:30 PM",
          "title": "Main Ceremony",
          "desc": "Speeches, awards, and commemorative moments"
        },
        {
          "time": "08:45 PM",
          "title": "Celebration Dinner",
          "desc": "Gourmet feast & music"
        }
      ]
    }
  },
  {
    "id": "corporate-milestone-gala",
    "title": "Corporate Milestone Gala",
    "category": "special",
    "categoryLabel": "Special Occasion",
    "badge": "Executive Tier",
    "badgeClass": "royal",
    "icon": "🏢",
    "bgGradient": "linear-gradient(135deg, #141e30, #243b55)",
    "colors": [
      "#0f172a",
      "#d4af37",
      "#38bdf8"
    ],
    "rating": "4.9 ★",
    "desc": "High-end enterprise executive design, company retrospective timeline, keynote speaker lineup, and ticketed RSVP.",
    "features": [
      "Executive Black & Gold Theme",
      "Company Growth Timeline",
      "Keynote Speakers Roster",
      "Corporate RSVP Portal",
      "Venue & Hotel Guide"
    ],
    "animationType": "non-animated",
    "demo": {
      "celebrants": "Celebration Gala & Milestone Event",
      "date": "Saturday, December 26, 2026 • Grand Hall",
      "subheading": "An auspicious celebration honoring milestones, unity, and joyous memories with all our loved ones.",
      "musicTitle": "Celebration Harmony & Uplifting Orchestral",
      "story": "Every milestone is a testament to perseverance, love, and community. Tonight we rejoice together.",
      "author": "— With Gratitude",
      "portraitIcon": "🎉✨",
      "portraitBadge": "Guest of Honor",
      "venueName": "The Grand Hall",
      "venueAddress": "Cathedral Road, Chennai",
      "itinerary": [
        {
          "time": "06:00 PM",
          "title": "Arrival & Welcome",
          "desc": "Photo wall and welcome drinks"
        },
        {
          "time": "07:30 PM",
          "title": "Main Ceremony",
          "desc": "Speeches, awards, and commemorative moments"
        },
        {
          "time": "08:45 PM",
          "title": "Celebration Dinner",
          "desc": "Gourmet feast & music"
        }
      ]
    }
  }
];


// ========================================================
// TEMPLATES RENDERING, SEARCH & FILTER ENGINE
// ========================================================
let activeCategory = 'all';
let activeType = 'all'; // 'all' | 'animated' | 'non-animated'
let searchQuery = '';

const templatesGrid = document.getElementById('templates-grid');
const visibleCountEl = document.getElementById('visible-count');
const emptyStateEl = document.getElementById('templates-empty-state');
const searchInput = document.getElementById('template-search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const typeTabs = document.querySelectorAll('.type-tab');
const filterTabs = document.querySelectorAll('.filter-tab');

// Check URL parameters on page load (e.g. templates.html?category=wedding)
const urlParams = new URLSearchParams(window.location.search);
const initialCat = urlParams.get('category');
if (initialCat && ['wedding', 'birthday', 'anniversary', 'engagement', 'babyshower', 'invitation', 'special', 'all'].includes(initialCat)) {
  activeCategory = initialCat;
  filterTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-category') === initialCat));
}

function renderTemplates() {
  if (!templatesGrid) return;

  const query = searchQuery.trim().toLowerCase();
  const filtered = TEMPLATES_DATA.filter(tpl => {
    const matchesCategory = activeCategory === 'all' || tpl.category === activeCategory;
    const matchesType = activeType === 'all' || tpl.animationType === activeType;
    const matchesSearch = !query || 
      tpl.title.toLowerCase().includes(query) ||
      tpl.desc.toLowerCase().includes(query) ||
      tpl.categoryLabel.toLowerCase().includes(query) ||
      tpl.features.some(f => f.toLowerCase().includes(query));

    return matchesCategory && matchesType && matchesSearch;
  });

  if (visibleCountEl) {
    visibleCountEl.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    templatesGrid.innerHTML = '';
    if (emptyStateEl) emptyStateEl.style.display = 'block';
    return;
  }

  if (emptyStateEl) emptyStateEl.style.display = 'none';

  templatesGrid.innerHTML = filtered.map(tpl => {
    const featurePills = tpl.features.slice(0, 3).map(f => `
      <span class="feature-pill"><i class="fas fa-sparkles"></i> ${f}</span>
    `).join('');

    const animBadge = tpl.animationType === 'animated'
      ? '<span class="template-animation-badge animated">⚡ Animated FX</span>'
      : '<span class="template-animation-badge non-animated">💎 Classic Clean</span>';

    const categoryDemoMap = {
      wedding: 'wedding-royal.html',
      birthday: 'birthday-magic.html',
      anniversary: 'anniversary-timeless.html',
      engagement: 'engagement-proposal.html',
      babyshower: 'babyshower-magic.html',
      invitation: 'engagement-proposal.html',
      special: 'anniversary-timeless.html'
    };
    const demoUrl = tpl.liveDemoUrl || categoryDemoMap[tpl.category] || 'wedding-royal.html';

    return `
      <div class="template-card reveal active" data-id="${tpl.id}" data-category="${tpl.category}" data-animation="${tpl.animationType}">
        <div class="template-thumbnail" style="background: ${tpl.bgGradient};">
          <div class="template-badge-row">
            <span class="template-badge ${tpl.badgeClass}">${tpl.badge}</span>
            ${animBadge}
            <span class="template-rating">${tpl.rating}</span>
          </div>
          <div class="template-visual-preview">
            <div class="template-icon-display">${tpl.icon}</div>
            <div class="template-subtext-preview">${tpl.categoryLabel} Collection</div>
          </div>
        </div>

        <div class="template-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="template-category-tag">${tpl.categoryLabel} Design</span>
            <span style="font-size:0.75rem; color:var(--gold-light); font-weight:600;">${tpl.animationType === 'animated' ? '⚡ Interactive FX' : '💎 Classic Luxury'}</span>
          </div>
          <h3 class="template-title">${tpl.title}</h3>
          <p class="template-desc">${tpl.desc}</p>

          <div class="template-feature-pills">
            ${featurePills}
          </div>

          <div class="template-actions">
            <button class="btn-preview" onclick="openTemplatePreview('${tpl.id}')" title="Preview complete top-to-bottom template">
              <i class="fas fa-eye"></i> <span>Quick View</span>
            </button>
            <a href="${demoUrl}" target="_blank" rel="noopener" class="btn-demo-link" style="display:inline-flex; align-items:center; gap:6px; padding:8px 12px; background:rgba(212,175,55,0.12); border:1px solid var(--gold); border-radius:8px; color:var(--gold-light); font-size:0.82rem; font-weight:600; text-decoration:none;" title="Open full interactive website in new tab">
              <i class="fas fa-external-link-alt"></i> <span>Live Demo</span>
            </a>
            <a href="${whatsappOrderUrl}" target="_blank" rel="noopener" class="btn-order-whatsapp" title="Order via WhatsApp">
              <i class="fab fa-whatsapp"></i> <span>Order</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-bind hover/tilt interactions on newly rendered cards
  if (!isMobile) {
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

// Initial render if grid is present
if (templatesGrid) {
  renderTemplates();
}

// Category Filter Tabs
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.getAttribute('data-category');
    renderTemplates();
  });
});

// Type Filter Tabs (Animated vs Classic Non-Animated)
typeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    typeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeType = tab.getAttribute('data-type');
    renderTemplates();
  });
});

// Search Input Logic
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchClearBtn) {
      searchClearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
    }
    renderTemplates();
  });
}

if (searchClearBtn) {
  searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClearBtn.style.display = 'none';
    renderTemplates();
    searchInput.focus();
  });
}

if (resetFiltersBtn) {
  resetFiltersBtn.addEventListener('click', () => {
    activeCategory = 'all';
    activeType = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    filterTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-category') === 'all'));
    typeTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-type') === 'all'));
    renderTemplates();
  });
}

// ========================================================
// SERVICE CARDS (WEBSITES WE BUILD) CLICK-TO-FILTER LOGIC
// ========================================================
const serviceCards = document.querySelectorAll('.service-card[data-category]');
serviceCards.forEach(card => {
  card.addEventListener('click', (e) => {
    const templatesSection = document.getElementById('templates');
    // If on same page where templates showcase exists (templates.html), filter in-place
    if (templatesSection && templatesGrid) {
      e.preventDefault();
      const category = card.getAttribute('data-category');
      if (!category) return;

      activeCategory = category;
      filterTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-category') === category);
      });
      renderTemplates();
      templatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const cardTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Templates';
      showLuxuryToast(`Showing 50-Template Collection: ${cardTitle}`);
    }
  });
});

// ========================================================
// TEMPLATE PREVIEW MODAL LOGIC (TOP-TO-BOTTOM DEMO)
// ========================================================
const templateModal = document.getElementById('template-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const mockupFrame = document.getElementById('mockup-frame');
const mockupViewport = document.getElementById('mockup-viewport');
const deviceBtns = document.querySelectorAll('.device-btn');
let isAudioPlaying = true;

window.openTemplatePreview = function(templateId) {
  const tpl = TEMPLATES_DATA.find(t => t.id === templateId);
  if (!tpl || !templateModal) return;

  const demo = tpl.demo || {};

  // Populate modal header meta
  const modalBadge = document.getElementById('modal-badge');
  if (modalBadge) {
    modalBadge.textContent = tpl.badge;
    modalBadge.className = `modal-badge ${tpl.badgeClass}`;
  }
  const modalCategory = document.getElementById('modal-category');
  if (modalCategory) {
    modalCategory.textContent = `${tpl.categoryLabel} Collection • ${tpl.animationType === 'animated' ? '⚡ Animated FX' : '💎 Classic Clean'}`;
  }
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) {
    modalTitle.textContent = tpl.title;
  }
  const modalDesc = document.getElementById('modal-description');
  if (modalDesc) {
    modalDesc.textContent = tpl.desc;
  }

  // Populate browser bar address
  const mockupAddress = document.getElementById('mockup-address');
  if (mockupAddress) {
    mockupAddress.textContent = `https://lbdigitalcreations.in/demo/${tpl.id}`;
  }

  // 1. Demo Site Nav
  const demoBrandName = document.getElementById('demo-brand-name');
  if (demoBrandName) {
    demoBrandName.textContent = demo.celebrants ? demo.celebrants.split('•')[0].trim() : tpl.title;
  }

  // 2. Demo Hero Section
  const demoExpBadge = document.getElementById('demo-experience-badge');
  const demoExpText = document.getElementById('demo-exp-text');
  if (demoExpBadge && demoExpText) {
    if (tpl.animationType === 'animated') {
      demoExpBadge.className = 'demo-experience-badge';
      demoExpText.textContent = '⚡ Animated Interactive Experience (Music, Dynamic Countdown & FX)';
    } else {
      demoExpBadge.className = 'demo-experience-badge non-animated-badge';
      demoExpText.textContent = '💎 Classic & Minimalist Luxury Edition (Editorial & Clean)';
    }
  }

  const demoHeroNames = document.getElementById('demo-hero-names');
  if (demoHeroNames) {
    demoHeroNames.textContent = demo.celebrants || tpl.title;
  }

  const demoHeroDate = document.getElementById('demo-hero-date');
  if (demoHeroDate) {
    demoHeroDate.textContent = `✨ ${demo.date || 'Saturday, December 19, 2026 • Grand Hall'} ✨`;
  }

  const demoHeroSubheading = document.getElementById('demo-hero-subheading');
  if (demoHeroSubheading) {
    demoHeroSubheading.textContent = demo.subheading || tpl.desc;
  }

  // Demo Music Bar
  const demoMusicTitle = document.getElementById('demo-music-title');
  if (demoMusicTitle) {
    demoMusicTitle.textContent = demo.musicTitle || 'Celebration Symphony & Acoustic Harmony';
  }

  // 4. Demo Our Story / Welcome Section
  const demoStoryTitle = document.getElementById('demo-story-title');
  if (demoStoryTitle) {
    if (tpl.category === 'birthday') demoStoryTitle.textContent = 'The Birthday Milestone';
    else if (tpl.category === 'wedding') demoStoryTitle.textContent = 'How Our Story Unfolded';
    else if (tpl.category === 'anniversary') demoStoryTitle.textContent = '25 Years Of Endless Love';
    else if (tpl.category === 'babyshower') demoStoryTitle.textContent = 'A Miracle In The Making';
    else demoStoryTitle.textContent = 'Our Sacred Celebration Journey';
  }

  const demoPortraitIcon = document.getElementById('demo-portrait-icon');
  if (demoPortraitIcon) {
    demoPortraitIcon.textContent = demo.portraitIcon || tpl.icon;
  }

  const demoStoryBody = document.getElementById('demo-story-body');
  if (demoStoryBody) {
    demoStoryBody.textContent = `"${demo.story || tpl.desc}"`;
  }

  const demoStoryAuthor = document.getElementById('demo-story-author');
  if (demoStoryAuthor) {
    demoStoryAuthor.textContent = demo.author || '— With Infinite Love';
  }

  // 5. Demo Itinerary Timeline
  const timelineContainer = document.getElementById('demo-timeline-cards');
  if (timelineContainer && demo.itinerary) {
    timelineContainer.innerHTML = demo.itinerary.map(item => `
      <div class="demo-timeline-card">
        <span class="demo-event-time">${item.time}</span>
        <div class="demo-event-info">
          <strong>${item.title}</strong>
          <span>${item.desc}</span>
        </div>
      </div>
    `).join('');
  }

  // 7. Demo Venue Section
  const venueNameEl = document.getElementById('demo-venue-name');
  if (venueNameEl) {
    venueNameEl.textContent = demo.venueName || 'The Grand Palace & Ballroom';
  }
  const venueAddressEl = document.getElementById('demo-venue-address');
  if (venueAddressEl) {
    venueAddressEl.textContent = demo.venueAddress || 'Palace Road, Chennai, Tamil Nadu';
  }

  // Features checklist in sidebar
  const featuresList = document.getElementById('modal-features');
  if (featuresList) {
    featuresList.innerHTML = tpl.features.map(f => `
      <li><i class="fas fa-check"></i> ${f}</li>
    `).join('') + `
      <li><i class="fas fa-check"></i> 100% Mobile & WhatsApp Share Ready</li>
      <li><i class="fas fa-check"></i> ${tpl.animationType === 'animated' ? 'Full Sound & Interactive Animations' : 'Clean Ultra-Fast Lightweight Layout'}</li>
    `;
  }

  // Color swatches in sidebar
  const swatchesContainer = document.getElementById('modal-swatches');
  if (swatchesContainer) {
    swatchesContainer.innerHTML = tpl.colors.map(c => `
      <span class="color-swatch" style="background:${c};" title="${c}"></span>
    `).join('');
  }

  // Dynamic Category Live Demo Mapping
  const categoryDemoMap = {
    wedding: 'wedding-royal.html',
    birthday: 'birthday-magic.html',
    anniversary: 'anniversary-timeless.html',
    engagement: 'engagement-proposal.html',
    babyshower: 'babyshower-magic.html',
    invitation: 'engagement-proposal.html',
    special: 'anniversary-timeless.html'
  };
  const baseDemoUrl = tpl.liveDemoUrl || categoryDemoMap[tpl.category] || 'wedding-royal.html';
  const celebrantsText = tpl.demo ? tpl.demo.celebrants : tpl.title;
  const dateText = tpl.demo ? tpl.demo.date : '';
  const targetDemoUrl = `${baseDemoUrl}?id=${encodeURIComponent(tpl.id)}&title=${encodeURIComponent(tpl.title)}&celebrants=${encodeURIComponent(celebrantsText)}&date=${encodeURIComponent(dateText)}`;

  // Update iframe to load the real, distinct interactive template
  const mockupIframe = document.getElementById('mockup-iframe');
  if (mockupIframe) {
    mockupIframe.src = targetDemoUrl;
  }

  // Live Demo button in modal sidebar
  const liveDemoBtn = document.getElementById('modal-live-demo-btn');
  if (liveDemoBtn) {
    liveDemoBtn.href = targetDemoUrl;
    liveDemoBtn.style.display = 'inline-flex';
  }

  // WhatsApp CTA link prefill in sidebar
  const whatsappBtn = document.getElementById('modal-order-whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.href = `https://wa.me/916381366088?text=${encodeURIComponent(`Hello LB Digital Creations! I would like to order the "${tpl.title}" (${tpl.animationType === 'animated' ? 'Animated' : 'Classic'} Style) celebration website template.`)}`;
  }

  // Reset scroll to top of mockup viewport
  if (mockupViewport) {
    mockupViewport.scrollTop = 0;
  }

  // Open modal
  templateModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

function closeTemplatePreview() {
  if (!templateModal) return;
  templateModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeTemplatePreview);
}

if (templateModal) {
  templateModal.addEventListener('click', (e) => {
    if (e.target === templateModal) {
      closeTemplatePreview();
    }
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTemplatePreview();
  }
});

// Device Switcher (Desktop vs Mobile simulation)
deviceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    deviceBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const device = btn.getAttribute('data-device');
    if (mockupFrame) {
      mockupFrame.classList.toggle('mobile-mode', device === 'mobile');
    }
  });
});

// Interactive Demo Music Player Toggle
const demoMusicPlayBtn = document.getElementById('demo-music-play-btn');
const demoPlayIcon = document.getElementById('demo-play-icon');
const demoSoundwave = document.getElementById('demo-soundwave');

if (demoMusicPlayBtn) {
  demoMusicPlayBtn.addEventListener('click', () => {
    isAudioPlaying = !isAudioPlaying;
    if (demoPlayIcon) {
      demoPlayIcon.className = isAudioPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    if (demoSoundwave) {
      demoSoundwave.style.opacity = isAudioPlaying ? '1' : '0.2';
    }
    showLuxuryToast(isAudioPlaying ? '🎵 Demo Background Audio Resumed' : '🔇 Demo Background Audio Paused');
  });
}

// Interactive RSVP form submission in demo
const demoSubmitBtn = document.querySelector('.demo-submit-btn');
if (demoSubmitBtn) {
  demoSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLuxuryToast('🎉 RSVP & Wishes Successfully Submitted (Demo Simulation)!');
  });
}

// Interactive RSVP attendance pill toggle in demo
document.querySelectorAll('.demo-rsvp-options .rsvp-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.demo-rsvp-options .rsvp-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
  });
});

// ========================================================
// FEATURE 1: INTERACTIVE "DESIGN YOUR DREAM SITE" STUDIO LOGIC
// ========================================================
(function initStudio() {
  const occasionPills = document.querySelectorAll('#studio-occasion-pills .studio-pill');
  const nameInput = document.getElementById('studio-name-input');
  const dateInput = document.getElementById('studio-date-input');
  const paletteBtns = document.querySelectorAll('#studio-palettes .palette-option');
  const musicBtns = document.querySelectorAll('#studio-music-options .music-pill-opt');
  const addonRsvp = document.getElementById('addon-rsvp');
  const addonMap = document.getElementById('addon-map');
  const addonGallery = document.getElementById('addon-gallery');
  const orderBtn = document.getElementById('studio-order-btn');

  // Target preview elements
  const phoneScreen = document.getElementById('phone-screen-target');
  const phoneCrest = document.getElementById('phone-crest');
  const phoneBrandTitle = document.getElementById('phone-brand-title');
  const phoneOccasionPill = document.getElementById('phone-occasion-pill');
  const phoneNamesDisplay = document.getElementById('phone-names-display');
  const phoneDateDisplay = document.getElementById('phone-date-display');
  const phoneTrackTitle = document.getElementById('phone-track-title');
  const phoneStoryText = document.getElementById('phone-story-text');
  const phoneRsvpPreview = document.getElementById('phone-rsvp-preview');
  const phoneMapPreview = document.getElementById('phone-map-preview');
  const phoneGalleryPreview = document.getElementById('phone-gallery-preview');

  if (!phoneScreen) return;

  let currentOccasion = 'wedding';
  let currentOccasionLabel = 'Royal Wedding Portal';
  let currentIcon = '👑';
  let currentPalette = 'Royal Velvet';
  let currentMusic = 'Royal Sitar & Shehnai Raga';

  const occasionStoryMap = {
    wedding: '"Two souls united in love and sacred vows, ready to celebrate a lifetime of magical adventures together."',
    birthday: '"Celebrating another year of boundless dreams, vibrant laughter, and making memories with the best people."',
    anniversary: '"25 golden years of cherished memories, unwavering commitment, and a timeless love that grows brighter every day."',
    engagement: '"A sacred promise sealed with rings and pure love. Join us as we begin our countdown to forever."',
    babyshower: '"A sweet little miracle is on the way to fill our world with joy, laughter, and endless blessings."'
  };

  function updateStudioPreview() {
    const names = (nameInput && nameInput.value.trim()) || 'Ananya & Karthik';
    const date = (dateInput && dateInput.value.trim()) || 'Saturday, December 19, 2026';

    if (phoneCrest) phoneCrest.textContent = currentIcon;
    if (phoneBrandTitle) phoneBrandTitle.textContent = names.split('&')[0].trim() || names;
    if (phoneOccasionPill) phoneOccasionPill.textContent = `${currentIcon} ${currentOccasionLabel}`;
    if (phoneNamesDisplay) phoneNamesDisplay.textContent = names;
    if (phoneDateDisplay) phoneDateDisplay.textContent = `✨ ${date} ✨`;
    if (phoneTrackTitle) phoneTrackTitle.textContent = currentMusic;
    if (phoneStoryText) phoneStoryText.textContent = occasionStoryMap[currentOccasion] || occasionStoryMap.wedding;

    // Addons visibility
    if (phoneRsvpPreview) phoneRsvpPreview.style.display = addonRsvp && addonRsvp.checked ? 'flex' : 'none';
    if (phoneMapPreview) phoneMapPreview.style.display = addonMap && addonMap.checked ? 'flex' : 'none';
    if (phoneGalleryPreview) phoneGalleryPreview.style.display = addonGallery && addonGallery.checked ? 'flex' : 'none';

    // WhatsApp CTA link prefill
    if (orderBtn) {
      const selectedAddons = [];
      if (addonRsvp && addonRsvp.checked) selectedAddons.push('WhatsApp RSVP');
      if (addonMap && addonMap.checked) selectedAddons.push('GPS Venue Map');
      if (addonGallery && addonGallery.checked) selectedAddons.push('4K Photo Gallery');

      const message = `Hello LB Digital Creations! I customized my dream website in the Live Studio:
- Occasion: ${currentOccasionLabel}
- Names: ${names}
- Date: ${date}
- Aesthetic Theme: ${currentPalette}
- Music: ${currentMusic}
- Included Modules: ${selectedAddons.join(', ')}

I would like to discuss and book this custom design!`;

      orderBtn.href = `https://wa.me/916381366088?text=${encodeURIComponent(message)}`;
    }
  }

  // Occasion Pills click
  occasionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      occasionPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentOccasion = pill.getAttribute('data-occasion');
      currentIcon = pill.getAttribute('data-icon');
      currentOccasionLabel = pill.getAttribute('data-sub');

      const defaultName = pill.getAttribute('data-default-name');
      if (nameInput && defaultName) {
        nameInput.value = defaultName;
      }

      updateStudioPreview();
      showLuxuryToast(`Studio Theme set to ${currentOccasionLabel}`);
    });
  });

  // Inputs live listener
  if (nameInput) nameInput.addEventListener('input', updateStudioPreview);
  if (dateInput) dateInput.addEventListener('input', updateStudioPreview);

  // Palette click
  paletteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPalette = btn.getAttribute('title') || 'Luxury Gold';
      const bg = btn.getAttribute('data-bg');
      if (phoneScreen && bg) {
        phoneScreen.style.background = bg;
      }
      updateStudioPreview();
    });
  });

  // Music Option click
  musicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      musicBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMusic = btn.getAttribute('data-track');
      updateStudioPreview();
      showLuxuryToast(`Soundtrack selected: ${currentMusic}`);
    });
  });

  // Addons toggle
  [addonRsvp, addonMap, addonGallery].forEach(cb => {
    if (cb) cb.addEventListener('change', updateStudioPreview);
  });

  // Initial preview update
  updateStudioPreview();
})();

// ========================================================
// FEATURE 2: INTERACTIVE PRICING CALCULATOR LOGIC
// ========================================================
(function initPricingCalculator() {
  const tierCards = document.querySelectorAll('.tier-card');
  const addonChecks = document.querySelectorAll('.calc-addon-check');
  const selectedTierNameEl = document.getElementById('calc-selected-tier-name');
  const tierCostEl = document.getElementById('calc-tier-cost');
  const addonsRowEl = document.getElementById('calc-addons-breakdown-row');
  const addonsCostEl = document.getElementById('calc-addons-cost');
  const grandTotalEl = document.getElementById('calc-grand-total');
  const bookBtn = document.getElementById('calc-whatsapp-book-btn');

  if (!grandTotalEl) return;

  let currentTierName = 'Ultra-Luxury Animated Edition';
  let currentTierPrice = 1999;

  function updatePricing() {
    let addonsTotal = 0;
    const selectedAddonNames = [];

    addonChecks.forEach(check => {
      if (check.checked) {
        const cost = parseInt(check.getAttribute('data-cost'), 10) || 0;
        const name = check.getAttribute('data-name');
        addonsTotal += cost;
        selectedAddonNames.push(`${name} (+₹${cost})`);
      }
    });

    const grandTotal = currentTierPrice + addonsTotal;

    if (selectedTierNameEl) selectedTierNameEl.textContent = currentTierName;
    if (tierCostEl) tierCostEl.textContent = `₹${currentTierPrice.toLocaleString('en-IN')}`;

    if (addonsRowEl && addonsCostEl) {
      if (addonsTotal > 0) {
        addonsRowEl.style.display = 'flex';
        addonsCostEl.textContent = `+₹${addonsTotal.toLocaleString('en-IN')}`;
      } else {
        addonsRowEl.style.display = 'none';
      }
    }

    if (grandTotalEl) {
      grandTotalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    }

    // Prefill WhatsApp booking link
    if (bookBtn) {
      const addonText = selectedAddonNames.length > 0 ? `\n- Selected Add-ons: ${selectedAddonNames.join(', ')}` : '\n- Add-ons: None';
      const message = `Hello LB Digital Creations! I would like to book a celebration website package:
- Selected Tier: ${currentTierName} (₹${currentTierPrice.toLocaleString('en-IN')})${addonText}
- Total Investment: ₹${grandTotal.toLocaleString('en-IN')}

Please share the onboarding details and order form!`;

      bookBtn.href = `https://wa.me/916381366088?text=${encodeURIComponent(message)}`;
    }
  }

  tierCards.forEach(card => {
    const btn = card.querySelector('.tier-select-btn');
    const selectTier = () => {
      tierCards.forEach(c => {
        c.classList.remove('active');
        const b = c.querySelector('.tier-select-btn');
        if (b) {
          b.classList.remove('active');
          b.textContent = b.getAttribute('data-orig-text') || 'Select Plan';
        }
      });

      card.classList.add('active');
      if (btn) {
        if (!btn.getAttribute('data-orig-text')) {
          btn.setAttribute('data-orig-text', btn.textContent);
        }
        btn.classList.add('active');
        btn.textContent = 'Selected';
      }

      const tierKey = card.getAttribute('data-tier');
      currentTierPrice = parseInt(card.getAttribute('data-price'), 10) || 1999;
      if (tierKey === 'classic') currentTierName = 'Classic Minimalist Edition';
      else if (tierKey === 'luxury') currentTierName = 'Ultra-Luxury Animated Edition';
      else if (tierKey === 'bespoke') currentTierName = 'Haute Couture Bespoke Signature';

      updatePricing();
      showLuxuryToast(`Package selected: ${currentTierName}`);
    };

    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
        selectTier();
      }
    });

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectTier();
      });
    }
  });

  addonChecks.forEach(check => {
    check.addEventListener('change', () => {
      updatePricing();
    });
  });

  // Initial calculation
  updatePricing();
})();

// ========================================================
// FEATURE 3: FLOATING AMBIENT MUSIC PLAYER WITH SYNTHESIZER
// ========================================================
(function initAmbientPlayer() {
  const playBtn = document.getElementById('floating-play-btn');
  const playIcon = document.getElementById('floating-play-icon');
  const waveBars = document.getElementById('floating-wave-bars');
  const trackNameEl = document.getElementById('floating-track-name');
  const trackMenuBtn = document.getElementById('track-menu-btn');
  const trackPopupMenu = document.getElementById('track-popup-menu');
  const trackItems = document.querySelectorAll('.track-item');

  if (!playBtn) return;

  let isPlaying = false;
  let currentSound = 'sitar';
  let audioCtx = null;
  let synthInterval = null;

  // Sound raga note tables (frequencies in Hz)
  const soundScales = {
    sitar: [220, 247.5, 277.18, 329.63, 370, 440, 495, 554.37], // Raga Yaman / Kalyani
    guitar: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C Major Pentatonic
    synth: [174.61, 220.00, 261.63, 329.63, 392.00, 440.00], // Euphoria F Major
    violin: [293.66, 369.99, 440.00, 554.37, 587.33, 659.25] // D Major Harmonics
  };

  const trackTitleMap = {
    sitar: 'Royal Sitar & Shehnai Raga',
    guitar: 'Acoustic Romance Melody',
    synth: 'Celebration Euphoria Rhythms',
    violin: 'Sacred Violin Harmony'
  };

  function playAmbientNote(freq, type = 'sine') {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.0);
    } catch (err) {
      // Ignore audio synthesis restrictions
    }
  }

  function startSynthesizer() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const scale = soundScales[currentSound] || soundScales.sitar;
    let step = 0;

    synthInterval = setInterval(() => {
      const noteFreq = scale[step % scale.length];
      const harmonic = scale[(step + 2) % scale.length] * 0.5;

      const oscType = currentSound === 'sitar' ? 'triangle' : currentSound === 'violin' ? 'sawtooth' : 'sine';
      playAmbientNote(noteFreq, oscType);
      if (step % 2 === 0) {
        playAmbientNote(harmonic, 'sine');
      }

      step++;
    }, 600);
  }

  function stopSynthesizer() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
      startSynthesizer();
      if (playIcon) playIcon.className = 'fas fa-pause';
      if (waveBars) waveBars.classList.add('playing');
      showLuxuryToast(`🎵 Playing: ${trackTitleMap[currentSound]}`);
    } else {
      stopSynthesizer();
      if (playIcon) playIcon.className = 'fas fa-play';
      if (waveBars) waveBars.classList.remove('playing');
      showLuxuryToast('🔇 Celebration Music Paused');
    }
  }

  playBtn.addEventListener('click', togglePlay);

  // Track popup menu toggle
  if (trackMenuBtn && trackPopupMenu) {
    trackMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      trackPopupMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      trackPopupMenu.classList.remove('show');
    });
  }

  trackItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      trackItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentSound = item.getAttribute('data-sound');

      if (trackNameEl) {
        trackNameEl.textContent = trackTitleMap[currentSound] || 'Celebration Soundtrack';
      }

      if (trackPopupMenu) {
        trackPopupMenu.classList.remove('show');
      }

      if (isPlaying) {
        stopSynthesizer();
        startSynthesizer();
      }

      showLuxuryToast(`Melody changed: ${trackTitleMap[currentSound]}`);
    });
  });
})();

