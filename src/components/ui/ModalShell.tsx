import type { FC, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEscapeKey, useScrollLock } from "../../hooks/useModal";
import { overlayVariants, panelVariants } from "../../lib/motion";

export type Accent = "primary" | "secondary" | "accent";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  accent?: Accent;
  /** Set false while a nested lightbox is open so Escape closes only the lightbox. */
  closeOnEscape?: boolean;
  children: ReactNode;
}

const closeHover: Record<Accent, string> = {
  primary: "hover:bg-primary/20 hover:text-primary",
  secondary: "hover:bg-secondary/20 hover:text-secondary",
  accent: "hover:bg-accent/20 hover:text-accent",
};

/**
 * Full-screen dialog chrome shared by every project card: backdrop, animated
 * panel, close button, scroll lock, and Escape handling.
 */
const ModalShell: FC<ModalShellProps> = ({ open, onClose, label, accent = "primary", closeOnEscape = true, children }) => {
  useScrollLock(open);
  useEscapeKey(open && closeOnEscape, onClose);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-neutral-bg/98 backdrop-blur-md z-[9999] flex items-center justify-center p-3 sm:p-6 lg:p-8"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            variants={panelVariants}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative w-full max-w-6xl max-h-[92vh] bg-surface/40 backdrop-blur-xl rounded-lg
              shadow-2xl border border-border/50 overflow-hidden flex flex-col"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 bg-neutral-bg/80 backdrop-blur-md rounded-full
                transition-all duration-300 z-50 border border-border/50 group ${closeHover[accent]}`}
            >
              <X className="w-5 h-5 text-ink/60 group-hover:scale-110 transition-transform" aria-hidden="true" />
            </button>

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ModalShell;
