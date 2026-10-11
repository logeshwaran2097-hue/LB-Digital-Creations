// ===== LOADING SCREEN =====
function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  }
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 800);
});
// Fallback so page content is never blocked if load event already occurred
setTimeout(hideLoader, 1800);

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

// ========================================================
// HERO EDITORIAL SHOWCASE INTERACTION
// ========================================================
(function initHeroShowcase() {
  const pills = document.querySelectorAll('.showcase-nav-pills .nav-pill-btn');
  const cards = document.querySelectorAll('.editorial-card');
  const track = document.getElementById('hero-carousel-track');

  if (!pills.length || !cards.length) return;

  function setActiveCategory(category) {
    pills.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === category);
    });

    cards.forEach(card => {
      const match = card.getAttribute('data-category') === category;
      card.classList.toggle('active', match);
      if (match && track && window.innerWidth <= 992) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetCat = pill.getAttribute('data-target');
      setActiveCategory(targetCat);
    });
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const cat = card.getAttribute('data-category');
      pills.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === cat);
      });
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
})();


