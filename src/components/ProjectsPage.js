import { CollageProjects, projects } from "./data";
import DesignPreviewCard from "./DesignPreviewCard";
import ProjectCard from "./ProjectCard";
import VideoCard from "./VideoCard";
import { motion } from "framer-motion";
import { Rocket, Code, Palette } from "lucide-react";

const ProjectsPage = () => {
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
    <section id="projects" className="min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="w-full px-8 lg:px-16 xl:px-24 text-center z-10 space-y-12"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 text-transparent bg-clip-text tracking-tight"
        >
          My Projects
        </motion.h1>

        {/* Project Introduction */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed mb-6">
              Here's a collection of projects 
              that showcase my journey as a developer. Each one taught me something new and pushed my boundaries.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <span className="text-sm">12+ Projects Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                <span className="text-sm">Always Building More</span>
              </div>
            </div>
          </div>
        </motion.div>

        

        {/* Main Projects Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 mb-12"
        >
          {projects.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="transform transition-all duration-300 hover:-translate-y-2"
            >
              <ProjectCard
                title={p.title}
                description={p.description}
                tags={p.tags}
                imageUrl={p.imageUrl}
                contnetUrl={p.contnetUrl}
                completionDate={p.completionDate}
                setup={p.setup}
                webUrl={p.webUrl}
                webContent={p.webContent}
              />
            </motion.div>
          ))}

          {/* Design Project */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: projects.length * 0.1 }}
            className="transform transition-all duration-300 hover:-translate-y-2"
          >
            <DesignPreviewCard
              title="Graphic Design"
              description="Designed visually appealing Logos, Posters, Brochures for a local business."
              imageUrl="images/projects/Design.jpg"
              tags={["Canva", "Design", "Creativity"]}
            />
          </motion.div>

          {/* College Projects */}
          {CollageProjects.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (projects.length + 1 + index) * 0.1 }}
              className="transform transition-all duration-300 hover:-translate-y-2"
            >
              <VideoCard
                title={p.title}
                description={p.description}
                tags={p.tags}
                videoUrl={p.imageUrl}
                thumbnailUrl={p.thumbnailUrl}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Project Philosophy */}
        <motion.div variants={fadeInUp}>
          <blockquote className="text-lg sm:text-xl italic text-gray-300 max-w-3xl mx-auto leading-relaxed">
            "I use every project as a learning opportunity. Whether it's mastering a new framework, 
            solving a complex algorithm, or creating something that genuinely helps people - 
            I approach each challenge with curiosity and determination."
          </blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectsPage;
