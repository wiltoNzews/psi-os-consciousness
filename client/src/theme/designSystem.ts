// Design system inspired by Apple's minimalism and Nike's energy
// This file centralizes design tokens for consistent application

// Typography
export const typography = {
  fontFamily: {
    base: 'Inter, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  }
};

// Color system - Premium Apple-esque dark mode palette
export const colors = {
  // Base background colors
  background: {
    primary: '#000000',           // Pure black (Apple-inspired)
    secondary: '#0A0A0B',         // Slightly lighter black
    tertiary: '#111114',          // Very dark gray with slight blue tint
    elevated: '#1A1A1F',          // Elevated surface
  },
  
  // Foreground/text colors
  text: {
    primary: '#FFFFFF',           // Pure white
    secondary: 'rgba(255, 255, 255, 0.8)', // Slightly dimmed white
    tertiary: 'rgba(255, 255, 255, 0.6)',  // More dimmed white
    disabled: 'rgba(255, 255, 255, 0.38)', // Highly dimmed white
  },
  
  // Brand colors
  brand: {
    primary: '#0066FF',           // Vibrant blue (primary brand)
    hover: '#1A75FF',             // Slightly lighter blue for hover
    active: '#0052CC',            // Slightly darker blue for active state
  },
  
  // Domain-specific colors (accents)
  domain: {
    finance: {
      primary: '#22C55E',         // Green
      light: '#4ADE80',
      dark: '#16A34A',
      muted: 'rgba(34, 197, 94, 0.2)',
    },
    crypto: {
      primary: '#F97316',         // Orange
      light: '#FB923C',
      dark: '#EA580C',
      muted: 'rgba(249, 115, 22, 0.2)',
    },
    sports: {
      primary: '#3B82F6',         // Blue
      light: '#60A5FA',
      dark: '#2563EB',
      muted: 'rgba(59, 130, 246, 0.2)',
    },
    general: {
      primary: '#8B5CF6',         // Purple
      light: '#A78BFA',
      dark: '#7C3AED',
      muted: 'rgba(139, 92, 246, 0.2)',
    },
  },
  
  // Feedback/status colors
  status: {
    success: '#22C55E',           // Green
    warning: '#F59E0B',           // Amber
    error: '#EF4444',             // Red
    info: '#3B82F6',              // Blue
  },
  
  // Border colors
  border: {
    default: 'rgba(255, 255, 255, 0.1)', // Very subtle white
    active: 'rgba(255, 255, 255, 0.2)',  // Slightly more visible
  },
};

// Spacing system
export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',    // Full rounded (circles)
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  // Premium glass effect shadows (Apple-inspired)
  glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
  'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.2)',
};

// Z-index
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  // Special z-indexes
  modal: '100',
  tooltip: '90',
  dropdown: '80',
};

// Animation timing
export const animation = {
  durations: {
    fastest: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slowest: '500ms',
  },
  easing: {
    // Apple-inspired easing curves for smooth, polished animations
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    // Premium spring feel (for micro-interactions)
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
};

// Backdrop blur (Apple-inspired glass effect)
export const blur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
};

// Component-specific styling
export const components = {
  card: {
    background: colors.background.elevated,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.lg,
    shadow: shadows.glass,
  },
  button: {
    primary: {
      background: colors.brand.primary,
      color: colors.text.primary,
      hover: colors.brand.hover,
      active: colors.brand.active,
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: colors.text.primary,
      hover: 'rgba(255, 255, 255, 0.15)',
      active: 'rgba(255, 255, 255, 0.2)',
    },
    outline: {
      border: `1px solid ${colors.border.default}`,
      color: colors.text.primary,
      hover: colors.border.active,
    },
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${colors.border.default}`,
    focusBorder: colors.brand.primary,
  },
};

// Export the complete design system
const designSystem = {
  typography,
  colors,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  animation,
  blur,
  components,
};

export default designSystem;