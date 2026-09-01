# Deploying this site

This is a static Astro site. It builds to a folder of plain HTML, CSS, and
JS (`dist/`), which any static host can serve. Vercel and Netlify are both
already configured (`vercel.json`, `netlify.toml`); pick whichever the
business prefers.

## 1. Push the repository to GitHub

TinaCMS saves content by committing to Git, so the site needs to live in a
GitHub repository before the CMS is useful. If that has not happened yet,
create a repository and push this project to it.

## 2. Connect the repository to a host

**Vercel**
1. Import the GitHub repository at vercel.com.
2. Framework preset: Astro (auto-detected).
3. Build command: `npm run build`. Output directory: `dist`. Both are
   already set in `vercel.json`.

**Netlify**
1. Import the GitHub repository at app.netlify.com.
2. Build command and publish directory are already set in `netlify.toml`
   (`npm run build`, `dist`).

Either host redeploys automatically on every push to the repository,
including the commits TinaCMS makes when Bjorn saves an edit.

## 3. Set environment variables

Add these in the host's project settings (not in a committed file):

| Variable | Required for | Notes |
|---|---|---|
| `TINA_CLIENT_ID` | The `/admin` content editor | From the TinaCloud project (see `EDITING.md`). Without it, the site still builds and runs, the editor just is not available. |
| `TINA_TOKEN` | The `/admin` content editor | From the same TinaCloud project. Keep it secret, this is a write-access token. |
| `PUBLIC_FORM_ENDPOINT` | Real form submissions | The public "HTML form" URL from an email provider (MailerLite, ConvertKit, etc.). Without it, form submissions still succeed for the visitor but only log to the browser console, nothing is actually sent anywhere. See `src/lib/formSubmit.ts`. |

`TINA_BRANCH` defaults to `main` and does not need to be set unless the site
deploys from a different branch.

## 4. Point the domain

The canonical domain is `becometheanswer.org` (already set in
`astro.config.mjs` and used throughout the site's SEO metadata, sitemap, and
structured data). Point that domain's DNS at the chosen host, and set it as
the project's primary domain there. If `becometheanswer.club` or `.com` are
also owned, redirect them to `.org` at the DNS or host level rather than
serving the site from more than one domain, that avoids splitting SEO/AEO
signal across duplicate URLs.

## 5. First deploy checklist

- [ ] Repository pushed to GitHub
- [ ] Connected to Vercel or Netlify
- [ ] `TINA_CLIENT_ID` and `TINA_TOKEN` set (or deliberately left blank if
      Tina is not needed yet)
- [ ] `PUBLIC_FORM_ENDPOINT` set once an email provider is chosen
- [ ] Domain pointed and HTTPS certificate issued (both hosts do this
      automatically once DNS is correct)
- [ ] Run `npm run build` locally once before the first deploy, to catch any
      environment-specific issues early

## Ongoing deploys

Nothing further is needed. Every push to the main branch, whether from a
developer or from Bjorn saving in Tina, triggers a new build and goes live
automatically within a couple of minutes.
