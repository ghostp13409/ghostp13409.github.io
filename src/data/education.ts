import type { Education, Certificate } from "../types/portfolio";

export const education: Education = {
  institution: {
    name: "Conestoga College",
    location: "Ontario, Canada",
    logo: "CC",
    website: "https://www.conestogac.on.ca/"
  },
  program: {
    title: "Advanced Diploma in Computer Programming and Analysis",
    type: "Co-operative Education Program",
    duration: "2024 - 2026",
    gpa: "3.93",
    status: "Full-Time Study",
    totalSemesters: 6,
    completedSemesters: 6,
  },
  description: "Comprehensive 3-year program combining theoretical knowledge with practical industry experience through integrated co-operative work terms, preparing students for successful careers in software development.",
  timeline: [
    {
      id: 1,
      phase: "Semester 1",
      period: "Winter 2024",
      status: "completed",
      courses: [
        "Programming Fundamentals (C#)",
        "Web Development Basics",
        "Database Concepts",
        "Mathematics for Computing",
        "Professional Communications"
      ],
      keySkills: ["C# Programming", "HTML/CSS", "SQL Basics", "Problem Solving"],
      grade: "4.00",
      gpa: 4.0,
      highlights: ["Dean's Honor List", "Perfect Attendance", "Top 5% of Class"],
      projects: ["Console Calculator App", "Static Portfolio Website", "Database Design Project"]
    },
    {
      id: 2,
      phase: "Semester 2",
      period: "Summer 2024",
      status: "completed",
      courses: [
        "Object-Oriented Programming (C#)",
        "Advanced Web Development (JavaScript)",
        "System Analysis & Design",
        "Data Structures & Algorithms",
        "Business Intelligence"
      ],
      keySkills: ["OOP Concepts", "JavaScript/DOM", "UML Design", "Algorithm Analysis"],
      grade: "4.00",
      gpa: 4.0,
      highlights: ["Study Group Leader", "Outstanding Project Award", "Peer Tutor"],
      projects: ["Windows Forms Application", "Dynamic Web Application", "System Design Documentation"]
    },
    {
      id: 3,
      phase: "Semester 3",
      period: "Fall 2024",
      status: "completed",
      courses: [
        "Enterprise Applications (ASP.NET)",
        "Software Testing & Quality Assurance",
        "Agile Project Management",
        "Advanced Database Programming",
        "Mobile Application Fundamentals"
      ],
      keySkills: ["ASP.NET MVC", "Unit Testing", "Agile Methodologies", "Advanced SQL"],
      grade: "3.99",
      gpa: 3.99,
      highlights: ["Innovation Challenge Finalist", "Scrum Master Role", "Technical Presentation Award"],
      projects: ["E-commerce Web Application", "Automated Testing Suite", "Team Project Management"]
    },
    {
      id: 4,
      phase: "Semester 4",
      period: "Winter 2025",
      status: "completed",
      courses: [
        "Mobile Development (Flutter/Dart)",
        "Java Enterprise Applications",
        "Quality Assurance Automation",
        "Capstone Project Phase I",
        "Professional Portfolio Development"
      ],
      keySkills: ["Flutter Development", "Java Servlets", "Selenium Testing", "Project Management"],
      grade: "4.00",
      gpa: 4.0,
      highlights: ["Google Developer Group Member", "Industry Mentorship Program", "Capstone Team Lead"],
      projects: ["Cross-platform Mobile App", "Enterprise Java Application", "Automated Testing Framework"]
    },
    {
      id: 5,
      phase: "Semester 5",
      period: "Fall 2026",
      status: "upcoming",
      courses: [
        "Advanced Software Architecture",
        "Emerging Technologies",
        "Capstone Project Phase II",
        "Industry Research Project",
        "Professional Ethics"
      ],
      keySkills: ["Software Architecture", "Emerging Tech", "Research Methods", "Ethics"],
      grade: "TBD",
      gpa: null,
      highlights: ["Advanced Specialization", "Research Experience", "Ethical Leadership"],
      projects: ["Advanced Architecture Project", "Technology Research", "Final Capstone"]
    },
    {
      id: 6,
      phase: "Semester 6",
      period: "Winter 2027",
      status: "upcoming",
      courses: [
        "Advanced Capstone Project",
        "Industry Transition Preparation",
        "Professional Portfolio Finalization",
        "Career Development",
        "Technology Innovation"
      ],
      keySkills: ["Advanced Development", "Career Preparation", "Innovation", "Leadership"],
      grade: "TBD",
      gpa: null,
      highlights: ["Graduation Preparation", "Industry Transition", "Final Portfolio"],
      projects: ["Final Capstone Presentation", "Professional Portfolio", "Career Preparation"]
    }
  ],
  achievements: [
    {
      title: "Dean's Honor List",
      subtitle: "Every Semester",
      icon: "🏆",
      color: "primary",
      description: "Consistently maintained excellence with 3.99 GPA across all completed semesters"
    },
    {
      title: "GDG Member",
      subtitle: "Google Developer",
      icon: "🌐",
      color: "secondary",
      description: "Active participant in Google Developer Group events and tech community"
    },
    {
      title: "Peer Tutor",
      subtitle: "Programming",
      icon: "👥",
      color: "primary",
      description: "Leading study groups and providing peer tutoring for programming courses"
    },
  ],
  progressStats: {
    completedSemesters: 3,
    currentSemester: 4,
    totalSemesters: 10,
    completedPercentage: 35,
    coopTermsCompleted: 0,
    totalCoopTerms: 4,
    academicSemestersCompleted: 3,
    totalAcademicSemesters: 6
  }
};

export const Certificates: Certificate[] = [
  {
    id: 1,
    title: "JavaScript Essential Training",
    issuer: "LinkedIn Learning",
    date: "2021",
    skills: ["JavaScript", "ES6"],
    link: "#",
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
    title: "OOP with C#",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["C#", "OOP"],
    link: "https://www.linkedin.com/learning/certificates/d72227d379baff564a7ee1f56571ade76057da603f379e6c9f27517017848b7c",
  },
  {
    id: 5,
    title: "Docker Foundations Professional Certificate",
    issuer: "Docker | LinkedIn Learning",
    date: "2025",
    skills: ["Docker Products", "Containerization"],
    link: "https://www.linkedin.com/learning/certificates/d0642a9e13d502832d1304a189831c057e02076130689640955d251807c5ab57",
  },
];
