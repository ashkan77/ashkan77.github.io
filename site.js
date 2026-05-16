const root = document.documentElement;
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('.reveal-section');
const publishedAppsContainer = document.querySelector('#published-apps');
const appArtworkImages = document.querySelectorAll('.app-store-artwork[data-app-id]');

const appStoreApps = [
  {
    id: '6762309864',
    name: 'Watch Audio Player',
    subtitle: 'Audio player for Apple Watch',
    url: 'https://apps.apple.com/tr/app/watch-audio-player/id6762309864',
    page: 'apps/watch-audio-player.html',
    fallbackClass: 'audio-icon',
    initials: 'W'
  },
  {
    id: '6753948436',
    name: 'Converter One',
    subtitle: 'Unit and daily converter',
    url: 'https://apps.apple.com/tr/app/converter-one/id6753948436',
    page: 'apps/converter-one.html',
    fallbackClass: 'store-icon',
    initials: 'C'
  },
  {
    id: '6749022797',
    name: 'BMI Checker Plus',
    subtitle: 'BMI and health utility',
    url: 'https://apps.apple.com/tr/app/bmi-checker-plus/id6749022797',
    page: 'apps/bmi-checker-plus.html',
    fallbackClass: 'solira-icon',
    initials: 'B'
  },
  {
    id: '6738957040',
    name: 'World Guide App',
    subtitle: 'Travel and city guide',
    url: 'https://apps.apple.com/tr/app/world-guide-app/id6738957040',
    page: 'apps/world-guide-app.html',
    fallbackClass: 'guide-icon',
    initials: 'W'
  }
];

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

const renderAppCards = (apps) => {
  if (!publishedAppsContainer) return;

  publishedAppsContainer.innerHTML = apps.map((app) => {
    const icon = app.icon
      ? `<img src="${escapeHtml(app.icon)}" alt="${escapeHtml(app.name)} app icon" loading="lazy" />`
      : `<span class="published-app-icon ${escapeHtml(app.fallbackClass || 'store-icon')}">${escapeHtml(app.initials || 'A')}</span>`;

    return `
      <a class="published-app-card" href="${escapeHtml(app.page || app.url)}">
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
  return artwork
    .replace('100x100bb', '512x512bb')
    .replace('60x60bb', '512x512bb');
};

const fetchAppStoreApp = async (app) => {
  const endpoint = `https://itunes.apple.com/lookup?id=${encodeURIComponent(app.id)}&country=tr`;
  const response = await fetch(endpoint, { cache: 'no-store' });
  if (!response.ok) throw new Error('App Store lookup failed');

  const data = await response.json();
  const item = (data.results || []).find((result) => result.wrapperType === 'software' || result.kind === 'software');
  if (!item) return app;

  return {
    ...app,
    name: item.trackName || app.name,
    subtitle: item.primaryGenreName || app.subtitle,
    icon: getArtwork(item),
    url: app.url
  };
};

const loadPublishedApps = async () => {
  if (!publishedAppsContainer) return;

  renderAppCards(appStoreApps);

  try {
    const settledApps = await Promise.allSettled(appStoreApps.map(fetchAppStoreApp));
    const apps = settledApps.map((result, index) => (
      result.status === 'fulfilled' ? result.value : appStoreApps[index]
    ));
    renderAppCards(apps);
  } catch (error) {
    renderAppCards(appStoreApps);
  }
};

const hydrateAppArtwork = async () => {
  if (!appArtworkImages.length) return;

  await Promise.allSettled(Array.from(appArtworkImages).map(async (image) => {
    const app = appStoreApps.find((candidate) => candidate.id === image.dataset.appId);
    if (!app) return;

    try {
      const appData = await fetchAppStoreApp(app);
      if (appData.icon) {
        image.src = appData.icon;
        image.alt = `${appData.name} app icon`;
      }
    } catch (error) {
      image.alt = `${app.name} app icon`;
    }
  }));
};

window.addEventListener('scroll', () => {
  updateGlass();
  revealSections();
}, { passive: true });

updateGlass();
revealSections();
loadPublishedApps();
hydrateAppArtwork();
