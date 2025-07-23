/**
 * Viewport utilities for responsive design and safe area handling
 */

import { cn } from '@/lib/utils';

/**
 * Get CSS classes for full viewport height with safe area handling
 */
export function getViewportClasses() {
  return cn(
    // Use minimum height for better content handling
    'min-h-screen',
    // Safe area handling for mobile devices
    'pb-safe-bottom',
    'pt-safe-top'
  );
}

/**
 * Get classes for content that should be scrollable within viewport
 */
export function getScrollableContentClasses() {
  return cn(
    'max-h-screen', // Fallback
    'max-h-dvh', // Dynamic viewport
    'overflow-y-auto',
    'overscroll-contain'
  );
}

/**
 * Get classes for full-screen overlays (modals, videos, etc.)
 */
export function getFullScreenClasses() {
  return cn(
    'fixed inset-0',
    'h-screen', // Fallback
    'h-dvh', // Dynamic viewport
    'w-full',
    'z-50'
  );
}

/**
 * Get safe area padding classes
 */
export function getSafeAreaClasses(options?: {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}) {
  const { top = true, bottom = true, left = false, right = false } = options || {};
  
  return cn(
    top && 'pt-safe-top',
    bottom && 'pb-safe-bottom',
    left && 'pl-safe-left',
    right && 'pr-safe-right'
  );
}

/**
 * Hook to get viewport dimensions (client-side only)
 */
export function useViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 390, height: 844 }; // Default mobile size for SSR
  }

  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Get responsive padding based on screen size
 */
export function getResponsivePadding(size: 'sm' | 'md' | 'lg' = 'md') {
  const paddingMap = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return cn(
    paddingMap[size],
    // Adjust for smaller screens
    'max-sm:p-4'
  );
}

/**
 * Get classes for centering content in viewport
 */
export function getCenteredContentClasses() {
  return cn(
    'flex flex-col items-center justify-center',
    'min-h-screen', // Fallback
    'min-h-dvh' // Dynamic viewport
  );
}

/**
 * Ensure text scales properly on mobile
 */
export function getResponsiveTextClasses(baseSize: string) {
  const sizeMap: Record<string, string> = {
    'text-xs': 'text-xs max-sm:text-[10px]',
    'text-sm': 'text-sm max-sm:text-xs',
    'text-base': 'text-base max-sm:text-sm',
    'text-lg': 'text-lg max-sm:text-base',
    'text-xl': 'text-xl max-sm:text-lg',
    'text-2xl': 'text-2xl max-sm:text-xl',
    'text-3xl': 'text-3xl max-sm:text-2xl',
    'text-4xl': 'text-4xl max-sm:text-3xl',
    'text-5xl': 'text-5xl max-sm:text-4xl'
  };
  
  return sizeMap[baseSize] || baseSize;
}

/**
 * Get classes for responsive button sizing
 */
export function getResponsiveButtonClasses(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizeMap = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base max-sm:py-2 max-sm:px-4 max-sm:text-sm',
    lg: 'py-4 px-8 text-lg max-sm:py-3 max-sm:px-6 max-sm:text-base'
  };
  
  return cn(
    sizeMap[size],
    // Ensure buttons are touch-friendly
    'min-h-[44px]' // iOS recommended touch target size
  );
}

// Export React import for the hook
import React from 'react';