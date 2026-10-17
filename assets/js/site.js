/**
 * CS_basics Application Core Engine
 * Data loading, Markdown & Code rendering, Roadmap progress, and Search
 */

window.StudySite = window.StudySite || {};

// ── 1. Data Service ──
StudySite.Data = {
  _cache: null,
  load: function () {
    if (this._cache) return Promise.resolve(this._cache);
    return fetch('assets/data/topics.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load topics.json: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        StudySite.Data._cache = data;
        return data;
      });
  },
  findTopicByPath: function (data, pathQuery) {
    if (!pathQuery || !data || !data.domains) return null;
    const norm = pathQuery.replace(/^\/+|\/+$/g, '');
    for (const domain of data.domains) {
      for (const topic of domain.topics) {
        if (topic.path === norm || topic.id === norm || norm.startsWith(topic.path)) {
          return { domain: domain, topic: topic };
        }
      }
    }
    return null;
  }
};

// ── 2. Markdown & Code Renderer ──
StudySite.Renderer = {
  renderFile: function (containerEl, filePath) {
    if (!containerEl) return;
    containerEl.innerHTML = '<div style="padding: 3rem 0; text-align: center; color: var(--text-dim);">⏳ Loading content...</div>';
    
    const ext = filePath.split('.').pop().toLowerCase();
    
    return fetch(filePath)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status + ' - Unable to fetch ' + filePath);
        return res.text();
      })
      .then(function (content) {
        if (ext === 'md') {
          StudySite.Renderer._renderMarkdown(containerEl, content, filePath);
        } else {
          StudySite.Renderer._renderSourceCode(containerEl, content, filePath, ext);
        }
      })
      .catch(function (err) {
        containerEl.innerHTML = 
          '<div style="padding: 2.5rem; background: var(--surface); border: 1px solid var(--red); border-radius: 8px;">' +
            '<h3 style="color: var(--red); margin-bottom: 0.5rem;">Failed to load file</h3>' +
            '<p style="color: var(--text-muted); font-size: 0.85rem;">' + err.message + '</p>' +
            '<p style="margin-top: 1rem;"><a class="btn btn-sm" href="topics.html">← Back to Topics</a></p>' +
          '</div>';
      });
  },

  _renderMarkdown: function (containerEl, markdownText, filePath) {
    if (window.marked) {
      marked.setOptions({
        gfm: true,
        breaks: false,
        highlight: function (code, lang) {
          if (lang && lang === 'mermaid') return code;
          if (window.hljs && lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(code, { language: lang }).value;
            } catch (e) {}
          }
          return code;
        }
      });

      // Transform Callouts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
      let processed = markdownText.replace(
        /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][^\n]*\n((?:^>.*\n?)*)/gim,
        function (match, type, body) {
          const cleanBody = body.replace(/^>\s?/gm, '');
          const lower = type.toLowerCase();
          return `<div class="callout callout-${lower}"><div class="callout-title">${type}</div><div class="callout-body">${cleanBody}</div></div>\n`;
        }
      );

      let html = marked.parse(processed);
      containerEl.innerHTML = '<div class="rendered-md">' + html + '</div>';

      // Transform Mermaid Code Blocks
      containerEl.querySelectorAll('pre code.language-mermaid').forEach(function (block) {
        const parent = block.parentElement;
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = block.textContent;
        parent.replaceWith(div);
      });

      // Render Mermaid Diagrams if available
      if (window.mermaid) {
        try {
          mermaid.initialize({
            startOnLoad: false,
            theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'neutral',
            securityLevel: 'loose'
          });
          mermaid.run({ nodes: containerEl.querySelectorAll('.mermaid') });
        } catch (e) {
          console.warn('Mermaid rendering notice:', e);
        }
      }

      // Syntax highlight any remaining code blocks
      if (window.hljs) {
        containerEl.querySelectorAll('pre code:not(.language-mermaid)').forEach(function (block) {
          hljs.highlightElement(block);
        });
      }

      // Rewrite relative links to markdown files so they open in our topic viewer
      const baseDir = filePath.substring(0, filePath.lastIndexOf('/') + 1);
      containerEl.querySelectorAll('a').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#') && !href.startsWith('mailto:')) {
          let resolved = href;
          if (!href.startsWith('/')) {
            resolved = baseDir + href;
          } else {
            resolved = href.substring(1);
          }
          // Normalize ./ and ../
          resolved = StudySite.Renderer._normalizePath(resolved);
          if (resolved.endsWith('.md') || resolved.endsWith('.java') || resolved.endsWith('.sql') || resolved.endsWith('.rs')) {
            link.href = 'topic.html?path=' + encodeURIComponent(resolved);
          }
        }
      });

    } else {
      // Fallback
      containerEl.innerHTML = '<pre><code>' + markdownText.replace(/</g, '&lt;') + '</code></pre>';
    }
  },

  _renderSourceCode: function (containerEl, codeText, filePath, ext) {
    const langMap = {
      java: 'java',
      sql: 'sql',
      rs: 'rust',
      c: 'c',
      cpp: 'cpp',
      h: 'c',
      json: 'json',
      js: 'javascript',
      jsx: 'javascript'
    };
    const lang = langMap[ext] || 'plaintext';

    let highlighted = '';
    if (window.hljs && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(codeText, { language: lang }).value;
      } catch (e) {
        highlighted = codeText.replace(/</g, '&lt;');
      }
    } else {
      highlighted = codeText.replace(/</g, '&lt;');
    }

    const lines = highlighted.split('\n');
    const lineNums = lines.map((_, i) => `<span class="line-num">${i + 1}</span>`).join('\n');
    const codeBody = lines.map(line => `<span class="line">${line || ' '}</span>`).join('\n');

    containerEl.innerHTML =
      '<div class="code-viewer-wrap">' +
        '<div class="code-viewer-bar">' +
          '<span class="code-viewer-meta">Language: <strong>' + lang.toUpperCase() + '</strong> · ' + lines.length + ' lines</span>' +
          '<button class="btn btn-sm" onclick="StudySite.Renderer.copySource()">' +
            '📋 Copy' +
          '</button>' +
        '</div>' +
        '<div class="code-viewer-body" id="codeSourceBody">' +
          '<pre><code class="hljs language-' + lang + '">' + highlighted + '</code></pre>' +
        '</div>' +
      '</div>';
  },

  copySource: function () {
    const code = document.querySelector('#codeSourceBody code');
    if (!code) return;
    navigator.clipboard.writeText(code.innerText).then(function () {
      alert('Code copied to clipboard!');
    });
  },

  _normalizePath: function (path) {
    const parts = path.split('/');
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === '.' || part === '') continue;
      if (part === '..') {
        if (result.length > 0) result.pop();
      } else {
        result.push(part);
      }
    }
    return result.join('/');
  }
};

