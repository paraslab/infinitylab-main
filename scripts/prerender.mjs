// scripts/prerender.mjs
// Post-build prerender (Fix 1). Renders each public marketing route with headless
// Chrome and writes static HTML, so crawlers and AI engines (which mostly don't run
// JS) get real headings/text instead of an empty <div id="root">. The client bundle
// still boots and takes over for human visitors.
//
// Runs after `vite build` (see package.json "build"). Best-effort: if Chrome can't
// launch it logs a warning and exits 0 so a deploy never hard-fails on prerender.

import { createServer } from "node:http";
import { readFile, writeFile, stat, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");

// route -> output file (flat, clean URLs; resolved by public/.htaccess)
const ROUTES = {
  "/": "index.html",
  "/about": "about.html",
  "/productpage": "productpage.html",
  "/contact": "contact.html",
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

if (!existsSync(DIST)) {
  console.error("[prerender] dist/ not found — run `vite build` first.");
  process.exit(0);
}

// --- tiny static server for dist/ with SPA fallback ---
const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let filePath = join(DIST, urlPath);
    let st = await stat(filePath).catch(() => null);
    if (st && st.isDirectory()) {
      filePath = join(filePath, "index.html");
      st = await stat(filePath).catch(() => null);
    }
    if (!st) filePath = join(DIST, "index.html"); // SPA fallback
    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(500);
    res.end("error");
  }
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

// --- launch headless Chrome (best-effort) ---
let puppeteer;
try {
  puppeteer = (await import("puppeteer")).default;
} catch {
  console.warn("[prerender] puppeteer not installed — shipping SPA as-is (no prerender).");
  server.close();
  process.exit(0);
}

let browser;
try {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
} catch (e) {
  console.warn("[prerender] could not launch Chrome — shipping SPA as-is:", e.message);
  server.close();
  process.exit(0);
}

let ok = 0;
let failed = 0;
for (const [route, outFile] of Object.entries(ROUTES)) {
  const page = await browser.newPage();
  try {
    await page
      .goto(base + route, { waitUntil: "networkidle2", timeout: 45000 })
      .catch(() => {}); // ignore network-idle timeout; we check the DOM next
    // wait until React has actually rendered into #root
    await page
      .waitForFunction(
        () => {
          const r = document.getElementById("root");
          return r && r.childElementCount > 0;
        },
        { timeout: 20000 }
      )
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 700)); // let react-helmet-async flush <head>
    const html = await page.content();
    await writeFile(join(DIST, outFile), html, "utf8");
    console.log(
      `[prerender] ${route.padEnd(13)} -> ${outFile.padEnd(15)} ${Buffer.byteLength(html)} bytes`
    );
    ok++;
  } catch (e) {
    console.error(`[prerender] FAILED ${route}: ${e.message}`);
    failed++;
  } finally {
    await page.close().catch(() => {});
  }
}

await browser.close().catch(() => {});
server.close();

// make sure the canonical-host/SPA .htaccess ships in dist/ even if Vite skipped the dotfile
try {
  const src = join(PUBLIC, ".htaccess");
  if (existsSync(src)) {
    await copyFile(src, join(DIST, ".htaccess"));
    console.log("[prerender] ensured dist/.htaccess");
  }
} catch {}

console.log(`[prerender] done — ${ok} ok, ${failed} failed.`);
process.exit(0);
