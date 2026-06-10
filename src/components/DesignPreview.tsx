import { useState, useEffect, useCallback } from "react";
import type { FC } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface DesignImage {
  id: number;
  title: string;
  url: string;
}

const designImages: DesignImage[] = [
  {
    id: 1,
    title: "Birthday Card",
    url: "images/projects/designs/Birthday.jpg",
  },
  {
    id: 2,
    title: "Freshko Brochure",
    url: "images/projects/designs/Freshko.jpg",
  },
  {
    id: 3,
    title: "Menu Design",
    url: "images/projects/designs/Menu.jpg",
  },
  {
    id: 4,
    title: "Relex Therapy Brochure",
    url: "images/projects/designs/RelexTherapy.jpg",
  },
];

const DesignPreview: FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! + 1) % designImages.length);
    }
  }, [selectedImageIndex]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev! - 1 + designImages.length) % designImages.length);
    }
  }, [selectedImageIndex]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex !== null) {
        if (event.key === "Escape") setSelectedImageIndex(null);
        else if (event.key === "ArrowRight") handleNext();
        else if (event.key === "ArrowLeft") handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, handleNext, handlePrev]);

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {designImages.map((p, index) => {
          const isEven = p.id % 2 === 0;
          return (
            <div key={p.id} className={`flex flex-col group ${isEven ? 'mt-6' : 'mb-6'}`}>
              {!isEven && (
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-ink/20">0{p.id}</span>
                    <div className="h-px flex-1 bg-border/50 group-hover:bg-accent/30 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">
                    {p.title}
                  </h3>
                </div>
              )}
              
              <div 
                onClick={() => setSelectedImageIndex(index)}
                className="relative overflow-hidden rounded-md border border-border/50 bg-neutral-bg/40 shadow-lg transition-all duration-500 group-hover:shadow-accent/10 group-hover:border-accent/30 cursor-zoom-in"
              >
                <img
                  className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                  src={p.url}
                  alt={p.title}
                />
                
                {/* Enhanced Hover Overlay */}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 bg-neutral-bg/80 backdrop-blur-md rounded-full border border-accent/50 scale-90 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </div>

              {isEven && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">
                    {p.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border/50 group-hover:bg-accent/30 transition-colors" />
                    <span className="text-[9px] font-mono text-ink/20">0{p.id}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Footer Signature */}
      <div className="mt-12 pt-8 border-t border-border/20 text-center">
        <p className="text-[10px] font-mono text-ink/10 uppercase tracking-[0.4em]">
          Visual System Archive
        </p>
      </div>

      {/* Fullscreen Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedImageIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4"
              onClick={() => setSelectedImageIndex(null)}
            >
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation buttons */}
              {designImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 sm:left-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/5 group"
                  >
                    <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 sm:right-8 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/5 group"
                  >
                    <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
              
              <div className="relative max-w-full max-h-full flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  src={designImages[selectedImageIndex].url}
                  alt={designImages[selectedImageIndex].title}
                  className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
                />
                <div className="text-center">
                  <h4 className="text-white text-2xl font-bold tracking-tight mb-2">{designImages[selectedImageIndex].title}</h4>
                  <p className="text-white/40 text-xs font-mono uppercase tracking-[0.3em]">Visual_Archive_0{designImages[selectedImageIndex].id}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default DesignPreview;
