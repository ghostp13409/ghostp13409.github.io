import { motion } from "framer-motion";
import type { WorkExperience } from "../../types/portfolio";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Badge } from "./Badge";

interface ExperienceCardProps {
  experience: WorkExperience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative p-8 lg:p-10 creative-card group overflow-hidden border border-black/5"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-5">
              <div className="p-3 rounded-2xl bg-accent-peach/10 text-accent-peach shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl sm:text-2xl font-black text-text-main tracking-tight group-hover:text-accent-peach transition-colors leading-none">
                    {experience.role}
                  </h3>
                  {experience.isCurrent && (
                    <Badge variant="mint" className="animate-pulse uppercase tracking-widest">
                      active
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-black text-text-muted tracking-widest uppercase opacity-80">
                  {experience.company}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-6 text-[10px] font-black text-text-muted tracking-widest uppercase pl-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-sky opacity-60" />
              {experience.period}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-peach opacity-60" />
              {experience.location}
            </div>
          </div>

        </div>

        <div className="flex flex-wrap gap-2 justify-start lg:justify-end max-w-sm">
          {experience.skills.map((skill, i) => (
            <Badge key={i} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-8 relative z-10 border-t border-black/[0.05]">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {experience.description.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 text-xs text-text-main/70 font-bold leading-relaxed group/item tracking-tight"
            >
              <div className="mt-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-peach mt-1" />
              </div>
              <span className="group-hover/item:text-text-main transition-colors">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
