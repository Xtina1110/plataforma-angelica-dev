import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import './AngelicalPrompt.css';

/**
 * AngelicalPrompt - Modal angelical para seleccionar opciones
 * 
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Callback al cerrar
 * @param {function} onConfirm - Callback al confirmar con el valor seleccionado
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje descriptivo
 * @param {Array} options - Array de opciones {value, label, description, price}
 * @param {string} type - Tipo de prompt: 'select' | 'input' | 'buttons'
 */
const AngelicalPrompt = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Selecciona una opción',
  message = '',
  options = [],
  type = 'select',
  inputPlaceholder = 'Ingresa un valor...',
  inputType = 'text'
}) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset values when opening
      setSelectedValue('');
      setInputValue('');
      
      // Focus on first input
      setTimeout(() => {
        const input = document.querySelector('.angelical-prompt-input');
        if (input) input.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const value = type === 'input' ? inputValue : selectedValue;
    if (value) {
      onConfirm(value);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (inputValue || selectedValue)) {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="angelical-prompt-overlay" onClick={onClose}>
      <div 
        className="angelical-prompt-modal" 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyPress}
      >
        {/* Header */}
        <div className="angelical-prompt-header">
          <div className="angelical-prompt-icon">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="angelical-prompt-title">{title}</h3>
          <button 
            onClick={onClose}
            className="angelical-prompt-close"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <p className="angelical-prompt-message">{message}</p>
        )}

        {/* Content */}
        <div className="angelical-prompt-content">
          {type === 'input' && (
            <input
              type={inputType}
              className="angelical-prompt-input"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
          )}

          {type === 'select' && (
            <div className="angelical-prompt-options">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`angelical-prompt-option ${
                    selectedValue === option.value ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="prompt-option"
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={(e) => setSelectedValue(e.target.value)}
                  />
                  <div className="option-content">
                    <div className="option-header">
                      <span className="option-label">{option.label}</span>
                      {option.price && (
                        <span className="option-price">${option.price}</span>
                      )}
                    </div>
                    {option.description && (
                      <p className="option-description">{option.description}</p>
                    )}
                  </div>
                  <div className="option-check">
                    <div className="check-circle"></div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {type === 'buttons' && (
            <div className="angelical-prompt-buttons-grid">
              {options.map((option) => (
                <button
                  key={option.value}
                  className={`angelical-prompt-button ${
                    selectedValue === option.value ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedValue(option.value)}
                >
                  <div className="button-content">
                    <span className="button-label">{option.label}</span>
                    {option.price && (
                      <span className="button-price">${option.price}</span>
                    )}
                    {option.description && (
                      <span className="button-description">{option.description}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="angelical-prompt-actions">
          <button
            onClick={onClose}
            className="angelical-prompt-action-cancel"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="angelical-prompt-action-confirm"
            disabled={type === 'input' ? !inputValue : !selectedValue}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AngelicalPrompt;

