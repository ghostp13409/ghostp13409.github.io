import { motion } from "framer-motion";
import { ExternalLink, Github, Sparkles, Play, Info, Code2 } from "lucide-react";
import type { Project } from "../../types/portfolio";
import { cn } from "../../lib/utils";
import { Badge } from "./Badge";

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

const ProjectPlaceholder = () => (
  <div className="w-full h-full relative overflow-hidden bg-page-bg dark:bg-white/[0.02] flex items-center justify-center border-b border-black/5 dark:border-white/5">
    {/* Clean Dot Grid */}
    <div 
      className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]" 
      style={{ 
        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} 
    />

    {/* Crisp Geometric Vector Shapes */}
    <div className="relative w-full h-full flex items-center justify-center scale-75 lg:scale-100">
      {/* Primary Circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 border-[1.5px] border-accent-peach/30 rounded-full flex items-center justify-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-peach shadow-sm shadow-accent-peach/10" />
      </motion.div>

      {/* Secondary Square Frame */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-48 h-48 border-[1.5px] border-accent-sky/30 rotate-45"
      >
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-accent-sky shadow-sm shadow-accent-sky/10" />
      </motion.div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-10">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-text-main to-transparent" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-text-main to-transparent" />
      </div>

      {/* Central Prism Graphic */}
      <div className="relative z-10 w-24 h-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-peach to-accent-sky opacity-20 dark:opacity-30 rounded-2xl rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-sky to-accent-mint opacity-20 dark:opacity-30 rounded-2xl -rotate-12" />
        <div className="absolute inset-0 border border-white/40 dark:border-white/10 rounded-2xl backdrop-blur-[1px]" />
      </div>
    </div>

    {/* Accent Shapes */}
    <div className="absolute bottom-10 left-10 flex gap-4 opacity-30">
      <div className="w-12 h-1 bg-accent-peach rounded-full" />
      <div className="w-6 h-1 bg-accent-sky rounded-full" />
    </div>
    
    <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-30">
      <div className="w-1 h-12 bg-accent-sky rounded-full" />
      <div className="w-1 h-6 bg-accent-mint rounded-full" />
    </div>
  </div>
);

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
            <ProjectPlaceholder />
          )}
          
          <div className="absolute top-6 right-6 flex gap-2">
            {project.completionDate && (
              <Badge variant="default" className="bg-white/90 dark:bg-page-bg/90 backdrop-blur-md">
                {project.completionDate}
              </Badge>
            )}
            {isVideo && (
              <span className="p-1.5 rounded-full bg-accent-peach text-page-bg shadow-sm">
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
          <h3 className="text-4xl md:text-6xl font-black text-text-main tracking-tight uppercase leading-[1] group-hover:text-accent-peach transition-colors">
            {project.title}
          </h3>
          <p className="text-lg md:text-xl text-text-main/80 font-bold leading-relaxed max-w-xl uppercase tracking-tight">
            {project.description}
          </p>
        </div>

        {project.learnings && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-peach" /> Key Highlights
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.learnings.slice(0, 4).map((learning, i) => (
                <li key={i} className="flex gap-3 text-sm font-bold text-text-main/70 leading-snug">
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
