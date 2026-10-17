import type { Project, CollageProject } from "../types/portfolio";

export const projects: Project[] = [
  {
    id: 0,
    title: "SwiftMove",
    description:
      "A full-stack marketplace connecting freelance drivers with customers who need moving services, built on a containerized microservices architecture designed to scale.",
    tags: ["Java", "Spring Boot", "React", "TypeScript", "Docker", "RabbitMQ", "PostgreSQL"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    imageUrl: "images/projects/swiftmove.png",
    videoUrl: "videos/projects/swiftmove.mp4",
    setup: ["Omarchy", "Gemini CLI", "Docker Compose", "Cloudflare Tunnel"],
    learnings: [
      "Secured the platform with JWT authentication and role-based access control.",
      "Used Docker Compose for a reproducible development and deployment workflow.",
      "Implemented service discovery with Eureka and routing through an API Gateway.",
      "Handled inter-service communication asynchronously with RabbitMQ.",
    ],
    impact:
      "Designed a system that handles multiple concurrent moving requests with real-time driver tracking.",
    platform: "Web",
  },
  {
    id: 1,
    title: "WindChime",
    description:
      "A Flutter-based cross-platform mindfulness app with guided meditation, breathwork exercises, and progress tracking, wrapped in a clean, calming interface.",
    imageUrl: "images/projects/WindChime.png",
    tags: ["Flutter", "Dart", "Firebase", "REST API", "State Management"],
    contentUrl: "https://github.com/ghostp13409/WindChime",
    completionDate: "2025",
    setup: ["Windows", "VS Code", "Android Studio"],
    webUrl: "images/projects/WindChime.png",
    liveAppUrl: "windchime-preview/index.html",
    isMobileApp: true,
    platform: "Mobile",
  },
  {
    id: 2,
    title: "Toss-api",
    description:
      "A fast, Vim-inspired TUI and CLI API client written in Rust. Manage collections, environments, and requests without leaving the terminal.",
    imageUrl: "images/projects/toss.png",
    tags: ["Rust", "Ratatui", "REST API", "CLI"],
    contentUrl: "https://github.com/ghostp13409/toss-api",
    completionDate: "2026",
    setup: ["Rust", "Omarchy", "Zed"],
    webUrl: "images/projects/toss-demo.gif",
    platform: "CLI",
  },
  {
    id: 3,
    title: "DSA Practice",
    description:
      "Solved 70+ algorithmic problems on LeetCode, analyzing time and space complexity and implementing optimized sorting, searching, and dynamic programming solutions.",
    // The hosted LeetCode stats image (readmecodegen.com) now returns 404, so use a local image.
    imageUrl: "images/projects/DSA.jpg",
    tags: ["Java", "C#", "Searching", "Sorting", "Recursion", "Time-Space Complexity"],
    contentUrl: "https://leetcode.com/u/ghostp134/",
    completionDate: "Since 2023",
    setup: ["Java", "C#"],
    platform: "LeetCode",
  },
  {
    id: 4,
    title: "Equipment Rental System",
    description:
      "A real-time platform for renting tools and equipment, with live chat and instant notifications for a seamless rental experience.",
    tags: ["ASP.NET Core", "C#", "React", "TypeScript", "Redis", "SignalR"],
    completionDate: "2025",
    imageUrl: "images/projects/coding_templete.jpg",
    videoUrl: "videos/projects/ERS.mp4",
    setup: ["VS Code", "Docker", "Render"],
    learnings: [
      "Implemented real-time updates with SignalR.",
      "Built a secure authentication flow with Google OAuth and JWT.",
      "Optimized data retrieval with Redis caching.",
    ],
    impact: "Delivered a production-ready rental system with sub-second notification latency.",
    platform: "Web",
  },
  {
    id: 5,
    title: "ModernShop",
    description:
      "Evolved a monolithic e-commerce application into a microservices platform, improving scalability for the product catalogue and shopping cart services.",
    tags: ["Java", "Spring Cloud", "Docker", "PostgreSQL", "Eureka", "Render"],
    completionDate: "2026",
    contentUrl: "https://github.com/ghostp13409",
    imageUrl: "images/projects/coding_templete.jpg",
    setup: ["VS Code", "Docker", "Render"],
    learnings: [
      "Applied monolith-to-microservices decomposition strategies.",
      "Deployed Docker images to a cloud platform (Render).",
      "Managed distributed databases in a cloud environment.",
    ],
    impact: "Collaborated in a team of four to deliver a scalable e-commerce backbone.",
    platform: "Web",
  },
  {
    id: 6,
    title: "LMS – Learning Management System",
    description:
      'Open-source contribution: designed and integrated the core "Progress Items" component, wrote integration test cases, and improved documentation and code formatting.',
    webUrl:
      "https://socialify.git.ci/ehharvey/lms-2024/image?font=Inter&issues=1&language=1&name=1&pattern=Solid&stargazers=1&theme=Dark",
    tags: ["C#", "Entity Framework", "SQLite", "Testing", "Open Source"],
    imageUrl: "images/projects/LMS.jpg",
    contentUrl: "https://github.com/ehharvey/lms-2024",
    completionDate: "2024",
    setup: ["Windows", "Visual Studio"],
    platform: "Web",
  },
  {
    id: 7,
    title: "SwiftDrive",
    description:
      "An Android car-rental app that keeps data in sync between a local database and the cloud, even when the device is offline.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "SQLite"],
    completionDate: "2025",
    imageUrl: "images/projects/swiftdrive.png",
    setup: ["Android Studio", "Firebase"],
    platform: "Mobile",
    learnings: [
      "Implemented robust data sync between SQLite and Firebase Firestore.",
      "Crafted a modern, reactive UI with Jetpack Compose.",
    ],
    screenshots: [
      "images/projects/SwiftDrive/dashboard.png",
      "images/projects/SwiftDrive/Cars.png",
      "images/projects/SwiftDrive/Customer.png",
      "images/projects/SwiftDrive/rentals.png",
      "images/projects/SwiftDrive/login.png",
    ],
  },
  {
    id: 8,
    title: "Personal Portfolio Website",
    description:
      "This site. A responsive React and TypeScript portfolio with code-split sections, Framer Motion animations, and a Tailwind CSS design system.",
    imageUrl: "images/projects/Portfolio.jpg",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    contentUrl: "https://github.com/ghostp13409/ghostp13409.github.io",
    completionDate: "2024",
    setup: ["VS Code", "Node.js", "Git"],
    platform: "Web",
  },
  {
    id: 9,
    title: "Web Scraper",
    description:
      "Selenium-based scrapers for stock and price monitoring on local retail sites, with SMS alerts via the IFTTT API for an early edge on restocks.",
    imageUrl: "images/projects/WEB.jpg",
    webUrl: "images/projects/WebScrapper.png",
    tags: ["Python", "Selenium", "BeautifulSoup", "IFTTT"],
    contentUrl: "https://github.com/ghostp13409/ProjectGraveyard/tree/main/WebScrapers",
    completionDate: "2022",
    setup: ["Ubuntu", "PyCharm", "IFTTT"],
    platform: "CLI",
  },
  {
    id: 10,
    title: "Trading Bot",
    description:
      "A volatility-based trading bot. Designed the trading algorithm, validated it with simulated paper trading, and tuned it live on the Binance platform.",
    imageUrl: "images/projects/Trading.jpg",
    webUrl: "images/projects/TradingBotPreview.png",
    tags: ["Python", "Binance API", "SQLAlchemy", "Pandas", "WebSockets"],
    contentUrl: "https://github.com/ghostp13409/ProjectGraveyard",
    completionDate: "2022",
    setup: ["Fedora", "VS Code"],
    platform: "CLI",
  },
  {
    id: 11,
    title: "Patient Management App",
    description:
      "A desktop application for managing patient records, built with Windows Forms and structured around SOLID principles.",
    imageUrl: "images/projects/coding_templete.jpg",
    webUrl: "images/projects/PatientManager.png",
    tags: ["C#", "Windows Forms", "OOP", "SOLID"],
    completionDate: "2024",
    setup: ["Windows", "Visual Studio"],
    platform: "Windows",
  },
];

export const CollageProjects: CollageProject[] = [
  {
    id: 1,
    title: "Spider-Man Wiki",
    description: "A fan wiki for Insomniac's Spider-Man game, built with hand-written HTML and CSS.",
    imageUrl: "images/projects/spierman_wiki.mp4",
    tags: ["HTML", "CSS"],
    thumbnailUrl: "images/projects/spiderman_logo.jpg",
    year: 2024,
  },
  {
    id: 2,
    title: "Batman Garage Sale",
    description:
      "A Batman-themed e-commerce site built with Express.js and MongoDB, with server-side validation and a responsive layout.",
    imageUrl: "images/projects/batman_shop.mp4",
    tags: ["JavaScript", "Express", "MongoDB", "EJS", "HTML", "CSS"],
    thumbnailUrl: "images/projects/batman_logo.jpg",
    year: 2024,
  },
];
