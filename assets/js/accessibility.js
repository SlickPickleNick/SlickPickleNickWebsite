/**
 * Accessibility Manager - SlickPickleNick Website
 * Provides user customization menu for font sizes, dyslexic fonts, high contrast,
 * link highlights, reduced motion, and persistence.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'spn_a11y_prefs';

  const defaultPrefs = {
    textSize: 'normal',       // 'normal' | 'large' | 'xlarge'
    dyslexic: false,          // boolean
    contrast: 'normal',       // 'normal' | 'high'
    highlightLinks: false,    // boolean
    reducedMotion: false,     // boolean
    monochrome: false         // boolean
  };

  function loadPrefs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : { ...defaultPrefs };
    } catch (e) {
      return { ...defaultPrefs };
    }
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Could not save a11y preferences', e);
    }
  }

  function applyPrefs(prefs) {
    const html = document.documentElement;

    // Text Size
    html.setAttribute('data-text-size', prefs.textSize);

    // Dyslexic Font
    html.setAttribute('data-dyslexic', prefs.dyslexic ? 'true' : 'false');

    // High Contrast
    html.setAttribute('data-contrast', prefs.contrast);

    // Highlight Links
    html.setAttribute('data-highlight-links', prefs.highlightLinks ? 'true' : 'false');

    // Reduced Motion
    html.setAttribute('data-reduced-motion', prefs.reducedMotion ? 'true' : 'false');

    // Monochrome
    html.setAttribute('data-monochrome', prefs.monochrome ? 'true' : 'false');

    // Update UI controls
    updateUIControls(prefs);
  }

  function updateUIControls(prefs) {
    // Text size buttons
    document.querySelectorAll('[data-a11y-size]').forEach((btn) => {
      const size = btn.getAttribute('data-a11y-size');
      if (size === prefs.textSize) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Contrast buttons
    document.querySelectorAll('[data-a11y-contrast]').forEach((btn) => {
      const contrast = btn.getAttribute('data-a11y-contrast');
      if (contrast === prefs.contrast) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Switches
    const dyslexicSwitch = document.getElementById('a11y-dyslexic-toggle');
    if (dyslexicSwitch) dyslexicSwitch.checked = prefs.dyslexic;

    const linksSwitch = document.getElementById('a11y-links-toggle');
    if (linksSwitch) linksSwitch.checked = prefs.highlightLinks;

    const motionSwitch = document.getElementById('a11y-motion-toggle');
    if (motionSwitch) motionSwitch.checked = prefs.reducedMotion;

    const monoSwitch = document.getElementById('a11y-mono-toggle');
    if (monoSwitch) monoSwitch.checked = prefs.monochrome;
  }

  // Accessibility Modal Management
  function setupModal() {
    const backdrop = document.getElementById('a11y-modal-backdrop');
    const openBtns = document.querySelectorAll('.a11y-toggle-btn');
    const closeBtn = document.getElementById('a11y-modal-close');

    if (!backdrop) return;

    function openModal() {
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
    }

    openBtns.forEach((btn) => {
      btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Bind controls
  function bindControls() {
    let prefs = loadPrefs();

    // Text Size Options
    document.querySelectorAll('[data-a11y-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        prefs.textSize = btn.getAttribute('data-a11y-size');
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    });

    // Contrast Options
    document.querySelectorAll('[data-a11y-contrast]').forEach((btn) => {
      btn.addEventListener('click', () => {
        prefs.contrast = btn.getAttribute('data-a11y-contrast');
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    });

    // Toggle Switches
    const dyslexicSwitch = document.getElementById('a11y-dyslexic-toggle');
    if (dyslexicSwitch) {
      dyslexicSwitch.addEventListener('change', (e) => {
        prefs.dyslexic = e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    const linksSwitch = document.getElementById('a11y-links-toggle');
    if (linksSwitch) {
      linksSwitch.addEventListener('change', (e) => {
        prefs.highlightLinks = e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    const motionSwitch = document.getElementById('a11y-motion-toggle');
    if (motionSwitch) {
      motionSwitch.addEventListener('change', (e) => {
        prefs.reducedMotion = e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    const monoSwitch = document.getElementById('a11y-mono-toggle');
    if (monoSwitch) {
      monoSwitch.addEventListener('change', (e) => {
        prefs.monochrome = e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    // Reset Defaults
    const resetBtn = document.getElementById('a11y-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        prefs = { ...defaultPrefs };
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }
  }

  // Early initialization of saved preferences
  const currentPrefs = loadPrefs();
  applyPrefs(currentPrefs);

  // Bind on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    setupModal();
    bindControls();
    updateUIControls(currentPrefs);
  });

  window.SPNAccessibility = {
    get: loadPrefs,
    apply: applyPrefs,
    reset: () => applyPrefs(defaultPrefs)
  };
})();
