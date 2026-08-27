import { getCollection, type CollectionEntry } from 'astro:content';

export type LibraryEntry = CollectionEntry<'library'>;

export async function getLibraryItems(type?: LibraryEntry['data']['type']) {
  const all = await getCollection('library');
  const filtered = type ? all.filter((item) => item.data.type === type) : all;
  return filtered.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
}

export function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatDate(date: Date): string {
  // Dates in frontmatter are date-only (no time), parsed as UTC midnight.
  // Formatting in the viewer's local timezone can shift it back a day west
  // of UTC, so format in UTC to keep the date exactly as authored.
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
