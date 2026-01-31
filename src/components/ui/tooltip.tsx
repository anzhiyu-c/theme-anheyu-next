"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      setShowTooltip(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
    setTimeout(() => setIsOpen(false), 150);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const alignStyles = {
    start: side === "top" || side === "bottom" ? "!left-0 !translate-x-0" : "!top-0 !translate-y-0",
    center: "",
    end: side === "top" || side === "bottom" ? "!left-auto !right-0 !translate-x-0" : "!top-auto !bottom-0 !translate-y-0",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isOpen && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-1.5 text-sm rounded-lg",
            "bg-foreground text-background",
            "shadow-lg whitespace-nowrap",
            "transition-opacity duration-150",
            showTooltip ? "opacity-100" : "opacity-0",
            positionStyles[side],
            alignStyles[align],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
