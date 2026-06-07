# Project: ghostp13409.github.io

A modern, responsive personal portfolio website built with React, TypeScript, and Vite. It features interactive 3D elements, smooth animations, and a centralized data management system.

## Project Overview

- **Purpose:** Showcase professional experience, education, projects, and skills.
- **Core Tech Stack:**
  - **Framework:** React 19 + TypeScript
  - **Build Tool:** Vite
  - **Styling:** Tailwind CSS 4.0 (using `@tailwindcss/vite`)
  - **Animations:** Framer Motion
  - **3D Graphics:** Three.js, React Three Fiber (`@react-three/fiber`), React Three Drei (`@react-three/drei`)
  - **Icons:** Lucide-React, React-Icons
  - **Deployment:** GitHub Pages (via `gh-pages` package)

## Key Directories

- `src/assets/`: Static assets like images and SVGs used in the code.
- `src/components/`: Reusable UI components (e.g., `ProjectCard`, `Sidebar`, `DesignPreview`).
- `src/data/`: Contains the primary data files (`data.tsx`) that drive the content of the site.
- `src/pages/`: Main page layouts (e.g., `Portfolio.tsx`, `ProjectsPage.tsx`).
- `src/types/`: TypeScript interfaces and types for portfolio data structures.
- `public/`: Static assets (images/videos) referenced by path strings in the data files.

## Development Workflows

### Building and Running

- **Start Development Server:** `npm run dev`
- **Build for Production:** `npm run build`
- **Preview Production Build:** `npm run preview`
- **Lint Code:** `npm run lint`

### Deployment

The project is configured to deploy to GitHub Pages:
- **Deploy Command:** `npm run deploy` (This runs the build and pushes the `dist` folder to the `gh-pages` branch).

## Maintenance & Content Updates

Most content updates should be performed in `src/data/data.tsx`. This file exports constants for:
- `education`: Academic history and achievements.
- `Certificates`: Professional certifications.
- `inProgress`: Current learning goals.
- `socials`: Social media links and icons.
- `projects`: Detailed list of key software projects.
- `Skills`: Categorized technical skills.
- `CollageProjects`: Smaller or academic projects.
- `Hobbies`: Personal interests.

When adding new projects or assets:
1. Place images/videos in `public/images/projects/`.
2. Update the corresponding array in `src/data/data.tsx` with the new data object.

## Design Conventions

- **Responsiveness:** The app includes a mobile warning banner in `App.tsx` because it is optimized for desktop viewing. Use `LayoutBuilder` or Tailwind responsive classes (e.g., `md:`, `lg:`) for adjustments.
- **Animations:** Prefer `framer-motion` for UI transitions and hover effects.
- **3D Elements:** Interactive 3D backgrounds or models are implemented using React Three Fiber. Check `src/pages/Portfolio.tsx` or specialized components for 3D logic.
- **Tailwind 4:** This project uses Tailwind CSS 4.0. Configuration is primarily handled through the `@tailwindcss/vite` plugin and `src/index.css`.

## Coding Standards

- **Types:** Always define or update types in `src/types/portfolio.ts` when modifying data structures.
- **Components:** Prefer functional components with `FC` type from `react`.
- **Centralized Data:** Keep UI components generic and fetch data from `src/data/`.
