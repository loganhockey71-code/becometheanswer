import { defineConfig } from 'tinacms';

// TinaCMS schema for Become the Answer.
//
// Design principle (per client request): keep this simple for a non-technical
// editor. Every field is a plain string/text/image with a clear label — no
// nested conditional logic, no dynamic block/template pickers. Home's section
// order and structure are fixed in code; only the content within each section
// is editable here.
//
// This file is functional as soon as a TinaCloud project is connected
// (clientId + token below, via environment variables) — see EDITING.md.

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.HEAD || 'main',
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets/uploads',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'settings',
        label: 'Site Settings',
        path: 'content/settings',
        format: 'json',
        ui: {
          // Singleton: only one settings document, editors shouldn't create more.
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'object',
            name: 'nav',
            label: 'Navigation Links',
            list: true,
            fields: [
              { type: 'string', name: 'label', label: 'Label', required: true },
              { type: 'string', name: 'href', label: 'Link', required: true },
            ],
          },
          {
            type: 'string',
            name: 'registerInterestCtaLabel',
            label: 'Register Interest Button Text',
          },
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              { type: 'string', name: 'privacyHref', label: 'Privacy Policy Link' },
              { type: 'string', name: 'termsHref', label: 'Terms of Service Link' },
            ],
          },
          {
            type: 'object',
            name: 'seoDefaults',
            label: 'Default SEO',
            fields: [
              { type: 'string', name: 'titleTemplate', label: 'Title Template (use %s for page title)' },
              { type: 'string', name: 'defaultDescription', label: 'Default Meta Description', ui: { component: 'textarea' } },
              { type: 'image', name: 'ogImage', label: 'Default Social Share Image' },
            ],
          },
          {
            type: 'object',
            name: 'registerInterestForm',
            label: '"Register Your Interest" Form',
            fields: [
              { type: 'string', name: 'heading', label: 'Form Heading' },
              { type: 'string', name: 'microcopy', label: 'Microcopy Under Heading' },
              {
                type: 'string',
                name: 'formOptions',
                label: 'Dropdown Options ("What prompted you?")',
                list: true,
              },
            ],
          },
        ],
      },
      {
        name: 'home',
        label: 'Home Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'home' },
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'object',
            name: 'seo',
            label: 'SEO',
            fields: [
              { type: 'string', name: 'title', label: 'Page Title' },
              { type: 'string', name: 'description', label: 'Meta Description', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'headline', label: 'Headline', ui: { component: 'textarea' } },
              { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
              { type: 'string', name: 'storyLinkLabel', label: '"Read my story" Link Text' },
              { type: 'string', name: 'storyLinkHref', label: '"Read my story" Link Target' },
              { type: 'string', name: 'ctaLabel', label: 'Primary Button Text' },
            ],
          },
          {
            type: 'object',
            name: 'statBar',
            label: 'Credibility Stats Bar',
            fields: [
              { type: 'string', name: 'note', label: 'Internal Note (not shown on site)' },
              {
                type: 'object',
                name: 'stats',
                label: 'Stats',
                list: true,
                fields: [
                  { type: 'string', name: 'value', label: 'Number / Value' },
                  { type: 'string', name: 'label', label: 'Label' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'bigIdea',
            label: 'Big Idea',
            fields: [
              { type: 'string', name: 'title', label: 'Title', ui: { component: 'textarea' } },
              { type: 'string', name: 'subtitle', label: 'Subtitle', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'ctaHref', label: 'Button Link' },
            ],
          },
          {
            type: 'object',
            name: 'digitalShelf',
            label: 'Impact on the Digital Shelf',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro Text', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'stages',
                label: 'Shelf Stages',
                list: true,
                fields: [
                  { type: 'string', name: 'value', label: 'Number' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'note', label: 'Note (optional)' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'offerRow',
            label: 'Build Your Spot on the AI Shelf',
            fields: [
              {
                type: 'object',
                name: 'items',
                label: 'Offers',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'oneLiner', label: 'One Liner' },
                  { type: 'string', name: 'ctaLabel', label: 'Button Text' },
                  { type: 'string', name: 'ctaHref', label: 'Button Link' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'proofStats',
            label: 'Proof Stats',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Stats',
                list: true,
                fields: [
                  { type: 'string', name: 'stat', label: 'Stat' },
                  { type: 'string', name: 'context', label: 'Context', ui: { component: 'textarea' } },
                  { type: 'string', name: 'sourceLabel', label: 'Source Label' },
                  { type: 'string', name: 'sourceUrl', label: 'Source URL' },
                ],
              },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
            ],
          },
          {
            type: 'object',
            name: 'toolsTable',
            label: 'Curious Where You Stand (Tools)',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'tools',
                label: 'Tools',
                list: true,
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'outcome', label: '"What You Get"' },
                ],
              },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'microcopy', label: 'Microcopy Under Button' },
              { type: 'string', name: 'honestyNote', label: 'Closing Note' },
            ],
          },
          {
            type: 'object',
            name: 'equityTable',
            label: 'Answer Equity',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'dimensions',
                label: 'Dimensions',
                list: true,
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'question', label: 'Question', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'closingCta',
            label: 'Closing CTA',
            fields: [
              { type: 'string', name: 'line', label: 'Line' },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'ctaHref', label: 'Button Link' },
            ],
          },
          {
            type: 'object',
            name: 'bookBand',
            label: 'Become the Answer (Book Band)',
            fields: [
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
              { type: 'string', name: 'microPoints', label: 'Micro Points', list: true },
              { type: 'string', name: 'primaryCtaLabel', label: 'Primary Button Text' },
              { type: 'string', name: 'secondaryCtaLabel', label: 'Secondary Button Text' },
            ],
          },
        ],
      },
    ],
  },
});
