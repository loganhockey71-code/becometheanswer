# Phase 1: Foundation + Home page — Design

## Context

Become the Answer is a personal/practitioner brand site for Bjorn Vandemeulebroucke (AEO — Answer Engine Optimization). Source of truth for content, brand, and structure is the client-provided zip (extracted to `_source/`): brand guidelines PDF, six page blueprints, legal doc drafts, logo files, and five data-visualization images.

This is Phase 1 of a 6-phase build:
1. **Foundation + Home page** (this spec)
2. Content pages: About, Become the Answer, Work with Me
3. Library system: CMS collections, hub, Watch/Listen/Read, article template, filtering
4. Forms & integrations: 7 CTA forms wired to real endpoints, Stripe links
5. AEO/SEO infrastructure: JSON-LD, sitemap.xml, robots.txt, llms.txt, OG images
6. Legal pages, EDITING.md, deployment finalization, accessibility/perf QA

## Decisions locked in with the client

- **CMS hosting**: TinaCloud (hosted admin login for Bjorn; no self-hosted backend)
- **Canonical domain**: `becometheanswer.org` (`.club` redirects to it)
- **Work with Me workshops**: six workshops (01–06), the numbered grid is authoritative; "five modular workshops" summary copy will be corrected to six in Phase 2
- **Library seed articles**: scaffold the Resources/Article system with one clearly-marked sample entry; real seed content arrives separately from the client
- **Architecture**: Approach A — static Astro output + TinaCloud admin (form-based editor with live preview), not server-rendered contextual editing
- **Logo/wordmark**: use `mark.svg` / `mark_light.svg` exactly as provided for the icon badge. No wordmark SVG file exists in the source zip, so the wordmark lockup is implemented as literal text following the brand guide's documented spec exactly (Space Grotesk Bold, "Become the" in Ink + "Answer" in Signal Orange, −1 to −2% tracking) — this is implementing the documented spec, not redesigning it. No alternate icon, no creative reinterpretation.
- **TinaCMS schema philosophy**: favor simple, flat, clearly-labeled fields over dynamic/polymorphic block systems. Bjorn is non-technical; a fixed page structure with obvious field names is easier and safer for him to edit than a "add block / choose type / reorder" builder. Section order and structure on Home are fixed in code; only the content within each section is editable.

## Project structure

```
astro.config.mjs              — Astro 5, static output, @tailwindcss/vite, @tinacms/astro
tina/config.ts                 — Tina schema: settings + home collections
content/settings/global.json   — nav, footer, site-wide SEO defaults, CTA form copy
content/pages/home.json        — Home page content (flat, grouped fields)
src/layouts/BaseLayout.astro   — <html> shell, meta, fonts, skip-link
src/components/
  Nav.astro
  Footer.astro
  Button.astro                 — primary | secondary | ghost | link variants
  Container.astro
  Section.astro                — bg variant: paper | cloud | ink
  Eyebrow.astro
  Wordmark.astro                — coded text lockup per brand spec
  Mark.astro                    — wraps provided mark.svg / mark_light.svg
  StatBar.astro                 — Home Block 3 (5 stats)
  StatCard.astro                — Home Block 7 (sourced stat + CTA2)
  OfferRow.astro                — Home Block 6 (3 offer summaries)
  ToolTable.astro                — Home Block 8 (3-tool numbered table)
  EquityTable.astro             — Home Block 9 (4-dimension table)
  BecomeTheAnswerBand.astro     — reusable book-promo band (used on Home/About/Work-with-me)
  RegisterInterestForm.astro    — CTA 1 form UI + client validation (backend wiring is Phase 4)
src/assets/brand/               — mark.svg, mark_light.svg, the 5 data-viz PNGs (copied from _source)
src/styles/global.css           — Tailwind v4 import + @theme tokens
public/
docs/EDITING.md                 — written in Phase 6, stubbed now
```

## Design tokens (`src/styles/global.css`)

CSS-first Tailwind v4 config (no `tailwind.config.js`):

```css
@import "tailwindcss";

@theme {
  --color-ink: #16181D;
  --color-slate: #3A3F4A;
  --color-muted: #6E7178;
  --color-line: #E4E2DB;
  --color-cloud: #F1F0EA;
  --color-paper: #FAFAF7;
  --color-signal: #FF5A1F;
  --color-signal-deep: #D8430C;
  --color-signal-tint: #FFEDE4;

  --font-display: "Space Grotesk", sans-serif;
  --font-sans: "Inter", sans-serif;

  --radius-btn: 6px;
  --radius-card: 12px;
  --radius-pill: 999px;
}
```

- Fonts self-hosted via `@fontsource/space-grotesk` (weights 500/700) and `@fontsource/inter` (400/500/600/700) — no external Google Fonts request.
- Container: 1120px max-width, 24px gutters (`Container.astro`).
- Section padding: 96px desktop / 56px mobile (`Section.astro`).
- Spacing: Tailwind's default 4px-based scale, which already aligns to the brand's 8pt scale.
- Radius: 0 for rules/full-bleed, 6px buttons/inputs, 12px cards, 999px pills.
- Shadows: none by default; one soft card shadow utility (`shadow-card`: `rgba(20,23,29,0.06)`) available, used sparingly.

## Components

**Button** — 4 variants exactly per brand spec: Primary (Signal Orange fill / Ink text), Secondary (Ink fill / Paper text), Ghost (transparent / 1px Ink border / Ink text), Link (Signal Deep, underlined, inline). One primary action per section — no two competing primary buttons in one block.

