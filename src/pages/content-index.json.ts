// A static, machine-readable index of every publishable page and Library
// item. Two consumers: AI answer engines crawling the site, and — later —
// "The Answer Chat" (see docs/ANSWER-CHAT.md), which will retrieve from
// this file rather than the raw HTML. Prerendered at build time, so it
// always matches what's actually live; nothing here is invented.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import aboutPage from '../../content/pages/about.json';
import homePage from '../../content/pages/home.json';
import btaPage from '../../content/pages/become-the-answer.json';
import workWithMePage from '../../content/pages/work-with-me.json';
import libraryPage from '../../content/pages/library.json';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const base = site!.toString().replace(/\/$/, '');
  const library = await getCollection('library');

  const pages = [
    { url: `${base}/`, title: homePage.seo.title, description: homePage.seo.description },
    { url: `${base}/about`, title: aboutPage.seo.title, description: aboutPage.seo.description },
    { url: `${base}/become-the-answer`, title: btaPage.seo.title, description: btaPage.seo.description },
    { url: `${base}/work-with-me`, title: workWithMePage.seo.title, description: workWithMePage.seo.description },
    { url: `${base}/library`, title: libraryPage.seo.title, description: libraryPage.seo.description },
  ];

  const libraryItems = library.map((item) => ({
    type: item.data.type,
    title: item.data.title,
    description: item.data.description,
    bucket: item.data.bucket ?? null,
    tags: item.data.tags,
    url: item.data.type === 'read' ? `${base}/library/read/${item.id}` : item.data.externalUrl,
    source: item.data.source ?? null,
    publishDate: item.data.publishDate.toISOString().slice(0, 10),
  }));

  const body = JSON.stringify({ pages, libraryItems }, null, 2);

  return new Response(body, {
    headers: { 'Content-Type': 'application/json' },
  });
};
