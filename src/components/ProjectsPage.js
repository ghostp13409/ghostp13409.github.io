import { CollageProjects, projects } from "./data";
import ProjectCard from "./ProjectCard";
import VideoCard from "./VideoCard";

const ProjectsPage = () => {
  return (
    <section id="projects" className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Projects 🚀
      </h1>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-6">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            description={p.description}
            tags={p.tags}
            imageUrl={p.imageUrl}
          />
        ))}
        {CollageProjects.map((p) => (
          <VideoCard
            key={p.id}
            title={p.title}
            description={p.description}
            tags={p.tags}
            videoUrl={p.imageUrl}
            thumbnailUrl={p.thumbnailUrl}
          />
        ))}
      </div>
    </section>
  );
};
export default ProjectsPage;
