(() => {
  const card = document.querySelector("#lastfm");
  const endpoint = window.lastfmEndpoint;
  if (!card || !endpoint) return;
  let result = null;
  let state = "loading";
  let pending = false;
  let lastAttempt = 0;
  const strings = {
    pt: { loading: "Buscando música…", error: "Last.fm indisponível no momento", empty: "Nenhuma música recente", playing: "Ouvindo agora", recent: "Última música ouvida" },
    en: { loading: "Loading music…", error: "Last.fm is currently unavailable", empty: "No recent tracks", playing: "Now playing", recent: "Last played" }
  };
  function safeUrl(value) {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; }
    catch { return null; }
  }
  function render() {
    const locale = document.documentElement.lang.startsWith("pt") ? "pt" : "en";
    const text = strings[locale];
    card.hidden = false;
    card.replaceChildren();
    const body = document.createElement("div");
    body.className = "lastfm-body";
    const status = document.createElement("span");
    status.className = "lastfm-status";
    const track = state === "ready" ? result?.track : null;
    card.classList.toggle("is-playing", !!track?.nowPlaying);
    if (track) {
      const backdrop = document.createElement("span");
      backdrop.className = "lastfm-backdrop";
      backdrop.setAttribute("aria-hidden", "true");
      for (let bar = 0; bar < 14; bar++) {
        const line = document.createElement("i");
        line.style.setProperty("--bar-height", `${30 + (bar * 23 % 65)}%`);
        line.style.setProperty("--bar-duration", `${2 + (bar % 5) * .35}s`);
        line.style.setProperty("--bar-delay", `${-bar * .37}s`);
        backdrop.append(line);
      }
      card.append(backdrop);
    }
    status.textContent = `Last.fm · ${track ? (track.nowPlaying ? text.playing : text.recent) : text[state === "ready" ? "empty" : state]}`;
    if (track?.nowPlaying) {
      const equalizer = document.createElement("span");
      equalizer.className = "lastfm-equalizer";
      equalizer.setAttribute("aria-hidden", "true");
      for (let bar = 0; bar < 3; bar++) equalizer.append(document.createElement("i"));
      status.prepend(equalizer);
    }
    body.append(status);
    if (track) {
      const cover = safeUrl(track.cover);
      if (cover) {
        const img = document.createElement("img");
        img.src = cover; img.alt = ""; img.width = 88; img.height = 88;
        img.addEventListener("error", () => img.remove(), { once: true });
        card.append(img);
      }
      const href = safeUrl(track.url) || safeUrl(result.profile);
      const title = document.createElement(href ? "a" : "span");
      title.className = "lastfm-track";
      title.textContent = track.name;
      title.title = track.name;
      if (href) { title.href = href; title.target = "_blank"; title.rel = "noopener noreferrer"; }
      const artist = document.createElement("span");
      artist.className = "lastfm-artist"; artist.textContent = track.artist;
      artist.title = track.artist;
      body.append(title, artist);
      if (!track.nowPlaying && Number.isFinite(track.playedAt) && track.playedAt > 0) {
        const time = document.createElement("time");
        const elapsed = Math.max(0, Math.floor(Date.now() / 1000 - track.playedAt));
        const unit = elapsed < 3600 ? "minute" : elapsed < 86400 ? "hour" : "day";
        const divisor = unit === "minute" ? 60 : unit === "hour" ? 3600 : 86400;
        time.dateTime = new Date(track.playedAt * 1000).toISOString();
        time.textContent = new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(-Math.floor(elapsed / divisor), unit);
        body.append(time);
      }
    }
    card.append(body);
  }
  async function refresh() {
    if (document.hidden || pending || Date.now() - lastAttempt < 60000) return;
    pending = true; lastAttempt = Date.now();
    try {
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(10000), credentials: "omit" });
      if (!response.ok) throw new Error("Unavailable");
      result = await response.json();
      if (!result || !("track" in result)) throw new Error("Invalid response");
      state = "ready";
    } catch { state = "error"; result = null; }
    finally { pending = false; render(); }
  }
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  document.addEventListener("visibilitychange", refresh);
  render(); refresh(); setInterval(refresh, 60000);
})();
