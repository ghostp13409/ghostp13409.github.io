import { useState, useEffect, useCallback } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, Eye, Github, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface ProjectShowcaseCardProps {
  title: string;
  description: string;
  tags: string[];
  year: number;
  imageUrl: string;
  contentUrl?: string;
  completionDate?: string;
  challenges?: string;
  keyFeatures?: string[];
  screenshots?: string[];
}

const ProjectShowcaseCard: FC<ProjectShowcaseCardProps> = ({
  title,
  description,
  tags,
  year,
  imageUrl,
  contentUrl,
  completionDate,
  challenges,
  keyFeatures,
  screenshots = [],
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState<number | null>(null);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (screenshotIndex !== null) {
      setScreenshotIndex((prev) => (prev! + 1) % screenshots.length);
    }
  }, [screenshotIndex, screenshots.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (screenshotIndex !== null) {
      setScreenshotIndex((prev) => (prev! - 1 + screenshots.length) % screenshots.length);
    }
  }, [screenshotIndex, screenshots.length]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (screenshotIndex !== null) setScreenshotIndex(null);
        else setShowPreview(false);
      } else if (screenshotIndex !== null) {
        if (event.key === "ArrowRight") handleNext();
        else if (event.key === "ArrowLeft") handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screenshotIndex, handleNext, handlePrev]);

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
        <div className="absolute inset-0 bg-primary/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg bg-neutral-bg">
          <div className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 z-20 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} />

          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transform group-hover:scale-105
              transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-transparent to-neutral-bg/20
            opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform
            translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-30 scale-90 group-hover:scale-100">
            <div className="p-3 bg-primary text-neutral-bg rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm
            rounded-full border border-border/50 z-30">
            <span className="text-xs font-medium text-ink/60">{year}</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ink group-hover:text-primary
            transition-colors duration-300 leading-tight">
            {title}
          </h3>

          <p className="text-ink/60 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

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

      {createPortal(
        <AnimatePresence mode="wait">
          {showPreview && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-bg/98 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-8"
              onClick={() => setShowPreview(false)}
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
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-4 right-4 p-2.5 bg-neutral-bg/80 backdrop-blur-md rounded-full
                    hover:bg-primary/20 hover:text-primary transition-all duration-300 z-50 border border-border/50 group"
                >
                  <X className="w-5 h-5 text-ink/60 group-hover:scale-110" />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="relative aspect-[16/10] sm:aspect-[21/6] w-full overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-neutral-bg/20 to-transparent z-10" />
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover object-center"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-10 z-20">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                            {completionDate || '2025'} Project
                          </span>
                          <span className="h-px w-6 bg-border hidden sm:block" />
                          <span className="text-ink/40 text-[10px] font-mono uppercase hidden sm:block">SHOWCASE_0{tags.length}</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight drop-shadow-md">
                          {title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">
                    <div className="lg:col-span-8 p-5 sm:p-10 space-y-8 sm:space-y-10 border-r border-border/50">
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">The Vision</h3>
                        </div>
                        <p className="text-sm sm:text-lg text-ink/80 leading-relaxed">
                          {description}
                        </p>
                      </section>

                      {screenshots.length > 0 && (
                        <section className="space-y-6">
                          <div className="flex items-center gap-2 text-secondary">
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                            <h3 className="text-[11px] font-bold uppercase tracking-widest">Gallery</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {screenshots.map((url, index) => (
                              <div
                                key={index}
                                onClick={() => setScreenshotIndex(index)}
                                className="relative aspect-[9/16] bg-neutral-bg/40 rounded-md overflow-hidden border border-border/50 cursor-zoom-in group/item shadow-lg"
                              >
                                <img
                                  src={url}
                                  alt={`${title} screenshot ${index + 1}`}
                                  className="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-8 h-8 text-primary opacity-50" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    <div className="lg:col-span-4 bg-neutral-bg/20 p-6 sm:p-10 space-y-10">
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

                      {keyFeatures && keyFeatures.length > 0 && (
                        <section className="space-y-4">
                          <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Key Features</h3>
                          <ul className="space-y-2">
                            {keyFeatures.map((feature, index) => (
                              <li key={index} className="flex gap-3 text-sm text-ink/60 leading-relaxed">
                                <span className="text-primary font-mono mt-1">→</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}

                      {challenges && (
                        <section className="space-y-4">
                          <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">The Hurdles</h3>
                          <p className="text-xs text-ink/60 italic leading-relaxed border-l-2 border-accent/30 pl-4">
                            {challenges}
                          </p>
                        </section>
                      )}

                      {contentUrl && (
                        <div className="pt-4">
                          <a
                            href={contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-neutral-bg rounded-md font-bold text-xs uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                          >
                            <Github className="w-4 h-4" />
                            <span>View Source</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {screenshotIndex !== null && (
            <motion.div
              key="fullscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4"
              onClick={() => setScreenshotIndex(null)}
            >
              {/* Close button */}
              <button
                onClick={() => setScreenshotIndex(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation buttons */}
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 sm:left-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/5 group"
                  >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 sm:right-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/5 group"
                  >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Counter */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/60 text-sm font-mono tracking-widest">
                    {screenshotIndex + 1} / {screenshots.length}
                  </div>
                </>
              )}

              <motion.img
                key={screenshotIndex}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                src={screenshots[screenshotIndex]}
                alt={`${title} screenshot ${screenshotIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ProjectShowcaseCard;
