export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const asset = await env.ASSETS.fetch(request);

    if (asset.status === 404) {
      if (!url.pathname.startsWith('/assets/')) {
        const index = await env.ASSETS.fetch('http://fake/index.html');
        return new Response(index.body, {
          status: 200,
          headers: { 'content-type': 'text/html;charset=UTF-8' },
        });
      }
    }

    return asset;
  },
};
