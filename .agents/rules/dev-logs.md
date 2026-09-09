# Notion Dev Logs & Release Tracking Rule

## Purpose
Enforces standardized logging of major pushes, architectural decisions, and release notes across all projects to the official Notion workspace.

## Notion Target Details
- **Database Name**: `📝 Dev Logs & Session History`
- **Database ID**: `3d681b5c-6a1f-8148-9378-c617a96c0ab1`
- **Connected Bot**: `Antigravity (Mac)` / Notion MCP Server

## Standard Properties Schema
When creating an entry via `API-post-page` on `notion-mcp-server`:
- `Log Entry` (`title`): Crisp, descriptive title of the milestone/release.
- `Project` (`select`): The active project name (`SlickPickleNickWebsite`, `StreamerBotProjects`, `SlickBot`, `General`).
- `Type` (`select`): `Release Notes` | `Session Log` | `Architecture Decision (ADR)` | `Investigation`.
- `Date & Time` (`date`): ISO date string (`YYYY-MM-DD`).
- `Git Commit / Branch` (`rich_text`): E.g., `beta (commit_hash)` or `main (v1.x.x)`.
- `Summary` (`rich_text`): Concise high-level summary (1-2 sentences).

## Page Body Format
Always populate the page body with rich markdown using `API-update-page-markdown`:
1. **Header Block**: Target branch, commit hash, date, repository link, and test status.
2. **Major Features & Architectural Updates**: Detailed bullet points organized by functional area.
3. **Test Results & Verification**: Summary of test suite passes and manual validation.
4. **Deployment Info**: Push target, tags, and tracking details.
