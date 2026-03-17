import { cn } from "../../lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeading = ({ title, subtitle, className }: SectionHeadingProps) => {
  return (
    <div className={cn("mb-16 pb-8 border-b border-black/5", className)}>
      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-text-main mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[10px] font-black text-text-muted tracking-widest uppercase">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
