import React, { useState } from "react";
import { X, CirclePlay } from "lucide-react";

const VideoCard = ({ title, description, tags, videoUrl, thumbnailUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPreview(true)}
        className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl transform transition-all duration-300 
          hover:scale-105 hover:shadow-lg hover:bg-gray-700/50 cursor-pointer group relative overflow-hidden border border-gray-700"
      >
        {/* Video Thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="h-40 bg-gray-700 rounded-lg mb-3 overflow-hidden">
          <img
            src={thumbnailUrl}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            alt={title}
          />
        </div>

        <h3 className="text-lg font-bold mb-2 text-gray-100">{title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-xs transition-all duration-300 hover:bg-blue-600/30"
            >
              {tag}
            </span>
          ))}
          <span className="relative flex gap-1.5 px-2 py-0.5 bg-pink-400/20 text-pink-400 rounded-full text-xs">
            <CirclePlay className="w-4 h-4" />
            Video
          </span>
        </div>

        <div
          className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 
          rounded-lg transition-opacity duration-300"
        />
      </div>

      {/* Fullscreen Video Preview */}
      {showPreview && (
        <div
          onClick={() => setShowPreview(false)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        >
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg 
              hover:bg-gray-700 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-full max-w-5xl p-4">
            <div className="relative rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                className="w-full h-auto"
                controls
                autoPlay
                playsInline
              >
                Your browser does not support the video tag.
              </video>

              <div
                className=" bg-gradient-to-t 
                from-black/80 to-transparent p-6"
              >
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-300">{description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
