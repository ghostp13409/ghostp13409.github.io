import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles, Play, Info } from "lucide-react";
import type { Project } from "../../types/portfolio";
import { cn } from "../../lib/utils";
import { Badge } from "./Badge";

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

const FeaturedProject = ({ project, index }: FeaturedProjectProps) => {
  const isEven = index % 2 === 0;
  const isVideo = project.videoUrl || project.imageUrl?.endsWith(".mp4");
  const mediaUrl = project.videoUrl || project.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "flex flex-col lg:flex-row gap-12 lg:gap-20 items-center",
        !isEven && "lg:flex-row-reverse"
      )}
    >
      {/* Media Side */}
      <div className="w-full lg:w-1/2 group">
        <div className="relative aspect-[16/10] overflow-hidden creative-card bg-black/5 dark:bg-white/5">
          {mediaUrl ? (
            <>
              {isVideo ? (
                <video
                  src={mediaUrl}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-gradient-to-br from-accent-peach/5 to-accent-sky/5 dark:from-accent-peach/10 dark:to-accent-sky/10">
              <Sparkles className="w-12 h-12 text-accent-peach/20 dark:text-accent-peach/40 mb-4" />
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest text-center italic">A story in the making</p>
            </div>
          )}
          
          <div className="absolute top-6 right-6 flex gap-2">
            {project.completionDate && (
              <Badge variant="default" className="bg-white/90 dark:bg-page-bg/90 backdrop-blur-md">
                {project.completionDate}
              </Badge>
            )}
            {isVideo && (
              <span className="p-1.5 rounded-full bg-accent-peach text-page-bg shadow-lg">
                <Play className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Side */}
      <div className="w-full lg:w-1/2 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-px bg-accent-peach" />
             <span className="text-xs font-black text-accent-peach uppercase tracking-[0.3em]">Featured Work</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-text-main tracking-tighter italic uppercase leading-[0.9] group-hover:text-accent-peach transition-colors">
            {project.title}
          </h3>
          <p className="text-lg md:text-xl text-text-main/80 font-medium leading-relaxed italic max-w-xl">
            {project.description}
          </p>
        </div>

        {project.learnings && (
          <div className="space-y-4">
            <h4 className="text-xs font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-peach" /> Key Highlights
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.learnings.slice(0, 4).map((learning, i) => (
                <li key={i} className="flex gap-3 text-base font-bold text-text-main/70 italic leading-snug">
                  <span className="text-accent-peach shrink-0">✦</span>
                  {learning}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {project.contentUrl && (
              <a href={project.contentUrl} target="_blank" rel="noopener noreferrer" className="pill-button flex items-center gap-3">
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
            {project.webUrl && (
              <a href={project.webUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full border-2 border-black/5 dark:border-white/10 font-bold hover:bg-white dark:hover:bg-white/5 transition-all flex items-center gap-3">
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProject;
