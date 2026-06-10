import type { WorkExperience } from "../types/portfolio";

export const experiences: WorkExperience[] = [
  {
    id: 1,
    company: "Ultimate Coders",
    role: "Coding Tutor",
    location: "Kitchener, ON",
    period: "Oct 2025 – Feb 2026",
    description: [
      "Taught 20+ students aged 7 to 17 C#, Python, JavaScript, and Scratch through hands-on coding challenges.",
      "Designed and led an 8-hour coding bootcamp, guiding students through mini projects that increased engagement.",
      "Managed multiple students with diverse tasks, providing regular feedback to parents on progress.",
    ],
    skills: ["C#", "Python", "JavaScript", "Teaching", "Curriculum Design"],
  },
  {
    id: 2,
    company: "Saudi Ministry of Municipality and Housing",
    role: "Front-End Developer",
    location: "Remote / Waterloo",
    period: "Feb 2025 – May 2025",
    description: [
      "Built dynamic user interfaces using Next.js, React, and TypeScript for a UN-Funded Project.",
      "Integrated LLM-powered responses from AWS-hosted backend services.",
      "Developed an Admin Dashboard with RBAC and CRUD functionality for managing PDF datasets.",
      "Collaborated with backend engineers on Python APIs and PostgreSQL.",
    ],
    skills: ["Next.js", "React", "TypeScript", "AWS", "Python", "PostgreSQL"],
  },
];
