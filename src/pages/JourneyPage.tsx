import { motion } from "framer-motion";
import {
  projects,
  experiences,
  education,
  skills,
} from "../data/mockdata";
import FeaturedProject from "../components/ui/FeaturedProject";
import ExperienceCard from "../components/ui/ExperienceCard";
import { Badge } from "../components/ui/Badge";

const JourneyPage = () => {
  const featuredProjects = projects.slice(0, 3);

  return (
    <section
      id="journey"
      className="px-8 sm:px-16 lg:px-32 py-32 space-y-24 relative"
    >
      <div className="max-w-4xl space-y-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-12 border-b border-black/[0.05]"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight mb-4">
            My Journey
          </h2>
          <p className="text-text-muted font-medium">
            A timeline of my professional growth, projects, and skills.
          </p>
        </motion.div>

        {/* Experience Section */}
        <section className="space-y-12">
          <h3 className="text-2xl font-semibold text-text-main">Experience</h3>
          <div className="space-y-12">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>

        {/* Selected Work Section */}
        <section className="space-y-16">
          <h3 className="text-2xl font-semibold text-text-main">Selected Work</h3>
          <div className="space-y-24">
            {featuredProjects.map((project, index) => (
              <FeaturedProject
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-12">
          <h3 className="text-2xl font-semibold text-text-main">Technical Arsenal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {skills.map((category) => (
              <div key={category.id} className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-text-muted">
                  {category.title}
                </h4>
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

        {/* Education Section */}
        <section className="space-y-12">
          <h3 className="text-2xl font-semibold text-text-main">Education</h3>
          <div className="space-y-4">
            <h4 className="text-xl font-medium text-text-main">
              {education.institution.name}
            </h4>
            <p className="text-text-muted">
              {education.program.title} (2024-2026)
            </p>
          </div>
        </section>
      </div>
    </section>
  );
};

export default JourneyPage;