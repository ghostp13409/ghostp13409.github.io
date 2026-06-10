import type { FC } from "react";

interface HobbiesCardProps {
  title: string;
  description: string;
  tags?: string[];
  imageUrl: string;
}

const HobbiesCard: FC<HobbiesCardProps> = ({ title, description }) => {
  return (
    <>
      <div
        className="group relative flex flex-col bg-surface/80 backdrop-blur-sm rounded-lg 
          transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl 
          hover:shadow-primary/10 cursor-pointer overflow-hidden border border-border
          hover:border-primary/20"
      >
        {/* Card gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Content section */}
        <div className="p-5 flex flex-col flex-grow">
          <h3
            className="text-xl font-bold mb-2 text-ink group-hover:text-primary
            transition-colors duration-300"
          >
            {title}
          </h3>

          <p className="text-ink/60 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </>
  );
};

export default HobbiesCard;
