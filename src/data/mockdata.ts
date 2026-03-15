import type {
  EducationData,
  Certificate,
  InProgressLearning,
  Social,
  Project,
  SkillCategory,
  Hobby,
  WorkExperience,
} from "../types/portfolio";

// Work Experience
export const experiences: WorkExperience[] = [
  {
    id: 1,
    company: "Ultimate Coders",
    role: "Volunteer Software Developer",
    location: "Remote",
    period: "Feb 2026 – Present",
    isCurrent: true,
    description: [
      "Contributing to full-stack development using Ruby on Rails, React, MySQL, and Next.js.",
      "Collaborating on internal tools and platform enhancements.",
      "Growing as a developer by applying professional architectural patterns and contributing to a live production environment.",
    ],
    skills: ["Ruby on Rails", "React", "MySQL", "Next.js", "Team Collaboration"],
  },
  {
    id: 2,
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
    id: 3,
    company: "Saudi Ministry of Municipality and Housing",
    role: "Front-End Developer (Subcontractor)",
    location: "Remote / Waterloo, ON",
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

// Education Data
export const education: EducationData = {
  institution: {
    name: "Conestoga College",
    location: "Ontario, Canada",
    logo: "CC",
    website: "https://www.conestogac.on.ca/",
  },
  program: {
    title: "Computer Programming and Analysis",
    type: "Advanced Diploma",
    duration: "2024 - April 2026",
    gpa: "3.99",
    status: "Final Semester",
    totalSemesters: 6,
    completedSemesters: 5,
    description:
      "A three-year deep dive into software engineering, systems analysis, and building real-world applications. I've focused on mastering modern stacks and learning how to solve complex problems with clean, maintainable code.",
  },
  timeline: [
    {
      id: 6,
      phase: "Final Semester",
      period: "Winter 2026",
      status: "upcoming",
      courses: [
        "Advanced Capstone Project (SwiftMove)",
        "Industry Transition",
        "Professional Portfolio",
        "Technology Innovation",
      ],
      keySkills: [
        "Microservices",
        "Docker Compose",
        "System Architecture",
        "Cloud Deployment",
      ],
      grade: "TBD",
      gpa: null,
      highlights: [
        "Building SwiftMove marketplace",
        "Implementing Microservices architecture",
        "Developing end-to-end deployment strategies",
      ],
      projects: ["SwiftMove"],
    },
    {
      id: 5,
      phase: "Semester 5",
      period: "Fall 2025",
      status: "completed",
      courses: [
        "Software Architecture",
        "Microservices Development",
        "Enterprise Java",
        "Cloud Computing",
      ],
      keySkills: [
        "Spring Boot",
        "Docker",
        "Microservices",
        "PostgreSQL",
      ],
      grade: "4.00",
      gpa: 4.0,
      highlights: [
        "ModernShop Microservices conversion",
        "Dockerized environment setup",
        "Full-stack deployment on Render",
      ],
      projects: ["ModernShop"],
    },
    {
      id: 4,
      phase: "Semester 4",
      period: "Winter 2025",
      status: "completed",
      courses: [
        "Mobile Development (Flutter)",
        "Native Android (Kotlin)",
        "QA Automation",
        "Project Management",
      ],
      keySkills: [
        "Flutter",
        "Kotlin",
        "Jetpack Compose",
        "Testing (Jest/JUnit)",
      ],
      grade: "4.00",
      gpa: 4.0,
      highlights: [
        "Created WindChime Mindfulness app",
        "Built a Native Android Car Rental app",
        "Developed an Expense Tracking tool",
      ],
      projects: ["WindChime", "Car Rental App", "Expense Tracking App"],
    },
    {
      id: 3,
      phase: "Semester 3",
      period: "Fall 2024",
      status: "completed",
      courses: [
        "Enterprise Apps (ASP.NET)",
        "Software Quality Assurance",
        "Agile Methods",
        "Advanced Databases",
      ],
      keySkills: [
        "ASP.NET MVC",
        "Unit Testing",
        "Agile Development",
        "SQL Optimization",
      ],
      grade: "3.99",
      gpa: 3.99,
      highlights: [
        "Developed an Equipment Rental System",
        "Integrated SignalR for live updates",
        "Implemented Redis caching",
      ],
      projects: ["Equipment Rental System", "LMS"],
    },
    {
      id: 2,
      phase: "Semester 2",
      period: "Summer 2024",
      status: "completed",
      courses: [
        "Object-Oriented Programming (C#)",
        "Web Development (JS)",
        "System Design",
        "Data Structures & Algorithms",
      ],
      keySkills: [
        "OOP Principles",
        "JavaScript/DOM",
        "UML Design",
        "Algorithm Analysis",
      ],
      grade: "4.00",
      gpa: 4.0,
      highlights: [
        "Patient Management System",
        "Spider-Man Wiki",
        "Batman's Garage Sale",
      ],
      projects: ["Patient Management App", "Spider-Man Wiki", "Batman Garage Sale"],
    },
    {
      id: 1,
      phase: "Semester 1",
      period: "Winter 2024",
      status: "completed",
      courses: [
        "Programming Basics (C#)",
        "Web Fundamentals",
        "Database Concepts",
        "Math for Computing",
      ],
      keySkills: [
        "C# Programming",
        "HTML/CSS",
        "SQL Basics",
        "Problem Solving",
      ],
      grade: "4.00",
      gpa: 4.0,
      highlights: [
        "Earned Dean's Honor List",
        "Started professional graphic design",
        "Built first portfolio iteration",
      ],
      projects: ["Static Portfolio", "Graphic Design"],
    },
  ],
  achievements: [
    {
      title: "Dean's Honor List",
      subtitle: "Academic Excellence",
      icon: "🏆",
      color: "from-yellow-500 to-orange-500",
      bgColor: "yellow-500/10",
      borderColor: "yellow-500/20",
      description:
        "Consistently maintained a 3.99 GPA across all completed semesters, showing my dedication to learning and quality.",
    },
    {
      title: "Peer Leader",
      subtitle: "Helping Others Grow",
      icon: "👥",
      color: "from-green-500 to-emerald-500",
      bgColor: "green-500/10",
      borderColor: "green-500/20",
      description:
        "I love explaining complex ideas. I've led study sessions for fellow students, helping them grasp tricky programming concepts.",
    },
  ],
  progressStats: {
    completedSemesters: 5,
    currentSemester: 6,
    totalSemesters: 6,
    completedPercentage: 83,
    academicSemestersCompleted: 5,
    totalAcademicSemesters: 6,
  },
};

// Certificates
export const certificates: Certificate[] = [
  {
    id: 1,
    title: "Docker Foundations",
    issuer: "Docker",
    date: "2025",
    skills: ["Docker", "Containers"],
    link: "https://www.linkedin.com/learning/certificates/d0642a9e13d502832d1304a189831c057e02076130689640955d251807c5ab57",
  },
  {
    id: 2,
    title: "React.js Essential Training",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["React"],
    link: "https://www.linkedin.com/learning/certificates/ac295354e31d24fb5ec322b7c989b9bd23ba6afff5b0e4eabf00e9e3a5996c63",
  },
  {
    id: 3,
    title: "C# OOP Tips and Tricks",
    issuer: "LinkedIn Learning",
    date: "2024",
    skills: ["C#", "OOP"],
    link: "https://www.linkedin.com/learning/certificates/4a5faa2b1529f5de2a82b039fde13d6649afca2d0cf7a806b130f5f49018ad09",
  },
];

// In-Progress
export const inProgress: InProgressLearning[] = [
  {
    id: 1,
    title: "AZ-204: Azure Developer",
    source: "Microsoft",
    sourceUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
    sourcePlatform: "Microsoft",
    progress: "45%",
  },
];

// Social Links
export const socials: Social[] = [
  {
    title: "Github",
    iconName: "Github",
    url: "https://www.github.com/ghostp13409",
  },
  {
    title: "LinkedIn",
    iconName: "Linkedin",
    url: "https://www.linkedin.com/in/parth-gajjar09",
  },
  {
    title: "LeetCode",
    iconName: "SiLeetcode",
    url: "https://www.leetcode.com/ghostp134",
  },
];

// Projects (Stories of what I've built)
export const projects: Project[] = [
  {
    id: 1,
    title: "SwiftMove — Moving Services Platform",
    description: "A full-stack marketplace connecting freelance drivers with customers needing moving services. I built this using a modern containerized microservices architecture to ensure it's scalable and robust.",
    tags: ["Java", "Spring Boot", "React", "TypeScript", "Docker", "RabbitMQ", "PostgreSQL"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    learnings: [
      "Secured the platform using JWT and Role-Based Access Control.",
      "Used Docker Compose for seamless development and deployment.",
      "Implemented service discovery with Eureka and routing through an API Gateway.",
      "Handled inter-service communication asynchronously with RabbitMQ.",
    ],
    impact: "Designed a system capable of handling multiple concurrent moving requests with real-time driver tracking.",
  },
  {
    id: 2,
    title: "ModernShop — Microservices Evolution",
    description: "I took a monolithic e-commerce application and evolved it into a microservices platform. This transformation focused on improving scalability for product management and shopping cart services.",
    tags: ["Java", "Spring Cloud", "Docker", "PostgreSQL", "Eureka", "Render"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    webUrl: "https://render.com",
    learnings: [
      "Mastered monolithic to microservices conversion strategies.",
      "Gained experience deploying Docker images to cloud platforms like Render.",
      "Managed distributed databases in a cloud environment.",
    ],
    impact: "Successfully collaborated in a team of 4 to deliver a scalable e-commerce backbone.",
  },
  {
    id: 3,
    title: "Equipment Rental System",
    description: "A real-time platform where users can rent tools and equipment. I integrated live chat and notifications to make the user experience seamless and interactive.",
    tags: ["ASP.NET Core", "C#", "React", "TypeScript", "Redis", "SignalR"],
    completionDate: "2025",
    learnings: [
      "Implemented real-time updates using SignalR.",
      "Built a secure authentication system with Google OAuth and JWT.",
      "Optimized data retrieval using Redis caching.",
    ],
    impact: "Built a production-ready rental system with sub-second notification latency.",
  },
  {
    id: 4,
    title: "WindChime — Mindfulness App",
    description: "A cross-platform app I built to help people practice mindfulness. It features guided meditation and a custom breathing pattern engine with tactile feedback.",
    imageUrl: "images/projects/WindChime.png",
    tags: ["Flutter", "Dart", "SQLite", "Provider", "Haptics"],
    completionDate: "2025",
    contentUrl: "https://github.com/ghostp13409/WindChime",
    learnings: [
      "Designed a clean repository-based architecture in Flutter.",
      "Optimized audio playback for a smooth meditation experience.",
      "Built an offline-first experience using SQLite.",
    ],
    impact: "Delivered a soothing mobile experience with 100% offline functionality.",
  },
  {
    id: 5,
    title: "Car Renting App",
    description: "An Android application for car rentals that keeps data in sync between a local database and the cloud, even when offline.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "SQLite"],
    completionDate: "2025",
    learnings: [
      "Implemented robust data sync between SQLite and Firebase Firestore.",
      "Crafted a modern, reactive UI using Jetpack Compose.",
    ],
  },
  {
    id: 16,
    title: "Spider-Man Wiki",
    description: "A dynamic, visually engaging wiki dedicated to the Spider-Man universe. It's a place for fans to explore characters, stories, and more.",
    imageUrl: "images/projects/spiderman_logo.jpg",
    videoUrl: "images/projects/spierman_wiki.mp4",
    tags: ["JavaScript", "HTML5", "CSS3", "Design"],
    completionDate: "2023",
    learnings: [
      "Focused on creating a highly interactive and cinematic web experience.",
      "Mastered complex CSS animations to bring the theme to life.",
    ],
  },
  {
    id: 17,
    title: "Batman's Garage Sale",
    description: "A themed e-commerce site for the world's greatest detective. I built this to practice order management and creating immersive shopping experiences.",
    imageUrl: "images/projects/batman_logo.jpg",
    videoUrl: "images/projects/batman_shop.mp4",
    tags: ["React", "Express", "MongoDB", "Node.js"],
    completionDate: "2023",
    learnings: [
      "Built a custom order management system from scratch.",
      "Designed a unique, 'dark-mode' focused visual identity.",
    ],
  },
  {
    id: 9,
    title: "Patient Management App",
    description: "A professional desktop application for managing patient files. I applied SOLID principles to ensure the code is clean, testable, and easy to maintain.",
    imageUrl: "images/projects/PatientManager.png",
    tags: ["C#", "Windows Forms", "OOP", "SOLID"],
    completionDate: "2024",
    learnings: [
      "Applied SOLID design principles in a real-world scenario.",
      "Built a user-friendly interface for sensitive data management.",
    ],
  },
  {
    id: 12,
    title: "Automated Trading Bot",
    description: "A Python-based bot that processes real-time market data to execute trades. It's built to be fast, reliable, and data-driven.",
    imageUrl: "images/projects/TradingBot.png",
    tags: ["Python", "Binance API", "WebSockets", "Data"],
    completionDate: "2022",
    learnings: [
      "Built a high-performance real-time data pipeline.",
      "Learned to manage financial API security and rate limiting.",
    ],
  },
  {
    id: 14,
    title: "DSA & Problem Solving",
    description: "I'm constantly sharpening my problem-solving skills. I've solved over 70 algorithmic challenges on LeetCode, focusing on writing efficient and clean code.",
    tags: ["Java", "C#", "Algorithms", "Data Structures"],
    contentUrl: "https://leetcode.com/u/ghostp134/",
    completionDate: "Ongoing",
  },
  {
    id: 15,
    title: "Graphic Design",
    description: "Before I was a full-time developer, I spent time as a graphic designer. I love creating visual identities that tell a brand's story.",
    imageUrl: "images/projects/Design.jpg",
    tags: ["Canva", "Design", "Creativity"],
    completionDate: "2023",
    impact: "Helped several local startups establish their first professional visual identities.",
  },
];

// College Projects (The ones I'm most proud of from school)
export const collegeProjects: Project[] = projects.filter(p => [1, 2, 4, 16, 17].includes(p.id));

// Skills
export const skills: SkillCategory[] = [
  {
    id: 1,
    title: "Languages",
    tags: ["Java", "C#", "Python", "Ruby", "JavaScript", "TypeScript", "Dart", "Kotlin"],
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Frameworks",
    tags: ["Spring Boot", "ASP.NET", "Rails", "React", "Next.js", "Node", "Express", "Flutter", "Jetpack Compose"],
    color: "bg-green-600",
  },
  {
    id: 3,
    title: "Databases & Cloud",
    tags: ["PostgreSQL", "MongoDB", "SQL Server", "SQLite", "Firebase", "Docker", "AWS", "Azure"],
    color: "bg-purple-600",
  },
];

// Hobbies (What I do when I'm not coding)
export const hobbies: Hobby[] = [
  {
    id: 1,
    title: "Doom Eternal ☠️",
    imageUrl: "images/hobbies/doom.jpg",
    description: "Halo maybe infinite, but Doom is Eternal. I've played it 7 times and I'm still not bored of the combat loop.",
  },
  {
    id: 2,
    title: "Game Modding 🎮",
    imageUrl: "images/hobbies/modding.jpg",
    description: "I love modding Bethesda games. I've spent over 450 hours in Skyrim, and honestly, most of that was probably just tweaking my mod list.",
  },
  {
    id: 3,
    title: "Distro Hopping 🐧",
    imageUrl: "images/hobbies/linux.jpg",
    description: "I'm a bit obsessed with Linux. I've tried over 20 distros. Currently, I'm loving Fedora with Hyprland for that perfect mix of stability and rice.",
  },
];

