/**
 * CS_basics Navigation & Theme Management
 * Executes synchronously to prevent flash of unstyled theme
 */

(function () {
  const savedTheme = localStorage.getItem('study-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

window.StudySite = window.StudySite || {};

StudySite.Theme = {
  current: function () {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  },
  toggle: function () {
    const next = this.current() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('study-theme', next);
    this.updateButtons();
  },
  updateButtons: function () {
    const isDark = this.current() === 'dark';
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.innerHTML = isDark ? '☀️ <span>Light</span>' : '🌙 <span>Dark</span>';
    });
  },
  init: function () {
    this.updateButtons();
  }
};

StudySite.Nav = {
  mount: function (activePage) {
    // Set active link in desktop and mobile
    document.querySelectorAll('.top-bar-link, .mobile-nav-link').forEach(function (el) {
      if (el.getAttribute('data-page') === activePage) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    StudySite.Theme.init();
  },
  toggleMobile: function () {
    const el = document.getElementById('mobileNav');
    if (el) el.classList.toggle('open');
  },
  closeMobile: function () {
    const el = document.getElementById('mobileNav');
    if (el) el.classList.remove('open');
  }
};

StudySite.Progress = {
  init: function () {
    const bar = document.getElementById('readingProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const h = document.documentElement;
      const st = h.scrollTop || document.body.scrollTop;
      const sh = h.scrollHeight || document.body.scrollHeight;
      const percent = (st / (sh - h.clientHeight)) * 100;
      bar.style.width = Math.min(Math.max(percent, 0), 100) + '%';
    }, { passive: true });
  }
};
