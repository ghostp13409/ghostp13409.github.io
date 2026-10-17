import { experiences } from "../data";
import { motion } from "framer-motion";
import { Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import GitHubContributionGraph from "../components/GitHubContributionGraph";
import type { FC } from "react";
import type { WorkExperience } from "../types/portfolio";
import { fadeInUp, staggerContainer } from "../lib/motion";

const TimelineMarker: FC<{ current?: boolean }> = ({ current }) => (
  <span
    className={`absolute left-0 top-7 w-7 h-7 rounded-full border-2 bg-neutral-bg flex items-center justify-center ${
      current ? "border-primary shadow-[0_0_18px_rgba(16,185,129,0.45)]" : "border-border"
    }`}
    aria-hidden="true"
  >
    {current && <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />}
    <span className={`relative w-2.5 h-2.5 rounded-full ${current ? "bg-primary" : "bg-ink/30"}`} />
  </span>
);

const ExperienceEntry: FC<{ exp: WorkExperience }> = ({ exp }) => (
  <motion.li variants={fadeInUp} className="relative pl-12 sm:pl-14 pb-10 last:pb-0">
    <TimelineMarker current={exp.isCurrent} />

    <article
      className={`bg-surface/40 backdrop-blur-xl rounded-lg border p-6 sm:p-8 transition-colors duration-300 ${
        exp.isCurrent ? "border-primary/40 shadow-[0_0_40px_-20px_rgba(16,185,129,0.5)]" : "border-border/50 hover:border-border"
      }`}
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="text-xl sm:text-2xl font-bold text-ink leading-tight">{exp.role}</h3>
            {exp.isCurrent && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/15 text-primary border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                Current
              </span>
            )}
          </div>
          <p className="text-primary text-base sm:text-lg font-medium">
            {exp.companyUrl ? (
              <a
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:underline underline-offset-4"
              >
                {exp.company}
                <ExternalLink className="h-3.5 w-3.5 text-ink/30" aria-hidden="true" />
              </a>
            ) : (
              exp.company
            )}
          </p>
          {exp.companyNote && <p className="text-sm text-ink/40">{exp.companyNote}</p>}
        </div>

        <dl className="shrink-0 flex sm:flex-col flex-wrap gap-x-5 gap-y-1.5 text-xs font-mono uppercase tracking-wider text-ink/50 sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end">
            <dt className="sr-only">Period</dt>
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            <dd>{exp.period}</dd>
          </div>
          <div className="flex items-center gap-2 sm:justify-end">
            <dt className="sr-only">Location</dt>
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <dd>{exp.location}</dd>
          </div>
        </dl>
      </header>

      {exp.summary && <p className="mt-5 text-ink/80 leading-relaxed sm:text-lg max-w-3xl">{exp.summary}</p>}

      {/* Highlights */}
      {exp.highlights && exp.highlights.length > 0 && (
        <div className="mt-6">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-3">Key work</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {exp.highlights.map((item) => (
              <li
                key={item.title}
                className="group/item flex flex-col gap-2 p-4 sm:p-5 rounded-md bg-neutral-bg/40 border border-border/40 hover:border-primary/40 transition-colors duration-300"
              >
                <h5 className="font-semibold text-ink group-hover/item:text-primary transition-colors">{item.title}</h5>
                <p className="text-sm text-ink/60 leading-relaxed flex-grow">{item.text}</p>
                {item.stack && (
                  <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Stack">
                    {item.stack.map((s) => (
                      <li key={s} className="px-2 py-0.5 rounded-sm bg-surface border border-border text-[10px] font-mono text-ink/50">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bullets */}
      {exp.description.length > 0 && (
        <ul className={`${exp.highlights ? "mt-5" : "mt-6"} space-y-2.5`}>
          {exp.description.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" aria-hidden="true" />
              <p className="text-ink/75 leading-relaxed text-sm sm:text-base">{bullet}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Skills */}
      <footer className="mt-6 pt-5 border-t border-border/30 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mr-1">Skills</span>
        <ul className="flex flex-wrap gap-2" aria-label="Skills used">
          {exp.skills.map((skill) => (
            <li
              key={skill}
              className="px-2.5 py-1 bg-surface border border-border text-ink/60 rounded-sm text-[11px] font-mono hover:border-primary/50 hover:text-primary transition-colors"
            >
              {skill}
            </li>
          ))}
        </ul>
      </footer>
    </article>
  </motion.li>
);

const ExperiencePage: FC = () => {
  return (
    <section
      id="experience"
      className="min-h-screen scroll-mt-18 lg:scroll-mt-0 flex flex-col justify-center items-center py-16 px-4 sm:p-6 relative overflow-hidden bg-neutral-bg"
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
        viewport={{ once: true, amount: 0.05 }}
        className="w-full max-w-5xl px-0 sm:px-4 z-10"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-primary tracking-tight">Work Experience</h2>
          <p className="mt-4 text-ink/50 flex items-center justify-center gap-2 text-sm sm:text-base">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            Where I've worked and what I've built
          </p>
        </motion.div>

        <ol className="relative text-left before:absolute before:left-[13px] before:top-8 before:bottom-8 before:w-px before:bg-gradient-to-b before:from-primary/60 before:via-border before:to-transparent">
          {experiences.map((exp) => (
            <ExperienceEntry key={exp.id} exp={exp} />
          ))}
        </ol>

        {/* GitHub Contributions Section */}
        <GitHubContributionGraph />
      </motion.div>
    </section>
  );
};

export default ExperiencePage;
