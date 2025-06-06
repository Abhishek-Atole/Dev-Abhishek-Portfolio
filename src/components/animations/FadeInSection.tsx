
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  threshold?: number;
  duration?: number;
  once?: boolean;
}

/**
 * A component that fades in its children when they enter the viewport
 * Using Framer Motion for better performance
 */
const FadeInSection = ({
  children,
  className = "",
  direction = "up",
  delay = 0,
  threshold = 0.1,
  duration = 0.6,
  once = true,
}: FadeInSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once,
    amount: threshold,
    margin: "-50px",
  });

  // Animation variants based on direction
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? 20 : direction === "right" ? -20 : 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ 
        duration, 
        delay, 
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
