# Portfolio Data & Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve initial load time and eliminate image "pop-in" via data modularization, code splitting, and asset pipeline optimization.

**Architecture:** Decompose the monolithic `data.tsx` into domain-specific modules, implement `React.lazy` for page-level code splitting, and integrate an automated image optimization pipeline with aspect-ratio stability.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, `vite-plugin-image-optimizer`.

---

### Task 1: Decompose `data.tsx` into Modules

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/data/education.ts`
- Create: `src/data/experience.ts`
- Create: `src/data/skills.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/index.ts`
- Modify: `src/data/data.tsx` (eventually remove after migration)

- [ ] **Step 1: Create `src/data/projects.ts`**
Move `projects` and `CollageProjects` to this file.
```typescript
import { Project, CollageProject } from "../types/portfolio";

export const projects: Project[] = [/* ... projects from data.tsx ... */];
export const CollageProjects: CollageProject[] = [/* ... CollageProjects from data.tsx ... */];
```

- [ ] **Step 2: Create `src/data/education.ts`**
Move `education` and `Certificates` to this file.
```typescript
import { Education, Certificate } from "../types/portfolio";

export const education: Education = {/* ... education from data.tsx ... */};
export const Certificates: Certificate[] = [/* ... Certificates from data.tsx ... */];
```

- [ ] **Step 3: Create `src/data/experience.ts`**
Move `experiences` to this file.
```typescript
import { WorkExperience } from "../types/portfolio";

export const experiences: WorkExperience[] = [/* ... experiences from data.tsx ... */];
```

- [ ] **Step 4: Create `src/data/skills.ts`**
Move `Skills` and `DSACont` to this file.
```typescript
import { Skill } from "../types/portfolio";
// ... DSACont component ...
export const Skills: Skill[] = [/* ... Skills from data.tsx ... */];
```

- [ ] **Step 5: Create `src/data/profile.ts`**
Move `socials`, `inProgress`, and `Hobbies` to this file.
```typescript
import { Social, InProgressLearning, Hobby } from "../types/portfolio";
// ... imports ...
export const socials: Social[] = [/* ... socials from data.tsx ... */];
export const inProgress: InProgressLearning[] = [/* ... inProgress from data.tsx ... */];
export const Hobbies: Hobby[] = [/* ... Hobbies from data.tsx ... */];
```

- [ ] **Step 6: Create `src/data/index.ts` (Barrel File)**
```typescript
export * from "./projects";
export * from "./education";
export * from "./experience";
export * from "./skills";
export * from "./profile";
```

- [ ] **Step 7: Commit data restructuring**
```bash
git add src/data/*.ts
git commit -m "refactor: modularize portfolio data"
```

---

### Task 2: Implement Lazy Loading in `Portfolio.tsx`

**Files:**
- Modify: `src/pages/Portfolio.tsx`
- Create: `src/components/LoadingSection.tsx`

- [ ] **Step 1: Create `src/components/LoadingSection.tsx`**
```tsx
import { FC } from "react";
const LoadingSection: FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);
export default LoadingSection;
```

- [ ] **Step 2: Update `Portfolio.tsx` with `React.lazy` and `Suspense`**
```tsx
import React, { Suspense } from "react";
// Replace direct imports with lazy imports
const ExperiencePage = React.lazy(() => import("./ExperiencePage"));
const SkillsPage = React.lazy(() => import("./SkillsPage"));
const ProjectsPage = React.lazy(() => import("./ProjectsPage"));
const ContactPage = React.lazy(() => import("./ContactPage"));

// In the render method, wrap pages in Suspense
// ...
<Suspense fallback={<LoadingSection />}>
  <ExperiencePage />
  <SkillsPage />
  <ProjectsPage />
  <ContactPage />
</Suspense>
// ...
```

- [ ] **Step 3: Verify build chunks**
Run: `npm run build`
Expected: Multiple small `.js` chunks in `dist/assets/` instead of one large file.

- [ ] **Step 4: Commit lazy loading**
```bash
git add src/pages/Portfolio.tsx src/components/LoadingSection.tsx
git commit -m "perf: implement lazy loading for page sections"
```

---

### Task 3: Setup Image Optimization Pipeline

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/components/ProjectCard.tsx`
- Modify: `src/components/VideoCard.tsx`

- [ ] **Step 1: Install optimizer plugin**
Run: `npm install -D vite-plugin-image-optimizer`

- [ ] **Step 2: Configure `vite.config.ts`**
```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
// ...
plugins: [
  // ...
  ViteImageOptimizer({
    test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
    png: { quality: 80 },
    jpeg: { quality: 80 },
    webp: { lossy: true, quality: 80 },
  }),
],
```

- [ ] **Step 3: Update `ProjectCard.tsx` for layout stability**
Ensure the image container has a fixed aspect ratio and use `loading="lazy"`.
```tsx
// Find image container
<div className="relative aspect-[16/10] w-full ...">
  <img 
    loading="lazy"
    decoding="async"
    // ... other props ...
  />
</div>
```

- [ ] **Step 4: Update `VideoCard.tsx` (if applicable)**
Ensure thumbnails have fixed aspect ratios.

- [ ] **Step 5: Verify final build**
Run: `npm run build`
Check file sizes of images in `dist/assets/`.

- [ ] **Step 6: Commit optimization**
```bash
git add vite.config.ts src/components/ProjectCard.tsx package.json
git commit -m "perf: setup image optimization pipeline and CLS fixes"
```
