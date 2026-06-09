const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gqfdwmcrdzccdfvmidod.supabase.co';
const ANON_KEY = process.env.ANON_KEY || 'sb_publishable_hL8EFUjuFlN2rPLO1ExO2A_UOuCHSFi';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ status: 'error', error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/keepalive_ping`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase RPC failed: ${response.status} ${text}`);
    }

    const timestamp = await response.json();
    console.log('[keepalive] Database ping recorded at', timestamp);

    return res.status(200).json({ status: 'ok', timestamp });
  } catch (err) {
    console.error('[keepalive] Error:', err.message);
    return res.status(500).json({ status: 'error', error: err.message });
  }
};
