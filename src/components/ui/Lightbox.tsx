import { useCallback, useEffect } from "react";
import type { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollLock } from "../../hooks/useModal";
import { overlayVariants } from "../../lib/motion";

export interface LightboxItem {
  /** Image source, or omit when `render` is provided. */
  src?: string;
  alt: string;
  caption?: string;
  /** Custom content (for example a video element). */
  render?: () => ReactNode;
}

interface LightboxProps {
  items: LightboxItem[];
  /** Index of the open item, or null when closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

/**
 * Fullscreen viewer for one or more images (or custom content) with
 * keyboard navigation. Sits above ModalShell.
 */
const Lightbox: FC<LightboxProps> = ({ items, index, onClose, onIndexChange }) => {
  const open = index !== null && items.length > 0;
  const count = items.length;

  useScrollLock(open);

  const go = useCallback(
    (delta: number) => {
      if (index === null || count < 2) return;
      onIndexChange?.((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        onClose();
      } else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    // Capture phase so the lightbox wins over any modal listening for Escape.
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [open, onClose, go]);

  const item = index !== null ? items[index] : undefined;

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="lightbox"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/10"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous"
                className="absolute left-2 sm:left-8 p-3 sm:p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/5 group"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next"
                className="absolute right-2 sm:right-8 p-3 sm:p-4 bg-white/5 hover:bg-white/10 text-white rounded-full backdrop-blur-md transition-all z-50 border border-white/5 group"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/60 text-sm font-mono tracking-widest">
                {index! + 1} / {count}
              </div>
            </>
          )}

          <div
            className="relative max-w-full max-h-full flex flex-col items-center gap-4 cursor-default"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            {item.render ? (
              item.render()
            ) : (
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                src={item.src}
                alt={item.alt}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
              />
            )}
            {item.caption && <p className="text-white text-lg sm:text-2xl font-bold tracking-tight text-center">{item.caption}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Lightbox;
