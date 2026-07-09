# Interactive Resume Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Experience list on `resume.html` with an animated vertical career timeline (scroll-reveal entries, self-drawing line, active-dot glow).

**Architecture:** Pure static site — restructured HTML in `resume.html`, one new CSS block appended to `css/style.css`, one new vanilla-JS file `js/resume-timeline.js` using `IntersectionObserver` + a rAF-throttled scroll handler. Hidden/animated states are only applied when JS adds the `timeline-js` class, so the page degrades gracefully with no JS and under `prefers-reduced-motion`.

**Tech Stack:** HTML, CSS custom properties (existing tokens), vanilla JS. No libraries, no build step.

**Spec:** `docs/superpowers/specs/2026-07-09-interactive-resume-timeline-design.md`

## Global Constraints

- No dependencies, no build step, no package manager (project-wide rule).
- All asset paths root-relative (`/css/style.css`, `/js/...`) — GitHub Pages user page.
- Reuse existing CSS tokens: `--accent`, `--accent-dim`, `--surface`, `--surface-2`, `--border`, `--text-subtle`, `--text-muted`.
- Resume text content (role titles, dates, bullets) must not change. Exception per spec: the three Schmiede.one roles lose their repeated per-role org line because the grouped block gets a single company header.
- All content visible without JS and under `prefers-reduced-motion: reduce`.
- Education, Research Publications, and Technical Stack sections unchanged.
- No test infrastructure exists; verification is manual via `python3 -m http.server 8000`.
- Commit messages: conventional commits, no Co-Authored-By lines.

---

### Task 1: Restructure Experience section into timeline markup

**Files:**
- Modify: `resume.html:70-196` (the `<!-- Experience -->` resume-section)

**Interfaces:**
- Produces: DOM structure consumed by Task 2 CSS and Task 3 JS:
  - `.timeline` (container) > `.timeline-track` > `.timeline-track-fill`
  - `.timeline-entry` (one per position; the Schmiede.one group is a single entry)
  - each entry contains `.timeline-date` (gutter date), `.timeline-dot`, `.timeline-content`
  - the group entry contains `.timeline-company` header + existing `.career-group-body` with three `.resume-entry` children
  - individual entries contain an unmodified `.resume-entry` inside `.timeline-content`

- [ ] **Step 1: Replace the Experience section markup**

In `resume.html`, replace everything from `<!-- Experience -->` (line 70) through the closing `</div>` of that resume-section (line 196) with:

