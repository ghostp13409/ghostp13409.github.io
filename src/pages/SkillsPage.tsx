import { education, Skills, Certificates, inProgress } from "../data";
import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Zap, ArrowUpRight, TrendingUp, ExternalLink } from "lucide-react";
import type { FC } from "react";
import { fadeInUp, staggerContainer } from "../lib/motion";

const SkillsPage: FC = () => {
  return (
    <section
      id="skills"
      className="min-h-screen scroll-mt-18 lg:scroll-mt-0 flex flex-col justify-center items-center p-6 relative overflow-hidden bg-neutral-bg"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer(0.15)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full max-w-7xl px-2 sm:px-8 text-center z-10 space-y-16"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 text-primary tracking-tight"
        >
          Skills & Education
        </motion.h2>

        {/* Education Overview */}
        <motion.div variants={fadeInUp}>
          <div className="bg-surface/40 backdrop-blur-xl p-6 sm:p-8 rounded-lg border border-border/50 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                <div className="w-20 h-20 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                  <GraduationCap className="h-10 w-10 text-primary" aria-hidden="true" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-ink">
                    <a
                      href={education.institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      {education.institution.name}
                      <ExternalLink className="h-4 w-4 text-ink/30" aria-hidden="true" />
                    </a>
                  </h3>
                  <p className="text-primary text-base sm:text-lg font-medium">{education.program.title}</p>
                  <p className="text-ink/60 text-sm sm:text-base">
                    {education.program.type} • {education.institution.location} • {education.program.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-primary/10 px-6 py-3 rounded-md border border-primary/20 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-ink/40 uppercase tracking-wider font-bold">GPA</p>
                  <p className="text-3xl font-bold text-primary">
                    {education.program.gpa}
                    <span className="text-sm text-ink/40">/4.00</span>
                  </p>
                </div>
              </div>
            </div>

            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
              {education.achievements.map((achievement) => (
                <motion.li
                  key={achievement.title}
                  variants={fadeInUp}
                  title={achievement.description}
                  className="bg-surface/30 p-4 rounded-md border border-border/50 transition-all duration-300 hover:border-primary/50 group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">
                    {achievement.icon}
                  </div>
                  <h4 className="text-sm font-bold text-ink">{achievement.title}</h4>
                  <p className="text-ink/40 text-xs">{achievement.subtitle}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Technical Expertise */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border/50"></div>
            <h3 className="text-2xl font-bold text-ink flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
              Technical Expertise
            </h3>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {Skills.map((skillset) => (
              <motion.div
                key={skillset.id}
                variants={fadeInUp}
                className="bg-surface/40 backdrop-blur-sm p-6 rounded-md border border-border hover:border-primary/30 transition-all duration-300"
              >
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">{skillset.title}</h4>
                <ul className="flex flex-wrap gap-2">
                  {skillset.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-3 py-1 bg-surface border border-border text-ink/80 rounded-sm text-xs transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Learning */}
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border/50"></div>
            <h3 className="text-2xl font-bold text-ink flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-secondary" aria-hidden="true" />
              Certifications & Learning
            </h3>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 text-left">
            {/* Completed Certs */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-ink/40 uppercase tracking-widest px-2">Completed</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Certificates.map((cert) => {
                  const inner = (
                    <>
                      <div className="min-w-0">
                        <p className="font-bold text-ink group-hover:text-secondary transition-colors">{cert.title}</p>
                        <p className="text-xs text-ink/40 mt-0.5">
                          {cert.issuer} • {cert.date}
                        </p>
                      </div>
                      {cert.link && (
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-ink/20 group-hover:text-secondary transition-colors"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  );
                  const className =
                    "flex items-center justify-between gap-4 p-4 h-full bg-surface/30 rounded-md border border-border transition-all group";
                  return (
                    <li key={cert.id}>
                      {cert.link ? (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${className} hover:border-secondary/50`}
                          aria-label={`${cert.title} certificate (opens in a new tab)`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={className}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Currently Learning */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-ink/40 uppercase tracking-widest px-2 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                Currently Learning
              </h4>
              <ul className="space-y-3">
                {inProgress.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-surface/30 rounded-md border border-border hover:border-primary/50 transition-all group"
                      aria-label={`${item.title} on ${item.sourcePlatform} (opens in a new tab)`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="font-bold text-ink group-hover:text-primary transition-colors">{item.title}</p>
                        <span className="text-xs font-mono text-primary shrink-0">{item.progress}%</span>
                      </div>
                      <p className="text-xs text-ink/40 mb-3">{item.sourcePlatform}</p>
                      <div
                        className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={item.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${item.title} progress`}
                      >
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsPage;
