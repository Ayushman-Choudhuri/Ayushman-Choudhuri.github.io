# Spline Robot Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split text/photo hero on `index.html` with a fullscreen interactive 3D Spline robot and overlaid hero text.

**Architecture:** Spline's framework-free `<spline-viewer>` web component (pinned CDN script) renders the scene absolutely positioned behind an overlay div holding the existing hero copy. `pointer-events: none` on the overlay lets the mouse reach the robot; CTAs re-enable pointer events. No build step — plain HTML/CSS edits only.

**Tech Stack:** Static HTML/CSS/JS, `@splinetool/viewer@1.9.82` via unpkg CDN.

**Spec:** `docs/superpowers/specs/2026-07-07-spline-robot-hero-design.md`

## Global Constraints

- No build step, no npm, no package manager — the site deploys raw to GitHub Pages.
- All asset/link paths are root-relative (`/css/style.css` etc.).
- Viewer version pinned exactly: `@splinetool/viewer@1.9.82` (verified live on unpkg).
- Scene URL exactly: `https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode`
- Hero copy kept verbatim: eyebrow "Robotics Engineer &amp; AI Researcher", heading "Hi, I'm <span>Ayushman</span>", subtitle "I help robots understand the world.", CTAs "About Me" → `/about.html`, "View Projects" → `/projects.html`.
- Only `index.html` and `css/style.css` change. Featured Projects section, nav/footer placeholders, and the inline featured-grid script in `index.html` must remain byte-identical.
- No test framework exists in this repo; each task verifies via commands + browser check as written.

---

### Task 1: Fullscreen hero markup in `index.html`

**Files:**
- Modify: `index.html:16-42` (hero section) and `index.html:63` (script block)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: class names `hero`, `hero-spline-viewer`, `hero-spline-overlay` plus reused `hero-eyebrow`, `hero-subtitle`, `hero-ctas`, `hero-scroll` — Task 2 styles exactly these.

- [ ] **Step 1: Replace the hero section markup**

In `index.html`, replace the entire `<section class="hero">…</section>` block (lines 16–42, from the `HERO` comment banner through the closing `</section>`) with:

```html
  <!-- ============================================================
       HERO — interactive 3D Spline robot
       ============================================================ -->
  <section class="hero">
    <spline-viewer
      class="hero-spline-viewer"
      url="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"></spline-viewer>
    <div class="hero-spline-overlay">
      <p class="hero-eyebrow fade-in fade-in-1">Robotics Engineer &amp; AI Researcher</p>
      <h1 class="fade-in fade-in-2">Hi, I'm <span>Ayushman</span></h1>
      <p class="hero-subtitle fade-in fade-in-3">
        I help robots understand the world.
      </p>
      <div class="hero-ctas fade-in fade-in-4">
        <a href="/about.html" class="btn btn-primary">About Me</a>
        <a href="/projects.html" class="btn btn-secondary">View Projects</a>
      </div>
    </div>
    <div class="hero-scroll">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
      scroll
    </div>
  </section>
```

Notes: the profile `<img>` and `hero-content`/`hero-text`/`hero-image` wrappers are gone; `fade-in-5` is no longer used on this page.

- [ ] **Step 2: Load the viewer script**

In `index.html`, directly after the line `<script src="/js/components.js"></script>`, add:

```html
  <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"></script>
```

(Module scripts are deferred by default, so placement at end of body keeps content render unblocked.)

- [ ] **Step 3: Verify structure**

