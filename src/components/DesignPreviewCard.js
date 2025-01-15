import React, { useState } from "react";
import { X } from "lucide-react";
import DesignPreview from "./DesignPreview";

const DesignPreviewCard = ({ title, description, tags, imageUrl }) => {
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
        {/* Card gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image container with controlled aspect ratio */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 
              transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content section */}
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
