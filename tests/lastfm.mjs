import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../workers/lastfm/worker.mjs";

test("Worker: segredo, normalização, cache e falhas", async () => {
  const originalFetch = globalThis.fetch;
  const originalCaches = globalThis.caches;
  const stored = new Map();
  globalThis.caches = { default: {
    match: async key => stored.get(key.url)?.clone(),
    put: async (key, response) => { stored.set(key.url, response); }
  } };
  const env = { LASTFM_API_KEY: "test-secret", LASTFM_USERNAME: "Victivus", ALLOWED_ORIGIN: "https://v2power.github.io" };
  const pending = [];
  const ctx = { waitUntil: promise => pending.push(promise) };
  const request = (path = "/now-playing", method = "GET") => new Request(`https://test.workers.dev${path}`, { method });
  let calls = 0;
  globalThis.fetch = async url => {
    calls++;
    assert.equal(url.searchParams.get("user"), "Victivus");
    assert.equal(url.searchParams.get("api_key"), "test-secret");
    return Response.json({ recenttracks: { track: [{ name: "Song", artist: { "#text": "Artist" },
      url: "https://www.last.fm/music/Artist/_/Song", image: [], "@attr": { nowplaying: "true" } }] } });
  };
  try {
    assert.equal((await worker.fetch(request("/"), env, ctx)).status, 404);
    assert.equal((await worker.fetch(request("/now-playing", "POST"), env, ctx)).status, 405);
    assert.equal((await worker.fetch(request(), {}, ctx)).status, 503);
    const response = await worker.fetch(request("/now-playing?user=other"), env, ctx);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), env.ALLOWED_ORIGIN);
    const body = await response.text();
    assert.ok(!body.includes("test-secret"));
    assert.equal(JSON.parse(body).track.nowPlaying, true);
    assert.equal(JSON.parse(body).track.cover, null);
    await Promise.all(pending);
    await worker.fetch(request(), env, ctx);
    assert.equal(calls, 1);
    stored.clear();
    globalThis.fetch = async () => Response.json({ recenttracks: { track: [{ name: "Old", artist: {}, url: "javascript:alert(1)", date: { uts: "1000" }, "@attr": { nowplaying: "false" } }] } });
    const old = await (await worker.fetch(request(), env, ctx)).json();
    assert.equal(old.track.nowPlaying, false);
    assert.equal(old.track.playedAt, 1000);
    assert.equal(old.track.url, null);
    stored.clear();
    globalThis.fetch = async () => Response.json({ recenttracks: { track: [] } });
    assert.equal((await (await worker.fetch(request(), env, ctx)).json()).track, null);
    stored.clear();
    globalThis.fetch = async () => Response.json({ error: 10, message: "test-secret" });
    const failed = await worker.fetch(request(), env, ctx);
    assert.equal(failed.status, 502);
    assert.ok(!(await failed.text()).includes("test-secret"));
    globalThis.fetch = async () => { throw new Error("test-secret"); };
    assert.equal((await worker.fetch(request(), env, ctx)).status, 502);
  } finally { globalThis.fetch = originalFetch; globalThis.caches = originalCaches; }
});
