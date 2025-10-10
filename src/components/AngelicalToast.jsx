import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const AngelicalToast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          icon: <Check size={20} className="text-green-600" />
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          icon: <AlertCircle size={20} className="text-red-600" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          icon: <AlertCircle size={20} className="text-yellow-600" />
        };
      default:
        return {
          bg: 'bg-purple-50 border-purple-200',
          text: 'text-purple-800',
          icon: <Info size={20} className="text-purple-600" />
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (!isVisible) return null;

  const styles = getTypeStyles();

  return (
    <div
      className={`fixed z-50 flex items-center gap-3 p-4 min-w-[300px] max-w-md rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 ${
        styles.bg
      } ${styles.text} ${getPositionStyles()} ${
        isExiting 
          ? 'opacity-0 transform translate-x-full' 
          : 'opacity-100 transform translate-x-0'
      }`}
    >
      {styles.icon}
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={handleClose}
        className={`ml-2 hover:opacity-70 transition-opacity ${styles.text}`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

// Hook para usar el toast
export const useAngelicalToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now();
    const toast = {
      id,
      message,
      type,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove después del duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, options.duration || 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <AngelicalToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          {...toast}
        />
      ))}
    </div>
  );

  return {
    addToast,
    ToastContainer,
    success: (message, options) => addToast(message, 'success', options),
    error: (message, options) => addToast(message, 'error', options),
    warning: (message, options) => addToast(message, 'warning', options),
    info: (message, options) => addToast(message, 'info', options),
  };
};

export default AngelicalToast;