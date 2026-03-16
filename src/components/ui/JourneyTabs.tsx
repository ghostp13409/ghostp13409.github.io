import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Code, GraduationCap } from "lucide-react";

interface JourneyTabsProps {
  activeTab: "dev" | "education";
  onChange: (tab: "dev" | "education") => void;
}

const JourneyTabs = ({ activeTab, onChange }: JourneyTabsProps) => {
  return (
    <div className="flex p-1 bg-white/60 dark:bg-black/40 rounded-full border border-black/5 dark:border-white/10 w-fit mx-auto backdrop-blur-md shadow-sm">
      <button
        onClick={() => onChange("dev")}
        className={cn(
          "relative flex items-center gap-2 px-8 py-2.5 rounded-full transition-all duration-300",
          activeTab === "dev" ? "text-page-bg" : "text-text-main/40 dark:text-text-main/50 hover:text-text-main"
        )}
      >
        {activeTab === "dev" && (
          <motion.div
            layoutId="activeJourneyTab"
            className="absolute inset-0 bg-text-main rounded-full shadow-sm"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <Code className="w-3.5 h-3.5" />
          My Work
        </span>
      </button>

      <button
        onClick={() => onChange("education")}
        className={cn(
          "relative flex items-center gap-2 px-8 py-2.5 rounded-full transition-all duration-300",
          activeTab === "education" ? "text-page-bg" : "text-text-main/40 dark:text-text-main/50 hover:text-text-main"
        )}
      >
        {activeTab === "education" && (
          <motion.div
            layoutId="activeJourneyTab"
            className="absolute inset-0 bg-text-main rounded-full shadow-sm"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <GraduationCap className="w-3.5 h-3.5" />
          My Schooling
        </span>
      </button>
    </div>
  );
};

export default JourneyTabs;
