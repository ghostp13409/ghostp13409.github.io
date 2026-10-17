import { useState } from "react";
import type { FC } from "react";
import { Eye } from "lucide-react";
import Lightbox from "./ui/Lightbox";

interface DesignImage {
  id: number;
  title: string;
  url: string;
}

const designImages: DesignImage[] = [
  { id: 1, title: "Birthday Card", url: "images/projects/designs/Birthday.jpg" },
  { id: 2, title: "Freshko Brochure", url: "images/projects/designs/Freshko.jpg" },
  { id: 3, title: "Menu Design", url: "images/projects/designs/Menu.jpg" },
  { id: 4, title: "Relax Therapy Brochure", url: "images/projects/designs/RelexTherapy.jpg" },
];

interface DesignPreviewProps {
  /** Reports whether the lightbox is open so the parent modal can defer Escape. */
  onLightboxChange?: (open: boolean) => void;
}

/** Masonry-ish gallery of design work with a fullscreen viewer. */
const DesignPreview: FC<DesignPreviewProps> = ({ onLightboxChange }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const select = (index: number | null) => {
    setSelectedIndex(index);
    onLightboxChange?.(index !== null);
  };

  return (
    <div className="w-full">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {designImages.map((p, index) => {
          const isEven = p.id % 2 === 0;
          const caption = (
            <h4 className="text-lg font-bold text-ink group-hover:text-accent transition-colors leading-tight">{p.title}</h4>
          );
          return (
            <li key={p.id} className={`flex flex-col group ${isEven ? "sm:mt-6" : "sm:mb-6"}`}>
              {!isEven && <div className="mb-3">{caption}</div>}

              <button
                type="button"
                onClick={() => select(index)}
                aria-label={`View ${p.title} fullscreen`}
                className="relative overflow-hidden rounded-md border border-border/50 bg-neutral-bg/40 shadow-lg transition-all duration-500 group-hover:shadow-accent/10 group-hover:border-accent/30 cursor-zoom-in text-left"
              >
                <img
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                  src={p.url}
                  alt={p.title}
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 bg-neutral-bg/80 backdrop-blur-md rounded-full border border-accent/50 scale-90 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5 text-accent" aria-hidden="true" />
                  </span>
                </span>
              </button>

              {isEven && <div className="mt-3">{caption}</div>}
            </li>
          );
        })}
      </ul>

      <Lightbox
        index={selectedIndex}
        onClose={() => select(null)}
        onIndexChange={(i) => select(i)}
        items={designImages.map((img) => ({ src: img.url, alt: img.title, caption: img.title }))}
      />
    </div>
  );
};

export default DesignPreview;
