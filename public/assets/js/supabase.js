const supabase = {
  url: 'https://gqfdwmcrdzccdfvmidod.supabase.co',
  anonKey: 'sb_publishable_hL8EFUjuFlN2rPLO1ExO2A_UOuCHSFi',

  async request(method, table, options = {}) {
    const { headers: extraHeaders, body, params } = options;
    let path = `${this.url}/rest/v1/${table}`;
    if (params) path += '?' + new URLSearchParams(params).toString();
    const res = await fetch(path, {
      method,
      headers: {
        'apikey': this.anonKey,
        'Authorization': `Bearer ${this.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...extraHeaders
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`Supabase ${method} ${table}: ${res.status} ${res.statusText}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  },

  get(table, params) { return this.request('GET', table, { params }); },
  post(table, body) { return this.request('POST', table, { body }); },
  patch(table, body, idColumn, idValue) {
    const params = { [idColumn]: `eq.${idValue}` };
    return this.request('PATCH', table, { body, params });
  },
  delete(table, idColumn, idValue) {
    const params = { [idColumn]: `eq.${idValue}` };
    return this.request('DELETE', table, { params });
  },

  async upsert(table, body, onConflict) {
    const params = onConflict ? { on_conflict: onConflict } : undefined;
    return this.request('POST', table, { body, params, headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' } });
  },

  async ensureBucket(name) {
    try {
      await this.request('POST', 'rpc/ensure_image_bucket', { body: {} });
    } catch { /* RPC not available yet */ }
  },

  async _storageUpload(endpoint, bucket, path, file) {
    const res = await fetch(`${this.url}/storage/v1/${endpoint}/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        'apikey': this.anonKey,
        'Authorization': `Bearer ${this.anonKey}`,
        'Content-Type': file.type || 'application/octet-stream',
        'x-upsert': 'true'
      },
      body: file
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${endpoint} (${res.status}): ${text}`);
    }
  },

  async uploadImage(bucket, path, file) {
    await this.ensureBucket(bucket);
    const publicUrl = `${this.url}/storage/v1/object/public/${bucket}/${path}`;
    let lastErr;
    for (const ep of ['object', 'upload']) {
      try {
        await this._storageUpload(ep, bucket, path, file);
        return publicUrl;
      } catch (err) {
        lastErr = err;
      }
    }
    throw new Error(`Upload para o Supabase Storage falhou após 2 tentativas. ` +
      `Verifique se o bucket "${bucket}" existe e as políticas RLS estão configuradas. ` +
      `Detalhes: ${lastErr.message}`);
  },

  async isAvailable() {
    try {
      await this.get('seo', { select: 'id', limit: '1' });
      return true;
    } catch {
      return false;
    }
  }
};
