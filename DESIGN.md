---
name: ghostp13409 Portfolio
description: A professional, immersive portfolio showcasing technical expertise with a modern neon aesthetic.
colors:
  primary: "#10b981" # Emerald Green
  secondary: "#4f46e5" # Indigo/Ultramarine
  accent: "#f59e0b" # Amber/Gold
  neutral-bg: "#020617" # Deep Midnight (Tailwind 950)
  surface: "#0f172a" # Steel Surface (Tailwind 900)
  ink: "#f8fafc" # Frosted Ink
  border: "#1e293b" # Slate Border
typography:
  display:
    fontFamily: "Rubik, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Rubik, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Rubik, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System: ghostp13409 Portfolio

## 1. Overview

**Creative North Star: "The Neon Architect"**

The design system for this portfolio is built on a foundation of technical sophistication and immersive storytelling. It embraces a high-contrast dark mode where vibrant neon accents (Emerald, Indigo, and Amber) act as light sources in a deep midnight environment. The aesthetic is clean and professional, using geometric typography and ample whitespace to ensure clarity.

**Key Characteristics:**
- **High-Contrast Dark Mode**: Deep backgrounds paired with luminous, high-chroma accents.
- **Fluid Interactivity**: Components feel organic and responsive, reacting to user presence with subtle glows and transitions.
- **Technical Pulse**: Intentional use of "tech-native" elements like monospace snippets and brand icons.
- **Refined Precision**: Sharp borders and crisp typography that communicate professional authority.

## 2. Colors

The palette is anchored by a triad of distinctive neon accents that provide energy and direction against a stable, dark neutral foundation.

### Primary
- **Electric Emerald** (#10b981): Used for technical achievements, primary CTA highlights, and growth-related metrics.

### Secondary
- **Ultramarine Indigo** (#4f46e5): Used for structural highlights, deep transitions, and secondary interactive elements.

### Accent
- **Luminous Amber** (#f59e0b): Reserved for high-value achievements (Dean's list, awards) and specific emphasis moments.

### Neutral
- **Deep Midnight** (#020617): The primary background color. Provides deep contrast for neon elements.
- **Steel Surface** (#0f172a): Used for cards, sidebars, and containers to create structural depth.
- **Frosted Ink** (#f8fafc): The primary text color. High legibility against dark backgrounds.

### Named Rules
**The Rarity Rule.** Neon accents are used sparingly—on no more than 10% of any given screen. Their rarity makes them more impactful as navigational beacons.

**The Glow Rule.** Interactive elements (buttons, active tags) should emit a subtle glow (box-shadow with low opacity) in their primary color to reinforce the "Neon Architect" theme.

## 3. Typography

**Display Font:** Rubik (700)
**Body Font:** Rubik (400)
**Label/Mono Font:** Source Code Pro

**Character:** Bold, modern, and friendly. Rubik's rounded terminals soften the high-tech aesthetic, making the portfolio feel approachable despite its technical intensity.

### Hierarchy
- **Display** (700, clamp(3rem, 8vw, 6rem), 1.1): Used for hero greetings and main section titles.
- **Headline** (600, 2.25rem, 1.2): Used for project names and major subsection headers.
- **Title** (500, 1.25rem, 1.4): Used for card titles and category headers.
- **Body** (400, 1.125rem, 1.6): Used for descriptions and bio text. Max line length capped at 70ch.
- **Label** (500, 0.875rem, 0.05em): Used for tags, meta-data, and button text.

## 4. Elevation

The system uses tonal layering and subtle glows rather than heavy shadows to convey depth.

**The Atmospheric Depth Rule.** Depth is created by placing lighter surfaces (`surface`) on top of darker ones (`neutral-bg`). Physical shadows are minimal; instead, use 1px borders or subtle glows to separate elements.

### Shadow Vocabulary
- **Emerald Glow** (`box-shadow: 0 0 20px rgba(16, 185, 129, 0.2)`): Used on hover for primary interactive elements.

## 5. Components

### Buttons
- **Shape**: Rounded (12px)
- **Primary**: Background `primary`, text `neutral-bg`. Heavy font weight.
- **Interactions**: On hover, scales up slightly (1.05) and increases the intensity of the neon glow.

### Cards
- **Corner Style**: Large radius (24px)
- **Background**: `surface` (Steel Surface)
- **Border**: 1px solid `border` to define edges against the deep background.
- **Internal Padding**: Large (32px) to allow content to breathe.

### Navigation (Sidebar)
- **Style**: Fixed on desktop, collapsible on mobile.
- **Active State**: Uses a left-border accent and a subtle background tint of the `primary` color.

## 6. Do's and Don'ts

### Do:
- **Do** use solid brand colors for headers to ensure clarity.
- **Do** maintain high contrast between text and background (aim for 7:1 for body text).
- **Do** use icons for instant visual recognition of tech stacks.

### Don't:
- **Don't** use Purple/Cyan gradients; they are the "AI slop" giveaway.
- **Don't** use excessive text gradients; solid colors are cleaner and more professional.
- **Don't** use heavy, dark drop shadows that feel disconnected from the neon theme.
- **Don't** use "Marketing Speak"; keep copy technical, specific, and professional.
