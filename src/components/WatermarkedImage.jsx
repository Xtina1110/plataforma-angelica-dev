import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { getCachedWatermarkedImage, preloadWatermarks } from '../utils/watermarkUtils';

const WatermarkedImage = ({ 
  src, 
  alt, 
  className = '', 
  watermarkOptions = {},
  fallback = null,
  loading = 'lazy',
  preload = false,
  onLoad = null,
  onError = null,
  ...props 
}) => {
  const [watermarkedSrc, setWatermarkedSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Memoize watermark options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => ({
    logoOpacity: 0.4,
    textOpacity: 0.3,
    position: 'center',
    text: 'el angelólogo',
    protection: 'medium',
    ...watermarkOptions
  }), [watermarkOptions]);

  const applyWatermark = useCallback(async () => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    console.log('WatermarkedImage: Starting watermark process for:', src);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('WatermarkedImage: Timeout reached, falling back to original image:', src);
      setWatermarkedSrc(src);
      setIsLoading(false);
      setError(false);
    }, 10000); // 10 seconds timeout

    try {
      setIsLoading(true);
      setError(false);
      
      const watermarked = await getCachedWatermarkedImage(src, memoizedOptions);
      clearTimeout(timeoutId); // Clear timeout if successful
      console.log('WatermarkedImage: Watermark successful for:', src);
      setWatermarkedSrc(watermarked);
      
      if (onLoad) {
        onLoad();
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('WatermarkedImage: Error applying watermark:', err);
      setError(false); // Don't set error, just use fallback
      setWatermarkedSrc(src); // Fallback to original image
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [src, memoizedOptions, onLoad, onError]);

  useEffect(() => {
    applyWatermark();
  }, [applyWatermark]);

  // Preload watermarks if requested
  useEffect(() => {
    if (preload && src) {
      preloadWatermarks([src], memoizedOptions);
    }
  }, [preload, src, memoizedOptions]);

  if (error && fallback) {
    return fallback;
  }

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 animate-pulse rounded-lg flex items-center justify-center min-h-[200px] ${className}`} {...props}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
          <div className="text-indigo-600 text-sm font-medium">Preparando imagen...</div>
        </div>
      </div>
    );
  }

  // Show original image if no watermarked version is available
  return (
    <img
      src={watermarkedSrc || src}
      alt={alt}
      className={className}
      loading={loading}
      draggable={false} // Prevent dragging for protection
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click
      style={{ userSelect: 'none' }} // Prevent text selection
      onError={() => {
        console.warn('WatermarkedImage: Image failed to load, using fallback:', src);
        if (!watermarkedSrc) {
          setWatermarkedSrc(src);
        }
      }}
      {...props}
    />
  );
};

export default WatermarkedImage;