import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Code, GraduationCap } from "lucide-react";

interface JourneyTabsProps {
  activeTab: "dev" | "education";
  onChange: (tab: "dev" | "education") => void;
}

const JourneyTabs = ({ activeTab, onChange }: JourneyTabsProps) => {
  return (
    <div className="flex p-1 bg-black/[0.03] dark:bg-white/5 rounded-full border border-black/[0.05] dark:border-white/5 w-fit mx-auto">
      <button
        onClick={() => onChange("dev")}
        className={cn(
          "relative flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300",
          activeTab === "dev" ? "text-page-bg" : "text-text-muted hover:text-text-main"
        )}
      >
        {activeTab === "dev" && (
          <motion.div
            layoutId="activeJourneyTab"
            className="absolute inset-0 bg-text-main rounded-full shadow-lg shadow-text-main/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Code className="w-4 h-4" />
          My Work
        </span>
      </button>

      <button
        onClick={() => onChange("education")}
        className={cn(
          "relative flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300",
          activeTab === "education" ? "text-page-bg" : "text-text-muted hover:text-text-main"
        )}
      >
        {activeTab === "education" && (
          <motion.div
            layoutId="activeJourneyTab"
            className="absolute inset-0 bg-text-main rounded-full shadow-lg shadow-text-main/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <GraduationCap className="w-4 h-4" />
          My Schooling
        </span>
      </button>
    </div>
  );
};

export default JourneyTabs;
