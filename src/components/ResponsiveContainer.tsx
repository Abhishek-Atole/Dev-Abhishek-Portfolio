
import React from "react";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
}

/**
 * A responsive container component that adapts to different screen sizes
 */
const ResponsiveContainer = ({
  children,
  className = "",
  maxWidth = "xl",
  padding = true,
}: ResponsiveContainerProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "full": "max-w-full"
  };
  
  return (
    <div 
      className={`mx-auto w-full ${padding ? 'px-4 sm:px-6 lg:px-8' : ''} ${maxWidthClasses[maxWidth]} ${className}`}
      data-device={isMobile ? "mobile" : isTablet ? "tablet" : "desktop"}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
