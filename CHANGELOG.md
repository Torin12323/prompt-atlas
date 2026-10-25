# Changelog

## 1.1.1 — 2026-10-25

- Keep only the desktop layout with a 1200px minimum canvas and desktop viewport metadata.
- Remove mobile navigation, its controls and event handlers, and phone/tablet layout breakpoints. Preserve desktop sizing and reduced-motion preferences.
- Make the header/footer wordmarks return to the page top.
- Preserve the active filters and loaded-card count when closing prompt details or using browser back/forward. Repair malformed prompt links safely.
- Audit all seven collection routes, 542 prompt deep links, external-link attributes, favorites, and login/register return destinations; repeat bilingual and contrast checks.

## 1.1.0 — 2026-10-25

- Add 96 original bilingual prompt templates across all 14 categories, bringing the public library to 542.
- Add reference links and review dates to existing and new templates; distinguish adaptations from editorially reviewed templates.
- Record 17 public official references in `public/data/prompt-sources.json` and release counts in `public/data/library-release.json`.
- Remove obsolete Sora tool labels from 100 public video templates and change the new-video default to Runway.
- Add Latest updates sorting and whole-term matching for hardware/development abbreviations such as RAM, GPU, SQL, and API.
- Add 96 distinct Pinterest-sourced illustrations. Keep all 52 existing orbit illustrations and existing prompt IDs/favorites.
- Preserve Baleday branding, system UI typography, bilingual navigation, light/dark modes, and private account-owned prompts.
- Add `npm run check:library` and an anonymous local preview adapter; production identity remains supplied by Sites dispatch.

Validation: data schema, exact duplicate text/IDs, image hashes and atlas coordinates, source URLs, model labels, bilingual UI, filtering/sorting, copying, favorites, draft-preserving saves, per-account data isolation, CSRF checks, and contrast. Browser QA covers public browsing and dialogs. Templates are editorial adaptations of guidance; generated outputs have not been benchmarked individually.

## 1.0.0 — 2026-10-08

- 446 public bilingual templates with distinct Pinterest covers and 52 distinct orbit images.
- Theme/language controls, prompt search, saved favorites, ChatGPT sign-in entry points, and account-owned custom prompts.
