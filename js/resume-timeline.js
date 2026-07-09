// Scroll animations for the resume experience timeline.
// Adds .timeline-js to opt into hidden initial states, so content stays
// visible with JS disabled. Skips everything under prefers-reduced-motion.
(function () {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

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

  // Timeline lives inside a <details>; geometry is wrong until it opens.
  const experienceSection = document.getElementById('experience-section');
  if (experienceSection) {
    experienceSection.addEventListener('toggle', () => {
      update();
      // Re-run after the open transition settles (0.3s in CSS).
      setTimeout(onScrollOrResize, 350);
    });
  }

  update();
})();

// Printing: closed <details> content doesn't print reliably; open all
// resume sections before print and restore their prior state after.
(function () {
  const sections = document.querySelectorAll('details.resume-section');
  if (!sections.length) return;

  let previouslyOpen = null;
  window.addEventListener('beforeprint', () => {
    previouslyOpen = Array.from(sections, (d) => d.open);
    sections.forEach((d) => { d.open = true; });
  });
  window.addEventListener('afterprint', () => {
    if (!previouslyOpen) return;
    sections.forEach((d, i) => { d.open = previouslyOpen[i]; });
    previouslyOpen = null;
  });
})();
