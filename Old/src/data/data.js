import { Github, Linkedin, Instagram } from "lucide-react";
import { SiLeetcode } from "react-icons/si";

// Education Data
export const education = {
  institution: {
    name: "Conestoga College",
    location: "Ontario, Canada",
    logo: "CC",
    website: "https://www.conestogac.on.ca/"
  },
  program: {
    title: "Advanced Diploma in Computer Programming and Analysis",
    type: "Co-operative Education Program",
    duration: "2024 - 2027",
    gpa: "3.99",
    status: "Full-Time Study",
    totalSemesters: 10,
    completedSemesters: 4, // 3 complete + half of current semester
     // (4 / 10) * 100
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
          phase: "Co-op Term 1",
          period: "Summer 2025",
          status: "upcoming",
          courses: ["Industry Work Experience", "Professional Development", "Workplace Communication"],
          keySkills: ["Industry Experience", "Professional Development", "Real-world Problem Solving"],
          grade: "TBD",
          gpa: null,
          highlights: ["Open to Work", "Industry-Ready Skills", "Professional Network Building"],
          projects: ["TBD - Industry Projects"]
        },
        {
          id: 6,
          phase: "Co-op Term 2", 
          period: "Fall 2025",
          status: "upcoming",
          courses: ["Advanced Industry Experience", "Leadership Development", "Technical Specialization"],
          keySkills: ["Advanced Technical Skills", "Leadership", "Specialization"],
          grade: "TBD",
          gpa: null, 
          highlights: ["Career Advancement", "Technical Leadership", "Industry Connections"],
          projects: ["TBD - Advanced Industry Projects"]
        },
        {
          id: 7,
          phase: "Co-op Term 3",
          period: "Winter 2026", 
          status: "upcoming",
          courses: ["Senior Development Role", "Mentorship Experience", "Industry Innovation"],
          keySkills: ["Senior Development", "Mentoring", "Innovation"],
          grade: "TBD",
          gpa: null,
          highlights: ["Senior Role Experience", "Mentorship Opportunities", "Innovation Projects"],
          projects: ["TBD - Senior Level Projects"]
        },
        {
          id: 8,
          phase: "Co-op Term 4",
          period: "Summer 2026",
          status: "upcoming", 
          courses: ["Capstone Industry Project", "Career Preparation", "Professional Certification"],
          keySkills: ["Capstone Development", "Career Readiness", "Professional Certification"],
          grade: "TBD",
          gpa: null,
          highlights: ["Capstone Project Completion", "Job Readiness", "Industry Certification"],
          projects: ["TBD - Capstone Industry Project"]
        },
        {
          id: 9,
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
          id: 10,
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
          subtitle: "All Semesters (3.99 GPA)",
          icon: "🏆",
          color: "from-yellow-500 to-orange-500",
          bgColor: "yellow-500/10",
          borderColor: "yellow-500/20",
          description: "Consistently maintained excellence with 3.99 GPA across all completed semesters"
        },
        {
          title: "Google Developer",
          subtitle: "Community Member",
          icon: "🌐", 
          color: "from-blue-500 to-cyan-500",
          bgColor: "blue-500/10",
          borderColor: "blue-500/20",
          description: "Active participant in Google Developer Group events and tech community"
        },
        {
          title: "Study Group Leader",
          subtitle: "Peer Mentoring & Tutoring",
          icon: "👥",
          color: "from-green-500 to-emerald-500", 
          bgColor: "green-500/10",
          borderColor: "green-500/20",
          description: "Leading study groups and providing peer tutoring for programming courses"
        },
        {
          title: "Co-op Ready",
          subtitle: "Industry Prepared",
          icon: "💼",
          color: "from-purple-500 to-pink-500",
          bgColor: "purple-500/10", 
          borderColor: "purple-500/20",
          description: "Prepared for professional work environment with industry-relevant skills"
        }
      ],
      progressStats: {
        completedSemesters: 3,
        currentSemester: 4,
        totalSemesters: 10,
        completedPercentage: 35, // (3.5 / 10) * 100
    coopTermsCompleted: 0,
    totalCoopTerms: 4,
    academicSemestersCompleted: 3,
    totalAcademicSemesters: 6
  }
};

// Certificates

