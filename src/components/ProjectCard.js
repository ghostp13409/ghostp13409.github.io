import React, { useState } from "react";
import { X, Link as LinkIcon, Calendar, Cpu, ExternalLink, Github, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProjectCard = ({
  title,
  description,
  tags,
  imageUrl,
  contnetUrl,
  webUrl,
  webContent,
  completionDate,
  challenges,
  keyFeatures,
  setup,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardVariants = {
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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        onClick={() => setShowPreview(true)}
        className="group relative flex flex-col bg-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl
          cursor-pointer overflow-hidden border border-gray-700/50 hover:border-gray-600/50
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Gradient overlay for hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />

        {/* Image container */}
        <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
          <div className={`absolute inset-0 bg-gray-700 animate-pulse transition-opacity duration-300 ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent 
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Quick preview button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform 
            translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-600/50">
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
          </div>

          {/* Completion year badge */}
          {completionDate && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm 
              rounded-full border border-gray-600/50">
              <span className="text-xs font-medium text-gray-300">{completionDate}</span>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-100 group-hover:text-blue-400
            transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-500/10 text-blue-400 rounded-lg sm:rounded-xl text-xs font-medium
                  border border-blue-500/20 transition-all duration-300
                  group-hover:border-blue-500/40 group-hover:bg-blue-500/20 group-hover:scale-105"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-600/20 text-gray-400 rounded-lg sm:rounded-xl text-xs font-medium
                border border-gray-600/30">
                +{tags.length - 4} more
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 opacity-0 sm:group-hover:opacity-100
            transform translate-y-2 sm:group-hover:translate-y-0 transition-all duration-300">
            <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600/20 text-blue-400
              rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-600/30 transition-colors border border-blue-500/30">
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
                className="p-1.5 sm:p-2 bg-gray-700/50 text-gray-400 rounded-lg sm:rounded-xl hover:bg-gray-600/50
                  hover:text-gray-300 transition-colors border border-gray-600/30"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto px-2 sm:px-4 py-4 sm:py-8"
            onClick={() => setShowPreview(false)}
          >
            <div className="min-h-screen flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl w-full bg-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl
                  shadow-2xl border border-gray-700/50 overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 bg-gray-800/80 backdrop-blur-sm rounded-xl
                    hover:bg-gray-700/80 transition-colors duration-300 shadow-lg z-30 border border-gray-600/50"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>

                {/* Compact Header with project info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 pr-12 sm:pr-16 border-b border-gray-700/50">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-400 text-sm">
                      {completionDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{completionDate}</span>
                        </div>
                      )}
                      {setup && (
                        <div className="flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          <span>{setup}</span>
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
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700
                          text-white rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-sm"
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
                    <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                      <img
                        src={webUrl || imageUrl}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    {/* Description */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-4">
                      <h3 className="text-lg font-bold mb-2 text-blue-400">About</h3>
                      <p className="text-gray-300 leading-relaxed text-sm">
                        {description}
                      </p>
                    </div>

                    {/* Key Features - Compact */}
                    {keyFeatures && keyFeatures.length > 0 && (
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                        <h3 className="text-lg font-bold mb-3 text-blue-400">Key Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {keyFeatures.slice(0, 6).map((feature, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compact Sidebar */}
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                      <h3 className="text-lg font-bold mb-3 text-blue-400">Tech Stack</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {tags?.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-medium
                              border border-blue-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Project Stats - Compact */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm
                      rounded-xl p-4 border border-blue-500/30">
                      <h3 className="text-lg font-bold mb-3 text-blue-400">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Year</span>
                          <span className="text-blue-400 font-semibold">{completionDate || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Type</span>
                          <span className="text-blue-400 font-semibold">
                            {tags?.includes('React') ? 'Web App' :
                             tags?.includes('Python') ? 'Backend' :
                             tags?.includes('Flutter') ? 'Mobile App' : 'Software'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Challenges - Compact if exists */}
                    {challenges && (
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                        <h3 className="text-lg font-bold mb-2 text-blue-400">Challenges</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
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
      </AnimatePresence>
    </>
  );
};

export default ProjectCard;
