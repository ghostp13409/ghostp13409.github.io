import { useEffect, useState } from "react";
import { Brain, Heart, Rocket, Sparkles } from "lucide-react";
import { socials } from "./data";
import { motion } from "framer-motion";

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
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => scrollToSection(section)}
      className={`
        w-full text-left py-3 px-5 rounded-lg mb-2 transition-all duration-100 
        relative overflow-hidden group flex items-center gap-4
        ${
          activeSection === section
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg"
            : "text-gray-300 hover:bg-gray-700/50"
        }
      `}
    >
      <Icon size={20} className={`
        relative z-10 transition-transform duration-300
        ${activeSection === section ? "text-white" : "text-gray-400"}
        group-hover:scale-110
      `} />
      <span className="relative z-10 text-base">{label}</span>
      {activeSection === section && (
        <motion.div
          layoutId="active-nav"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="w-64 bg-gray-800/80 backdrop-blur-md p-6 flex flex-col shadow-xl rounded-xl border border-gray-700/50"
    >
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <img
            src="images/profile_logo.jpeg"
            className="relative w-50 h-50 rounded-full object-cover border-2 border-gray-700 transition-all duration-300 group-hover:border-transparent"
            alt="Profile logo"
          />
        </motion.div>
        <h2 className="text-xl font-bold mt-4 text-gray-100">Parth Gajjar</h2>
        <p className="text-base text-gray-400">Software Developer</p>
      </div>

      <nav className="flex-1 space-y-2 mb-8">
        <NavButton section="intro" icon={Sparkles} label="Introduction" />
        <NavButton section="skills" icon={Brain} label="Skills & Education" />
        <NavButton section="projects" icon={Rocket} label="Projects" />
        <NavButton section="hire" icon={Heart} label="Get in touch" />
      </nav>

      <motion.div 
        className={`space-y-2 ${activeSection === 'hire' ? 'scale-105' : ''} transition-all duration-300`}
      >
        {activeSection === 'hire' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-gray-400"
          >
            Or reach out to me through here...
          </motion.p>
        )}
        <motion.div 
          className={`flex flex-wrap justify-center gap-2 p-2 rounded-lg transition-all duration-300
            ${activeSection === 'hire' ? 'bg-gray-700/30 border border-gray-600/50' : ''}`}
        >
          {socials.map((social, index) => (
            <motion.a
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={social.url}
              className={`p-2 rounded-lg transition-all duration-300 
                ${activeSection === 'hire' 
                  ? 'bg-gray-600/50 hover:bg-gray-500/50 hover:text-blue-400'
                  : 'bg-gray-700/50 hover:bg-gray-600/50 hover:text-blue-400'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.Icon}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
