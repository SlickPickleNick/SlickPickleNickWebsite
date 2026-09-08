/**
 * Streamlined Broadcast Setup & Hardware Specs - SlickPickleNick Official Website
 * Provides clean, digestible hardware specs rendering, category filtering, instant search,
 * Grid/Table view switching, and single-click clipboard export.
 */

(function () {
  'use strict';

  let gearData = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentViewMode = 'grid'; // 'grid' | 'table'

  const fallbackGear = [
    {
      "id": "pc-cpu",
      "name": "AMD Ryzen 7 7800X3D",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Primary Processor & 3D V-Cache Gaming",
      "specs": [
        { "label": "Cores / Threads", "value": "8 Cores / 16 Threads" },
        { "label": "Architecture", "value": "Zen 4 with AMD 3D V-Cache" },
        { "label": "Boost Clock", "value": "Up to 5.0 GHz" },
        { "label": "L3 Cache", "value": "96MB 3D V-Cache" }
      ],
      "whyNickUsesIt": "Unparalleled 1% low frame consistency in CPU-heavy games like Fortnite and GeoGuessr while encoding and running stream bots simultaneously."
    },
    {
      "id": "pc-gpu",
      "name": "NVIDIA GeForce RTX 4070 Ti SUPER",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Graphics Rendering & Dual AV1 NVENC Streaming",
      "specs": [
        { "label": "VRAM", "value": "16GB GDDR6X" },
        { "label": "Memory Bus", "value": "256-bit" },
        { "label": "Encoding", "value": "8th Gen Dual NVENC (AV1 & HEVC)" },
        { "label": "Target Res", "value": "1440p High Refresh Gameplay" }
      ],
      "whyNickUsesIt": "Flawless 1440p gaming fidelity with dedicated NVENC stream encoding that avoids taxing game rendering."
    },
    {
      "id": "pc-ram",
      "name": "Corsair Vengeance DDR5 32GB (2x16GB)",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "High-Speed System Memory",
      "specs": [
        { "label": "Capacity", "value": "32GB (2x16GB)" },
        { "label": "Type", "value": "DDR5 High Speed" },
        { "label": "Profile", "value": "AMD EXPO Optimized" }
      ],
      "whyNickUsesIt": "Handles OBS Studio, Streamer.bot, Spotify, browser sources, Discord, and games concurrently."
    },
    {
      "id": "pc-storage",
      "name": "Samsung 990 PRO 2TB NVMe SSD",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "PCIe 4.0 NVMe Storage",
      "specs": [
        { "label": "Capacity", "value": "2TB" },
        { "label": "Interface", "value": "PCIe Gen 4.0 x4, NVMe 2.0" },
        { "label": "Read / Write", "value": "Up to 7,450 / 6,900 MB/s" }
      ],
      "whyNickUsesIt": "Instant game load times and rapid local clip recording with zero latency."
    },
    {
      "id": "pc-motherboard",
      "name": "Gigabyte B650 AORUS Elite AX",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "AM5 Motherboard",
      "specs": [
        { "label": "Socket", "value": "AMD AM5" },
        { "label": "Power Design", "value": "Twin 14+2+1 Phases Digital VRM" },
        { "label": "Connectivity", "value": "Wi-Fi 6E, 2.5GbE LAN, PCIe 5.0 M.2" }
      ],
      "whyNickUsesIt": "Rock-solid VRM thermal performance and extensive rear I/O connectivity for all streaming capture cards."
    },
    {
      "id": "pc-cooling",
      "name": "NZXT Kraken Elite RGB AIO Cooler",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Liquid CPU Cooler with Custom Display",
      "specs": [
        { "label": "Type", "value": "360mm Liquid AIO" },
        { "label": "Display", "value": "Wide-Angle LCD Screen for Real-Time Temps" },
        { "label": "Fans", "value": "F120 RGB Core Fans" }
      ],
      "whyNickUsesIt": "Keeps the 7800X3D whisper-quiet under multi-hour stream loads."
    },
    {
      "id": "pc-case",
      "name": "NZXT H6 Flow RGB & C850 PSU",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Dual-Chamber High-Airflow Chassis & Power",
      "specs": [
        { "label": "Case", "value": "NZXT H6 Flow RGB Compact Dual-Chamber" },
        { "label": "Power Supply", "value": "NZXT C850 850W 80+ Gold Fully Modular" },
        { "label": "Airflow", "value": "Angled Front Corner Fans for GPU Direct Cooling" }
      ],
      "whyNickUsesIt": "Seamless wraparound glass showcase design with dedicated direct GPU intake cooling to keep noise floor minimal for the microphone."
    },
    {
      "id": "monitor-main",
      "name": "ASUS TUF Gaming VG32AQA1A (32\")",
      "category": "monitors",
      "categoryLabel": "Monitors",
      "role": "Primary Gaming & Broadcast Display",
      "specs": [
        { "label": "Screen Size", "value": "32 Inch" },
        { "label": "Resolution", "value": "2560 x 1440 QHD" },
        { "label": "Refresh Rate", "value": "170Hz" },
        { "label": "Response Time", "value": "1ms (MPRT)" },
        { "label": "Panel", "value": "Fast VA with FreeSync Premium" }
      ],
      "whyNickUsesIt": "High refresh rate and crisp 1440p resolution give precise visual clarity in competitive Fortnite and GeoGuessr."
    },
    {
      "id": "monitor-secondary",
      "name": "Sceptre 32\" QHD 144Hz Monitor",
      "category": "monitors",
      "categoryLabel": "Monitors",
      "role": "Tools, OBS & Chat Monitoring Display",
      "specs": [
        { "label": "Screen Size", "value": "32 Inch" },
        { "label": "Resolution", "value": "2560 x 1440 QHD" },
        { "label": "Refresh Rate", "value": "144Hz" },
        { "label": "Purpose", "value": "OBS Studio, Twitch Chat, Streamer.bot, Discord" }
      ],
      "whyNickUsesIt": "Matches the 32-inch scale of the main display to easily monitor live chat, Twitch alerts, sound levels, and bot queues."
    },
    {
      "id": "monitor-utility",
      "name": "Corsair Xeneon Edge (14.5\" Touchscreen)",
      "category": "monitors",
      "categoryLabel": "Monitors",
      "role": "Utility, Reference & Dashboard Display",
      "specs": [
        { "label": "Screen Size", "value": "14.5 Inch Ultra-Wide" },
        { "label": "Resolution", "value": "2560 x 720 Ultrawide" },
        { "label": "Touchscreen", "value": "Yes (Multi-Touch)" },
        { "label": "Refresh Rate", "value": "60Hz" }
      ],
      "whyNickUsesIt": "Positioned right beneath the primary monitors as a dedicated touchscreen control center for audio sliders and stream dashboards."
    },
    {
      "id": "audio-mic",
      "name": "Elgato Wave DX Dynamic Microphone",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Broadcast Dynamic XLR Voice Microphone",
      "specs": [
        { "label": "Capsule", "value": "Dynamic, Cardioid Polar Pattern" },
        { "label": "Acoustic Tuning", "value": "Warm broadcast presence with speech clarity" },
        { "label": "Connection", "value": "Standard 3-Pin XLR" },
        { "label": "Internal Shielding", "value": "Internal pop filter & humbucker coil" }
      ],
      "whyNickUsesIt": "Tight cardioid pickup rejects mechanical keyboard clicks and room reflections while giving Nick's commentary a warm broadcast tone."
    },
    {
      "id": "audio-interface",
      "name": "Elgato Wave XLR Interface",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Ultra-Low-Noise XLR Preamp & Digital Mixer",
      "specs": [
        { "label": "Gain Range", "value": "Up to 75dB Ultra-Low Noise Gain" },
        { "label": "Anti-Distortion", "value": "Proprietary Clipguard Technology" },
        { "label": "Controls", "value": "Capacitive Mute Sensor & Multifunction Dial" },
        { "label": "Software", "value": "Wave Link Digital Multi-Track Audio Mixing" }
      ],
      "whyNickUsesIt": "Hardware Clipguard prevents audio distortion during funny stream moments, while Wave Link cleanly splits audio channels."
    },
    {
      "id": "audio-boom",
      "name": "Elgato Wave Mic Arm LP",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Low-Profile Studio Boom Arm",
      "specs": [
        { "label": "Design", "value": "Under-Monitor Low Profile" },
        { "label": "Rotation", "value": "360-degree horizontal swivel" },
        { "label": "Cable Management", "value": "Integrated magnetic cable channels" }
      ],
      "whyNickUsesIt": "Swings directly under the main monitor line of sight, keeping Nick's face and screen completely unobstructed on camera."
    },
    {
      "id": "audio-headphones",
      "name": "Logitech ASTRO A50 (Gen 5) Wireless",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Wireless Studio Reference & Game Monitoring",
      "specs": [
        { "label": "Audio", "value": "PRO-G Graphene 40mm Drivers with Dolby Atmos" },
        { "label": "Wireless", "value": "LIGHTSPEED 24-bit uncompressed audio" },
        { "label": "Base Station", "value": "Magnetic charging dock with multi-device switching" }
      ],
      "whyNickUsesIt": "Pinpoint spatial directional audio for GeoGuessr audio cues and Fortnite enemy footstep positioning with zero latency."
    },
    {
      "id": "audio-speakers",
      "name": "Edifier R1280T Studio Bookshelf Speakers",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Desktop Audio Reference Speakers",
      "specs": [
        { "label": "Power", "value": "42W RMS Total Output" },
        { "label": "Drivers", "value": "4-inch bass driver + 13mm silk dome tweeter" },
        { "label": "Inputs", "value": "Dual RCA AUX inputs with side-panel EQ dials" }
      ],
      "whyNickUsesIt": "High-fidelity listening for video editing, music, and casual playback when not wearing a headset off-stream."
    },
    {
      "id": "peripheral-keyboard",
      "name": "Lemokey P1 Pro (Custom Mechanical)",
      "category": "peripherals",
      "categoryLabel": "Peripherals & Desk",
      "role": "75% CNC Aluminum Wireless Custom Keyboard",
      "specs": [
        { "label": "Layout", "value": "75% Exploded Layout" },
        { "label": "Body", "value": "Full CNC Machined Aluminum Body" },
        { "label": "Switches", "value": "Keychron Super Banana Tactile Switches" },
        { "label": "Firmware", "value": "QMK / VIA Programmable" }
      ],
      "whyNickUsesIt": "Substantial aluminum heft, satisfying tactile typing feel, and custom macros mapped for quick stream management."
    },
    {
      "id": "peripheral-mouse",
      "name": "Razer DeathAdder V3 HyperSpeed",
      "category": "peripherals",
      "categoryLabel": "Peripherals & Desk",
      "role": "Ultra-Lightweight Ergonomic Esports Mouse",
      "specs": [
        { "label": "Weight", "value": "55g Ultra-Lightweight" },
        { "label": "Sensor", "value": "Focus X 26K Optical Sensor" },
        { "label": "Switches", "value": "Gen-3 Optical Mouse Switches (90M clicks)" },
        { "label": "Connectivity", "value": "HyperSpeed Wireless (Up to 8000Hz polling)" }
      ],
      "whyNickUsesIt": "Ergonomic comfort for long gaming sessions with instant wireless response time and smooth tracking on desk mats."
    },
    {
      "id": "peripheral-streamdeck",
      "name": "Elgato Stream Deck Mk.2",
      "category": "peripherals",
      "categoryLabel": "Peripherals & Desk",
      "role": "Live Broadcast & Scene Controller",
      "specs": [
        { "label": "Keys", "value": "15 Customizable LCD Keys" },
        { "label": "Integrations", "value": "OBS Studio, Wave Link, Streamer.bot, Spotify, Discord" },
        { "label": "Stand", "value": "45-degree angled desk stand" }
      ],
      "whyNickUsesIt": "Controls scene transitions, Channel Point sound effects, Discord mutes, and GeoGuessr torch game bot triggers with single-button precision."
    },
    {
      "id": "peripheral-deskmat",
      "name": "Official Topographic Desk Mat",
      "category": "peripherals",
      "categoryLabel": "Peripherals & Desk",
      "role": "Official Creator Merch Desk Surface",
      "specs": [
        { "label": "Material", "value": "High-density micro-weave cloth with stitched edges" },
        { "label": "Base", "value": "Anti-slip natural rubber base" },
        { "label": "Design", "value": "Signature SlickPickleNick Topographic Contour Print" },
        { "label": "Store", "value": "Available in the Official Merch Shop" }
      ],
      "whyNickUsesIt": "Provides a smooth mouse glide surface with anti-fray stitching and signature stream branding.",
      "link": "https://slickpicklenick.live/collections/all"
    },
    {
      "id": "camera-main",
      "name": "Elgato Facecam (1080p60)",
      "category": "camera",
      "categoryLabel": "Camera & Lighting",
      "role": "Broadcast Stream Facecam",
      "specs": [
        { "label": "Resolution", "value": "Uncompressed 1080p at 60 FPS" },
        { "label": "Sensor", "value": "Sony STARVIS CMOS Sensor" },
        { "label": "Lens", "value": "Elgato Prime Lens f/2.4 24mm all-glass" },
        { "label": "Field of View", "value": "82-degree diagonal FOV" }
      ],
      "whyNickUsesIt": "Outputs uncompressed 1080p60 video with manual ISO/shutter lock, delivering crisp, noise-free camera framing."
    },
    {
      "id": "camera-keylight",
      "name": "Elgato Key Light",
      "category": "camera",
      "categoryLabel": "Camera & Lighting",
      "role": "Main Front Key Lighting",
      "specs": [
        { "label": "Brightness", "value": "Up to 2800 Lumens" },
        { "label": "Color Temperature", "value": "2900K - 7000K (Warm amber to ice white)" },
        { "label": "Diffusion", "value": "Multi-layer edge-lit frosted glass" },
        { "label": "Control", "value": "Wi-Fi app & Stream Deck integration" }
      ],
      "whyNickUsesIt": "Edge-lit frosted diffusion prevents eye strain during multi-hour streams while evenly illuminating Nick on camera."
    },
    {
      "id": "camera-toplight",
      "name": "NiceVeedi Studio Desk Light",
      "category": "camera",
      "categoryLabel": "Camera & Lighting",
      "role": "Toplight & Ambient Workspace Fill",
      "specs": [
        { "label": "Type", "value": "Overhead LED Soft Studio Panel" },
        { "label": "Mount", "value": "Desk clamp boom mount" },
        { "label": "Purpose", "value": "Ambient fill lighting to eliminate harsh neck & desk shadows" }
      ],
      "whyNickUsesIt": "Adds soft overhead separation and fills in workstation shadows for professional multi-point broadcast lighting."
    }
  ];

  // Category Icons & Badge helpers
  const categoryIcons = {
    'pc': '🖥️',
    'monitors': '📺',
    'audio': '🎙️',
    'peripherals': '⌨️',
    'camera': '💡',
    'all': '⚡'
  };

  /**
   * Escape HTML utility to prevent XSS
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Initialize Setup Module
   */
  async function initGear() {
    const container = document.getElementById('gear-container');
    if (!container) return;

    try {
      const res = await fetch('assets/data/gear.json');
      if (res.ok) {
        gearData = await res.json();
      } else {
        gearData = fallbackGear;
      }
    } catch (e) {
      console.warn('Using fallback setup specs data:', e);
      gearData = fallbackGear;
    }

    updateCategoryCounts();
    setupEventListeners();
    renderGear();
  }

  /**
   * Update item count badges on category filter tabs
   */
  function updateCategoryCounts() {
    const counts = { all: gearData.length, pc: 0, monitors: 0, audio: 0, peripherals: 0, camera: 0 };
    gearData.forEach(item => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    Object.keys(counts).forEach(cat => {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = counts[cat];
    });
  }

  /**
   * Filter gear by query and category
   */
  function filterGearList(list, query, category) {
    const q = (query || '').toLowerCase().trim();
    const cat = (category || 'all').toLowerCase();

    return list.filter(item => {
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

  /**
   * Render Gear Items (Grid or Table View)
   */
  function renderGear() {
    const container = document.getElementById('gear-container');
    const countEl = document.getElementById('gear-results-count');
    if (!container) return;

    const filtered = filterGearList(gearData, searchQuery, currentCategory);

    // Update results counter
    if (countEl) {
      if (searchQuery || currentCategory !== 'all') {
        countEl.textContent = `Showing ${filtered.length} of ${gearData.length} setup items`;
      } else {
        countEl.textContent = `Showing all ${gearData.length} setup items`;
      }
    }

    // Empty state
    if (filtered.length === 0) {
      container.className = 'setup-empty-container';
      container.innerHTML = `
        <div class="empty-state" style="padding: var(--space-10) var(--space-4); text-align: center;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: var(--space-3);" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 style="font-size: var(--font-size-md); color: var(--text-primary); margin-bottom: var(--space-2);">No matching specs found</h3>
          <p style="font-size: var(--font-size-sm); color: var(--text-secondary); max-width: 400px; margin: 0 auto var(--space-4);">
            No hardware items match "${escapeHTML(searchQuery)}". Try searching for "RTX", "CPU", "RAM", or clear your filter.
          </p>
          <button type="button" class="btn btn-secondary btn-sm" id="reset-filter-btn">
            Clear Search &amp; Filters
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          currentCategory = 'all';
          const searchInput = document.getElementById('gear-search');
          if (searchInput) searchInput.value = '';
          const clearBtn = document.getElementById('gear-search-clear');
          if (clearBtn) clearBtn.style.display = 'none';

          document.querySelectorAll('#gear-category-tabs .filter-chip').forEach(chip => {
            const isActive = chip.dataset.category === 'all';
            chip.classList.toggle('active', isActive);
            chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
          });

          renderGear();
        });
      }
      return;
    }

    if (currentViewMode === 'table') {
      // Table View
      container.className = 'setup-table-container';
      container.innerHTML = renderTableView(filtered);
    } else {
      // Grid Card View
      container.className = 'setup-grid-container';
      container.innerHTML = filtered.map(item => renderCardView(item)).join('');
    }
  }

  /**
   * Render single digestible hardware card
   */
  function renderCardView(item) {
    const icon = categoryIcons[item.category] || '⚡';
    const catLabel = item.categoryLabel || item.category.toUpperCase();

    // Render clean key-value specs
    const specsHTML = (item.specs || []).map(spec => `
      <div class="setup-spec-item">
        <span class="setup-spec-label">${escapeHTML(spec.label)}</span>
        <strong class="setup-spec-val">${escapeHTML(spec.value)}</strong>
      </div>
    `).join('');

    // Optional expandable creator note
    const whyHTML = item.whyNickUsesIt ? `
      <details class="gear-note-details">
        <summary class="gear-note-summary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Why Nick Uses It</span>
        </summary>
        <div class="gear-note-body">
          <p>${escapeHTML(item.whyNickUsesIt)}</p>
        </div>
      </details>
    ` : '';

    // Merch/store link if available
    const linkHTML = item.link ? `
      <div class="setup-card-footer">
        <a href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center; gap: var(--space-2);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span>View in Official Shop</span>
        </a>
      </div>
    ` : '';

    return `
      <article class="setup-card" data-category="${escapeHTML(item.category)}">
        <div class="setup-card-header">
          <div class="setup-card-badge">
            <span class="setup-card-icon" aria-hidden="true">${icon}</span>
            <span>${escapeHTML(catLabel)}</span>
          </div>
        </div>

        <div class="setup-card-title-group">
          <h3 class="setup-card-title">${escapeHTML(item.name)}</h3>
          <p class="setup-card-role">${escapeHTML(item.role || '')}</p>
        </div>

        <div class="setup-spec-matrix">
          ${specsHTML}
        </div>

        ${whyHTML}
        ${linkHTML}
      </article>
    `;
  }

  /**
   * Render compact data table view
   */
  function renderTableView(items) {
    const rowsHTML = items.map(item => {
      const icon = categoryIcons[item.category] || '⚡';
      const catLabel = item.categoryLabel || item.category.toUpperCase();

      const specsText = (item.specs || []).map(s => `
        <span class="table-spec-pill"><strong>${escapeHTML(s.label)}:</strong> ${escapeHTML(s.value)}</span>
      `).join(' ');

      return `
        <tr>
          <td class="table-col-name">
            <div class="table-name-cell">
              <span class="table-cat-icon" aria-hidden="true">${icon}</span>
              <div>
                <strong>${escapeHTML(item.name)}</strong>
                <div class="table-role-sub">${escapeHTML(item.role || '')}</div>
              </div>
            </div>
          </td>
          <td class="table-col-cat">
            <span class="badge badge-subtle">${escapeHTML(catLabel)}</span>
          </td>
          <td class="table-col-specs">
            <div class="table-specs-list">
              ${specsText}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="setup-table-wrapper">
        <table class="setup-table" aria-label="Hardware Specifications Table">
          <thead>
            <tr>
              <th scope="col" style="width: 32%;">Component &amp; Role</th>
              <th scope="col" style="width: 18%;">Category</th>
              <th scope="col" style="width: 50%;">Key Specifications</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Setup interactive listeners
   */
  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('gear-search');
    const searchClear = document.getElementById('gear-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (searchClear) {
          searchClear.style.display = searchQuery ? 'inline-flex' : 'none';
        }
        renderGear();
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchQuery = '';
        searchClear.style.display = 'none';
        renderGear();
      });
    }

    // Category filter tabs
    const categoryTabs = document.querySelectorAll('#gear-category-tabs .filter-chip');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentCategory = tab.dataset.category || 'all';
        renderGear();
      });
    });

    // View switcher (Cards vs Table)
    const viewButtons = document.querySelectorAll('.setup-view-switcher .view-toggle-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        viewButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentViewMode = btn.dataset.view || 'grid';
        renderGear();
      });
    });

    // Copy Specs button
    const copyBtn = document.getElementById('copy-specs-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copySpecsToClipboard(copyBtn);
      });
    }
  }

  /**
   * Generate clean formatted text for clipboard
   */
  function formatSpecsText(list) {
    const categories = [
      { key: 'pc', title: '🖥️ GAMING RIG' },
      { key: 'monitors', title: '📺 DISPLAYS' },
      { key: 'audio', title: '🎙️ AUDIO & STREAM CONTROL' },
      { key: 'peripherals', title: '⌨️ PERIPHERALS & DESK' },
      { key: 'camera', title: '💡 CAMERA & STUDIO LIGHTING' }
    ];

    const lines = [
      '======================================================',
      '🎮 SLICKPICKLENICK OFFICIAL BROADCAST RIG & SPECS',
      '======================================================',
      ''
    ];

    categories.forEach(cat => {
      const items = list.filter(i => i.category === cat.key);
      if (items.length > 0) {
        lines.push(cat.title);
        lines.push('------------------------------------------------------');
        items.forEach(item => {
          lines.push(`• ${item.name} - ${item.role}`);
          if (item.specs && item.specs.length > 0) {
            const specSummary = item.specs.map(s => `${s.label}: ${s.value}`).join(' | ');
            lines.push(`  Specs: ${specSummary}`);
          }
        });
        lines.push('');
      }
    });

    lines.push('Official Merch & Stream: https://slickpicklenick.live');
    return lines.join('\n');
  }

  /**
   * Copy specs to clipboard with visual toast feedback
   */
  async function copySpecsToClipboard(buttonEl) {
    const textToCopy = formatSpecsText(gearData);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const originalHTML = buttonEl.innerHTML;
      buttonEl.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Specs Copied!</span>
      `;
      buttonEl.classList.add('copied');

      showToast('Hardware specs copied to clipboard!');

      setTimeout(() => {
        buttonEl.innerHTML = originalHTML;
        buttonEl.classList.remove('copied');
      }, 2500);
    } catch (err) {
      console.error('Failed to copy specs:', err);
      showToast('Could not copy specs to clipboard.');
    }
  }

  /**
   * Toast notification helper
   */
  function showToast(message) {
    let toast = document.getElementById('spn-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'spn-toast';
      toast.className = 'toast-notification';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGear);
  } else {
    initGear();
  }

})();
