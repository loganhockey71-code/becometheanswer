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

// Four Read articles have no supplied diagram (only the AEO/SEO topics came
// with bespoke data-viz PNGs). Rather than force an unrelated stock image
// onto them, they get a typographic quote card in the same visual language
// as the real diagrams (see ArticleQuoteCard.astro) — built from a line the
// article itself makes, not decoration bolted on.
export const ARTICLE_QUOTE_CARDS: Record<
  string,
  { eyebrow: string; line1: string; line2: string; subhead: string }
> = {
  'how-ai-changed-buying-decisions': {
    eyebrow: 'The shift',
    line1: 'The buyer stopped researching.',
    line2: 'Now they just ask.',
    subhead: "The decision moves inside a single AI conversation you'll never see.",
  },
  'why-people-trust-ai-recommendations': {
    eyebrow: 'The trust',
    line1: "It isn't a new kind of trust.",
    line2: 'It is word of mouth, at scale.',
    subhead: 'Four qualities make an AI recommendation feel like advice, not marketing.',
  },
  'marketing-funnel-in-the-age-of-ai': {
    eyebrow: 'The funnel',
    line1: "The funnel didn't disappear.",
    line2: 'It collapsed into one moment.',
    subhead: 'And most of that moment is dark to your analytics.',
  },
  'cost-of-ai-invisibility': {
    eyebrow: 'The cost',
    line1: "Invisible isn't the same",
    line2: 'as free.',
    subhead: 'Every category question AI answers without you is a sale you never saw.',
  },
};