```html
          <!-- Experience -->
          <div class="resume-section">
            <h2 class="resume-section-title">Experience</h2>

            <div class="timeline" id="experience-timeline">
              <div class="timeline-track"><div class="timeline-track-fill"></div></div>

              <!-- Schmiede.one promotion track (grouped company node) -->
              <div class="timeline-entry">
                <span class="timeline-date">Aug 2023 &ndash; Present</span>
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-content">
                  <div class="timeline-company">
                    <span class="timeline-company-name">Schmiede.one GmbH</span>
                    <span class="timeline-company-meta">Innovation lab of the Grimme group &middot; D&uuml;sseldorf, Germany</span>
                  </div>
                  <div class="career-group-body">

                    <div class="resume-entry">
                      <div class="resume-entry-header">
                        <span class="resume-entry-title">Robotics Software Engineer &mdash; Computer Vision</span>
                        <span class="resume-entry-date">Dec 2024 &ndash; Present</span>
                      </div>
                      <div class="resume-entry-desc">
                        <ul>
                          <li>Own QualiCam, a ROS2 and NVIDIA Jetson&ndash;based real-time optical perception system for agricultural harvest quality assurance, end-to-end from architecture through field deployment.</li>
                          <li>Own the end-to-end MLOps pipeline (datasets, auto-annotation, training, evaluation), cutting manual effort by 85% and accelerating model release cycles.</li>
                          <li>Improve the ROS2 object detection pipeline and custom vision algorithms for the Farmsort.one optical sorter, enabling low-latency classification and sorting of agricultural produce.</li>
                          <li>Lead deployment and maintenance of production ML models in the field, resolving customer issues to ensure stable, efficient system performance.</li>
                        </ul>
                      </div>
                    </div>

                    <div class="resume-entry">
                      <div class="resume-entry-header">
                        <span class="resume-entry-title">Working Student &mdash; Computer Vision &amp; Robotics</span>
                        <span class="resume-entry-date">Mar 2024 &ndash; Nov 2024</span>
                      </div>
                      <div class="resume-entry-desc">
                        <ul>
                          <li>Developed and field-validated a standalone harvest quality assurance system (QualiCam) at customer farms to assess crop quality in real-world conditions.</li>
                          <li>Developed quantization and deployment pipelines for YOLO-based object detection models using TensorRT on NVIDIA Jetson Orin NX platform.</li>
                        </ul>
                      </div>
                    </div>

                    <div class="resume-entry">
                      <div class="resume-entry-header">
                        <span class="resume-entry-title">Intern &mdash; Computer Vision &amp; Robotics</span>
                        <span class="resume-entry-date">Aug 2023 &ndash; Feb 2024</span>
                      </div>
                      <div class="resume-entry-desc">
                        <ul>
                          <li>Spearheaded development of a stereo vision&ndash;based 3D object detection pipeline for an autonomous harvester, enabling real-time collision avoidance. Showcased at Agritechnica 2023.</li>
                          <li>Benchmarked and optimized state-of-the-art detection models on custom agricultural datasets, achieving 5&times; faster inference through ONNX and HailoRT quantization on Hailo8 edge processors.</li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <!-- Master Thesis (concurrent with Schmiede.one) -->
              <div class="timeline-entry">
                <span class="timeline-date">May 2024 &ndash; Jul 2025</span>
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-content">
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <span class="resume-entry-title">Master Thesis Student &mdash; Autonomous Driving</span>
                      <span class="resume-entry-date">May 2024 &ndash; Jul 2025</span>
                    </div>
                    <p class="resume-entry-org">Institut f&uuml;r Kraftfahrzeuge (ika), RWTH Aachen University &middot; Aachen, Germany</p>
                    <div class="resume-entry-desc">
                      <ul>
                        <li>Developed an attention map&ndash;based explainability methodology for real-time, transformer-based 3D object detection, resulting in a peer-reviewed publication at IEEE ITSC 2026.</li>
                        <li>Developed a ROS2-based pipeline to ingest LiDAR point clouds and display 3D object detection as well as saliency maps in real time.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-entry">
                <span class="timeline-date">Mar 2023 &ndash; Aug 2023</span>
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-content">
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <span class="resume-entry-title">Graduate Student Research Assistant</span>
                      <span class="resume-entry-date">Mar 2023 &ndash; Aug 2023</span>
                    </div>
                    <p class="resume-entry-org">RWTH Aachen University &middot; Aachen, Germany</p>
                    <div class="resume-entry-desc">
                      <ul>
                        <li>Developed a perception pipeline for safe mobile robot operation in construction environments, focusing on stereo vision&ndash;based 3D object detection and LiDAR point cloud compression.</li>
                        <li>Designed and deployed a closed-loop LiDAR tilt system to increase vertical field of view by 100% for close-range applications; ROS package written in C++ and deployed on NVIDIA Jetson Xavier.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-entry">
                <span class="timeline-date">May 2020 &ndash; May 2021</span>
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-content">
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <span class="resume-entry-title">Software Developer &mdash; C++</span>
                      <span class="resume-entry-date">May 2020 &ndash; May 2021</span>
                    </div>
                    <p class="resume-entry-org">Synedyne Systems &middot; Bangalore, India</p>
                    <div class="resume-entry-desc">
                      <ul>
                        <li>Developed and implemented ML-based calibration algorithms on an edge device to estimate payload of a self-loading cement mixer truck.</li>
                        <li>Achieved weight estimation accuracy of 98.5% with a maximum payload of 800 kg.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-entry">
                <span class="timeline-date">Jul 2019 &ndash; Apr 2020</span>
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-content">
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <span class="resume-entry-title">Robotics Research Engineer</span>
                      <span class="resume-entry-date">Jul 2019 &ndash; Apr 2020</span>
                    </div>
                    <p class="resume-entry-org">Indian Institute of Science &middot; Bangalore, India</p>
                    <div class="resume-entry-desc">
                      <ul>
                        <li>Designed and developed control software (C/C++) and a robotic test bed for precise liquid dispensing for composite manufacturing at the Department of Aerospace Engineering.</li>
                        <li>Achieved accuracy of &plusmn;10 microliters using a MEMS-based flow sensor.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="timeline-entry">
                <span class="timeline-date">Jul 2018 &ndash; Jul 2019</span>
                <span class="timeline-dot" aria-hidden="true"></span>
                <div class="timeline-content">
                  <div class="resume-entry">
                    <div class="resume-entry-header">
                      <span class="resume-entry-title">Robotics Systems Engineer</span>
                      <span class="resume-entry-date">Jul 2018 &ndash; Jul 2019</span>
                    </div>
                    <p class="resume-entry-org">Agilebot Automation &middot; Bangalore, India</p>
                    <div class="resume-entry-desc">
                      <ul>
                        <li>Worked on AS/RS robotic system design for automating processes in medium and large scale warehouses.</li>
                        <li>Developed chassis and frame design for a pick-and-place autonomous rover module for medium scale warehouses.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
```

