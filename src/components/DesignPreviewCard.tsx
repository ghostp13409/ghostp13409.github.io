import { useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, Eye, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import DesignPreview from "./DesignPreview";

interface DesignPreviewCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

const DesignPreviewCard: FC<DesignPreviewCardProps> = ({ title, description, tags, imageUrl }) => {
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
          cursor-pointer overflow-hidden border border-border/50 hover:border-accent/50
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Subtle overlay for hover effect */}
        <div className="absolute inset-0 bg-accent/5
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

        {/* Image container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-t-lg">
          <div className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 ${
            imageLoaded ? 'opacity-0' : 'opacity-100'
          }`} />
          
          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transform group-hover:scale-105 
              transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-neutral-bg/20 to-transparent 
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Design preview button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform 
            translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="p-2 bg-neutral-bg/80 backdrop-blur-sm rounded-full border border-border/50">
              <Palette className="h-4 w-4 text-accent" />
            </div>
          </div>

          {/* Design type badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm 
            rounded-full border border-border/50">
            <span className="text-xs font-medium text-ink/60">Design</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ink group-hover:text-accent
            transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          <p className="text-ink/60 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Design tools tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-accent/10 text-accent rounded-md text-xs font-medium
                  border border-accent/20 transition-all duration-300
                  group-hover:border-accent/40 group-hover:bg-accent/20 group-hover:scale-105"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-surface text-ink/40 rounded-md text-xs font-medium
                border border-border">
                +{tags.length - 4} more
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 opacity-0 sm:group-hover:opacity-100
            transform translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
            <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/20 text-accent
              rounded-md text-xs sm:text-sm font-medium hover:bg-accent/30 transition-colors border border-accent/30">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">View Designs</span>
              <span className="sm:hidden">View</span>
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
              className="fixed inset-0 bg-neutral-bg/95 backdrop-blur-sm z-[9999] overflow-y-auto px-2 sm:px-4 py-4 sm:py-8"
              onClick={() => setShowPreview(false)}
            >
              <div className="min-h-screen flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-7xl w-full bg-surface/95 backdrop-blur-xl rounded-lg
                    shadow-2xl border border-border/50 overflow-hidden"
                >
                  {/* Close button */}
                  <button
                    onClick={() => setShowPreview(false)}
                    className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 bg-surface/80 backdrop-blur-sm rounded-md
                      hover:bg-surface transition-colors duration-300 shadow-lg z-30 border border-border/50"
                  >
                    <X className="w-4 h-4 text-ink/60" />
                  </button>

                  {/* Compact Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 pr-12 sm:pr-16 border-b border-border/50">
                    <div className="mb-4 sm:mb-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">{title}</h2>
                      <div className="flex items-center gap-4 text-ink/40 text-sm">
                        <div className="flex items-center gap-1">
                          <Palette className="h-3 w-3" />
                          <span>Design Portfolio</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="p-4 sm:p-6">
                    {/* Description */}
                    <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 mb-6 border border-border/50">
                      <h3 className="text-lg font-bold mb-2 text-accent">About This Project</h3>
                      <p className="text-ink/80 leading-relaxed text-sm">
                        {description}
                      </p>
                    </div>

                    {/* Design Preview Component */}
                    <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 mb-6 border border-border/50">
                      <h3 className="text-lg font-bold mb-4 text-accent">Design Showcase</h3>
                      <div className="rounded-md overflow-hidden">
                        <DesignPreview />
                      </div>
                    </div>

                    {/* Tools Used */}
                    <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 border border-border/50">
                      <h3 className="text-lg font-bold mb-3 text-accent">Tools & Software</h3>
                      <div className="flex flex-wrap gap-2">
                        {tags?.map((tool, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-accent/10 text-accent rounded-md text-xs font-medium
                              border border-accent/20"
                          >
                            {tool}
                          </span>
                        ))}
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

export default DesignPreviewCard;
