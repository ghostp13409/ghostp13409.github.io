import type { Variants } from "framer-motion";

/** Fade + rise used for section content. Pair with `staggerContainer` on the parent. */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

/** Parent variant that staggers `fadeInUp` children. */
export const staggerContainer = (stagger = 0.15): Variants => ({
  animate: { transition: { staggerChildren: stagger } },
});

/** Card entrance + hover lift shared by all project cards. */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { y: -8, transition: { duration: 0.3, ease: "easeOut" } },
};

/** Backdrop fade for modals. */
export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Modal panel pop. */
export const panelVariants: Variants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit: { opacity: 0, y: 30, scale: 0.98 },
};
