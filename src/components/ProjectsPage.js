import { CollageProjects, projects } from "./data";
import DesignPreviewCard from "./DesignPreviewCard";
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
            contnetUrl={p.contnetUrl}
            completionDate={p.completionDate}
            setup={p.setup}
            webUrl={p.webUrl}
            webContent={p.webContent}
          />
        ))}
        <DesignPreviewCard
          title="Graphic Design"
          description="Designed visually appealing Logos, Posters, Brochures for a local business."
          imageUrl="images/projects/Design.jpg"
          tags={["Canva", "Design", "Creativity"]}
        />
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