**Nav** — Mark (left) · About · Become the Answer · Work with me · Library (center/right) · "Register your interest" primary button (right). Mobile: hamburger → full-screen or drawer menu, same link order.

**Footer** — Mark + Privacy Policy + Terms of Service columns (Block 12 spec). Room reserved for future columns (social, contact) without restructuring.

**Wordmark / Mark** — `Mark.astro` renders the provided badge SVG unmodified (light or dark variant by prop). `Wordmark.astro` renders "Become the" (Ink) + "Answer" (Signal Orange) as text in Space Grotesk Bold, tight tracking, exactly matching the guide's documented lockup — used where a text wordmark is called for; the icon badge alone is used for favicon/small-space contexts.

**BecomeTheAnswerBand** — Full-width band, Cloud or Ink background, book cover slot (a clean, deliberately-plain placeholder — a bordered box in brand neutrals with a small "Book cover" label, never a fabricated or stock cover image) + description + 3 micro-points + primary CTA (download first chapter) + secondary CTA (pre-order). Built once, instanced per page with page-specific CTA targets as props — matches the blueprint's explicit "build as a Component, edit in one place" instruction. The placeholder is swapped for the real cover the moment the client provides it, via a single Tina image field.

**RegisterInterestForm (CTA 1)** — Fields per the General doc: first name, last name, work email, brand (optional), key competitor (optional), company (optional), form-of-interest dropdown (AI visibility report / Masterclasses / Keynote speaker / Consultancy / Other + free text). Client-side validation (required fields, email format). Submit handler is a stubbed function that logs the payload — real ESP wiring (MailerLite/ConvertKit) happens in Phase 4.

Built as a single reusable modal (native `<dialog>`, no JS framework needed) mounted once in `BaseLayout`. Any button anywhere on the site opens it via a shared `data-open-register-form` trigger attribute — this matches the blueprint's explicit note that every CTA1 instance points to "one destination, the standard form," not a fork per section. The Hero stays a clean headline + subhead + single primary button that opens the modal, keeping the hero uncluttered rather than embedding the full form inline.

## TinaCMS schema

**`settings` collection** (singleton document, `content/settings/global.json`):
- `nav`: array of `{label, href}` (fixed 4 items expected, editable text/links only)
- `footerNote`: optional text
- `seoDefaults`: `{titleTemplate, defaultDescription, ogImage}`
- `registerInterestForm`: `{heading, microcopy, formOptions: string[]}` — lets Bjorn edit the dropdown options and microcopy without touching field logic

**`home` collection** (singleton document, `content/pages/home.json`), flat grouped objects — one object per fixed Home section, no dynamic block list:
- `hero`: `{headline, subhead, ctaLabel}`
- `statBar`: `{stats: [{value, label}]}` (repeating list, but the section itself is fixed — Bjorn adds/edits stat entries, doesn't restructure the section)
- `bigIdea`: `{title, subtitle, ctaLabel}`
- `offerRow`: `{items: [{title, oneLiner, ctaLabel, ctaHref}]}`
- `proofStats`: `{items: [{stat, context, sourceLabel, sourceUrl}]}`
- `toolsTable`: `{eyebrow, heading, subhead, tools: [{name, description, outcome}], ctaLabel, microcopy}`
- `equityTable`: `{heading, dimensions: [{name, question}]}`
- `closingCta`: `{line, ctaLabel, ctaHref}`
- `bookBand`: `{description, microPoints: string[], primaryCtaLabel, secondaryCtaLabel}`

Every field Bjorn would plausibly want to change (headings, body copy, stat numbers, source links, CTA labels) is a plain string/text field with a clear label in the Tina admin — no nested logic, no conditional fields, no block-type pickers.

## Home page → sections

| Blueprint block | Component | Notes |
|---|---|---|
| 1. Nav | `<Nav>` | |
| 2. Hero | `hero` section + `<RegisterInterestForm>` | Answer Equity graphic as a supporting visual, not a literal CSS background-image (keeps text contrast/accessibility clean) |
| 3. Stats bar | `<StatBar>` | 5 stats horizontal, stacks on mobile |
| 4. Big idea | `bigIdea` section | CTA → Become the Answer page |
| 5. Digital-shelf impact | Static image (provided PNG) | Native SVG rebuild deferred as a later polish pass |
| 6. Build your spot | `<OfferRow>` | 3 items |
| 7. Proof stats | `<StatCard>` × 3 | Sourced, linked, CTA2 (Download report) |
| 8. Curious where you stand | `<ToolTable>` | 3-tool table, CTA1 |
| 9. Answer Equity | `<EquityTable>` | Table + the provided radar image |
| 10. Closing CTA | `closingCta` section | Link to Work with Me |
| 11. Book band | `<BecomeTheAnswerBand>` | |
| 12. Footer | `<Footer>` | |

## Deployment (this phase)

- Git repo initialized locally (done). No GitHub repo created or pushed without explicit confirmation first.
- Static Astro build works unmodified on Vercel or Netlify; minimal `vercel.json`/`netlify.toml` added for clarity, not strictly required.
- TinaCloud account creation/connection is a manual step for the client — documented later in `EDITING.md` (Phase 6), not performed by Claude.

## Out of scope for this phase

- About, Become the Answer, Work with Me, Library pages
- Real form submission backend, Stripe wiring
- JSON-LD, sitemap.xml, robots.txt, llms.txt
- Legal pages
- Native SVG rebuilds of the ZMOT/Digital-shelf diagrams
