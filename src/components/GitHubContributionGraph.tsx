import { motion } from "framer-motion";
import { useState } from "react";
import { Github } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";

const GitHubContributionGraph: FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => currentYear - i);

  // Explicitly using primary color shades for dark theme consistency
  const customTheme = {
    dark: ["#161b22", "rgba(16, 185, 129, 0.15)", "rgba(16, 185, 129, 0.35)", "rgba(16, 185, 129, 0.65)", "#10b981"],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-7xl mx-auto mt-20"
    >
      <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-lg border border-border/50 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-ink tracking-tight">GitHub Contributions</h3>
              <p className="text-sm text-ink/40 font-mono uppercase tracking-widest">@ghostp13409</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all duration-300 border ${
                  selectedYear === year
                    ? "bg-primary text-neutral-bg border-primary shadow-lg shadow-primary/20"
                    : "bg-surface/60 text-ink/40 border-border/50 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center overflow-x-auto custom-scrollbar pb-4 min-h-[160px]">
          <div className="min-w-[800px] md:min-w-full flex justify-center">
            <GitHubCalendar
              username="ghostp13409"
              year={selectedYear}
              theme={customTheme}
              fontSize={12}
              blockSize={12}
              blockMargin={4}
              colorScheme="dark"
              loading={false}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end text-[10px] font-mono uppercase tracking-[0.2em] text-ink/20">
          <div className="flex items-center gap-4">
            <span>Less</span>
            <div className="flex gap-1">
              {customTheme.dark.map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubContributionGraph;
