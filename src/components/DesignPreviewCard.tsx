import { useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, Eye } from "lucide-react";
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
        <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-t-lg bg-neutral-bg">
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

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-transparent to-neutral-bg/20
            opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />

          {/* Quick preview button - Enhanced Prominence */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform
            translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-30 scale-90 group-hover:scale-100">
            <div className="p-3 bg-accent text-neutral-bg rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {/* Design type badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm
            rounded-full border border-border/50 z-30">
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
                  group-hover:border-accent/40 group-hover:bg-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-auto">
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
                {/* Close Button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-4 right-4 p-2.5 bg-neutral-bg/80 backdrop-blur-md rounded-full
                    hover:bg-accent/20 hover:text-accent transition-all duration-300 z-50 border border-border/50 group"
                >
                  <X className="w-5 h-5 text-ink/60 group-hover:scale-110" />
                </button>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {/* 1. Modal Hero - Compacted */}
                  <div className="relative aspect-[21/9] sm:aspect-[21/6] w-full overflow-hidden border-b border-border/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg via-neutral-bg/20 to-transparent z-10" />
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Header Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-20">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-accent/20 text-accent border border-accent/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                            Creative Portfolio
                          </span>
                          <span className="h-px w-6 bg-border" />
                          <span className="text-ink/40 text-[10px] font-mono uppercase">DESIGN_EXP_0{tags.length}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
                          {title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* 2. Body Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0">

                    {/* Main Showcase Column */}
                    <div className="lg:col-span-8 p-6 sm:p-10 space-y-10 border-r border-border/50">

                      {/* Concept */}
                      <section className="space-y-3">
                        <div className="flex items-center gap-2 text-accent">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <h3 className="text-[11px] font-bold uppercase tracking-widest">The Concept</h3>
                        </div>
                        <p className="text-base sm:text-lg text-ink/80 leading-relaxed">
                          {description}
                        </p>
                      </section>

                      {/* Expanded Gallery - Removed the "Small Box" restriction */}
                      <section className="space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <h3 className="text-[11px] font-bold uppercase tracking-widest">Visual Assets</h3>
                        </div>
                        <div className="w-full">
                          <DesignPreview />
                        </div>
                      </section>
                    </div>

                    {/* Metadata Column */}
                    <div className="lg:col-span-4 bg-neutral-bg/20 p-6 sm:p-10 space-y-10">

                      {/* Tools */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Creative Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tool, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-surface border border-border text-ink/60 rounded-sm text-[10px] font-mono
                                hover:border-accent/50 hover:text-accent transition-all duration-300"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </section>

                      {/* Design Specs */}
                      <section className="space-y-4">
                        <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">Specifications</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Category</span>
                            <span className="text-ink/80 text-xs font-bold uppercase tracking-tighter">Graphic Design</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Identity</span>
                            <span className="text-ink/80 text-xs font-bold uppercase tracking-tighter">Full Brand Kit</span>
                          </div>
                          <div className="flex justify-between items-center py-2.5 border-b border-border/20">
                            <span className="text-ink/40 text-xs">Focus</span>
                            <span className="text-accent text-xs font-extrabold uppercase tracking-tighter">UI Precision</span>
                          </div>
                        </div>
                      </section>

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

export default DesignPreviewCard;
