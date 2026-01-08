import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function GET() {
  // Add your public routes here. Exclude /dashboard intentionally.
  const routes = ["/", "/auth/login", "/auth/register", "/about", "/examples"];

  const base = SITE_URL || "";
  const items = routes
    .map((route) => {
      const url = base ? `${base.replace(/\/$/, "")}${route}` : route;
      return `  <url><loc>${url}</loc></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
