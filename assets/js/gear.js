/**
 * Setup & Gear Explorer - SlickPickleNick Official Website
 * Real-time category filtering, search, spec breakdown, creator commentary, and clipboard export.
 */

(function () {
  'use strict';

  let gearData = [];
  let currentCategory = 'all';
  let searchQuery = '';

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
      "whyNickUsesIt": "Unparalleled 1% low frame consistency in CPU-heavy games while encoding and running bots simultaneously."
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
      "whyNickUsesIt": "Flawless 1440p gaming fidelity with dedicated NVENC stream encoding that avoids taxing game performance."
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
      "whyNickUsesIt": "Keeps the 7800X3D whisper-quiet and cool under multi-hour stream loads."
    },
    {
      "id": "pc-case",
      "name": "NZXT H6 Flow RGB & C850 PSU",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Dual-Chamber Chassis & Power Supply",
      "specs": [
        { "label": "Case", "value": "NZXT H6 Flow RGB Compact Dual-Chamber" },
        { "label": "Power Supply", "value": "NZXT C850 850W 80+ Gold Fully Modular" },
        { "label": "Airflow", "value": "Angled Front Fans for GPU Direct Cooling" }
      ],
      "whyNickUsesIt": "Showcase dual-chamber layout with direct GPU intake cooling to keep noise floor minimal for the microphone."
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
        { "label": "Response Time", "value": "1ms (MPRT)" }
      ],
      "whyNickUsesIt": "Crisp 1440p resolution and 170Hz fluidity for competitive Fortnite battles and GeoGuessr reconnaissance."
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
      "whyNickUsesIt": "Matches the 32-inch scale of the main display to easily monitor live chat, Twitch alerts, and sound levels."
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
        { "label": "Touchscreen", "value": "Yes (Multi-Touch)" }
      ],
      "whyNickUsesIt": "Positioned right beneath the primary monitors as a dedicated touchscreen control center for audio and dashboards."
    },
    {
      "id": "audio-mic",
      "name": "Elgato Wave DX Dynamic Microphone",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Broadcast Dynamic XLR Voice Microphone",
      "specs": [
        { "label": "Capsule", "value": "Dynamic, Cardioid Polar Pattern" },
        { "label": "Acoustic Tuning", "value": "Warm broadcast presence with optimized speech clarity" },
        { "label": "Connection", "value": "Standard 3-Pin XLR" }
      ],
      "whyNickUsesIt": "Tight cardioid pickup rejects mechanical keyboard clicks while giving commentary a warm broadcast tone."
    },
    {
      "id": "audio-interface",
      "name": "Elgato Wave XLR Interface",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Low-Noise XLR Preamp & Digital Mixer",
      "specs": [
        { "label": "Gain Range", "value": "Up to 75dB Ultra-Low Noise Gain" },
        { "label": "Anti-Distortion", "value": "Proprietary Clipguard Technology" },
        { "label": "Software", "value": "Wave Link Digital Multi-Track Audio Mixing" }
      ],
      "whyNickUsesIt": "Hardware Clipguard prevents audio peaking when shouting or laughing during exciting stream moments."
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
      "whyNickUsesIt": "Swings directly under the main monitor line of sight, keeping the screen and face completely unobstructed."
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
      "whyNickUsesIt": "Pinpoint spatial directional audio for GeoGuessr audio cues and enemy footstep positioning with zero latency."
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
      "whyNickUsesIt": "High-fidelity listening for video editing, music, and casual playback when not wearing a headset."
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
      "whyNickUsesIt": "Substantial aluminum weight, satisfying tactile typing feel, and custom macros mapped for stream management."
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
        { "label": "Switches", "value": "Gen-3 Optical Mouse Switches (90M clicks)" }
      ],
      "whyNickUsesIt": "Ergonomic comfort for long gaming sessions with instant wireless response time and smooth tracking."
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
      "whyNickUsesIt": "Controls scene transitions, Channel Point sound effects, Discord mutes, and GeoGuessr torch triggers with single-button precision."
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
        { "label": "Design", "value": "Signature SlickPickleNick Topographic Contour Print" }
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
      "whyNickUsesIt": "Outputs uncompressed 1080p60 video with manual ISO/shutter lock, delivering crisp, noise-free framing."
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
        { "label": "Diffusion", "value": "Multi-layer edge-lit frosted glass" }
      ],
      "whyNickUsesIt": "Edge-lit frosted diffusion prevents eye strain while evenly illuminating Nick on camera with natural daylight tone."
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

  async function loadGearData() {
    try {
      const res = await fetch('assets/data/gear.json');
      if (res.ok) {
        gearData = await res.json();
      } else {
        gearData = fallbackGear;
      }
    } catch (e) {
      gearData = fallbackGear;
    }

    renderGear();
    updateCategoryCounts();
  }

  function renderGear() {
    const grid = document.getElementById('gear-grid');
    const countEl = document.getElementById('gear-count');
    const emptyState = document.getElementById('gear-empty-state');

    if (!grid) return;

    const filtered = gearData.filter((item) => {
      const matchesCategory =
        currentCategory === 'all' ||
        item.category.toLowerCase() === currentCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
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

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} hardware item${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(item => createGearCardHTML(item)).join('');
  }

  function createGearCardHTML(item) {
    const specsRows = (item.specs || []).map(spec => `
      <div class="gear-spec-item">
        <span class="gear-spec-k">${escapeHTML(spec.label)}</span>
        <span class="gear-spec-v">${escapeHTML(spec.value)}</span>
      </div>
    `).join('');

    const whyCommentary = item.whyNickUsesIt ? `
      <div class="gear-why-quote">
        <strong>Why Nick uses it:</strong> ${escapeHTML(item.whyNickUsesIt)}
      </div>
    ` : '';

    const merchLink = item.link ? `
      <div class="gear-card-action">
        <a href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%;">
          <span>View in Merch Shop</span>
        </a>
      </div>
    ` : '';

    return `
      <article class="gear-card" id="gear-${escapeHTML(item.id)}" data-id="${escapeHTML(item.id)}" data-category="${escapeHTML(item.category)}">
        <div class="gear-card-header">
          <div class="gear-card-top">
            <span class="gear-card-category">${escapeHTML(item.categoryLabel || item.category)}</span>
          </div>
          <h3 class="gear-card-title">${escapeHTML(item.name)}</h3>
          <div class="gear-card-role">${escapeHTML(item.role || '')}</div>
        </div>

        <div class="gear-specs-list" aria-label="Hardware Specifications">
          ${specsRows}
        </div>

        ${whyCommentary}
        ${merchLink}
      </article>
    `;
  }

  function updateCategoryCounts() {
    const counts = { all: gearData.length };
    gearData.forEach((item) => {
      const cat = item.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const chips = document.querySelectorAll('.chip-btn[data-category]');
    chips.forEach((chip) => {
      const cat = chip.dataset.category.toLowerCase();
      const count = counts[cat] !== undefined ? counts[cat] : 0;
      const countSpan = chip.querySelector('.chip-count');
      if (countSpan) {
        countSpan.textContent = count;
      }
    });
  }

  function setCategoryFilter(category) {
    currentCategory = category;
    const filterChips = document.querySelectorAll('.chip-btn[data-category]');
    filterChips.forEach((chip) => {
      const isActive = chip.dataset.category === category;
      chip.classList.toggle('active', isActive);
      chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    renderGear();
  }

  function setupSpecCopy() {
    const copyBtn = document.getElementById('copy-specs-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
      const formattedSpecs = buildFormattedSpecsText();

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(formattedSpecs);
        } else {
          const tempArea = document.createElement('textarea');
          tempArea.value = formattedSpecs;
          tempArea.style.position = 'fixed';
          tempArea.style.left = '-9999px';
          document.body.appendChild(tempArea);
          tempArea.select();
          document.execCommand('copy');
          document.body.removeChild(tempArea);
        }

        showToast('✓ Setup specs copied to clipboard!');
        copyBtn.classList.add('copied');
        const origHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Specs Copied!</span>
        `;

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = origHTML;
        }, 2200);
      } catch (err) {
        showToast('Could not copy specs to clipboard.');
      }
    });
  }

  function buildFormattedSpecsText() {
    const header = [
      "🎮 SLICKPICKLENICK PRO STREAMING SETUP & GEAR SPECS",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      ""
    ];

    const categoryTitles = {
      pc: "🖥️ GAMING RIG & PC",
      monitors: "📺 MONITORS & DISPLAYS",
      audio: "🎙️ AUDIO CHAIN",
      peripherals: "⌨️ PERIPHERALS & DESK",
      camera: "📷 CAMERA & LIGHTING"
    };

    const categories = ['pc', 'monitors', 'audio', 'peripherals', 'camera'];
    const lines = [...header];

    categories.forEach(cat => {
      const items = gearData.filter(i => i.category === cat);
      if (items.length > 0) {
        lines.push(categoryTitles[cat] || cat.toUpperCase() + ":");
        items.forEach(item => {
          const specSummary = (item.specs || []).map(s => `${s.label}: ${s.value}`).join(' | ');
          lines.push(`• ${item.name} (${item.role || ''})`);
          if (specSummary) {
            lines.push(`  ↳ ${specSummary}`);
          }
        });
        lines.push("");
      }
    });

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("🔗 Full gear details & live stream: https://slickpicklenick.live");

    return lines.join('\n');
  }

  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('gear-search-input');
    const clearBtn = document.getElementById('gear-search-clear');
    const filterChips = document.querySelectorAll('.chip-btn[data-category]');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = searchQuery.length > 0 ? 'inline-flex' : 'none';
        }
        renderGear();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchQuery = '';
        clearBtn.style.display = 'none';
        renderGear();
      });
    }

    filterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        setCategoryFilter(chip.dataset.category);
      });
    });

    setupSpecCopy();
    loadGearData();
  });

})();
