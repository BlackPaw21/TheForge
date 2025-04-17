// script.js
document.addEventListener('DOMContentLoaded', () => {
  // 0) Inject custom cursor
  const customCursor = document.createElement('div');
  customCursor.id = 'custom-cursor';
  const cursorImg = document.createElement('img');
  cursorImg.src = 'png/cursor.png';
  customCursor.appendChild(cursorImg);
  document.body.appendChild(customCursor);

  // 1) Fade‑in hero/logo/buttons
  document.body.classList.add('loaded');

  // 2) Typing effect 
  const text = '| Linux Tools | Windows Tools | Offensive Security |';
  const heroTextEl = document.getElementById('hero-text');
  let idx = 0;
  setTimeout(function type() {
    if (idx < text.length) {
      heroTextEl.textContent += text.charAt(idx++);
      setTimeout(type, 35);
    }
  }, 300);

  // 3) Custom cursor follows mouse
  document.addEventListener('mousemove', e => {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top  = `${e.clientY}px`;
  });

  // 4) Toggle cursor glow on click
  document.addEventListener('mousedown', e => {
    if (e.button === 1) { e.preventDefault(); return; }
    document.body.classList.add('clicking');
  });
  document.addEventListener('mouseup', e => {
    if (e.button === 1) { e.preventDefault(); return; }
    document.body.classList.remove('clicking');
  });
  window.addEventListener('auxclick', e => {
    if (e.button === 1) e.preventDefault();
  });

  // 5) Particle background with glow & fade‑out
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  const colors = ['#0f9','#fff','#0faa'];
  let particles = [];
  const maxParticles = 100;
  const margin       = 100;

  function initParticles() {
    particles = Array.from({ length: maxParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      vx: Math.random() - 0.5,
      vy: Math.random() - 0.5,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const dx = Math.min(p.x, canvas.width - p.x);
      const dy = Math.min(p.y, canvas.height - p.y);
      const d  = Math.min(dx, dy);
      let alpha = d < margin ? d / margin : 1;
      if (alpha <= 0) {
        p.x = margin + Math.random() * (canvas.width - 2 * margin);
        p.y = margin + Math.random() * (canvas.height - 2 * margin);
        alpha = 1;
      }
      ctx.shadowBlur  = 10;
      ctx.shadowColor = p.c;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  draw();

  // 6) Generate project cards
  const projects = [
    { title: 'RevChat',    description: 'A real-time communication chat application with a secret reverse shell.', url: 'https://github.com/wise02/RevChat',    platform: 'W' },
    { title: 'ZipCracker', description: 'A powerful script to brute force your way into any password protected zip or rar.', url: 'https://github.com/Wise02/ZipCracker', platform: 'W' },
    { title: 'PlaceHolder',description: 'A placeholder for my next project.',                                          url: 'https://github.com/wise02/PlaceHolder', platform: 'L' }
  ];
  const wGrid = document.querySelector('#windows-projects .project-grid');
  const lGrid = document.querySelector('#linux-projects .project-grid');
  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick   = () => window.open(p.url, '_blank');
    card.innerHTML = `<h3>${p.title}</h3><p>${p.description}</p>`;
    (p.platform === 'W' ? wGrid : lGrid).appendChild(card);
  });

  // 7) Show/Hide About on scroll bottom
  const about = document.getElementById('about');
  window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;
    about.classList.toggle('visible', atBottom);
  });

  // 8) Logo “Tap” Counter
  const logo = document.getElementById('hero-logo');
  let tapCount = 0, hideTimer;
  logo.addEventListener('click', () => {
    tapCount++;
    if (tapCount === 10) {
      const counter = document.createElement('div');
      counter.id = 'tap-counter';
      counter.textContent = `Taps: ${tapCount}`;
      document.body.appendChild(counter);
      setTimeout(() => counter.classList.add('visible'), 10);
    }
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

  // Back to Top button logic (50% of first section threshold)
const backBtn = document.getElementById('back-to-top');
const heroSection = document.getElementById('home');
let isVisible = false;

// compute threshold once (half of hero height)
const threshold = heroSection.offsetHeight * 0.5;

window.addEventListener('scroll', () => {
  const pastThreshold = window.scrollY > threshold;
  if (pastThreshold && !isVisible) {
    // pop in
    backBtn.style.display = 'flex';
    backBtn.classList.remove('hide');
    backBtn.classList.add('show');
    isVisible = true;
  } 
  else if (!pastThreshold && isVisible) {
    // pop out
    backBtn.classList.remove('show');
    backBtn.classList.add('hide');
    isVisible = false;
  }
});

// after jumpOut animation, hide and reset
backBtn.addEventListener('animationend', e => {
  if (e.animationName === 'jumpOut') {
    backBtn.style.display = 'none';
    backBtn.classList.remove('hide');
  }
});

// click to scroll up
backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


  // 9) Mobile: override About‑Me link to scroll to footer
  const aboutBtn = document.querySelector('a[href="#about"]');
  aboutBtn.addEventListener('click', e => {
    if (matchMedia('(hover: none), (pointer: coarse)').matches) {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });
});
