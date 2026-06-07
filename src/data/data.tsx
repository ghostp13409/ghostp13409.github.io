import { Github, Linkedin, Instagram } from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import type {
  Education,
  Certificate,
  InProgressLearning,
  Social,
  Project,
  Skill,
  CollageProject,
  Hobby
} from "../types/portfolio";

// Education Data
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

// Certificates
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

// In-Progress Learnings and Certificates
export const inProgress: InProgressLearning[] = [
  {
    id: 1,
    title: "AZ-204: Azure Developer Associate",
    source: "Microsoft Certified: Azure Developer Associate",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/?practice-assessment-type=certification",
    sourcePlatform: "Microsoft",
    progress: "40%",
  },
  {
    id: 2,
    title: "Kubernetes",
    source: "Getting Started with Kubernetes",
    sourceUrl:
      "https://www.linkedin.com/learning/paths/getting-started-with-kubernetes",
    sourcePlatform: "LinkedIn Learning",
    progress: "12%",
  },
  {
    id: 3,
    title: "Spring MVC",
    source: "Spring MVC Tutorial Project For Beginners",
    sourceUrl:
      "https://www.youtube.com/playlist?list=PL82C6-O4XrHejlASdecIsroNEbZFYo_X1",
    sourcePlatform: "YouTube",
    progress: "47%",
  },
];

// Social Links
export const socials: Social[] = [
  {
    title: "Github",
    Icon: <Github className="w-6 h-6" />,
    url: "https://www.github.com/ghostp13409",
  },
  {
    title: "LinkedIn",
    Icon: <Linkedin color="#1c71d8" className="w-6 h-6" />,
    url: "https://www.linkedin.com/in/parth-gajjar09",
  },
  {
    title: "LeetCode",
    Icon: <SiLeetcode color="#ff7800" className="w-6 h-6" />,
    url: "https://www.leetcode.com/ghostp134",
  },
  {
    title: "Instagram",
    Icon: <Instagram color="#f66151" className="w-6 h-6" />,
    url: "https://www.instagram.com/p_13_4/profilecard/?igsh=MTBrbThrNHc1aWR3NA==",
  },
];

