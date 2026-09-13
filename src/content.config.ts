import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The five fixed content pillars from the Library blueprint. Fixed in code
// (not editable in Tina) because the hub page's bucket explainer section
// and its per-bucket CTA copy are written against this exact list.
export const LIBRARY_BUCKETS = [
  'AEO Foundations',
  'How Engines Choose',
  'The Raw Material',
  'Measurement',
  'Field Notes & Playbooks',
] as const;

const library = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/library' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['read', 'watch', 'listen']),
    description: z.string(),
    image: z.string().optional(),
    bucket: z.enum(LIBRARY_BUCKETS).optional(),
    tags: z.array(z.string()).default([]),
    externalUrl: z.string().optional(),
    source: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    // Optional AEO cross-linking: slugs of other 'read' items this article
    // relates to, and one natural follow-up question AI engines are likely
    // to ask right after this article's own headline question.
    relatedSlugs: z.array(z.string()).default([]),
    followUpQuestion: z
      .object({ question: z.string(), answer: z.string() })
      .optional(),
  }),
});

export const collections = { library };
