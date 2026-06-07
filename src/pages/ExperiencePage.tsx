import { experiences } from "../data/data";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import type { FC } from "react";

const ExperiencePage: FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section
      id="experience"
      className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden bg-neutral-bg"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full px-8 lg:px-16 xl:px-24 text-center z-10 space-y-16"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 text-primary tracking-tight"
        >
          Work Experience
        </motion.h1>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experiences.map((exp) => (
            <motion.div
              key={exp.id}
              variants={fadeInUp}
              className="relative group"
            >
              <div className="h-full bg-surface/40 backdrop-blur-xl p-8 rounded-lg border border-border/50 shadow-2xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 flex flex-col text-left">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-ink leading-tight">
                      {exp.role}
                    </h2>
                    <p className="text-primary text-lg font-medium">
                      {exp.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-ink/40 text-sm font-mono uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {exp.description.map((bullet, i) => (
                    <li key={i} className="flex gap-4 group/bullet">
                      <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 group-hover/bullet:bg-primary transition-colors" />
                      <p className="text-ink/80 leading-relaxed text-sm">
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-border/30 mt-auto">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 bg-surface border border-border text-ink/60 rounded-sm text-[10px] font-mono uppercase
                        hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ExperiencePage;
