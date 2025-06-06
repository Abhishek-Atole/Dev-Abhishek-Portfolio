
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  threshold?: number;
  duration?: number;
}

/**
 * A component that fades in its children when they enter the viewport
 */
const FadeInSection = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  threshold = 0.1,
  duration = 0.6,
}: FadeInSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const directionClasses = {
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
  };

  const animationStyles = {
    transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
    transitionDelay: `${delay}s`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate(0, 0)" : "",
  };

  return (
    <div
      ref={sectionRef}
      className={cn(
        isVisible ? "" : directionClasses[direction],
        className
      )}
      style={animationStyles}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
