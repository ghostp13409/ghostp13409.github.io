import { CollageProjects, projects } from "../data";
import DesignPreviewCard from "../components/DesignPreviewCard";
import ProjectCard from "../components/ProjectCard";
import MobileAppCard from "../components/MobileAppCard";
import ProjectShowcaseCard from "../components/ProjectShowcaseCard";
import VideoCard from "../components/VideoCard";
import { motion } from "framer-motion";
import { Rocket, Code } from "lucide-react";
import type { FC } from "react";
import { fadeInUp, staggerContainer } from "../lib/motion";

// +1 for the graphic design card rendered below.
const totalProjects = projects.length + CollageProjects.length + 1;

const ProjectsPage: FC = () => {
  return (
    <section
      id="projects"
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
        viewport={{ once: true, amount: 0.05 }}
        className="w-full max-w-7xl px-2 sm:px-8 text-center z-10 space-y-12"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 text-primary tracking-tight"
        >
          Projects
        </motion.h2>

        {/* Project Introduction */}
        <motion.div variants={fadeInUp}>
          <div className="bg-surface/40 backdrop-blur-xl p-6 sm:p-8 rounded-lg border border-border/50 shadow-2xl">
            <p className="text-lg sm:text-2xl text-ink leading-relaxed mb-6">
              A collection of projects from my journey as a developer. Each one taught me something new and pushed
              my boundaries. Click any card for details, demos, and source code.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-ink/40">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">{totalProjects} projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">Always building more</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Projects Grid */}
        <motion.ul
          variants={staggerContainer(0.08)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 list-none p-0 m-0"
        >
          {projects.map((p) => (
            <motion.li key={p.id} variants={fadeInUp} className="h-full">
              {p.isMobileApp && p.liveAppUrl ? (
                <MobileAppCard
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  imageUrl={p.imageUrl}
                  contentUrl={p.contentUrl}
                  completionDate={p.completionDate}
                  challenges={p.challenges}
                  keyFeatures={p.keyFeatures ?? p.learnings}
                  impact={p.impact}
                  liveAppUrl={p.liveAppUrl}
                />
              ) : p.screenshots && p.screenshots.length > 0 ? (
                <ProjectShowcaseCard
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  imageUrl={p.imageUrl}
                  contentUrl={p.contentUrl}
                  completionDate={p.completionDate}
                  challenges={p.challenges}
                  keyFeatures={p.keyFeatures ?? p.learnings}
                  impact={p.impact}
                  screenshots={p.screenshots}
                />
              ) : (
                <ProjectCard
                  title={p.title}
                  description={p.description}
                  tags={p.tags}
                  imageUrl={p.imageUrl}
                  videoUrl={p.videoUrl}
                  contentUrl={p.contentUrl}
                  completionDate={p.completionDate}
                  challenges={p.challenges}
                  keyFeatures={p.keyFeatures ?? p.learnings}
                  impact={p.impact}
                  setup={p.setup}
                  webUrl={p.webUrl}
                  platform={p.platform}
                />
              )}
            </motion.li>
          ))}

          {/* Design Project */}
          <motion.li variants={fadeInUp} className="h-full">
            <DesignPreviewCard
              title="Graphic Design"
              description="Logos, posters, menus, and brochures designed for local businesses."
              imageUrl="images/projects/Design.jpg"
              tags={["Canva", "Branding", "Print"]}
            />
          </motion.li>

          {/* College Projects */}
          {CollageProjects.map((p) => (
            <motion.li key={`college-${p.id}`} variants={fadeInUp} className="h-full">
              <VideoCard
                title={p.title}
                description={p.description}
                tags={p.tags}
                videoUrl={p.imageUrl}
                thumbnailUrl={p.thumbnailUrl}
                year={p.year}
              />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={fadeInUp}>
          <blockquote className="text-lg sm:text-xl italic text-ink/80 max-w-3xl mx-auto leading-relaxed">
            "I use every project as a learning opportunity. Whether it's mastering a new framework, solving a complex
            algorithm, or creating something that genuinely helps people, I approach each challenge with curiosity and
            determination."
          </blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsPage;
