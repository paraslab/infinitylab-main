import puppeteer from "puppeteer";
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(__dirname, "../dist");
const SITE_URL = "https://www.infinityenergy.xyz";
const API_BASE = "https://backend.infinityenergy.xyz/api";
const PORT = 3737;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url.split("?")[0];
      let filePath = join(distDir, url === "/" ? "index.html" : url);

      if (!existsSync(filePath) || extname(filePath) === "") {
        if (existsSync(filePath + ".html")) {
          filePath = filePath + ".html";
        } else {
          filePath = join(distDir, "index.html");
        }
      }

      if (existsSync(filePath)) {
        res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
        createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function fetchBlogSlugs() {
  const slugs = [];
  let page = 1;
  try {
    while (true) {
      const res = await fetch(`${API_BASE}/blogs?page=${page}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) break;
      const json = await res.json();
      const posts = json?.data?.data || json?.data || [];
      if (!Array.isArray(posts) || posts.length === 0) break;
      for (const post of posts) {
        if (post.slug) slugs.push(post.slug);
      }
      const lastPage = json?.data?.last_page ?? json?.last_page ?? 1;
      if (page >= lastPage) break;
      page++;
    }
  } catch (err) {
    console.warn("  Could not fetch blog list:", err.message);
  }
  return slugs;
}

async function fetchProductSlugs() {
  const slugs = [];
  let page = 1;
  try {
    while (true) {
      const res = await fetch(`${API_BASE}/products?page=${page}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) break;
      const json = await res.json();
      const items = json?.data?.data || json?.data || [];
      if (!Array.isArray(items) || items.length === 0) break;
      for (const item of items) {
        if (item.slug) slugs.push(item.slug);
      }
      const lastPage = json?.data?.last_page ?? json?.last_page ?? 1;
      if (page >= lastPage) break;
      page++;
    }
  } catch (err) {
    console.warn("  Could not fetch product list:", err.message);
  }
  return slugs;
}

function generateSitemap(routes) {
  const now = new Date().toISOString().split("T")[0];
  const urls = routes
    .map((r) => `  <url>\n    <loc>${SITE_URL}${r}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function prerender() {
  if (!existsSync(distDir)) {
    console.error("dist/ not found — run vite build first");
    process.exit(1);
  }

  const staticRoutes = [
    "/",
    "/about",
    "/productpage",
    "/contact",
    "/blog",
    "/Technology",
    "/solutions/island-mode",
    "/solutions/hybrid-mode",
    "/solutions/microgrid-mode",
  ];

  console.log("Fetching blog slugs from API...");
  const blogSlugs = await fetchBlogSlugs();
  console.log(`  Found ${blogSlugs.length} blog post(s)`);

  const blogRoutes = blogSlugs.map((s) => `/blog/${s}`);

  console.log("Fetching product slugs from API...");
  const productSlugs = await fetchProductSlugs();
  console.log(`  Found ${productSlugs.length} product(s)`);
  const productRoutes = productSlugs.map((s) => `/shop/${s}`);

  const allRoutes = [...staticRoutes, ...blogRoutes, ...productRoutes];

  const server = await startServer();
  console.log(`Static server started on port ${PORT}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    for (const route of allRoutes) {
      try {
        process.stdout.write(`Prerendering ${route} ... `);
        const page = await browser.newPage();
        await page.setUserAgent("Prerenderer/1.0");
        await page.goto(`http://127.0.0.1:${PORT}${route}`, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });
        await new Promise((r) => setTimeout(r, 300));

        const html = await page.content();
        await page.close();

        let outPath;
        if (route === "/") {
          outPath = join(distDir, "index.html");
        } else if (route === "/blog") {
          // /blog has child /blog/<slug> pages, so write it as a directory
          // index — otherwise the blog/ dir has no index and .htaccess (which
          // serves directories before checking .html) would 403 on /blog.
          if (!existsSync(join(distDir, "blog"))) mkdirSync(join(distDir, "blog"), { recursive: true });
          outPath = join(distDir, "blog", "index.html");
        } else {
          const parts = route.replace(/^\//, "").split("/");
          if (parts.length === 1) {
            outPath = join(distDir, parts[0] + ".html");
          } else {
            const dir = join(distDir, ...parts.slice(0, -1));
            if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
            outPath = join(distDir, ...parts.slice(0, -1), parts[parts.length - 1] + ".html");
          }
        }

        writeFileSync(outPath, html, "utf-8");
        console.log(`${(html.length / 1024).toFixed(1)} KB`);
      } catch (err) {
        console.log(`SKIPPED (${err.message})`);
      }
    }

    writeFileSync(join(distDir, "sitemap.xml"), generateSitemap(allRoutes), "utf-8");
    console.log(`\nSitemap updated: ${allRoutes.length} URLs`);
  } finally {
    if (browser) await browser.close();
    server.close();
    console.log("Prerender complete.");
  }
}

prerender();
