---
name: static-site-design-iteration
description: Use when integrating a framework-assumed (React/Tailwind/shadcn) component into a no-build static HTML/CSS site, or when iterating on visual design — palette, typography, hero layout — that includes a WebGL/Spline embed you cannot see without rendering it.
---

# Static-Site Design Iteration

Working method distilled from building this repo's Spline-robot landing page. Each section is one lesson: rule, why, and the real check that enforces it.

## 1. Read the architecture constraint before honoring the component's install steps

**A pasted component's "setup instructions" describe its home stack, not your target.** The 21st.dev snippet demanded shadcn + Tailwind + TypeScript; this repo's CLAUDE.md says no build step, GitHub Pages, root-relative paths. The visual intent (interactive robot hero) survived translation to `<spline-viewer>` via CDN `<script type="module">`; the React wrapper did not need to. Rule: if the repo doc forbids the component's stack, port the *effect*, not the code — and make the stack decision an explicit user choice with a recommendation, because "rewrite the site" is never yours to assume.

## 2. Verify remote artifacts the moment you pin them

**A version pinned in a spec is a claim; curl it before committing the spec.** `curl -sI https://unpkg.com/@splinetool/viewer@1.9.82/... → HTTP 200` took 5 seconds at spec time. Failing at deploy time on GitHub Pages costs a debugging session with no build logs. Rule: every CDN URL written into a spec/plan gets a HEAD check in the same turn.

## 3. Headless screenshots of WebGL scenes need real wall-clock, not load events

**Chrome's `--screenshot`, `--virtual-time-budget`, and `--timeout` all fire before a lazy-fetched 3D scene renders** — three consecutive black-robot screenshots proved it. What worked: launch Chrome with `--remote-debugging-port` + `--remote-allow-origins=*` + `--use-angle=swiftshader --enable-unsafe-swiftshader`, drive CDP over websocket (`Page.navigate`, `time.sleep(25)`, `Page.captureScreenshot`). Script lives in this session's pattern: `cdp_shot.py`. Sanity check that catches silent failure: black-hero PNG was ~40 KB, rendered robot ~225 KB — compare file size before reading the image. Also: node 12 in this environment cannot run modern puppeteer-core; don't retry that path.

## 4. Derive palettes from rendered pixels, not from memory of the asset

**"Match the robot's colors" is unanswerable until you sample the robot.** PIL-crop of the rendered face screen gave `#25154e` (hue ≈253°), which selected the violet accent family (`#a78bfa`/`#7c3aed`) — not the cyan I would have kept or a guessed purple. Rule: crop the region, `resize((1,1))`, read the pixel, pick accents by matching hue; never name colors from the scene's description.

## 5. A retheme is done when the old palette greps to zero

**Changing `:root` tokens misses hardcoded literals every time.** This stylesheet had 7 cyan `rgba(34, 211, 238, …)`/`#67e8f9` literals outside the token block (button hover, tag borders, resume timeline glow). Rule: after swapping tokens, `grep -nE "oldhex|old, r, g, b" css/ js/ *.html` must return exit 1 — and screenshot one *inner* page (projects.html here), because tokens leak into every page, not just the one you're styling.

## 6. Identify a reference site's fonts from its stylesheet, then shop inside its own stack

**WebFetch's markdown conversion strips CSS — it named zero fonts for arx-robotics.com.** The chain that worked: curl HTML with a browser UA → find the Webflow CSS URL → grep `@font-face` → Transducer (headlines) and Genus (body), both commercial. The escape hatch: their own CSS also loaded Space Grotesk and Manrope — free on Google Fonts — so "fonts similar to X" became "fonts X actually ships." Rule: when the primary faces are proprietary, check the reference site's stack for free secondaries before reaching for lookalike lists.

## 7. Prune a CSS selector only after a repo-wide zero-grep

**`.hero-content`/`.hero-image` looked index-only, but 16 `projects/*.html` pages share this stylesheet.** The final reviewer's grep across all `*.html`/`*.js` proving zero uses is what made deletion safe, and the check `grep -n "hero-content\|hero-image\|hero-text" css/style.css index.html` (expect exit 1) is what proved the prune complete. Rule: one grep to license the delete, one grep to confirm it.

## 8. Fullscreen interactive canvases need a pointer-events sandwich and a touch escape

**Two traps ship together with a fullscreen `<spline-viewer>` under overlay text:** (a) the overlay must be `pointer-events: none` with `pointer-events: auto` restored only on CTAs, or the robot never sees the cursor; (b) the canvas eats touch gestures, so without `touch-action: pan-y` a phone user can be *unable to scroll past the landing hero* — a failure no desktop checklist catches. Also mark the viewer `aria-hidden="true"`: it replaced an `alt`-texted photo, and an unnamed canvas is an a11y regression. All three were review findings, not plan items — budget a review pass for exactly this class of gap.

## 9. Resolve layout forks with ASCII-mockup options, not prose

**"Align the text around the robot" had ≥3 valid readings.** One AskUserQuestion with three ASCII wireframes (flanking / top-bottom wrap / left column) got a binding answer in one round, and the chosen mockup doubled as the approved design — no second approval loop. Rule: when a layout instruction is spatial and ambiguous, draw the 2–4 candidate layouts as ASCII previews; never implement your favorite reading first.
