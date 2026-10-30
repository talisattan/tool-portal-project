# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only
- No frameworks, no build step (files open directly in a browser)

## Project Structure

```
index.html           portal home page (list of tools)
route-finder.html    shortest route finder tool page
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

## Feature Plan

A portal for students to try small tools about distribution and transportation.

### Portal structure

- **Homepage** (`index.html`): short intro plus one card per tool.
- **Open a tool:** the visitor clicks a tool's card and lands on that tool's own page (e.g. `route-finder.html`).
- **Get back:** every page has the "Transport Tools" link in the header that returns to the homepage.
- **Add a new tool later:** create one HTML page and one JS file for it, then add one card to `index.html`. Shared styles and the theme toggle are reused.

### Phases

1. **Phase 1: portal plus first tool.** Homepage, theme toggle, and the shortest route finder (type stops and a distance table, get the shortest round trip). Done.
2. **Phase 2: more tools.** Add further tools one at a time, each with its own card on the homepage.
