import { motion } from "framer-motion";
import { useState } from "react";
import type { FC } from "react";
import { FaGithub } from "react-icons/fa6";
import { GitHubCalendar } from "react-github-calendar";

const USERNAME = "ghostp13409";
const FIRST_YEAR = 2023;

// Primary color shades, darkest to brightest, for dark theme consistency.
const customTheme = {
  dark: ["#161b22", "rgba(16, 185, 129, 0.15)", "rgba(16, 185, 129, 0.35)", "rgba(16, 185, 129, 0.65)", "#10b981"],
};

const GitHubContributionGraph: FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const years = Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => currentYear - i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full mt-16"
    >
      <div className="bg-surface/40 backdrop-blur-xl p-5 sm:p-8 rounded-lg border border-border/50 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
              <FaGithub className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-ink tracking-tight">GitHub Contributions</h3>
              <a
                href={`https://github.com/${USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink/40 font-mono hover:text-primary transition-colors"
              >
                @{USERNAME}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Select year">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                aria-pressed={selectedYear === year}
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
          <GitHubCalendar
            username={USERNAME}
            year={selectedYear}
            theme={customTheme}
            fontSize={12}
            blockSize={12}
            blockMargin={4}
            colorScheme="dark"
            errorMessage="Contribution data is unavailable right now."
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubContributionGraph;
