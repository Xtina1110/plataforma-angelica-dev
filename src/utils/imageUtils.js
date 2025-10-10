// Utilidades para optimización de imágenes

export const getOptimizedImageSrc = (imagePath, format = 'webp') => {
  // Si el navegador soporta WebP, intentar usar la versión WebP
  if (format === 'webp' && supportsWebP()) {
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpPath;
  }
  return imagePath;
};

export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = (srcArray) => {
  return Promise.all(srcArray.map(preloadImage));
};

// Función para crear un placeholder de imagen optimizado
export const createImagePlaceholder = (width = 300, height = 200, color = '#f3f4f6') => {
  if (typeof window === 'undefined') return '';
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Añadir un patrón sutil
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(width/2 - 30, height/2 - 10, 60, 20);
  
  return canvas.toDataURL();
};

// Función para detectar si el dispositivo tiene conexión lenta
export const isSlowConnection = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) return false;
  
  const connection = navigator.connection;
  return connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' || 
         connection.saveData;
};

export default {
  getOptimizedImageSrc,
  supportsWebP,
  preloadImage,
  preloadImages,
  createImagePlaceholder,
  isSlowConnection
};