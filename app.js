(() => {
  'use strict';

  const statusEl = document.getElementById('status');
  const detailEl = document.getElementById('detail');
  const timeEl = document.getElementById('time');

  function setStatus(type, title, detail) {
    statusEl.className = `status ${type}`;
    statusEl.textContent = title;
    detailEl.textContent = detail;
  }

  async function testSupabase() {
    const started = performance.now();

    try {
      if (!window.HIS_CONFIG?.supabaseUrl || !window.HIS_CONFIG?.supabasePublishableKey) {
        throw new Error('Supabase yapılandırması eksik.');
      }

      const { createClient } = window.supabase;
      const client = createClient(
        window.HIS_CONFIG.supabaseUrl,
        window.HIS_CONFIG.supabasePublishableKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      );

      const { error } = await client.auth.getSession();
      const elapsed = Math.round(performance.now() - started);
      timeEl.textContent = `${elapsed} ms`;

      if (error) {
        throw error;
      }

      setStatus('ok', 'BAĞLANTI AKTİF', 'HIS-Finans-V4 Supabase projesine erişim doğrulandı. Henüz hiçbir finans tablosuna dokunulmadı.');
    } catch (error) {
      const elapsed = Math.round(performance.now() - started);
      timeEl.textContent = `${elapsed} ms`;
      console.error('HIS Finans bağlantı testi:', error);
      setStatus('error', 'BAĞLANTI HATASI', error?.message || String(error));
    }
  }

  document.getElementById('retry').addEventListener('click', testSupabase);
  testSupabase();
})();
