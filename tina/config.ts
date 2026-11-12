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

// Shared field set for each entry under settings.leadForms — copy only
// (heading/microcopy/labels). The fields those forms actually collect are
// fixed in src/lib/leadForms.ts, not editable here, on purpose.
function leadFormCopyFields(options: { withMessageLabel?: boolean } = {}) {
  const fields = [
    { type: 'string' as const, name: 'heading', label: 'Heading' },
    { type: 'string' as const, name: 'microcopy', label: 'Microcopy Under Heading' },
    { type: 'string' as const, name: 'submitLabel', label: 'Submit Button Text' },
    { type: 'string' as const, name: 'successMessage', label: 'Success Message' },
  ];
  if (options.withMessageLabel) {
    fields.push({ type: 'string' as const, name: 'messageLabel', label: 'Message Field Label' });
  }
  return fields;
}

// Shared shape for the Privacy Policy and Terms of Service pages: a flat
// list of {heading, paragraphs} sections rather than a rich-text blob, so
// Bjorn can edit one clause at a time without touching page structure.
function legalPageFields() {
  return [
    {
      type: 'object' as const,
      name: 'seo',
      label: 'SEO',
      fields: [
        { type: 'string' as const, name: 'title', label: 'Page Title' },
        { type: 'string' as const, name: 'description', label: 'Meta Description', ui: { component: 'textarea' } },
      ],
    },
    { type: 'string' as const, name: 'eyebrow', label: 'Eyebrow' },
    { type: 'string' as const, name: 'heading', label: 'Heading (H1)' },
    { type: 'string' as const, name: 'lead', label: 'Lead Line' },
    { type: 'string' as const, name: 'lastUpdated', label: 'Last Updated (e.g. "August 2026")' },
    { type: 'string' as const, name: 'intro', label: 'Intro Paragraph', ui: { component: 'textarea' } },
    {
      type: 'object' as const,
      name: 'sections',
      label: 'Sections',
      list: true,
      fields: [
        { type: 'string' as const, name: 'heading', label: 'Section Heading' },
        { type: 'string' as const, name: 'paragraphs', label: 'Paragraphs', list: true, ui: { component: 'textarea' } },
      ],
    },
  ];
}

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
          {
            type: 'object',
            name: 'leadForms',
            label: 'Other Forms (copy only — fields are fixed in code)',
            fields: [
              {
                type: 'object',
                name: 'connect',
                label: '"I would love to connect" Form',
                fields: leadFormCopyFields(),
              },
              {
                type: 'object',
                name: 'downloadChapter',
                label: '"Download the First Chapter" Form',
                fields: leadFormCopyFields(),
              },
              {
                type: 'object',
                name: 'preorder',
                label: '"Pre-order the Book" Form',
                fields: leadFormCopyFields(),
              },
              {
                type: 'object',
                name: 'downloadReport',
                label: '"Download Report" Form',
                fields: leadFormCopyFields(),
              },
              {
                type: 'object',
                name: 'masterclass',
                label: '"Book a Masterclass" Form',
                fields: leadFormCopyFields({ withMessageLabel: true }),
              },
              {
                type: 'object',
                name: 'speaker',
                label: '"Book for Speaker" Form',
                fields: leadFormCopyFields({ withMessageLabel: true }),
              },
              {
                type: 'object',
                name: 'consultancy',
                label: '"Let\'s Talk About Your Brand" Form',
                fields: leadFormCopyFields({ withMessageLabel: true }),
              },
            ],
          },
          {
            type: 'object',
            name: 'stripeLinks',
            label: 'Stripe Purchase Links',
            fields: [
              { type: 'string', name: 'note', label: 'Internal Note (not shown on site)' },
              { type: 'string', name: 'ebook', label: 'Ebook Checkout Link' },
              { type: 'string', name: 'hardcover', label: 'Hardcover Checkout Link' },
              { type: 'string', name: 'masterclass', label: 'Masterclass Checkout Link' },
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
              {
                type: 'object',
                name: 'stats',
                label: 'Stats',
                list: true,
                fields: [
                  { type: 'string', name: 'value', label: 'Number / Value' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'sourceLabel', label: 'Source Label (e.g. "G2 research, 2026")' },
                  { type: 'string', name: 'sourceUrl', label: 'Source Link' },
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
              { type: 'string', name: 'riskHeading', label: 'Risk Callout Heading' },
              { type: 'string', name: 'riskBody', label: 'Risk Callout Body', ui: { component: 'textarea' } },
              { type: 'string', name: 'source', label: 'Source Citation (text only, no link available)' },
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
                  { type: 'string', name: 'definition', label: 'Definition', ui: { component: 'textarea' } },
                  { type: 'string', name: 'measurement', label: 'How It\'s Measured', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'authority',
            label: 'Authority Line (shown near the closing CTA)',
            fields: [
              { type: 'string', name: 'line', label: 'Line', ui: { component: 'textarea' } },
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
              { type: 'string', name: 'tertiaryCtaLabel', label: 'Tertiary Link Text' },
            ],
          },
        ],
      },
      {
        name: 'about',
        label: 'About Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'about' },
        ui: { allowedActions: { create: false, delete: false } },
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
          { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
          { type: 'string', name: 'headline', label: 'Headline (H1)', ui: { component: 'textarea' } },
          { type: 'string', name: 'lead', label: 'Lead Paragraph', ui: { component: 'textarea' } },
          { type: 'string', name: 'connectLine', label: '"Connect" Line' },
          {
            type: 'object',
            name: 'whatIBelieve',
            label: 'What I Believe',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'paragraphs', label: 'Paragraphs', list: true, ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'whatIDo',
            label: 'What I Actually Do',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro' },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                ],
              },
              { type: 'string', name: 'ctaLabel', label: 'Button Text (all items)' },
            ],
          },
          {
            type: 'object',
            name: 'principles',
            label: 'Principles',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro' },
              {
                type: 'object',
                name: 'items',
                label: 'Principles',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                ],
              },
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
              { type: 'string', name: 'tertiaryCtaLabel', label: 'Tertiary Link Text' },
            ],
          },
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Questions',
                list: true,
                fields: [
                  { type: 'string', name: 'question', label: 'Question' },
                  { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'closingCta',
            label: 'Closing CTA',
            fields: [
              { type: 'string', name: 'line', label: 'Line', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
            ],
          },
        ],
      },
      {
        name: 'becomeTheAnswerPage',
        label: 'Become the Answer Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'become-the-answer' },
        ui: { allowedActions: { create: false, delete: false } },
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
          { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'headline', label: 'Headline' },
              { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
            ],
          },
          {
            type: 'object',
            name: 'stakes',
            label: 'What Is at Stake',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'tool1',
                label: 'Tool 1',
                fields: [
                  { type: 'string', name: 'heading', label: 'Heading' },
                  { type: 'string', name: 'microcopy', label: 'Microcopy' },
                  { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
                  { type: 'string', name: 'ctaLabel', label: 'Button Text' },
                ],
              },
              {
                type: 'object',
                name: 'tool2',
                label: 'Tool 2',
                fields: [
                  { type: 'string', name: 'heading', label: 'Heading' },
                  { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
                  { type: 'string', name: 'ctaLabel', label: 'Button Text' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'operatingSystem',
            label: 'AEO vs SEO',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              { type: 'string', name: 'subheading', label: 'Subheading' },
              { type: 'string', name: 'subheadingBody', label: 'Subheading Body', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'comparisonRows',
                label: 'Comparison Rows',
                list: true,
                fields: [
                  { type: 'string', name: 'label', label: 'Row Label' },
                  { type: 'string', name: 'seo', label: 'SEO Column' },
                  { type: 'string', name: 'aeo', label: 'AEO Column' },
                ],
              },
              { type: 'string', name: 'proofLine', label: 'Proof Line', ui: { component: 'textarea' } },
              { type: 'string', name: 'proofSource', label: 'Proof Source' },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
            ],
          },
          {
            type: 'object',
            name: 'whyMe',
            label: 'Why Me, and How',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'ways',
                label: 'Three Ways In',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description' },
                  { type: 'string', name: 'ctaLabel', label: 'Button Text' },
                  { type: 'string', name: 'ctaHref', label: 'Button Link (leave blank to open Register Interest)' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'costOfWaiting',
            label: 'The Cost of Waiting',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'quotableLine', label: 'Quotable Line' },
            ],
          },
          {
            type: 'object',
            name: 'beyondTheScore',
            label: 'Beyond the Score',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'quotableLine', label: 'Quotable Line' },
            ],
          },
          {
            type: 'object',
            name: 'library',
            label: 'Library Teaser',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro' },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description' },
                ],
              },
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
              { type: 'string', name: 'tertiaryCtaLabel', label: 'Tertiary Link Text' },
            ],
          },
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Questions',
                list: true,
                fields: [
                  { type: 'string', name: 'question', label: 'Question' },
                  { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'workWithMe',
        label: 'Work with Me Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'work-with-me' },
        ui: { allowedActions: { create: false, delete: false } },
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
          { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'headline', label: 'Headline' },
              { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
              { type: 'string', name: 'quotableLine', label: 'Quotable Line' },
            ],
          },
          {
            type: 'object',
            name: 'offers',
            label: 'Three Offers',
            list: true,
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'oneLiner', label: 'One Liner' },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'formType', label: 'Opens Form (masterclass / speaker / consultancy)' },
            ],
          },
          {
            type: 'object',
            name: 'masterclass',
            label: 'Masterclass Program',
            fields: [
              {
                type: 'object',
                name: 'shift',
                label: 'The Shift',
                fields: [
                  { type: 'string', name: 'heading', label: 'Heading' },
                  { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
                  { type: 'string', name: 'proofStrip', label: 'Proof Strip', list: true },
                ],
              },
              {
                type: 'object',
                name: 'whoFor',
                label: 'Who Is This For',
                fields: [
                  { type: 'string', name: 'heading', label: 'Heading' },
                  { type: 'string', name: 'items', label: 'Items', list: true, ui: { component: 'textarea' } },
                ],
              },
              {
                type: 'object',
                name: 'goal',
                label: 'The Goal',
                fields: [
                  { type: 'string', name: 'heading', label: 'Heading' },
                  { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
                  {
                    type: 'object',
                    name: 'steps',
                    label: 'Steps',
                    list: true,
                    fields: [
                      { type: 'string', name: 'title', label: 'Title' },
                      { type: 'string', name: 'description', label: 'Description' },
                    ],
                  },
                ],
              },
              {
                type: 'object',
                name: 'workshops',
                label: 'The Five Workshops',
                list: true,
                fields: [
                  { type: 'string', name: 'number', label: 'Number' },
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'leavesWith', label: '"Leaves With"' },
                ],
              },
              {
                type: 'object',
                name: 'howItRuns',
                label: 'How It Runs',
                fields: [
                  { type: 'string', name: 'points', label: 'Points', list: true },
                  { type: 'string', name: 'deliverables', label: 'Deliverables', ui: { component: 'textarea' } },
                ],
              },
              {
                type: 'object',
                name: 'numbers',
                label: 'Program in Numbers',
                list: true,
                fields: [
                  { type: 'string', name: 'value', label: 'Number' },
                  { type: 'string', name: 'label', label: 'Label' },
                ],
              },
              {
                type: 'object',
                name: 'howToStart',
                label: 'How to Start',
                fields: [
                  {
                    type: 'object',
                    name: 'steps',
                    label: 'Steps',
                    list: true,
                    fields: [
                      { type: 'string', name: 'title', label: 'Title' },
                      { type: 'string', name: 'description', label: 'Description' },
                    ],
                  },
                ],
              },
              { type: 'string', name: 'ctaLabel', label: 'Section Button Text' },
            ],
          },
          {
            type: 'object',
            name: 'speaking',
            label: 'Speaking & Panels',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'formats',
                label: 'Formats',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'description', label: 'Description' },
                ],
              },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
              { type: 'string', name: 'quotableLine', label: 'Quotable Line' },
            ],
          },
          {
            type: 'object',
            name: 'consultancy',
            label: 'Consultancy',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'what', label: 'What It Is', ui: { component: 'textarea' } },
              { type: 'string', name: 'who', label: 'Who It Is For', ui: { component: 'textarea' } },
              { type: 'string', name: 'how', label: 'How It Works', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'Button Text' },
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
              { type: 'string', name: 'tertiaryCtaLabel', label: 'Tertiary Link Text' },
            ],
          },
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Questions',
                list: true,
                fields: [
                  { type: 'string', name: 'question', label: 'Question' },
                  { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'libraryPage',
        label: 'Library Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'library' },
        ui: { allowedActions: { create: false, delete: false } },
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
          { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'subhead', label: 'Subhead', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'featured',
            label: 'Featured Section',
            fields: [{ type: 'string', name: 'heading', label: 'Heading' }],
          },
          {
            type: 'object',
            name: 'buckets',
            label: 'Library Buckets',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Buckets (keep these five in sync with the Bucket options on Library Items)',
                list: true,
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
                  { type: 'string', name: 'ctaLabel', label: 'Button Text' },
                  { type: 'string', name: 'ctaFormType', label: 'Opens Form (leave blank for Register Interest)' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'watch',
            label: 'Watch Page',
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
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro' },
              { type: 'string', name: 'cardCtaLabel', label: 'Card Button Text' },
              { type: 'string', name: 'emptyState', label: 'Empty State Message' },
            ],
          },
          {
            type: 'object',
            name: 'listen',
            label: 'Listen Page',
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
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro' },
              { type: 'string', name: 'cardCtaLabel', label: 'Card Button Text' },
              { type: 'string', name: 'emptyState', label: 'Empty State Message' },
            ],
          },
          {
            type: 'object',
            name: 'read',
            label: 'Read Page',
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
              { type: 'string', name: 'heading', label: 'Heading' },
              { type: 'string', name: 'intro', label: 'Intro' },
              { type: 'string', name: 'searchPlaceholder', label: 'Search Box Placeholder' },
              { type: 'string', name: 'emptyState', label: 'Empty / No Results Message' },
            ],
          },
          {
            type: 'object',
            name: 'faq',
            label: 'FAQ',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading' },
              {
                type: 'object',
                name: 'items',
                label: 'Questions',
                list: true,
                fields: [
                  { type: 'string', name: 'question', label: 'Question' },
                  { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'privacyPolicy',
        label: 'Privacy Policy Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'privacy-policy' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: legalPageFields(),
      },
      {
        name: 'termsOfService',
        label: 'Terms of Service Page',
        path: 'content/pages',
        format: 'json',
        match: { include: 'terms-of-service' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: legalPageFields(),
      },
      {
        name: 'library',
        label: 'Library Items',
        path: 'content/library',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          {
            type: 'string',
            name: 'type',
            label: 'Type',
            options: ['read', 'watch', 'listen'],
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description (one line — also used as the SEO description if none is set below)',
            ui: { component: 'textarea' },
            required: true,
          },
          { type: 'image', name: 'image', label: 'Image / Thumbnail' },
          {
            type: 'string',
            name: 'bucket',
            label: 'Bucket (Read articles only)',
            options: [
              'AEO Foundations',
              'How Engines Choose',
              'The Raw Material',
              'Measurement',
              'Field Notes & Playbooks',
            ],
          },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          {
            type: 'string',
            name: 'externalUrl',
            label: 'External Link (Watch / Listen only)',
          },
          {
            type: 'string',
            name: 'source',
            label: 'Source (e.g. YouTube, Spotify — Watch / Listen only)',
          },
          { type: 'datetime', name: 'publishDate', label: 'Publish Date', required: true },
          { type: 'datetime', name: 'updatedDate', label: 'Last Updated Date (optional — Read only)' },
          { type: 'boolean', name: 'featured', label: 'Feature this on the Library hub page' },
          { type: 'string', name: 'seoTitle', label: 'SEO Title (optional — Read only)' },
          {
            type: 'string',
            name: 'seoDescription',
            label: 'SEO Description (optional — Read only)',
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'relatedSlugs',
            label: 'Related Concepts (slugs of other Read articles — Read only)',
            list: true,
          },
          {
            type: 'object',
            name: 'followUpQuestion',
            label: 'Follow-up Question (Read only — a natural next question, shown after the article)',
            fields: [
              { type: 'string', name: 'question', label: 'Question' },
              { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Article Content (Read only — this is the article itself)',
            isBody: true,
          },
        ],
      },
    ],
  },
});