// Projects
export const projects: Project[] = [
  {
    id: 0,
    title: "SwiftMove",
    description: "A full-stack marketplace connecting freelance drivers with customers needing moving services. I built this using a modern containerized microservices architecture to ensure it's scalable and robust.",
    tags: ["Java", "Spring Boot", "React", "TypeScript", "Docker", "RabbitMQ", "PostgreSQL"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    imageUrl: "images/projects/coding_templete.jpg",
    setup: ["Omarchy", "Gemini CLI", "Docker-Compose", "Cloudflare Tunnel"],
    learnings: [
      "Secured the platform using JWT and Role-Based Access Control.",
      "Used Docker Compose for seamless development and deployment.",
      "Implemented service discovery with Eureka and routing through an API Gateway.",
      "Handled inter-service communication asynchronously with RabbitMQ.",
    ],
    impact: "Designed a system capable of handling multiple concurrent moving requests with real-time driver tracking.",
  },
  {
    id: 1,
    title: "WindChime",
    description:
      "WindChime is a flutter-based cross-platform mindfulness application designed to help users achieve better mental well-being through guided meditation, breathwork exercises, and mindfulness practices. The app provides a clean and intuitive interface for users to explore various meditation techniques and track their progress.",
    imageUrl: "images/projects/WindChime.png",
    tags: ["Flutter", "Dart", "Firebase", "REST API", "State Management"],
    contentUrl: "https://github.com/ghostp13409/WindChime",
    completionDate: "2025",
    setup: ["Windows, VS Code, Android Studio"],
    webUrl: "images/projects/WindChime.png",
    liveAppUrl: "windchime-preview/index.html",
    isMobileApp: true,
  },
  {
    id: 2,
    title: "Toss-api",
    description: "Toss-api is a blazing fast, Vim-inspired TUI and CLI API client built in Rust. It brings the power of full-featured API testing into your terminal, allowing you to seamlessly manage collections, environments, and requests without leaving your keyboard.",
    imageUrl: "images/projects/toss.png",
    tags: ["Rust", "Ratatui", "REST API", "CLI"],
    contentUrl: "https://github.com/ghostp13409/toss-api",
    completionDate: "2026",
    setup: ["Rust, Omarchy, Zed"],
    webUrl: "images/projects/toss-demo.gif",
  },
  {
    id: 3,
    title: "DSA Exercises",
    description:
      "Solved 70+ algorithmic problems on LeetCode. Analyzed time and space complexity for multiple algorithms, ensuring efficient and scalable solutions. Implemented and optimized algorithms for sorting, searching, and dynamic programming, reducing computation time by 30%.",
    imageUrl: "images/projects/DSA.jpg",
    tags: [
      "Java",
      "C#",
      "Searching",
      "Sorting",
      "Recursion",
      "Time-Space Complexity",
    ],
    contentUrl: "https://leetcode.com/u/ghostp134/",
    completionDate: "Since 2023",
    setup: ["Windows, Java, C#"],
    webUrl:
      "https://leetcode-stats.vercel.app/api?username=ghostp134&theme=Dark",
  },
  {
    id: 4,
    title: "Equipment Rental System",
    description: "A real-time platform where users can rent tools and equipment. I integrated live chat and notifications to make the user experience seamless and interactive.",
    tags: ["ASP.NET Core", "C#", "React", "TypeScript", "Redis", "SignalR"],
    completionDate: "2025",
    imageUrl: "images/projects/coding_templete.jpg",
    setup: ["VS Code", "Docker", "Render.com"],
    learnings: [
      "Implemented real-time updates using SignalR.",
      "Built a secure authentication system with Google OAuth and JWT.",
      "Optimized data retrieval using Redis caching.",
    ],
    impact: "Built a production-ready rental system with sub-second notification latency.",
  },
  {
    id: 5,
    title: "ModernShop",
    description: "I took a monolithic e-commerce application and evolved it into a microservices platform. This transformation focused on improving scalability for product management and shopping cart services.",
    tags: ["Java", "Spring Cloud", "Docker", "PostgreSQL", "Eureka", "Render"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    webUrl: "https://render.com",
    imageUrl: "images/projects/coding_templete.jpg",
    setup: ["VS Code", "Docker", "Render.com"],
    learnings: [
      "Mastered monolithic to microservices conversion strategies.",
      "Gained experience deploying Docker images to cloud platforms like Render.",
      "Managed distributed databases in a cloud environment.",
    ],
    impact: "Successfully collaborated in a team of 4 to deliver a scalable e-commerce backbone.",
  },
  {
    id: 6,
    title: "LMS – Learning Management System (Open Source)",
    description:
      'Designed and integrated core system component "Progress Items". Developed comprehensive test cases for seamless system integration. Maintained and improved documentation and code formatting.',
    webUrl:
      "https://socialify.git.ci/ehharvey/lms-2024/image?font=Inter&issues=1&language=1&name=1&pattern=Solid&stargazers=1&theme=Dark",
    tags: ["C#", "Entity Framework", "SQLite", "Testing"],
    imageUrl: "images/projects/LMS.jpg",
    contentUrl: "https://github.com/ehharvey/lms-2024",
    completionDate: "2024",
    setup: ["Windows, Visual Studio"],
  },
  {
    id: 7,
    title: "SwiftDrive",
    description: "An Android application for car rentals that keeps data in sync between a local database and the cloud, even when offline.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "SQLite"],
    completionDate: "2025",
    imageUrl: "images/projects/coding_templete.jpg",
    setup: ["VS Code", "Android Studio", "Firebase"],
    learnings: [
      "Implemented robust data sync between SQLite and Firebase Firestore.",
      "Crafted a modern, reactive UI using Jetpack Compose.",
    ],
  },
  {
    id: 8,
    title: "Personal Portfolio Website",
    description:
      "Modern, responsive portfolio website built with React, featuring dark mode, smooth animations, and dynamic content loading. Implements best practices in web development including component-based architecture and responsive design.",
    imageUrl: "images/projects/Portfolio.jpg",
    tags: ["React", "Tailwind CSS", "Component Architecture"],
    contentUrl: "https://github.com/ghostp13409/ghostp13409.github.io",
    completionDate: "2024",
    setup: ["VS Code, Node.js, Git"],
  },
  {
    id: 9,
    title: "Web Scraper",
    description:
      "Developed Selenium-based web scrapers for stock and price monitoring on local retail sites. Implemented customized SMS-based alerts using IFTTT APIs, resulting in an early edge on stock details in a competitive market.",
    imageUrl: "images/projects/WEB.jpg",
    webUrl: "images/projects/WebScrapper.png",
    tags: ["Python", "Selenium", "BeautifulSoup", "IFTTT"],
    contentUrl:
      "https://github.com/ghostp13409/ProjectGraveyard/tree/main/WebScrapers",
    completionDate: "2022",
    setup: ["Ubuntu, PyCharm, IFTTT"],
  },
  {
    id: 10,
    title: "Trading Bot",
    description:
      "Strategized a volatility-based trading bot. Designed the trading algorithm and simulated paper trading for testing. Deployed and experimented on the Binance platform for performance tuning.",
    imageUrl: "images/projects/Trading.jpg",
    webUrl: "images/projects/TradingBotPreview.png",
    tags: ["Python", "API", "sqlalchemy", "Pandas", "Web Sockets"],
    contentUrl:
      "https://github.com/ghostp13409/ProjectGraveyard/tree/main/WebScrapers",
    completionDate: "2022",
    setup: ["Fedora, VS Code"],
  },
  {
    id: 11,
    title: "Patient Management App",
    description: "An fullfledged application for managing patient files.",
    imageUrl: "images/projects/coding_templete.jpg",
    webUrl: "images/projects/PatientManager.png",
    tags: ["C#", "Windows Forms", "OOP", "SOLID"],
    completionDate: "2024",
    setup: ["Windows, Visual Studio"],
  },
];

// Skills
export const Skills: Skill[] = [
  {
    id: 1,
    title: "Languages",
    tags: ["Java", "C#", "Python", "JavaScript", "HTML", "CSS"],
  },
  {
    id: 2,
    title: "Frameworks and Databases",
    tags: ["React", "Express.js", "ASP.NET", "Node", "Entity Framework", "EJS"],
  },
  {
    id: 3,
    title: "Databases",
    tags: ["MySQL", "SQLite", "MongoDB"],
  },
  {
    id: 4,
    title: "Data Structures and Algorithms",
    tags: [
      "Arrays",
      "Stacks",
      "Queues",
      "Hash Tables",
      "Binary Serach",
      "Two-Pointer",
      "Bubble Sort",
      "Insertion Sort",
      "Selection Sort",
      "Merge Sort",
    ],
  },
  {
    id: 5,
    title: "Tools",
    tags: ["Postman", "Git", "VS Code", "Tailwind CSS", "Bootstrap", "LINQ"],
  },
];

export const CollageProjects: CollageProject[] = [
  {
    id: 1,
    title: "Spiderman Wiki",
    description: "An Awesome website about Insomniac's Spider-Man Game.",
    imageUrl: "images/projects/spierman_wiki.mp4",
    tags: ["HTML", "CSS"],
    thumbnailUrl: "images/projects/spiderman_logo.jpg",
  },
  {
    id: 2,
    title: "Batman Garage Sale",
    description:
      "A Batman-themed e-commerce site built with Express.js and MongoDB, offering seamless user experience, data validation, and responsive design.",
    imageUrl: "images/projects/batman_shop.mp4",
    tags: ["JavaScript", "Express", "MongoDB", "EJS", "HTML", "CSS"],
    thumbnailUrl: "images/projects/batman_logo.jpg",
  },
];

export const DSACont = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center">DSA Contests</h1>
      <div className="flex flex-row items-center justify-center">
        <a href="https://www.codechef.com/">
          <img
            src="images/DSA/codechef.png"
            alt="CodeChef"
            className="w-20 h-20 m-4"
          />
        </a>
        <a href="https://www.codeforces.com/">
          <img
            src="images/DSA/codeforces.png"
            alt="Codeforces"
            className="w-20 h-20 m-4"
          />
        </a>
        <a href="https://www.hackerrank.com/">
          <img
            src="images/DSA/hackerrank.png"
            alt="HackerRank"
            className="w-20 h-20 m-4"
          />
        </a>
        <a href="https://www.leetcode.com/">
          <img
            src="images/DSA/leetcode.png"
            alt="LeetCode"
            className="w-20 h-20 m-4"
          />
        </a>
      </div>
    </div>
  );
};

