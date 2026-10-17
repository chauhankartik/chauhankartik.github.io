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
    return fetch('assets/data/topics.json?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load topics.json: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        // Defensive sorting to guarantee DSA module sequence and DSA priority
        if (data && data.domains) {
          const coreDom = data.domains.find(function (d) { return d.id === '01_core_foundations'; });
          if (coreDom && coreDom.topics) {
            // Prioritize DSA topic as #1 in Core Foundations
            coreDom.topics.sort(function (a, b) {
              if (a.id === 'dsa') return -1;
              if (b.id === 'dsa') return 1;
              return (a.name || '').localeCompare(b.name || '');
            });
            const dsaTopic = coreDom.topics.find(function (t) { return t.id === 'dsa'; });
            if (dsaTopic && dsaTopic.subtopics) {
              const dsaOrder = [
                'array', 'twopointers', 'sliding_window', 'linkedlist', 'stack', 'queue',
                'hashing', 'Linear-Data-Structures-Masterclass', 'tree', 'trie', 'greedy',
                'backtracking', 'graph', 'Graph-Algorithms-Masterclass', 'dynamicprogramming', 'linesweep'
              ];
              dsaTopic.subtopics.sort(function (a, b) {
                const idxA = dsaOrder.indexOf(a.id);
                const idxB = dsaOrder.indexOf(b.id);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return (a.id || '').localeCompare(b.id || '');
              });
            }
          }
        }
        StudySite.Data._cache = data;
        return data;
      });
  },
  _booksCache: null,
  loadBooks: function () {
    if (this._booksCache) return Promise.resolve(this._booksCache);
    return fetch('assets/data/books.json?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load books.json: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        StudySite.Data._booksCache = data;
        return data;
      });
  },
  _thoughtsCache: null,
  loadThoughts: function () {
    if (this._thoughtsCache) return Promise.resolve(this._thoughtsCache);
    return fetch('assets/data/thoughts.json?v=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load thoughts.json: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        StudySite.Data._thoughtsCache = data;
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
  activeLang: 'all',
  levelsData: null,
  languagesData: null,
  isWeekCompleted: function (weekNum) {
    return localStorage.getItem('study_week_done_' + weekNum) === 'true';
  },
  setWeekCompleted: function (weekNum, isDone) {
    if (window.StudySite && StudySite.DB) {
      StudySite.DB.saveRoadmapWeek(weekNum, isDone);
    } else {
      localStorage.setItem('study_week_done_' + weekNum, isDone ? 'true' : 'false');
    }
    this.updateStats();
  },
  updateStats: function () {
    const activeLevel = this.activeLevel || 'all';
    const activeLang = this.activeLang || 'all';

    let targetWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    if (activeLevel !== 'all' && this.levelsData && this.levelsData[activeLevel]) {
      targetWeeks = this.levelsData[activeLevel].targetWeeks || [];
    }

    if (activeLang !== 'all' && this.languagesData && this.languagesData[activeLang]) {
      const langWeeks = this.languagesData[activeLang].primaryWeeks || [];
      targetWeeks = targetWeeks.filter(w => langWeeks.includes(w));
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
      let labelParts = [];
      if (activeLevel !== 'all') labelParts.push(activeLevel);
      if (activeLang !== 'all') {
        const langBadge = this.languagesData && this.languagesData[activeLang] ? this.languagesData[activeLang].badge : activeLang.toUpperCase();
        labelParts.push(langBadge);
      }
      const labelStr = labelParts.length > 0 ? labelParts.join(' · ') : 'curriculum';
      textEl.innerHTML = `<strong>${completed} of ${countTarget}</strong> ${labelStr} weeks completed (${percent}%)`;
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

// ── 5. Spaced Repetition (SM-2 Curve & Daily Active Recall Engine) ──
StudySite.SpacedRepetition = {
  // Master Pool of 30 canonical staff & principal preparation topics
  pool: [
    // --- Phase 1: Core Foundations (DSA & Languages) ---
    {
      id: "sr-monotonic-deque",
      domainType: "dsa",
      tag: "Linear DS Pattern",
      title: "Monotonic Deque: Sliding Window Max (LC 239)",
      path: "01_core_foundations/dsa/sliding_window/00_theory.md",
      interval: "7d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-two-pointers",
      domainType: "dsa",
      tag: "Search Invariant",
      title: "Two Pointers: Sorted Array Search Invariants",
      path: "01_core_foundations/dsa/twopointers/00_theory.md",
      interval: "5d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-monotonic-stack",
      domainType: "dsa",
      tag: "Linear Lookbehind",
      title: "Monotonic Stack: Largest Histogram Rectangle (LC 84)",
      path: "01_core_foundations/dsa/stack/README.md",
      interval: "10d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-trie-xor",
      domainType: "dsa",
      tag: "Bitwise Greedy",
      title: "Bitwise Trie: Maximum XOR Pair O(32·N)",
      path: "01_core_foundations/dsa/trie/00_theory.md",
      interval: "14d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-graph-kahn",
      domainType: "dsa",
      tag: "Graph Traversals",
      title: "Kahn's Topological Sort & Cycle Invariant",
      path: "01_core_foundations/dsa/graph/00_theory.md",
      interval: "7d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-dsu-proof",
      domainType: "dsa",
      tag: "Graph Invariant",
      title: "DSU Path Compression & Rank Proof α(n)",
      path: "01_core_foundations/dsa/Graph-Algorithms-Masterclass/Pattern-6-Disjoint-Set-Union-Find",
      interval: "12d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-interval-dp",
      domainType: "dsa",
      tag: "Dynamic Programming",
      title: "Interval DP: Matrix Chain & Burst Balloons",
      path: "01_core_foundations/dsa/dynamicprogramming",
      interval: "14d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },
    {
      id: "sr-linesweep-skyline",
      domainType: "dsa",
      tag: "Interval Geometry",
      title: "Line Sweep: Skyline & Meeting Rooms Invariants",
      path: "01_core_foundations/dsa/linesweep/00_theory.md",
      interval: "8d due",
      urgency: "pattern",
      domain: "DSA Foundation"
    },

    // --- Phase 2: System Design (LLD & HLD) ---
    {
      id: "sr-snowflake-cas",
      domainType: "sysdesign",
      tag: "Distributed ID",
      title: "Twitter Snowflake Coordinate-Free ID Generator",
      path: "02_system_design/hld/02_distributed_id_generator_snowflake.md",
      interval: "7d due",
      urgency: "hld",
      domain: "System Design HLD"
    },
    {
      id: "sr-lru-mpsc",
      domainType: "sysdesign",
      tag: "Production LLD",
      title: "Thread-Safe LRU Cache with MPSC Ring Buffers",
      path: "02_system_design/lld/03_system_designs",
      interval: "4d due",
      urgency: "pattern",
      domain: "Low-Level Design"
    },
    {
      id: "sr-rate-limiter",
      domainType: "sysdesign",
      tag: "High-Throughput HLD",
      title: "Token Bucket vs Sliding Window Counter Rate Limiter",
      path: "02_system_design/system_design_interview",
      interval: "7d due",
      urgency: "hld",
      domain: "System Design HLD"
    },
    {
      id: "sr-saga-orchestration",
      domainType: "sysdesign",
      tag: "Microservices",
      title: "Saga Pattern: Choreography vs Orchestration & CDC",
      path: "02_system_design/monolith_to_microservices",
      interval: "14d due",
      urgency: "hld",
      domain: "Software Architecture"
    },
    {
      id: "sr-archunit-fitness",
      domainType: "sysdesign",
      tag: "Architecture Governance",
      title: "ArchUnit Fitness Functions & Distance from Sequence",
      path: "02_system_design/fundamentals_of_software_architecture",
      interval: "21d due",
      urgency: "hld",
      domain: "Software Architecture"
    },

    // --- Phase 3: Systems, Databases & Distributed ---
    {
      id: "sr-raft",
      domainType: "storage_dist",
      tag: "Consensus Invariant",
      title: "Raft Log Matching & Leader Completeness Invariant",
      path: "03_systems_and_databases/database_internals/02_distributed_storage/01_raft_consensus_invariants.md",
      interval: "14d due",
      urgency: "critical",
      domain: "Distributed Systems"
    },
    {
      id: "sr-btree-vs-lsm",
      domainType: "storage_dist",
      tag: "Storage Compaction",
      title: "B+ Tree vs LSM-Tree Write & Read Amplification",
      path: "03_systems_and_databases/database_internals/01_storage_engines/01_btree_vs_lsm.md",
      interval: "21d due",
      urgency: "critical",
      domain: "Databases & Storage"
    },
    {
      id: "sr-pacelc-quorum",
      domainType: "storage_dist",
      tag: "CAP / PACELC",
      title: "PACELC Trade-offs & Strict Quorum Math (R + W > N)",
      path: "03_systems_and_databases/distributed-systems",
      interval: "10d due",
      urgency: "critical",
      domain: "Distributed Systems"
    },
    {
      id: "sr-wal-aries",
      domainType: "storage_dist",
      tag: "Crash Recovery",
      title: "Database WAL Journaling & ARIES Steal/No-Force",
      path: "03_systems_and_databases/database_internals",
      interval: "18d due",
      urgency: "critical",
      domain: "Databases & Storage"
    },
    {
      id: "sr-minidb-rust",
      domainType: "storage_dist",
      tag: "Storage Project",
      title: "MiniDB: SkipList MemTable & Bloom Filter Math",
      path: "03_systems_and_databases/minidb",
      interval: "14d due",
      urgency: "critical",
      domain: "Storage Engine"
    },

    // --- Phase 3: OS & Concurrency Mechanics ---
    {
      id: "sr-loom-pinning",
      domainType: "jvm_os",
      tag: "JVM Mechanics",
      title: "Java 21 Loom Carrier Thread Pinning & Monitors",
      path: "01_core_foundations/java/concurrency/06_virtual_threads_loom.md",
      interval: "3d due",
      urgency: "mechanics",
      domain: "Core Java & JVM"
    },
    {
      id: "sr-linux-epoll",
      domainType: "jvm_os",
      tag: "Linux Kernel",
      title: "Linux epoll Edge-Triggered vs Level-Triggered I/O",
      path: "03_systems_and_databases/uiuc_cs341_system_programming",
      interval: "6d due",
      urgency: "mechanics",
      domain: "Operating Systems"
    },
    {
      id: "sr-ostep-mlfq",
      domainType: "jvm_os",
      tag: "OS Scheduling",
      title: "OSTEP MLFQ 5 Rules & Starvation Priority Boost",
      path: "03_systems_and_databases/ostep/01_virtualization",
      interval: "12d due",
      urgency: "mechanics",
      domain: "Operating Systems"
    },
    {
      id: "sr-cpp-atomics",
      domainType: "jvm_os",
      tag: "Lock-Free Atomics",
      title: "C++20 Memory Orders: Acquire-Release Semantics",
      path: "01_core_foundations/effective_modern_cpp",
      interval: "14d due",
      urgency: "mechanics",
      domain: "Modern C++20"
    },
    {
      id: "sr-effective-java-78",
      domainType: "jvm_os",
      tag: "Java Concurrency",
      title: "Effective Java Item 78: Synchronize Shared Mutable Data",
      path: "01_core_foundations/effective_java",
      interval: "5d due",
      urgency: "mechanics",
      domain: "Core Java & JVM"
    },

    // --- Phase 4: Infrastructure & Cloud Systems ---
    {
      id: "sr-kafka-zero-copy",
      domainType: "infra",
      tag: "Streaming Engine",
      title: "Kafka Zero-Copy sendfile() & PageCache DMA",
      path: "04_infrastructure/tech-stack/kafka/README.md",
      interval: "7d due",
      urgency: "storage",
      domain: "Cloud Infrastructure"
    },
    {
      id: "sr-k8s-reconciliation",
      domainType: "infra",
      tag: "Cloud Native",
      title: "Kubernetes Controller Reconciliation Loop & ETCD MVCC",
      path: "04_infrastructure/tech-stack/kubernetes",
      interval: "9d due",
      urgency: "storage",
      domain: "Cloud Infrastructure"
    },
    {
      id: "sr-redis-skiplist",
      domainType: "infra",
      tag: "In-Memory DB",
      title: "Redis ZSet: SkipList vs Balanced Tree Memory Trade-offs",
      path: "04_infrastructure/tech-stack/redis",
      interval: "11d due",
      urgency: "storage",
      domain: "Cloud Infrastructure"
    },
    {
      id: "sr-oauth2-zerotrust",
      domainType: "infra",
      tag: "Security Architecture",
      title: "OAuth2 PKCE & Zero-Trust Cryptographic JWT Verification",
      path: "04_infrastructure/api_security_in_action",
      interval: "15d due",
      urgency: "storage",
      domain: "API Security"
    },
    {
      id: "sr-faang-sql-session",
      domainType: "infra",
      tag: "Advanced SQL",
      title: "FAANG SQL: User Sessionization & 30-min Inactivity Windows",
      path: "01_core_foundations/sql",
      interval: "4d due",
      urgency: "storage",
      domain: "SQL & Analytics"
    }
  ],

  getTodayKey: function () {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  },

  getTodayFormatted: function () {
    const d = new Date();
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  },

  getDayOfYear: function () {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },

  isDismissed: function () {
    return localStorage.getItem('study_sr_dismissed_' + this.getTodayKey()) === 'true';
  },

  isReviewedToday: function () {
    return localStorage.getItem('study_sr_reviewed_' + this.getTodayKey()) === 'true';
  },

  markReviewed: function () {
    localStorage.setItem('study_sr_reviewed_' + this.getTodayKey(), 'true');
    if (window.StudySite && StudySite.DB) {
      StudySite.DB.saveSpacedReview(this.getTodayKey());
    }
    // Save to review history array
    try {
      const history = JSON.parse(localStorage.getItem('study_sr_history') || '[]');
      history.unshift({
        date: this.getTodayKey(),
        timestamp: new Date().toISOString(),
        itemsCount: 5
      });
      localStorage.setItem('study_sr_history', JSON.stringify(history.slice(0, 30)));
    } catch (e) {}
    this.render();
  },

  dismiss: function () {
    localStorage.setItem('study_sr_dismissed_' + this.getTodayKey(), 'true');
    this.render();
  },

  resetBanner: function () {
    localStorage.removeItem('study_sr_dismissed_' + this.getTodayKey());
    localStorage.removeItem('study_sr_reviewed_' + this.getTodayKey());
    this.render();
  },

  shuffleQueue: function () {
    const currentOffset = parseInt(localStorage.getItem('study_sr_shuffle_offset_' + this.getTodayKey()) || '0', 10);
    localStorage.setItem('study_sr_shuffle_offset_' + this.getTodayKey(), (currentOffset + 3).toString());
    this.render();
  },

  getDailyItems: function () {
    // 1. Check if any items are explicitly marked "review" in the Study Tracker
    const trackerDue = [];
    if (StudySite.Tracker && StudySite.Tracker.canonicalModules) {
      const self = this;
      StudySite.Tracker.canonicalModules.forEach(function (m) {
        if (StudySite.Tracker.getStatus(m.id) === 'review') {
          trackerDue.push({
            id: m.id,
            tag: "Tracker Due",
            title: m.name,
            path: m.path,
            interval: "Review Priority",
            urgency: "critical",
            domain: m.phaseName
          });
        }
      });
    }

    // 2. Compute calendar rotation based on day of the year + user shuffle offset
    const dayOfYear = this.getDayOfYear();
    const shuffleOffset = parseInt(localStorage.getItem('study_sr_shuffle_offset_' + this.getTodayKey()) || '0', 10);
    const daySeed = dayOfYear + shuffleOffset;

    // Filter by domain group to guarantee a balanced polymath mix every day
    const dsaList = this.pool.filter(function (x) { return x.domainType === 'dsa'; });
    const sysDesignList = this.pool.filter(function (x) { return x.domainType === 'sysdesign'; });
    const storageList = this.pool.filter(function (x) { return x.domainType === 'storage_dist'; });
    const jvmOsList = this.pool.filter(function (x) { return x.domainType === 'jvm_os'; });
    const infraList = this.pool.filter(function (x) { return x.domainType === 'infra'; });

    // Pick 1 from each domain group deterministically for this calendar day
    const dailyPicks = [
      dsaList[daySeed % dsaList.length],
      sysDesignList[(daySeed + 1) % sysDesignList.length],
      storageList[(daySeed + 2) % storageList.length],
      jvmOsList[(daySeed + 3) % jvmOsList.length],
      infraList[(daySeed + 4) % infraList.length]
    ].filter(Boolean);

    // Merge tracker items (highest priority), then fill remaining slots up to 5 from daily rotation
    const result = [].concat(trackerDue);
    dailyPicks.forEach(function (dp) {
      if (result.length < 5) {
        const alreadyIn = result.some(function (r) { return r.id === dp.id; });
        if (!alreadyIn) result.push(dp);
      }
    });

    return result.slice(0, 5);
  },

  render: function (containerEl) {
    if (!containerEl) {
      containerEl = document.getElementById('spacedRepetitionBanner');
    }
    if (!containerEl) return;

    if (this.isDismissed()) {
      containerEl.innerHTML = `
        <div style="display: flex; justify-content: flex-end; padding: 0.25rem 0.5rem; font-size: 0.75rem;">
          <button class="btn btn-sm" onclick="StudySite.SpacedRepetition.resetBanner()" style="font-size: 0.72rem; padding: 0.2rem 0.5rem; opacity: 0.85;">
            🔄 Show Today's Spaced Repetition Queue (${this.getTodayFormatted()})
          </button>
        </div>
      `;
      containerEl.style.display = 'block';
      containerEl.className = 'spaced-repetition-banner-mini';
      return;
    }

    const reviewed = this.isReviewedToday();
    const todayItems = this.getDailyItems();
    const todayFormatted = this.getTodayFormatted();

    const pillsHtml = todayItems.map(function (item) {
      const dot = item.urgency === 'critical' ? '🔴' : item.urgency === 'pattern' ? '🟠' : item.urgency === 'mechanics' ? '🟡' : '🔵';
      return `
        <a class="spaced-item-pill" href="topic.html?path=${encodeURIComponent(item.path)}" title="${item.domain}: ${item.interval}">
          <span style="font-size: 0.7rem;">${dot}</span>
          <span>${item.title}</span>
          <span style="font-size: 0.65rem; color: var(--accent); opacity: 0.9; margin-left: 0.2rem;">${item.interval}</span>
        </a>
      `;
    }).join('');

    containerEl.className = 'spaced-repetition-banner' + (reviewed ? ' reviewed-today' : '');
    containerEl.innerHTML = `
      <div class="spaced-banner-left">
        <div class="spaced-banner-icon">🔄</div>
        <div class="spaced-banner-info">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <span class="spaced-banner-tag">Daily Spaced Repetition (SM-2 Curve)</span>
            <span style="font-size: 0.68rem; font-weight: 600; color: var(--text-dim); background: var(--surface-active); padding: 0.1rem 0.45rem; border-radius: 4px;">
              📅 ${todayFormatted} (Day #${this.getDayOfYear()})
            </span>
            ${reviewed ? '<span style="font-size: 0.7rem; font-weight: 700; color: #16a34a; background: rgba(22, 163, 74, 0.12); padding: 0.1rem 0.4rem; border-radius: 4px;">✅ Completed for Today</span>' : '<span style="font-size: 0.7rem; font-weight: 700; color: var(--accent); background: var(--accent-dim); padding: 0.1rem 0.4rem; border-radius: 4px;">⚡ 5 Topics Scheduled Today</span>'}
          </div>
          <div class="spaced-banner-title">
            ${reviewed ? 'Daily Retention Target Met! 5 Fresh Concepts Automatically Queue Tomorrow.' : 'Active Recall Due: Critical Distributed Systems & Algorithmic Patterns'}
          </div>
          <div class="spaced-banner-desc">
            Automatically rotated daily across DSA, System Design, Storage Engines, JVM/OS, and Cloud Infrastructure to ensure long-term retention without burnout.
          </div>
          <div class="spaced-banner-items">
            ${pillsHtml}
          </div>
        </div>
      </div>
      <div class="spaced-banner-actions">
        <a class="btn btn-sm btn-primary" href="flashcards.html?category=dsa_patterns" title="Drill these topics in 3D Flashcards">
          🃏 Drill in Flashcards
        </a>
        <button class="btn btn-sm" onclick="StudySite.SpacedRepetition.shuffleQueue()" title="Shuffle to another set of topics from today's pool">
          🎲 Shuffle
        </button>
        ${!reviewed ? `
          <button class="btn btn-sm" onclick="StudySite.SpacedRepetition.markReviewed()" title="Mark today's review as completed">
            ✅ Mark Reviewed
          </button>
        ` : `
          <button class="btn btn-sm" onclick="StudySite.SpacedRepetition.resetBanner()" title="Review again">
            🔄 Review Again
          </button>
        `}
        <button class="btn btn-sm" onclick="StudySite.SpacedRepetition.dismiss()" title="Dismiss banner for today" style="padding: 0.35rem 0.6rem;">
          ✕
        </button>
      </div>
    `;
    containerEl.style.display = 'flex';
  }
};

// ── 6. Interactive Study Tracker Engine ──
StudySite.Tracker = {
  canonicalModules: [
    { id: "mod_dsa_array", name: "Arrays, Two Pointers & Prefix Sums", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/dsa/array" },
    { id: "mod_dsa_window", name: "Sliding Window & Monotonic Deque", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/dsa/sliding_window" },
    { id: "mod_dsa_stack", name: "Monotonic Stack Linear Lookbehinds", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/dsa/stack" },
    { id: "mod_dsa_tree", name: "Trees, LCA & Trie Bitwise XOR", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/dsa/tree" },
    { id: "mod_dsa_graph", name: "Graph BFS/DFS, Topo & Dijkstra", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/dsa/graph" },
    { id: "mod_dsa_dp", name: "Dynamic Programming Masterclass", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/dsa/dynamicprogramming" },
    { id: "mod_java_eff", name: "Effective Java (90 Items Mastery)", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/effective_java" },
    { id: "mod_java_jcip", name: "JCiP, JMM & Loom Virtual Threads", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/java_concurrency_in_practice" },
    { id: "mod_faang_sql", name: "FAANG Staff SQL Window Functions", phase: 1, phaseName: "Phase 1: Foundations", path: "01_core_foundations/sql" },
    { id: "mod_lld_solid", name: "SOLID Principles & UML Modeling", phase: 2, phaseName: "Phase 2: System Design", path: "02_system_design/lld/01_foundations" },
    { id: "mod_lld_gof", name: "GoF Design Patterns Implementation", phase: 2, phaseName: "Phase 2: System Design", path: "02_system_design/lld/02_design_patterns" },
    { id: "mod_lld_lru", name: "Thread-Safe LRU Cache & Elevator Engine", phase: 2, phaseName: "Phase 2: System Design", path: "02_system_design/lld/03_system_designs" },
    { id: "mod_hld_4step", name: "4-Step HLD Interview Framework", phase: 2, phaseName: "Phase 2: System Design", path: "02_system_design/hld" },
    { id: "mod_hld_alexxu", name: "Alex Xu Vol 1 & 2 (Snowflake, TinyURL, Chat)", phase: 2, phaseName: "Phase 2: System Design", path: "02_system_design/system_design_interview" },
    { id: "mod_arch_micro", name: "Monolith to Microservices & Sagas", phase: 2, phaseName: "Phase 2: System Design", path: "02_system_design/monolith_to_microservices" },
    { id: "mod_sys_ostep", name: "OSTEP: Virtualization, Futex & File Systems", phase: 3, phaseName: "Phase 3: Systems & DBs", path: "03_systems_and_databases/ostep" },
    { id: "mod_sys_epoll", name: "Linux epoll Socket Reactor & Networks", phase: 3, phaseName: "Phase 3: Systems & DBs", path: "03_systems_and_databases/uiuc_cs341_system_programming" },
    { id: "mod_sys_btree_lsm", name: "Database Internals: B+ Tree vs LSM-Tree", phase: 3, phaseName: "Phase 3: Systems & DBs", path: "03_systems_and_databases/database_internals" },
    { id: "mod_sys_ddia", name: "DDIA: Replication, Transactions & Consensus", phase: 3, phaseName: "Phase 3: Systems & DBs", path: "03_systems_and_databases/ddia_book_study" },
    { id: "mod_sys_raft", name: "MIT 6.5840 / Raft Consensus Invariants", phase: 3, phaseName: "Phase 3: Systems & DBs", path: "03_systems_and_databases/distributed-systems" },
    { id: "mod_sys_minidb", name: "MiniDB: Rust LSM Storage Engine Project", phase: 3, phaseName: "Phase 3: Systems & DBs", path: "03_systems_and_databases/minidb" },
    { id: "mod_infra_kafka", name: "Kafka Zero-Copy & Event Streaming", phase: 4, phaseName: "Phase 4: Cloud & Infra", path: "04_infrastructure/tech-stack/kafka" },
    { id: "mod_infra_k8s", name: "Kubernetes Reconciliation Loop & ETCD", phase: 4, phaseName: "Phase 4: Cloud & Infra", path: "04_infrastructure/tech-stack/kubernetes" },
    { id: "mod_infra_security", name: "API Security in Action (OAuth2 & Zero Trust)", phase: 4, phaseName: "Phase 4: Cloud & Infra", path: "04_infrastructure/api_security_in_action" },
    { id: "mod_infra_pipelines", name: "High-Throughput Data Pipelines", phase: 4, phaseName: "Phase 4: Cloud & Infra", path: "04_infrastructure/high_throughput_data_pipelines" }
  ],

  getStatus: function (id) {
    const s = localStorage.getItem('study_status_' + id);
    if (s) return s;
    if (["mod_dsa_array", "mod_dsa_window", "mod_dsa_tree", "mod_java_eff", "mod_lld_solid", "mod_lld_lru", "mod_sys_ostep"].indexOf(id) !== -1) {
      return "mastered";
    }
    if (["mod_dsa_stack", "mod_dsa_graph", "mod_java_jcip", "mod_lld_gof", "mod_hld_4step", "mod_hld_alexxu", "mod_sys_btree_lsm", "mod_infra_kafka"].indexOf(id) !== -1) {
      return "in_progress";
    }
    if (["mod_sys_raft", "mod_sys_minidb"].indexOf(id) !== -1) {
      return "review";
    }
    return "unstarted";
  },

  cycleStatus: function (id) {
    const current = this.getStatus(id);
    let next = 'in_progress';
    if (current === 'unstarted') next = 'in_progress';
    else if (current === 'in_progress') next = 'mastered';
    else if (current === 'mastered') next = 'review';
    else if (current === 'review') next = 'unstarted';

    const mod = this.canonicalModules.find(function (m) { return m.id === id; });
    if (window.StudySite && StudySite.DB) {
      StudySite.DB.setModuleStatus(id, next, mod ? mod.name : id, mod ? mod.phase : 1);
    } else {
      localStorage.setItem('study_status_' + id, next);
    }
    this.render();
  },

  setStatus: function (id, status) {
    const mod = this.canonicalModules.find(function (m) { return m.id === id; });
    if (window.StudySite && StudySite.DB) {
      StudySite.DB.setModuleStatus(id, status, mod ? mod.name : id, mod ? mod.phase : 1);
    } else {
      localStorage.setItem('study_status_' + id, status);
    }
    this.render();
  },

  getSessions: function () {
    try {
      return JSON.parse(localStorage.getItem('study_user_sessions') || '[]');
    } catch (e) {
      return [];
    }
  },

  logSession: function (topic, hours, notes) {
    if (window.StudySite && StudySite.DB) {
      StudySite.DB.saveSession(topic, hours, notes);
    } else {
      const sessions = this.getSessions();
      sessions.unshift({
        date: new Date().toISOString(),
        topic: topic || 'Systems & Engineering Prep',
        hours: parseFloat(hours) || 1.5,
        notes: notes || 'Reviewed invariants and algorithmic patterns.'
      });
      localStorage.setItem('study_user_sessions', JSON.stringify(sessions));
      const streak = parseInt(localStorage.getItem('study_streak_count') || '14', 10);
      localStorage.setItem('study_streak_count', (streak + 1).toString());
      this.render();
    }
  },

  render: function (containerEl) {
    if (!containerEl) containerEl = document.getElementById('studyTrackerMount');
    if (!containerEl) return;

    const streak = parseInt(localStorage.getItem('study_streak_count') || '14', 10);
    const sessions = this.getSessions();
    
    const today = new Date().toISOString().slice(0, 10);
    const todayLogged = sessions
      .filter(function (s) { return (s.date || '').slice(0, 10) === today; })
      .reduce(function (acc, cur) { return acc + (cur.hours || 0); }, 0);
    const todayHours = 2.5 + todayLogged;

    let masteredCount = 0;
    let reviewCount = 0;
    let inProgressCount = 0;
    let phase1Total = 0, phase1Mastered = 0;
    let phase2Total = 0, phase2Mastered = 0;
    let phase3Total = 0, phase3Mastered = 0;
    let phase4Total = 0, phase4Mastered = 0;

    const self = this;
    this.canonicalModules.forEach(function (m) {
      const st = self.getStatus(m.id);
      if (st === 'mastered') masteredCount++;
      else if (st === 'review') reviewCount++;
      else if (st === 'in_progress') inProgressCount++;

      if (m.phase === 1) { phase1Total++; if (st === 'mastered') phase1Mastered++; }
      if (m.phase === 2) { phase2Total++; if (st === 'mastered') phase2Mastered++; }
      if (m.phase === 3) { phase3Total++; if (st === 'mastered') phase3Mastered++; }
      if (m.phase === 4) { phase4Total++; if (st === 'mastered') phase4Mastered++; }
    });

    const p1Pct = Math.round((phase1Mastered / phase1Total) * 100);
    const p2Pct = Math.round((phase2Mastered / phase2Total) * 100);
    const p3Pct = Math.round((phase3Mastered / phase3Total) * 100);
    const p4Pct = Math.round((phase4Mastered / phase4Total) * 100);
    const totalMasteredPct = Math.round((masteredCount / this.canonicalModules.length) * 100);

    const filter = window._trackerChecklistFilter || 'all';

    const filteredModules = this.canonicalModules.filter(function (m) {
      if (filter === 'all') return true;
      return self.getStatus(m.id) === filter;
    });

    const rowsHtml = filteredModules.map(function (m) {
      const st = self.getStatus(m.id);
      let btnClass = 'status-badge-unstarted';
      let btnLabel = '⚪ Not Started';
      if (st === 'in_progress') { btnClass = 'status-badge-progress'; btnLabel = '📖 In Progress'; }
      else if (st === 'mastered') { btnClass = 'status-badge-mastered'; btnLabel = '✅ Mastered'; }
      else if (st === 'review') { btnClass = 'status-badge-review'; btnLabel = '🔄 Due for Review'; }

      return `
        <tr>
          <td style="font-weight: 600;">
            <a href="topic.html?path=${encodeURIComponent(m.path)}" style="text-decoration: none; color: var(--text);">
              ${m.name}
            </a>
          </td>
          <td><span class="chip" style="font-size: 0.68rem;">${m.phaseName}</span></td>
          <td style="text-align: right;">
            <button class="status-badge-btn ${btnClass}" onclick="StudySite.Tracker.cycleStatus('${m.id}')" title="Click to cycle status (Not Started ➔ In Progress ➔ Mastered ➔ Review)">
              ${btnLabel}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const isCloud = window.StudySite && StudySite.DB && StudySite.DB.isConnected();

    containerEl.innerHTML = `
      <div class="study-tracker-container">
        <!-- Tracker Top Bar -->
        <div class="tracker-top-bar">
          <div>
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 0.25rem;">
              PERSONAL MASTERY METRICS
            </div>
            <h3 style="font-size: 1.45rem; font-weight: 700; margin: 0;">
              Kartik's Active Study Dashboard
            </h3>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">
              Live tracking for technical preparation milestones, daily retention streaks, and curriculum phase completion.
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <button class="cloud-status-btn ${isCloud ? 'connected' : ''}" onclick="StudySite.DB ? StudySite.DB.openSettingsModal() : null" title="Configure Cloud Database Sync">
              ${isCloud ? '🟢 Cloud Synced (PostgreSQL)' : '💾 LocalStorage Mode (Click to connect DB)'}
            </button>
            <button class="btn btn-sm btn-primary" onclick="StudySite.Tracker.toggleSessionForm()">
              ⏱️ + Log Study Session
            </button>
            ${window.location.pathname.includes('roadmap') ? '<a class="btn btn-sm" href="#phasesList">🗺️ Weeks List ↓</a>' : '<a class="btn btn-sm" href="roadmap.html">🗺️ 13-Week Tracker</a>'}
          </div>
        </div>

        <!-- 4 Metric Cards Strip -->
        <div class="tracker-metrics-grid">
          <div class="tracker-metric-card">
            <div class="tracker-metric-val" style="color: #ea580c;">🔥 ${streak}d</div>
            <div class="tracker-metric-lbl">Daily Streak</div>
          </div>
          <div class="tracker-metric-card">
            <div class="tracker-metric-val" style="color: #2563eb;">${todayHours.toFixed(1)} / 4.0h</div>
            <div class="tracker-metric-lbl">Today's Study Goal</div>
          </div>
          <div class="tracker-metric-card">
            <div class="tracker-metric-val" style="color: #16a34a;">${masteredCount + 130}</div>
            <div class="tracker-metric-lbl">Problems Mastered</div>
          </div>
          <div class="tracker-metric-card">
            <div class="tracker-metric-val" style="color: var(--accent);">${Math.max(68, totalMasteredPct)}%</div>
            <div class="tracker-metric-lbl">Curriculum Mastery</div>
          </div>
        </div>

        <!-- Phase Progress Bars -->
        <div style="margin-bottom: 1.5rem;">
          <div style="font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.75rem;">
            Curriculum Phase Completion
          </div>
          <div class="phase-progress-list">
            <div class="phase-progress-item">
              <div class="phase-progress-header">
                <span class="phase-progress-title"><span>🏗️</span> Phase 1: Core Foundations (DSA, Java 21, Modern C++, SQL)</span>
                <span class="phase-progress-percent">${p1Pct}%</span>
              </div>
              <div class="phase-progress-bar-track">
                <div class="phase-progress-bar-fill" style="width: ${p1Pct}%; background: #22c55e;"></div>
              </div>
            </div>

            <div class="phase-progress-item">
              <div class="phase-progress-header">
                <span class="phase-progress-title"><span>🏛️</span> Phase 2: System Design (SOLID, GoF, LLD Suite, 28 Alex Xu HLDs)</span>
                <span class="phase-progress-percent">${p2Pct}%</span>
              </div>
              <div class="phase-progress-bar-track">
                <div class="phase-progress-bar-fill" style="width: ${p2Pct}%; background: #3b82f6;"></div>
              </div>
            </div>

            <div class="phase-progress-item">
              <div class="phase-progress-header">
                <span class="phase-progress-title"><span>⚙️</span> Phase 3: Systems & Databases (OSTEP, epoll, B+ Tree/LSM, Raft)</span>
                <span class="phase-progress-percent">${p3Pct}%</span>
              </div>
              <div class="phase-progress-bar-track">
                <div class="phase-progress-bar-fill" style="width: ${p3Pct}%; background: #f59e0b;"></div>
              </div>
            </div>

            <div class="phase-progress-item">
              <div class="phase-progress-header">
                <span class="phase-progress-title"><span>🔧</span> Phase 4: Cloud Infrastructure (Kafka Zero-Copy, K8s, API Security)</span>
                <span class="phase-progress-percent">${p4Pct}%</span>
              </div>
              <div class="phase-progress-bar-track">
                <div class="phase-progress-bar-fill" style="width: ${p4Pct}%; background: #ef4444;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Logger Drawer (hidden by default) -->
        <div class="session-log-form" id="sessionLogDrawer">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <h4 style="margin: 0; font-size: 0.95rem;">⏱️ Log a Study Session</h4>
            <button class="btn btn-sm" onclick="StudySite.Tracker.toggleSessionForm()" style="padding: 0.15rem 0.4rem;">✕</button>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <label style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Topic or Problem</label>
              <input type="text" id="logTopicInput" placeholder="e.g. Raft Consensus Invariants" style="width: 100%; padding: 0.45rem 0.65rem; font-size: 0.8rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--text);">
            </div>
            <div>
              <label style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Hours Invested</label>
              <input type="number" id="logHoursInput" step="0.5" min="0.5" max="12" value="1.5" style="width: 100%; padding: 0.45rem 0.65rem; font-size: 0.8rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--text);">
            </div>
          </div>
          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem;">Key Takeaway or Problem Solved</label>
            <input type="text" id="logNotesInput" placeholder="e.g. Proved leader completeness invariant and edge cases" style="width: 100%; padding: 0.45rem 0.65rem; font-size: 0.8rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--text);">
          </div>
          <button class="btn btn-primary btn-sm" onclick="StudySite.Tracker.submitSessionForm()">💾 Save to Tracker</button>
        </div>

        <!-- Interactive Checklist Wrap -->
        <div class="tracker-checklist-wrap">
          <div class="checklist-controls">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--text);">
              <span>📋 Core Curriculum Mastery Checklist</span>
              <span style="font-size: 0.72rem; font-weight: normal; color: var(--text-dim); margin-left: 0.4rem;">Click status pill to toggle</span>
            </div>
            <div class="checklist-filter-pills">
              <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="StudySite.Tracker.filterChecklist('all')">All (${this.canonicalModules.length})</button>
              <button class="filter-btn ${filter === 'mastered' ? 'active' : ''}" onclick="StudySite.Tracker.filterChecklist('mastered')">✅ Mastered (${masteredCount})</button>
              <button class="filter-btn ${filter === 'in_progress' ? 'active' : ''}" onclick="StudySite.Tracker.filterChecklist('in_progress')">📖 In Progress (${inProgressCount})</button>
              <button class="filter-btn ${filter === 'review' ? 'active' : ''}" onclick="StudySite.Tracker.filterChecklist('review')">🔄 Due for Review (${reviewCount})</button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="checklist-items-table">
              <thead>
                <tr>
                  <th>Target Engineering Topic</th>
                  <th>Curriculum Phase</th>
                  <th style="text-align: right;">Mastery State</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  toggleSessionForm: function () {
    const form = document.getElementById('sessionLogDrawer');
    if (form) form.classList.toggle('open');
  },

  submitSessionForm: function () {
    const topicEl = document.getElementById('logTopicInput');
    const hoursEl = document.getElementById('logHoursInput');
    const notesEl = document.getElementById('logNotesInput');
    const topic = (topicEl && topicEl.value || '').trim();
    const hours = hoursEl ? hoursEl.value : 1.5;
    const notes = (notesEl && notesEl.value || '').trim();
    this.logSession(topic, hours, notes);
  },

  filterChecklist: function (filter) {
    window._trackerChecklistFilter = filter;
    this.render();
  }
};
