/**
 * Utilidades para optimización de rendimiento
 */

/**
 * Precarga de imágenes críticas
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Precarga múltiples imágenes
 */
export const preloadImages = async (sources) => {
  const promises = sources.map(src => preloadImage(src));
  return Promise.all(promises);
};

/**
 * Debounce function para optimizar eventos frecuentes
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function para limitar ejecuciones
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Detectar si el dispositivo soporta WebP
 */
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Obtener URL de imagen optimizada según el dispositivo
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  const { width, quality = 80, format } = options;
  
  // Si es una URL de Unsplash, usar sus parámetros de optimización
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width);
    params.set('q', quality);
    if (format) params.set('fm', format);
    params.set('auto', 'format');
    
    return `${url.split('?')[0]}?${params.toString()}`;
  }
  
  return url;
};

/**
 * Medir rendimiento de carga de componente
 */
export const measureComponentLoad = (componentName) => {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-load`;
  
  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      const measure = performance.getEntriesByName(measureName)[0];
      console.log(`${componentName} load time:`, measure.duration.toFixed(2), 'ms');
      return measure.duration;
    }
  };
};

/**
 * Lazy load de módulos dinámicos
 */
export const lazyLoadModule = (importFunc) => {
  return React.lazy(importFunc);
};

/**
 * Detectar conexión lenta
 */
export const isSlowConnection = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
};

/**
 * Optimizar animaciones según el rendimiento del dispositivo
 */
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Cache simple para resultados de funciones costosas
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Limpiar recursos no utilizados
 */
export const cleanupResources = () => {
  // Limpiar marcas de rendimiento antiguas
  if (typeof performance !== 'undefined') {
    performance.clearMarks();
    performance.clearMeasures();
  }
  
  // Limpiar cache de imágenes si es necesario
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('old') || name.includes('temp')) {
          caches.delete(name);
        }
      });
    });
  }
};

/**
 * Prefetch de rutas importantes
 */
export const prefetchRoute = (route) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

/**
 * Optimizar renderizado con requestIdleCallback
 */
export const scheduleIdleTask = (task) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(task);
  } else {
    setTimeout(task, 1);
  }
};

export default {
  preloadImage,
  preloadImages,
  debounce,
  throttle,
  supportsWebP,
  getOptimizedImageUrl,
  measureComponentLoad,
  isSlowConnection,
  shouldReduceMotion,
  memoize,
  cleanupResources,
  prefetchRoute,
  scheduleIdleTask
};

