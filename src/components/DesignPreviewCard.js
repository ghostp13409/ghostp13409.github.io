import React, { useState } from "react";
import { X, Github, Link as LinkIcon, Calendar, User } from "lucide-react";
import DesignPreview from "./DesignPreview";

const DesignPreviewCard = ({ title, description, tags, imageUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPreview(true)}
        className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl transform transition-all duration-300 
          hover:scale-105 hover:shadow-lg hover:bg-gray-700/50 cursor-pointer group relative overflow-hidden border border-gray-700"
      >
        <div className="h-40 bg-gray-700 rounded-lg mb-3 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{title}</h3>
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
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
             onClick={() => setShowPreview(false)}>
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg 
              hover:bg-gray-700 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-h-screen px-4 py-6">
            <div className="relative max-w-5xl mx-auto">
              {/* Content Grid */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900/90 backdrop-blur-sm rounded-xl p-5"
              >
                {/* Hero Image Section */}
                <div className="rounded-lg overflow-hidden">
                  <DesignPreview />
                </div>
                {/* Content Section */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DesignPreviewCard;
