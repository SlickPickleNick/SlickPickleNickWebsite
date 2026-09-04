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

## 3. Local Testing & Verification
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
