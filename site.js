const root = document.documentElement;
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('.reveal-section');
const publishedAppsContainer = document.querySelector('#published-apps');

const updateGlass = () => {
  const scrollY = window.scrollY;
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  const progressValue = Math.min(scrollY / maxScroll, 1);

  root.style.setProperty('--scroll-progress', progressValue.toFixed(3));

  if (scrollY > 24) {
    topbar?.classList.add('topbar-scrolled');
  } else {
    topbar?.classList.remove('topbar-scrolled');
  }

  if (progress) {
    progress.style.transform = `scaleX(${progressValue})`;
  }
};

const revealSections = () => {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.86) {
      section.classList.add('revealed');
    }
  });
};

const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#039;',
  '"': '&quot;'
}[character]));

const fallbackApps = [
  {
    name: 'App Store Profile',
    subtitle: 'Official developer page',
    url: 'https://apps.apple.com/ca/developer/ashkan-zanjani/id1501855480',
    fallbackClass: 'store-icon',
    initials: 'A'
  },
  {
    name: 'Solira Health',
    subtitle: 'Product case study',
    url: 'projects/solira-health.html',
    fallbackClass: 'solira-icon',
    initials: 'S'
  },
  {
    name: 'Code IDE',
    subtitle: 'Product case study',
    url: 'projects/code-ide.html',
    fallbackClass: 'code-icon',
    initials: 'C'
  }
];

const renderAppCards = (apps) => {
  if (!publishedAppsContainer) return;

  publishedAppsContainer.innerHTML = apps.map((app) => {
    const icon = app.icon
      ? `<img src="${escapeHtml(app.icon)}" alt="${escapeHtml(app.name)} app icon" loading="lazy" />`
      : `<span class="published-app-icon ${escapeHtml(app.fallbackClass || 'store-icon')}">${escapeHtml(app.initials || 'A')}</span>`;

    return `
      <a class="published-app-card" href="${escapeHtml(app.url)}">
        ${icon}
        <span>
          <strong>${escapeHtml(app.name)}</strong>
          <small>${escapeHtml(app.subtitle)}</small>
        </span>
      </a>
    `;
  }).join('');
};

const getArtwork = (app) => {
  const artwork = app.artworkUrl512 || app.artworkUrl100 || app.artworkUrl60 || '';
  return artwork.replace('100x100bb', '512x512bb').replace('60x60bb', '512x512bb');
};

const loadPublishedApps = async () => {
  if (!publishedAppsContainer) return;

  const developerId = publishedAppsContainer.dataset.developerId || '1501855480';
  const endpoint = `https://itunes.apple.com/lookup?id=${encodeURIComponent(developerId)}&entity=software&country=ca&limit=50`;

  try {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error('App Store lookup failed');

    const data = await response.json();
    const apps = (data.results || [])
      .filter((item) => item.wrapperType === 'software' || item.kind === 'software')
      .map((item) => ({
        name: item.trackName,
        subtitle: item.primaryGenreName || 'App Store app',
        url: item.trackViewUrl,
        icon: getArtwork(item)
      }))
      .filter((item) => item.name && item.url);

    renderAppCards(apps.length ? apps : fallbackApps);
  } catch (error) {
    renderAppCards(fallbackApps);
  }
};

window.addEventListener('scroll', () => {
  updateGlass();
  revealSections();
}, { passive: true });

updateGlass();
revealSections();
loadPublishedApps();
