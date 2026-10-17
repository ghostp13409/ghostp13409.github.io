import { useEffect, useState } from "react";
import type { FC } from "react";
import { Brain, Heart, Rocket, Sparkles, User, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { socials } from "../data";

interface SidebarProps {
  isMobile?: boolean;
  onMenuItemClick?: () => void;
}

interface NavButtonProps {
  section: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  isMobile: boolean;
  onClick: (section: string) => void;
}

const NAV_ITEMS: { section: string; label: string; icon: LucideIcon }[] = [
  { section: "intro", label: "Introduction", icon: Sparkles },
  { section: "experience", label: "Experience", icon: Briefcase },
  { section: "skills", label: "Skills & Education", icon: Brain },
  { section: "projects", label: "Projects", icon: Rocket },
  { section: "hire", label: "Get in touch", icon: Heart },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.section);
const DESKTOP_QUERY = "(min-width: 1024px)";

const NavButton: FC<NavButtonProps> = ({ section, label, icon: Icon, isActive, isMobile, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(section)}
      aria-current={isActive ? "true" : undefined}
      className={`
        w-full text-left ${isMobile ? "py-3 px-4 mb-2 gap-3" : "py-3 px-5 mb-3 gap-4"}
        rounded-md relative overflow-hidden group flex items-center backdrop-blur-sm
        transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-primary/20 text-primary font-semibold border border-primary/30 shadow-[inset_4px_0_0_0_var(--color-primary)]"
            : "text-ink/60 hover:bg-surface/50 border border-border/30 hover:border-border"
        }
        ${!isMobile && isActive ? "scale-[1.02]" : ""}
        ${!isMobile ? "hover:scale-[1.01]" : ""}
      `}
    >
      <span
        className={`
          ${isMobile ? "w-8 h-8" : "w-10 h-10"} rounded-md flex items-center justify-center transition-all duration-300 shrink-0
          ${isActive ? "bg-primary/20 scale-110" : "bg-surface/30 group-hover:bg-surface/50"}
        `}
      >
        <Icon
          size={isMobile ? 16 : 20}
          aria-hidden="true"
          className={`transition-all duration-300 ${
            isActive ? "text-primary scale-110" : "text-ink/40 group-hover:text-primary group-hover:scale-110"
          }`}
        />
      </span>

      <span
        className={`relative z-10 ${isMobile ? "text-sm" : "text-base"} font-medium transition-all duration-300 ${
          isActive && !isMobile ? "translate-x-1" : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
};

const Sidebar: FC<SidebarProps> = ({ isMobile = false, onMenuItemClick = () => {} }) => {
  const [activeSection, setActiveSection] = useState("intro");

  // Track which section is in view. On desktop the right column is its own
  // scroll container; on mobile the window scrolls, so the observer root differs.
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const setup = () => {
      observer?.disconnect();
      mutationObserver?.disconnect();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
          });
        },
        {
          root: mediaQuery.matches ? document.getElementById("main-scroll-container") : null,
          rootMargin: "-50% 0px -50% 0px",
          threshold: 0,
        },
      );

      const observed = new Set<string>();
      const observeSections = () => {
        SECTION_IDS.forEach((id) => {
          if (observed.has(id)) return;
          const el = document.getElementById(id);
          if (el) {
            observer?.observe(el);
            observed.add(id);
          }
        });
        // Sections are lazy-loaded; stop watching the DOM once all are mounted.
        if (observed.size === SECTION_IDS.length) mutationObserver?.disconnect();
      };

      observeSections();
      if (observed.size < SECTION_IDS.length) {
        mutationObserver = new MutationObserver(observeSections);
        mutationObserver.observe(document.body, { childList: true, subtree: true });
      }
    };

    setup();
    mediaQuery.addEventListener("change", setup);

    return () => {
      mediaQuery.removeEventListener("change", setup);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (isMobile) onMenuItemClick();
  };

  return (
    <div
      className={
        isMobile
          ? "w-full bg-neutral-bg/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col h-full overflow-y-auto"
          : "w-72 bg-surface/40 backdrop-blur-xl p-5 flex flex-col shadow-2xl rounded-lg border border-border/50 relative overflow-y-auto custom-scrollbar"
      }
    >
      {/* Background decoration for desktop */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-secondary/5 rounded-full blur-xl"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col flex-1">
        {/* Profile Section */}
        <div className={`flex flex-col items-center ${isMobile ? "mb-6" : "mb-8"}`}>
          <div className={`relative group ${isMobile ? "mb-4" : "mb-5"} hover:scale-105 transition-transform duration-300`}>
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <img
              src="images/profile_logo.jpeg"
              width={isMobile ? 64 : 96}
              height={isMobile ? 64 : 96}
              className={`relative ${
                isMobile ? "w-16 h-16" : "w-24 h-24"
              } rounded-full object-cover border-2 border-border/50 transition-all duration-300 group-hover:border-primary/50`}
              alt="Parth Gajjar"
            />
            <div
              className={`absolute -bottom-1 right-2 ${
                isMobile ? "w-5 h-5" : "w-6 h-6"
              } bg-primary rounded-full border-2 border-neutral-bg flex items-center justify-center animate-pulse`}
              title="Open to work"
            >
              <div className={`${isMobile ? "w-1.5 h-1.5" : "w-2 h-2"} bg-white rounded-full`}></div>
            </div>
          </div>

          <h2 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold mb-1 text-ink text-center`}>Parth Gajjar</h2>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-ink/40" aria-hidden="true" />
            <p className="text-sm text-ink/40 font-medium">Software Developer @ Catalis</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={isMobile ? "mb-6" : "mb-6"} aria-label="Sections">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.section}
              section={item.section}
              icon={item.icon}
              label={item.label}
              isActive={activeSection === item.section}
              isMobile={isMobile}
              onClick={scrollToSection}
            />
          ))}
        </nav>

        {/* Social Links */}
        <div className={`mt-auto ${isMobile ? "space-y-3" : "space-y-3"}`}>
          {activeSection === "hire" && (
            <div className={`text-center ${isMobile ? "p-2" : "p-3"} bg-secondary/10 border border-secondary/20 rounded-md`}>
              <p className="text-xs text-secondary font-medium">Let's connect!</p>
            </div>
          )}

          <div
            className={`grid grid-cols-4 ${isMobile ? "gap-2 p-3" : "gap-2 p-3"} rounded-md transition-all duration-300 backdrop-blur-sm ${
              activeSection === "hire" ? "bg-surface/50 border border-border/50" : "bg-surface/30 border border-border/30"
            }`}
          >
            {socials.map((social) => (
              <a
                key={social.title}
                href={social.url}
                className={`p-2 rounded-md transition-all duration-300 flex items-center justify-center group backdrop-blur-sm min-h-11 ${
                  !isMobile ? "hover:scale-110 hover:-translate-y-1" : "hover:scale-105"
                } ${
                  activeSection === "hire"
                    ? "bg-surface/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50"
                    : "bg-surface/30 hover:bg-surface/50 border border-border/30 hover:border-border"
                }`}
                target="_blank"
                rel="noopener noreferrer"
                title={social.title}
                aria-label={`${social.title} (opens in a new tab)`}
              >
                <span className="transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                  {social.Icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
