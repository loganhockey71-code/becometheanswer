import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const STATIC_PATHS = [
  '/',
  '/about',
  '/become-the-answer',
  '/work-with-me',
  '/library',
  '/library/watch',
  '/library/listen',
  '/library/read',
  '/privacy-policy',
  '/terms-of-service',
];

export const GET: APIRoute = async ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const library = await getCollection('library');
  const readSlugs = library.filter((item) => item.data.type === 'read').map((item) => `/library/read/${item.id}`);

  const urls = [...STATIC_PATHS, ...readSlugs];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url>\n    <loc>${base}${path}</loc>\n  </url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
