/**
 * Page & Section Transition Engine
 * Native View Transitions, scroll-triggered section reveals, and beta environment indicator.
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

  // ---------------------------------------------------------------------------
  // 1. In-Page Section Scroll Reveal System
  // ---------------------------------------------------------------------------
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .stagger-reveal');
    if (!revealElements.length) return;

    if (isReducedMotion() || !('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 60px 0px',
      }
    );

    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        observer.observe(el);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. Beta Environment Detection & Indicator
  // ---------------------------------------------------------------------------
  function setupBetaIndicator() {
    const isBetaPath = window.location.pathname.includes('/beta/') || window.location.hostname.includes('beta');
    if (!isBetaPath) return;

    const brandLink = document.querySelector('.brand-link');
    if (!brandLink || document.querySelector('.beta-indicator-badge') || document.querySelector('.beta-indicator-pill')) return;

    const betaBadge = document.createElement('a');
    betaBadge.className = 'beta-indicator-badge';
    betaBadge.href = '../index.html';
    betaBadge.title = 'You are previewing the Beta staging release. Click to switch to the Main production release.';
    betaBadge.innerHTML = '<span class="beta-dot" aria-hidden="true"></span><span>Beta Staging</span>';

    brandLink.parentElement.insertBefore(betaBadge, brandLink.nextSibling);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveal();
    setupBetaIndicator();
  });
})();
