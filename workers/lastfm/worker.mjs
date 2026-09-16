// Configure LASTFM_API_KEY como Secret no Cloudflare, nunca neste arquivo.
export default {
  async fetch(request, env, ctx) {
    const headers = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "https://v2power.github.io",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    };
    const reply = (data, status = 200) => Response.json(data, { status, headers });
    const url = new URL(request.url);
    if (url.pathname !== "/now-playing") return reply({ error: "Not found" }, 404);
    if (request.method !== "GET") return new Response(null, { status: 405, headers: { ...headers, Allow: "GET" } });
    if (!env.LASTFM_API_KEY || !env.LASTFM_USERNAME) return reply({ error: "Not configured" }, 503);

    // Ignore parâmetros enviados por visitantes: este endpoint só consulta seu perfil.
    const cacheUrl = new URL("/now-playing", url.origin);
    cacheUrl.searchParams.set("user", env.LASTFM_USERNAME);
    const cacheKey = new Request(cacheUrl);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return new Response(cached.body, { headers });

    try {
      const upstream = new URL("https://ws.audioscrobbler.com/2.0/");
      upstream.search = new URLSearchParams({ method: "user.getrecenttracks", format: "json",
        api_key: env.LASTFM_API_KEY, user: env.LASTFM_USERNAME, limit: "1" }).toString();
      const response = await fetch(upstream, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error("Upstream unavailable");
      const data = await response.json();
      if (data.error || !data.recenttracks || !Array.isArray(data.recenttracks.track)) throw new Error("Invalid upstream response");
      const track = data.recenttracks.track[0];
      const safeUrl = value => {
        try { const parsed = new URL(value); return parsed.protocol === "https:" ? parsed.href : null; }
        catch { return null; }
      };
      const result = { track: track ? {
        name: track.name,
        artist: track.artist?.["#text"] || "",
        url: safeUrl(track.url),
        cover: safeUrl([...(track.image || [])].reverse().find(image => image["#text"])?.["#text"]),
        nowPlaying: track["@attr"]?.nowplaying === "true",
        playedAt: track.date?.uts ? Number(track.date.uts) : null
      } : null, profile: `https://www.last.fm/user/${encodeURIComponent(env.LASTFM_USERNAME)}` };
      const stored = Response.json(result, { headers: { "Cache-Control": "public, max-age=30" } });
      ctx.waitUntil(cache.put(cacheKey, stored).catch(() => {}));
      return reply(result);
    } catch {
      // Não devolva erros brutos do Last.fm nem URLs que contenham a chave.
      return reply({ error: "Last.fm unavailable" }, 502);
    }
  }
};
