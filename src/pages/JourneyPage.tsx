import { motion } from "framer-motion";
import { projects, experiences, education, skills } from "../data/mockdata";
import FeaturedProject from "../components/ui/FeaturedProject";
import ExperienceCard from "../components/ui/ExperienceCard";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";

const JourneyPage = () => {
  const featuredProjects = projects.slice(0, 3);

  return (
    <section
      id="journey"
      className="px-8 sm:px-16 lg:px-32 section-spacing relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-[10%] -right-32 w-[600px] h-[600px] bg-accent-mint/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl relative z-10 flex flex-col content-gap-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-12 border-b border-black/[0.05]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-accent-peach" />
            <span className="text-[10px] font-black text-accent-peach uppercase tracking-[0.3em]">
              The Timeline
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter uppercase mb-6 leading-none">
            My Journey
          </h2>
          <p className="text-lg md:text-xl text-text-muted font-bold uppercase tracking-tight max-w-xl">
            A narrative of professional growth, selected works, and the tools
            that power my craft.
          </p>
        </motion.div>

        {/* Experience Section */}
        <section className="flex flex-col content-gap-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">
              Experience
            </h3>
            <div className="h-px flex-1 bg-black/[0.05] ml-8" />
          </div>
          <div className="flex flex-col content-gap-sm">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="flex flex-col content-gap-md">
          <div className="flex items-center justify-between">
            <div className="h-px flex-1 bg-black/[0.05] mr-8" />
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">
              Projects
            </h3>
          </div>
          <div className="flex flex-col content-gap-lg">
            {featuredProjects.map((project, index) => (
              <FeaturedProject
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Skills Section - Organic Cluster */}
        <section className="flex flex-col content-gap-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">
              Technical Arsenal
            </h3>
            <div className="h-px flex-1 bg-black/[0.05] ml-8" />
          </div>
          <div className="flex flex-wrap gap-12 lg:gap-16">
            {skills.map((category, idx) => (
              <div
                key={category.id}
                className={cn(
                  "space-y-6",
                  idx === 0 ? "w-full md:w-[45%]" : "flex-1 min-w-[200px]",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-peach" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main">
                    {category.title}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section - Minimalist */}
        <section className="flex flex-col content-gap-sm pt-12 border-t border-black/[0.05]">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.4em]">
            Education
          </h3>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h4 className="text-2xl font-black text-text-main uppercase tracking-tight">
                {education.institution.name}
              </h4>
              <p className="text-lg font-bold text-text-muted uppercase tracking-tight">
                {education.program.title}
              </p>
            </div>
            <p className="text-sm font-black text-accent-peach uppercase tracking-widest">
              2024 — 2026
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default JourneyPage;
