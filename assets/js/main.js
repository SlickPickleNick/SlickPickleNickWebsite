/**
 * Main Application Script - SlickPickleNick Website
 * Navigation active routes, mobile dropdown menu, and UI controllers.
 */

(function () {
  'use strict';

  // Highlight current page in navigation
  function highlightActiveRoute() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link, .drawer-link, .mobile-dropdown-link');

    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = href.split('/').pop() || 'index.html';
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Mobile Navigation Dropdown Menu & Animated Hamburger Toggle
  function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const dropdown = document.getElementById('mobile-dropdown-menu');
    const legacyDrawer = document.getElementById('mobile-drawer');

    if (!toggleBtn) return;

    function openMenu() {
      toggleBtn.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (dropdown) {
        dropdown.classList.add('open');
        dropdown.setAttribute('aria-hidden', 'false');
      }
      if (legacyDrawer) {
        legacyDrawer.classList.add('open');
      }
    }

    function closeMenu() {
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (dropdown) {
        dropdown.classList.remove('open');
        dropdown.setAttribute('aria-hidden', 'true');
      }
      if (legacyDrawer) {
        legacyDrawer.classList.remove('open');
      }
    }

    function toggleMenu(e) {
      e.stopPropagation();
      const isOpen = toggleBtn.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    toggleBtn.addEventListener('click', toggleMenu);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && (!dropdown || !dropdown.contains(e.target))) {
        closeMenu();
      }
    });

    // Close on link click
    document.querySelectorAll('.mobile-dropdown-link, .drawer-link').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggleBtn.classList.contains('open')) {
        closeMenu();
        toggleBtn.focus();
      }
    });

    // Auto-close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900 && toggleBtn.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Accordion ARIA & Toggle Enhancement
  function setupAccordions() {
    document.querySelectorAll('details.accordion-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        const summary = item.querySelector('summary');
        if (summary) {
          summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    highlightActiveRoute();
    setupMobileMenu();
    setupAccordions();
  });
})();
