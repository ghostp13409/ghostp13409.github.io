import React, { useState } from "react";
import { X, CirclePlay, Eye, Video, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VideoCard = ({ title, description, tags, videoUrl, thumbnailUrl }) => {
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
        className="group relative flex flex-col bg-gray-800/50 backdrop-blur-xl rounded-3xl 
          cursor-pointer overflow-hidden border border-gray-700/50 hover:border-gray-600/50 
          shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        {/* Gradient overlay for hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-cyan-500/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

        {/* Video thumbnail container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3xl">
          <div className={`absolute inset-0 bg-gray-700 animate-pulse transition-opacity duration-300 ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent 
            opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Play button */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-4 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-600/50 
                group-hover:bg-green-600/20 group-hover:border-green-500/50 transition-all duration-300"
            >
              <CirclePlay className="h-8 w-8 text-white group-hover:text-green-400 transition-colors duration-300" />
            </motion.div>
          </div>

          {/* Video preview button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform 
            translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <div className="p-2 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-600/50">
              <Video className="h-4 w-4 text-green-400" />
            </div>
          </div>

          {/* Video type badge */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm 
            rounded-full border border-gray-600/50">
            <span className="text-xs font-medium text-gray-300">Video</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-green-400 
            transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-xl text-xs font-medium
                  border border-green-500/20 transition-all duration-300 
                  group-hover:border-green-500/40 group-hover:bg-green-500/20 group-hover:scale-105"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="px-3 py-1.5 bg-gray-600/20 text-gray-400 rounded-xl text-xs font-medium
                border border-gray-600/30">
                +{tags.length - 4} more
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 
            transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 
              rounded-xl text-sm font-medium hover:bg-green-600/30 transition-colors border border-green-500/30">
              <CirclePlay className="h-4 w-4" />
              Watch Video
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
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 overflow-y-auto px-4 py-8"
            onClick={() => setShowPreview(false)}
          >
            <div className="min-h-screen flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-6xl w-full bg-gray-900/95 backdrop-blur-xl rounded-3xl
                  shadow-2xl border border-gray-700/50 overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="absolute top-6 right-6 p-2 bg-gray-800/80 backdrop-blur-sm rounded-xl
                    hover:bg-gray-700/80 transition-colors duration-300 shadow-lg z-30 border border-gray-600/50"
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>

                {/* Compact Header */}
                <div className="flex items-center justify-between p-6 pr-16 border-b border-gray-700/50">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
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
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-800">
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
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                        <h3 className="text-lg font-bold mb-2 text-green-400">About This Video</h3>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {description}
                        </p>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
                        <h3 className="text-lg font-bold mb-3 text-green-400">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {tags?.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium
                                border border-green-500/30"
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
      </AnimatePresence>
    </>
  );
};

export default VideoCard;
