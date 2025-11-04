// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeroAnimations();
  initTypingEffect();
  initParticleBackground();
  initProjectCards();
  initNavigation();
  initBackToTop();
  initLogoTapCounter();
  initScrollAnimations();
});

// ===================================
// 0) CUSTOM CURSOR
// ===================================
function initCustomCursor() {
  const customCursor = document.createElement('div');
  customCursor.id = 'custom-cursor';
  const cursorImg = document.createElement('img');
  cursorImg.src = 'png/cursor.png';
  cursorImg.alt = 'Custom cursor';
  customCursor.appendChild(cursorImg);
  document.body.appendChild(customCursor);

  // Follow mouse movement
  document.addEventListener('mousemove', e => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  });

  // Glow effect on click
  document.addEventListener('mousedown', e => {
    if (e.button === 1) { e.preventDefault(); return; }
    document.body.classList.add('clicking');
  });

  document.addEventListener('mouseup', e => {
    if (e.button === 1) { e.preventDefault(); return; }
    document.body.classList.remove('clicking');
  });

  // Prevent middle-click
  window.addEventListener('auxclick', e => {
    if (e.button === 1) e.preventDefault();
  });
}

// ===================================
// 1) HERO ANIMATIONS
// ===================================
function initHeroAnimations() {
  // Trigger fade-in animations
  document.body.classList.add('loaded');
}

// ===================================
// 2) TYPING EFFECT
// ===================================
function initTypingEffect() {
  const text = '| Linux Tools | Windows Tools | Offensive Security |';
  const heroTextEl = document.getElementById('hero-text');
  let idx = 0;

  setTimeout(function type() {
    if (idx < text.length) {
      heroTextEl.textContent += text.charAt(idx++);
      setTimeout(type, 35);
    }
  }, 500);
}

// ===================================
// 3) PARTICLE BACKGROUND
// ===================================
function initParticleBackground() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const colors = ['#0f9', '#fff', '#0faa86'];
  let particles = [];
  const maxParticles = 100;
  const margin = 100;
  let animationId = null;

  function initParticles() {
    particles = Array.from({ length: maxParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Calculate distance from edges
      const dx = Math.min(p.x, canvas.width - p.x);
      const dy = Math.min(p.y, canvas.height - p.y);
      const d = Math.min(dx, dy);
      let alpha = d < margin ? d / margin : 1;

      // Respawn particles that fade out
      if (alpha <= 0) {
        p.x = margin + Math.random() * (canvas.width - 2 * margin);
        p.y = margin + Math.random() * (canvas.height - 2 * margin);
        alpha = 1;
      }

      // Draw particle with glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.c;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    animationId = requestAnimationFrame(draw);
  }

  // Pause animation when tab is not visible (performance optimization)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      draw();
    }
  });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  draw();
}

// ===================================
// 4) NAVIGATION
// ===================================
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(8px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Add active class to current section
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Add shadow to navbar on scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ===================================
// 5) PROJECT CARDS
// ===================================
function initProjectCards() {
  const projects = [
    {
      title: 'Bundler',
      description: 'A universal link bundler for everyday use.',
      url: 'https://github.com/BlackPaw21/Bundler',
      platform: 'W'
    },
    {
      title: 'RevChat',
      description: 'A real-time communication chat application with a secret reverse shell.',
      url: 'https://github.com/wise02/RevChat',
      platform: 'W'
    },
    {
      title: 'ZipCracker',
      description: 'A powerful script to brute force your way into any password protected zip or rar.',
      url: 'https://github.com/Wise02/ZipCracker',
      platform: 'W'
    },
    {
      title: 'HellCat',
      description: 'An easy to use wrapper for HashCat on windows.',
      url: 'https://github.com/BlackPaw21/HellCat',
      platform: 'W'
    },
    {
      title: 'KaliQuickFix',
      description: 'Never have to type --fix-missing or --break-system-packages again!',
      url: 'https://github.com/BlackPaw21/KaliQuickFix',
      platform: 'L'
    },
    {
      title: 'TheListener',
      description: 'A strong MITM attack that will reveal HTTP/HTTPS requests on the connected network.',
      url: 'https://github.com/BlackPaw21/TheListener',
      platform: 'L'
    }
  ];

  const wGrid = document.querySelector('#windows-projects .project-grid');
  const lGrid = document.querySelector('#linux-projects .project-grid');

  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${p.title} on GitHub`);

    card.onclick = () => window.open(p.url, '_blank', 'noopener');

    // Keyboard accessibility
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(p.url, '_blank', 'noopener');
      }
    };

    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.description}</p>
    `;

    (p.platform === 'W' ? wGrid : lGrid).appendChild(card);
  });
}

// ===================================
// 6) BACK TO TOP BUTTON
// ===================================
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  const heroSection = document.getElementById('home');
  let isVisible = false;
  let threshold = 0;

  // Calculate threshold after load
  setTimeout(() => {
    threshold = heroSection.offsetHeight * 0.5;
  }, 100);

  window.addEventListener('scroll', () => {
    const pastThreshold = window.scrollY > threshold;

    if (pastThreshold && !isVisible) {
      backBtn.style.display = 'flex';
      backBtn.classList.remove('hide');
      backBtn.classList.add('show');
      isVisible = true;
    } else if (!pastThreshold && isVisible) {
      backBtn.classList.remove('show');
      backBtn.classList.add('hide');
      isVisible = false;
    }
  });

  // Hide after animation
  backBtn.addEventListener('animationend', e => {
    if (e.animationName === 'jumpOut') {
      backBtn.style.display = 'none';
      backBtn.classList.remove('hide');
    }
  });

  // Scroll to top on click
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Keyboard accessibility
  backBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ===================================
// 7) LOGO TAP COUNTER (Easter Egg)
// ===================================
function initLogoTapCounter() {
  const logo = document.getElementById('hero-logo');
  let tapCount = 0;
  let hideTimer;

  logo.addEventListener('click', () => {
    tapCount++;

    // Create counter at 10 taps
    if (tapCount === 10) {
      const counter = document.createElement('div');
      counter.id = 'tap-counter';
      counter.textContent = `Taps: ${tapCount}`;
      document.body.appendChild(counter);
      setTimeout(() => counter.classList.add('visible'), 10);
    }

    // Update counter
    const counterEl = document.getElementById('tap-counter');
    if (counterEl) {
      counterEl.textContent = `Taps: ${tapCount}`;
      counterEl.classList.remove('fade-out');
      clearTimeout(hideTimer);

      hideTimer = setTimeout(() => {
        counterEl.classList.add('fade-out');
        setTimeout(() => {
          counterEl.remove();
          tapCount = 0;
        }, 500);
      }, 3000);
    }
  });
}

// ===================================
// 8) SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe sections for scroll animations
  const animatedElements = document.querySelectorAll('.section:not(.hero)');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Make visible sections fully visible
  const style = document.createElement('style');
  style.textContent = `
    .section.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
