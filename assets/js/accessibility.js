/**
 * Accessibility Manager - SlickPickleNick Official Website
 * Provides comprehensive accessible tools across Content, Color, and Orientation modules.
 * Features an expandable side drawer allowing live page preview, scrollable sections, and persistence.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'spn_a11y_prefs';

  const defaultPrefs = {
    // Content Modules
    textSize: 'normal',       // 'normal' | 'large' | 'xlarge' | 'xxlarge'
    dyslexic: false,          // boolean
    lineHeight: 'normal',     // 'normal' | 'relaxed' | 'loose'
    bigCursor: 'none',        // 'none' | 'white' | 'black'
    letterSpacing: 'normal',  // 'normal' | 'wide' | 'wider'
    textAlign: 'left',        // 'left' | 'center' | 'justify'
    fontWeight: 'normal',     // 'normal' | 'bold'

    // Color Modules
    contrast: 'normal',       // 'normal' | 'light' | 'high'
    monochrome: false,        // boolean

    // Orientation Modules
    readingLine: false,       // boolean
    readingMask: false,       // boolean
    hideImages: false,        // boolean
    highlightContent: false,  // boolean
    stopAnimations: false,    // boolean
    highlightLinks: false     // boolean
  };

  let activePrefs = loadPrefs();
  let readingLineEl = null;
  let readingMaskEl = null;
  let lastActiveElement = null;

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

  function countActiveFeatures(prefs) {
    let count = 0;
    if (prefs.textSize !== 'normal') count++;
    if (prefs.dyslexic) count++;
    if (prefs.lineHeight !== 'normal') count++;
    if (prefs.bigCursor !== 'none') count++;
    if (prefs.letterSpacing !== 'normal') count++;
    if (prefs.textAlign !== 'left') count++;
    if (prefs.fontWeight !== 'normal') count++;
    if (prefs.contrast !== 'normal') count++;
    if (prefs.monochrome) count++;
    if (prefs.readingLine) count++;
    if (prefs.readingMask) count++;
    if (prefs.hideImages) count++;
    if (prefs.highlightContent) count++;
    if (prefs.stopAnimations) count++;
    if (prefs.highlightLinks) count++;
    return count;
  }

  function applyPrefs(prefs) {
    const html = document.documentElement;

    // Content Modules
    html.setAttribute('data-text-size', prefs.textSize || 'normal');
    html.setAttribute('data-dyslexic', prefs.dyslexic ? 'true' : 'false');
    html.setAttribute('data-line-height', prefs.lineHeight || 'normal');
    html.setAttribute('data-big-cursor', prefs.bigCursor || 'none');
    html.setAttribute('data-letter-spacing', prefs.letterSpacing || 'normal');
    html.setAttribute('data-text-align', prefs.textAlign || 'left');
    html.setAttribute('data-font-weight', prefs.fontWeight || 'normal');

    // Color Modules
    html.setAttribute('data-contrast', prefs.contrast || 'normal');
    html.setAttribute('data-monochrome', prefs.monochrome ? 'true' : 'false');

    // Orientation Modules
    html.setAttribute('data-reading-line', prefs.readingLine ? 'true' : 'false');
    html.setAttribute('data-reading-mask', prefs.readingMask ? 'true' : 'false');
    html.setAttribute('data-hide-images', prefs.hideImages ? 'true' : 'false');
    html.setAttribute('data-highlight-content', prefs.highlightContent ? 'true' : 'false');
    html.setAttribute('data-reduced-motion', prefs.stopAnimations ? 'true' : 'false');
    html.setAttribute('data-highlight-links', prefs.highlightLinks ? 'true' : 'false');

    // Orientation overlays
    updateOrientationOverlays(prefs);

    // Update UI controls
    updateUIControls(prefs);
  }

  function updateOrientationOverlays(prefs) {
    // Reading Line element
    if (prefs.readingLine) {
      if (!readingLineEl) {
        readingLineEl = document.createElement('div');
        readingLineEl.id = 'a11y-reading-line';
        readingLineEl.className = 'a11y-reading-line';
        readingLineEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(readingLineEl);
      }
    }

    // Reading Mask element
    if (prefs.readingMask) {
      if (!readingMaskEl) {
        readingMaskEl = document.createElement('div');
        readingMaskEl.id = 'a11y-reading-mask';
        readingMaskEl.className = 'a11y-reading-mask';
        readingMaskEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(readingMaskEl);
      }
    }
  }

  function handlePointerMove(e) {
    const y = e.clientY;
    if (readingLineEl && activePrefs.readingLine) {
      readingLineEl.style.top = y + 'px';
    }
    if (readingMaskEl && activePrefs.readingMask) {
      readingMaskEl.style.top = y + 'px';
    }
  }

  function updateUIControls(prefs) {
    // 1. Text Size
    document.querySelectorAll('[data-a11y-size]').forEach((btn) => {
      const size = btn.getAttribute('data-a11y-size');
      const active = (size === prefs.textSize);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 2. Dyslexic Font Toggle
    const dyslexicSwitch = document.getElementById('a11y-dyslexic-toggle');
    if (dyslexicSwitch) dyslexicSwitch.checked = !!prefs.dyslexic;

    // 3. Line Height
    document.querySelectorAll('[data-a11y-lineheight]').forEach((btn) => {
      const lh = btn.getAttribute('data-a11y-lineheight');
      const active = (lh === prefs.lineHeight);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 4. Big Cursor
    document.querySelectorAll('[data-a11y-cursor]').forEach((btn) => {
      const cursor = btn.getAttribute('data-a11y-cursor');
      const active = (cursor === prefs.bigCursor);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 5. Letter Spacing
    document.querySelectorAll('[data-a11y-spacing]').forEach((btn) => {
      const sp = btn.getAttribute('data-a11y-spacing');
      const active = (sp === prefs.letterSpacing);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 6. Text Alignment
    document.querySelectorAll('[data-a11y-align]').forEach((btn) => {
      const align = btn.getAttribute('data-a11y-align');
      const active = (align === prefs.textAlign);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 7. Font Weight Toggle
    const fontWeightSwitch = document.getElementById('a11y-fontweight-toggle');
    if (fontWeightSwitch) fontWeightSwitch.checked = (prefs.fontWeight === 'bold');

    // 8. Contrast
    document.querySelectorAll('[data-a11y-contrast]').forEach((btn) => {
      const contrast = btn.getAttribute('data-a11y-contrast');
      const active = (contrast === prefs.contrast);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 9. Monochrome Toggle
    const monoSwitch = document.getElementById('a11y-mono-toggle');
    if (monoSwitch) monoSwitch.checked = !!prefs.monochrome;

    // 10. Reading Line Toggle
    const readingLineSwitch = document.getElementById('a11y-readingline-toggle');
    if (readingLineSwitch) readingLineSwitch.checked = !!prefs.readingLine;

    // 11. Reading Mask Toggle
    const readingMaskSwitch = document.getElementById('a11y-readingmask-toggle');
    if (readingMaskSwitch) readingMaskSwitch.checked = !!prefs.readingMask;

    // 12. Hide Images Toggle
    const hideImagesSwitch = document.getElementById('a11y-hideimages-toggle');
    if (hideImagesSwitch) hideImagesSwitch.checked = !!prefs.hideImages;

    // 13. Highlight Content Toggle
    const highlightContentSwitch = document.getElementById('a11y-highlightcontent-toggle');
    if (highlightContentSwitch) highlightContentSwitch.checked = !!prefs.highlightContent;

    // 14. Stop Animations Toggle
    const motionSwitch = document.getElementById('a11y-motion-toggle');
    if (motionSwitch) motionSwitch.checked = !!prefs.stopAnimations;

    // 15. Highlight Links Toggle
    const linksSwitch = document.getElementById('a11y-links-toggle');
    if (linksSwitch) linksSwitch.checked = !!prefs.highlightLinks;

    // Active Feature Badge Counter
    const activeCount = countActiveFeatures(prefs);
    const badgeCount = document.getElementById('a11y-active-count');
    if (badgeCount) {
      if (activeCount > 0) {
        badgeCount.textContent = activeCount;
        badgeCount.style.display = 'flex';
      } else {
        badgeCount.style.display = 'none';
      }
    }
  }

  // Accessibility Side Drawer Management
  function setupDrawer() {
    const drawer = document.getElementById('a11y-drawer');
    const openBtns = document.querySelectorAll('.a11y-toggle-btn, .a11y-floating-btn');
    const closeBtn = document.getElementById('a11y-drawer-close');
    const floatingBtn = document.getElementById('a11y-floating-trigger');

    if (!drawer) return;

    function openDrawer(triggerElement) {
      lastActiveElement = triggerElement || document.activeElement;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (floatingBtn) floatingBtn.setAttribute('aria-expanded', 'true');
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (floatingBtn) floatingBtn.setAttribute('aria-expanded', 'false');
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    function toggleDrawer(triggerElement) {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer(triggerElement);
      }
    }

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer(btn);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
      });
    }

    // Close on click outside drawer
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open')) {
        const isClickInside = drawer.contains(e.target);
        let isClickTrigger = false;
        openBtns.forEach((btn) => {
          if (btn.contains(e.target)) isClickTrigger = true;
        });

        if (!isClickInside && !isClickTrigger) {
          closeDrawer();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
      // Alt + A shortcut to toggle accessibility menu
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        toggleDrawer(floatingBtn);
      }
    });
  }

  // Bind All Control Events
  function bindControls() {
    // 1. Text Size
    document.querySelectorAll('[data-a11y-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePrefs.textSize = btn.getAttribute('data-a11y-size');
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    });

    // 2. Readable Font (Dyslexic)
    const dyslexicSwitch = document.getElementById('a11y-dyslexic-toggle');
    if (dyslexicSwitch) {
      dyslexicSwitch.addEventListener('change', (e) => {
        activePrefs.dyslexic = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 3. Line Height
    document.querySelectorAll('[data-a11y-lineheight]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePrefs.lineHeight = btn.getAttribute('data-a11y-lineheight');
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    });

    // 4. Big Cursor
    document.querySelectorAll('[data-a11y-cursor]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePrefs.bigCursor = btn.getAttribute('data-a11y-cursor');
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    });

    // 5. Letter Spacing
    document.querySelectorAll('[data-a11y-spacing]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePrefs.letterSpacing = btn.getAttribute('data-a11y-spacing');
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    });

    // 6. Text Alignment
    document.querySelectorAll('[data-a11y-align]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePrefs.textAlign = btn.getAttribute('data-a11y-align');
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    });

    // 7. Font Weight
    const fontWeightSwitch = document.getElementById('a11y-fontweight-toggle');
    if (fontWeightSwitch) {
      fontWeightSwitch.addEventListener('change', (e) => {
        activePrefs.fontWeight = e.target.checked ? 'bold' : 'normal';
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 8. Contrast
    document.querySelectorAll('[data-a11y-contrast]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePrefs.contrast = btn.getAttribute('data-a11y-contrast');
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    });

    // 9. Monochrome
    const monoSwitch = document.getElementById('a11y-mono-toggle');
    if (monoSwitch) {
      monoSwitch.addEventListener('change', (e) => {
        activePrefs.monochrome = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 10. Reading Line
    const readingLineSwitch = document.getElementById('a11y-readingline-toggle');
    if (readingLineSwitch) {
      readingLineSwitch.addEventListener('change', (e) => {
        activePrefs.readingLine = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 11. Reading Mask
    const readingMaskSwitch = document.getElementById('a11y-readingmask-toggle');
    if (readingMaskSwitch) {
      readingMaskSwitch.addEventListener('change', (e) => {
        activePrefs.readingMask = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 12. Hide Images
    const hideImagesSwitch = document.getElementById('a11y-hideimages-toggle');
    if (hideImagesSwitch) {
      hideImagesSwitch.addEventListener('change', (e) => {
        activePrefs.hideImages = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 13. Highlight Content
    const highlightContentSwitch = document.getElementById('a11y-highlightcontent-toggle');
    if (highlightContentSwitch) {
      highlightContentSwitch.addEventListener('change', (e) => {
        activePrefs.highlightContent = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 14. Stop Animations
    const motionSwitch = document.getElementById('a11y-motion-toggle');
    if (motionSwitch) {
      motionSwitch.addEventListener('change', (e) => {
        activePrefs.stopAnimations = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // 15. Highlight Links
    const linksSwitch = document.getElementById('a11y-links-toggle');
    if (linksSwitch) {
      linksSwitch.addEventListener('change', (e) => {
        activePrefs.highlightLinks = e.target.checked;
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }

    // Reset All Settings
    const resetBtn = document.getElementById('a11y-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activePrefs = { ...defaultPrefs };
        savePrefs(activePrefs);
        applyPrefs(activePrefs);
      });
    }
  }

  // Early initialization
  applyPrefs(activePrefs);

  // Pointer tracking for Reading Line & Mask
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('mousemove', handlePointerMove, { passive: true });

  // DOM ready binding
  document.addEventListener('DOMContentLoaded', () => {
    setupDrawer();
    bindControls();
    updateUIControls(activePrefs);
  });

  window.SPNAccessibility = {
    get: loadPrefs,
    apply: applyPrefs,
    reset: () => {
      activePrefs = { ...defaultPrefs };
      savePrefs(activePrefs);
      applyPrefs(activePrefs);
    }
  };
})();
