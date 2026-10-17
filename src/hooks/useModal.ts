import { useEffect } from "react";

let lockCount = 0;

/**
 * Locks background scrolling while `active` is true. Multiple overlays can be
 * stacked; the body is released only when the last one closes.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    document.body.classList.add("scroll-locked");
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.body.classList.remove("scroll-locked");
    };
  }, [active]);
}

/**
 * Calls `onEscape` when the Escape key is pressed while `active` is true.
 * The listener is only attached while active, so closed modals cost nothing.
 */
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onEscape();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}
