/* ═══════════════════════════════════
   Maalik — main.js  v2.0
═══════════════════════════════════ */

/* ── Nav scroll effect ── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile hamburger ── */
(function () {
  const btn    = document.getElementById('navHamburger');
  const mobile = document.getElementById('navMobile');
  if (!btn || !mobile) return;
  btn.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    mobile.setAttribute('aria-hidden', String(!open));
  });
  mobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobile.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      mobile.setAttribute('aria-hidden', 'true');
    });
  });
})();

/* ── Smooth anchor scroll with nav offset ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH - 8,
        behavior: 'smooth'
      });
    });
  });
})();

/* ── Scroll reveal ── */
(function () {
  const targets = document.querySelectorAll(
    '.wwd-card, .stage-card, .aud-card, .value-card, .pillar-item, .service-row, .tl-row, .not-col, .cta-block, .split-text, .split-visual, .reality-col, .reality-left, .philosophy-left, .philosophy-right, .inst-card, .dept-card, .h-hook-col'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 55}ms`;
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => io.observe(el));
})();

/* ── Hero particle canvas ── */
(function () {
  const container = document.getElementById('heroCanvas');
  if (!container) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';

  const dpr = window.devicePixelRatio || 1;
  let W, H, particles = [];
  const COUNT = 55;

  const resize = () => {
    W = container.offsetWidth;
    H = container.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
    init();
  };

  const init = () => {
    particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      a:  Math.random() * 0.4 + 0.08,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - d / 100) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${p.a})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
  };

  let raf;
  const loop = () => { draw(); raf = requestAnimationFrame(loop); };
  window.addEventListener('resize', () => { cancelAnimationFrame(raf); resize(); loop(); });
  resize(); loop();
})();

/* ── Stats counter animation ── */
(function () {
  const statItems = document.querySelectorAll('.stat-item[id]');
  if (!statItems.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (numEl, target, duration = 1800) => {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      numEl.textContent = value;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const numEl = el.querySelector('.stat-num');
      const target = parseInt(numEl?.getAttribute('data-target') || '0', 10);
      if (numEl && target > 0) animateCounter(numEl, target);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => io.observe(el));
})();

/* ── Terminal typewriter ── */
(function () {
  const terminal = document.getElementById('terminalBody');
  if (!terminal) return;
  const rows = terminal.querySelectorAll('.t-row');
  rows.forEach(r => { r.style.opacity = '0'; r.style.transform = 'translateX(-6px)'; });
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    rows.forEach((row, i) => {
      setTimeout(() => {
        row.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
      }, i * 180);
    });
  }, { threshold: 0.5 });
  io.observe(terminal);
})();

/* ── Hero text entrance ── */
(function () {
  const targets = [
    { sel: '.hero-eyebrow', delay: 0 },
    { sel: '.hero-headline', delay: 100 },
    { sel: '.hero-tagline',  delay: 200 },
    { sel: '.hero-desc',     delay: 300 },
    { sel: '.hero-actions',  delay: 420 },
  ];
  targets.forEach(({ sel, delay }) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay + 80);
  });
})();

/* ── Active nav link highlight on scroll ── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const NAV_H = 80;

  const highlight = () => {
    let current = '';
    sections.forEach(s => {
      if (s.getBoundingClientRect().top <= NAV_H + 60) current = s.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.style.color = (href === `#${current}`) ? '#fff' : '';
    });
  };
  window.addEventListener('scroll', highlight, { passive: true });
})();

/* ── Contact Modal Interactivity ── */
(function () {
  const modal = document.getElementById('contactModal');
  const closeBtn = document.getElementById('modalClose');
  const doneBtn = document.getElementById('modalDone');
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('modalSuccess');
  const pathSelect = document.getElementById('formPath');

  if (!modal || !form) return;

  const openModal = (pathValue = 'general') => {
    if (pathSelect && pathValue) {
      pathSelect.value = pathValue;
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (form) form.style.display = 'flex';
    if (successBox) successBox.classList.remove('active');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Bind trigger buttons
  document.querySelectorAll('#nav-contact, #cta-learn, #cta-build, #learn-detail-cta, #build-detail-cta, a[href="mailto:hello@maalik.com"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let path = 'general';
      if (btn.id === 'cta-learn' || btn.id === 'learn-detail-cta') path = 'learn';
      if (btn.id === 'cta-build' || btn.id === 'build-detail-cta') path = 'build';
      openModal(path);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    if (successBox) successBox.classList.add('active');
    form.reset();
  });
})();


