# Design Doc: Portfolio Data & Performance Optimization

**Date:** 2026-06-07
**Status:** Draft
**Topic:** Improving initial load time and eliminating image "pop-in" via data modularization, code splitting, and asset pipeline optimization.

## 1. Objective
Transform the current monolithic architecture into a high-performance, modular system.
- **Goal 1:** Reduce the initial JavaScript bundle size by splitting the data and page logic.
- **Goal 2:** Improve "First Contentful Paint" (FCP) and "Time to Interactive" (TTI).
- **Goal 3:** Eliminate layout shifts (CLS) caused by image loading.

## 2. Architecture: Data & Code Splitting

### 2.1 Modular Data Structure
The current `src/data/data.tsx` will be decomposed into domain-specific files to enable targeted imports and chunking.

- `src/data/projects.ts`: Project-specific arrays (`projects`, `CollageProjects`).
- `src/data/education.ts`: `education` and `Certificates` data.
- `src/data/experience.ts`: `experiences` data.
- `src/data/skills.ts`: `Skills` array and DSA contest info.
- `src/data/profile.ts`: Social links and general bio info.
- `src/data/index.ts`: Re-exports all data for backward compatibility where needed.

### 2.2 Component Lazy Loading
In `src/pages/Portfolio.tsx`, we will implement dynamic imports for heavy sections.

```tsx
const ProjectsPage = React.lazy(() => import("./ProjectsPage"));
const SkillsPage = React.lazy(() => import("./SkillsPage"));
const ExperiencePage = React.lazy(() => import("./ExperiencePage"));
```

- **Suspense Strategy:** Use a lightweight `<LoadingSection />` component (skeleton UI) to maintain visual continuity during chunk loading.

## 3. Asset Pipeline Optimization

### 3.1 Build-time Optimization
- **Tooling:** Integrate `vite-plugin-image-optimizer`.
- **Config:** Set default compression levels for SVGs, PNGs, and JPEGs. Enable conversion to `.webp` where appropriate.

### 3.2 Layout Stability (CLS)
- **Aspect Ratio Boxes:** Update `ProjectCard`, `VideoCard`, and `MobileAppCard` to use Tailwind's `aspect-*` classes on image containers.
- **Placeholders:** Implement a "Blur-up" effect or a themed shimmering skeleton during the `imageLoaded === false` state.

### 3.3 Native Optimization
- Ensure `loading="lazy"` and `decoding="async"` are applied to all non-hero images.

## 4. Implementation Stages
1. **Stage 1 (Data):** Refactor `src/data/` into modules.
2. **Stage 2 (Logic):** Implement `React.lazy` and `Suspense` in the main `Portfolio` entry point.
3. **Stage 3 (Assets):** Configure Vite optimizer and update UI cards for layout stability.
4. **Stage 4 (Verification):** Run build and inspect bundle sizes/network waterfall.

## 5. Success Criteria
- [ ] Initial bundle size (Gzipped) reduced by >30%.
- [ ] No visible layout jumping when project images load.
- [ ] Page scores improved in Lighthouse (Performance category).
