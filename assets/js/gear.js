/**
 * Interactive Setup & Gear Explorer - SlickPickleNick Official Website
 * Features battlestation hotspot visualizer, category filtering, instant search,
 * spec tables, creator commentary ("Why Nick Uses It"), and single-click spec copying.
 */

(function () {
  'use strict';

  let gearData = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let activeHotspotIndex = null;

  const fallbackGear = [
    {
      "id": "pc-cpu",
      "name": "AMD Ryzen 7 7800X3D",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Primary Processor & 3D V-Cache Gaming",
      "image": "https://imgproxy.fourthwall.dev/VPIcaBjtCphnSBqmRHOvcWNRzBMc5dJMT5L_-pNURws/w:1920/sm:1/enc/8lP0YGJ_cpdHxigL/Z79xP-MwTA2Dh0Fa/b_H3KtzbYyQUUPSd/SSW8H5arGpVx2npk/b1rTcNAeNNUVyYJn/q_db3MuNTuXOrQgd/oQDxkXrIS918VwFO/B-hiHaMwJv_6KoU4/uu8ghvbGP6-7L3kA/kTMe_sUWirssnTcQ/3CjarOaj07ReixlQ/0EPxwH4R627Zu_Rg/CIrmO6gwa06Xq3jW/Ou5kgAWBStqpvYz9/5UsA4OUwVw32K-sq/7gQPDGPnfx03op5H.jpg",
      "specs": [
        { "label": "Cores / Threads", "value": "8 Cores / 16 Threads" },
        { "label": "Architecture", "value": "Zen 4 with AMD 3D V-Cache" },
        { "label": "Boost Clock", "value": "Up to 5.0 GHz" },
        { "label": "L3 Cache", "value": "96MB 3D V-Cache" },
        { "label": "Purpose", "value": "Zero frame drops while streaming heavy games" }
      ],
      "whyNickUsesIt": "The 3D V-Cache delivers unparalleled 1% low frame rates in CPU-demanding games like Fortnite and GeoGuessr while handling stream bots and background encoders simultaneously.",
      "hotspotIndex": 6
    },
    {
      "id": "pc-gpu",
      "name": "NVIDIA GeForce RTX 4070 Ti SUPER",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Graphics Rendering & Dual AV1 NVENC Streaming",
      "image": "https://imgproxy.fourthwall.dev/VPIcaBjtCphnSBqmRHOvcWNRzBMc5dJMT5L_-pNURws/w:1920/sm:1/enc/8lP0YGJ_cpdHxigL/Z79xP-MwTA2Dh0Fa/b_H3KtzbYyQUUPSd/SSW8H5arGpVx2npk/b1rTcNAeNNUVyYJn/q_db3MuNTuXOrQgd/oQDxkXrIS918VwFO/B-hiHaMwJv_6KoU4/uu8ghvbGP6-7L3kA/kTMe_sUWirssnTcQ/3CjarOaj07ReixlQ/0EPxwH4R627Zu_Rg/CIrmO6gwa06Xq3jW/Ou5kgAWBStqpvYz9/5UsA4OUwVw32K-sq/7gQPDGPnfx03op5H.jpg",
      "specs": [
        { "label": "VRAM", "value": "16GB GDDR6X" },
        { "label": "Memory Bus", "value": "256-bit" },
        { "label": "Encoding", "value": "8th Gen Dual NVENC (AV1 & HEVC)" },
        { "label": "Target Res", "value": "1440p High Refresh Gameplay" }
      ],
      "whyNickUsesIt": "Provides flawless 1440p gaming fidelity with 16GB of VRAM and dedicated hardware NVENC encoding, keeping the stream buttery smooth without taxing game rendering.",
      "hotspotIndex": 6
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
      "whyNickUsesIt": "Handles OBS Studio, Streamer.bot chat automations, Spotify, browser sources, Discord, and games concurrently.",
      "hotspotIndex": 6
    },
    {
      "id": "pc-storage",
      "name": "Samsung 990 PRO 2TB NVMe SSD",
      "category": "pc",
      "categoryLabel": "Gaming Rig",
      "role": "Ultra-Fast PCIe 4.0 Storage",
      "specs": [
        { "label": "Capacity", "value": "2TB" },
        { "label": "Interface", "value": "PCIe Gen 4.0 x4, NVMe 2.0" },
        { "label": "Read / Write", "value": "Up to 7,450 / 6,900 MB/s" }
      ],
      "whyNickUsesIt": "Instant game load times and rapid clip saving with zero buffer latency during live broadcasts.",
      "hotspotIndex": 6
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
      "whyNickUsesIt": "Rock-solid VRM thermal performance and extensive rear I/O connectivity for all streaming capture cards, audio interfaces, and peripherals."
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
      "whyNickUsesIt": "Keeps the 7800X3D whisper-quiet and cool under multi-hour stream loads while displaying live system metrics on the pump cap."
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
      "whyNickUsesIt": "Seamless wraparound glass showcase design with dedicated direct GPU intake cooling to keep noise floor minimal for the broadcast microphone."
    },
    {
      "id": "monitor-main",
      "name": "ASUS TUF Gaming VG32AQA1A (32\")",
      "category": "monitors",
      "categoryLabel": "Monitors",
      "role": "Primary Gaming & Broadcast Display",
      "image": "https://m.media-amazon.com/images/I/71Nqmz4AqTL.jpg",
      "specs": [
        { "label": "Screen Size", "value": "32 Inch" },
        { "label": "Resolution", "value": "2560 x 1440 QHD" },
        { "label": "Refresh Rate", "value": "170Hz" },
        { "label": "Response Time", "value": "1ms (MPRT)" },
        { "label": "Panel", "value": "Fast VA with FreeSync Premium" }
      ],
      "whyNickUsesIt": "The high refresh rate and crisp 1440p resolution give Nick precise visual clarity in competitive Fortnite battles and GeoGuessr street reconnaissance.",
      "hotspotIndex": 2
    },
    {
      "id": "monitor-secondary",
      "name": "Sceptre 32\" QHD 144Hz Monitor",
      "category": "monitors",
      "categoryLabel": "Monitors",
      "role": "Tools, OBS & Chat Monitoring Display",
      "image": "https://www.sceptre.com/image/cache/data/product_gallery/1325-E325B-QPN168/1-1500x1044.jpg",
      "specs": [
        { "label": "Screen Size", "value": "32 Inch" },
        { "label": "Resolution", "value": "2560 x 1440 QHD" },
        { "label": "Refresh Rate", "value": "144Hz" },
        { "label": "Purpose", "value": "OBS Studio, Twitch Chat, Streamer.bot, Discord" }
      ],
      "whyNickUsesIt": "Matches the 32-inch scale of the main display to easily monitor live chat, Twitch alerts, sound levels, and bot queues without squinting.",
      "hotspotIndex": 3
    },
    {
      "id": "monitor-utility",
      "name": "Corsair Xeneon Edge (14.5\" Touchscreen)",
      "category": "monitors",
      "categoryLabel": "Monitors",
      "role": "Utility, Reference & Dashboard Display",
      "image": "https://d1q3zw97enxzq2.cloudfront.net/images/XENEON_EDGE_14_5_LCD_RENDER_05_2.width-540.format-webp.webp",
      "specs": [
        { "label": "Screen Size", "value": "14.5 Inch Ultra-Wide" },
        { "label": "Resolution", "value": "2560 x 720 Ultrawide" },
        { "label": "Touchscreen", "value": "Yes (Multi-Touch)" },
        { "label": "Refresh Rate", "value": "60Hz" }
      ],
      "whyNickUsesIt": "Positioned right beneath the primary monitors as a dedicated touchscreen control center for audio sliders, hardware sensors, and stream dashboards.",
      "hotspotIndex": 4
    },
    {
      "id": "audio-mic",
      "name": "Elgato Wave DX Dynamic Microphone",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Broadcast Dynamic XLR Voice Microphone",
      "image": "https://m.media-amazon.com/images/I/61MorJxxTGL.jpg",
      "specs": [
        { "label": "Capsule", "value": "Dynamic, Cardioid Polar Pattern" },
        { "label": "Acoustic Tuning", "value": "Warm broadcast presence with optimized speech clarity" },
        { "label": "Connection", "value": "Standard 3-Pin XLR" },
        { "label": "Internal Shielding", "value": "Internal pop filter & humbucker coil" }
      ],
      "whyNickUsesIt": "Tight cardioid pickup rejects mechanical keyboard clicks and room reflections while giving Nick's commentary a warm, radio-grade broadcast tone.",
      "hotspotIndex": 1
    },
    {
      "id": "audio-interface",
      "name": "Elgato Wave XLR Interface",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Ultra-Low-Noise XLR Preamp & Digital Mixer",
      "image": "https://res.cloudinary.com/elgato-pwa/image/upload/q_auto,f_auto/v1679563440/Products/10MAG9901/above-the-fold/desktop/wave-xlr-01_jcyurt.jpg",
      "specs": [
        { "label": "Gain Range", "value": "Up to 75dB Ultra-Low Noise Gain" },
        { "label": "Anti-Distortion", "value": "Proprietary Clipguard Technology" },
        { "label": "Controls", "value": "Capacitive Mute Sensor & Multifunction Dial" },
        { "label": "Software", "value": "Wave Link Digital Multi-Track Audio Mixing" }
      ],
      "whyNickUsesIt": "Hardware Clipguard prevents audio peaking when shouting or laughing during funny stream moments, while Wave Link splits Spotify, Discord, and game audio into clean sub-mixes.",
      "hotspotIndex": 5
    },
    {
      "id": "audio-boom",
      "name": "Elgato Wave Mic Arm LP",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Low-Profile Studio Boom Arm",
      "image": "https://res.cloudinary.com/elgato-pwa/image/upload/v1739971558/Products/10AAN9901/Rev%204/ATF/Mic_Arm_LP_Black_ATF_01.jpg",
      "specs": [
        { "label": "Design", "value": "Under-Monitor Low Profile" },
        { "label": "Rotation", "value": "360-degree horizontal swivel" },
        { "label": "Cable Management", "value": "Integrated magnetic cable channels" }
      ],
      "whyNickUsesIt": "Swings directly under the main monitor line of sight, keeping Nick's face and screen completely unobstructed on camera.",
      "hotspotIndex": 1
    },
    {
      "id": "audio-headphones",
      "name": "Logitech ASTRO A50 (Gen 5) Wireless",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Wireless Studio Reference & Game Monitoring",
      "image": "https://resource.logitechg.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/a50-gen-5/astro-a50-x-gen-5-black-gallery-3.png",
      "specs": [
        { "label": "Audio", "value": "PRO-G Graphene 40mm Drivers with Dolby Atmos" },
        { "label": "Wireless", "value": "LIGHTSPEED 24-bit uncompressed audio" },
        { "label": "Base Station", "value": "Magnetic charging dock with multi-device switching" }
      ],
      "whyNickUsesIt": "Pinpoint spatial directional audio for GeoGuessr audio cues and Fortnite enemy footstep positioning with zero wireless latency."
    },
    {
      "id": "audio-speakers",
      "name": "Edifier R1280T Studio Bookshelf Speakers",
      "category": "audio",
      "categoryLabel": "Audio Chain",
      "role": "Desktop Audio Reference Speakers",
      "image": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/0d6c873c-4635-4445-8eca-2d9af0d73805.jpg",
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
      "image": "https://www.lemokey.com/cdn/shop/products/Lemokey-P1-Pro-QMK-VIA-Wireless-Custom-Gaming-Keyboard-75-percent-Layout-Aluminum-Navy-Blue-Fully-Assembled-for-Windows-Mac-Linux-Keychron-Super-Banana.jpg?v=1710580537&width=600",
      "specs": [
        { "label": "Layout", "value": "75% Exploded Layout" },
        { "label": "Body", "value": "Full CNC Machined Aluminum Body" },
        { "label": "Switches", "value": "Keychron Super Banana Tactile Switches" },
        { "label": "Keycaps", "value": "Custom Profile Keycaps" },
        { "label": "Firmware", "value": "QMK / VIA Programmable" }
      ],
      "whyNickUsesIt": "Substantial aluminum heft, satisfying tactile typing feel, and custom macros mapped for quick stream management.",
      "hotspotIndex": 7
    },
    {
      "id": "peripheral-mouse",
      "name": "Razer DeathAdder V3 HyperSpeed",
      "category": "peripherals",
      "categoryLabel": "Peripherals & Desk",
      "role": "Ultra-Lightweight Ergonomic Esports Mouse",
      "image": "https://assets2.razerzone.com/images/pnx.assets/ef0800b3d46c633e4fac8bedf33fc991/dav3hyperspeed-desktop-hero.webp",
      "specs": [
        { "label": "Weight", "value": "55g Ultra-Lightweight" },
        { "label": "Sensor", "value": "Focus X 26K Optical Sensor" },
        { "label": "Switches", "value": "Gen-3 Optical Mouse Switches (90M clicks)" },
        { "label": "Connectivity", "value": "HyperSpeed Wireless (Up to 8000Hz polling)" }
      ],
      "whyNickUsesIt": "Ergonomic comfort for long gaming sessions with instant wireless response time and smooth tracking on desk mats.",
      "hotspotIndex": 7
    },
    {
      "id": "peripheral-streamdeck",
      "name": "Elgato Stream Deck Mk.2",
      "category": "peripherals",
      "categoryLabel": "Peripherals & Desk",
      "role": "Live Broadcast & Scene Controller",
      "image": "https://res.cloudinary.com/elgato-pwa/image/upload/q_auto,f_auto/f_auto/q_auto/v1747487049/Products/10GBA9901/above-the-fold/New/SD-ATF-03.jpg",
      "specs": [
        { "label": "Keys", "value": "15 Customizable LCD Keys" },
        { "label": "Integrations", "value": "OBS Studio, Wave Link, Streamer.bot, Spotify, Discord" },
        { "label": "Stand", "value": "45-degree angled desk stand" }
      ],
      "whyNickUsesIt": "Controls scene transitions, Channel Point sound effects, Discord mutes, and GeoGuessr torch game bot triggers with single-button precision.",
      "hotspotIndex": 5
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
      "whyNickUsesIt": "Provides a smooth, consistent mouse glide surface with anti-fray stitching and showcases signature stream branding across the workstation.",
      "hotspotIndex": 7,
      "link": "https://slickpicklenick.live/collections/all"
    },
    {
      "id": "camera-main",
      "name": "Elgato Facecam (1080p60)",
      "category": "camera",
      "categoryLabel": "Camera & Lighting",
      "role": "Broadcast Stream Facecam",
      "image": "https://res.cloudinary.com/elgato-pwa/image/upload/q_auto,f_auto/f_auto/q_auto/v1773404037/Products/10WAC9901/Above%20The%20Fold/Final/Facecam_ATF_02.jpg",
      "specs": [
        { "label": "Resolution", "value": "Uncompressed 1080p at 60 FPS" },
        { "label": "Sensor", "value": "Sony STARVIS CMOS Sensor" },
        { "label": "Lens", "value": "Elgato Prime Lens f/2.4 24mm all-glass" },
        { "label": "Field of View", "value": "82-degree diagonal FOV" }
      ],
      "whyNickUsesIt": "Outputs uncompressed 1080p60 video with manual ISO/shutter lock, delivering crisp, noise-free camera framing for the stream overlay.",
      "hotspotIndex": 4
    },
    {
      "id": "camera-keylight",
      "name": "Elgato Key Light",
      "category": "camera",
      "categoryLabel": "Camera & Lighting",
      "role": "Main Front Key Lighting",
      "image": "https://res.cloudinary.com/elgato-pwa/image/upload/q_auto,f_auto/f_auto/q_auto/v1773404823/Products/10GAK9901/above-the-fold/Final/Key_Light_ATF_02.jpg",
      "specs": [
        { "label": "Brightness", "value": "Up to 2800 Lumens" },
        { "label": "Color Temperature", "value": "2900K - 7000K (Warm amber to ice white)" },
        { "label": "Diffusion", "value": "Multi-layer edge-lit frosted glass" },
        { "label": "Control", "value": "Wi-Fi app & Stream Deck integration" }
      ],
      "whyNickUsesIt": "Edge-lit frosted diffusion prevents eye strain during multi-hour streams while evenly illuminating Nick on camera with natural daylight tone."
    },
    {
      "id": "camera-toplight",
      "name": "NiceVeedi Studio Desk Light",
      "category": "camera",
      "categoryLabel": "Camera & Lighting",
      "role": "Toplight & Ambient Workspace Fill",
      "image": "https://m.media-amazon.com/images/I/71Gd5Jhv+WL._AC_SL1500_.jpg",
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
    initHotspots();
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
      countEl.textContent = `Showing ${filtered.length} item${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    grid.innerHTML = filtered.map(item => createGearCardHTML(item)).join('');

    // Attach card event listeners
    attachCardListeners();
  }

  function createGearCardHTML(item) {
    const hotspotBadge = item.hotspotIndex ? `
      <button type="button" class="gear-pin-jump-btn" data-jump-hotspot="${item.hotspotIndex}" title="View hotspot #${item.hotspotIndex} on battlestation map" aria-label="View hotspot #${item.hotspotIndex} on battlestation map">
        <span class="hotspot-mini-dot">${item.hotspotIndex}</span>
        <span>Map Pin</span>
      </button>
    ` : '';

    const specsRows = (item.specs || []).map(spec => `
      <div class="gear-spec-row">
        <span class="gear-spec-label">${escapeHTML(spec.label)}</span>
        <span class="gear-spec-val">${escapeHTML(spec.value)}</span>
      </div>
    `).join('');

    const whyCommentary = item.whyNickUsesIt ? `
      <div class="gear-why-box">
        <div class="gear-why-header">
          <svg class="gear-why-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span class="gear-why-title">Why Nick Uses It</span>
        </div>
        <p class="gear-why-text">${escapeHTML(item.whyNickUsesIt)}</p>
      </div>
    ` : '';

    const merchLink = item.link ? `
      <div class="gear-card-actions">
        <a href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm gear-merch-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span>View in Merch Shop</span>
        </a>
      </div>
    ` : '';

    const imageHTML = item.image ? `
      <div class="gear-card-media">
        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.parentElement.style.display='none';" />
      </div>
    ` : '';

    return `
      <article class="gear-card" id="gear-${item.id}" data-id="${item.id}" data-hotspot="${item.hotspotIndex || ''}" data-category="${item.category}">
        ${imageHTML}
        <div class="gear-card-body">
          <div class="gear-card-header">
            <div class="gear-badges-wrap">
              <span class="badge badge-green">${escapeHTML(item.categoryLabel || item.category)}</span>
              ${hotspotBadge}
            </div>
            <h3 class="gear-card-title">${escapeHTML(item.name)}</h3>
            <p class="gear-card-role">${escapeHTML(item.role || '')}</p>
          </div>

          <div class="gear-specs-table" aria-label="Hardware Specifications">
            ${specsRows}
          </div>

          ${whyCommentary}
          ${merchLink}
        </div>
      </article>
    `;
  }

  function attachCardListeners() {
    const jumpButtons = document.querySelectorAll('.gear-pin-jump-btn');
    jumpButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pinNum = parseInt(btn.getAttribute('data-jump-hotspot'), 10);
        if (pinNum) {
          activateHotspot(pinNum, true);
        }
      });
    });

    const cards = document.querySelectorAll('.gear-card[data-hotspot]');
    cards.forEach(card => {
      const pinNum = parseInt(card.getAttribute('data-hotspot'), 10);
      if (!pinNum) return;

      card.addEventListener('mouseenter', () => {
        highlightHotspotPin(pinNum, true);
      });
      card.addEventListener('mouseleave', () => {
        if (activeHotspotIndex !== pinNum) {
          highlightHotspotPin(pinNum, false);
        }
      });
    });
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

  function initHotspots() {
    const pins = document.querySelectorAll('.hotspot-pin');
    pins.forEach(pin => {
      const pinIndex = parseInt(pin.getAttribute('data-hotspot'), 10);

      pin.addEventListener('click', () => {
        activateHotspot(pinIndex, false);
      });

      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateHotspot(pinIndex, false);
        }
      });
    });
  }

  function highlightHotspotPin(pinIndex, isHighlighted) {
    const pin = document.querySelector(`.hotspot-pin[data-hotspot="${pinIndex}"]`);
    if (pin) {
      if (isHighlighted) {
        pin.classList.add('is-hovered');
      } else {
        pin.classList.remove('is-hovered');
      }
    }
  }

  function activateHotspot(pinIndex, scrollToMap) {
    activeHotspotIndex = pinIndex;

    // Update active pin visual
    const allPins = document.querySelectorAll('.hotspot-pin');
    allPins.forEach(p => {
      const pIdx = parseInt(p.getAttribute('data-hotspot'), 10);
      if (pIdx === pinIndex) {
        p.classList.add('is-active');
        p.setAttribute('aria-expanded', 'true');
      } else {
        p.classList.remove('is-active');
        p.setAttribute('aria-expanded', 'false');
      }
    });

    if (scrollToMap) {
      const mapContainer = document.getElementById('battlestation-map');
      if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // If a category filter is active that hides this hotspot item, switch category to all
    const matchingItems = gearData.filter(item => item.hotspotIndex === pinIndex);
    if (matchingItems.length > 0) {
      const targetCategory = matchingItems[0].category;
      if (currentCategory !== 'all' && currentCategory !== targetCategory) {
        setCategoryFilter('all');
      }
    }

    // Scroll to first matching gear card
    const targetCard = document.querySelector(`.gear-card[data-hotspot="${pinIndex}"]`);
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetCard.classList.add('gear-card-highlighted');

      setTimeout(() => {
        targetCard.classList.remove('gear-card-highlighted');
      }, 2500);
    }
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
          // Fallback textarea method
          const tempArea = document.createElement('textarea');
          tempArea.value = formattedSpecs;
          tempArea.style.position = 'fixed';
          tempArea.style.left = '-9999px';
          document.body.appendChild(tempArea);
          tempArea.select();
          document.execCommand('copy');
          document.body.removeChild(tempArea);
        }

        showToast('✓ Full setup specs copied to clipboard!');
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

  // Initialization on DOM ready
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
