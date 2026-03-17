import { Moon, Sun, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (t: Theme) => {
      if (t === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.toggle("dark", systemTheme === "dark");
      } else {
        root.classList.toggle("dark", t === "dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case "light": return <Sun className="w-5 h-5 text-accent-peach" />;
      case "dark": return <Moon className="w-5 h-5 text-accent-sky" />;
      case "system": return <Monitor className="w-5 h-5 text-accent-lavender" />;
    }
  };

  return (
    <motion.button
      onClick={cycleTheme}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-6 right-6 lg:top-10 lg:right-10 z-[100] w-12 h-12 flex items-center justify-center rounded-full soft-glass transition-all duration-300 shadow-md group"
      aria-label={`Current theme: ${theme}. Click to cycle.`}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-peach/5 via-accent-sky/5 to-accent-lavender/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: 10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="relative z-10"
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>

      {/* Tooltip on hover */}
      <div className="absolute top-full mt-2 right-0 px-3 py-1.5 rounded-xl bg-text-main text-page-bg text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
        theme: {theme}
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
