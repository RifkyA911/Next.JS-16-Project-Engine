import { NextResponse } from "next/server";

export async function GET() {
  // Add your public routes here. Exclude /dashboard intentionally.
  const routes = ["", "/auth/login", "/auth/register", "/auth/forgot-password"];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const items = routes
    .map((route) => {
      const url = `${baseUrl.replace(/\/$/, "")}${route}`;
      const priority = route === "" ? "1.0" : "0.8";
      const changefreq = route === "" ? "weekly" : "monthly";

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
