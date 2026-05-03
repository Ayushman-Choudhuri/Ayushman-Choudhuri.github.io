(function () {
  var data = window.PROJECT;
  if (!data) return;

  document.title = data.title + ' | Ayushman Choudhuri';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', data.subtitle || '');

  var el = document.getElementById('project-detail');
  if (!el) return;

  var isRecent    = data.category === 'recent';
  var isActive    = data.status === 'active';
  var statusLabel = isActive ? 'In Progress' : 'Completed';
  var statusClass = isActive ? 'status-active' : 'status-completed';

  var sidebarItems = [
    data.date        && { label: 'Year',        value: data.date },
    data.institution && { label: 'Institution', value: data.institution },
    data.event       && { label: 'Event',       value: data.event },
    data.team        && { label: 'Team',        value: data.team },
    data.advisor     && { label: 'Advisor',     value: data.advisor },
    data.award       && { label: 'Award',       value: data.award },
    { label: 'Category', value: isRecent ? 'Recent Project' : 'Legacy Project' },
    { label: 'Status',   value: statusLabel },
  ].filter(Boolean);

  function linkBtn(href, label, style) {
    return '<a href="' + href + '" target="_blank" rel="noopener" class="btn btn-' + (style || 'primary') + ' btn-sm">' + label + '</a>';
  }

  var links = [];
  if (data.github) links.push(linkBtn(data.github,
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg> GitHub',
    'primary'));
  if (data.demo)  links.push(linkBtn(data.demo,  'Live Demo',  'secondary'));
  if (data.paper) links.push(linkBtn(data.paper, 'Paper',      'secondary'));
  var linksHTML = links.join('');

  var sectionsHTML = (data.sections || []).map(function (s) {
    return '<h2>' + s.heading + '</h2>' + s.content;
  }).join('');

  el.innerHTML =
    '<div class="page-hero">' +
      '<div class="container">' +
        '<div class="breadcrumb">' +
          '<a href="/">Home</a><span class="breadcrumb-sep">/</span>' +
          '<a href="/projects.html">Projects</a><span class="breadcrumb-sep">/</span>' +
          '<span>' + data.title + '</span>' +
        '</div>' +
        '<div class="page-hero-meta">' +
          '<span class="tag tag-accent">' + (isRecent ? 'Recent' : 'Legacy') + '</span>' +
          '<span class="project-card-status ' + statusClass + '">' + statusLabel + '</span>' +
          (data.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') +
        '</div>' +
        '<h1>' + data.title + '</h1>' +
        '<p class="page-hero-subtitle">' + (data.subtitle || '') + '</p>' +
        '<div class="project-links">' + linksHTML + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="project-content">' +
      '<div class="container">' +
        '<div class="project-layout">' +
          '<article class="project-body">' + sectionsHTML + '</article>' +
          '<aside class="project-sidebar">' +
            '<div class="sidebar-card">' +
              '<h4>Project Info</h4>' +
              sidebarItems.map(function (item) {
                return '<div class="sidebar-item">' +
                  '<span class="sidebar-item-label">' + item.label + '</span>' +
                  '<span class="sidebar-item-value">' + item.value + '</span>' +
                  '</div>';
              }).join('') +
            '</div>' +
            (data.tags && data.tags.length ?
              '<div class="sidebar-card"><h4>Technologies</h4>' +
              '<div class="tags" style="margin-top:8px">' +
              data.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') +
              '</div></div>' : '') +
            (linksHTML ?
              '<div class="sidebar-card"><h4>Links</h4>' +
              '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">' + linksHTML + '</div>' +
              '</div>' : '') +
          '</aside>' +
        '</div>' +
      '</div>' +
    '</div>';
})();
