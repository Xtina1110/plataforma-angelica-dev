import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const AngelicalModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  autoClose = true,
  autoCloseDelay = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? '#FFD700' : '#E91E63';
  const textColor = isSuccess ? '#6E3CBC' : '#E91E63';

  return (
    <div
      className="angelical-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'angelical-fade-in 0.4s ease-out',
        padding: '20px'
      }}
    >
      <div
        className="angelical-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '20px',
          padding: '40px 30px',
          maxWidth: '450px',
          width: '100%',
          boxShadow: `
            0 0 40px rgba(255, 215, 0, 0.3),
            0 20px 60px rgba(110, 60, 188, 0.2),
            0 0 0 1px rgba(255, 215, 0, 0.2)
          `,
          position: 'relative',
          animation: 'angelical-scale-in 0.4s ease-out',
          textAlign: 'center'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'all 0.3s ease',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(110, 60, 188, 0.1)';
            e.currentTarget.style.color = '#6E3CBC';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px',
            boxShadow: `
              0 0 30px ${iconColor}40,
              0 10px 25px rgba(0, 0, 0, 0.1)
            `,
            animation: 'angelical-pulse 2s ease-in-out infinite'
          }}
        >
          {isSuccess ? (
            <CheckCircle size={45} color="white" strokeWidth={2.5} />
          ) : (
            <AlertCircle size={45} color="white" strokeWidth={2.5} />
          )}
        </div>

        {title && (
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: textColor,
              marginBottom: '15px',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </h3>
        )}

        <p
          style={{
            fontSize: '16px',
            color: '#4b5563',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}
        >
          {message}
        </p>

        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #6E3CBC, #9C27B0)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(110, 60, 188, 0.3)',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(110, 60, 188, 0.4)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #7B42D1, #A931B8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(110, 60, 188, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #6E3CBC, #9C27B0)';
          }}
        >
          Aceptar
        </button>
      </div>

      <style>{`
        @keyframes angelical-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes angelical-scale-in {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes angelical-pulse {
          0%, 100% {
            box-shadow:
              0 0 30px ${iconColor}40,
              0 10px 25px rgba(0, 0, 0, 0.1);
          }
          50% {
            box-shadow:
              0 0 50px ${iconColor}60,
              0 15px 35px rgba(0, 0, 0, 0.15);
          }
        }

        .angelical-modal-overlay {
          -webkit-backdrop-filter: blur(5px);
        }
      `}</style>
    </div>
  );
};

export default AngelicalModal;
