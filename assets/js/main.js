/**
 * Main Application Script - SlickPickleNick Website
 * Sliding navigation pill, mobile drawer, and active route controller.
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

  // Sliding Navigation Pill Indicator
  function setupSlidingNav() {
    const desktopNav = document.querySelector('.desktop-nav');
    if (!desktopNav) return;

    let pill = desktopNav.querySelector('.nav-sliding-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 'nav-sliding-pill';
      desktopNav.insertBefore(pill, desktopNav.firstChild);
    }

    const navLinks = desktopNav.querySelectorAll('.nav-link');
    let activeLink = desktopNav.querySelector('.nav-link.active') || navLinks[0];

    function movePillTo(targetLink) {
      if (!targetLink || !pill) return;
      const navRect = desktopNav.getBoundingClientRect();
      const linkRect = targetLink.getBoundingClientRect();

      const offsetLeft = linkRect.left - navRect.left;
      const linkWidth = linkRect.width;

      pill.style.transform = `translateX(${offsetLeft}px)`;
      pill.style.width = `${linkWidth}px`;
      pill.classList.add('visible');
    }

    // Initial positioning after DOM render
    requestAnimationFrame(() => {
      activeLink = desktopNav.querySelector('.nav-link.active') || navLinks[0];
      if (activeLink) {
        movePillTo(activeLink);
      }
    });

    // Hover glide across nav items
    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        movePillTo(link);
      });
    });

    // Return to active page on mouse leave
    desktopNav.addEventListener('mouseleave', () => {
      activeLink = desktopNav.querySelector('.nav-link.active') || navLinks[0];
      if (activeLink) {
        movePillTo(activeLink);
      }
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      activeLink = desktopNav.querySelector('.nav-link.active') || navLinks[0];
      if (activeLink) {
        movePillTo(activeLink);
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
    setupSlidingNav();
    setupMobileDrawer();
    setupAccordions();
  });
})();
