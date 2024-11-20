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
  },
  {
    id: 2,
    title: "LMS – Learning Management System (Open Source)",
    description:
      'Designed and integrated core system component "Progress Items". Developed comprehensive test cases for seamless system integration. Maintained and improved documentation and code formatting.',
    imageUrl: "images/projects/LMS.jpg",
    tags: ["C#", "Entity Framework", "SQLite", "Testing"],
  },
  {
    id: 3,
    title: "Web Scrapper",
    description:
      "Developed Selenium-based web scrapers for stock and price monitoring on local retail sites. Implemented customized SMS-based alerts using IFTTT APIs, resulting in an early edge on stock details in a competitive market.",
    imageUrl: "images/projects/WEB.jpg",
    tags: ["Python", "Selenium", "BeautifulSoup"],
  },
  {
    id: 4,
    title: "Trading Bot",
    description:
      "Strategized a volatility-based trading bot. Designed the trading algorithm and simulated paper trading for testing. Deployed and experimented on the Binance platform for performance tuning.",
    imageUrl: "images/projects/Trading.jpg",
    tags: ["Python", "API", "sqlalchemy", "Pandas", "Web Sockets"],
  },
  {
    id: 5,
    title: "Graphic Design",
    description:
      "Designed a visually appealing Logos, Posters, Brochures for a local business.",
    imageUrl: "images/projects/Design.jpg",
    tags: ["Canva", "Design", "Creativity"],
  },
  {
    id: 6,
    title: "Patient Management App",
    description: "An fullfledged application for managing patient files.",
    imageUrl: "images/projects/coding_templete.jpg",
    tags: ["C#", "Windows Forms", "OOP", "SOLID"],
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
    description: "An Awesome website about Insomaniac's Spider Man Game.",
    imageUrl: "images/projects/spierman_wiki.mp4",
    tags: ["HTML", "CSS"],
    thumbnailUrl: "images/projects/spiderman_logo.jpg",
  },
  {
    id: 2,
    title: "Batman Garage Sale",
    description: "An E-Commerse website with a bit of flavour.",
    imageUrl: "images/projects/batman_shop.mp4",
    tags: ["JavaScript", "Express", "MongoDB", "EJS"],
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