// ── 3. Study Roadmap Progress ──
StudySite.Roadmap = {
  activeLevel: 'all',
  levelsData: null,
  isWeekCompleted: function (weekNum) {
    return localStorage.getItem('study_week_done_' + weekNum) === 'true';
  },
  setWeekCompleted: function (weekNum, isDone) {
    localStorage.setItem('study_week_done_' + weekNum, isDone ? 'true' : 'false');
    this.updateStats();
  },
  updateStats: function () {
    const activeLevel = this.activeLevel || 'all';
    let targetWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    if (activeLevel !== 'all' && this.levelsData && this.levelsData[activeLevel]) {
      targetWeeks = this.levelsData[activeLevel].targetWeeks || [];
    }

    let completed = 0;
    const totalWeeks = 13;
    for (let w = 1; w <= totalWeeks; w++) {
      const isDone = this.isWeekCompleted(w);
      const card = document.getElementById('weekCard_' + w);
      const checkbox = document.getElementById('weekCheck_' + w);
      if (card) {
        if (isDone) card.classList.add('completed');
        else card.classList.remove('completed');
      }
      if (checkbox) {
        checkbox.checked = isDone;
      }
      if (targetWeeks.includes(w) && isDone) {
        completed++;
      }
    }
    const countTarget = targetWeeks.length;
    const percent = countTarget > 0 ? Math.round((completed / countTarget) * 100) : 0;
    const fillEl = document.getElementById('overallProgressFill');
    const textEl = document.getElementById('overallProgressText');
    if (fillEl) fillEl.style.width = percent + '%';
    if (textEl) {
      const levelLabel = activeLevel === 'all' ? 'total' : activeLevel;
      textEl.innerHTML = `<strong>${completed} of ${countTarget}</strong> ${levelLabel} weeks completed (${percent}%)`;
    }
  },
  toggleWeekCard: function (weekNum) {
    const card = document.getElementById('weekCard_' + weekNum);
    if (card) {
      card.classList.toggle('open');
    }
  }
};

