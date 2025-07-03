import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SkillsPage from "./SkillsPage";
import ProjectsPage from "./ProjectsPage";
import ContactPage from "./ContactPage";
import IntroPage from "./IntroPage";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-sidebar') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-6 left-0 right-0 z-50 bg-gray-800/95 backdrop-blur-md border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img
              src="images/profile_logo.jpeg"
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
              alt="Profile"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-100">Parth Gajjar</h1>
              <p className="text-sm text-gray-400">Software Developer</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-button p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors z-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="mobile-sidebar fixed top-20 right-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isMobile={true}
              onMenuItemClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex h-screen p-4 rounded">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-24 lg:pt-0">
          <div className="h-screen lg:h-screen p-0 lg:p-4 lg:rounded">
            <div className="h-full overflow-y-auto lg:rounded-lg lg:border-2 lg:border-gray-800">
              {/* Intro Section */}
              <IntroPage />

              {/* Skills Section */}
              <SkillsPage />

              {/* Projects Section */}
              <ProjectsPage />

              {/* Hire Me Section */}
              <ContactPage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
