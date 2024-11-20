import { useState, useEffect } from "react";

const [activeSection, setActiveSection] = useState("skills");

useEffect(() => {
  const handleScroll = () => {
    const sections = ["skills", "projects", "education", "hire"];

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
