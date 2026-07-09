# Interactive Resume Timeline — Design

**Date:** 2026-07-09
**Status:** Approved for planning
**Scope:** `resume.html`, `css/style.css`, new `js/resume-timeline.js`

## Goal

Replace the static Experience list on the resume page with an animated vertical
career timeline. Education, Research Publications, and Technical Stack sections
remain unchanged. All resume content stays fully visible at all times — no
click-to-expand; recruiters must be able to skim everything.

## Approach

Vanilla JS `IntersectionObserver` + CSS transitions. No libraries, no build
step, consistent with the site's zero-dependency architecture.

- New file `js/resume-timeline.js`, loaded only by `resume.html`.
- New CSS block appended to `css/style.css`, reusing existing design tokens
  (`--accent`, spacing, font variables).
- Experience markup in `resume.html` restructured into timeline markup.
  Content (roles, dates, bullets) unchanged.

Rejected alternatives:
- Pure CSS scroll-driven animations (`animation-timeline: view()`): patchy
  Safari/Firefox support.
- GSAP ScrollTrigger via CDN: external dependency, ~90KB, overkill.

## Structure

- Experience section becomes `<div class="timeline">` with a vertical line on
  the left; entry content sits to the right of the line.
- Each position is a `.timeline-entry` with a dot marker on the line.
- Desktop (wide screens): dates sit to the left of the line, classic timeline
  layout. Mobile: dates inline in the entry header as today.
- Entries ordered newest-first, matching the current resume.

### Schmiede.one promotion block

The three Schmiede.one roles (Intern → Working Student → Robotics Software
Engineer) render as one grouped company node:

- Single major dot on the main timeline.
- Company header: name + total span ("Aug 2023 – Present").
- Inside the block, the three roles stack newest-first with a mini connector
  and small dots showing the promotion track.

All other positions (thesis at ika, RWTH research assistant, Synedyne,
IISc, Agilebot) are individual timeline entries.

## Motion

- **Line draw:** the vertical line draws downward as the user scrolls, via
  `scaleY` driven by scroll progress (small JS scroll handler,
  `transform-origin: top`).
- **Dot pop:** dots scale in with a slight bounce when their entry becomes
  visible.
- **Entry reveal:** entries fade in and slide ~20px from the right when ~15%
  visible (IntersectionObserver adds a `.visible` class; CSS transition does
  the rest).
- **Active dot:** the dot nearest the viewport center gets an accent glow.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, all animation is
  disabled — line fully drawn, entries fully visible, no transitions.
- **No-JS fallback:** without JS, entries must remain visible (hidden state is
  applied via a JS-added class on init, not baked into base CSS).

## Error handling

Not applicable beyond the no-JS / reduced-motion fallbacks above; page is
static content.

## Testing

Manual, per project convention (no test infra):
- Serve locally (`python3 -m http.server 8000`), verify scroll behavior in a
  desktop browser at wide and narrow viewports.
- Verify `prefers-reduced-motion` renders everything static and visible.
- Verify page with JS disabled shows all content.
