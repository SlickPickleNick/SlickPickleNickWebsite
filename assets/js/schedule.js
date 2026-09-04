/**
 * Stream Schedule, Next Stream Countdown & Twitch Live Status
 * SlickPickleNick Official Website
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TWITCH_CHANNEL = 'slickpicklenick';
  // Nick can plug in a public Google Calendar ID here (e.g., 'your_email@gmail.com' or calendar address)
  const GOOGLE_CALENDAR_ID = '';
  const SCHEDULE_DATA_PATH = 'assets/data/schedule.json';

  let scheduleEvents = [];
  let nextStream = null;
  let countdownInterval = null;
  let isChannelLive = false;
  let liveUptime = '';

  /**
   * Check real Twitch Live status using public CORS API
   */
  async function checkTwitchLiveStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = (await res.text()).trim();
        if (text && !text.toLowerCase().includes('offline') && !text.toLowerCase().includes('user not found') && !text.toLowerCase().includes('error')) {
          isChannelLive = true;
          liveUptime = text;
        } else {
          isChannelLive = false;
          liveUptime = '';
        }
      } else {
        isChannelLive = false;
      }
    } catch (e) {
      isChannelLive = false;
    }

    updateHeaderLiveButton();
    renderScheduleUI();
  }

  /**
   * Update header navigation live button state
   */
  function updateHeaderLiveButton() {
    const liveBtns = document.querySelectorAll('.live-btn');
    liveBtns.forEach((btn) => {
      const dot = btn.querySelector('.live-dot');
      const textSpan = btn.querySelector('span:not(.live-dot)');
      if (isChannelLive) {
        btn.classList.add('is-live');
        if (dot) dot.style.display = 'inline-block';
        if (textSpan) textSpan.textContent = 'Live Now!';
      } else {
        btn.classList.remove('is-live');
        if (dot) dot.style.display = 'inline-block';
        if (textSpan) textSpan.textContent = 'Watch Live';
      }
    });
  }

  /**
   * Load Schedule Data from Google Calendar or Local JSON fallback
   */
  async function loadSchedule() {
    let rawEvents = [];

    // Try Google Calendar Public feed if configured
    if (GOOGLE_CALENDAR_ID) {
      try {
        const gCalUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`;
        const gRes = await fetch(gCalUrl);
        if (gRes.ok) {
          const icsText = await gRes.text();
          rawEvents = parseICS(icsText);
        }
      } catch (e) {
        // Fall back to schedule.json on error
      }
    }

    // If no Google Calendar data, load schedule.json
    if (rawEvents.length === 0) {
      try {
        const res = await fetch(SCHEDULE_DATA_PATH);
        if (res.ok) {
          rawEvents = await res.json();
        } else {
          rawEvents = getFallbackSchedule();
        }
      } catch (e) {
        rawEvents = getFallbackSchedule();
      }
    }

    scheduleEvents = calculateUpcomingDates(rawEvents);
    findNextStream();
    renderScheduleUI();
    startCountdown();
  }

  /**
   * Calculate exact upcoming dates for this week based on schedule slots
   */
  function calculateUpcomingDates(events) {
    const now = new Date();
    const upcoming = [];

    events.forEach((slot) => {
      if (slot.startDate) {
        // Explicit ISO date from Google Calendar
        const start = new Date(slot.startDate);
        if (start > now || isEventOngoing(start, slot.durationHours || 3)) {
          upcoming.push({
            id: slot.id || String(Math.random()),
            title: slot.title || 'Stream',
            game: slot.game || 'Variety',
            description: slot.description || '',
            date: start,
            durationHours: slot.durationHours || 3
          });
        }
      } else if (typeof slot.hour === 'number') {
        // Recurring weekly slot (dayOffset 0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const targetDay = slot.dayOffset !== undefined ? slot.dayOffset : 2; // Default Tuesday
        const nextDate = getNextDayOfWeek(now, targetDay, slot.hour, slot.minute || 0);

        upcoming.push({
          id: slot.id,
          title: slot.title,
          game: slot.game,
          description: slot.description,
          date: nextDate,
          durationHours: slot.durationHours || 3.5
        });
      }
    });

    // Sort chronologically
    upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming;
  }

  function getNextDayOfWeek(date, dayOfWeek, hour, minute) {
    const result = new Date(date);
    const currentDay = result.getDay();
    let distance = (dayOfWeek - currentDay + 7) % 7;

    // If it's today, check if the hour has already passed
    result.setHours(hour, minute, 0, 0);
    if (distance === 0 && result <= date) {
      distance = 7;
    }

    result.setDate(result.getDate() + distance);
    return result;
  }

  function isEventOngoing(startDate, durationHours) {
    const now = new Date();
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
    return now >= startDate && now <= endDate;
  }

  function findNextStream() {
    const now = new Date();
    nextStream = scheduleEvents.find((ev) => ev.date > now) || scheduleEvents[0];
  }

  /**
   * Render Schedule & Countdown UI
   */
  function renderScheduleUI() {
    const container = document.getElementById('schedule-section-container');
    if (!container) return;

    // Detect user's local timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const tzShort = getTimezoneShort(userTimezone);

    if (isChannelLive) {
      // Live on Twitch View
      container.innerHTML = `
        <div class="schedule-live-card">
          <div class="schedule-live-badge">
            <span class="live-dot" aria-hidden="true"></span>
            <span>LIVE NOW ON TWITCH</span>
          </div>
          <h3 class="schedule-live-title">SlickPickleNick is Streaming Live</h3>
          <p class="schedule-live-desc">
            ${liveUptime ? `Live for <strong>${escapeHTML(liveUptime)}</strong> &bull; ` : ''}
            Join the chat, play interactive mini-games, and trigger channel rewards!
          </p>
          <div class="schedule-live-actions">
            <a href="https://twitch.tv/${TWITCH_CHANNEL}" target="_blank" rel="noopener noreferrer" class="btn btn-twitch">
              Watch Stream Live on Twitch &rarr;
            </a>
            <a href="commands.html" class="btn btn-secondary">
              Browse Chat Commands
            </a>
          </div>
        </div>
      `;
      return;
    }

    if (!nextStream) {
      container.innerHTML = `
        <div class="schedule-empty-state">
          <p>Stream schedule is being updated. Check <a href="https://discordapp.com/invite/c2pM23t5fT" target="_blank" rel="noopener noreferrer">Discord announcements</a> for upcoming times!</p>
        </div>
      `;
      return;
    }

    // Formatted Local Date String
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const formattedDate = nextStream.date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = nextStream.date.toLocaleTimeString(undefined, timeOptions);

    // Google Calendar Add Link
    const gCalUrl = generateGoogleCalendarUrl(nextStream);

    container.innerHTML = `
      <div class="schedule-grid-wrap">
        <!-- Countdown Column -->
        <div class="schedule-countdown-col">
          <div class="schedule-eyebrow">
            Next Scheduled Broadcast
          </div>
          <h3 class="schedule-next-title">${escapeHTML(nextStream.title)}</h3>
          <div class="schedule-next-time">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>${formattedDate} &bull; ${formattedTime} ${tzShort}</span>
          </div>

          <!-- Ticking Countdown Clock -->
          <div class="countdown-clock" aria-label="Countdown to next stream">
            <div class="countdown-unit">
              <span id="cd-days" class="countdown-num">00</span>
              <span class="countdown-label">Days</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span id="cd-hours" class="countdown-num">00</span>
              <span class="countdown-label">Hours</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span id="cd-minutes" class="countdown-num">00</span>
              <span class="countdown-label">Mins</span>
            </div>
            <span class="countdown-sep">:</span>
            <div class="countdown-unit">
              <span id="cd-seconds" class="countdown-num">00</span>
              <span class="countdown-label">Secs</span>
            </div>
          </div>

          <div class="schedule-actions">
            <a href="https://twitch.tv/${TWITCH_CHANNEL}" target="_blank" rel="noopener noreferrer" class="btn btn-twitch btn-sm">
              Follow on Twitch
            </a>
            <a href="${gCalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Add this stream to your Google Calendar">
              + Add to Google Calendar
            </a>
          </div>
        </div>

        <!-- Weekly Roster Column -->
        <div class="schedule-roster-col">
          <div class="schedule-roster-header">
            <h4>Upcoming Schedule</h4>
            <span class="timezone-badge">${tzShort} Local Time</span>
          </div>
          <div class="schedule-roster-list">
            ${scheduleEvents
              .slice(0, 4)
              .map((stream) => {
                const sDate = stream.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                const sTime = stream.date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });
                const isNext = stream.id === nextStream.id;

                return `
                <div class="roster-item ${isNext ? 'is-next' : ''}">
                  <div class="roster-date-wrap">
                    <span class="roster-day">${escapeHTML(sDate)}</span>
                    <span class="roster-time">${escapeHTML(sTime)}</span>
                  </div>
                  <div class="roster-info">
                    <strong class="roster-title">${escapeHTML(stream.title)}</strong>
                    <span class="roster-game">${escapeHTML(stream.game)}</span>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
          <div class="schedule-roster-footer">
            <small>Times update live in your local timezone. Announcements posted in <a href="https://discordapp.com/invite/c2pM23t5fT" target="_blank" rel="noopener noreferrer">Discord</a>.</small>
          </div>
        </div>
      </div>
    `;

    updateCountdownDigits();
  }

  /**
   * Ticking countdown loop
   */
  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdownDigits();
    countdownInterval = setInterval(() => {
      updateCountdownDigits();
    }, 1000);
  }

  function updateCountdownDigits() {
    if (!nextStream || isChannelLive) return;

    const now = new Date();
    const diff = nextStream.date.getTime() - now.getTime();

    if (diff <= 0) {
      // Recheck if stream has started or fetch next
      findNextStream();
      renderScheduleUI();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
  }

  /**
   * Helpers
   */
  function getTimezoneShort(tzName) {
    try {
      const str = new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' });
      return str.split(' ')[2] || tzName;
    } catch (e) {
      return 'Local';
    }
  }

  function generateGoogleCalendarUrl(stream) {
    const startIso = stream.date.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(stream.date.getTime() + (stream.durationHours || 3) * 60 * 60 * 1000);
    const endIso = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const title = encodeURIComponent(`SlickPickleNick Stream: ${stream.title}`);
    const details = encodeURIComponent(`${stream.description || ''}\n\nWatch Live: https://twitch.tv/${TWITCH_CHANNEL}`);
    const location = encodeURIComponent(`https://twitch.tv/${TWITCH_CHANNEL}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  }

  function parseICS(icsText) {
    // Simple iCal parser for VEVENT
    const events = [];
    const vevents = icsText.split('BEGIN:VEVENT');

    for (let i = 1; i < vevents.length; i++) {
      const block = vevents[i].split('END:VEVENT')[0];
      const summaryMatch = block.match(/SUMMARY:(.*)/);
      const dtStartMatch = block.match(/DTSTART(?:;[^:]*)?:(.*)/);
      const descMatch = block.match(/DESCRIPTION:(.*)/);

      if (summaryMatch && dtStartMatch) {
        const title = summaryMatch[1].trim();
        const dtStr = dtStartMatch[1].trim();
        // Parse basic iCal timestamp e.g. 20260908T190000Z
        const date = parseICalDate(dtStr);
        if (date) {
          events.push({
            id: `gcal-${i}`,
            title: title,
            game: title.includes(':') ? title.split(':')[0] : 'Stream',
            description: descMatch ? descMatch[1].trim() : '',
            startDate: date.toISOString(),
            durationHours: 3
          });
        }
      }
    }
    return events;
  }

  function parseICalDate(str) {
    try {
      if (str.length >= 8) {
        const year = parseInt(str.substring(0, 4), 10);
        const month = parseInt(str.substring(4, 6), 10) - 1;
        const day = parseInt(str.substring(6, 8), 10);
        let hour = 0;
        let minute = 0;
        if (str.includes('T')) {
          const timePart = str.split('T')[1];
          hour = parseInt(timePart.substring(0, 2), 10);
          minute = parseInt(timePart.substring(2, 4), 10);
        }
        return new Date(Date.UTC(year, month, day, hour, minute));
      }
    } catch (e) {}
    return null;
  }

  function getFallbackSchedule() {
    return [
      {
        "id": "stream-1",
        "title": "GeoGuessr Torch Games & World Tour",
        "game": "GeoGuessr",
        "dayOffset": 2,
        "hour": 19,
        "minute": 0,
        "durationHours": 3.5,
        "description": "Interactive viewer chat mini-game with !torch and !stop."
      },
      {
        "id": "stream-2",
        "title": "Fortnite Zero Build & Ranked Duos",
        "game": "Fortnite",
        "dayOffset": 5,
        "hour": 19,
        "minute": 30,
        "durationHours": 4,
        "description": "Viewer skin picks, map drop choices, and loadout bans."
      },
      {
        "id": "stream-3",
        "title": "Meccha Chameleon & Community Variety",
        "game": "Meccha Chameleon",
        "dayOffset": 0, // Sunday
        "hour": 18,
        "minute": 0,
        "durationHours": 3,
        "description": "Stealth camouflage and Discord community multiplayer games."
      }
    ];
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', () => {
    checkTwitchLiveStatus();
    loadSchedule();

    // Recheck live status every 60 seconds
    setInterval(checkTwitchLiveStatus, 60000);
  });
})();
