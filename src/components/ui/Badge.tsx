import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-200 rounded-full border cursor-default hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "bg-white/40 dark:bg-white/10 backdrop-blur-sm border-black/5 dark:border-white/10 text-text-main shadow-black/5",
        secondary:
          "bg-black/[0.02] dark:bg-white/[0.05] border-transparent text-text-muted hover:bg-black/[0.04] dark:hover:bg-white/[0.08]",
        outline: 
          "bg-transparent border-black/10 dark:border-white/10 text-text-main hover:border-accent-peach hover:text-accent-peach",
        peach: 
          "bg-accent-peach/10 dark:bg-accent-peach/20 border-accent-peach/20 text-text-main oklch-text-dark shadow-accent-peach/5",
        sky: 
          "bg-accent-sky/10 dark:bg-accent-sky/20 border-accent-sky/20 text-text-main oklch-text-dark shadow-accent-sky/5",
        mint: 
          "bg-accent-mint/10 dark:bg-accent-mint/20 border-accent-mint/20 text-text-main oklch-text-dark shadow-accent-mint/5",
        lavender: 
          "bg-accent-lavender/10 dark:bg-accent-lavender/20 border-accent-lavender/20 text-text-main oklch-text-dark shadow-accent-lavender/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
