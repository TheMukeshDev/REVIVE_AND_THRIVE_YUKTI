/**
 * Advanced Framer Motion Animation Utilities
 * ==========================================
 * 
 * Comprehensive animation definitions for consistent,
 * performant animations across the EcoDrop app.
 */

import { Variants } from "framer-motion"

// ==================== Easing Functions ====================
export const easing = {
  smooth: [0.21, 0.47, 0.32, 0.98],
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeLinear: [0, 0, 1, 1],
} as const;

// ==================== Spring Configurations ====================
export const springConfigs = {
  smooth: {
    type: "spring" as const,
    stiffness: 60,
    damping: 15,
    mass: 1,
  },
  snappy: {
    type: "spring" as const,
    stiffness: 150,
    damping: 20,
    mass: 1,
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 100,
    damping: 8,
    mass: 1,
  },
  gentle: {
    type: "spring" as const,
    stiffness: 30,
    damping: 20,
    mass: 1,
  },
} as const;

// ==================== Container Animations ====================

/**
 * Stagger container for animating multiple children with delay
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Fast stagger for quick sequential animations
 */
export const fastContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// ==================== Item Animations ====================

/**
 * Fade and slide up animation
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

/**
 * Scale and fade animation
 */
export const scaleItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
    },
  },
};

/**
 * Blur in animation
 */
export const blurItemVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
    },
  },
};

// ==================== Page/Section Animations ====================

/**
 * Page entrance animation
 */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Card entrance with subtle scale
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
  hover: {
    y: -4,
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
  },
};

/**
 * Button interaction animations
 */
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

/**
 * Badge/pill animations
 */
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: -10 },
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// ==================== List Animations ====================

/**
 * List item entrance
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Checkbox animation
 */
export const checkboxVariants: Variants = {
  unchecked: { scale: 1 },
  checked: {
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

// ==================== Modal/Dialog Animations ====================

/**
 * Modal backdrop fade
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Modal content slide up
 */
export const modalVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// ==================== Navigation Animations ====================

/**
 * Tab/navigation item slide
 */
export const tabVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
    },
  },
  active: {
    color: "rgb(34, 197, 94)",
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Dropdown/popover entrance
 */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

// ==================== Notification Animations ====================

/**
 * Toast notification slide
 */
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Pulse animation for alerts
 */
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

// ==================== Loading State Animations ====================

/**
 * Skeleton loading shimmer
 */
export const shimmerVariants: Variants = {
  loading: {
    backgroundPosition: ["0% 0%", "100% 0%"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

/**
 * Spinner rotation
 */
export const spinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

// ==================== Text Animations ====================

/**
 * Typing effect for text
 */
export const typeVariants: Variants = {
  hidden: { opacity: 0, width: 0 },
  show: {
    opacity: 1,
    width: "auto",
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Text character animation (for short text)
 */
export const charVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

// ==================== Icon Animations ====================

/**
 * Icon rotation on hover
 */
export const iconRotateVariants: Variants = {
  initial: { rotate: 0 },
  hover: {
    rotate: 360,
    transition: {
      duration: 0.6,
    },
  },
};

/**
 * Icon bounce animation
 */
export const iconBounceVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: [-4, 0, -2, 0],
    transition: {
      duration: 0.6,
    },
  },
};

// ==================== Hover Animations ====================

/**
 * Subtle lift on hover
 */
export const liftVariants: Variants = {
  initial: { y: 0, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
  hover: {
    y: -8,
    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * Color shift on hover
 */
export const colorShiftVariants: Variants = {
  initial: { backgroundColor: "rgba(34, 197, 94, 0.1)" },
  hover: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    transition: { duration: 0.2 },
  },
};

// ==================== Layout Shift Prevention ====================

/**
 * Prevent layout shift during state changes
 */
export const layoutShiftSafeVariants: Variants = {
  initial: { opacity: 1, height: "auto" },
  loading: {
    opacity: 0.6,
    height: "auto",
  },
};

// ==================== Utility Transitions ====================

export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  verySlow: { duration: 0.8 },
  spring: { type: "spring" as const, stiffness: 60, damping: 15 },
} as const;

// ==================== Helper Functions ====================

/**
 * Create a custom stagger container
 */
export function createStaggerVariants(staggerDelay = 0.1): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };
}

/**
 * Create a custom slide variant
 */
export function createSlideVariants(
  direction: "up" | "down" | "left" | "right" = "up",
  distance = 20
): Variants {
  const directions = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  return {
    hidden: { opacity: 0, ...directions[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };
}

/**
 * Get animation config by name
 */
export function getAnimationConfig(name: keyof typeof springConfigs) {
  return springConfigs[name];
}

export default {
  easing,
  springConfigs,
  containerVariants,
  itemVariants,
  cardVariants,
  buttonVariants,
  pageVariants,
  modalVariants,
  dropdownVariants,
  toastVariants,
  listItemVariants,
  createStaggerVariants,
  createSlideVariants,
  getAnimationConfig,
};
