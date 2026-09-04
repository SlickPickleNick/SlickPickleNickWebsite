---
name: website-maintenance
description: Procedures and runbooks for maintaining, updating content, adding commands, tweaking theme tokens, and testing the SlickPickleNick website.
---

# SlickPickleNick Website Maintenance Skill

This skill provides practical instructions for maintaining the website, adding new content, updating Twitch commands or Channel Point rewards, and testing changes locally.

---

## 1. Adding or Updating Twitch Commands
Twitch commands are stored in [`assets/data/commands.json`](file:///Users/nicksilvestro/GitHub%20Repos/SlickPickleNickWebsite/SlickPickleNickWebsite/assets/data/commands.json).

### Command Entry Schema
```json
{
  "command": "!example",
  "category": "General",
  "access": "Everyone",
  "description": "Explains what the command does.",
  "example": "!example parameter",
  "cooldown": "5s",
  "tags": ["chat", "utility"]
}
```

### Supported Categories
- `General`: Core chat commands (`!clip`, `!lurk`, `!uptime`, `!followage`, etc.)
- `Socials`: Links and socials (`!socials`, `!discord`, `!merch`, `!tip`, etc.)
- `Spotify`: Music & song requests (`!sr`, `!song`, `!queue`, `!wrongsong`, etc.)
- `Loyalty`: Stream points & chat games (`!points`, `!gamble`, `!scratchCard`, etc.)
- `Torch Game`: GeoGuessr interactive chat game (`!torch`, `!stop`, etc.)

---

## 2. Adding or Updating Channel Point Rewards
Rewards are stored in [`assets/data/rewards.json`](file:///Users/nicksilvestro/GitHub%20Repos/SlickPickleNickWebsite/SlickPickleNickWebsite/assets/data/rewards.json).

### Reward Entry Schema
```json
{
  "id": "reward-slug",
  "title": "Reward Title",
  "cost": 500,
  "category": "General",
  "description": "What happens when redeemed.",
  "cooldown": "5 sec",
  "perStream": "Unlimited",
  "perUser": "3",
  "status": "Active",
  "isFeatured": false,
  "game": "General"
}
```

---

## 3. Updating Stream Schedule & Google Calendar

Stream schedule data is managed through **Google Calendar** or [`assets/data/schedule.json`](file:///Users/nicksilvestro/GitHub%20Repos/SlickPickleNickWebsite/SlickPickleNickWebsite/assets/data/schedule.json).

### Method A: Linking a Public Google Calendar (Recommended)
1. Open Google Calendar on web and go to **Settings > Settings for my calendars > [Your Calendar]**.
2. Under **Access permissions for events**, check **Make available to public**.
3. Under **Integrate calendar**, copy the **Calendar ID** (or Public address in iCal format).
4. In [`assets/js/schedule.js`](file:///Users/nicksilvestro/GitHub%20Repos/SlickPickleNickWebsite/SlickPickleNickWebsite/assets/js/schedule.js), set:
   ```javascript
   const GOOGLE_CALENDAR_ID = 'your_calendar_id@group.calendar.google.com';
   ```
5. When you schedule stream events in Google Calendar with titles like `Fortnite Stream` or `GeoGuessr Torch Games`, the website will automatically pull and display the times in the viewer's local timezone.

### Method B: Static Schedule Fallback (`assets/data/schedule.json`)
If not using Google Calendar, edit [`assets/data/schedule.json`](file:///Users/nicksilvestro/GitHub%20Repos/SlickPickleNickWebsite/SlickPickleNickWebsite/assets/data/schedule.json):
```json
{
  "id": "stream-1",
  "title": "GeoGuessr Torch Games & World Tour",
  "game": "GeoGuessr",
  "dayOffset": 2,
  "hour": 19,
  "minute": 0,
  "durationHours": 3.5,
  "description": "Interactive viewer chat mini-game with !torch and !stop."
}
```

---

## 4. Local Testing & Verification
To test changes locally before merging to `main`:
1. Ensure you are on the `beta` branch: `git checkout beta`
2. Start a lightweight local server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser.
4. Verify:
   - Light & Dark theme toggle functionality.
   - Accessibility panel toggles (text sizing, dyslexic font, high contrast).
   - Search filtering in `commands.html` and `rewards.html`.
   - Responsive mobile navigation.

---

## 4. Releasing to Production
Once changes on `beta` are verified:
```bash
git checkout main
git merge beta
git push origin main
git checkout beta
```
GitHub Pages will automatically build and deploy the updated static files.
