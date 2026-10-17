import { useState } from "react";
import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { cardVariants } from "../../lib/motion";
import type { Accent } from "./ModalShell";

interface CardFaceProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  /** Short text shown in the top-left pill, usually the year. */
  badge?: ReactNode;
  /** Extra chip shown next to the preview button on hover (for example "Live Demo"). */
  hoverChip?: ReactNode;
  /** Centered overlay, for example a play icon. */
  centerOverlay?: ReactNode;
  accent?: Accent;
  aspect?: "16/10" | "video";
  maxTags?: number;
  onOpen: () => void;
}

const accentStyles: Record<
  Accent,
  { border: string; overlay: string; title: string; chip: string; eye: string }
> = {
  primary: {
    border: "hover:border-primary/50",
    overlay: "bg-primary/5",
    title: "group-hover:text-primary",
    chip: "bg-primary/10 text-primary border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20",
    eye: "bg-primary shadow-[0_0_20px_rgba(16,185,129,0.4)]",
  },
  secondary: {
    border: "hover:border-secondary/50",
    overlay: "bg-secondary/5",
    title: "group-hover:text-secondary",
    chip: "bg-secondary/10 text-secondary border-secondary/20 group-hover:border-secondary/40 group-hover:bg-secondary/20",
    eye: "bg-secondary shadow-[0_0_20px_rgba(79,70,229,0.4)]",
  },
  accent: {
    border: "hover:border-accent/50",
    overlay: "bg-accent/5",
    title: "group-hover:text-accent",
    chip: "bg-accent/10 text-accent border-accent/20 group-hover:border-accent/40 group-hover:bg-accent/20",
    eye: "bg-accent shadow-[0_0_20px_rgba(245,158,11,0.4)]",
  },
};

/**
 * The clickable card shown in the projects grid. Every project type shares
 * this face; only the modal behind it differs.
 */
const CardFace: FC<CardFaceProps> = ({
  title,
  description,
  tags,
  imageUrl,
  badge,
  hoverChip,
  centerOverlay,
  accent = "primary",
  aspect = "16/10",
  maxTags = 4,
  onOpen,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const styles = accentStyles[accent];
  const visibleTags = tags.slice(0, maxTags);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`group relative flex flex-col h-full bg-surface/40 backdrop-blur-xl rounded-lg
        overflow-hidden border border-border/50 ${styles.border}
        shadow-xl hover:shadow-2xl transition-all duration-300`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open details for ${title}`}
        className="absolute inset-0 z-20 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
      />

      {/* Subtle overlay for hover effect */}
      <div className={`absolute inset-0 ${styles.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none`} />

      {/* Image container */}
      <div
        className={`relative ${aspect === "video" ? "aspect-video" : "aspect-[16/10]"} w-full overflow-hidden rounded-t-lg bg-neutral-bg`}
      >
        <div
          className={`absolute inset-0 bg-surface/80 transition-opacity duration-300 z-10 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
        />

        <img
          src={imageUrl}
          alt=""
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover object-center transform group-hover:scale-105
            transition-all duration-700 ease-out ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Image overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-neutral-bg/80 via-transparent to-neutral-bg/20
            opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10"
        />

        {centerOverlay && <div className="absolute inset-0 flex items-center justify-center z-10">{centerOverlay}</div>}

        {/* Quick preview button */}
        <div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform
            translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-10 scale-90 group-hover:scale-100 flex items-center gap-2"
          aria-hidden="true"
        >
          {hoverChip}
          <div className={`p-3 ${styles.eye} text-neutral-bg rounded-full transition-all`}>
            <Eye className="h-5 w-5" />
          </div>
        </div>

        {badge && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-neutral-bg/80 backdrop-blur-sm rounded-full border border-border/50 z-10">
            <span className="text-xs font-medium text-ink/60">{badge}</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow relative z-10 text-left pointer-events-none">
        <h3 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ink ${styles.title} transition-colors duration-300 leading-tight`}>
          {title}
        </h3>

        <p className="text-ink/60 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow leading-relaxed">{description}</p>

        <ul className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Technologies">
          {visibleTags.map((tag) => (
            <li
              key={tag}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium border transition-all duration-300 ${styles.chip}`}
            >
              {tag}
            </li>
          ))}
          {hiddenCount > 0 && (
            <li className="px-2 sm:px-3 py-1 rounded-md text-xs font-medium border border-border text-ink/50">
              +{hiddenCount}
            </li>
          )}
        </ul>
      </div>
    </motion.article>
  );
};

export default CardFace;
