import { useState, useRef, useEffect } from "react";
import { ExternalLink, Github, Sparkles, Play, Maximize2, X } from "lucide-react";
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
    impact,
    id
  } = project;

  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = imageUrl?.endsWith(".mp4") || project.videoUrl;
  const mediaUrl = project.videoUrl || imageUrl;
  const displayImage = isVideo ? (project.thumbnailUrl || imageUrl) : imageUrl;

  // Auto-play video on hover for the card view
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered && !showPreview) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, showPreview]);

  return (
    <>
      <motion.div 
        layoutId={`card-${id}`}
        onClick={() => setShowPreview(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group cursor-pointer flex flex-col h-full bg-white/60 dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] rounded-[1.5rem] overflow-hidden hover:border-black/10 dark:hover:border-white/10 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-500 ease-out-quart"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
          <motion.div 
            layoutId={`media-container-${id}`}
            className="w-full h-full"
          >
            {mediaUrl ? (
              <div className="w-full h-full">
                {isVideo ? (
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    poster={displayImage}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 ease-out-quart group-hover:scale-105"
                  />
                ) : (
                  <motion.img
                    src={displayImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out-quart group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out-quart"></div>
                
                {/* Subtle Play Icon for Videos */}
                {isVideo && !isHovered && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px] transition-all duration-300">
                     <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                       <Play className="w-4 h-4 text-white fill-white" />
                     </div>
                   </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-accent-sky/5 transition-colors">
                 <Sparkles className="w-8 h-8 text-accent-sky/30 mb-4" />
              </div>
            )}
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out-quart">
            <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out-quart bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Maximize2 className="w-3.5 h-3.5" /> view project
            </div>
          </div>

          <div className="absolute top-4 right-4">
             <motion.div layoutId={`date-${id}`} className="px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-text-main dark:text-white/80 border border-black/5 dark:border-white/10">
               {completionDate}
             </motion.div>
          </div>
        </div>

        <div className="p-6 space-y-4 flex-grow flex flex-col">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-widest text-text-muted/80 px-2 py-0.5 rounded border border-black/[0.04] dark:border-white/[0.04] bg-black/[0.01] dark:bg-white/[0.01]">
                {tag}
              </span>
            ))}
          </div>
          <motion.h3 
            layoutId={`title-${id}`}
            className="text-xl font-semibold text-text-main tracking-tight leading-snug group-hover:text-text-main/80 transition-colors"
          >
            {title}
          </motion.h3>
          <p className="text-sm font-normal text-text-muted/90 leading-relaxed line-clamp-2 flex-grow">
            {description}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-0 md:p-6 lg:p-10 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-page-bg/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl"
              onClick={() => setShowPreview(false)}
            />

            {/* Modal */}
            <motion.div
              layoutId={`card-${id}`}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl relative overflow-hidden flex flex-col h-full md:h-[92vh] bg-white dark:bg-[#0c0c0c] md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/5 z-10"
            >
              {/* Header Bar */}
              <div className="flex-none flex justify-between items-center px-6 py-4 border-b border-black/[0.03] dark:border-white/[0.03] bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-main dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <motion.div layoutId={`date-${id}`} className="text-[10px] font-black uppercase tracking-widest text-text-muted hidden sm:block">
                    {completionDate}
                  </motion.div>
                </div>
                
                <div className="flex gap-3">
                  {contentUrl && (
                    <a href={contentUrl} target="_blank" rel="noopener noreferrer" className="px-4 h-9 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-main dark:text-white border border-black/10 dark:border-white/10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <Github className="w-4 h-4" />
                      <span className="hidden sm:inline">source</span>
                    </a>
                  )}
                  {webUrl && (
                    <a href={webUrl} target="_blank" rel="noopener noreferrer" className="px-5 h-9 flex items-center gap-2 bg-text-main dark:bg-white text-page-bg dark:text-black font-black text-[10px] uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity">
                      <span>visit site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row">
                
                {/* Left: Media Area */}
                <div className="w-full lg:w-[55%] relative min-h-[40vh] lg:min-h-full border-r border-black/[0.03] dark:border-white/[0.03] bg-[#fdfdfd] dark:bg-[#080808]">
                  <motion.div layoutId={`media-container-${id}`} className="w-full h-full flex flex-col relative overflow-hidden">
                    {mediaUrl ? (
                      <>
                        {/* Subtle Ambient Background */}
                        <div className="absolute inset-0 scale-105 blur-3xl opacity-10 dark:opacity-20 transition-opacity">
                          {isVideo ? (
                            <video src={mediaUrl} muted loop playsInline autoPlay className="w-full h-full object-cover" />
                          ) : (
                            <img src={mediaUrl} className="w-full h-full object-cover" />
                          )}
                        </div>

                        {/* Centered Media */}
                        <div className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
                          {isVideo ? (
                            <video
                              src={mediaUrl}
                              className="max-h-full max-w-full rounded-lg shadow-sm border border-black/5 dark:border-white/5"
                              controls
                              autoPlay
                              playsInline
                            />
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={title}
                              className="max-h-full max-w-full object-contain rounded-lg shadow-sm border border-black/5 dark:border-white/5"
                            />
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-20 bg-black/[0.02]">
                        <Sparkles className="w-12 h-12 text-black/10 dark:text-white/10" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Right: Story Area */}
                <div className="w-full lg:w-[45%] p-8 md:p-12 lg:p-16 flex flex-col space-y-12 bg-white dark:bg-[#0c0c0c]">
                  
                  {/* Title & Description */}
                  <div className="space-y-6">
                    <motion.h2 
                      layoutId={`title-${id}`}
                      className="text-3xl md:text-4xl font-semibold text-text-main tracking-tight leading-snug"
                    >
                      {title}
                    </motion.h2>
                    <p className="text-lg text-text-main/70 font-normal leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <hr className="border-black/[0.04] dark:border-white/[0.04]" />

                  {/* Impact */}
                  {impact && (
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">the outcome</h4>
                      <p className="text-sm font-medium text-text-main/80 leading-relaxed border-l-2 border-black/10 dark:border-white/10 pl-4 py-1">
                        {impact}
                      </p>
                    </section>
                  )}

                  {/* Stack */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">technology</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-text-main/70 bg-black/[0.03] dark:bg-white/[0.03] rounded border border-black/[0.04] dark:border-white/[0.04]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learnings */}
                  {learnings && learnings.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">key learnings</h4>
                      <ul className="space-y-4">
                        {learnings.map((learning, i) => (
                          <li key={i} className="flex gap-4 text-sm font-normal text-text-main/80 leading-relaxed">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mt-1.5" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
