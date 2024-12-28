import React, { useState } from "react";
import { X, Github, Link as LinkIcon, Calendar, User } from "lucide-react";
import DesignPreview from "./DesignPreview";

const DesignPreviewCard = ({ title, description, tags, imageUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {/* Main Card - Keeping your existing card design */}
      <div
        onClick={() => setShowPreview(true)}
        className="bg-gray-800 p-6 rounded-lg transform transition-all duration-300 
          hover:scale-105 hover:shadow-xl cursor-pointer group"
      >
        <div className="h-48 bg-gray-700 rounded-lg mb-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm transform transition-transform duration-300 hover:scale-110"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300" />
      </div>

      {/* Enhanced Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
          onClick={() => setShowPreview(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800 rounded-lg 
                        hover:bg-gray-700 transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="min-h-screen px-4 py-8">
            <div className="relative max-w-6xl mx-auto">
              {/* Content Grid */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 rounded-xl p-6"
              >
                {/* Hero Image Section */}
                <div className="md:col-span-2">
                  <div className="relative rounded-lg overflow-hidden h-full">
                    <div className="w-full h-full">
                      <DesignPreview />
                    </div>
                  </div>
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
