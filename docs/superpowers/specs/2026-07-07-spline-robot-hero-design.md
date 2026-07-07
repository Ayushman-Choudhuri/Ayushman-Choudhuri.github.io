# Spline Robot Hero — Design

**Date:** 2026-07-07
**Branch:** `feat/new-front-page`
**Status:** Approved

## Goal

Replace the split text/photo hero on the landing page (`index.html`) with a fullscreen
interactive 3D Spline robot ("Whobee") and overlaid hero text, matching the look of the
React demo the component came from — without introducing React, Tailwind, TypeScript, or
a build step. The site stays pure static HTML/CSS/JS deployed to GitHub Pages.

## Context

The original request supplied a React component (`InteractiveRobotSpline`) that wraps
`@splinetool/react-spline`. This repo has no package manager or build pipeline, so the
React wrapper is not usable as-is. Spline publishes an official framework-free web
component (`<spline-viewer>`) that renders the same `.splinecode` scenes; it is loaded
from a CDN with a plain `<script type="module">` tag.

## Decisions

1. **Integration: vanilla `<spline-viewer>` web component** (chosen over migrating the
   site to React/shadcn, or bundling a React island). Same visual result, zero build step,
   fits existing architecture.
2. **Layout: fullscreen hero with text overlay** (chosen over replacing the profile photo
   in the split layout, or using the robot as a dimmed background). Robot fills the
   viewport; existing hero copy and CTAs are overlaid in the top third.

## Changes

### `index.html` (hero section only)

- Pinned CDN script in `<head>` or before `</body>`:
  `<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>`
- Hero section becomes fullscreen: `100vh` with `100dvh` fallback, `position: relative`,
  `overflow: hidden`.
- `<spline-viewer url="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode">`
  positioned absolute, `inset: 0`, `z-index: 0`.
- Overlay div: absolute, `z-index: 1`, `pointer-events: none` so mouse interaction reaches
  the robot. CTA buttons re-enable `pointer-events: auto`.
- Existing copy is kept: eyebrow ("Robotics Engineer & AI Researcher"),
  "Hi, I'm Ayushman", subtitle, About Me / View Projects buttons, and the scroll
  indicator at the bottom.
- Profile photo is removed from the home hero (remains on the About page).
- Featured Projects section, nav/footer placeholders, and inline featured-grid script are
  untouched.

### `css/style.css`

- New `.hero-spline*` rules using existing design tokens (colors, spacing, font vars).
- Text gets a drop shadow for readability over the 3D scene.
- Old split-hero rules stay unless verifiably unused by other pages.

## Fallbacks & constraints

- **Loading:** the viewer shows the scene's own loading state; the hero section keeps a
  dark background token so text is readable before/without the scene.
- **Failure (no WebGL, CDN blocked, script error):** section renders as a plain dark hero
  with text and CTAs — the page never breaks.
- **Reduced motion:** no additional animation added; the scene renders as-is.
- **Spline badge:** the free Spline plan renders a small "Built with Spline" badge in the
  corner of the viewer. Accepted; removal requires a paid plan.

## Out of scope

React, Tailwind, shadcn/ui, the shadcn card dependency from the original snippet (unused
by the demo), npm dependencies, changes to any other page.
