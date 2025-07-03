import React, { useState } from "react";
import { X, Eye, Palette, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DesignPreview from "./DesignPreview";

const DesignPreviewCard = ({ title, description, tags, imageUrl }) => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10
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
          
          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent 
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Design preview button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform 
            translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-600/50">
              <Palette className="h-4 w-4 text-purple-400" />
            </div>
          </div>

          {/* Design type badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm 
            rounded-full border border-gray-600/50">
            <span className="text-xs font-medium text-gray-300">Design</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-100 group-hover:text-purple-400
            transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Design tools tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 text-purple-400 rounded-lg sm:rounded-xl text-xs font-medium
                  border border-purple-500/20 transition-all duration-300
                  group-hover:border-purple-500/40 group-hover:bg-purple-500/20 group-hover:scale-105"
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
            <button className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600/20 text-purple-400
              rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-purple-600/30 transition-colors border border-purple-500/30">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">View Designs</span>
              <span className="sm:hidden">View</span>
            </button>
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

                {/* Compact Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 pr-12 sm:pr-16 border-b border-gray-700/50">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{title}</h2>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
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
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-bold mb-2 text-purple-400">About This Project</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {description}
                    </p>
                  </div>

                  {/* Design Preview Component */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-bold mb-4 text-purple-400">Design Showcase</h3>
                    <div className="rounded-xl overflow-hidden">
                      <DesignPreview />
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="text-lg font-bold mb-3 text-purple-400">Tools & Software</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tool, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-xl text-xs font-medium
                            border border-purple-500/30"
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
      </AnimatePresence>
    </>
  );
};

export default DesignPreviewCard;