Notes:
- The old `<div class="career-group">` wrapper is gone; `.career-group-body` now lives inside the group's `.timeline-content`.
- The three Schmiede.one roles no longer repeat the `<p class="resume-entry-org">` line (single company header instead).
- Individual entries keep their inline `.resume-entry-date`; CSS will hide it on desktop where the gutter `.timeline-date` shows.

- [ ] **Step 2: Verify content renders**

Run: `python3 -m http.server 8000` (from repo root), open `http://localhost:8000/resume.html`.
Expected: All six positions and all bullets visible (unstyled timeline — no line/dots yet, since CSS comes in Task 2). No console errors.

- [ ] **Step 3: Commit**

```bash
git add resume.html
git commit -m "feat: restructure resume experience into timeline markup"
```

---

### Task 2: Timeline CSS

**Files:**
- Modify: `css/style.css` — append a new block after the CAREER PROGRESSION GROUP section (after line 467, before the STAT CARDS section)

**Interfaces:**
- Consumes: Task 1 markup classes.
- Produces: classes/states Task 3 JS toggles: `timeline-js` (on `.timeline`, enables hidden initial states), `visible` (on `.timeline-entry`), `active` (on `.timeline-entry`), and inline `transform: scaleY()` on `.timeline-track-fill`.

- [ ] **Step 1: Append timeline CSS block**

Insert into `css/style.css` between the CAREER PROGRESSION GROUP block and the STAT CARDS block:

```css
/* ============================================================
   EXPERIENCE TIMELINE (resume page)
   ============================================================ */
.timeline { position: relative; margin-left: 150px; padding-left: 36px; }
.timeline-track {
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: var(--surface-2);
  border-radius: 1px;
}
.timeline-track-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--accent), var(--accent-dim));
  transform-origin: top;
  transform: scaleY(1); /* fully drawn by default (no-JS / reduced-motion) */
}
.timeline-js .timeline-track-fill { transform: scaleY(0); will-change: transform; }

.timeline-entry { position: relative; margin-bottom: 44px; }
.timeline-entry:last-child { margin-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -41px; /* centers 12px dot on the 2px track (padding-left 36px) */
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--accent-dim);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.timeline-entry.active .timeline-dot {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}

.timeline-date {
  position: absolute;
  left: -186px; /* gutter: 150px margin + 36px padding */
  top: 5px;
  width: 130px;
  text-align: right;
  font-size: 0.78rem;
  color: var(--text-subtle);
  line-height: 1.4;
}

.timeline-company { display: flex; flex-direction: column; gap: 2px; margin-bottom: 14px; }
.timeline-company-name { font-size: 1rem; font-weight: 700; color: var(--text); font-family: var(--font-display); }
.timeline-company-meta { font-size: 0.85rem; color: var(--accent); }

/* entries inside the timeline drop their old list borders */
.timeline .timeline-content > .resume-entry { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
/* inner promotion track gets breathing room from the main line */
.timeline .career-group-body { margin-left: 24px; }

/* gutter date replaces inline date on wide screens (individual entries only;
   per-role dates inside the career group stay visible) */
@media (min-width: 901px) {
  .timeline-content > .resume-entry > .resume-entry-header > .resume-entry-date { display: none; }
}

/* scroll-reveal states (only when JS is active) */
.timeline-js .timeline-entry {
  opacity: 0;
  transform: translateX(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.timeline-js .timeline-entry .timeline-dot { transform: scale(0); }
.timeline-js .timeline-entry.visible { opacity: 1; transform: none; }
.timeline-js .timeline-entry.visible .timeline-dot { transform: scale(1); }

@media (max-width: 900px) {
  .timeline { margin-left: 4px; padding-left: 26px; }
  .timeline-date { display: none; }
  .timeline-dot { left: -31px; } /* re-center for 26px padding */
  .timeline .career-group-body { margin-left: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-js .timeline-entry,
  .timeline-js .timeline-entry .timeline-dot {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .timeline-js .timeline-track-fill { transform: scaleY(1); }
}
```

