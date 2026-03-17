import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[10px] font-mono font-black tracking-[0.2em] uppercase transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-text-main text-page-bg hover:scale-[1.02] active:scale-[0.98]",
        outline: "border border-black/10 dark:border-white/10 text-text-main hover:bg-black/5 dark:hover:bg-white/5",
        ghost: "text-text-muted hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5",
        blue: "border border-accent-sky/30 text-accent-sky oklch-text-dark hover:bg-accent-sky/10 dark:hover:bg-accent-sky/20",
        purple: "border border-accent-lavender/30 text-accent-lavender oklch-text-dark hover:bg-accent-lavender/10 dark:hover:bg-accent-lavender/20",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-6",
        lg: "h-14 px-10",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
