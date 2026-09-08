/**
 * Interactive 3D Battlestation & Gear Explorer - SlickPickleNick Official Website
 * Features a real-time Three.js 3D WebGL workstation model, interactive raycast hotspots,
 * smooth camera transitions, hardware spec inspector, categorized specs, and clipboard export.
 */

(function () {
  'use strict';

  let gearData = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let selectedGearIndex = 0;

  // 3D Scene globals
  let scene, camera, renderer, controls;
  let animationFrameId;
  let isAutoRotating = false;
  let hotspotMeshes = [];
  let raycaster, mouse;
  let cameraTween = null;

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
      "whyNickUsesIt": "Unparalleled 1% low frame consistency in CPU-heavy games while encoding and running stream bots simultaneously.",
      "viewPreset": "pc",
      "hotspotIndex": 6
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
      "whyNickUsesIt": "Flawless 1440p gaming fidelity with dedicated NVENC stream encoding that avoids taxing game rendering.",
      "viewPreset": "pc",
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
      "whyNickUsesIt": "Handles OBS Studio, Streamer.bot, Spotify, browser sources, Discord, and games concurrently.",
      "viewPreset": "pc",
      "hotspotIndex": 6
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
      "whyNickUsesIt": "Instant game load times and rapid local clip recording with zero latency.",
      "viewPreset": "pc",
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
      "whyNickUsesIt": "Rock-solid VRM thermal performance and extensive rear I/O connectivity for all streaming capture cards.",
      "viewPreset": "pc"
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
      "whyNickUsesIt": "Keeps the 7800X3D whisper-quiet and cool under multi-hour stream loads.",
      "viewPreset": "pc"
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
      "whyNickUsesIt": "Showcase dual-chamber layout with direct GPU intake cooling to keep noise floor minimal for the microphone.",
      "viewPreset": "pc",
      "hotspotIndex": 6
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
      "whyNickUsesIt": "Crisp 1440p resolution and 170Hz fluidity for competitive Fortnite battles and GeoGuessr reconnaissance.",
      "viewPreset": "monitors",
      "hotspotIndex": 2
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
      "whyNickUsesIt": "Matches the 32-inch scale of the main display to easily monitor live chat, Twitch alerts, and sound levels.",
      "viewPreset": "monitors",
      "hotspotIndex": 3
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
      "whyNickUsesIt": "Positioned right beneath the primary monitors as a dedicated touchscreen control center for audio and dashboards.",
      "viewPreset": "monitors",
      "hotspotIndex": 4
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
      "whyNickUsesIt": "Tight cardioid pickup rejects mechanical keyboard clicks while giving commentary a warm broadcast tone.",
      "viewPreset": "audio",
      "hotspotIndex": 1
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
      "whyNickUsesIt": "Hardware Clipguard prevents audio peaking when shouting or laughing during exciting stream moments.",
      "viewPreset": "audio",
      "hotspotIndex": 5
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
      "whyNickUsesIt": "Swings directly under the main monitor line of sight, keeping the screen and face completely unobstructed.",
      "viewPreset": "audio",
      "hotspotIndex": 1
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
      "whyNickUsesIt": "Pinpoint spatial directional audio for GeoGuessr audio cues and enemy footstep positioning with zero latency.",
      "viewPreset": "audio"
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
      "whyNickUsesIt": "High-fidelity listening for video editing, music, and casual playback when not wearing a headset.",
      "viewPreset": "audio"
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
      "whyNickUsesIt": "Substantial aluminum weight, satisfying tactile typing feel, and custom macros mapped for stream management.",
      "viewPreset": "peripherals",
      "hotspotIndex": 7
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
      "whyNickUsesIt": "Ergonomic comfort for long gaming sessions with instant wireless response time and smooth tracking.",
      "viewPreset": "peripherals",
      "hotspotIndex": 7
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
      "whyNickUsesIt": "Controls scene transitions, Channel Point sound effects, Discord mutes, and GeoGuessr torch triggers with single-button precision.",
      "viewPreset": "peripherals",
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
        { "label": "Design", "value": "Signature SlickPickleNick Topographic Contour Print" }
      ],
      "whyNickUsesIt": "Provides a smooth mouse glide surface with anti-fray stitching and signature stream branding.",
      "viewPreset": "peripherals",
      "hotspotIndex": 7,
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
      "whyNickUsesIt": "Outputs uncompressed 1080p60 video with manual ISO/shutter lock, delivering crisp, noise-free framing.",
      "viewPreset": "camera",
      "hotspotIndex": 4
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
      "whyNickUsesIt": "Edge-lit frosted diffusion prevents eye strain while evenly illuminating Nick on camera with natural daylight tone.",
      "viewPreset": "camera"
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
      "whyNickUsesIt": "Adds soft overhead separation and fills in workstation shadows for professional multi-point broadcast lighting.",
      "viewPreset": "camera"
    }
  ];

  // Camera presets coordinates (position & lookAt target)
  const CAMERA_PRESETS = {
    overview: {
      pos: { x: 0, y: 11, z: 18 },
      target: { x: 0, y: 3.5, z: 0 }
    },
    pc: {
      pos: { x: 7.2, y: 6.8, z: 8.5 },
      target: { x: 5.5, y: 4.2, z: 0.5 }
    },
    monitors: {
      pos: { x: 0, y: 6.8, z: 10.5 },
      target: { x: 0, y: 5.2, z: -0.2 }
    },
    audio: {
      pos: { x: -4.5, y: 6.2, z: 7.5 },
      target: { x: -3.2, y: 4.0, z: 1.2 }
    },
    peripherals: {
      pos: { x: 0, y: 8.5, z: 7.5 },
      target: { x: 0, y: 2.2, z: 2.5 }
    },
    camera: {
      pos: { x: 0, y: 9.5, z: 12 },
      target: { x: 0, y: 7.5, z: -0.5 }
    }
  };

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

    renderInspector();
    renderCategorizedSpecSheet();
    updateCategoryCounts();

    // Initialize 3D Scene
    init3DScene();
  }

  function init3DScene() {
    const container = document.getElementById('battlestation-3d-canvas');
    if (!container || typeof THREE === 'undefined') return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const defaultPreset = CAMERA_PRESETS.overview;
    camera.position.set(defaultPreset.pos.x, defaultPreset.pos.y, defaultPreset.pos.z);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below desk ground
      controls.minDistance = 4;
      controls.maxDistance = 28;
      controls.target.set(defaultPreset.target.x, defaultPreset.target.y, defaultPreset.target.z);
      controls.update();
    }

    // Raycasting
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Lighting
    setupLighting();

    // Build 3D Battlestation Models
    buildBattlestationModels();

    // Event Listeners
    setup3DControls(container);

    // Animation Loop
    animate();

    // Resize Handler
    window.addEventListener('resize', onWindowResize);
  }

  function setupLighting() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 0.9);
    scene.add(ambientLight);

    // Main Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.0 : 1.2);
    keyLight.position.set(6, 14, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light (Soft cool tone)
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.4);
    fillLight.position.set(-8, 10, 6);
    scene.add(fillLight);

    // Emerald Green Accent Underglow
    const greenAccent = new THREE.PointLight(0x10b981, 1.8, 12);
    greenAccent.position.set(0, 2.8, 0);
    scene.add(greenAccent);

    // PC RGB Glow
    const pcRgbGlow = new THREE.PointLight(0x34d399, 1.5, 8);
    pcRgbGlow.position.set(5.5, 4.2, 0.5);
    scene.add(pcRgbGlow);
  }

  function buildBattlestationModels() {
    // Materials
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e222b, roughness: 0.4, metalness: 0.1 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.2, metalness: 0.9 });
    const pcChassisMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8
    });

    // 1. Desk Top & Legs
    const desk = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 7.5), deskMat);
    desk.position.set(0, 3, 0);
    desk.receiveShadow = true;
    scene.add(desk);

    const legGeo = new THREE.BoxGeometry(0.4, 3, 0.4);
    const legPositions = [
      [-7.5, 1.5, -3.2], [7.5, 1.5, -3.2],
      [-7.5, 1.5, 3.2], [7.5, 1.5, 3.2]
    ];
    legPositions.forEach(pos => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      scene.add(leg);
    });

    // 2. Topographic Desk Mat
    const matCanvas = createDeskMatTexture();
    const matTexture = new THREE.CanvasTexture(matCanvas);
    const matMaterial = new THREE.MeshStandardMaterial({ map: matTexture, roughness: 0.8 });
    const deskMatMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 4.5), matMaterial);
    deskMatMesh.rotation.x = -Math.PI / 2;
    deskMatMesh.position.set(-0.5, 3.26, 0.8);
    deskMatMesh.receiveShadow = true;
    scene.add(deskMatMesh);

    // 3. Main Gaming Display (ASUS TUF 32" 170Hz - Hotspot 2)
    const mainScreenGroup = new THREE.Group();
    const mainFrame = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.8, 0.2), screenFrameMat);
    mainFrame.castShadow = true;
    mainScreenGroup.add(mainFrame);

    const mainDisplayTexture = createScreenTexture("ASUS TUF 32'' QHD", "170Hz • 1ms • Gameplay");
    const mainScreenMat = new THREE.MeshBasicMaterial({ map: mainDisplayTexture });
    const mainScreen = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.6), mainScreenMat);
    mainScreen.position.z = 0.11;
    mainScreenGroup.add(mainScreen);

    // Monitor Stand
    const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), metalMat);
    standPole.position.set(0, -1.2, -0.6);
    standPole.castShadow = true;
    mainScreenGroup.add(standPole);

    mainScreenGroup.position.set(-0.5, 5.8, -1.2);
    scene.add(mainScreenGroup);

    // 4. Secondary Display (Sceptre 32" 144Hz - Hotspot 3)
    const secScreenGroup = new THREE.Group();
    const secFrame = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.6, 0.2), screenFrameMat);
    secFrame.castShadow = true;
    secScreenGroup.add(secFrame);

    const secDisplayTexture = createScreenTexture("SCEPTRE 32'' 144Hz", "OBS Studio • Chat • Discord");
    const secScreenMat = new THREE.MeshBasicMaterial({ map: secDisplayTexture });
    const secScreen = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.4), secScreenMat);
    secScreen.position.z = 0.11;
    secScreenGroup.add(secScreen);

    secScreenGroup.position.set(4.6, 5.7, -0.2);
    secScreenGroup.rotation.y = -Math.PI / 6.5;
    scene.add(secScreenGroup);

    // 5. Touchscreen Utility Display (Corsair Xeneon Edge 14.5" - Hotspot 4)
    const utilScreenGroup = new THREE.Group();
    const utilFrame = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.3, 0.15), screenFrameMat);
    utilScreenGroup.add(utilFrame);

    const utilDisplayTexture = createScreenTexture("CORSAIR XENEON EDGE", "Audio Mix • Sensors • Dash");
    const utilScreenMat = new THREE.MeshBasicMaterial({ map: utilDisplayTexture });
    const utilScreen = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.15), utilScreenMat);
    utilScreen.position.z = 0.08;
    utilScreenGroup.add(utilScreen);

    utilScreenGroup.position.set(-0.5, 3.8, -0.6);
    utilScreenGroup.rotation.x = -Math.PI / 8;
    scene.add(utilScreenGroup);

    // 6. Elgato Facecam 1080p60 (Hotspot 4 top)
    const camMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), metalMat);
    camMesh.position.set(-0.5, 7.85, -1.1);
    const lensMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(0, 0, 0.26);
    camMesh.add(lensMesh);
    scene.add(camMesh);

    // 7. NZXT H6 Flow PC Tower (Hotspot 6)
    const pcGroup = new THREE.Group();
    const pcBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.8, 4.4), pcChassisMat);
    pcBody.castShadow = true;
    pcGroup.add(pcBody);

    const pcGlass = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.6), glassMat);
    pcGlass.rotation.y = -Math.PI / 2;
    pcGlass.position.set(-1.21, 0, 0);
    pcGroup.add(pcGlass);

    // GPU with glowing edge inside PC
    const gpuMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 2.6), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    gpuMesh.position.set(0.2, -0.6, 0);
    const gpuGlow = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 2.4), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    gpuGlow.position.set(-0.9, 0, 0);
    gpuMesh.add(gpuGlow);
    pcGroup.add(gpuMesh);

    // CPU Cooler LCD Ring
    const cpuCooler = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16), new THREE.MeshBasicMaterial({ color: 0x34d399 }));
    cpuCooler.rotation.z = Math.PI / 2;
    cpuCooler.position.set(0.4, 0.8, 0.2);
    pcGroup.add(cpuCooler);

    pcGroup.position.set(6.4, 5.65, -0.6);
    scene.add(pcGroup);

    // 8. Elgato Wave DX XLR Mic & LP Boom Arm (Hotspot 1)
    const micGroup = new THREE.Group();
    // Boom arm joint segments
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8), metalMat);
    arm1.position.set(-5.5, 4.2, -0.5);
    arm1.rotation.z = Math.PI / 3;
    micGroup.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), metalMat);
    arm2.position.set(-3.8, 4.7, 0.8);
    arm2.rotation.y = Math.PI / 4;
    arm2.rotation.z = -Math.PI / 10;
    micGroup.add(arm2);

    // Mic capsule
    const micCapsule = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.2, 16), metalMat);
    micCapsule.rotation.z = Math.PI / 2.8;
    micCapsule.position.set(-2.5, 4.8, 1.6);
    micGroup.add(micCapsule);
    scene.add(micGroup);

    // 9. Lemokey P1 Pro Keyboard & Razer Mouse (Hotspot 7)
    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.22, 1.5), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6 }));
    kbMesh.position.set(-1.2, 3.38, 1.4);
    kbMesh.castShadow = true;
    scene.add(kbMesh);

    const mouseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 1.1), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    mouseMesh.position.set(1.5, 3.4, 1.4);
    mouseMesh.castShadow = true;
    scene.add(mouseMesh);

    // 10. Elgato Stream Deck Mk.2 & Wave XLR (Hotspot 5)
    const sdMesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 1.1), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
    sdMesh.rotation.x = -Math.PI / 6;
    sdMesh.position.set(-4.2, 3.5, 1.2);
    scene.add(sdMesh);

    const waveXlrMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.35, 16), metalMat);
    waveXlrMesh.position.set(-4.2, 3.45, -0.4);
    const dialGlow = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.35, 16), new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide }));
    dialGlow.rotation.x = -Math.PI / 2;
    dialGlow.position.y = 0.18;
    waveXlrMesh.add(dialGlow);
    scene.add(waveXlrMesh);

    // 11. Add Floating 3D Hotspot Pins (1–7)
    createHotspotPins();
  }

  function createHotspotPins() {
    const pinConfigs = [
      { num: 1, label: "Wave DX Dynamic Mic & LP Arm", pos: [-2.5, 5.6, 1.6], preset: "audio", gearId: "audio-mic" },
      { num: 2, label: "ASUS TUF 32\" 170Hz Gaming Monitor", pos: [-0.5, 7.4, -1.0], preset: "monitors", gearId: "monitor-main" },
      { num: 3, label: "Sceptre 32\" OBS & Chat Monitor", pos: [4.6, 7.2, 0.0], preset: "monitors", gearId: "monitor-secondary" },
      { num: 4, label: "Elgato Facecam & Touchscreen", pos: [-0.5, 8.4, -0.9], preset: "camera", gearId: "camera-main" },
      { num: 5, label: "Stream Deck Mk.2 & Wave XLR", pos: [-4.2, 4.2, 0.8], preset: "peripherals", gearId: "peripheral-streamdeck" },
      { num: 6, label: "AMD 7800X3D + RTX 4070 Ti SUPER Rig", pos: [6.4, 7.8, -0.6], preset: "pc", gearId: "pc-gpu" },
      { num: 7, label: "Lemokey P1 Pro Keyboard & Desk Mat", pos: [-0.5, 4.1, 1.8], preset: "peripherals", gearId: "peripheral-keyboard" }
    ];

    pinConfigs.forEach(cfg => {
      const pinGroup = new THREE.Group();

      // Outer glow sphere
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.85
      });
      const pinSphere = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), glowMat);
      pinGroup.add(pinSphere);

      // Ring pulse
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x34d399, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.38, 16), ringMat);
      ring.rotation.x = Math.PI / 2;
      pinGroup.add(ring);

      pinGroup.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      pinGroup.userData = { isHotspot: true, num: cfg.num, label: cfg.label, preset: cfg.preset, gearId: cfg.gearId };

      scene.add(pinGroup);
      hotspotMeshes.push(pinGroup);
    });
  }

  function createScreenTexture(title, sub) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 288;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 512, 288);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 288);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 288); ctx.stroke();
    }
    for (let y = 0; y < 288; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
    }

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 130);

    ctx.fillStyle = '#34d399';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.fillText(sub, 256, 165);

    return new THREE.CanvasTexture(canvas);
  }

  function createDeskMatTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 1024, 512);

    // Topographic contours
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 2;

    for (let r = 50; r < 500; r += 40) {
      ctx.beginPath();
      ctx.ellipse(350, 256, r * 1.4, r * 0.8, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(750, 256, r * 1.1, r * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Stitched Border
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 1004, 492);

    return canvas;
  }

  function setup3DControls(container) {
    // Preset buttons
    const presetButtons = document.querySelectorAll('.view-preset-btn[data-preset]');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        if (CAMERA_PRESETS[presetKey]) {
          transitionCamera(CAMERA_PRESETS[presetKey]);

          presetButtons.forEach(b => b.classList.toggle('active', b === btn));

          // Select first item matching preset
          const matchingIdx = gearData.findIndex(g => (g.viewPreset || g.category) === presetKey);
          if (matchingIdx !== -1) {
            selectedGearIndex = matchingIdx;
            renderInspector();
          }
        }
      });
    });

    // Auto-Rotate Toggle Button
    const rotateBtn = document.getElementById('toggle-rotate-btn');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        rotateBtn.classList.toggle('active', isAutoRotating);
        rotateBtn.setAttribute('aria-pressed', isAutoRotating ? 'true' : 'false');
      });
    }

    // Reset View Button
    const resetViewBtn = document.getElementById('reset-3d-view-btn');
    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        transitionCamera(CAMERA_PRESETS.overview);
      });
    }

    // Raycast click detection on Canvas
    container.addEventListener('pointerdown', onCanvasPointerDown);
  }

  function onCanvasPointerDown(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let hit of intersects) {
      let current = hit.object;
      while (current && current !== scene) {
        if (current.userData && current.userData.isHotspot) {
          const data = current.userData;
          if (data.preset && CAMERA_PRESETS[data.preset]) {
            transitionCamera(CAMERA_PRESETS[data.preset]);
          }
          if (data.gearId) {
            const idx = gearData.findIndex(g => g.id === data.gearId);
            if (idx !== -1) {
              selectedGearIndex = idx;
              renderInspector();
            }
          }
          return;
        }
        current = current.parent;
      }
    }
  }

  function transitionCamera(preset) {
    if (!preset || !controls) return;

    isAutoRotating = false;
    const rotateBtn = document.getElementById('toggle-rotate-btn');
    if (rotateBtn) rotateBtn.classList.remove('active');

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(preset.pos.x, preset.pos.y, preset.pos.z);
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(preset.target.x, preset.target.y, preset.target.z);

    const startTime = performance.now();
    const duration = 1100; // ms

    cameraTween = {
      update: (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // Smooth cosine easing

        camera.position.lerpVectors(startPos, endPos, ease);
        controls.target.lerpVectors(startTarget, endTarget, ease);
        controls.update();

        if (progress >= 1) {
          cameraTween = null;
        }
      }
    };
  }

  function animate(now = 0) {
    animationFrameId = requestAnimationFrame(animate);

    if (cameraTween) {
      cameraTween.update(now);
    } else if (isAutoRotating && controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
    } else if (controls) {
      controls.autoRotate = false;
    }

    if (controls) controls.update();

    // Pulse hotspot animations
    const pulseScale = 1 + Math.sin(now * 0.004) * 0.12;
    hotspotMeshes.forEach(pin => {
      pin.scale.set(pulseScale, pulseScale, pulseScale);
    });

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    const container = document.getElementById('battlestation-3d-canvas');
    if (!container || !camera || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // ==========================================
  // Active Hardware Inspector & Spec UI
  // ==========================================

  function renderInspector() {
    const container = document.getElementById('active-gear-inspector');
    if (!container || gearData.length === 0) return;

    const item = gearData[selectedGearIndex] || gearData[0];

    const specsRows = (item.specs || []).map(spec => `
      <div class="inspector-spec-row">
        <span class="inspector-spec-k">${escapeHTML(spec.label)}</span>
        <span class="inspector-spec-v">${escapeHTML(spec.value)}</span>
      </div>
    `).join('');

    const whyCommentary = item.whyNickUsesIt ? `
      <div class="inspector-why-box">
        <span class="inspector-why-tag">Why Nick Uses It</span>
        <p class="inspector-why-text">${escapeHTML(item.whyNickUsesIt)}</p>
      </div>
    ` : '';

    const merchLink = item.link ? `
      <a href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="margin-top: var(--space-2); width: 100%;">
        <span>View in Official Merch Shop</span>
      </a>
    ` : '';

    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-nav-bar">
          <button type="button" id="inspector-prev-btn" class="inspector-arrow-btn" aria-label="Previous hardware item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span class="inspector-counter">${selectedGearIndex + 1} of ${gearData.length}</span>
          <button type="button" id="inspector-next-btn" class="inspector-arrow-btn" aria-label="Next hardware item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <div class="inspector-header">
          <span class="badge badge-green">${escapeHTML(item.categoryLabel || item.category)}</span>
          <h3 class="inspector-title">${escapeHTML(item.name)}</h3>
          <div class="inspector-role">${escapeHTML(item.role || '')}</div>
        </div>

        <div class="inspector-specs-table">
          ${specsRows}
        </div>

        ${whyCommentary}
        ${merchLink}
      </div>
    `;

    // Hook prev/next buttons
    const prevBtn = document.getElementById('inspector-prev-btn');
    const nextBtn = document.getElementById('inspector-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        selectedGearIndex = (selectedGearIndex - 1 + gearData.length) % gearData.length;
        renderInspector();
        focusItemIn3D(gearData[selectedGearIndex]);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        selectedGearIndex = (selectedGearIndex + 1) % gearData.length;
        renderInspector();
        focusItemIn3D(gearData[selectedGearIndex]);
      });
    }
  }

  function focusItemIn3D(item) {
    if (!item) return;
    const presetKey = item.viewPreset || item.category;
    if (CAMERA_PRESETS[presetKey]) {
      transitionCamera(CAMERA_PRESETS[presetKey]);

      const presetButtons = document.querySelectorAll('.view-preset-btn[data-preset]');
      presetButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-preset') === presetKey));
    }
  }

  function renderCategorizedSpecSheet() {
    const container = document.getElementById('gear-accordion-container');
    if (!container || gearData.length === 0) return;

    const categories = [
      { key: 'pc', label: 'Gaming Rig & PC', icon: '⚡' },
      { key: 'monitors', label: 'Monitors & Displays', icon: '📺' },
      { key: 'audio', label: 'Audio Chain & Monitoring', icon: '🎙️' },
      { key: 'peripherals', label: 'Peripherals & Desk Surface', icon: '⌨️' },
      { key: 'camera', label: 'Camera & Lighting', icon: '📷' }
    ];

    container.innerHTML = categories.map((cat, idx) => {
      const items = gearData.filter(g => g.category === cat.key);
      const rows = items.map(item => `
        <div class="spec-accordion-item" data-gear-id="${escapeHTML(item.id)}">
          <div class="spec-accordion-item-head">
            <span class="spec-accordion-name">${escapeHTML(item.name)}</span>
            <span class="spec-accordion-role">${escapeHTML(item.role || '')}</span>
          </div>
          <div class="spec-accordion-detail">
            ${(item.specs || []).map(s => `<span><strong>${escapeHTML(s.label)}:</strong> ${escapeHTML(s.value)}</span>`).join(' • ')}
          </div>
        </div>
      `).join('');

      return `
        <details class="accordion-item" ${idx === 0 ? 'open' : ''}>
          <summary class="accordion-summary">
            <span>${cat.icon} ${cat.label} (${items.length})</span>
            <svg class="accordion-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </summary>
          <div class="accordion-content">
            <div class="spec-accordion-list">
              ${rows}
            </div>
          </div>
        </details>
      `;
    }).join('');

    // Clicking an item in the accordion focuses it in the inspector and 3D scene
    const itemRows = container.querySelectorAll('.spec-accordion-item');
    itemRows.forEach(row => {
      row.addEventListener('click', () => {
        const id = row.getAttribute('data-gear-id');
        const idx = gearData.findIndex(g => g.id === id);
        if (idx !== -1) {
          selectedGearIndex = idx;
          renderInspector();
          focusItemIn3D(gearData[idx]);

          const visualizer = document.getElementById('battlestation-3d-wrapper');
          if (visualizer) {
            visualizer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
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
    setupSpecCopy();
    loadGearData();
  });

})();
