/**
 * Twitch Commands Explorer - SlickPickleNick Website
 * Live search, category tabs, filtering, and animated copy-to-clipboard.
 */

(function () {
  'use strict';

  let commandsData = [];
  let currentCategory = 'all';
  let searchQuery = '';

  const fallbackCommands = [
    { "command": "!clip", "category": "General", "access": "Everyone", "description": "Clip the last 60 seconds of the stream.", "example": "!clip", "cooldown": "30s" },
    { "command": "!lurk", "category": "General", "access": "Everyone", "description": "Start the lurk timer while you are away.", "example": "!lurk", "cooldown": "None" },
    { "command": "!lurkStats", "category": "General", "access": "Everyone", "description": "Sends your personal lurking stats to chat.", "example": "!lurkStats", "cooldown": "10s" },
    { "command": "!lurkLeaderboard", "category": "General", "access": "Everyone", "description": "Shows the top lurkers of the stream.", "example": "!lurkLeaderboard", "cooldown": "30s" },
    { "command": "!followage", "category": "General", "access": "Everyone", "description": "Shows how long you have been following the stream.", "example": "!followage", "cooldown": "10s" },
    { "command": "!watchtime", "category": "General", "access": "Everyone", "description": "Sends your total watchtime to the chat.", "example": "!watchtime", "cooldown": "10s" },
    { "command": "!watchtimeLeaderboard", "category": "General", "access": "Everyone", "description": "Shows the top watchtime users across the channel.", "example": "!watchtimeLeaderboard", "cooldown": "30s" },
    { "command": "!emote", "category": "General", "access": "Everyone", "description": "Showcases all available emotes for viewers and subscribers.", "example": "!emote", "cooldown": "15s" },
    { "command": "!time", "category": "General", "access": "Everyone", "description": "Shows the current local time for Nick.", "example": "!time", "cooldown": "10s" },
    { "command": "!uptime", "category": "General", "access": "Everyone", "description": "Shows how long the stream has been live.", "example": "!uptime", "cooldown": "10s" },
    { "command": "!checkinlb", "category": "General", "access": "Everyone", "description": "Sends the leaderboard for check-ins.", "example": "!checkinlb", "cooldown": "30s" },
    { "command": "!checkins", "category": "General", "access": "Everyone", "description": "Shows your personal check-in history.", "example": "!checkins", "cooldown": "10s" },
    { "command": "!socials", "category": "Socials", "access": "Everyone", "description": "Shows Nick's main social media links.", "example": "!socials", "cooldown": "10s" },
    { "command": "!discord", "category": "Socials", "access": "Everyone", "description": "Sends the official Discord invite link.", "example": "!discord", "cooldown": "10s" },
    { "command": "!website", "category": "Socials", "access": "Everyone", "description": "Links directly to Nick's website.", "example": "!website", "cooldown": "10s" },
    { "command": "!tip", "category": "Socials", "access": "Everyone", "description": "Sends the link to send a tip or donation to Nick.", "example": "!tip", "cooldown": "10s" },
    { "command": "!merch", "category": "Socials", "access": "Everyone", "description": "Links to the official merch shop.", "example": "!merch", "cooldown": "10s" },
    { "command": "!sr [Song and Artist]", "category": "Spotify", "access": "Everyone", "description": "Request a song to be played in the stream queue.", "example": "!sr End of August by Noah Kahan", "cooldown": "5s" },
    { "command": "!wrongsong", "category": "Spotify", "access": "Everyone", "description": "Removes your most recent song request.", "example": "!wrongsong", "cooldown": "5s" },
    { "command": "!myRequests", "category": "Spotify", "access": "Everyone", "description": "Shows your requested songs and their queue positions.", "example": "!myRequests", "cooldown": "10s" },
    { "command": "!requests", "category": "Spotify", "access": "Everyone", "description": "Retrieves the full list of all requested songs.", "example": "!requests", "cooldown": "15s" },
    { "command": "!queue", "category": "Spotify", "access": "Everyone", "description": "Shows the next three songs waiting in the queue.", "example": "!queue", "cooldown": "10s" },
    { "command": "!like", "category": "Spotify", "access": "Everyone", "description": "Add the currently playing song to your liked songs.", "example": "!like", "cooldown": "5s" },
    { "command": "!unlike", "category": "Spotify", "access": "Everyone", "description": "Removes the currently playing song from your liked songs.", "example": "!unlike", "cooldown": "5s" },
    { "command": "!likes", "category": "Spotify", "access": "Everyone", "description": "Retrieve your list of liked songs.", "example": "!likes", "cooldown": "15s" },
    { "command": "!songLink", "category": "Spotify", "access": "Everyone", "description": "Provides the direct Spotify track link for the current song.", "example": "!songLink", "cooldown": "5s" },
    { "command": "!song", "category": "Spotify", "access": "Everyone", "description": "Shows the title and artist of the currently playing song.", "example": "!song", "cooldown": "5s" },
    { "command": "!lastSong", "category": "Spotify", "access": "Everyone", "description": "Shows the title and artist of the previous song played.", "example": "!lastSong", "cooldown": "5s" },
    { "command": "!points", "category": "Loyalty", "access": "Everyone", "description": "Shows your current stream loyalty point balance.", "example": "!points", "cooldown": "5s" },
    { "command": "!pointsLeaderboard", "category": "Loyalty", "access": "Everyone", "description": "Shows the channel loyalty point leaderboard.", "example": "!pointsLeaderboard", "cooldown": "30s" },
    { "command": "!gamble [amount]", "category": "Loyalty", "access": "Everyone", "description": "Gambles a chosen amount of loyalty points.", "example": "!gamble 1000", "cooldown": "10s" },
    { "command": "!scratchCard", "category": "Loyalty", "access": "Everyone", "description": "Purchase a scratch card for a chance to win points.", "example": "!scratchCard", "cooldown": "15s" },
    { "command": "!givePoints [user] [amount]", "category": "Loyalty", "access": "Everyone", "description": "Give a specified amount of your points to another viewer.", "example": "!givePoints SlickCass989 500", "cooldown": "10s" },
    { "command": "!torch", "category": "Torch Game", "access": "Everyone", "description": "Join the viewer pool to be selected as the torch bearer.", "example": "!torch", "cooldown": "Round-based" },
    { "command": "!acceptTorch", "category": "Torch Game", "access": "Everyone", "description": "Accept the responsibility of stopping Nick when prompted.", "example": "!acceptTorch", "cooldown": "When prompted" },
    { "command": "!declineTorch", "category": "Torch Game", "access": "Everyone", "description": "Decline the torch bearer role. A new viewer will be selected.", "example": "!declineTorch", "cooldown": "When prompted" },
    { "command": "!stop", "category": "Torch Game", "access": "Everyone", "description": "Freeze Nick's movement during the torch game.", "example": "!stop", "cooldown": "Active bearer only" }
  ];


  function renderCommands() {
    const tableBody = document.getElementById('commands-table-body');
    const resultCount = document.getElementById('commands-count');
    const emptyState = document.getElementById('commands-empty-state');

    if (!tableBody) return;

    const filtered = commandsData.filter((item) => {
      const matchCategory =
        currentCategory === 'all' ||
        item.category.toLowerCase() === currentCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.command.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.example && item.example.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });

    if (resultCount) {
      resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'command' : 'commands'}`;
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = filtered
      .map((item) => {
        const pureCmd = item.command.split(' ')[0];
        return `
        <tr>
          <td style="font-weight: 600;">
            <div class="command-code-wrap">
              <code>${escapeHTML(item.command)}</code>
              <button class="copy-btn" data-copy="${escapeHTML(pureCmd)}" title="Copy ${escapeHTML(pureCmd)}" aria-label="Copy ${escapeHTML(pureCmd)}">
                <svg class="copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </td>
          <td>${escapeHTML(item.description)}</td>
          <td style="color: var(--text-muted); font-size: var(--font-size-xs);">${escapeHTML(item.example || item.command)}</td>
          <td style="color: var(--text-muted); font-size: var(--font-size-xs);">${escapeHTML(item.cooldown || 'None')}</td>
        </tr>
      `;
      })
      .join('');

    bindCopyButtons();
  }

  function updateCategoryCounts() {
    document.querySelectorAll('.chip-btn[data-category]').forEach((btn) => {
      const cat = btn.getAttribute('data-category');
      const countEl = btn.querySelector('.chip-count');
      if (countEl) {
        if (cat === 'all') {
          countEl.textContent = commandsData.length;
        } else {
          const c = commandsData.filter((i) => i.category.toLowerCase() === cat.toLowerCase()).length;
          countEl.textContent = c;
        }
      }
    });
  }

  function bindCopyButtons() {
    document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          btn.classList.add('copied');
          btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          showToast(`Copied ${text}`);

          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
          }, 1800);
        });
      });
    });
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
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('commands-search-input');
    const clearBtn = document.getElementById('commands-search-clear');
    const filterChips = document.querySelectorAll('.chip-btn[data-category]');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.classList.toggle('visible', searchQuery.length > 0);
        renderCommands();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        clearBtn.classList.remove('visible');
        renderCommands();
      });
    }

    filterChips.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterChips.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category') || 'all';
        renderCommands();
      });
    });

    loadCommands();
  });
})();
