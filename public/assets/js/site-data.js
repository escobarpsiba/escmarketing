const SiteData = {
  prefix: 'esc_marketing_',

  get(key) {
    const raw = localStorage.getItem(this.prefix + key);
    return raw ? JSON.parse(raw) : null;
  },

  set(key, val) {
    localStorage.setItem(this.prefix + key, JSON.stringify(val));
  },

  getDefault(key) {
    const defaults = {
      seo: {
        title: 'ESC Marketing And Development | Agência Digital',
        description: 'Profissionais com mais de 15 anos de mercado unidos para criar soluções digitais de alto impacto.',
        ogImage: 'assets/images/logo-esc.png',
        keywords: ''
      },
      social: {
        linkedin: '#',
        instagram: '#',
        facebook: '#',
        twitter: '#',
        youtube: '#'
      },
      contact: {
        email: 'contato@escmarketing.com.br',
        phone: '+55 (11) 99999-9999',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        hours: 'Seg - Sex: 9h às 18h'
      },
      portfolio: [],
      testimonials: [
        { id: 'seed-t-1', name: 'Carlos Andrade', company: 'CEO, TechNova', text: 'A equipe da ESC trouxe uma visão renovada para nossa estratégia digital. A combinação de experiência de mercado com novas abordagens fez toda a diferença nos nossos resultados em apenas alguns meses.', rating: 5, avatar_initials: 'CA' },
        { id: 'seed-t-2', name: 'Juliana Castro', company: 'Diretora de Marketing, BuildPrime', text: 'Desde o primeiro contato, percebemos o nível de profissionalismo da equipe. Entregaram além do combinado, com uma qualidade que raramente encontramos no mercado. Recomendo de olhos fechados.', rating: 5, avatar_initials: 'JC' },
        { id: 'seed-t-3', name: 'Rafael Oliveira', company: 'Founder, CodeLab', text: 'O que mais nos impressionou foi o compromisso com a entrega. Mesmo sendo uma nova agência, o time demonstrou uma maturidade e expertise que nos deixou seguros desde o início. Resultado: projeto entregue no prazo e acima da expectativa.', rating: 5, avatar_initials: 'RO' }
      ]
    };
    return defaults[key] || null;
  },

  getWithFallback(key) {
    return this.get(key) || this.getDefault(key);
  },

  async sbGet(table) {
    try {
      const rows = await supabase.get(table, { select: '*', limit: '1' });
      return rows && rows.length > 0 ? rows[0] : null;
    } catch { return null; }
  },

  async sbSet(table, data) {
    try {
      await supabase.upsert(table, { id: 1, ...data }, 'id');
      return true;
    } catch { return false; }
  },

  async sbList(table) {
    try {
      return await supabase.get(table, { select: '*', order: 'created_at.desc' });
    } catch { return null; }
  },

  async sbGetSeo() {
    const row = await this.sbGet('seo');
    if (row) return { title: row.title, description: row.description, ogImage: row.og_image, keywords: row.keywords || '' };
    return this.getWithFallback('seo');
  },
  async sbSetSeo(d) {
    const ok = await this.sbSet('seo', { title: d.title, description: d.description, og_image: d.ogImage, keywords: d.keywords });
    if (!ok) this.setSeo(d);
  },

  async sbGetSocial() {
    const row = await this.sbGet('social');
    if (row) return { linkedin: row.linkedin, instagram: row.instagram, facebook: row.facebook, twitter: row.twitter, youtube: row.youtube };
    return this.getWithFallback('social');
  },
  async sbSetSocial(d) {
    const ok = await this.sbSet('social', d);
    if (!ok) this.setSocial(d);
  },

  async sbGetContact() {
    const row = await this.sbGet('contact_info');
    if (row) return { email: row.email, phone: row.phone, address: row.address, hours: row.hours };
    return this.getWithFallback('contact');
  },
  async sbSetContact(d) {
    const ok = await this.sbSet('contact_info', d);
    if (!ok) this.setContact(d);
  },

  async sbGetPortfolio() {
    const rows = await this.sbList('portfolio_items');
    if (rows) return rows.map(r => ({ id: r.id, title: r.title, tag: r.tag, description: r.description, result: r.result, image: r.image }));
    return this.getWithFallback('portfolio');
  },
  async sbSetPortfolio(d) {
    const list = this.getWithFallback('portfolio');
    const merged = d.map(item => ({ ...item }));
    this.setPortfolio(merged);
    try {
      await supabase.delete('portfolio_items', 'id', 'neq.none');
      if (d.length > 0) await supabase.post('portfolio_items', d);
    } catch {}
  },
  async sbAddPortfolioItem(item) {
    item.id = Date.now().toString(36);
    try {
      await supabase.post('portfolio_items', item);
    } catch {
      const list = this.getPortfolio();
      list.push(item);
      this.setPortfolio(list);
    }
    return item;
  },
  async sbUpdatePortfolioItem(id, data) {
    try {
      await supabase.patch('portfolio_items', data, 'id', id);
    } catch {
      const list = this.getPortfolio();
      const idx = list.findIndex(i => i.id === id);
      if (idx > -1) { list[idx] = { ...list[idx], ...data }; this.setPortfolio(list); }
    }
  },
  async sbDeletePortfolioItem(id) {
    try {
      await supabase.delete('portfolio_items', 'id', id);
    } catch {
      this.setPortfolio(this.getPortfolio().filter(i => i.id !== id));
    }
  },

  async sbGetMedia() {
    const rows = await this.sbList('media');
    if (rows && rows.length) return rows.map(r => ({ id: r.id, name: r.name, data: r.data }));
    return this.get('media') || [];
  },
  async sbAddMediaItem(item) {
    item.id = Date.now().toString(36);
    delete item.file;

    try {
      await supabase.post('media', item);
    } catch {
      const list = this.getMedia();
      list.unshift(item);
      this.set('media', list);
    }
    return item;
  },
  async sbDeleteMediaItem(id) {
    try {
      await supabase.delete('media', 'id', id);
    } catch {
      this.set('media', this.getMedia().filter(m => m.id !== id));
    }
  },

  async sbGetContacts() {
    const rows = await this.sbList('contacts');
    if (rows) return rows.map(r => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, service: r.service, company: r.company, message: r.message, date: r.date }));
    return this.get('contacts') || [];
  },
  async sbAddContact(d) {
    d.id = Date.now().toString(36);
    d.date = new Date().toISOString();
    try {
      await supabase.post('contacts', d);
    } catch {
      const list = this.getContacts();
      list.unshift(d);
      this.set('contacts', list);
    }
  },
  async sbDeleteContact(id) {
    try {
      await supabase.delete('contacts', 'id', id);
    } catch {
      this.set('contacts', this.getContacts().filter(c => c.id !== id));
    }
  },

  getSeo() { return this.getWithFallback('seo'); },
  setSeo(d) { this.set('seo', d); },

  getSocial() { return this.getWithFallback('social'); },
  setSocial(d) { this.set('social', d); },

  getContact() { return this.getWithFallback('contact'); },
  setContact(d) { this.set('contact', d); },

  getPortfolio() { return this.getWithFallback('portfolio'); },
  setPortfolio(d) { this.set('portfolio', d); },

  addPortfolioItem(item) {
    const list = this.getPortfolio();
    item.id = Date.now().toString(36);
    list.push(item);
    this.setPortfolio(list);
    return item;
  },

  updatePortfolioItem(id, data) {
    const list = this.getPortfolio();
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) { list[idx] = { ...list[idx], ...data }; this.setPortfolio(list); }
  },

  deletePortfolioItem(id) {
    const list = this.getPortfolio().filter(i => i.id !== id);
    this.setPortfolio(list);
  },

  getMedia() { return this.get('media') || []; },
  setMedia(d) { this.set('media', d); },
  addMediaItem(item) {
    const list = this.getMedia();
    item.id = Date.now().toString(36);
    list.unshift(item);
    this.set('media', list);
    return item;
  },
  deleteMediaItem(id) {
    this.set('media', this.getMedia().filter(m => m.id !== id));
  },

  getContacts() { return this.get('contacts') || []; },
  addContact(d) {
    const list = this.getContacts();
    d.id = Date.now().toString(36);
    d.date = new Date().toISOString();
    list.unshift(d);
    this.set('contacts', list);
  },
  deleteContact(id) {
    this.set('contacts', this.getContacts().filter(c => c.id !== id));
  },

  async sbGetBlogPosts(category) {
    const params = { select: '*', order: 'created_at.desc' };
    if (category) params.category = `eq.${category}`;
    try {
      const rows = await supabase.get('blog_posts', params);
      if (rows && rows.length) {
        const localPosts = this.getBlogPosts();
        const merged = rows.map(r => {
          const local = localPosts.find(l => l.id === r.id);
          return { id: r.id, title: r.title, description: r.description, content: r.content, category: r.category, service_slug: r.service_slug, image: r.image, cta_text: local?.cta_text || r.cta_text, cta_url: local?.cta_url || r.cta_url, status: r.status, created_at: r.created_at };
        });
        this.setBlogPosts(merged);
        return merged;
      }
      return this.getBlogPosts();
    } catch { return this.getBlogPosts(); }
  },
  async sbAddBlogPost(item) {
    item.id = Date.now().toString(36);
    item.created_at = new Date().toISOString();
    this.addBlogPost(item);
    supabase.post('blog_posts', { ...item }).catch(() => {});
    return item;
  },
  async sbUpdateBlogPost(id, data) {
    data.updated_at = new Date().toISOString();
    this.updateBlogPost(id, data);
    supabase.patch('blog_posts', { ...data }, 'id', id).catch(e => {
      alert('ERRO Supabase PATCH: ' + e.message);
    });
  },
  async sbDeleteBlogPost(id) {
    const exists = this.getBlogPosts().some(p => p.id === id);
    if (exists) this.deleteBlogPost(id);
    supabase.delete('blog_posts', 'id', id).catch(() => {});
  },

  async sbGetTestimonials() {
    const rows = await this.sbList('testimonials');
    const local = this.get('testimonials') || [];
    if (rows && rows.length) {
      const merged = rows.map(r => {
        const l = local.find(item => item.id === r.id);
        return { id: r.id, name: r.name, company: r.company, text: r.text, rating: r.rating, avatar_initials: l?.avatar_initials || r.avatar_initials };
      });
      const localIds = new Set(merged.map(m => m.id));
      for (const item of local) {
        if (!localIds.has(item.id)) {
          merged.push(item);
          try { await supabase.post('testimonials', { ...item }); } catch {}
        }
      }
      this.setTestimonials(merged);
      return merged;
    }
    if (local.length) {
      for (const item of local) {
        try { await supabase.post('testimonials', { ...item }); } catch {}
      }
      return local;
    }
    return this.getDefault('testimonials');
  },
  async sbAddTestimonial(item) {
    item.id = Date.now().toString(36);
    this.addTestimonial(item);
    try { await supabase.post('testimonials', { ...item }); } catch {}
    return item;
  },
  async sbUpdateTestimonial(id, data) {
    this.updateTestimonial(id, data);
    try { await supabase.patch('testimonials', { ...data }, 'id', id); } catch {}
  },
  async sbDeleteTestimonial(id) {
    this.deleteTestimonial(id);
    try { await supabase.delete('testimonials', 'id', id); } catch {}
  },

  getBlogPosts() { return this.get('blog_posts') || []; },
  setBlogPosts(d) { this.set('blog_posts', d); },
  addBlogPost(item) {
    const list = this.getBlogPosts();
    if (!item.id) item.id = Date.now().toString(36);
    if (!item.created_at) item.created_at = new Date().toISOString();
    list.unshift(item);
    this.set('blog_posts', list);
    return item;
  },
  updateBlogPost(id, data) {
    data.updated_at = new Date().toISOString();
    const list = this.getBlogPosts();
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...data };
    } else {
      data.id = id;
      data.created_at = data.created_at || new Date().toISOString();
      list.unshift(data);
    }
    this.set('blog_posts', list);
  },
  deleteBlogPost(id) {
    this.set('blog_posts', this.getBlogPosts().filter(p => p.id !== id));
  },

  getTestimonials() { return this.getWithFallback('testimonials'); },
  setTestimonials(d) { this.set('testimonials', d); },
  addTestimonial(item) {
    const list = this.getTestimonials();
    if (!item.id) item.id = Date.now().toString(36);
    list.unshift(item);
    this.set('testimonials', list);
    return item;
  },
  updateTestimonial(id, data) {
    const list = this.getTestimonials();
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) { list[idx] = { ...list[idx], ...data }; this.set('testimonials', list); }
  },
  deleteTestimonial(id) {
    this.set('testimonials', this.getTestimonials().filter(t => t.id !== id));
  }
};
