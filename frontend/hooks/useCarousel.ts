import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage carousel scroll behavior and navigation
 * @param items - Array of items in the carousel
 * @returns Carousel ref, scroll states, and scroll function
 */
export function useCarousel<T>(items: T[]) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateCarouselButtons = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setCanScrollLeft(carousel.scrollLeft > 0);
    setCanScrollRight(carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 10);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    updateCarouselButtons();
    carousel.addEventListener('scroll', updateCarouselButtons);
    return () => carousel.removeEventListener('scroll', updateCarouselButtons);
  }, [items]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth * 0.8;
    carousel.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return {
    carouselRef,
    canScrollLeft,
    canScrollRight,
    scrollCarousel,
  };
}
