# SlickPickleNick Official Website - Agent Guidelines

## Overview
This repository contains the official website for **SlickPickleNick**, a gaming creator focused on interactive streams, chat participation, Twitch commands, channel point rewards, and community engagement.

## Hosting & Deployment
- **Platform**: GitHub Pages (root domain / subpath compatible).
- **Branch Strategy**:
  - `main`: Production release branch deployed to GitHub Pages.
  - `beta`: Active development branch for staging and testing updates before main release.
- **Architecture**: Static HTML5, Vanilla Modular CSS, and Vanilla JavaScript (ES6+). Zero build-step dependencies required for deployment.

---

## Key Principles & Coding Guidelines

### 1. Accessibility First (WCAG 2.1 AA/AAA)
- Every page must feature:
  - Accessible skip link (`#main-content`).
  - High contrast ratios (meeting or exceeding 4.5:1 for normal text, 3:1 for large text).
  - ARIA attributes where interactive states change (`aria-expanded`, `aria-controls`, `aria-label`, `aria-live`).
  - Keyboard focus indicators with strong outline contrast (`var(--focus-ring)`).
  - Support for the built-in Accessibility Toolbar (text sizing, dyslexic font, contrast modes, reduced motion).

### 2. Clean Design (No "Vibe Coding")
- Structured, systematic CSS architecture using design tokens in `assets/css/tokens.css`.
- Modular CSS files separated by responsibility:
  - `tokens.css`: Design tokens & theme definitions.
  - `global.css`: Reset, base typography, accessible layout.
  - `navigation.css`: Header, mobile drawer, navigation items.
  - `components.css`: Search bars, tables, cards, badges, accordions, toast notifications.
  - `accessibility.css`: Toolbar, modal, accessibility modifier classes.

### 3. Theming Engine
- The website supports **Dark Mode** and **Light Mode** with `localStorage` persistence.
- Controlled via `<html data-theme="dark">` or `<html data-theme="light">`.
- Respects system preferences (`prefers-color-scheme`) by default if no user preference is stored.

### 4. Data-Driven Components
- Dynamic content such as Twitch commands (`assets/data/commands.json`) and Channel Point Rewards (`assets/data/rewards.json`) are stored as clean JSON data.
- Search and category filters render instantly on the client side without page reloads.

---

## File Structure
```
├── .agents/
│   ├── AGENTS.md
│   └── skills/
│       └── website-maintenance/
│           └── SKILL.md
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   ├── navigation.css
│   │   ├── components.css
│   │   └── accessibility.css
│   ├── js/
│   │   ├── theme.js
│   │   ├── accessibility.js
│   │   ├── commands.js
│   │   ├── rewards.js
│   │   └── main.js
│   └── data/
│       ├── commands.json
│       └── rewards.json
├── index.html
├── commands.html
├── rewards.html
├── about.html
├── games.html
├── community.html
└── .gitignore
```
