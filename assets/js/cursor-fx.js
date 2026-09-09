/**
 * Interactive Cursor & Launch Stage Visual Effects
 * Constellation particle canvas, mouse-follow spotlight, and 3D card perspective tilt.
 * Electric Blue Theme with full Light & Dark mode support.
 * SlickPickleNick Website
 */

(function () {
  'use strict';

  function isReducedMotion() {
    return (
      document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    );
  }

  function isLightMode() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  // ---------------------------------------------------------------------------
  // 1. Constellation Particle Canvas (Theme-Aware Electric Blue)
  // ---------------------------------------------------------------------------
  function initParticleCanvas() {
    const canvas = document.getElementById('hero-fx-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stage = canvas.closest('.launch-hero-stage') || canvas.parentElement;
    let animId = null;
    let width = 0;
    let height = 0;

    // Mouse coordinates relative to canvas
    const mouse = { x: -1000, y: -1000, active: false };

    function resize() {
      if (!stage) return;
      width = canvas.width = stage.offsetWidth;
      height = canvas.height = stage.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Track mouse over launch hero stage
    stage.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    stage.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Generate balanced particle field
    const count = Math.min(Math.floor((width * height) / 15000), 70);
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * (width || 800),
        y: Math.random() * (height || 500),
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.45 + 0.3,
      });
    }

    function draw() {
      if (isReducedMotion()) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const light = isLightMode();

      // Theme-specific colors
      const nodeColor = light ? '37, 99, 235' : '96, 165, 250';
      const lineColor = light ? '37, 99, 235' : '59, 130, 246';
      const glowColor = light ? 'rgba(37, 99, 235, 0.25)' : '#3b82f6';
      const alphaMult = light ? 0.65 : 1;

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off canvas boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle attraction towards cursor when active
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 10) {
            p.x += (dx / dist) * 0.4;
            p.y += (dy / dist) * 0.4;
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor}, ${p.baseAlpha * alphaMult})`;
        ctx.shadowBlur = light ? 4 : 8;
        ctx.shadowColor = glowColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * (light ? 0.18 : 0.28);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to cursor
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 150) {
            const mAlpha = (1 - mdist / 150) * (light ? 0.35 : 0.48);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${nodeColor}, ${mAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    // Pause/resume on accessibility reduced motion or theme change
    const observer = new MutationObserver(() => {
      if (isReducedMotion()) {
        if (animId) cancelAnimationFrame(animId);
        ctx.clearRect(0, 0, width, height);
      } else {
        cancelAnimationFrame(animId);
        draw();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-reduced-motion', 'data-theme'] });
  }

  // ---------------------------------------------------------------------------
  // 2. Mouse-Follow Ambient Spotlight
  // ---------------------------------------------------------------------------
  function initAmbientSpotlight() {
    const stage = document.querySelector('.launch-hero-stage');
    const spotlight = document.getElementById('hero-ambient-spotlight');
    if (!stage || !spotlight) return;

    let targetX = stage.offsetWidth / 2;
    let targetY = stage.offsetHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      spotlight.style.opacity = '1';
    });

    stage.addEventListener('mouseleave', () => {
      targetX = stage.offsetWidth / 2;
      targetY = stage.offsetHeight / 2;
      spotlight.style.opacity = '0.5';
    });

    function renderSpotlight() {
      if (!isReducedMotion()) {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        spotlight.style.left = `${currentX}px`;
        spotlight.style.top = `${currentY}px`;
      }
      requestAnimationFrame(renderSpotlight);
    }

    renderSpotlight();
  }

  // ---------------------------------------------------------------------------
  // 3. Dynamic Ambient Spotlight on Cards
  // ---------------------------------------------------------------------------
  function initCardSpotlight() {
    const cards = document.querySelectorAll('.portal-card, .explore-card');
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (isReducedMotion()) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initAmbientSpotlight();
    initCardSpotlight();
  });
})();
