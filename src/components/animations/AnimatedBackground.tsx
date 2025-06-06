
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "gradient" | "particles" | "waves";
  intensity?: "light" | "medium" | "strong";
}

/**
 * A component that adds an animated background effect
 */
const AnimatedBackground = ({
  children,
  className = "",
  variant = "gradient",
  intensity = "medium",
}: AnimatedBackgroundProps) => {
  // Intensity classes based on the selected intensity
  const intensityClasses = {
    light: {
      gradient: "animate-glow-pulse-light",
      particles: "before:opacity-10 after:opacity-10",
      waves: "before:animate-wave-slow after:animate-wave-slow"
    },
    medium: {
      gradient: "animate-glow-pulse",
      particles: "before:opacity-20 after:opacity-20",
      waves: "before:animate-wave after:animate-wave"
    },
    strong: {
      gradient: "animate-glow-pulse-strong",
      particles: "before:opacity-30 after:opacity-30",
      waves: "before:animate-wave-fast after:animate-wave-fast"
    }
  };

  // Variant-specific classes
  const variantClasses = {
    gradient: cn(
      "bg-gradient-to-br from-background/95 via-background to-background/90",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-accent/5 before:to-primary/5 before:rounded-3xl before:blur-3xl",
      intensityClasses[intensity].gradient
    ),
    particles: cn(
      "before:absolute before:inset-0 before:bg-repeat before:bg-[url('/particles.svg')]",
      "after:absolute after:inset-0 after:bg-repeat after:bg-[url('/particles-alt.svg')]",
      "before:animate-float-slow after:animate-float",
      intensityClasses[intensity].particles
    ),
    waves: cn(
      "overflow-hidden",
      "before:absolute before:inset-0 before:bg-[url('/wave.svg')] before:bg-repeat-x before:bg-bottom",
      "after:absolute after:inset-0 after:bg-[url('/wave-alt.svg')] after:bg-repeat-x after:bg-bottom",
      "before:opacity-10 after:opacity-10",
      intensityClasses[intensity].waves
    )
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn("absolute inset-0", variantClasses[variant])}></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;
