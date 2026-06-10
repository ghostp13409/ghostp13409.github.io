import { useState, useEffect } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, Github, Eye, PlayCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  contnetUrl?: string;
  webUrl?: string;
  webContent?: string;
  completionDate?: string;
  challenges?: string;
  keyFeatures?: string[];
  setup?: string[];
}

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  videoUrl,
  contnetUrl,
  webUrl,
  completionDate,
  challenges,
  keyFeatures,
  setup,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        else setShowPreview(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => setShowPreview(true)}
        className="group relative flex flex-col bg-surface/40 backdrop-blur-xl rounded-lg
          cursor-pointer overflow-hidden border border-border/50 hover:border-primary/50
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Subtle overlay for hover effect */}
        <div className="absolute inset-0 bg-primary/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        {/* Image container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-t-lg bg-neutral-bg">
          <div className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 z-20 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} />

          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover object-center transform group-hover:scale-105
              transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-transparent to-neutral-bg/20
            opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />

          {/* Video Play Indicator */}
          {videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="p-3 bg-neutral-bg/40 backdrop-blur-md rounded-full border border-white/20
                group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-500">
                <PlayCircle className="w-10 h-10 text-white/80 group-hover:text-primary transition-colors" />
              </div>
            </div>
          )}

          {/* Quick preview button - Enhanced Prominence */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform
            translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-30 scale-90 group-hover:scale-100">
            <div className="p-3 bg-primary text-neutral-bg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {/* Completion year badge */}
          {completionDate && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm
              rounded-full border border-border/50 z-30">
              <span className="text-xs font-medium text-ink/60">{completionDate}</span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ink group-hover:text-primary
            transition-colors duration-300 leading-tight">
            {title}
          </h3>

          <p className="text-ink/60 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/10 text-primary rounded-md text-xs font-medium
                  border border-primary/20 transition-all duration-300
                  group-hover:border-primary/40 group-hover:bg-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </motion.div>

      {/* Enhanced Modal */}
      {createPortal(
        <AnimatePresence mode="wait">
          {showPreview && !isFullscreen && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-bg/98 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8"
              onClick={() => {
                setShowPreview(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl max-h-[90vh] bg-surface/40 backdrop-blur-xl rounded-lg
                  shadow-2xl border border-border/50 overflow-hidden flex flex-col"
              >
                {/* Close Button - Floating & Pinned */}
                <button
                  onClick={() => {
                    setShowPreview(false);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-neutral-bg/80 backdrop-blur-md rounded-full
                    hover:bg-primary/20 hover:text-primary transition-all duration-300 z-50 border border-border/50 group"
                >
                  <X className="w-5 h-5 text-ink/60 group-hover:scale-110" />
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* 1. Modal Hero Section */}
                  <div className="relative aspect-[21/9] sm:aspect-[21/7] w-full overflow-hidden border-b border-border/50 group/hero bg-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-neutral-bg/20 to-transparent z-10" />

                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                      />
                    ) : (
                      <img
                        src={webUrl || imageUrl}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                      />
                    )}

                    {/* Fullscreen Button - Prominent */}
                    <button
                      onClick={() => setIsFullscreen(true)}
                      className="absolute top-4 right-16 flex items-center gap-2 px-3 py-2 bg-neutral-bg/80 backdrop-blur-md rounded-md border border-border/50
                        z-30 hover:bg-primary hover:text-neutral-bg transition-all font-bold text-[9px] uppercase tracking-widest shadow-xl group/fs"
                      title="View Fullscreen"
                    >
                      <Eye className="w-3.5 h-3.5 text-primary group-hover/fs:text-neutral-bg" />
                      <span className="text-primary group-hover/fs:text-neutral-bg">Full_Screen</span>
                    </button>

                    {/* Project Header Overlay - Fixed inside hero */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-20">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                              {completionDate || '2026'} Project
                            </span>
                            <span className="h-px w-6 bg-border" />
                            <span className="text-ink/40 text-[10px] font-mono uppercase">CS_0{tags.length}</span>
                          </div>
                          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
                            {title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-4">
                          {contnetUrl && (
                            <a
                              href={contnetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-neutral-bg rounded-md
                                font-bold text-sm hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/20"
                            >
                              <Github className="w-4 h-4" />
                              <span>SOURCE_CODE</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Content Body Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">

                    {/* Main Story Column */}
                    <div className="lg:col-span-8 p-6 sm:p-10 space-y-10 border-r border-border/50">

                      {/* The Brief */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <h3 className="text-[11px] font-bold uppercase tracking-widest">The Vision</h3>
                        </div>
                        <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
                          {description}
                        </p>
                      </section>

                      {/* Capabilities */}
                      {keyFeatures && keyFeatures.length > 0 && (
                        <section className="space-y-6">
                          <div className="flex items-center gap-2 text-secondary">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest">Core Capabilities</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {keyFeatures.map((feature, index) => (
                              <div key={index} className="flex gap-4 p-4 bg-neutral-bg/20 border border-border/30 rounded-md group hover:border-primary/30 transition-all duration-300">
                                <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-mono text-ink/40 group-hover:text-primary group-hover:border-primary transition-colors flex-shrink-0">
                                  0{index + 1}
                                </div>
                                <p className="text-sm text-ink/60 group-hover:text-ink/90 transition-colors leading-relaxed">
                                  {feature}
                                </p>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Technical Challenges */}
                      {challenges && (
                        <section className="p-6 bg-neutral-bg/40 border border-border/50 rounded-md space-y-3">
                          <div className="flex items-center gap-2 text-accent">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest">The Hurdles</h3>
                          </div>
                          <p className="text-sm text-ink/60 italic leading-relaxed">
                            "{challenges}"
                          </p>
                        </section>
                      )}
                    </div>

                    {/* Sidebar / Metadata Column */}
                    <div className="lg:col-span-4 bg-neutral-bg/20 p-6 sm:p-10 space-y-10">

                      {/* Tech Stack */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Architecture</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-surface border border-border text-ink/60 rounded-sm text-[10px] font-mono
                                hover:border-primary/50 hover:text-primary transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Specs */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Specifications</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Deployment</span>
                            <span className="text-ink/80 text-xs font-bold">{completionDate || '2026'}</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Platform</span>
                            <span className="text-ink/80 text-xs font-bold">
                              {tags?.includes('React') ? 'Web' : tags?.includes('Flutter') ? 'Mobile' : 'CLI'}
                            </span>
                          </div>
                          {setup && (
                            <div className="py-2.5">
                              <span className="text-ink/40 text-xs block mb-3">Environment</span>
                              <div className="flex flex-wrap gap-2">
                                {setup.slice(0, 4).map((s, i) => (
                                  <span key={i} className="text-[9px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full uppercase font-extrabold tracking-tighter">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </section>

                      {/* Sticky-ish CTA */}
                      <div className="pt-4">
                        <div className="p-5 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-md border border-primary/20 space-y-4">
                          <p className="text-[11px] text-ink/50 leading-relaxed font-medium">
                            Full implementation and documentation available on GitHub.
                          </p>
                          <a
                            href={contnetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-primary/40 rounded-md text-primary text-xs font-bold hover:bg-primary hover:text-neutral-bg transition-all"
                          >
                            OPEN_REPOSITORY
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {isFullscreen && (
            <motion.div
              key="fullscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[10000] flex items-center justify-center cursor-zoom-out"
              onClick={() => setIsFullscreen(false)}
            >
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50"
              >
                <X className="w-6 h-6" />
              </button>
              {videoUrl ? (
                <video
                  src={videoUrl}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  autoPlay
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={webUrl || imageUrl}
                  alt={title}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ProjectCard;
