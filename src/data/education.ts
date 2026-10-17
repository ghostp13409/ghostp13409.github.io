import type { Education, Certificate } from "../types/portfolio";

export const education: Education = {
  institution: {
    name: "Conestoga College",
    location: "Ontario, Canada",
    logo: "CC",
    website: "https://www.conestogac.on.ca/",
  },
  program: {
    title: "Advanced Diploma in Computer Programming and Analysis",
    type: "Co-operative Education Program",
    duration: "2024 - 2026",
    gpa: "3.93",
    status: "Graduated 2026",
    totalSemesters: 6,
    completedSemesters: 6,
  },
  description:
    "Three-year program combining theoretical foundations with hands-on industry experience through integrated co-op work terms.",
  achievements: [
    {
      title: "Dean's Honour List",
      subtitle: "Every Semester",
      icon: "🏆",
      color: "primary",
      description: "Maintained a 3.93 GPA across all completed semesters.",
    },
    {
      title: "GDG Member",
      subtitle: "Google Developer Group",
      icon: "🌐",
      color: "secondary",
      description: "Active participant in Google Developer Group events and the local tech community.",
    },
    {
      title: "Peer Tutor",
      subtitle: "Programming",
      icon: "👥",
      color: "primary",
      description: "Led study groups and tutored peers in programming courses.",
    },
    {
      title: "Capstone 2026 Winner",
      subtitle: "Team Lead",
      icon: "🥇",
      color: "primary",
      description: "Led the winning team in the 2026 Capstone Project competition.",
    },
  ],
};

export const Certificates: Certificate[] = [
  {
    id: 5,
    title: "Docker Foundations Professional Certificate",
    issuer: "Docker · LinkedIn Learning",
    date: "2025",
    skills: ["Docker", "Containerization"],
    link: "https://www.linkedin.com/learning/certificates/d0642a9e13d502832d1304a189831c057e02076130689640955d251807c5ab57",
  },
  {
    id: 2,
    title: "React Essential Training",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["React"],
    link: "https://www.linkedin.com/learning/certificates/ac295354e31d24fb5ec322b7c989b9bd23ba6afff5b0e4eabf00e9e3a5996c63?trk=share_certificate",
  },
  {
    id: 3,
    title: "React.js: Building an Interface",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["React", "Web Interface Design"],
    link: "https://www.linkedin.com/learning/certificates/4a5faa2b1529f5de2a82b039fde13d6649afca2d0cf7a806b130f5f49018ad09?trk=share_certificate",
  },
  {
    id: 4,
    title: "Object-Oriented Programming with C#",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["C#", "OOP"],
    link: "https://www.linkedin.com/learning/certificates/d72227d379baff564a7ee1f56571ade76057da603f379e6c9f27517017848b7c",
  },
  {
    id: 1,
    title: "JavaScript Essential Training",
    issuer: "LinkedIn Learning",
    date: "2021",
    skills: ["JavaScript", "ES6"],
  },
];
