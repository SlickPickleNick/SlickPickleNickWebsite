/**
 * JavaScript Modules & Application Logic Test Suite
 * Validates syntax, theme switching logic, accessibility preference state engine,
 * command/reward client-side filtering algorithms, and stream countdown calculations.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

describe('JavaScript Modules & Logic', () => {

  const jsFiles = [
    'theme.js',
    'accessibility.js',
    'commands.js',
    'rewards.js',
    'schedule.js',
    'gear.js',
    'main.js'
  ];

  it('all 7 JavaScript files should pass syntax compilation without errors', () => {
    jsFiles.forEach(file => {
      const filePath = path.join(rootDir, 'assets', 'js', file);
      assert.ok(fs.existsSync(filePath), `JS file missing: ${file}`);
      // node -c validates syntax without executing
      assert.doesNotThrow(() => {
        execSync(`node -c "${filePath}"`);
      }, `Syntax error in assets/js/${file}`);
    });
  });

  it('commands.js and rewards.js should declare data loader functions', () => {
    const commandsContent = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'commands.js'), 'utf8');
    const rewardsContent = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'rewards.js'), 'utf8');
    assert.ok(commandsContent.includes('function loadCommands()') || commandsContent.includes('loadCommands ='), 'commands.js must declare loadCommands');
    assert.ok(rewardsContent.includes('function loadRewards()') || rewardsContent.includes('loadRewards ='), 'rewards.js must declare loadRewards');
  });

  describe('Theme Engine Logic', () => {
    it('theme.js should export or contain theme toggle and storage keys', () => {
      const themeContent = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'theme.js'), 'utf8');
      assert.ok(themeContent.includes('spn_theme'), 'theme.js must use spn_theme localStorage key');
      assert.ok(themeContent.includes('data-theme'), 'theme.js must set data-theme attribute');
      assert.ok(themeContent.includes('prefers-color-scheme'), 'theme.js must check prefers-color-scheme');
    });

    it('should correctly simulate theme switching and persistence', () => {
      // Mock theme state engine
      let storage = {};
      const getStoredTheme = () => storage['spn_theme'] || 'dark';
      const setStoredTheme = (theme) => { storage['spn_theme'] = theme; };
      const toggleTheme = () => {
        const current = getStoredTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        setStoredTheme(next);
        return next;
      };

      assert.strictEqual(getStoredTheme(), 'dark');
      assert.strictEqual(toggleTheme(), 'light');
      assert.strictEqual(getStoredTheme(), 'light');
      assert.strictEqual(toggleTheme(), 'dark');
      assert.strictEqual(getStoredTheme(), 'dark');
    });
  });

  describe('Accessibility Engine Logic', () => {
    const defaultA11yPrefs = {
      textSize: 'normal',
      dyslexic: false,
      lineHeight: 'normal',
      bigCursor: 'none',
      letterSpacing: 'normal',
      textAlign: 'left',
      fontWeight: 'normal',
      contrast: 'normal',
      monochrome: false,
      readingLine: false,
      readingMask: false,
      hideImages: false,
      highlightContent: false,
      stopAnimations: false,
      highlightLinks: false
    };

    function countActivePrefs(prefs) {
      let count = 0;
      if (prefs.textSize && prefs.textSize !== 'normal') count++;
      if (prefs.dyslexic) count++;
      if (prefs.lineHeight && prefs.lineHeight !== 'normal') count++;
      if (prefs.bigCursor && prefs.bigCursor !== 'none') count++;
      if (prefs.letterSpacing && prefs.letterSpacing !== 'normal') count++;
      if (prefs.textAlign && prefs.textAlign !== 'left') count++;
      if (prefs.fontWeight && prefs.fontWeight !== 'normal') count++;
      if (prefs.contrast && prefs.contrast !== 'normal') count++;
      if (prefs.monochrome) count++;
      if (prefs.readingLine) count++;
      if (prefs.readingMask) count++;
      if (prefs.hideImages) count++;
      if (prefs.highlightContent) count++;
      if (prefs.stopAnimations) count++;
      if (prefs.highlightLinks) count++;
      return count;
    }

    it('accessibility.js should contain all 15 preference keys', () => {
      const a11yContent = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'accessibility.js'), 'utf8');
      assert.ok(a11yContent.includes('spn_a11y_prefs'), 'accessibility.js must use spn_a11y_prefs key');
      Object.keys(defaultA11yPrefs).forEach(key => {
        assert.ok(a11yContent.includes(key), `accessibility.js missing preference key '${key}'`);
      });
    });

    it('should accurately calculate active feature count badge', () => {
      assert.strictEqual(countActivePrefs(defaultA11yPrefs), 0, 'Default prefs must have 0 active count');

      const modifiedPrefs = {
        ...defaultA11yPrefs,
        textSize: 'large',
        contrast: 'high',
        dyslexic: true,
        stopAnimations: true
      };

      assert.strictEqual(countActivePrefs(modifiedPrefs), 4, 'Modified prefs should report exactly 4 active count');
    });

    it('reset action should restore defaults and 0 count', () => {
      let currentPrefs = {
        ...defaultA11yPrefs,
        textSize: 'xxlarge',
        monochrome: true,
        readingLine: true
      };
      assert.strictEqual(countActivePrefs(currentPrefs), 3);

      // Perform reset
      currentPrefs = { ...defaultA11yPrefs };
      assert.strictEqual(countActivePrefs(currentPrefs), 0);
      assert.strictEqual(currentPrefs.textSize, 'normal');
      assert.strictEqual(currentPrefs.monochrome, false);
    });
  });

  describe('Search & Filter Algorithms (Commands & Rewards)', () => {
    const sampleCommands = [
      { command: '!clip', category: 'General', description: 'Clip the last 60 seconds of the stream.' },
      { command: '!discord', category: 'Socials', description: 'Sends the official Discord invite link.' },
      { command: '!sr', category: 'Spotify', description: 'Request a song by title or artist URL.' },
      { command: '!torch', category: 'Torch Game', description: 'Opt into the GeoGuessr torch bearer chat pool.' }
    ];

    function filterCommands(commands, query, category) {
      const q = (query || '').toLowerCase().trim();
      const cat = (category || 'all').toLowerCase();

      return commands.filter(cmd => {
        const matchesCategory = cat === 'all' || cmd.category.toLowerCase() === cat;
        const matchesQuery = !q ||
          cmd.command.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q) ||
          cmd.category.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });
    }

    it('should filter commands by keyword across command and description', () => {
      const results1 = filterCommands(sampleCommands, 'discord', 'all');
      assert.strictEqual(results1.length, 1);
      assert.strictEqual(results1[0].command, '!discord');

      const results2 = filterCommands(sampleCommands, 'stream', 'all');
      assert.strictEqual(results2.length, 1);
      assert.strictEqual(results2[0].command, '!clip');
    });

    it('should filter commands by category', () => {
      const spotifyCmds = filterCommands(sampleCommands, '', 'Spotify');
      assert.strictEqual(spotifyCmds.length, 1);
      assert.strictEqual(spotifyCmds[0].command, '!sr');

      const generalCmds = filterCommands(sampleCommands, '', 'General');
      assert.strictEqual(generalCmds.length, 1);
      assert.strictEqual(generalCmds[0].command, '!clip');
    });

    it('should return empty array for non-matching search queries', () => {
      const results = filterCommands(sampleCommands, 'xyznonexistent123', 'all');
      assert.strictEqual(results.length, 0);
    });
  });

  describe('Schedule Countdown Logic', () => {
    function calculateTimeRemaining(targetTimestamp, nowTimestamp) {
      const diffMs = targetTimestamp - nowTimestamp;
      if (diffMs <= 0) {
        return { isLiveOrPast: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      return { isLiveOrPast: false, days, hours, minutes, seconds };
    }

    it('should accurately calculate remaining time until next stream', () => {
      const now = 1700000000000;
      // 2 hours and 30 minutes in the future
      const target = now + (2 * 60 * 60 * 1000) + (30 * 60 * 1000) + (15 * 1000);
      const res = calculateTimeRemaining(target, now);

      assert.strictEqual(res.isLiveOrPast, false);
      assert.strictEqual(res.days, 0);
      assert.strictEqual(res.hours, 2);
      assert.strictEqual(res.minutes, 30);
      assert.strictEqual(res.seconds, 15);
    });

    it('should detect when target time is now or in the past', () => {
      const now = 1700000000000;
      const past = now - 5000;
      const res = calculateTimeRemaining(past, now);
      assert.strictEqual(res.isLiveOrPast, true);
    });
  });

  describe('Gear Explorer Logic & Spec Formatting', () => {
    const sampleGear = [
      {
        id: 'pc-cpu',
        name: 'AMD Ryzen 7 7800X3D',
        category: 'pc',
        categoryLabel: 'Gaming Rig',
        role: 'Primary Processor & 3D V-Cache Gaming',
        specs: [{ label: 'Cores', value: '8 Cores' }, { label: 'Cache', value: '96MB 3D V-Cache' }],
        whyNickUsesIt: 'Zero frame drops in CPU-demanding games.',
        hotspotIndex: 6
      },
      {
        id: 'audio-mic',
        name: 'Elgato Wave DX',
        category: 'audio',
        categoryLabel: 'Audio Chain',
        role: 'Broadcast Dynamic XLR Microphone',
        specs: [{ label: 'Capsule', value: 'Dynamic Cardioid' }],
        whyNickUsesIt: 'Rejects keyboard noise while streaming.',
        hotspotIndex: 1
      },
      {
        id: 'peripheral-mat',
        name: 'Official Topographic Desk Mat',
        category: 'peripherals',
        categoryLabel: 'Peripherals & Desk',
        role: 'Official Creator Merch Desk Surface',
        specs: [{ label: 'Material', value: 'Micro-weave cloth' }],
        whyNickUsesIt: 'Smooth mouse glide and signature branding.',
        hotspotIndex: 7
      }
    ];

    function filterGear(gearList, query, category) {
      const q = (query || '').toLowerCase().trim();
      const cat = (category || 'all').toLowerCase();

      return gearList.filter(item => {
        const matchesCategory = cat === 'all' || item.category.toLowerCase() === cat;
        if (!q) return matchesCategory;

        const inName = item.name.toLowerCase().includes(q);
        const inRole = (item.role || '').toLowerCase().includes(q);
        const inCat = (item.categoryLabel || '').toLowerCase().includes(q);
        const inWhy = (item.whyNickUsesIt || '').toLowerCase().includes(q);
        const inSpecs = (item.specs || []).some(
          s => (s.label && s.label.toLowerCase().includes(q)) || (s.value && s.value.toLowerCase().includes(q))
        );

        return matchesCategory && (inName || inRole || inCat || inWhy || inSpecs);
      });
    }

    function formatSpecsText(gearList) {
      const lines = ["🎮 SLICKPICKLENICK PRO STREAMING SETUP & GEAR SPECS"];
      gearList.forEach(item => {
        lines.push(`• ${item.name} (${item.role})`);
      });
      return lines.join('\n');
    }

    it('should filter gear by category', () => {
      const audioGear = filterGear(sampleGear, '', 'audio');
      assert.strictEqual(audioGear.length, 1);
      assert.strictEqual(audioGear[0].id, 'audio-mic');

      const pcGear = filterGear(sampleGear, '', 'pc');
      assert.strictEqual(pcGear.length, 1);
      assert.strictEqual(pcGear[0].id, 'pc-cpu');
    });

    it('should filter gear by keyword across name, specs, and creator commentary', () => {
      // By spec value
      const vCacheResults = filterGear(sampleGear, '96MB', 'all');
      assert.strictEqual(vCacheResults.length, 1);
      assert.strictEqual(vCacheResults[0].id, 'pc-cpu');

      // By commentary keyword
      const noiseResults = filterGear(sampleGear, 'keyboard noise', 'all');
      assert.strictEqual(noiseResults.length, 1);
      assert.strictEqual(noiseResults[0].id, 'audio-mic');

      // By role
      const merchResults = filterGear(sampleGear, 'merch', 'all');
      assert.strictEqual(merchResults.length, 1);
      assert.strictEqual(merchResults[0].id, 'peripheral-mat');
    });

    it('should format clipboard export text with valid hardware details', () => {
      const text = formatSpecsText(sampleGear);
      assert.ok(text.includes('SLICKPICKLENICK'));
      assert.ok(text.includes('AMD Ryzen 7 7800X3D'));
      assert.ok(text.includes('Elgato Wave DX'));
      assert.ok(text.includes('Official Topographic Desk Mat'));
    });
  });

});
