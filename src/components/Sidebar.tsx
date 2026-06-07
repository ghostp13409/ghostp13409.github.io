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

const NavButton: FC<NavButtonProps> = ({ section, label, icon: Icon, isActive, isMobile, onClick }) => {
  return (
    <button
      onClick={() => onClick(section)}
      className={`
        w-full text-left ${
          isMobile ? "py-3 px-4" : "py-4 px-6"
        } rounded-md ${
        isMobile ? "mb-3" : "mb-4"
      } relative overflow-hidden group flex items-center ${
        isMobile ? "gap-3" : "gap-4"
      } backdrop-blur-sm
        transition-all duration-300 ease-out
        ${
          isActive
            ? "bg-primary/20 text-primary font-semibold border border-primary/30"
            : "text-ink/60 hover:bg-surface/50 border border-border/30 hover:border-border"
        }
        ${!isMobile && isActive ? "transform scale-[1.02]" : ""}
        ${!isMobile ? "hover:scale-[1.01]" : ""}
      `}
    >
      <div
        className={`
        ${
          isMobile ? "w-8 h-8" : "w-10 h-10"
        } rounded-md flex items-center justify-center transition-all duration-300
        ${
          isActive
            ? "bg-primary/20 scale-110"
            : "bg-surface/30 group-hover:bg-surface/50"
        }
      `}
      >
        <Icon
          size={isMobile ? 16 : 20}
          className={`
            transition-all duration-300
            ${
              isActive
                ? "text-primary"
                : "text-ink/40 group-hover:text-primary"
            }
            ${isActive ? "scale-110" : "group-hover:scale-110"}
          `}
        />
      </div>

      <span
        className={`
        relative z-10 ${
          isMobile ? "text-sm" : "text-base"
        } font-medium transition-all duration-300
        ${isActive && !isMobile ? "translate-x-1" : ""}
      `}
      >
        {label}
      </span>
    </button>
  );
};

const Sidebar: FC<SidebarProps> = ({ isMobile = false, onMenuItemClick = () => {} }) => {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "experience", "skills", "projects", "hire"];

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    if (isMobile) {
      onMenuItemClick();
    }
  };

  return (
    <div
      className={`${
        isMobile
          ? "w-full bg-neutral-bg/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col h-full border-r border-border/50 overflow-y-auto"
          : "max-w-xs w-full bg-surface/40 backdrop-blur-xl p-4 md:p-6 flex flex-col shadow-2xl rounded-lg border border-border/50 relative overflow-hidden min-h-0 overflow-y-auto"
      }`}
    >
      {/* Background decoration for desktop */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-secondary/5 rounded-full blur-xl"></div>
        </div>
      )}

      <div className="relative z-10">
        {/* Profile Section */}
        <div
          className={`flex flex-col items-center ${
            isMobile ? "mb-6" : "mb-10"
          }`}
        >
          <div
            className={`relative group ${
              isMobile ? "mb-4" : "mb-6"
            } hover:scale-105 transition-transform duration-300`}
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <img
              src="images/profile_logo.jpeg"
              className={`relative ${
                isMobile ? "w-16 h-16" : "w-28 h-28"
              } rounded-full object-cover border-2 border-border/50 transition-all duration-300 group-hover:border-primary/50`}
              alt="Profile logo"
            />
            <div
              className={`absolute -bottom-1 right-3 ${
                isMobile ? "w-5 h-5" : "w-6 h-6"
              } bg-primary rounded-full border-2 border-neutral-bg flex items-center justify-center animate-pulse`}
            >
              <div
                className={`${
                  isMobile ? "w-1.5 h-1.5" : "w-2 h-2"
                } bg-white rounded-full`}
              ></div>
            </div>
          </div>

          <h2
            className={`${
              isMobile ? "text-xl" : "text-2xl"
            } font-bold mb-2 text-ink text-center`}
          >
            Parth Gajjar
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-ink/40" />
            <p className="text-sm text-ink/40 font-medium">
              Software Developer
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isMobile ? "mb-6" : "mb-8"}`}>
          <NavButton 
            section="intro" 
            icon={Sparkles} 
            label="Introduction" 
            isActive={activeSection === "intro"}
            isMobile={isMobile}
            onClick={scrollToSection}
          />
          <NavButton 
            section="experience" 
            icon={Briefcase} 
            label="Experience" 
            isActive={activeSection === "experience"}
            isMobile={isMobile}
            onClick={scrollToSection}
          />
          <NavButton 
            section="skills" 
            icon={Brain} 
            label="Skills & Education" 
            isActive={activeSection === "skills"}
            isMobile={isMobile}
            onClick={scrollToSection}
          />
          <NavButton 
            section="projects" 
            icon={Rocket} 
            label="Projects" 
            isActive={activeSection === "projects"}
            isMobile={isMobile}
            onClick={scrollToSection}
          />
          <NavButton 
            section="hire" 
            icon={Heart} 
            label="Get in touch" 
            isActive={activeSection === "hire"}
            isMobile={isMobile}
            onClick={scrollToSection}
          />
        </nav>

        {/* Social Links */}
        <div
          className={`${
            isMobile ? "space-y-3" : "space-y-4"
          } transition-all duration-300 ${
            activeSection === "hire" && !isMobile ? "scale-105" : ""
          }`}
        >
          {activeSection === "hire" && (
            <div
              className={`text-center ${
                isMobile ? "p-2" : "p-3"
              } bg-secondary/10 border border-secondary/20 rounded-md transition-all duration-300`}
            >
              <p
                className={`text-xs text-secondary font-medium`}
              >
                Let's connect!
              </p>
            </div>
          )}

          <div
            className={`grid ${isMobile ? "grid-cols-4" : "grid-cols-2"} ${
              isMobile ? "gap-2" : "gap-3"
            } ${
              isMobile ? "p-3" : "p-4"
            } rounded-md transition-all duration-300 backdrop-blur-sm
            ${
              activeSection === "hire"
                ? "bg-surface/50 border border-border/50"
                : "bg-surface/30 border border-border/30"
            }`}
          >
            {socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={`${
                  isMobile ? "p-2" : "p-3"
                } rounded-md transition-all duration-300 flex items-center justify-center group backdrop-blur-sm ${
                  !isMobile
                    ? "hover:scale-110 hover:-translate-y-1"
                    : "hover:scale-105"
                }
                  ${
                    activeSection === "hire"
                      ? "bg-surface/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50"
                      : "bg-surface/30 hover:bg-surface/50 border border-border/30 hover:border-border"
                  }`}
                target="_blank"
                rel="noopener noreferrer"
                title={social.title}
              >
                <span
                  className={`transition-all duration-300 ${
                    isMobile ? "group-hover:scale-105" : "group-hover:scale-110"
                  } ${isMobile ? "text-sm" : ""}`}
                >
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
