/**
 * Responsive Design Utilities for EcoDrop
 * ======================================
 * 
 * Provides helper functions and constants for responsive design
 * across all device sizes and screen resolutions.
 */

// Breakpoint definitions (matching Tailwind)
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,    // Small phones
  md: 768,    // Tablets
  lg: 1024,   // Desktops
  xl: 1280,   // Large desktops
  "2xl": 1536 // Ultra-wide
} as const;

// Responsive padding scale
export const RESPONSIVE_PADDING = {
  xs: "px-3 py-2",
  sm: "px-4 py-3",
  md: "px-6 py-4",
  lg: "px-8 py-5",
  xl: "px-10 py-6",
} as const;

// Responsive gap scale
export const RESPONSIVE_GAPS = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-5",
  xl: "gap-6",
} as const;

// Container width helpers
export const CONTAINER_SIZES = {
  mobile: "w-full px-3 sm:px-4",
  tablet: "max-w-2xl mx-auto px-4 md:px-6",
  desktop: "max-w-4xl mx-auto px-6 lg:px-8",
  ultrawide: "max-w-6xl mx-auto px-8 xl:px-10",
} as const;

// Font size helpers with clamp for fluid typography
export const FLUID_TYPOGRAPHY = {
  // Small text (labels, captions)
  sm: "text-sm sm:text-base md:text-base",
  
  // Base text (body, description)
  base: "text-base sm:text-base md:text-lg",
  
  // Large text (section titles)
  lg: "text-lg sm:text-xl md:text-2xl",
  
  // Extra large (page titles)
  xl: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
  
  // Hero text
  hero: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
} as const;

// Grid column helpers for responsive layouts
export const GRID_LAYOUTS = {
  // Mobile-first single column, tablet dual, desktop triple
  responsive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  
  // Mobile single, desktop dual
  dual: "grid-cols-1 md:grid-cols-2",
  
  // Mobile single, tablet dual, desktop quad
  quad: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  
  // Auto-fit with minimum column width
  auto: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
} as const;

// Utility function to get responsive class names
export function getResponsiveClass(
  mobile: string,
  tablet?: string,
  desktop?: string,
  ultrawide?: string
): string {
  if (!tablet) return mobile;
  if (!desktop) return `${mobile} sm:${tablet}`;
  if (!ultrawide) return `${mobile} sm:${tablet} lg:${desktop}`;
  return `${mobile} sm:${tablet} lg:${desktop} 2xl:${ultrawide}`;
}

// Min/Max content width helpers
export const CONTENT_WIDTH = {
  fluid: "w-full",
  fixed_mobile: "w-full md:max-w-md",
  fixed_tablet: "w-full md:max-w-2xl",
  fixed_desktop: "w-full md:max-w-4xl",
  fixed_xl: "w-full md:max-w-6xl",
} as const;

// Safe area handling
export const SAFE_AREA = {
  padding: "p-safe",
  padding_top: "pt-safe",
  padding_bottom: "pb-safe",
  margin_top: "mt-safe",
  margin_bottom: "mb-safe",
} as const;

// Responsive spacing helpers
export function getResponsiveSpacing(type: 'padding' | 'margin' = 'padding') {
  const prefix = type === 'padding' ? 'p' : 'm';
  return {
    xs: `${prefix}2 sm:${prefix}3 md:${prefix}4 lg:${prefix}6`,
    sm: `${prefix}3 sm:${prefix}4 md:${prefix}6 lg:${prefix}8`,
    md: `${prefix}4 sm:${prefix}6 md:${prefix}8 lg:${prefix}10`,
    lg: `${prefix}6 sm:${prefix}8 md:${prefix}10 lg:${prefix}12`,
  };
}

// Touch-friendly sizing (min 44x44px recommended)
export const TOUCH_TARGETS = {
  small: "min-h-10 min-w-10",
  medium: "min-h-12 min-w-12",
  large: "min-h-14 min-w-14",
} as const;

// Viewport helper (client-side)
export function useViewport() {
  if (typeof window === 'undefined') return null;
  
  const width = window.innerWidth;
  
  return {
    xs: width < 640,
    sm: width >= 640 && width < 768,
    md: width >= 768 && width < 1024,
    lg: width >= 1024 && width < 1280,
    xl: width >= 1280 && width < 1536,
    "2xl": width >= 1536,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
}

// Export all for convenience
export default {
  BREAKPOINTS,
  RESPONSIVE_PADDING,
  RESPONSIVE_GAPS,
  CONTAINER_SIZES,
  FLUID_TYPOGRAPHY,
  GRID_LAYOUTS,
  CONTENT_WIDTH,
  SAFE_AREA,
  TOUCH_TARGETS,
  getResponsiveClass,
  getResponsiveSpacing,
  useViewport,
};
