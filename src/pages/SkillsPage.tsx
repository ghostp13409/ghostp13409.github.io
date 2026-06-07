import { education, Skills, Certificates } from "../data";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Zap, ArrowDown } from "lucide-react";
import { DSACont } from "../components/DSACont";
import type { FC } from "react";

const SkillsPage: FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section
      id="skills"
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
          Skills & Education
        </motion.h1>

        {/* Education Overview */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="bg-surface/40 backdrop-blur-xl p-8 rounded-lg border border-border/50 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                  <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                    {education.institution.name}
                  </h2>
                  <p className="text-primary text-lg font-medium">
                    {education.program.title}
                  </p>
                  <p className="text-ink/60">
                    Advanced Diploma • Co-op Program • {education.program.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-primary/10 px-6 py-3 rounded-md border border-primary/20">
                <div className="text-right">
                  <p className="text-xs text-ink/40 uppercase tracking-wider font-bold">GPA</p>
                  <p className="text-3xl font-bold text-primary">{education.program.gpa}<span className="text-sm text-ink/40">/4.00</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {education.achievements.map((achievement, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-surface/30 p-4 rounded-md border border-border/50 transition-all duration-300 hover:border-primary/50 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{achievement.icon}</div>
                <h3 className="text-sm font-bold text-ink">{achievement.title}</h3>
                <p className="text-ink/40 text-xs">{achievement.subtitle}</p>
              </motion.div>
            ))}
          </div>
          </div>
        </motion.div>

        {/* Technical Expertise */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border/50"></div>
            <h2 className="text-2xl font-bold text-ink flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              Technical Expertise
            </h2>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {Skills.map((skillset) => (
              <motion.div
                key={skillset.id}
                variants={fadeInUp}
                className="bg-surface/40 backdrop-blur-sm p-6 rounded-md border border-border hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
                  {skillset.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-surface border border-border text-ink/80 rounded-sm text-xs transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* DSA Contests */}
        <motion.div variants={fadeInUp}>
          <DSACont />
        </motion.div>

        {/* Growth & Certifications */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border/50"></div>
            <h2 className="text-2xl font-bold text-ink flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-secondary" />
              Certifications
            </h2>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>

          <div className="grid gap-8 text-left">
            {/* Completed Certs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-ink/40 uppercase tracking-widest px-2">Certifications</h3>
              <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {Certificates.slice(0, 4).map((cert) => (
                  <a
                    key={cert.id}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-surface/30 rounded-md border border-border hover:border-secondary/50 group transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-ink group-hover:text-secondary transition-colors">{cert.title}</h4>
                      <p className="text-xs text-ink/40">{cert.issuer} • {cert.date}</p>
                    </div>
                    <ArrowDown className="h-4 w-4 text-ink/20 -rotate-90 group-hover:text-secondary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsPage;
