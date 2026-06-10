import { useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, CirclePlay, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface VideoCardProps {
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  year?: number;
}

const VideoCard: FC<VideoCardProps> = ({ title, description, tags, videoUrl, thumbnailUrl, year }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
          cursor-pointer overflow-hidden border border-border/50 hover:border-secondary/50
          shadow-xl hover:shadow-2xl transition-all duration-300 w-full"
      >
        {/* Subtle overlay for hover effect */}
        <div className="absolute inset-0 bg-secondary/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        {/* Video thumbnail container - FORCED 16:9 */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-neutral-bg">
          <div className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 z-20 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} />

          <img
            src={thumbnailUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover object-center transform group-hover:scale-105
              transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-transparent to-neutral-bg/30
            opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />

          {/* Large Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="p-5 bg-neutral-bg/60 backdrop-blur-md rounded-full border border-secondary/50
                group-hover:bg-secondary/20 group-hover:border-secondary transition-all duration-500 shadow-2xl"
            >
              <CirclePlay className="h-12 w-12 text-secondary drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
            </motion.div>
          </div>

          {/* Quick info badges */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
            <div className="px-3 py-1 backdrop-blur-md rounded-full border /30">
              <span className="text-[10px] font-bold uppercase tracking-widest">{year}</span>
            </div>
          </div>
        </div>

        {/* Content section - Compacted for wide card */}
        <div className="p-5 sm:p-7 flex flex-col flex-grow relative z-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl sm:text-2xl font-bold text-ink group-hover:text-secondary
              transition-colors duration-300 leading-tight">
              {title}
            </h3>
            <Video className="h-5 w-5 text-secondary/40 shrink-0 mt-1" />
          </div>

          <p className="text-ink/60 text-sm mb-6 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            {/* Tech stack tags */}
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-surface border border-border text-ink/40 rounded-sm text-[10px] font-mono uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>
        </div>
      </motion.div>

      {/* Enhanced Modal */}
      {createPortal(
        <AnimatePresence>
          {showPreview && (
            <motion.div
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
                {/* Close button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-4 right-4 p-2.5 bg-neutral-bg/80 backdrop-blur-md rounded-full
                    hover:bg-secondary/20 hover:text-secondary transition-all duration-300 z-50 border border-border/50 group"
                >
                  <X className="w-5 h-5 text-ink/60 group-hover:scale-110" />
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* 1. Modal Hero - Video Player - Ultra Wide Cinematic Crop */}
                  <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden border-b border-border/50 bg-black">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      playsInline
                      poster={thumbnailUrl}
                    />

                    {/* Header Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-5 sm:p-8 lg:p-10 z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="h-px w-6 bg-border hidden sm:block" />
                          <span className="text-white/40 text-[10px] font-mono uppercase">V_STREAM_0{tags.length}</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                          {title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* 2. Body Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">

                    {/* Main Story Column */}
                    <div className="lg:col-span-8 p-5 sm:p-10 space-y-8 sm:space-y-10 border-r border-border/50">

                      {/* Overview */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-secondary">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                          <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">Project Overview</h3>
                        </div>
                        <p className="text-sm sm:text-lg text-ink/80 leading-relaxed">
                          {description}
                        </p>
                      </section>
                    </div>

                    {/* Metadata Column */}
                    <div className="lg:col-span-4 bg-neutral-bg/20 p-5 sm:p-10 space-y-8 sm:space-y-10">

                      {/* Tech Stack */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-surface border border-border text-ink/60 rounded-sm text-[9px] sm:text-[10px] font-mono
                                hover:border-secondary/50 hover:text-secondary transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Specs
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Application Specs</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Status</span>
                            <span className="text-secondary text-xs font-bold uppercase tracking-tighter">Production Ready</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Scope</span>
                            <span className="text-ink/80 text-xs font-bold uppercase tracking-tighter">Full Stack</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Verification</span>
                            <span className="text-ink/80 text-xs font-bold uppercase tracking-tighter">Verified Build</span>
                          </div>
                        </div>
                      </section> */}

                      {/* Video Footer Note */}
                      <div className="pt-4">
                        <p className="text-[10px] text-ink/20 leading-relaxed uppercase tracking-widest text-center">
                          Build demonstration
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default VideoCard;
