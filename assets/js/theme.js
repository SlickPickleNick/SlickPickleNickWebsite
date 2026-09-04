/**
 * Dynamic Theme Switcher Engine - SlickPickleNick Website
 * Supports animated transitions between Light Mode & Dark Mode with persistence.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'spn_theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';
  let isTransitioning = false;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? THEME_LIGHT
      : THEME_DARK;
  }

  function applyTheme(theme, animate = false) {
    if (animate && !isTransitioning) {
      isTransitioning = true;
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
        isTransitioning = false;
      }, 450);
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeButtons(theme);
  }

  function updateThemeButtons(theme) {
    const isDark = theme === THEME_DARK;
    const buttons = document.querySelectorAll('.theme-toggle-btn');

    buttons.forEach((btn) => {
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');

      // Only set innerHTML if not already formatted with modern animated icons
      if (!btn.querySelector('.theme-icon-wrap')) {
        btn.innerHTML = `
          <div class="theme-icon-wrap" aria-hidden="true">
            <svg class="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg class="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        `;
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || THEME_DARK;
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(newTheme, true);
  }

  // Early theme initialization
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme, false);

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeButtons(initialTheme);
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? THEME_LIGHT : THEME_DARK, true);
        }
      });
    }
  });

  window.SPNTheme = {
    toggle: toggleTheme,
    get: () => document.documentElement.getAttribute('data-theme'),
    set: (t) => applyTheme(t, true)
  };
})();