export const Hobbies: Hobby[] = [
  {
    id: 1,
    title: "Doom Eternal ☠️",
    imageUrl: "images/hobbies/doom.jpg",
    description:
      "Halo maybe infinite, but Doom is Eternal. I've played it 7 times and you'll probably find me playing it again.",
  },
  {
    id: 2,
    title: "Game Modding 🎮",
    imageUrl: "images/hobbies/modding.jpg",
    description:
      "I love modding games. Mostly Bathesda games. I got 450 hrs in skyrim and 400 of them would most probably be modding. My current obsession is rdr2.",
  },
  {
    id: 3,
    title: "Distro Hopping 🐧",
    imageUrl: "images/hobbies/linux.jpg",
    description:
      "Borderline obsessed with Distro hopping. I've tried 20+ distros and I'm currently using Omarchy. I'm trying out hyprland and really loving it!",
  },
  {
    id: 4,
    title: "Binge Watching 🎥",
    imageUrl: "images/hobbies/netflix.jpg",
    description:
      "It would be a lie if I said I watch a lot of new content. I just re-watch my comfort shows. After 7th run of HIMYM and 5th run of GOT, I'm currently on my 3rd run of Prison Break.",
  },
  {
    id: 5,
    title: "Badminton 🏸",
    imageUrl: "images/hobbies/badminton.jpg",
    description:
      "That's right, I'm not only a screen junkie. I love some Sports too. I'm pretty good at badminton. However, havn't played it over a year now. Would love to play again.",
  },
  {
    id: 6,
    title: "Swimming 🏊🏻‍♂️",
    imageUrl: "images/hobbies/swimming.jpg",
    description:
      "I love swimming. My instructor told me I could go national. That was a long time ago and I've quit swimmning since ages, but I still like to brag. I'm trying to get back into it.",
  },
];
