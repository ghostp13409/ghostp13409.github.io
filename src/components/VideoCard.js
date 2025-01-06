import React, { useState } from "react";
import { X, CirclePlay } from "lucide-react";

const VideoCard = ({ title, description, tags, videoUrl, thumbnailUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPreview(true)}
        className="group relative flex flex-col bg-gray-800/80 backdrop-blur-sm rounded-xl 
          transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl 
          hover:shadow-blue-500/10 cursor-pointer overflow-hidden border border-gray-700
          hover:border-blue-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 
              transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />
          <CirclePlay className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 
            text-white/80 group-hover:text-white transition-colors duration-300" />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-blue-400 
            transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full text-xs 
                  border border-blue-500/20 transition-all duration-300 
                  group-hover:border-blue-500/40 group-hover:bg-blue-600/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto px-4 py-6" 
          onClick={() => setShowPreview(false)}>
          <div className="min-h-screen flex items-center justify-center">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full bg-gray-900/95 backdrop-blur-lg rounded-2xl 
                shadow-2xl shadow-blue-500/10 border border-gray-800"
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-4 -right-4 p-2 bg-gray-800 rounded-full 
                  hover:bg-gray-700 transition-colors duration-300 shadow-lg z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 space-y-6">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    playsInline
                  />
                </div>

                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-4 text-blue-400">{title}</h2>
                  <p className="text-gray-300 leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
