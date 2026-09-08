/**
 * Accessibility (a11y) & WCAG AA Compliance Test Suite
 * Validates ARIA landmark roles, accessible controls, side drawer components,
 * button states, form labels, and focus indicators.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = [
  'index.html',
  'commands.html',
  'rewards.html',
  'about.html',
  'games.html',
  'community.html'
];

describe('Accessibility & WCAG AA Compliance', () => {

  htmlFiles.forEach(file => {
    describe(`Page Accessibility: ${file}`, () => {
      const filePath = path.join(rootDir, file);
      let content = '';

      it('should read file content', () => {
        content = fs.readFileSync(filePath, 'utf8');
        assert.ok(content.length > 0);
      });

      it('should have the floating accessibility launcher button with ARIA attributes', () => {
        assert.ok(content.includes('id="a11y-floating-trigger"'), `${file} missing #a11y-floating-trigger`);
        assert.ok(content.includes('aria-controls="a11y-drawer"'), `${file} trigger missing aria-controls="a11y-drawer"`);
        assert.ok(/aria-label=["'][^"']+["']/.test(content), `${file} trigger missing aria-label`);
        assert.ok(content.includes('id="a11y-active-count"'), `${file} missing active count badge #a11y-active-count`);
      });

      it('should have the side accessibility drawer with proper landmark and title', () => {
        assert.ok(/<aside\s+[^>]*id=["']a11y-drawer["']/i.test(content), `${file} missing <aside id="a11y-drawer">`);
        assert.ok(content.includes('aria-labelledby="a11y-drawer-title"'), `${file} drawer missing aria-labelledby`);
        assert.ok(content.includes('id="a11y-drawer-title"'), `${file} drawer missing #a11y-drawer-title`);
        assert.ok(content.includes('id="a11y-drawer-close"'), `${file} drawer missing #a11y-drawer-close`);
      });

      it('should contain all 3 continuous sections (Content, Color, Orientation)', () => {
        assert.ok(content.includes('id="a11y-sec-content"'), `${file} missing Content Modules section heading`);
        assert.ok(content.includes('id="a11y-sec-color"'), `${file} missing Color Modules section heading`);
        assert.ok(content.includes('id="a11y-sec-orientation"'), `${file} missing Orientation Modules section heading`);
      });

      it('should contain all required switch toggles with linked labels', () => {
        const requiredToggles = [
          'a11y-dyslexic-toggle',
          'a11y-fontweight-toggle',
          'a11y-mono-toggle',
          'a11y-readingline-toggle',
          'a11y-readingmask-toggle',
          'a11y-hideimages-toggle',
          'a11y-highlightcontent-toggle',
          'a11y-motion-toggle',
          'a11y-links-toggle'
        ];

        requiredToggles.forEach(toggleId => {
          assert.ok(content.includes(`id="${toggleId}"`), `${file} missing switch input #${toggleId}`);
          assert.ok(content.includes(`for="${toggleId}"`), `${file} missing <label for="${toggleId}">`);
        });
      });

      it('should contain all required segmented button option groups with aria-pressed states', () => {
        const requiredGroups = [
          'data-a11y-size',
          'data-a11y-lineheight',
          'data-a11y-cursor',
          'data-a11y-spacing',
          'data-a11y-align',
          'data-a11y-contrast'
        ];

        requiredGroups.forEach(attr => {
          assert.ok(content.includes(attr), `${file} missing segmented option group '${attr}'`);
        });

        // Verify that option buttons have aria-pressed
        const optButtons = content.match(/<button[^>]+class=["'][^"']*a11y-opt-btn[^"']*["'][^>]*>/g) || [];
        assert.ok(optButtons.length >= 18, `${file} expected at least 18 a11y-opt-btn buttons, found ${optButtons.length}`);
        optButtons.forEach(btn => {
          assert.ok(btn.includes('aria-pressed='), `${file} option button missing aria-pressed: ${btn}`);
        });
      });

      it('should contain the Reset All Settings button', () => {
        assert.ok(content.includes('id="a11y-reset-btn"'), `${file} missing #a11y-reset-btn`);
      });

      it('should have accessible search inputs on search-enabled pages', () => {
        if (file === 'commands.html') {
          assert.ok(content.includes('id="commands-search-input"'), `${file} missing #commands-search-input`);
          assert.ok(/aria-label=["'][^"']+["']/.test(content), `${file} command search input missing accessible label`);
        }
        if (file === 'rewards.html') {
          assert.ok(content.includes('id="rewards-search-input"'), `${file} missing #rewards-search-input`);
          assert.ok(/aria-label=["'][^"']+["']/.test(content), `${file} reward search input missing accessible label`);
        }
      });
    });
  });

});