export const Certificates = [
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

export const inProgress = [
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
export const socials = [
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
export const projects = [
  {
    id: 0,
    title: "WindChime - A Mindfulness App",
    description:
      "WindChime is a flutter-based cross-platform mindfulness application designed to help users achieve better mental well-being through guided meditation, breathwork exercises, and mindfulness practices. The app provides a clean and intuitive interface for users to explore various meditation techniques and track their progress.",
    imageUrl: "images/projects/WindChime.png",
    tags: ["Flutter", "Dart", "Firebase", "REST API", "State Management"],
    contnetUrl: "https://github.com/ghostp13409/WindChime",
    completionDate: "2025",
    setup: ["Windows, VS Code, Android Studio"],
    webUrl: "images/projects/WindChime.png",
  },
  {
    id: 1,
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
    contnetUrl: "https://leetcode.com/u/ghostp134/",
    completionDate: "Since 2023",
    setup: ["Windows, Java, C#"],
    webUrl:
      "https://leetcode-stats.vercel.app/api?username=ghostp134&theme=Dark",
  },
  {
    id: 2,
    title: "LMS – Learning Management System (Open Source)",
    description:
      'Designed and integrated core system component "Progress Items". Developed comprehensive test cases for seamless system integration. Maintained and improved documentation and code formatting.',
    webUrl:
      "https://socialify.git.ci/ehharvey/lms-2024/image?font=Inter&issues=1&language=1&name=1&pattern=Solid&stargazers=1&theme=Dark",
    tags: ["C#", "Entity Framework", "SQLite", "Testing"],
    imageUrl: "images/projects/LMS.jpg",
    contnetUrl: "https://github.com/ehharvey/lms-2024",
    completionDate: "2024",
    setup: ["Windows, Visual Studio"],
  },
  {
    id: 3,
    title: "Web Scraper",
    description:
      "Developed Selenium-based web scrapers for stock and price monitoring on local retail sites. Implemented customized SMS-based alerts using IFTTT APIs, resulting in an early edge on stock details in a competitive market.",
    imageUrl: "images/projects/WEB.jpg",
    webUrl: "images/projects/WebScrapper.png",
    tags: ["Python", "Selenium", "BeautifulSoup", "IFTTT"],
    contnetUrl:
      "https://github.com/ghostp13409/ProjectGraveyard/tree/main/WebScrapers",
    completionDate: "2022",
    setup: ["Ubuntu, PyCharm, IFTTT"],
  },
  {
    id: 4,
    title: "Trading Bot",
    description:
      "Strategized a volatility-based trading bot. Designed the trading algorithm and simulated paper trading for testing. Deployed and experimented on the Binance platform for performance tuning.",
    imageUrl: "images/projects/Trading.jpg",
    webUrl: "images/projects/TradingBotPreview.png",
    tags: ["Python", "API", "sqlalchemy", "Pandas", "Web Sockets"],
    contnetUrl:
      "https://github.com/ghostp13409/ProjectGraveyard/tree/main/WebScrapers",
    completionDate: "2022",
    setup: ["Fedora, VS Code"],
  },
  {
    id: 5,
    title: "Patient Management App",
    description: "An fullfledged application for managing patient files.",
    imageUrl: "images/projects/coding_templete.jpg",
    webUrl: "images/projects/PatientManager.png",
    tags: ["C#", "Windows Forms", "OOP", "SOLID"],
    completionDate: "2024",
    setup: ["Windows, Visual Studio"],
  },
  {
    id: 6,
    title: "Personal Portfolio Website",
    description:
      "Modern, responsive portfolio website built with React, featuring dark mode, smooth animations, and dynamic content loading. Implements best practices in web development including component-based architecture and responsive design.",
    imageUrl: "images/projects/Portfolio.jpg",
    tags: ["React", "Tailwind CSS", "Component Architecture"],
    contnetUrl: "https://github.com/ghostp13409/ghostp13409.github.io",
    completionDate: "2024",
    setup: ["VS Code, Node.js, Git"],
  },
];

// Skills
export const Skills = [
  {
    id: 1,
    title: "Languages",
    tags: ["Java", "C#", "Python", "JavaScript", "HTML", "CSS"],
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Frameworks and Databases",
    tags: ["React", "Express.js", "ASP.NET", "Node", "Entity Framework", "EJS"],
    color: "bg-green-600",
  },
  {
    id: 3,
    title: "Databases",
    tags: ["MySQL", "SQLite", "MongoDB"],
    color: "bg-purple-600",
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
    color: "bg-sky-900",
  },
  {
    id: 5,
    title: "Tools",
    tags: ["Postman", "Git", "VS Code", "Tailwind CSS", "Bootstrap", "LINQ"],
    color: "bg-fuchsia-500",
  },
];

export const CollageProjects = [
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

export const Hobbies = [
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
      "I love modding games. Mostly Bathesda games. I got 450 hrs in skyrim and 400 of them would most probably be modding. My current obsession is starfield.",
  },
  {
    id: 3,
    title: "Distro Hopping 🐧",
    imageUrl: "images/hobbies/linux.jpg",
    description:
      "Borderline obsessed with Distro hopping. I've tried 20+ distros and I'm currently using Fedora. I'm trying out hyprland and really loving it!",
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
