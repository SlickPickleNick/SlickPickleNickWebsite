# Notion Dev Logs & Release Tracking Rule

## Purpose
Enforces standardized logging of major pushes, architectural decisions, and release notes across all projects to the official Notion workspace with full, structured Markdown release notes in the page body.

## Notion Target Details
- **Database Name**: `📝 Dev Logs & Session History`
- **Database ID**: `3d681b5c-6a1f-8148-9378-c617a96c0ab1`
- **Connected Bot**: `Antigravity` / Notion MCP Server (`notion-mcp-server`)

## Mandatory 2-Step Workflow
Every Dev Log or Release Notes entry MUST follow this exact 2-step process:

### Step 1: Create the Database Page
Call `API-post-page` (or REST equivalent) to create the entry with standard properties:
- `Log Entry` (`title`): Crisp, descriptive title of the milestone/release.
- `Project` (`select`): The active project name (`SlickPickleNickWebsite`, `StreamerBotProjects`, `SlickBot`, `General`).
- `Type` (`select`): `Release Notes` | `Session Log` | `Architecture Decision (ADR)` | `Investigation`.
- `Date & Time` (`date`): ISO date string (`YYYY-MM-DD`).
- `Git Commit / Branch` (`rich_text`): E.g., `beta (commit_hash)` or `main (v1.x.x)`.
- `Summary` (`rich_text`): Concise high-level summary (1-2 sentences).

### Step 2: Populate Full Markdown Release Notes Body
Immediately follow page creation by calling `API-update-page-markdown` with `type: "replace_content"` to write full, rich Markdown into the page body. **Never leave the page body empty.**

## Markdown Release Notes Template
Use the following structured format:

```markdown
# Release Notes & Dev Log: <Project Name>
**Release Target**: `<branch>` Branch (`commit <hash>`)  
**Date**: <Month Day, Year>  
**Repository**: [<Org/Repo>](https://github.com/<Org>/<Repo>)  
**Status**: <Summary of test/verification status>  
---
## 🚀 Major Features & Architectural Updates
### 1. <Feature/Update Title>
- **<Key Point>**: Detailed explanation of change and architectural rationale.
- **<Key Point>**: Specific files modified, components created, or systems refactored.

### 2. <Feature/Update Title>
- **<Key Point>**: Detailed explanation.

---
## 🧪 Verification & Validation
- **Automated Tests**: Test suite status (e.g. `node tests/run-all.js` or `npm test`: X/X passed).
- **Manual Verification**: Viewport tests, accessibility compliance (WCAG 2.1 AA/AAA), performance.
- **Environment Status**: Live preview or deployment confirmation.
```

