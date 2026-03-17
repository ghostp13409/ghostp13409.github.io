import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ThemeToggle from "../ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [activeSection, setActiveSection] = useState("intro");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<any>(null);

  const sections = ["intro", "journey", "hire"];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Detect section when it reaches the top 20-30% of viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // If we're scrolling via a click, ignore observer updates
      if (isManualScrolling.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Give components a moment to mount before observing
    const timer = setTimeout(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    isManualScrolling.current = true;
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Reset the manual scroll flag after the smooth scroll finishes
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 1000); // 1s is standard smooth scroll duration
  };

  return (
    <div className="bg-page-bg min-h-screen transition-colors duration-400">
      <ThemeToggle />
      <Navbar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[60] bg-page-bg/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm z-[70] bg-page-bg border-r border-black/5 dark:border-white/5"
            >
              <Sidebar
                isMobile={true}
                activeSection={activeSection}
                onMenuItemClick={(id) => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(id);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex w-full">
        {/* Sticky Integrated Navigation */}
        <aside className="hidden lg:block w-[280px] h-screen sticky top-0 border-r border-black/5 dark:border-white/5 bg-page-bg overflow-y-auto custom-scrollbar transition-colors duration-400">
          <Sidebar 
            activeSection={activeSection} 
            onMenuItemClick={handleNavClick}
          />
        </aside>

        {/* Fluid Content Area */}
        <main className="flex-1 w-full min-h-screen bg-page-bg transition-colors duration-400">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;