import React, { useState } from "react";
import { X } from "lucide-react";

const ProjectCard = ({ title, description, tags, imageUrl }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
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
              className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-s transform transition-transform duration-300 hover:scale-110"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 
          rounded-lg transition-opacity duration-300"
        />
      </div>

      {/* Fullscreen Preview */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800 rounded-lg 
              hover:bg-gray-700 transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-6xl p-4">
            <div className="relative rounded-lg overflow-hidden">
              <img src={imageUrl} alt={title} className="w-full h-auto" />

              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                from-black/80 to-transparent p-6"
              >
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-gray-300 text-xl">{description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
