import React, { useEffect, useState, useCallback } from 'react';

const EventCarouselIndicators = ({ 
  totalSlides, 
  carouselApi,
  autoScrollInterval = 5000,
  enableAutoScroll = true 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(enableAutoScroll);

  // Sincronizar con el carrusel cuando cambia de slide
  const onSelect = useCallback(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;

    onSelect();
    carouselApi.on('select', onSelect);
    carouselApi.on('reInit', onSelect);

    return () => {
      carouselApi.off('select', onSelect);
      carouselApi.off('reInit', onSelect);
    };
  }, [carouselApi, onSelect]);

  // Auto-scroll
  useEffect(() => {
    if (!carouselApi || !autoScrollEnabled) return;

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [carouselApi, autoScrollEnabled, autoScrollInterval, currentSlide]);

  // Pausar auto-scroll al interactuar
  useEffect(() => {
    if (!carouselApi) return;

    const handlePointerDown = () => {
      setAutoScrollEnabled(false);
      // Reactivar después de 10 segundos
      setTimeout(() => {
        setAutoScrollEnabled(true);
      }, 10000);
    };

    carouselApi.on('pointerDown', handlePointerDown);

    return () => {
      carouselApi.off('pointerDown', handlePointerDown);
    };
  }, [carouselApi]);

  const handleIndicatorClick = (index) => {
    if (!carouselApi) return;
    carouselApi.scrollTo(index);
    setAutoScrollEnabled(false);
    setTimeout(() => {
      setAutoScrollEnabled(true);
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