// ── 4. Global Search Engine ──
StudySite.Search = {
  _index: null,
  init: function (inputEl, resultsEl, countEl, domainFilterEl) {
    const self = this;
    StudySite.Data.load().then(function (data) {
      self._index = data.searchIndex || [];
      
      const doSearch = function () {
        const query = (inputEl.value || '').trim().toLowerCase();
        const activeDomain = domainFilterEl ? domainFilterEl.value : 'all';
        self.execute(query, activeDomain, resultsEl, countEl);
      };

      if (inputEl) {
        inputEl.addEventListener('input', doSearch);
      }
      if (domainFilterEl) {
        domainFilterEl.addEventListener('change', doSearch);
      }

      // Check URL search parameters
      const urlParams = new URLSearchParams(window.location.search);
      const initialQ = urlParams.get('q');
      const initialD = urlParams.get('domain');
      if (initialQ && inputEl) {
        inputEl.value = initialQ;
      }
      if (initialD && domainFilterEl) {
        domainFilterEl.value = initialD;
      }
      doSearch();
    });
  },

  execute: function (query, domainFilter, resultsEl, countEl) {
    if (!resultsEl || !this._index) return;

    if (!query && domainFilter === 'all') {
      resultsEl.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 3rem 0;">Type a keyword (e.g. "Raft", "Snowflake", "Kafka", "Virtual Threads", "B-Tree") to search 800+ study files.</div>';
      if (countEl) countEl.textContent = 'Ready to search';
      return;
    }

    const tokens = query.split(/\s+/).filter(Boolean);

    const matches = this._index.filter(function (item) {
      if (domainFilter !== 'all' && item.domainId !== domainFilter) {
        return false;
      }
      if (tokens.length === 0) return true;

      const title = (item.title || '').toLowerCase();
      const path = (item.path || '').toLowerCase();
      const topic = (item.topic || '').toLowerCase();
      const domain = (item.domain || '').toLowerCase();

      // All tokens must match somewhere in title, path, topic or domain
      return tokens.every(function (tok) {
        return title.includes(tok) || path.includes(tok) || topic.includes(tok) || domain.includes(tok);
      });
    }).slice(0, 100);

    if (countEl) {
      countEl.innerHTML = `Found <strong>${matches.length}</strong> matching document${matches.length === 1 ? '' : 's'}${matches.length === 100 ? ' (capped at 100)' : ''}`;
    }

    if (matches.length === 0) {
      resultsEl.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 3rem 0;">No matching files found. Try broadening your query.</div>';
      return;
    }

    const html = matches.map(function (item) {
      const ext = item.ext || item.path.split('.').pop();
      const badgeClass = 'chip chip-' + (ext === 'md' ? 'md' : ext === 'java' ? 'java' : ext === 'sql' ? 'sql' : ext === 'rs' ? 'rs' : 'other');
      
      return `
        <div class="search-result-item">
          <div class="search-result-top">
            <span class="${badgeClass}">${ext.toUpperCase()}</span>
            <span>${item.domain} › ${item.topic}</span>
          </div>
          <a class="search-result-title" href="topic.html?path=${encodeURIComponent(item.path)}">
            ${item.title}
          </a>
          <div class="search-result-path">${item.path}</div>
        </div>
      `;
    }).join('');

    resultsEl.innerHTML = html;
  }
};
