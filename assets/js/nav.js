/**
 * CS_basics Navigation & Theme Management
 * Executes synchronously to prevent flash of unstyled theme
 */

(function () {
  const savedTheme = localStorage.getItem('study-theme') || 'paper';
  const effectiveTheme = savedTheme === 'light' ? 'paper' : savedTheme;
  document.documentElement.setAttribute('data-theme', effectiveTheme);
})();

window.StudySite = window.StudySite || {};

StudySite.Theme = {
  themeConfig: {
    paper: { label: 'Paper', icon: '📜', next: 'white' },
    white: { label: 'White', icon: '⚪', next: 'dark' },
    dark:  { label: 'Dark', icon: '🌙', next: 'paper' }
  },
  current: function () {
    let t = document.documentElement.getAttribute('data-theme') || 'paper';
    if (t === 'light') t = 'paper';
    return t;
  },
  toggle: function () {
    const curr = this.current();
    const next = this.themeConfig[curr] ? this.themeConfig[curr].next : 'paper';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('study-theme', next);
    this.updateButtons();
  },
  setTheme: function (themeName) {
    if (this.themeConfig[themeName]) {
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('study-theme', themeName);
      this.updateButtons();
    }
  },
  updateButtons: function () {
    const curr = this.current();
    const conf = this.themeConfig[curr] || this.themeConfig.paper;
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.innerHTML = `${conf.icon} <span>${conf.label}</span>`;
      btn.setAttribute('title', `Active Theme: ${conf.label}. Click to cycle: Paper → White → Dark`);
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

    // Inject Cloud DB Sync button in sticky top bar if not already present
    const nav = document.querySelector('.top-bar-nav');
    if (nav && !nav.querySelector('.cloud-nav-btn')) {
      const themeBtn = nav.querySelector('.theme-toggle-btn');
      const cloudBtn = document.createElement('button');
      cloudBtn.className = 'cloud-nav-btn';
      cloudBtn.onclick = function () {
        if (window.StudySite && StudySite.DB) StudySite.DB.openSettingsModal();
      };
      if (themeBtn) {
        nav.insertBefore(cloudBtn, themeBtn);
      } else {
        nav.appendChild(cloudBtn);
      }
    }
    this.updateCloudIndicator();
  },
  updateCloudIndicator: function () {
    const isConnected = window.StudySite && StudySite.DB && StudySite.DB.isConnected();
    document.querySelectorAll('.cloud-nav-btn').forEach(function (btn) {
      if (isConnected) {
        btn.classList.add('connected');
        btn.innerHTML = '🟢 <span>Sync</span>';
        btn.title = 'Connected to Supabase PostgreSQL. Click to open cloud sync settings.';
      } else {
        btn.classList.remove('connected');
        btn.innerHTML = '💾 <span>Local</span>';
        btn.title = 'Offline / LocalStorage Mode. Click to connect cloud database.';
      }
    });
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
