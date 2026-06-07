import { useState } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Cpu, ExternalLink, Github, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
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
  contnetUrl,
  webUrl,
  completionDate,
  challenges,
  keyFeatures,
  setup,
}) => {
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
          cursor-pointer overflow-hidden border border-border/50 hover:border-primary/50
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Subtle overlay for hover effect */}
        <div className="absolute inset-0 bg-primary/5
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
          
          {/* Image overlay with project type indicator */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-neutral-bg/20 to-transparent 
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Quick preview button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform 
            translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="p-2 bg-neutral-bg/80 backdrop-blur-sm rounded-full border border-border/50">
              <Eye className="h-4 w-4 text-primary" />
            </div>
          </div>

          {/* Completion year badge */}
          {completionDate && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm 
              rounded-full border border-border/50">
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
                  group-hover:border-primary/40 group-hover:bg-primary/20 group-hover:scale-105"
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
            <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/20 text-primary
              rounded-md text-xs sm:text-sm font-medium hover:bg-primary/30 transition-colors border border-primary/30">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </button>
            {contnetUrl && (
              <a
                href={contnetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 sm:p-2 bg-surface text-ink/40 rounded-md hover:bg-surface/80
                  hover:text-ink transition-colors border border-border"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            )}
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

                  {/* Compact Header with project info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 pr-12 sm:pr-16 border-b border-border/50">
                    <div className="mb-4 sm:mb-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">{title}</h2>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-ink/40 text-sm">
                        {completionDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{completionDate}</span>
                          </div>
                        )}
                        {setup && (
                          <div className="flex items-center gap-1">
                            <Cpu className="h-3 w-3" />
                            <span>{setup.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {contnetUrl && (
                        <a
                          href={contnetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/80
                            text-neutral-bg rounded-md font-medium transition-colors text-xs sm:text-sm"
                        >
                          <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">View Code</span>
                          <span className="sm:hidden">Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Compact Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
                    {/* Main Image */}
                    <div className="lg:col-span-2">
                      <div className="aspect-[16/9] rounded-md overflow-hidden mb-4 border border-border/50">
                        <img
                          src={webUrl || imageUrl}
                          alt={title}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      
                      {/* Description */}
                      <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 mb-4 border border-border/50">
                        <h3 className="text-lg font-bold mb-2 text-primary">About</h3>
                        <p className="text-ink/80 leading-relaxed text-sm">
                          {description}
                        </p>
                      </div>

                      {/* Key Features - Compact */}
                      {keyFeatures && keyFeatures.length > 0 && (
                        <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 border border-border/50">
                          <h3 className="text-lg font-bold mb-3 text-primary">Key Features</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {keyFeatures.slice(0, 6).map((feature, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-ink/60">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Compact Sidebar */}
                    <div className="space-y-4">
                      <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 border border-border/50">
                        <h3 className="text-lg font-bold mb-3 text-primary">Tech Stack</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {tags?.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium
                                border border-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Project Stats - Compact */}
                      <div className="bg-secondary/10 backdrop-blur-sm
                        rounded-md p-4 border border-secondary/20">
                        <h3 className="text-lg font-bold mb-3 text-secondary">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-ink/60">Year</span>
                            <span className="text-secondary font-semibold">{completionDate || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-ink/60">Type</span>
                            <span className="text-secondary font-semibold">
                              {tags?.includes('React') ? 'Web App' :
                               tags?.includes('Python') ? 'Backend' :
                               tags?.includes('Flutter') ? 'Mobile App' : 'Software'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Challenges - Compact if exists */}
                      {challenges && (
                        <div className="bg-surface/50 backdrop-blur-sm rounded-md p-4 border border-border/50">
                          <h3 className="text-lg font-bold mb-2 text-primary">Challenges</h3>
                          <p className="text-ink/60 leading-relaxed text-sm">
                            {challenges.length > 150 ? challenges.substring(0, 150) + '...' : challenges}
                          </p>
                        </div>
                      )}
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

export default ProjectCard;
