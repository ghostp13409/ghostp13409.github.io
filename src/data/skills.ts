import type { Skill } from "../types/portfolio";

export const Skills: Skill[] = [
  {
    id: 1,
    title: "Languages",
    tags: ["Java", "C#", "TypeScript", "JavaScript", "Python", "Kotlin", "Dart", "Rust", "SQL", "HTML", "CSS"],
    color: "primary",
  },
  {
    id: 2,
    title: "Frameworks & Libraries",
    tags: [
      "React",
      "Next.js",
      "Spring Boot",
      "ASP.NET Core",
      "Node.js",
      "Express.js",
      "Entity Framework",
      "Flutter",
      "Jetpack Compose",
      "Tailwind CSS",
    ],
    color: "secondary",
  },
  {
    id: 3,
    title: "Databases & Messaging",
    tags: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Firebase", "RabbitMQ"],
    color: "accent",
  },
  {
    id: 4,
    title: "Data Structures & Algorithms",
    tags: [
      "Arrays",
      "Stacks",
      "Queues",
      "Hash Tables",
      "Binary Search",
      "Two-Pointer",
      "Recursion",
      "Merge Sort",
      "Insertion Sort",
      "Selection Sort",
    ],
    color: "primary",
  },
  {
    id: 5,
    title: "Tools & Platforms",
    tags: ["Git", "Docker", "Docker Compose", "Postman", "Linux", "VS Code", "AWS", "Render"],
    color: "secondary",
  },
];
