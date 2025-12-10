import { useEffect, useState } from 'react';

/**
 * Hook to manage scroll-to-top button visibility and behavior
 * @param threshold - Scroll position threshold to show the button
 * @returns Object with showScrollTop state and scrollToTop function
 */
export function useScrollToTop(threshold: number = 400) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { showScrollTop, scrollToTop };
}
