import { Github, Linkedin, Instagram } from "lucide-react";
import { SiLeetcode } from "react-icons/si";

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
    title: "Kubernetes",
    source: "Getting Started with Kubernetes",
    sourceUrl:
      "https://www.linkedin.com/learning/paths/getting-started-with-kubernetes",
    sourcePlatform: "LinkedIn Learning",
    progress: "12%",
  },
  {
    id: 2,
    title: "Spring MVC",
    source: "Spring MVC Tutorial Project For Beginners",
    sourceUrl:
      "https://www.youtube.com/playlist?list=PL82C6-O4XrHejlASdecIsroNEbZFYo_X1",
    sourcePlatform: "YouTube",
    progress: "47%",
  },
  {
    id: 3,
    title: "Cloud Computing",
    source: "Azure Fundamentals AZ-900",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/?practice-assessment-type=certification",
    sourcePlatform: "Microsoft",
    progress: "5%",
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
