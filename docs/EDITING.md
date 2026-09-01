# Editing this site

This site uses TinaCMS: a visual editor that sits on top of the actual website
files. You do not need to know code. You log in, click on the field you want
to change, edit it like a form, and save. Nothing goes live until you save.

## Logging in

1. Go to `https://becometheanswer.org/admin` (once the site is deployed).
2. Sign in with the TinaCloud account created for this project.
3. You will see a list of collections on the left: Site Settings, Home Page,
   About Page, Become the Answer Page, Work with Me Page, Library Page,
   Library Items, Privacy Policy Page, and Terms of Service Page.

If you have never signed in before, someone (your developer, or Logan) needs
to invite your email address to the TinaCloud project first. See "One-time
setup" below.

## Editing an existing page

1. Click the collection for the page you want (for example, "About Page").
2. Click the one document inside it. Every section of that page appears as a
   labeled field: headings, paragraphs, button text, links.
3. Change the text. A live preview updates as you type.
4. Click **Save**.
5. The change goes live on the next deploy. On Vercel or Netlify (see
   `DEPLOYMENT.md`), that happens automatically within a minute or two of
   saving, because saving in Tina commits the change to the site's Git
   repository, which triggers a new build.

You cannot break the page layout from inside Tina. The fields only let you
change text, links, and images, not move sections around or delete a section
by accident.

## Adding a new Library item (Read, Watch, or Listen)

1. Go to **Library Items**.
2. Click **Create New**.
3. Fill in:
   - **Title**: the headline as it should appear.
   - **Type**: `read` for your own article, `watch` for a video link, `listen`
     for a podcast link.
   - **Description**: one or two sentences. For a Read article, this is the
     short quotable summary shown at the top of the piece, so write it as a
     40 to 60 word answer to the title's question.
   - **Image / Thumbnail**: optional. For a Watch video, use the video's
     thumbnail. For a Read article, only add an image if you have a real
     diagram or photo, if you leave it blank, the article gets a clean
     text-only header instead of a mismatched stock image.
   - **Bucket**: for Read articles only, pick the closest of the five Library
     buckets (AEO Foundations, How Engines Choose, The Raw Material,
     Measurement, Field Notes & Playbooks).
   - **Tags**: short labels like "System shift" or "Market shift", shown as
     pills on the card.
   - **External Link** and **Source**: for Watch and Listen only, the YouTube
     or podcast URL and where it is from (for example, "YouTube").
   - **Publish Date**: controls sort order, newest first.
   - **Feature this on the Library hub page**: turns it on for the featured
     row at the top of `/library`. Keep this to two or three items at a time.
   - **Article Content**: for Read only, this is the article itself. Write
     the full piece here.
4. Click **Save**. It appears on the site on the next deploy.

## Editing the Privacy Policy or Terms of Service

Both pages are broken into numbered sections in Tina (one section per legal
clause). Edit a section's heading or paragraphs the same way as any other
page. If you make a substantive change (not just fixing a typo), also update
the "Last Updated" field so visitors can see the page changed.

Reminder: both pages were drafted from a general template and have not been
reviewed by a lawyer. Treat them as a solid starting point, not a finished
legal document, until someone with legal training has checked them against
how the business actually operates.

## Images

Upload images directly inside Tina wherever you see an image field, click it,
and choose a file from your computer. Tina stores it in the site's repository
under `public/assets/uploads/` and updates the field automatically. Keep
images under a few megabytes, Tina will not stop you from uploading something
huge, but a large image slows the page down for visitors.

## One-time setup (only needed once, by whoever manages the account)

1. Create a free TinaCloud project at `app.tina.io`, connected to this
   site's GitHub repository.
2. Copy the **Client ID** and generate a **Token** from that project.
3. Add both as environment variables in your hosting provider (Vercel or
   Netlify): `TINA_CLIENT_ID` and `TINA_TOKEN`. See `DEPLOYMENT.md` for the
   full list of environment variables.
4. Invite Bjorn's email address as an editor from the TinaCloud project's
   team settings.
5. Redeploy the site once. After that, the `/admin` editor is live.

## Getting help

If something looks broken in Tina, or a save does not seem to appear on the
live site after a few minutes, check the hosting provider's deploy log first
(Vercel or Netlify both show a build history with error messages). If that is
unclear, that is the point to bring in a developer rather than guess.