- [ ] **Step 2: Verify static layout**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/resume.html`.
Expected:
- Desktop (>900px): vertical line left of content, fully drawn (no JS yet); dates in left gutter, right-aligned; dots on the line; individual entries show no duplicate inline date; Schmiede block shows company header + three roles with inner mini-track.
- Narrow (≤900px, use devtools responsive mode): gutter dates hidden, inline dates visible, line hugs left edge.
- No horizontal scrollbar at 375px width.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: add resume timeline styles"
```

---

### Task 3: Scroll animation JS

**Files:**
- Create: `js/resume-timeline.js`
- Modify: `resume.html:311` — add script tag after `components.js`

**Interfaces:**
- Consumes: `.timeline`, `.timeline-entry`, `.timeline-track-fill` from Task 1; state classes `timeline-js`, `visible`, `active` from Task 2.
- Produces: nothing consumed later (final task).

- [ ] **Step 1: Create `js/resume-timeline.js`**

```js
// Scroll animations for the resume experience timeline.
// Adds .timeline-js to opt into hidden initial states, so content stays
// visible with JS disabled. Skips everything under prefers-reduced-motion.
(function () {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  timeline.classList.add('timeline-js');

  const entries = Array.from(timeline.querySelectorAll('.timeline-entry'));
  const fill = timeline.querySelector('.timeline-track-fill');

  const observer = new IntersectionObserver((observed) => {
    observed.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  entries.forEach((el) => observer.observe(el));

  function update() {
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;

    // Draw the line down to the viewport center's position within the timeline.
    const progress = Math.min(1, Math.max(0, (viewportCenter - rect.top) / rect.height));
    if (fill) fill.style.transform = 'scaleY(' + progress + ')';

    // Glow the dot of the entry nearest the viewport center.
    let active = null;
    let best = Infinity;
    entries.forEach((el) => {
      const r = el.getBoundingClientRect();
      const distance = Math.abs(r.top + r.height / 2 - viewportCenter);
      if (distance < best) {
        best = distance;
        active = el;
      }
    });
    entries.forEach((el) => el.classList.toggle('active', el === active));
  }

  let ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize, { passive: true });
  update();
})();
```

- [ ] **Step 2: Load the script in `resume.html`**

After `<script src="/js/components.js"></script>` add:

```html
  <script src="/js/resume-timeline.js"></script>
```

- [ ] **Step 3: Verify animations**

Run: `python3 -m http.server 8000`, open `http://localhost:8000/resume.html`, hard-reload.
Expected:
- On load, entries below the fold are hidden; scrolling down fades/slides them in from the right, dots pop in with a small bounce.
- The accent line grows downward as you scroll; the dot nearest the viewport center glows.
- Scrolling back up: line retracts, glow follows; already-revealed entries stay visible.
- No console errors.

- [ ] **Step 4: Verify fallbacks**

1. DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce" → reload. Expected: everything visible immediately, line fully drawn, no animations.
2. DevTools → disable JavaScript → reload. Expected: all content visible, line fully drawn (static).
3. Restore settings.

- [ ] **Step 5: Commit**

```bash
git add js/resume-timeline.js resume.html
git commit -m "feat: animate resume timeline on scroll"
```
