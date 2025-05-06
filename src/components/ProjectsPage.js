// import GameCard from "../live_demos/GameCard";
// import MovieRatingCard from "../live_demos/MovieRatingCard";
import { CollageProjects, projects } from "./data";
import DesignPreviewCard from "./DesignPreviewCard";
import ProjectCard from "./ProjectCard";
import VideoCard from "./VideoCard";
import { motion } from "framer-motion";

const ProjectsPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section id="projects" className="min-h-screen p-6 mx-auto">
      <motion.h1
        {...fadeInUp}
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text tracking-tight"
      >
        Projects 🚀
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: projects.length * 0.1 }}
        >
          <DesignPreviewCard
            title="Graphic Design"
            description="Designed visually appealing Logos, Posters, Brochures for a local business."
            imageUrl="images/projects/Design.jpg"
            tags={["Canva", "Design", "Creativity"]}
          />
        </motion.div>

        {CollageProjects.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (projects.length + 1 + index) * 0.1 }}
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

      {/* <motion.h1
        {...fadeInUp}
        className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text tracking-tight"
      >
        Live Demos 🚀
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-3 gap-3"
      >
        <MovieRatingCard />
        <GameCard />
      </motion.div> */}
    </section>
  );
};

export default ProjectsPage;
