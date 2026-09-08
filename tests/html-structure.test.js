/**
 * HTML Structure & Standards Test Suite
 * Validates HTML5 document semantics, head meta tags, stylesheet cascades,
 * heading hierarchy, skip links, landmarks, and internal link routing across all pages.
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

describe('HTML Document Structure & Standards', () => {

  htmlFiles.forEach(file => {
    describe(`Page: ${file}`, () => {
      const filePath = path.join(rootDir, file);
      let content = '';

      it('should exist on disk and be readable', () => {
        assert.ok(fs.existsSync(filePath), `${file} must exist`);
        content = fs.readFileSync(filePath, 'utf8');
        assert.ok(content.length > 500, `${file} content should not be empty`);
      });

      it('should have valid HTML5 doctype and html lang attribute', () => {
        assert.ok(/<!DOCTYPE\s+html>/i.test(content), `${file} missing <!DOCTYPE html>`);
        assert.ok(/<html\s+[^>]*lang=["']en["']/i.test(content), `${file} missing <html lang="en">`);
      });

      it('should have mandatory head metadata (charset, viewport, title, description)', () => {
        assert.ok(/<meta\s+charset=["']UTF-8["']/i.test(content) || /<meta\s+charset=["']utf-8["']/i.test(content), `${file} missing UTF-8 meta charset`);
        assert.ok(/<meta\s+name=["']viewport["']/i.test(content), `${file} missing viewport meta tag`);
        
        const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
        assert.ok(titleMatch && titleMatch[1].trim().length > 0, `${file} missing or empty <title> tag`);
        assert.ok(titleMatch[1].includes('SlickPickleNick'), `${file} <title> should include 'SlickPickleNick'`);

        const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        assert.ok(descMatch && descMatch[1].trim().length > 10, `${file} missing or too short meta description`);
      });

      it('should load all modular stylesheets in proper cascade order', () => {
        const requiredCSS = [
          'tokens.css',
          'global.css',
          'navigation.css',
          'components.css',
          'accessibility.css'
        ];

        let lastIndex = -1;
        requiredCSS.forEach(cssName => {
          const index = content.indexOf(cssName);
          assert.ok(index !== -1, `${file} missing stylesheet ${cssName}`);
          assert.ok(index > lastIndex, `${file} stylesheet ${cssName} loaded out of cascade order`);
          lastIndex = index;
        });
      });

      it('should have in-head anti-flicker initialization script', () => {
        const headMatch = content.match(/<head>([\s\S]*?)<\/head>/i);
        assert.ok(headMatch, `${file} must have <head> section`);
        const headContent = headMatch[1];
        assert.ok(headContent.includes('spn_theme') || headContent.includes('localStorage.getItem'), `${file} missing in-head anti-flicker script for theme`);
      });

      it('should have an accessible skip link targeting #main-content', () => {
        assert.ok(content.includes('href="#main-content"'), `${file} missing skip link href="#main-content"`);
        assert.ok(content.includes('id="main-content"'), `${file} missing <main id="main-content"> target`);
      });

      it('should have exactly one <h1> heading for semantic hierarchy', () => {
        const h1Matches = content.match(/<h1[\s>]/gi) || [];
        assert.strictEqual(h1Matches.length, 1, `${file} should contain exactly 1 <h1> heading, found ${h1Matches.length}`);
      });

      it('should have core semantic landmarks (header, nav, main, footer)', () => {
        assert.ok(/<header[\s>]/i.test(content), `${file} missing <header> landmark`);
        assert.ok(/<nav[\s>]/i.test(content), `${file} missing <nav> landmark`);
        assert.ok(/<main[\s>]/i.test(content), `${file} missing <main> landmark`);
        assert.ok(/<footer[\s>]/i.test(content), `${file} missing <footer> landmark`);
      });

      it('should have valid internal navigation links pointing to existing files', () => {
        const hrefRegex = /href=["']([a-zA-Z0-9_\-\./]+\.html(?:#[a-zA-Z0-9_\-]+)?)["']/g;
        let match;
        while ((match = hrefRegex.exec(content)) !== null) {
          const rawUrl = match[1];
          const fileName = rawUrl.split('#')[0];
          if (!fileName.startsWith('http')) {
            const targetPath = path.join(rootDir, fileName);
            assert.ok(fs.existsSync(targetPath), `${file} contains broken link to '${rawUrl}'`);
          }
        }
      });

      it('should ensure all <img> tags have alt attributes', () => {
        const imgTags = content.match(/<img[^>]+>/gi) || [];
        imgTags.forEach(img => {
          assert.ok(/\salt=["'][^"']*["']/i.test(img), `${file} <img> tag missing alt attribute: ${img}`);
        });
      });
    });
  });

});
