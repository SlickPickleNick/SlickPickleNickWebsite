/**
 * Main Application Script - SlickPickleNick Website
 * Global navigation, drawer management, and active route handling.
 */

(function () {
  'use strict';

  // Highlight current page in navigation
  function highlightActiveRoute() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link, .drawer-link');

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

  // Mobile Navigation Drawer
  function setupMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-drawer-close');
    const backdrop = document.querySelector('.drawer-backdrop');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (!drawer || !toggleBtn) return;

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggleBtn.focus();
    }

    toggleBtn.addEventListener('click', openDrawer);

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Accordions enhancement
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
    setupMobileDrawer();
    setupAccordions();
  });
})();
