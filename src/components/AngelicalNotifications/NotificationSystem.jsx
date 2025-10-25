/**
 * Sistema Unificado de Notificaciones Angelicales
 * Diseño consistente para toda la plataforma
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Sparkles,
  Heart,
  Star,
  Zap
} from 'lucide-react';
import AngelicalPrompt from './AngelicalPrompt';

// Contexto para el sistema de notificaciones
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

// Componente de Toast Individual
const AngelicalToast = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(), 300);
  };

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          gradient: 'from-green-500 to-emerald-500',
          bg: 'bg-white',
          border: 'border-green-200',
          icon: <Check className="w-6 h-6 text-white" />,
          iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
        };
      case 'error':
        return {
          gradient: 'from-red-500 to-pink-500',
          bg: 'bg-white',
          border: 'border-red-200',
          icon: <AlertCircle className="w-6 h-6 text-white" />,
          iconBg: 'bg-gradient-to-r from-red-500 to-pink-500'
        };
      case 'warning':
        return {
          gradient: 'from-yellow-500 to-orange-500',
          bg: 'bg-white',
          border: 'border-yellow-200',
          icon: <AlertTriangle className="w-6 h-6 text-white" />,
          iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500'
        };
      case 'angelical':
        return {
          gradient: 'from-purple-500 via-pink-500 to-purple-500',
          bg: 'bg-white',
          border: 'border-purple-200',
          icon: <Sparkles className="w-6 h-6 text-white" />,
          iconBg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500'
        };
      default:
        return {
          gradient: 'from-blue-500 to-indigo-500',
          bg: 'bg-white',
          border: 'border-blue-200',
          icon: <Info className="w-6 h-6 text-white" />,
          iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        ${styles.bg} ${styles.border}
        border-2 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-md
        backdrop-blur-lg
        transform transition-all duration-300 ease-out
        ${isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100'
        }
        hover:shadow-3xl hover:scale-105
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icono con gradiente */}
        <div className={`${styles.iconBg} rounded-xl p-2 flex-shrink-0 shadow-lg`}>
          {styles.icon}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {notification.title && (
            <h4 className="font-bold text-gray-900 mb-1">
              {notification.title}
            </h4>
          )}
          <p className="text-gray-700 text-sm leading-relaxed">
            {notification.message}
          </p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`
                mt-2 text-sm font-semibold
                bg-gradient-to-r ${styles.gradient}
                text-white px-4 py-1.5 rounded-lg
                hover:shadow-lg transform hover:scale-105 transition-all
              `}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Barra de progreso */}
      {notification.duration && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${styles.gradient} animate-progress`}
            style={{
              animation: `progress ${notification.duration}ms linear`
            }}
          />
        </div>
      )}
    </div>
  );
};

// Componente de Modal/Alert
const AngelicalModal = ({ modal, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    if (modal.onClose) {
      modal.onClose();
    }
    setIsExiting(true);
    setTimeout(() => onClose(), 300);
  };

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    handleClose();
  };

  const getStyles = () => {
    switch (modal.type) {
      case 'success':
        return {
          gradient: 'from-green-500 to-emerald-500',
          icon: <Check className="w-12 h-12 text-white" />
        };
      case 'error':
        return {
          gradient: 'from-red-500 to-pink-500',
          icon: <AlertCircle className="w-12 h-12 text-white" />
        };
      case 'warning':
        return {
          gradient: 'from-yellow-500 to-orange-500',
          icon: <AlertTriangle className="w-12 h-12 text-white" />
        };
      case 'angelical':
        return {
          gradient: 'from-purple-500 via-pink-500 to-purple-500',
          icon: <Sparkles className="w-12 h-12 text-white" />
        };
      default:
        return {
          gradient: 'from-blue-500 to-indigo-500',
          icon: <Info className="w-12 h-12 text-white" />
        };
    }
  };

  const styles = getStyles();

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-50
          transition-opacity duration-300
          ${isExiting ? 'opacity-0' : 'opacity-100'}
        `}
        onClick={modal.closeOnOverlay !== false ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`
            bg-white rounded-3xl shadow-2xl max-w-md w-full p-8
            pointer-events-auto
            transform transition-all duration-300
            ${isExiting 
              ? 'opacity-0 scale-95 translate-y-4' 
              : 'opacity-100 scale-100 translate-y-0'
            }
          `}
        >
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <div className={`
              bg-gradient-to-r ${styles.gradient}
              rounded-full p-4 shadow-xl
            `}>
              {styles.icon}
            </div>
          </div>

          {/* Título */}
          {modal.title && (
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              {modal.title}
            </h3>
          )}

          {/* Mensaje */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            {modal.message}
          </p>

          {/* Botones */}
          <div className="flex gap-3">
            {modal.showCancel !== false && (
              <button
                onClick={handleClose}
                className="
                  flex-1 px-6 py-3 rounded-xl font-semibold
                  bg-gray-100 text-gray-700
                  hover:bg-gray-200 transition-all
                "
              >
                {modal.cancelLabel || 'Cancelar'}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`
                flex-1 px-6 py-3 rounded-xl font-semibold text-white
                bg-gradient-to-r ${styles.gradient}
                hover:shadow-lg transform hover:scale-105 transition-all
              `}
            >
              {modal.confirmLabel || 'Aceptar'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Provider del Sistema de Notificaciones
export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [promptConfig, setPromptConfig] = useState(null);

  // Agregar toast
  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type: 'info',
      duration: 4000,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove después del duration
    if (toast.duration) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration + 300);
    }

    return id;
  }, []);

  // Remover toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Mostrar modal
  const showModal = useCallback((options) => {
    setModal({
      type: 'info',
      ...options
    });
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  // Métodos de conveniencia para toasts
  const toast = {
    success: (message, options = {}) => addToast({ message, type: 'success', ...options }),
    error: (message, options = {}) => addToast({ message, type: 'error', ...options }),
    warning: (message, options = {}) => addToast({ message, type: 'warning', ...options }),
    info: (message, options = {}) => addToast({ message, type: 'info', ...options }),
    angelical: (message, options = {}) => addToast({ message, type: 'angelical', ...options }),
  };

  // Métodos de conveniencia para modales
  const alert = {
    success: (message, options = {}) => showModal({ message, type: 'success', showCancel: false, ...options }),
    error: (message, options = {}) => showModal({ message, type: 'error', showCancel: false, ...options }),
    warning: (message, options = {}) => showModal({ message, type: 'warning', showCancel: false, ...options }),
    info: (message, options = {}) => showModal({ message, type: 'info', showCancel: false, ...options }),
    angelical: (message, options = {}) => showModal({ message, type: 'angelical', showCancel: false, ...options }),
  };

  // Confirmación
  const confirm = (message, options = {}) => {
    return new Promise((resolve) => {
      showModal({
        message,
        type: 'warning',
        onConfirm: () => resolve(true),
        onClose: () => resolve(false),
        ...options
      });
    });
  };

  // Prompt (selección de opciones)
  const prompt = (title, message, options, type = 'select') => {
    return new Promise((resolve) => {
      setPromptConfig({
        title,
        message,
        options,
        type,
        onConfirm: (value) => {
          setPromptConfig(null);
          resolve(value);
        },
        onCancel: () => {
          setPromptConfig(null);
          resolve(null);
        }
      });
    });
  };

  const value = {
    toast,
    alert,
    confirm,
    prompt,
    showModal,
    closeModal,
    addToast,
    removeToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Contenedor de Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map(notification => (
          <div key={notification.id} className="pointer-events-auto">
            <AngelicalToast
              notification={notification}
              onClose={() => removeToast(notification.id)}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <AngelicalModal
          modal={modal}
          onClose={closeModal}
        />
      )}

      {/* Prompt Dialog */}
      {promptConfig && (
        <AngelicalPrompt
          isOpen={true}
          title={promptConfig.title}
          message={promptConfig.message}
          options={promptConfig.options}
          type={promptConfig.type}
          onConfirm={promptConfig.onConfirm}
          onClose={promptConfig.onCancel}
        />
      )}
    </NotificationContext.Provider>
  );
};

// CSS para la animación de progreso
const style = document.createElement('style');
style.textContent = `
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;
document.head.appendChild(style);

export default NotificationProvider;

