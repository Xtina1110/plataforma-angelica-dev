import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  fallback = null,
  loading = 'lazy',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  if (error && fallback) {
    return fallback;
  }

  return (
    <div 
      ref={imgRef}
      className={`relative ${className}`}
      style={style}
      {...props}
    >
      {inView && (
        <>
          {!loaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
          )}
          <img
            src={src}
            alt={alt}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            style={style}
          />
        </>
      )}
    </div>
  );
};

export default OptimizedImage;