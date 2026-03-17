import { motion } from "framer-motion";
import type { TimelineEntry } from "../../types/portfolio";
import { Book, Sparkles, Star } from "lucide-react";
import { Badge } from "./Badge";

interface TimelineProps {
  timeline: TimelineEntry[];
}

const Timeline = ({ timeline }: TimelineProps) => {
  return (
    <div className="relative space-y-24">
      {/* Soft Vertical Path */}
      <div className="absolute left-[1.4rem] top-4 bottom-0 w-1 bg-gradient-to-b from-accent-mint via-accent-sky to-transparent rounded-full opacity-20"></div>

      {timeline.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-16 group"
        >
          {/* Path Node */}
          <div className="absolute left-0 top-2 w-12 h-12 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white dark:bg-page-bg border-4 border-accent-mint shadow-sm group-hover:scale-125 group-hover:border-accent-peach transition-all duration-300 z-10"></div>
            <div className="absolute inset-0 bg-accent-peach/20 dark:bg-accent-peach/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-text-muted tracking-widest uppercase">
                  {entry.period}
                </span>
                <Badge variant={entry.status === "completed" ? "mint" : "secondary"}>
                  {entry.status}
                </Badge>
              </div>
              <h3 className="text-4xl font-black text-text-main tracking-tight group-hover:text-accent-peach transition-colors italic leading-none">
                {entry.phase}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Courses Card */}
              <div className="creative-card p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <Book className="w-4 h-4 text-accent-sky" />
                  <h4 className="text-xs font-black text-text-muted tracking-widest uppercase">
                    learning focus
                  </h4>
                </div>
                <ul className="space-y-4">
                  {entry.courses.map((course, i) => (
                    <li
                      key={i}
                      className="text-base font-bold text-text-main/70 flex gap-3 group/item italic"
                    >
                      <span className="text-accent-mint opacity-40 group-hover/item:opacity-100 transition-opacity shrink-0">
                        ✦
                      </span>
                      <span className="group-hover/item:text-text-main transition-colors leading-snug">
                        {course}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlights & Tech */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-text-muted tracking-widest uppercase flex items-center gap-3 px-2">
                    <Sparkles className="w-3 h-3 text-accent-peach" /> key growth
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.keySkills.map((skill, i) => (
                      <Badge key={i} variant="peach">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {entry.highlights.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-text-muted tracking-tight flex items-center gap-3 px-2">
                      <Star className="w-3 h-3 text-accent-sky" /> highlights
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.highlights.map((highlight, i) => (
                        <Badge key={i} variant="sky">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
