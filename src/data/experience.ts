import type { WorkExperience } from "../types/portfolio";

export const experiences: WorkExperience[] = [
  {
    id: 0,
    company: "Catalis",
    companyNote: "Government SaaS and payments platform",
    companyUrl: "https://www.catalisgov.com/",
    role: "Software Developer",
    location: "Canada (Remote)",
    period: "2026 – Present",
    isCurrent: true,
    summary:
      "I work on cloud platform services and modernized court software for government agencies, moving between system design, DevOps, and product code, with AI-assisted development at the core of how I work.",
    highlights: [
      {
        title: "Data migration platform",
        text: "Own the design and build of a new shared cloud service that lets teams migrate large volumes of legacy customer data into modern products, with file tracking, dry runs, rate control, and a full audit trail. Wrote the design documents and led the architecture review through to build.",
        stack: ["Go", "AWS Serverless", "React", "TypeScript"],
      },
      {
        title: "Error monitoring",
        text: "Researched, planned, and deployed a centralized, self-hosted Sentry server shared across multiple product teams, built entirely with infrastructure as code.",
        stack: ["Sentry", "IaC"],
      },
      {
        title: "CI/CD modernization",
        text: "Modernized a product's Azure DevOps pipeline so infrastructure changes deploy through Terraform, added automated PR validation, and built the pipeline for a new QA environment.",
        stack: ["Azure DevOps", "Terraform"],
      },
      {
        title: "Court integrations",
        text: "Took ownership of a C#/.NET microservice that connects the electronic filing product with court case-management systems.",
        stack: ["C#", ".NET"],
      },
      {
        title: "Anti-phishing tool",
        text: "Built a Windows desktop app that shows users where an email link really goes before it opens in the browser, and packaged it for company-wide rollout.",
        stack: ["Windows", "Desktop"],
      },
      {
        title: "AI agent orchestration",
        text: "Built a tool that coordinates multiple AI coding agents across tickets, scheduling work and shared resources, while keeping a developer in the loop on every decision that matters.",
        stack: ["AI Agents", "Automation"],
      },
    ],
    description: ["Contributed to disaster-recovery planning for cloud products."],
    skills: ["Go", "C#", ".NET", "TypeScript", "React", "AWS", "Terraform", "Azure DevOps", "Sentry", "System Design"],
  },
  {
    id: 1,
    company: "Ultimate Coders",
    companyNote: "Coding school for kids and teens",
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
    companyNote: "UN-funded government project",
    role: "Front-End Developer",
    location: "Remote / Waterloo, ON",
    period: "Feb 2025 – May 2025",
    description: [
      "Built dynamic user interfaces using Next.js, React, and TypeScript for a UN-funded project.",
      "Integrated LLM-powered responses from AWS-hosted backend services.",
      "Developed an admin dashboard with RBAC and CRUD functionality for managing PDF datasets.",
      "Collaborated with backend engineers on Python APIs and PostgreSQL.",
    ],
    skills: ["Next.js", "React", "TypeScript", "AWS", "Python", "PostgreSQL"],
  },
];
