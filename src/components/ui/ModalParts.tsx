import type { FC, ReactNode } from "react";
import { FaGithub } from "react-icons/fa6";
import type { Accent } from "./ModalShell";

const dot: Record<Accent, string> = {
  primary: "bg-primary text-primary",
  secondary: "bg-secondary text-secondary",
  accent: "bg-accent text-accent",
};
const text: Record<Accent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

/** Small uppercase heading with a colored dot, used inside modal bodies. */
export const SectionHeading: FC<{ accent?: Accent; children: ReactNode }> = ({ accent = "primary", children }) => (
  <div className={`flex items-center gap-2 ${text[accent]}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${dot[accent].split(" ")[0]}`} aria-hidden="true" />
    <h3 className="text-[11px] font-bold uppercase tracking-widest">{children}</h3>
  </div>
);

/** Muted heading for the metadata column. */
export const MetaHeading: FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">{children}</h3>
);

/** Chip list used for tech stacks. */
export const ChipList: FC<{ items: string[]; accent?: Accent; label?: string }> = ({ items, accent = "primary", label }) => {
  const hover: Record<Accent, string> = {
    primary: "hover:border-primary/50 hover:text-primary",
    secondary: "hover:border-secondary/50 hover:text-secondary",
    accent: "hover:border-accent/50 hover:text-accent",
  };
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <li
          key={item}
          className={`px-2.5 py-1 bg-surface border border-border text-ink/60 rounded-sm text-[11px] font-mono transition-all duration-300 ${hover[accent]}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

/** Numbered highlight cards. */
export const HighlightList: FC<{ items: string[]; columns?: 1 | 2 }> = ({ items, columns = 2 }) => (
  <ul className={`grid grid-cols-1 ${columns === 2 ? "sm:grid-cols-2" : ""} gap-4`}>
    {items.map((item, index) => (
      <li
        key={item}
        className="flex gap-4 p-4 bg-neutral-bg/20 border border-border/30 rounded-md group hover:border-primary/30 transition-all duration-300"
      >
        <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-mono text-ink/40 group-hover:text-primary group-hover:border-primary transition-colors shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="text-sm text-ink/60 group-hover:text-ink/90 transition-colors leading-relaxed">{item}</p>
      </li>
    ))}
  </ul>
);

/** Key / value row for the specifications list. */
export const SpecRow: FC<{ label: string; value: ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center gap-4 py-2.5 border-b border-border/20">
    <span className="text-ink/40 text-xs">{label}</span>
    <span className="text-ink/80 text-xs font-bold text-right">{value}</span>
  </div>
);

/** Primary "view source" button. */
export const SourceLink: FC<{ href: string; accent?: Accent; block?: boolean }> = ({ href, accent = "primary", block }) => {
  const bg: Record<Accent, string> = {
    primary: "bg-primary shadow-primary/20 hover:bg-primary/80",
    secondary: "bg-secondary shadow-secondary/20 hover:bg-secondary/80",
    accent: "bg-accent shadow-accent/20 hover:bg-accent/80",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${block ? "w-full" : ""} inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-neutral-bg rounded-md
        font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg ${bg[accent]}`}
    >
      <FaGithub className="w-4 h-4" aria-hidden="true" />
      <span>Source Code</span>
    </a>
  );
};
