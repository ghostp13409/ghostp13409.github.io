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
}

const VideoCard: FC<VideoCardProps> = ({ title, description, tags, videoUrl, thumbnailUrl }) => {
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
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Subtle overlay for hover effect */}
        <div className="absolute inset-0 bg-secondary/5 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        {/* Video thumbnail container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg">
          <div className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} />
          
          <img
            src={thumbnailUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transform group-hover:scale-105 
              transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Video overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-neutral-bg/20 to-transparent 
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Play button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-4 bg-neutral-bg/80 backdrop-blur-sm rounded-full border border-border/50 
                group-hover:bg-secondary/20 group-hover:border-secondary/50 transition-all duration-300"
            >
              <CirclePlay className="h-8 w-8 text-ink group-hover:text-secondary transition-colors duration-300" />
            </motion.div>
          </div>

          {/* Video preview button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform 
            translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="p-2 bg-neutral-bg/80 backdrop-blur-sm rounded-full border border-border/50">
              <Video className="h-4 w-4 text-secondary" />
            </div>
          </div>

          {/* Video type badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm 
            rounded-full border border-border/50">
            <span className="text-xs font-medium text-ink/60">Video</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-xl font-bold mb-3 text-ink group-hover:text-secondary 
            transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          <p className="text-ink/60 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-md text-xs font-medium
                  border border-secondary/20 transition-all duration-300 
                  group-hover:border-secondary/40 group-hover:bg-secondary/20 group-hover:scale-105"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-3 py-1.5 bg-surface text-ink/40 rounded-md text-xs font-medium
                border border-border">
                +{tags.length - 4} more
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 
            transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-secondary 
              rounded-md text-sm font-medium hover:bg-secondary/30 transition-colors border border-secondary/30">
              <CirclePlay className="h-4 w-4" />
              Watch Video
            </button>
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
              className="fixed inset-0 bg-neutral-bg/95 backdrop-blur-sm z-[9999] overflow-y-auto px-4 py-8"
              onClick={() => setShowPreview(false)}
            >
              <div className="min-h-screen flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-6xl w-full bg-surface/95 backdrop-blur-xl rounded-lg
                    shadow-2xl border border-border/50 overflow-hidden"
                >
                  {/* Close button */}
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-6 right-6 p-2 bg-surface/80 backdrop-blur-sm rounded-md
                      hover:bg-surface transition-colors duration-300 shadow-lg z-30 border border-border/50"
                  >
                    <X className="w-4 h-4 text-ink/60" />
                  </button>

                  {/* Compact Header */}
                  <div className="flex items-center justify-between p-6 pr-16 border-b border-border/50">
                    <div>
                      <h2 className="text-2xl font-bold text-ink mb-2">{title}</h2>
                      <div className="flex items-center gap-4 text-ink/40 text-sm">
                        <div className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          <span>Video Demonstration</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Video and Content */}
                  <div className="p-6 space-y-6">
                    {/* Video Player */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface border border-border/50">
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        playsInline
                        poster={thumbnailUrl}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Main Content */}
                      <div className="lg:col-span-2">
                        <div className="bg-surface/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                          <h3 className="text-lg font-bold mb-2 text-secondary">About This Video</h3>
                          <p className="text-ink/80 leading-relaxed text-sm">
                            {description}
                          </p>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-4">
                        <div className="bg-surface/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                          <h3 className="text-lg font-bold mb-3 text-secondary">Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {tags?.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-secondary/10 text-secondary rounded-md text-xs font-medium
                                  border border-secondary/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default VideoCard;
