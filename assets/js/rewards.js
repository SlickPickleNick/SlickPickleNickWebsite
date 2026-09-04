/**
 * Channel Point Rewards Explorer - SlickPickleNick Website
 * Live search, category filtering, cost sorting, and streamlined reward cards.
 */

(function () {
  'use strict';

  let rewardsData = [];
  let currentCategory = 'all';
  let currentSort = 'featured';
  let searchQuery = '';

  const fallbackRewards = [
    { "id": "flashbang", "title": "Flashbang", "cost": 200, "category": "General", "description": "Flashbang Nick with a bright screen flash and sound effect!", "cooldown": "1 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": true },
    { "id": "zoom-camera", "title": "Zoom Camera", "cost": 300, "category": "General", "description": "Zoom right in on Nick's camera for dramatic effect!", "cooldown": "2 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "q-and-a", "title": "Q&A Question", "cost": 500, "category": "General", "description": "Submit a question for Nick to answer on stream! (Points refunded if skipped)", "cooldown": "None", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": true },
    { "id": "scuba", "title": "Scuba", "cost": 500, "category": "General", "description": "Scubaaaa Scubaaa sound alert.", "cooldown": "5 sec", "perStream": "Unlimited", "perUser": "3", "status": "Active", "isFeatured": false },
    { "id": "bazinga", "title": "Bazinga!", "cost": 500, "category": "General", "description": "Bazinga! - Sheldon Cooper sound effect on stream.", "cooldown": "5 sec", "perStream": "Unlimited", "perUser": "3", "status": "Active", "isFeatured": false },
    { "id": "breaking-news", "title": "Breaking News", "cost": 2500, "category": "General", "description": "Set a custom Breaking News ticker message at the bottom of the stream for 60 seconds!", "cooldown": "5 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "vip-status", "title": "VIP Status", "cost": 75000, "category": "General", "description": "Instant VIP badge status in chat! Thank you for the incredible stream support.", "cooldown": "None", "perStream": "Unlimited", "perUser": "1", "status": "Active", "isFeatured": true },
    { "id": "12-hour-stream", "title": "12 Hour Stream", "cost": 150000, "category": "General", "description": "Lock Nick into completing a 12 Hour Stream! (Scheduled and announced on Discord if not current stream).", "cooldown": "None", "perStream": "1", "perUser": "1", "status": "Active", "isFeatured": true },
    { "id": "24-hour-stream", "title": "24 Hour Stream", "cost": 150000, "category": "General", "description": "Lock Nick into completing a 24 Hour Stream! (Scheduled and announced on Discord if not current stream).", "cooldown": "None", "perStream": "1", "perUser": "1", "status": "Active", "isFeatured": true },
    { "id": "fortnite-skin", "title": "Choose Nick's Skin", "cost": 1000, "category": "Fortnite", "description": "Pick Nick's character skin for the next match.", "cooldown": "5 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "fortnite-drop", "title": "Pick the Next Drop", "cost": 2500, "category": "Fortnite", "description": "Choose where Nick lands on the map for the upcoming match.", "cooldown": "None", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "fortnite-no-vehicles", "title": "No Vehicles", "cost": 4500, "category": "Fortnite", "description": "Nick cannot use any vehicle for the next round (including riding with teammates!).", "cooldown": "None", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "fortnite-weapon-ban", "title": "Loadout Ban", "cost": 5000, "category": "Fortnite", "description": "Ban one specific weapon class (e.g. Shotguns, Snipers) for the whole match.", "cooldown": "None", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": true },
    { "id": "fortnite-one-chest", "title": "One Chest Only", "cost": 7500, "category": "Fortnite", "description": "Nick can only open ONE chest the entire round (floor loot allowed).", "cooldown": "None", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "chameleon-taunt", "title": "Force Taunt", "cost": 400, "category": "Meccha Chameleon", "description": "Force Nick to taunt seekers while hiding.", "cooldown": "5 sec", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": true },
    { "id": "chameleon-late-start", "title": "Late to the Game", "cost": 500, "category": "Meccha Chameleon", "description": "Nick must stand still for 10 seconds at the start of the round before hiding.", "cooldown": "5 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "chameleon-chatters-touch", "title": "The Chatter's Touch", "cost": 600, "category": "Meccha Chameleon", "description": "Specify a color Nick must incorporate into his camouflage artwork.", "cooldown": "None", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "chameleon-one-color", "title": "One-Color Challenge", "cost": 1000, "category": "Meccha Chameleon", "description": "Nick can only use a single color to blend in for the entire round.", "cooldown": "5 min", "perStream": "5", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "chameleon-repaint", "title": "Full Repaint", "cost": 3500, "category": "Meccha Chameleon", "description": "Nick must wipe to pure white and start his camouflage from scratch.", "cooldown": "1 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "chameleon-panic-paint", "title": "Panic Paint", "cost": 7500, "category": "Meccha Chameleon", "description": "Nick must abandon his current hiding spot and repaint elsewhere!", "cooldown": "1 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": true },
    { "id": "geoguessr-ban-country", "title": "Ban a Country", "cost": 1500, "category": "GeoGuessr", "description": "Ban one country from being guessed for the active round (International Mode).", "cooldown": "1 round", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false },
    { "id": "geoguessr-no-move", "title": "No-Move Round", "cost": 2000, "category": "GeoGuessr", "description": "Nick cannot pan or move along roads for the round (No Move Challenge).", "cooldown": "1 round", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": true },
    { "id": "geoguessr-5050", "title": "50/50 Chat Hint", "cost": 3000, "category": "GeoGuessr", "description": "Chat gives Nick two country choices, one of which is correct.", "cooldown": "5 min", "perStream": "Unlimited", "perUser": "Unlimited", "status": "Active", "isFeatured": false }
  ];

  async function loadRewards() {
    try {
      const res = await fetch('assets/data/rewards.json');
      if (res.ok) {
        rewardsData = await res.json();
      } else {
        rewardsData = fallbackRewards;
      }
    } catch (e) {
      rewardsData = fallbackRewards;
    }
    renderRewards();
    updateCategoryCounts();
  }

  function renderRewards() {
    const container = document.getElementById('rewards-grid');
    const countEl = document.getElementById('rewards-count');
    const emptyState = document.getElementById('rewards-empty-state');

    if (!container) return;

    let filtered = rewardsData.filter((item) => {
      const matchCategory =
        currentCategory === 'all' ||
        item.category.toLowerCase() === currentCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });

    if (currentSort === 'low-high') {
      filtered.sort((a, b) => a.cost - b.cost);
    } else if (currentSort === 'high-low') {
      filtered.sort((a, b) => b.cost - a.cost);
    } else {
      filtered.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.cost - b.cost;
      });
    }

    if (countEl) {
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'reward' : 'rewards'}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered
      .map((reward) => {
        const formattedCost = Number(reward.cost).toLocaleString();
        const cooldownText = reward.cooldown && reward.cooldown !== 'None' ? `${reward.cooldown} cooldown` : 'No cooldown';
        const userLimitText = reward.perUser && reward.perUser !== 'Unlimited' ? `Max ${reward.perUser}/user` : 'Unlimited';

        return `
        <article class="reward-card ${reward.isFeatured ? 'featured' : ''}">
          <div class="reward-card-top">
            <h3>${escapeHTML(reward.title)}</h3>
            <span class="reward-cost">${formattedCost} PTS</span>
          </div>
          <p class="reward-desc">${escapeHTML(reward.description)}</p>
          <div class="reward-meta">
            <span>${escapeHTML(reward.category)}</span>
            <span>&bull;</span>
            <span>${escapeHTML(cooldownText)}</span>
            <span>&bull;</span>
            <span>${escapeHTML(userLimitText)}</span>
          </div>
        </article>
      `;
      })
      .join('');
  }

  function updateCategoryCounts() {
    document.querySelectorAll('.chip-btn[data-reward-category]').forEach((btn) => {
      const cat = btn.getAttribute('data-reward-category');
      const countEl = btn.querySelector('.chip-count');
      if (countEl) {
        if (cat === 'all') {
          countEl.textContent = rewardsData.length;
        } else {
          const c = rewardsData.filter((i) => i.category.toLowerCase() === cat.toLowerCase()).length;
          countEl.textContent = c;
        }
      }
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('rewards-search-input');
    const clearBtn = document.getElementById('rewards-search-clear');
    const filterChips = document.querySelectorAll('.chip-btn[data-reward-category]');
    const sortSelect = document.getElementById('rewards-sort-select');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.classList.toggle('visible', searchQuery.length > 0);
        renderRewards();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        clearBtn.classList.remove('visible');
        renderRewards();
      });
    }

    filterChips.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterChips.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-reward-category') || 'all';
        renderRewards();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderRewards();
      });
    }

    loadRewards();
  });
})();
