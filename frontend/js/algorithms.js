document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navLinks');

  if (toggleButton && nav) {
    toggleButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggleButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const tabs = document.querySelectorAll('.algo-tab');
  const panels = document.querySelectorAll('.algo-panel');

  if (!tabs.length || !panels.length) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      tabs.forEach((btn) => {
        const isActive = btn === tab;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.id === `tab-${target}`;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
      });
    });
  });
});
