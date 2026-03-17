import { motion, useScroll, useSpring } from "framer-motion";
import { type ElementType } from "react";
import {
  Github,
  Linkedin,
  Instagram,
  User,
  Map,
  MessageCircle,
  Coffee,
} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import { socials } from "../../data/mockdata";
import { cn } from "../../lib/utils";

interface SidebarProps {
  activeSection?: string;
  onMenuItemClick?: (id: string) => void;
  isMobile?: boolean;
}

const iconMap: Record<string, ElementType> = {
  Github: Github,
  Linkedin: Linkedin,
  Instagram: Instagram,
  SiLeetcode: SiLeetcode,
};

const Sidebar = ({
  activeSection = "intro",
  onMenuItemClick,
  isMobile = false,
}: SidebarProps) => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const menuItems = [
    { id: "intro", label: "About Me", icon: <User className="w-4 h-4" /> },
    { id: "journey", label: "My Journey", icon: <Map className="w-4 h-4" /> },
    {
      id: "hire",
      label: "Say Hello",
      icon: <MessageCircle className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full relative overflow-hidden",
        isMobile ? "px-6 py-10" : "px-8 py-16",
      )}
    >
      {/* Soft Progress Trace */}
      {!isMobile && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/[0.03]">
          <motion.div
            className="absolute top-0 left-0 right-0 w-full bg-accent-peach origin-top shadow-[0_0_10px_rgba(249,115,22,0.1)]"
            style={{ scaleY }}
          />
        </div>
      )}

      {/* Friendly Profile Section */}
      <div className="mb-16 relative group px-2">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-accent-peach/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border-2 border-white shadow-md transition-all duration-500 bg-white">
            <img
              src="images/profile_logo.jpeg"
              className="w-full h-full object-cover transition-all duration-500"
              alt="parth gajjar"
            />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-text-main tracking-widest uppercase">
            parth gajjar
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 relative z-10">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onMenuItemClick?.(item.id)}
              className={cn(
                "w-full text-left group px-4 py-3.5 rounded-2xl relative transition-all duration-500",
                isActive
                  ? "bg-white dark:bg-white/10 text-text-main shadow-sm border border-black/5 dark:border-white/5"
                  : "text-text-muted hover:text-text-main hover:bg-white/40 dark:hover:bg-white/5",
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span
                  className={cn(
                    "p-2 rounded-xl transition-all duration-500",
                    isActive
                      ? "bg-accent-peach/10 text-accent-peach"
                      : "bg-black/[0.02] dark:bg-white/5 text-text-muted group-hover:text-text-main",
                  )}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-widest uppercase">
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-peach"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Socials & Tea */}
      <div className="mt-auto pt-12 space-y-8 relative z-10">
        <div className="flex gap-3 justify-center p-3 rounded-2xl bg-black/[0.02] dark:bg-white/5 border border-black/5 dark:border-white/5">
          {socials.map((social, index) => {
            const Icon = iconMap[social.iconName] || Github;
            return (
              <a
                key={index}
                href={social.url}
                className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-white dark:hover:bg-white/10 transition-all hover:shadow-black/5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>

        <div className="px-2 flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity group">
          <Coffee className="w-4 h-4 text-accent-peach group-hover:animate-bounce" />
          <p className="text-[10px] font-bold text-text-muted tracking-widest uppercase leading-none">
            built with coffee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
