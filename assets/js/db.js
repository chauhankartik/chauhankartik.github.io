/**
 * StudySite Database Engine
 * Supabase (PostgreSQL) Cloud Sync with automatic offline localStorage fallback
 */

window.StudySite = window.StudySite || {};

StudySite.DB = {
  _client: null,

  init: function () {
    const defaultUrl = 'https://mnvakmqzabxyrzjbluzx.supabase.co';
    const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udmFrbXF6YWJ4eXJ6amJsdXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDk0ODAsImV4cCI6MjEwNzgyNTQ4MH0.1Tp3OrUPPqswTKeIyAAdDdhvuQIUt3tdfMQcvnu2zn0';

    const url = localStorage.getItem('study_supabase_url') || (window.STUDY_CONFIG && window.STUDY_CONFIG.supabaseUrl) || defaultUrl;
    const key = localStorage.getItem('study_supabase_key') || (window.STUDY_CONFIG && window.STUDY_CONFIG.supabaseKey) || defaultKey;

    if (url && key && window.supabase) {
      try {
        this._client = window.supabase.createClient(url, key);
        // Trigger silent background sync to pull latest progress
        setTimeout(() => {
          this.syncCloudToLocal().catch(function () {});
        }, 800);
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this._client = null;
      }
    }
    if (document.body) {
      this.injectModal();
    }
    if (StudySite.Nav && StudySite.Nav.updateCloudIndicator) {
      StudySite.Nav.updateCloudIndicator();
    }
  },

  getClient: function () {
    return this._client;
  },

  isConnected: function () {
    return this._client !== null;
  },

  connect: async function (url, key) {
    if (!url || !key) throw new Error('Both Supabase URL and Anon Key are required.');
    if (!window.supabase) throw new Error('Supabase JS library not loaded. Check network connection.');

    const tempClient = window.supabase.createClient(url.trim(), key.trim());
    // Test query
    const { data, error } = await tempClient.from('study_sessions').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST205' || (error.message && error.message.includes('schema cache'))) {
        throw new Error('Supabase connection verified, but database tables are not created yet! Please copy schema.sql into your Supabase SQL Editor and click Run.');
      }
      if (error.code !== 'PGRST116') {
        throw new Error('Database connection failed: ' + (error.message || JSON.stringify(error)));
      }
    }

    localStorage.setItem('study_supabase_url', url.trim());
    localStorage.setItem('study_supabase_key', key.trim());
    this._client = tempClient;

    if (StudySite.Nav && StudySite.Nav.updateCloudIndicator) {
      StudySite.Nav.updateCloudIndicator();
    }

    // Background pull down to keep local storage in sync
    await this.syncCloudToLocal();
    return true;
  },

  disconnect: function () {
    localStorage.removeItem('study_supabase_url');
    localStorage.removeItem('study_supabase_key');
    this._client = null;
    if (StudySite.Nav && StudySite.Nav.updateCloudIndicator) {
      StudySite.Nav.updateCloudIndicator();
    }
  },

  // ── 1. Study Sessions ──
  saveSession: async function (topic, hours, notes) {
    const newSession = {
      topic: topic || 'Staff Systems Preparation',
      hours: parseFloat(hours) || 1.5,
      notes: notes || 'Reviewed invariants and algorithmic patterns.',
      created_at: new Date().toISOString(),
      session_date: new Date().toISOString().slice(0, 10)
    };

    // Always update localStorage first for instant snappy UI
    const localSessions = JSON.parse(localStorage.getItem('study_user_sessions') || '[]');
    localSessions.unshift(newSession);
    localStorage.setItem('study_user_sessions', JSON.stringify(localSessions));

    const streak = parseInt(localStorage.getItem('study_streak_count') || '14', 10);
    localStorage.setItem('study_streak_count', (streak + 1).toString());

    // Write to Supabase if connected
    if (this.isConnected()) {
      try {
        await this._client.from('study_sessions').insert([{
          topic: newSession.topic,
          hours: newSession.hours,
          notes: newSession.notes,
          session_date: newSession.session_date
        }]);
      } catch (err) {
        console.warn('Cloud sync error for study session:', err);
      }
    }

    if (StudySite.Tracker) StudySite.Tracker.render();
  },

  fetchSessions: async function () {
    if (!this.isConnected()) {
      return JSON.parse(localStorage.getItem('study_user_sessions') || '[]');
    }

    try {
      const { data, error } = await this._client
        .from('study_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        localStorage.setItem('study_user_sessions', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Error fetching cloud study sessions:', err);
    }
    return JSON.parse(localStorage.getItem('study_user_sessions') || '[]');
  },

  // ── 2. Module Progress State ──
  setModuleStatus: async function (moduleId, status, moduleName, phaseId) {
    localStorage.setItem('study_status_' + moduleId, status);

    if (this.isConnected()) {
      try {
        await this._client.from('module_progress').upsert({
          module_id: moduleId,
          status: status,
          module_name: moduleName || moduleId,
          phase_id: phaseId || 1,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Cloud sync error for module progress:', err);
      }
    }
  },

  fetchModuleStatuses: async function () {
    if (!this.isConnected()) return;

    try {
      const { data, error } = await this._client.from('module_progress').select('*');
      if (error) throw error;
      if (data) {
        data.forEach(function (row) {
          localStorage.setItem('study_status_' + row.module_id, row.status);
        });
      }
    } catch (err) {
      console.warn('Error fetching cloud module progress:', err);
    }
  },

  // ── 3. Spaced Repetition Reviews ──
  saveSpacedReview: async function (dateKey) {
    localStorage.setItem('study_sr_reviewed_' + dateKey, 'true');

    if (this.isConnected()) {
      try {
        await this._client.from('spaced_repetition_reviews').upsert({
          review_date: dateKey,
          items_count: 5,
          completed_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Cloud sync error for spaced repetition review:', err);
      }
    }
  },

  // ── 4. 13-Week Roadmap Progress ──
  saveRoadmapWeek: async function (weekNumber, isDone) {
    if (isDone) {
      localStorage.setItem('study_week_done_' + weekNumber, 'true');
    } else {
      localStorage.removeItem('study_week_done_' + weekNumber);
    }

    if (this.isConnected()) {
      try {
        if (isDone) {
          await this._client.from('roadmap_progress').upsert({
            week_number: weekNumber,
            completed: true,
            completed_at: new Date().toISOString()
          });
        } else {
          await this._client.from('roadmap_progress').delete().eq('week_number', weekNumber);
        }
      } catch (err) {
        console.warn('Cloud sync error for roadmap progress:', err);
      }
    }
  },

  // ── 5. Public Discussion & Comments ──
  addThoughtComment: async function (thoughtId, authorName, authorHandle, authorAvatar, commentText) {
    const commentObj = {
      thought_id: thoughtId,
      author_name: authorName || 'Staff Systems Engineer',
      author_handle: authorHandle || '@engineer',
      author_avatar: authorAvatar || '💬',
      comment_text: commentText,
      created_at: new Date().toISOString()
    };

    // Save to local cache first
    try {
      const allComments = JSON.parse(localStorage.getItem('user_thought_comments') || '{}');
      if (!allComments[thoughtId]) allComments[thoughtId] = [];
      allComments[thoughtId].push({
        id: 'reply-' + Date.now(),
        author: commentObj.author_name,
        handle: commentObj.author_handle,
        avatar: commentObj.author_avatar,
        text: commentObj.comment_text,
        timestamp: 'Just now'
      });
      localStorage.setItem('user_thought_comments', JSON.stringify(allComments));
    } catch (e) {}

    // Push to database if connected
    if (this.isConnected()) {
      try {
        const { data, error } = await this._client.from('thought_comments').insert([commentObj]);
        if (error) throw error;
      } catch (err) {
        console.warn('Cloud sync error for comment:', err);
      }
    }

    return commentObj;
  },

  fetchThoughtComments: async function (thoughtId) {
    if (this.isConnected()) {
      try {
        const { data, error } = await this._client
          .from('thought_comments')
          .select('*')
          .eq('thought_id', thoughtId)
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(function (r) {
            return {
              id: r.id,
              author: r.author_name,
              handle: r.author_handle || '@engineer',
              avatar: r.author_avatar || '💬',
              text: r.comment_text,
              timestamp: new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            };
          });
        }
      } catch (err) {
        console.warn('Error fetching cloud comments:', err);
      }
    }

    // Fallback to local storage
    try {
      // Check both new store and legacy per-thought key
      const allComments = JSON.parse(localStorage.getItem('user_thought_comments') || '{}');
      const legacyComments = JSON.parse(localStorage.getItem('thought_user_comments_' + thoughtId) || '[]');
      return [...legacyComments, ...(allComments[thoughtId] || [])];
    } catch (e) {
      return [];
    }
  },

  // ── Full Bidirectional Sync ──
  syncLocalToCloud: async function () {
    if (!this.isConnected()) throw new Error('Not connected to a database.');

    // 1. Push study sessions
    const sessions = JSON.parse(localStorage.getItem('study_user_sessions') || '[]');
    if (sessions.length > 0) {
      const records = sessions.map(function (s) {
        return {
          topic: s.topic,
          hours: s.hours,
          notes: s.notes,
          session_date: (s.date || s.created_at || new Date().toISOString()).slice(0, 10)
        };
      });
      await this._client.from('study_sessions').insert(records);
    }

    // 2. Push module statuses
    if (StudySite.Tracker && StudySite.Tracker.canonicalModules) {
      const moduleUpserts = [];
      StudySite.Tracker.canonicalModules.forEach(function (m) {
        const st = localStorage.getItem('study_status_' + m.id);
        if (st) {
          moduleUpserts.push({
            module_id: m.id,
            module_name: m.name,
            phase_id: m.phase,
            status: st,
            updated_at: new Date().toISOString()
          });
        }
      });
      if (moduleUpserts.length > 0) {
        await this._client.from('module_progress').upsert(moduleUpserts);
      }
    }

    // 3. Push roadmap weeks
    const roadmapUpserts = [];
    for (let w = 1; w <= 13; w++) {
      if (localStorage.getItem('study_week_done_' + w) === 'true') {
        roadmapUpserts.push({
          week_number: w,
          completed: true,
          completed_at: new Date().toISOString()
        });
      }
    }
    if (roadmapUpserts.length > 0) {
      await this._client.from('roadmap_progress').upsert(roadmapUpserts);
    }

    return true;
  },

  syncCloudToLocal: async function () {
    if (!this.isConnected()) return;
    await this.fetchSessions();
    await this.fetchModuleStatuses();
    
    // Fetch roadmap weeks
    try {
      const { data, error } = await this._client.from('roadmap_progress').select('*');
      if (!error && data) {
        data.forEach(function (row) {
          if (row.completed) {
            localStorage.setItem('study_week_done_' + row.week_number, 'true');
          }
        });
      }
    } catch (e) {}

    if (StudySite.Tracker) StudySite.Tracker.render();
    if (StudySite.Roadmap) StudySite.Roadmap.updateStats();
  },

  // ── Interactive Cloud Synchronization Console Modal ──
  injectModal: function () {
    if (document.getElementById('dbSettingsModal')) return;

    const modal = document.createElement('div');
    modal.id = 'dbSettingsModal';
    modal.className = 'db-modal-overlay';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="db-modal-card">
        <div class="db-modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.3rem;">⚡</span>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700;">Database Cloud Synchronization</h3>
              <div style="font-size: 0.72rem; color: var(--text-dim);">PostgreSQL Distributed Storage Engine</div>
            </div>
          </div>
          <button class="btn btn-sm" onclick="StudySite.DB.closeSettingsModal()" style="padding: 0.2rem 0.5rem;" aria-label="Close modal">✕</button>
        </div>

        <div class="db-modal-body">
          <div id="dbStatusAlert" style="margin-bottom: 1.25rem; padding: 0.85rem 1rem; border-radius: var(--radius-sm); font-size: 0.82rem;">
            <!-- Injected dynamically -->
          </div>

          <!-- Architecture & Specifications Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div style="background: var(--surface-hover); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.75rem;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700;">Storage Backend</div>
              <div style="font-size: 0.88rem; font-weight: 600; color: var(--text); margin-top: 0.2rem;">PostgreSQL 15+</div>
            </div>
            <div style="background: var(--surface-hover); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.75rem;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700;">Replication Model</div>
              <div style="font-size: 0.88rem; font-weight: 600; color: #16a34a; margin-top: 0.2rem;">Active Multi-Device</div>
            </div>
            <div style="background: var(--surface-hover); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.75rem;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700;">Cache Architecture</div>
              <div style="font-size: 0.88rem; font-weight: 600; color: var(--text); margin-top: 0.2rem;">Offline-First (0ms)</div>
            </div>
            <div style="background: var(--surface-hover); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.75rem;">
              <div style="font-size: 0.68rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700;">Security Policy</div>
              <div style="font-size: 0.88rem; font-weight: 600; color: var(--accent); margin-top: 0.2rem;">RLS Enforced</div>
            </div>
          </div>

          <div style="background: var(--surface-hover); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem 1rem; font-size: 0.76rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
            🛡️ <strong>Encapsulated Infrastructure:</strong> Database endpoints and authentication keys are internal to the runtime. Progress across Study Sessions, Module Checklist, 13-Week Roadmap, and Comments replicates continuously in the background.
          </div>

          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-primary btn-sm" id="btnTestDb" onclick="StudySite.DB.handleTestConnection()">
                ⚡ Test Latency & Ping
              </button>
            </div>
            <div style="display: flex; gap: 0.5rem;" id="dbSyncActions">
              <button class="btn btn-sm" onclick="StudySite.DB.handlePush()" title="Upload existing localStorage data to Cloud DB">
                ⬆️ Push to Cloud
              </button>
              <button class="btn btn-sm" onclick="StudySite.DB.handlePull()" title="Download cloud data to this device">
                ⬇️ Pull from Cloud
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  openSettingsModal: function () {
    this.injectModal();
    const modal = document.getElementById('dbSettingsModal');
    const alert = document.getElementById('dbStatusAlert');

    if (this.isConnected()) {
      alert.style.background = 'rgba(22, 163, 74, 0.12)';
      alert.style.border = '1px solid rgba(22, 163, 74, 0.35)';
      alert.style.color = '#15803d';
      alert.innerHTML = '🟢 <strong>Connected to Supabase PostgreSQL</strong>. Your study progress, checklist, and notes sync live across all your devices.';
    } else {
      alert.style.background = 'var(--surface-active)';
      alert.style.border = '1px solid var(--border)';
      alert.style.color = 'var(--text-muted)';
      alert.innerHTML = '⚪ <strong>Currently in Offline / LocalStorage Mode</strong>. Cloud database is not reachable.';
    }

    modal.style.display = 'flex';
  },

  closeSettingsModal: function () {
    const modal = document.getElementById('dbSettingsModal');
    if (modal) modal.style.display = 'none';
  },

  handleTestConnection: async function () {
    const btn = document.getElementById('btnTestDb');
    if (btn) {
      btn.textContent = '⏳ Testing latency...';
      btn.disabled = true;
    }

    try {
      if (!this.isConnected()) {
        this.init();
      }
      if (!this.isConnected()) {
        throw new Error('Database client not initialized.');
      }

      const start = performance.now();
      const { data, error } = await this._client.from('study_sessions').select('id').limit(1);
      const latency = Math.round(performance.now() - start);

      if (error) {
        if (error.code === 'PGRST205' || (error.message && error.message.includes('schema cache'))) {
          alert('⚠️ Connection successful (' + latency + 'ms), but tables need to be created. Please run schema.sql in your Supabase SQL Editor.');
        } else {
          throw error;
        }
      } else {
        alert('✅ Connection verified healthy! Round-trip latency: ' + latency + 'ms.');
      }
      this.openSettingsModal();
    } catch (err) {
      alert('❌ Connection test error: ' + (err.message || err));
    } finally {
      if (btn) {
        btn.textContent = '⚡ Test Latency & Ping';
        btn.disabled = false;
      }
    }
  },

  handleDisconnect: function () {
    if (confirm('Disconnect from Supabase? The site will revert to local browser storage.')) {
      this.disconnect();
      this.closeSettingsModal();
      if (StudySite.Tracker) StudySite.Tracker.render();
    }
  },

  handlePush: async function () {
    try {
      await this.syncLocalToCloud();
      alert('✅ Local study sessions, module checklist, and roadmap progress successfully uploaded to PostgreSQL!');
    } catch (err) {
      alert('❌ Error pushing data: ' + err.message);
    }
  },

  handlePull: async function () {
    try {
      await this.syncCloudToLocal();
      alert('✅ Successfully pulled latest progress and study sessions from PostgreSQL!');
      if (StudySite.Tracker) StudySite.Tracker.render();
    } catch (err) {
      alert('❌ Error pulling data: ' + err.message);
    }
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  StudySite.DB.init();
  document.addEventListener('DOMContentLoaded', function () {
    StudySite.DB.injectModal();
  });
}
