# Parth Gajjar · Portfolio

Personal portfolio site, live at **https://ghostp13409.github.io/**.

A single-page React application with a fixed sidebar, lazily loaded sections, and rich project modals (video demos, screenshot galleries, and an embedded live Flutter web build).

## Stack

- **React 19** + **TypeScript** (React Compiler enabled)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS 4** (design tokens in `src/index.css`)
- **Framer Motion** for section and modal animations (respects `prefers-reduced-motion`)
- **EmailJS** for the contact form
- **react-github-calendar** for the contributions graph

## Project layout

```
src/
  pages/          One component per section (Intro, Experience, Skills, Projects, Contact)
  components/     Sidebar, project cards, GitHub graph
  components/ui/  Shared card face, modal shell, lightbox, modal building blocks
  data/           All portfolio content (projects, experience, skills, education, profile)
  types/          Content type definitions
  hooks/          Scroll lock and Escape-key helpers for modals
  lib/            Shared Framer Motion variants
public/
  images/, videos/   Project media
  windchime-preview/ Flutter web build embedded as a live demo
```

To update content, edit the files under `src/data/`. No component changes are needed for new projects, roles, or certificates.

## Development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run typecheck  # tsc -b
npm run lint       # eslint
npm run build      # typecheck + production build to dist/
npm run preview    # serve dist/ locally
```

## Deployment

The site is deployed to GitHub Pages from the `gh-pages` branch:

```bash
npm run deploy     # builds, then publishes dist/ with gh-pages
```

## Notes

- Asset paths in `src/data/` are case-sensitive on GitHub Pages. Match the file name exactly.
- The WindChime live demo loads only when a visitor clicks "Launch App", so the large Flutter bundle is never fetched on page load.
