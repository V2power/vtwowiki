// Prévia local com proxy de leitura do endpoint público. Não precisa de API key.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".md": "text/plain" };
const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== "GET") { res.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname === "/api/lastfm") {
      const response = await fetch("https://lastfm.vitor5088.workers.dev/now-playing", { signal: AbortSignal.timeout(10000) });
      res.writeHead(response.status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      res.end(await response.text()); return;
    }
    if (pathname === "/data/lastfm.js") {
      res.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-store" });
      res.end('window.lastfmEndpoint = "/api/lastfm";'); return;
    }
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const target = path.resolve(root, relative);
    const within = path.relative(root, target);
    if (within.startsWith("..") || path.isAbsolute(within) || within.split(/[\\/]/).some(part => part.startsWith("."))) {
      res.writeHead(403).end(); return;
    }
    const content = await readFile(target);
    res.writeHead(200, { "Content-Type": `${mime[path.extname(target)] || "application/octet-stream"}; charset=utf-8`, "Cache-Control": "no-store" });
    res.end(content);
  } catch { res.writeHead(502, { "Content-Type": "text/plain" }).end("Preview request failed"); }
});
server.listen(4174, "127.0.0.1", () => console.log("Preview: http://127.0.0.1:4174"));
