import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./button.module.scss";

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      default: styles.primary,
      destructive: styles.destructive,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      link: styles.link,
    },
    size: {
      default: styles.default,
      sm: styles.sm,
      lg: styles.lg,
      icon: styles.icon,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const buttonClass = cn(
      buttonVariants({ variant, size, className }),
      loading && styles.loading,
    );

    const renderIcon = (position: "left" | "right") => {
      if (!icon || iconPosition !== position) return null;
      return <span className={cn(styles.icon, styles[position])}>{icon}</span>;
    };

    const renderSpinner = () => {
      if (!loading) return null;
      return <div className={styles.spinner} />;
    };

    return (
      <Comp
        className={buttonClass}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && renderSpinner()}
        {!loading && renderIcon("left")}
        {children}
        {!loading && renderIcon("right")}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
