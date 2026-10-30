# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only
- No frameworks, no build step (files open directly in a browser)

## Project Structure

```
index.html           portal home page (list of tools)
tool-1.html          shortest route finder tool page (the portal's first tool)
css/style.css        shared styles, light/dark theme colors
js/theme.js          light/dark theme toggle
js/route-finder.js   route finder logic
README.md            project readme
CLAUDE.md            this file
```

Update this section when files are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Design Direction

Look and feel: "Open Road", friendly and rounded, made for students. All values live as CSS variables at the top of `css/style.css`; use the variables, never hard-coded colors, fonts or radii. New pages link `css/style.css` and `js/theme.js` and reuse its classes (`.site-header`, `.card`, `.panel`, `.button`, `.secondary`).

**Palette** (every text/background pair meets 4.5:1 contrast)

| Role | Light (default) | Dark |
|---|---|---|
| Page background `--bg` | `#f1f8f5` | `#0c1f1c` |
| Surface (cards, panels) `--surface` | `#ffffff` | `#13302b` |
| Text `--text` | `#12302b` | `#eaf7f3` |
| Muted text `--muted` | `#3f5a54` | `#a7c9c0` |
| Borders `--border` | `#9dbfb5` | `#4c7a6f` |
| Accent (buttons, links) `--accent` | `#0b6e5f` | `#5fd3bc` |
| Text on accent `--accent-text` | `#ffffff` | `#06201b` |
| Highlight `--sun` | `#ffd23f` | `#e0b22a` |

**Typography**
- Headings: Fredoka, weight 600 (`--font-heading`). Page title scales with the screen (`clamp(2.25rem, 6vw, 3.75rem)`).
- Body and controls: Nunito, 400 / 600 / 700 (`--font-body`), 1.125rem base size, 1.6 line height.
- Fonts are loaded once, by the `@import` at the top of `css/style.css`.

**Spacing and shape**
- Cards and panels: 1.75rem padding, 24px corners (`--radius-card`), 2px border.
- Buttons are pill-shaped (`--radius-pill`), at least 48px tall; fields have 12px corners (`--radius-field`) and are at least 44px tall.
- Gap between cards and panels: 1.5rem. Page content is at most 62rem wide, with 1.5rem padding (2rem from tablet width up).

## Feature Plan

A portal for students to try small tools about distribution and transportation.

### Portal structure

- **Homepage** (`index.html`): short intro plus one card per tool.
- **Open a tool:** the visitor clicks a tool's card and lands on that tool's own page (e.g. `tool-1.html`).
- **Get back:** every page has the "Transport Tools" link in the header that returns to the homepage.
- **Add a new tool later:** create one HTML page and one JS file for it, then add one card to `index.html`. Shared styles and the theme toggle are reused.

### Phases

1. **Phase 1: portal plus first tool.**
   - Portal homepage with a placeholder "Tool 1 — coming soon" card that opens and returns via the header link (`tool-1.html`). Done.
   - Placeholder replaced by the real tool: the shortest route finder (type stops and a distance table, get the shortest round trip) now lives at `tool-1.html`. Done.
   - Theme toggle. Done.
2. **Phase 2: more tools.** Add further tools one at a time, each with its own card on the homepage.
