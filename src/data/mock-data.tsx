import type {
  Project,
  WorkExperience,
} from "../types/portfolio";

// Work Experience
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

// Projects (Stories of what I've built)
export const projects: Project[] = [
  {
    id: 1,
    title: "SwiftMove",
    description:
      "A full-stack marketplace connecting freelance drivers with customers needing moving services. I built this using a modern containerized microservices architecture to ensure it's scalable and robust.",
    tags: [
      "Java",
      "Spring Boot",
      "React",
      "TypeScript",
      "Docker",
      "RabbitMQ",
      "PostgreSQL",
    ],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    learnings: [
      "Secured the platform using JWT and Role-Based Access Control.",
      "Used Docker Compose for seamless development and deployment.",
      "Implemented service discovery with Eureka and routing through an API Gateway.",
      "Handled inter-service communication asynchronously with RabbitMQ.",
    ],
    impact:
      "Designed a system capable of handling multiple concurrent moving requests with real-time driver tracking.",
    imageUrl: "public/code.png",
    setup: [ "Omarchy", "Gemini CLI", "Docker-Compose", "Cloudflare Tunnel"]
  },
  {
    id: 2,
    title: "ModernShop",
    description:
      "I took a monolithic e-commerce application and evolved it into a microservices platform. This transformation focused on improving scalability for product management and shopping cart services.",
    tags: ["Java", "Spring Cloud", "Docker", "PostgreSQL", "Eureka", "Render"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    webUrl: "https://render.com",
    learnings: [
      "Mastered monolithic to microservices conversion strategies.",
      "Gained experience deploying Docker images to cloud platforms like Render.",
      "Managed distributed databases in a cloud environment.",
    ],
    impact:
      "Successfully collaborated in a team of 4 to deliver a scalable e-commerce backbone.",
    imageUrl: "public/code.png",
    setup: [ "VS Code", "Docker", "Render.com"]
  },
  {
    id: 3,
    title: "Equipment Rental System",
    description:
      "A real-time platform where users can rent tools and equipment. I integrated live chat and notifications to make the user experience seamless and interactive.",
    tags: ["ASP.NET Core", "C#", "React", "TypeScript", "Redis", "SignalR"],
    completionDate: "2025",
    learnings: [
      "Implemented real-time updates using SignalR.",
      "Built a secure authentication system with Google OAuth and JWT.",
      "Optimized data retrieval using Redis caching.",
    ],
    impact:
      "Built a production-ready rental system with sub-second notification latency.",
    imageUrl: "public/code.png",
    setup: [ "VS Code", "Docker", "Render.com"]
  },
  {
    id: 4,
    title: "WindChime — Mindfulness App",
    description:
      "A cross-platform app I built to help people practice mindfulness. It features guided meditation and a custom breathing pattern engine with tactile feedback.",
    imageUrl: "images/projects/WindChime.png",
    tags: ["Flutter", "Dart", "SQLite", "Provider", "Haptics"],
    completionDate: "2025",
    contentUrl: "https://github.com/ghostp13409/WindChime",
    learnings: [
      "Designed a clean repository-based architecture in Flutter.",
      "Optimized audio playback for a smooth meditation experience.",
      "Built an offline-first experience using SQLite.",
    ],
    impact:
      "Delivered a soothing mobile experience with 100% offline functionality.",
    setup: [ "VS Code", "Flutter", "Android/iOS Emulator"]
  },
  {
    id: 5,
    title: "Car Renting App",
    description:
      "An Android application for car rentals that keeps data in sync between a local database and the cloud, even when offline.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "SQLite"],
    completionDate: "2025",
    learnings: [
      "Implemented robust data sync between SQLite and Firebase Firestore.",
      "Crafted a modern, reactive UI using Jetpack Compose.",
    ],
    imageUrl: "public/code.png",
    setup: [ "VS Code", "Android Studio", "Firebase" ]
  }
];

// College Projects (The ones I'm most proud of from school)
export const collegeProjects: Project[] = projects.filter((p) =>
  [1, 2, 4, 16, 17].includes(p.id),
);

// Project Order: SwiftMove, WindChime, Toss-api, DSA, Equipment Rental System, ModernShop, LMS,  Car Renting App, Portfolio Website, ect...
