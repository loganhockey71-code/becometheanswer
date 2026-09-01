# The Answer Chat (planned, not built yet)

A future on-site assistant that answers visitor questions using only what is
actually published on this site (the Library and the four main pages), links
back to the source it drew from, and says it does not know rather than
guessing. This document is the plan, written now so the site is built in a
way that does not need reworking later. Building the feature itself is out
of scope for this launch, on purpose, so it does not delay shipping the site.

## Why it has to wait for one infrastructure change

This site currently builds as fully static output (`output: 'static'` in
`astro.config.mjs`), no server, nothing runs at request time. That is
correct for a content site: it is fast, cheap, and has no server to secure.

A chat feature needs a live request to an AI provider, and that call must
happen on a server, never in the visitor's browser, because the API key
would otherwise be visible to anyone who opens their browser's network tab.
So the first step, when this feature is actually built, is adding a
serverless adapter (`@astrojs/vercel` or `@astrojs/netlify`, matching
whichever host is in use per `DEPLOYMENT.md`) and switching that one route
to run on the server, everything else on the site stays static.

## The retrieval corpus already exists

`src/pages/content-index.json.ts` builds a machine-readable index of every
Read article, Watch/Listen item, and main page (title, description, URL,
tags, bucket) at build time, from `/content-index.json`. This is the corpus
the chat should answer from. Given the size of this site (roughly two dozen
items), a full vector database is not needed, simple keyword/embedding
search over this JSON file, done server-side, is enough, and cheaper to run
and reason about.

## Planned request flow

1. Visitor asks a question in the chat UI.
2. A serverless function (e.g. `src/pages/api/answer-chat.ts`, added once
   the server adapter is in place) receives the question.
3. The function retrieves the two or three most relevant items from
   `content-index.json` (or a small embeddings index built from it).
4. The function calls the AI provider server-side, with a system prompt that
   restricts it to answering only from the retrieved content, instructs it
   to say plainly when nothing relevant was found rather than improvising,
   and requires every answer to cite which page(s) it drew from.
5. The function returns the answer plus the source URLs to the browser. The
   browser never sees the API key, only the finished answer.

## Required environment variables (server-side only, when this is built)

Add to the hosting provider's environment variables, never to a `PUBLIC_`
variable and never committed to the repository:

- `ANSWER_CHAT_API_KEY`: the AI provider's API key. Server-side only.
- `ANSWER_CHAT_MODEL`: which model to call (so it can be changed without a
  code deploy).

## Guardrails to build in from day one

- If retrieval finds nothing relevant, the function should return "I don't
  have anything published on that yet" rather than letting the model answer
  from general knowledge, that is the entire point of the feature.
- Every answer should link back to the specific Library article or page it
  used, so the chat drives traffic into the real content instead of
  replacing it.
- Rate limit the endpoint (most serverless platforms support this natively,
  or a simple in-memory/IP-based limiter) so it cannot be used to run up an
  API bill via automated traffic.
