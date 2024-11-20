import { useEffect, useState } from "react";
import { Brain, Heart, Rocket, Sparkles } from "lucide-react";
import { socials } from "./data";

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "skills", "projects", "hire"];

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "-50% 0px",
        threshold: 0,
      });

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const NavButton = ({ section, label, icon: Icon }) => (
    <>
      <button
        onClick={() => scrollToSection(section)}
        className={`
          w-full text-left py-3 px-6 rounded-lg mb-2 transition-all duration-300 
          relative overflow-hidden group flex items-center gap-4
          ${
            activeSection === section
              ? "bg-blue-600 text-white font-bold"
              : "text-gray-300 hover:bg-gray-700"
          }
        `}
      >
        <Icon size={18} className="relative z-10" />
        <span className="relative z-10">{label}</span>
        <div
          className={`
            absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400
            transform transition-transform duration-300
            ${activeSection === section ? "translate-x-0" : "-translate-x-full"}
            group-hover:translate-x-0
          `}
        ></div>
      </button>
    </>
  );
  return (
    <div className="w-64 bg-gray-800 p-6 flex flex-col shadow-xl rounded-lg">
      <div className="flex flex-col items-center mb-8">
        <img
          src="images/profile_logo.jpeg"
          className="w-26 h-26 bg-gray-700 rounded-full mb-4 hover:scale-110 transition-transform duration-300"
          alt="Profile logo"
        />
        <h2 className="text-xl font-bold">Parth Gajjar</h2>
        <p className="text-gray-400">Developer</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <NavButton section="intro" icon={Sparkles} label="Intro" />
        <NavButton section="skills" icon={Brain} label="Skills" />
        <NavButton section="projects" icon={Rocket} label="Projects" />
        <NavButton section="hire" icon={Heart} label="Get in touch" />
      </nav>
      <div className="flex gap-4">
        {socials.map((social) => (
          <a
            href={social.url}
            className="p-2 bg-gray-800 rounded-lg transform transition-all duration-300 hover:scale-110 hover:bg-gray-700"
          >
            {social.Icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
