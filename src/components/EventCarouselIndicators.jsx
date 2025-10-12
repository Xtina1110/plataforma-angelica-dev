import React, { useEffect, useState, useRef } from 'react';

const EventCarouselIndicators = ({ 
  totalSlides, 
  containerRef,
  autoScrollInterval = 5000,
  enableAutoScroll = true 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoScrollTimerRef = useRef(null);
  const isUserInteractingRef = useRef(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.offsetWidth;
      const newSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(newSlide);
      
      isUserInteractingRef.current = true;
      clearTimeout(autoScrollTimerRef.current);
      
      autoScrollTimerRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 10000);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(autoScrollTimerRef.current);
    };
  }, [containerRef]);

  useEffect(() => {
    if (!enableAutoScroll) return;
    
    const container = containerRef?.current;
    if (!container) return;

    const autoScroll = setInterval(() => {
      if (isUserInteractingRef.current) return;
      
      const nextSlide = (currentSlide + 1) % totalSlides;
      scrollToSlide(nextSlide);
    }, autoScrollInterval);

    return () => clearInterval(autoScroll);
  }, [currentSlide, totalSlides, enableAutoScroll, autoScrollInterval, containerRef]);

  const scrollToSlide = (slideIndex) => {
    const container = containerRef?.current;
    if (!container) return;

    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: slideWidth * slideIndex,
      behavior: 'smooth'
    });
  };

  const handleIndicatorClick = (index) => {
    isUserInteractingRef.current = true;
    scrollToSlide(index);
    
    clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 10000);
  };

  if (totalSlides <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => handleIndicatorClick(index)}
          className={`
            transition-all duration-300 ease-in-out
            ${currentSlide === index 
              ? 'w-8 h-3 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full shadow-lg' 
              : 'w-3 h-3 bg-gray-300 hover:bg-purple-300 rounded-full'
            }
          `}
          aria-label={`Ir al evento ${index + 1}`}
          aria-current={currentSlide === index}
        />
      ))}
    </div>
  );
};

export default EventCarouselIndicators;

