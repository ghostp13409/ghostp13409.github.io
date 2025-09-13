import { useEffect, useState } from "react";
import { Brain, Heart, Rocket, Sparkles, User, Mail } from "lucide-react";
import { socials } from "../data/data";

const Sidebar = ({ isMobile = false, onMenuItemClick = () => {} }) => {
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
    if (isMobile) {
      onMenuItemClick();
    }
  };

  const NavButton = ({ section, label, icon: Icon }) => {
    const isActive = activeSection === section;

    return (
      <button
        onClick={() => scrollToSection(section)}
        className={`
          w-full text-left ${
            isMobile ? "py-3 px-4" : "py-4 px-6"
          } rounded-2xl ${
          isMobile ? "mb-3" : "mb-4"
        } relative overflow-hidden group flex items-center ${
          isMobile ? "gap-3" : "gap-4"
        } backdrop-blur-sm
          transition-all duration-300 ease-out
          ${
            isActive
              ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white font-semibold shadow-xl border border-blue-500/30"
              : "text-gray-300 hover:bg-gray-700/50 border border-gray-700/30 hover:border-gray-600/50"
          }
          ${!isMobile && isActive ? "transform scale-[1.02]" : ""}
          ${!isMobile ? "hover:scale-[1.01]" : ""}
        `}
      >
        <div
          className={`
          ${
            isMobile ? "w-8 h-8" : "w-10 h-10"
          } rounded-xl flex items-center justify-center transition-all duration-300
          ${
            isActive
              ? "bg-white/20 scale-110"
              : "bg-gray-600/30 group-hover:bg-gray-500/30"
          }
        `}
        >
          <Icon
            size={isMobile ? 16 : 20}
            className={`
              transition-all duration-300
              ${
                isActive
                  ? "text-white"
                  : "text-gray-400 group-hover:text-blue-400"
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

  return (
    <div
      className={`${
        isMobile
          ? "w-full bg-gray-900/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col h-full border-r border-gray-700/50 overflow-y-auto"
          : "max-w-xs w-full bg-gray-900/60 backdrop-blur-xl p-4 md:p-6 flex flex-col shadow-2xl rounded-3xl border border-gray-700/50 relative overflow-hidden min-h-0 overflow-y-auto"
      }`}
    >
      {/* Background decoration for desktop */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <img
              src="images/profile_logo.jpeg"
              className={`relative ${
                isMobile ? "w-16 h-16" : "w-28 h-28"
              } rounded-full object-cover border-2 border-gray-700/50 transition-all duration-300 group-hover:border-blue-500/50`}
              alt="Profile logo"
            />
            <div
              className={`absolute -bottom-1 right-3 ${
                isMobile ? "w-5 h-5" : "w-6 h-6"
              } bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center animate-pulse`}
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
            } font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-center`}
          >
            Parth Gajjar
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-400 font-medium">
              Software Developer
            </p>
          </div>
          <div
            className={`px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full ${
              isMobile ? "text-center" : ""
            }`}
          >
            <span className="text-xs text-green-400 font-medium">
              Available for Co-op
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isMobile ? "mb-6" : "mb-8"}`}>
          <NavButton section="intro" icon={Sparkles} label="Introduction" />
          <NavButton section="skills" icon={Brain} label="Skills & Education" />
          <NavButton section="projects" icon={Rocket} label="Projects" />
          <NavButton section="hire" icon={Heart} label="Get in touch" />
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
              } bg-purple-500/10 border border-purple-500/20 rounded-2xl transition-all duration-300`}
            >
              <p
                className={`${
                  isMobile ? "text-xs" : "text-xs"
                } text-purple-300 font-medium`}
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
            } rounded-2xl transition-all duration-300 backdrop-blur-sm
            ${
              activeSection === "hire"
                ? "bg-gray-800/50 border border-gray-700/50"
                : "bg-gray-800/30 border border-gray-700/30"
            }`}
          >
            {socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={`${
                  isMobile ? "p-2" : "p-3"
                } rounded-xl transition-all duration-300 flex items-center justify-center group backdrop-blur-sm ${
                  !isMobile
                    ? "hover:scale-110 hover:-translate-y-1"
                    : "hover:scale-105"
                }
                  ${
                    activeSection === "hire"
                      ? "bg-gray-700/50 hover:bg-gradient-to-r hover:from-blue-600/50 hover:to-purple-600/50 border border-gray-600/50 hover:border-blue-500/50"
                      : "bg-gray-700/30 hover:bg-gray-600/50 border border-gray-600/30 hover:border-gray-500/50"
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
