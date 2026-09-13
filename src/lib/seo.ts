// Structured-data builders. Every field here reflects something actually
// true of the site and content — no invented review counts, ratings, or
// FAQ entries. Astro.site (set in astro.config.mjs) is the single source
// for the canonical origin, so these never hardcode a domain.

const SITE_NAME = 'Become the Answer';
const FOUNDER_NAME = 'Bjorn Vandemeulebroucke';
const FOUNDER_JOB_TITLE = 'Managing Partner, Word of Mouth Agency — Author of Become the Answer';

export function organizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: new URL('/logo.png', siteUrl).toString(),
    founder: {
      '@type': 'Person',
      name: FOUNDER_NAME,
      jobTitle: FOUNDER_JOB_TITLE,
    },
  };
}

export function websiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
  };
}

export function personSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: FOUNDER_NAME,
    jobTitle: FOUNDER_JOB_TITLE,
    url: new URL('/about', siteUrl).toString(),
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}

export function breadcrumbSchema(siteUrl: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}

export function articleSchema(
  siteUrl: string,
  options: {
    headline: string;
    description: string;
    path: string;
    datePublished: Date;
    dateModified?: Date;
    image?: string;
  },
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    mainEntityOfPage: new URL(options.path, siteUrl).toString(),
    url: new URL(options.path, siteUrl).toString(),
    datePublished: options.datePublished.toISOString().slice(0, 10),
    dateModified: (options.dateModified ?? options.datePublished).toISOString().slice(0, 10),
    image: options.image ? new URL(options.image, siteUrl).toString() : undefined,
    author: {
      '@type': 'Person',
      name: FOUNDER_NAME,
      url: new URL('/about', siteUrl).toString(),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: new URL('/logo.png', siteUrl).toString(),
      },
    },
  };
}

export function definedTermSetSchema(
  siteUrl: string,
  path: string,
  terms: { name: string; slug: string; definition: string }[],
) {
  const pageUrl = new URL(path, siteUrl).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'AEO Glossary',
    url: pageUrl,
    hasDefinedTerm: terms.map((term) => ({
      '@type': 'DefinedTerm',
      name: term.name,
      description: term.definition,
      url: `${pageUrl}#${term.slug}`,
      inDefinedTermSet: pageUrl,
    })),
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
