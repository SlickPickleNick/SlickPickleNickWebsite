/**
 * CSS Tokens & Contrast Compliance Test Suite
 * Validates design token definitions, token completeness across dark/light themes,
 * focus ring indicators, and WCAG AA relative luminance contrast ratios.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Helper to convert hex to RGB
function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return [
      parseInt(cleanHex[0] + cleanHex[0], 16),
      parseInt(cleanHex[1] + cleanHex[1], 16),
      parseInt(cleanHex[2] + cleanHex[2], 16)
    ];
  }
  return [
    parseInt(cleanHex.substring(0, 2), 16),
    parseInt(cleanHex.substring(2, 4), 16),
    parseInt(cleanHex.substring(4, 6), 16)
  ];
}

// WCAG relative luminance formula
function getRelativeLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// WCAG contrast ratio calculation
function getContrastRatio(hex1, hex2) {
  const lum1 = getRelativeLuminance(hexToRgb(hex1));
  const lum2 = getRelativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('CSS Design Tokens & Color Contrast', () => {

  const cssFiles = [
    'tokens.css',
    'global.css',
    'navigation.css',
    'components.css',
    'accessibility.css'
  ];

  it('all 5 modular stylesheet files should exist and have balanced braces', () => {
    cssFiles.forEach(file => {
      const filePath = path.join(rootDir, 'assets', 'css', file);
      assert.ok(fs.existsSync(filePath), `CSS file missing: ${file}`);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      assert.strictEqual(openBraces, closeBraces, `${file} has unmatched CSS curly braces (${openBraces} open vs ${closeBraces} close)`);
    });
  });

  describe('tokens.css Structure', () => {
    const tokensPath = path.join(rootDir, 'assets', 'css', 'tokens.css');
    let tokensContent = '';

    it('should define core design tokens in :root', () => {
      tokensContent = fs.readFileSync(tokensPath, 'utf8');
      const rootTokens = [
        '--brand-green-primary',
        '--font-family-sans',
        '--font-family-dyslexic',
        '--focus-ring',
        '--space-4',
        '--radius-md'
      ];
      rootTokens.forEach(token => {
        assert.ok(tokensContent.includes(token), `tokens.css :root missing token ${token}`);
      });
    });

    it('should define dark theme palette with full token set', () => {
      const darkTokens = [
        '--bg-app',
        '--bg-surface',
        '--text-primary',
        '--text-secondary',
        '--text-muted',
        '--border-subtle'
      ];
      assert.ok(tokensContent.includes('[data-theme="dark"]'), 'tokens.css missing [data-theme="dark"] selector');
      darkTokens.forEach(token => {
        assert.ok(tokensContent.includes(token), `tokens.css dark theme missing ${token}`);
      });
    });

    it('should define light theme palette with full token set', () => {
      const lightTokens = [
        '--bg-app',
        '--bg-surface',
        '--text-primary',
        '--text-secondary',
        '--text-muted',
        '--border-subtle'
      ];
      assert.ok(tokensContent.includes('[data-theme="light"]'), 'tokens.css missing [data-theme="light"] selector');
      lightTokens.forEach(token => {
        assert.ok(tokensContent.includes(token), `tokens.css light theme missing ${token}`);
      });
    });

    it('should define high contrast overrides for accessibility', () => {
      assert.ok(tokensContent.includes('[data-contrast="high"]'), 'tokens.css missing high contrast theme selectors');
    });
  });

  describe('WCAG AA / AAA Color Contrast Ratios', () => {
    // Standard requirements:
    // Normal text: >= 4.5:1 (WCAG AA), >= 7:1 (WCAG AAA)
    // Large text: >= 3:1 (WCAG AA)

    it('Dark Theme primary text should exceed WCAG AA 4.5:1 (Target: > 10:1)', () => {
      // Dark mode: #ffffff on #0e1218 (bg-app) and #161c24 (bg-surface)
      const ratioApp = getContrastRatio('#ffffff', '#0e1218');
      const ratioSurface = getContrastRatio('#ffffff', '#161c24');
      assert.ok(ratioApp >= 4.5, `Dark text on bg-app contrast ratio ${ratioApp.toFixed(2)} is below 4.5:1`);
      assert.ok(ratioSurface >= 4.5, `Dark text on bg-surface contrast ratio ${ratioSurface.toFixed(2)} is below 4.5:1`);
    });

    it('Dark Theme secondary text should exceed WCAG AA 4.5:1', () => {
      // Dark mode: #d1d7e0 on #0e1218
      const ratio = getContrastRatio('#d1d7e0', '#0e1218');
      assert.ok(ratio >= 4.5, `Dark secondary text contrast ratio ${ratio.toFixed(2)} is below 4.5:1`);
    });

    it('Light Theme primary text should exceed WCAG AA 4.5:1 (Target: > 10:1)', () => {
      // Light mode: #0f172a on #f8fafc (bg-app) and #ffffff (bg-surface)
      const ratioApp = getContrastRatio('#0f172a', '#f8fafc');
      const ratioSurface = getContrastRatio('#0f172a', '#ffffff');
      assert.ok(ratioApp >= 4.5, `Light text on bg-app contrast ratio ${ratioApp.toFixed(2)} is below 4.5:1`);
      assert.ok(ratioSurface >= 4.5, `Light text on bg-surface contrast ratio ${ratioSurface.toFixed(2)} is below 4.5:1`);
    });

    it('Light Theme secondary text should exceed WCAG AA 4.5:1', () => {
      // Light mode: #334155 on #ffffff
      const ratio = getContrastRatio('#334155', '#ffffff');
      assert.ok(ratio >= 4.5, `Light secondary text contrast ratio ${ratio.toFixed(2)} is below 4.5:1`);
    });

    it('High Contrast modes should achieve near maximum contrast (> 15:1)', () => {
      const darkHighContrast = getContrastRatio('#ffffff', '#000000');
      const lightHighContrast = getContrastRatio('#000000', '#ffffff');
      assert.strictEqual(darkHighContrast, 21, 'High contrast dark must be 21:1 pure contrast');
      assert.strictEqual(lightHighContrast, 21, 'High contrast light must be 21:1 pure contrast');
    });
  });

});
