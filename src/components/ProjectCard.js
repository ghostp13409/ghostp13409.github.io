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
        className="bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl transform transition-all duration-300 
          hover:scale-105 hover:shadow-lg hover:bg-gray-700/50 cursor-pointer group relative overflow-hidden border border-gray-700"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="h-40 bg-gray-700 rounded-lg mb-3 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
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
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto" onClick={() => setShowPreview(false)}>
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg 
              hover:bg-gray-700 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-h-screen px-4 py-6">
            <div className="relative max-w-5xl mx-auto">
              <div
                onClick={(e) => e.stopPropagation()}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-900/90 backdrop-blur-sm rounded-xl p-5"
              >
                <div className="md:col-span-2">
                  <div className="relative rounded-lg overflow-hidden h-72">
                    <img
                      src={webUrl || imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-2">
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-4">
                      About the Project
                    </h3>
                    <p className="text-gray-300">{description}</p>
                  </div>

                  {keyFeatures && keyFeatures.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4">Key Features</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {keyFeatures.map((feature, index) => (
                          <li key={index} className="text-gray-300">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-4">Technical Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags?.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-xl font-bold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      {setup && (
                        <div className="flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-300">{setup}</span>
                        </div>
                      )}
                      {completionDate && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-300">
                            {completionDate}
                          </span>
                        </div>
                      )}

                      {contnetUrl && (
                        <a
                          href={contnetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <LinkIcon className="w-5 h-5" />
                          <span>Check it out here</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {challenges && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4">
                        Challenges & Solutions
                      </h3>
                      <p className="text-gray-300">{challenges}</p>
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
