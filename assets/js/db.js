/**
 * StudySite Database Engine
 * Supabase (PostgreSQL) Cloud Sync with automatic offline localStorage fallback
 */

window.StudySite = window.StudySite || {};

StudySite.DB = {
  _client: null,

  init: function () {
    const url = localStorage.getItem('study_supabase_url') || (window.STUDY_CONFIG && window.STUDY_CONFIG.supabaseUrl);
    const key = localStorage.getItem('study_supabase_key') || (window.STUDY_CONFIG && window.STUDY_CONFIG.supabaseKey);

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
    if (error && error.code !== 'PGRST116') {
      throw new Error('Database connection failed: ' + (error.message || JSON.stringify(error)));
    }

    localStorage.setItem('study_supabase_url', url.trim());
    localStorage.setItem('study_supabase_key', key.trim());
    this._client = tempClient;

    // Background pull down to keep local storage in sync
    await this.syncCloudToLocal();
    return true;
  },

  disconnect: function () {
    localStorage.removeItem('study_supabase_url');
    localStorage.removeItem('study_supabase_key');
    this._client = null;
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

  // ── Interactive Cloud Settings Modal ──
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
            <span style="font-size: 1.3rem;">🔌</span>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700;">Database Cloud Sync Settings</h3>
              <div style="font-size: 0.72rem; color: var(--text-dim);">PostgreSQL / Supabase Integration</div>
            </div>
          </div>
          <button class="btn btn-sm" onclick="StudySite.DB.closeSettingsModal()" style="padding: 0.2rem 0.5rem;">✕</button>
        </div>

        <div class="db-modal-body">
          <div id="dbStatusAlert" style="margin-bottom: 1.25rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
            <!-- Injected dynamically -->
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); margin-bottom: 0.35rem;">
              Supabase Project URL
            </label>
            <input type="url" id="inputSupabaseUrl" placeholder="https://xyzcompany.supabase.co" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 0.82rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text);">
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); margin-bottom: 0.35rem;">
              Anon Public API Key
            </label>
            <input type="password" id="inputSupabaseKey" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." style="width: 100%; padding: 0.5rem 0.75rem; font-size: 0.82rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text);">
          </div>

          <div style="background: var(--surface-hover); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem; font-size: 0.75rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
            💡 <strong>Need to create tables?</strong> Run the pre-built <code>schema.sql</code> script in your Supabase SQL editor. It provisions tables for study sessions, module checklist, spaced repetition, and comments with public Row-Level Security (RLS).
          </div>

          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-primary btn-sm" id="btnConnectDb" onclick="StudySite.DB.handleConnect()">
                ⚡ Connect & Sync
              </button>
              <button class="btn btn-sm" id="btnDisconnectDb" onclick="StudySite.DB.handleDisconnect()" style="display: none; color: #ef4444;">
                Disconnect
              </button>
            </div>
            <div style="display: flex; gap: 0.5rem;" id="dbSyncActions" style="display: none;">
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
    const urlInput = document.getElementById('inputSupabaseUrl');
    const keyInput = document.getElementById('inputSupabaseKey');
    const btnDisconnect = document.getElementById('btnDisconnectDb');
    const syncActions = document.getElementById('dbSyncActions');

    urlInput.value = localStorage.getItem('study_supabase_url') || '';
    keyInput.value = localStorage.getItem('study_supabase_key') || '';

    if (this.isConnected()) {
      alert.style.background = 'rgba(22, 163, 74, 0.12)';
      alert.style.border = '1px solid rgba(22, 163, 74, 0.35)';
      alert.style.color = '#15803d';
      alert.innerHTML = '🟢 <strong>Connected to Supabase PostgreSQL</strong>. Your study progress and sessions sync live across all devices.';
      btnDisconnect.style.display = 'inline-flex';
      syncActions.style.display = 'flex';
    } else {
      alert.style.background = 'var(--surface-active)';
      alert.style.border = '1px solid var(--border)';
      alert.style.color = 'var(--text-muted)';
      alert.innerHTML = '⚪ <strong>Currently in Offline / LocalStorage Mode</strong>. Connect Supabase to sync progress across your laptop, desktop, and mobile devices.';
      btnDisconnect.style.display = 'none';
      syncActions.style.display = 'none';
    }

    modal.style.display = 'flex';
  },

  closeSettingsModal: function () {
    const modal = document.getElementById('dbSettingsModal');
    if (modal) modal.style.display = 'none';
  },

  handleConnect: async function () {
    const url = (document.getElementById('inputSupabaseUrl').value || '').trim();
    const key = (document.getElementById('inputSupabaseKey').value || '').trim();
    const btn = document.getElementById('btnConnectDb');

    btn.textContent = '⏳ Testing connection...';
    btn.disabled = true;

    try {
      await this.connect(url, key);
      alert('✅ Connected successfully to Supabase PostgreSQL! Cloud sync is now active.');
      this.closeSettingsModal();
      if (StudySite.Tracker) StudySite.Tracker.render();
    } catch (err) {
      alert('❌ ' + err.message);
    } finally {
      btn.textContent = '⚡ Connect & Sync';
      btn.disabled = false;
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
