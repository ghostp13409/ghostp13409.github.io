import { useState } from "react";
import { X, ExternalLink, Github, ArrowRight, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "../../types/portfolio";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const {
    title,
    description,
    tags,
    imageUrl,
    contentUrl,
    webUrl,
    completionDate,
    learnings,
    impact
  } = project;

  const [showPreview, setShowPreview] = useState(false);
  const isVideo = imageUrl?.endsWith(".mp4");
  const displayImage = isVideo ? (project.thumbnailUrl || imageUrl) : imageUrl;

  return (
    <>
      <motion.div 
        onClick={() => setShowPreview(true)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="group cursor-pointer space-y-6"
      >
        <div className="relative overflow-hidden creative-card aspect-[16/10]">
          {displayImage ? (
            <div className="w-full h-full overflow-hidden">
              <motion.img
                src={displayImage}
                alt={title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-accent-sky/5 group-hover:bg-accent-sky/10 transition-colors">
               <Sparkles className="w-12 h-12 text-accent-sky/40 mb-4" />
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">Project Snapshot</p>
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="pill-button flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              Explore Story <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute top-6 right-6">
             <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-text-main shadow-sm border border-black/5">
               {completionDate}
             </span>
          </div>
        </div>

        <div className="px-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-[9px] font-bold text-accent-peach uppercase tracking-widest">
                #{tag}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-black text-text-main tracking-tight group-hover:text-accent-peach transition-colors">
            {title}
          </h3>
          <p className="text-sm font-medium text-text-muted leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex justify-center items-center p-6 md:p-12 lg:p-20 bg-white/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl creative-card rounded-[4rem] relative overflow-hidden flex flex-col lg:flex-row min-h-[70vh] bg-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-8 right-8 z-50 w-12 h-12 flex items-center justify-center text-text-main hover:bg-black/5 rounded-full transition-all group"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Media Section */}
              <div className="w-full lg:w-1/2 bg-black/[0.02] relative min-h-[350px] lg:min-h-full">
                {imageUrl ? (
                  isVideo ? (
                    <video
                      src={imageUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={webUrl || imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-20 text-center">
                    <div className="p-10 rounded-[3rem] bg-accent-peach/10">
                      <Sparkles className="w-16 h-16 text-accent-peach mb-6" />
                      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Story Highlights Only</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Story Section */}
              <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-12 relative z-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-peach/10">
                    <span className="text-[10px] font-bold text-accent-peach uppercase tracking-widest">Project Story // {completionDate}</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tight leading-none">{title}</h2>
                </div>

                <div className="space-y-10">
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Heart className="w-3 h-3 text-accent-peach" fill="currentColor" /> Why I built this
                    </h4>
                    <p className="text-lg md:text-xl text-text-main/80 font-medium leading-relaxed italic">
                      "{description}"
                    </p>
                  </section>

                  {impact && (
                    <section className="p-6 rounded-[2rem] bg-accent-mint/20 border border-accent-mint/30">
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">The Result</h4>
                      <p className="text-sm font-bold text-text-main/70 leading-relaxed italic">
                        {impact}
                      </p>
                    </section>
                  )}

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Tools & Tech</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tech, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-black/5 text-[10px] font-bold text-text-main/60 uppercase tracking-tight">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {learnings && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">What I learned</h4>
                      <ul className="space-y-3">
                        {learnings.map((learning, i) => (
                          <li key={i} className="flex gap-3 text-xs font-bold text-text-main/60 italic">
                            <span className="text-accent-peach">✦</span>
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Interaction Suite */}
                {(contentUrl || webUrl) && (
                  <div className="pt-10 flex flex-col sm:flex-row gap-4">
                    {contentUrl && (
                      <a href={contentUrl} target="_blank" rel="noopener noreferrer" className="flex-1 pill-button flex items-center justify-center gap-3">
                        <Github className="w-4 h-4" />
                        <span>View Source</span>
                      </a>
                    )}
                    {webUrl && !isVideo && (
                      <a href={webUrl} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-3 rounded-full border-2 border-text-main/10 font-bold hover:bg-black/5 transition-all flex items-center justify-center gap-3">
                        <ExternalLink className="w-4 h-4" />
                        <span>Try it out</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
