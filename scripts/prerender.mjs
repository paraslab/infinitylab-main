// scripts/prerender.mjs
// Post-build prerender (Fix 1, + blog). Renders the public marketing routes AND
// every published blog post with headless Chrome and writes static HTML, so
// crawlers and AI engines (which mostly don't run JS) get real headings/text
// instead of an empty <div id="root">. The client bundle still boots and takes
// over for human visitors. Also regenerates dist/sitemap.xml from the live posts.
//
// Runs after `vite build` (see package.json "build"). Best-effort: if Chrome can't
// launch it logs a warning and exits 0 so a deploy never hard-fails on prerender.

import { createServer } from "node:http";
import { readFile, writeFile, stat, copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const PUBLIC = join(ROOT, "public");

const SITE = "https://www.infinityenergy.xyz";
const API_BASE = process.env.PRERENDER_API_BASE || "https://backend.infinityenergy.xyz";

// Static public routes -> output file (flat; resolved by public/.htaccess)
const STATIC_ROUTES = [
  { route: "/", out: "index.html", priority: "1.0", changefreq: "weekly" },
  { route: "/about", out: "about.html", priority: "0.8", changefreq: "monthly" },
  { route: "/productpage", out: "productpage.html", priority: "0.9", changefreq: "weekly" },
  { route: "/contact", out: "contact.html", priority: "0.6", changefreq: "yearly" },
];

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

// --- discover published blog posts from the backend (paginated) ---
async function fetchBlogPosts() {
  const posts = [];
  try {
    let page = 1;
    let last = 1;
    do {
      const res = await fetch(`${API_BASE}/api/blogs?page=${page}`, {
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) break;
      const json = await res.json();
      const p = (json && json.data) || {};
      last = p.last_page || 1;
      for (const b of p.data || []) {
        if (b && b.slug) {
          posts.push({
            slug: b.slug,
            lastmod: String(b.updated_at || b.created_at || "").slice(0, 10),
          });
        }
      }
      page++;
    } while (page <= last);
  } catch (e) {
    console.warn("[prerender] blog list fetch failed — prerendering without blog posts:", e.message);
  }
  return posts;
}

const blogPosts = await fetchBlogPosts();
console.log(`[prerender] discovered ${blogPosts.length} blog posts`);

// Full render list: marketing routes + /blog listing + each post
const renderList = STATIC_ROUTES.map((r) => ({ route: r.route, out: r.out }));
renderList.push({ route: "/blog", out: join("blog", "index.html") });
for (const post of blogPosts) {
  renderList.push({ route: `/blog/${post.slug}`, out: join("blog", `${post.slug}.html`) });
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
for (const { route, out } of renderList) {
  const page = await browser.newPage();
  try {
    await page
      .goto(base + route, { waitUntil: "networkidle2", timeout: 45000 })
      .catch(() => {}); // ignore network-idle timeout; we check the DOM next
    // wait until React has rendered real content (not just the toaster/loader)
    await page
      .waitForFunction(
        () => {
          const r = document.getElementById("root");
          return r && r.innerText && r.innerText.trim().length > 400;
        },
        { timeout: 20000 }
      )
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 700)); // let react-helmet-async flush <head>
    const html = await page.content();
    const dest = join(DIST, out);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, html, "utf8");
    console.log(`[prerender] ${route.padEnd(44)} -> ${String(out).padEnd(26)} ${Buffer.byteLength(html)} bytes`);
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

// --- regenerate sitemap.xml (marketing + blog) ---
try {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_ROUTES.map((r) => ({
      loc: r.route === "/" ? `${SITE}/` : `${SITE}${r.route}`,
      lastmod: today,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    { loc: `${SITE}/blog`, lastmod: today, changefreq: "weekly", priority: "0.7" },
    ...blogPosts.map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      lastmod: p.lastmod || today,
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;
  await writeFile(join(DIST, "sitemap.xml"), xml, "utf8");
  console.log(`[prerender] wrote sitemap.xml (${urls.length} urls)`);
} catch (e) {
  console.warn("[prerender] sitemap generation failed:", e.message);
}

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
