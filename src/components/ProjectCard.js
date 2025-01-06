import React, { useState } from "react";
import { X, Link as LinkIcon, Calendar, Cpu } from "lucide-react";

const ProjectCard = ({
  title,
  description,
  tags,
  imageUrl,
  // New props for detailed view
  contnetUrl,
  webUrl,
  webContent,
  completionDate,
  challenges,
  keyFeatures,
  setup,
}) => {
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

      {/* Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto px-4 py-6" 
          onClick={() => setShowPreview(false)}>
          <div className="min-h-screen flex items-center justify-center">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full bg-gray-900/95 backdrop-blur-lg rounded-2xl 
                shadow-2xl shadow-blue-500/10 border border-gray-800"
            >
              {/* Close button */}
              <button
                onClick={() => setShowPreview(false)}
                className="absolute -top-4 -right-4 p-2 bg-gray-800 rounded-full 
                  hover:bg-gray-700 transition-colors duration-300 shadow-lg z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Image Section */}
                <div className="lg:col-span-2">
                  <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
                    <img
                      src={webUrl || imageUrl}
                      alt={title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    <h2 className="absolute bottom-6 left-6 text-3xl font-bold text-white">{title}</h2>
                  </div>
                </div>

                {/* Content Columns */}
                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-400">About the Project</h3>
                    <p className="text-gray-300 leading-relaxed">{description}</p>
                  </div>

                  {keyFeatures && keyFeatures.length > 0 && (
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">Key Features</h3>
                      <ul className="space-y-3">
                        {keyFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-400">Technical Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg
                            border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-400">Project Details</h3>
                    <div className="space-y-4">
                      {setup && (
                        <div className="flex items-center gap-4 text-gray-300">
                          <Cpu className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <span>{setup}</span>
                        </div>
                      )}
                      {completionDate && (
                        <div className="flex items-center gap-4 text-gray-300">
                          <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <span>{completionDate}</span>
                        </div>
                      )}
                      {contnetUrl && (
                        <a
                          href={contnetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 text-blue-400 hover:text-blue-300 
                            transition-colors group"
                        >
                          <LinkIcon className="w-5 h-5 flex-shrink-0" />
                          <span className="border-b border-blue-400/30 group-hover:border-blue-300">
                            View Project
                          </span>
                        </a>
                      )}
                    </div>
                  </div>

                  {challenges && (
                    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 text-blue-400">
                        Challenges & Solutions
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{challenges}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;
