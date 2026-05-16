const root = document.documentElement;
const topbar = document.querySelector('.topbar');
const progress = document.querySelector('.scroll-progress');
const sections = document.querySelectorAll('.reveal-section');

const updateGlass = () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
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

window.addEventListener('scroll', () => {
  updateGlass();
  revealSections();
}, { passive: true });

updateGlass();
revealSections();
