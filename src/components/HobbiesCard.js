import React, { useState } from "react";

const HobbiesCard = ({
  title,
  description,
  tags,
  imageUrl,

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
        {/* <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 
              transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />
        </div> */}

        {/* Content section */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-blue-400 
            transition-colors duration-300">{title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{description}</p>

        </div>
      </div>
    </>
  );
};

export default HobbiesCard;