Run:
```bash
cd /home/ayushman/Projects/Ayushman-Choudhuri.github.io
python3 -m http.server 8000 &
sleep 1
curl -s http://localhost:8000/index.html | grep -c "spline-viewer"
curl -s http://localhost:8000/index.html | grep -c "profile.png"
kill %1
```
Expected: first grep prints `4` (opening tag line, class-attr line, closing-tag line, script URL line), second prints `0`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: fullscreen Spline robot hero markup on landing page"
```

---

### Task 2: Hero CSS for fullscreen viewer + overlay

**Files:**
- Modify: `css/style.css:142-205` (HERO block) and `css/style.css:549-556` (hero rules inside the `@media (max-width: 640px)`-region responsive block)

**Interfaces:**
- Consumes: class names from Task 1 (`hero`, `hero-spline-viewer`, `hero-spline-overlay`, `hero-eyebrow`, `hero-subtitle`, `hero-ctas`, `hero-scroll`).
- Produces: nothing consumed later.

- [ ] **Step 1: Replace the HERO block**

In `css/style.css`, replace everything from the `HERO (index page)` comment banner (line 142) through the `@keyframes scrollBounce` closing brace (line 205) with:

```css
/* ============================================================
   HERO (index page) — fullscreen Spline robot
   ============================================================ */
.hero {
  height: 100vh;
  height: 100dvh;
  min-height: 560px;
  position: relative;
  overflow: hidden;
  padding: 0;
  background: var(--bg);
}
.hero-spline-viewer {
  position: absolute; inset: 0; z-index: 0;
  display: block; width: 100%; height: 100%;
}
.hero-spline-overlay {
  position: absolute; inset: 0; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
  padding: calc(64px + 7vh) 24px 0;
  pointer-events: none;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 0.85rem; color: var(--accent); font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 20px;
}
.hero h1 { margin-bottom: 20px; letter-spacing: -0.03em; }
.hero h1 span { color: var(--accent); }
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem); color: var(--text-muted);
  max-width: 560px; margin-bottom: 40px; line-height: 1.7;
}
.hero-eyebrow, .hero h1, .hero-subtitle {
  filter: drop-shadow(0 2px 12px rgba(9, 9, 11, 0.85));
}
.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.hero-spline-overlay .hero-ctas { pointer-events: auto; }
.hero-scroll {
  position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
  z-index: 1; pointer-events: none;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  color: var(--text-subtle); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
  animation: scrollBounce 2s infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}
```

This drops the now-unused `.hero::before`, `.hero::after`, `.hero-content`, `.hero-text`, and `.hero-image*` rules (only `index.html` used them; other pages use `.page-hero`/`.about-hero`, which are untouched).

- [ ] **Step 2: Clean the responsive block**

In the responsive section near line 549, delete these now-dead rules (keep everything else in the media query):

```css
  .hero-content { flex-direction: column-reverse; gap: 0; text-align: center; }
  .hero-text { display: flex; flex-direction: column; align-items: center; }
  .hero-eyebrow { justify-content: center; }
  .hero-subtitle { max-width: 100%; }
  .hero-image { width: clamp(140px, 45vw, 220px); margin-bottom: 8px; }
```

and replace them with:

```css
  .hero-subtitle { max-width: 100%; }
```

(The overlay is already centered at all widths; only the subtitle width override still matters.)

- [ ] **Step 3: Verify no dangling selectors**

Run:
```bash
cd /home/ayushman/Projects/Ayushman-Choudhuri.github.io
grep -n "hero-content\|hero-image\|hero-text" css/style.css index.html
```
Expected: no output (exit code 1).

- [ ] **Step 4: Visual check in browser**

Run:
```bash
cd /home/ayushman/Projects/Ayushman-Choudhuri.github.io
python3 -m http.server 8000
```
Open `http://localhost:8000` and confirm:
1. Robot scene fills the viewport under the fixed nav; robot head follows the cursor.
2. Eyebrow, heading, subtitle, CTAs centered in upper third, readable (drop shadow).
3. "About Me" / "View Projects" buttons clickable; empty areas pass the cursor through to the robot.
4. Scroll indicator bounces at the bottom; scrolling reveals Featured Projects unchanged.
5. Narrow the window to ~375px: text stays readable, no horizontal scrollbar.

- [ ] **Step 5: Commit**

```bash
git add css/style.css
git commit -m "feat: style fullscreen Spline hero, prune old split-hero CSS"
```
