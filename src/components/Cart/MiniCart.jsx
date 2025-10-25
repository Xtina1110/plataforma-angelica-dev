/**
 * Mini Carrito para el Header
 * Dropdown con vista previa del carrito
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  X, 
  ArrowRight,
  Trash2,
  ShoppingBag
} from 'lucide-react';

const MiniCart = () => {
  const {
    cart,
    getItemCount,
    getSubtotal,
    removeFromCart
  } = useCart();

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewCart = () => {
    setIsOpen(false);
    navigate('/carrito');
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const itemCount = getItemCount();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del carrito */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown del carrito */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Carrito ({itemCount})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            /* Carrito vacío */
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/tienda');
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Ir a la Tienda
              </button>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Imagen */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-purple-400" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-purple-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Subtotal</span>
                  <span className="text-xl font-bold text-purple-600">
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>

                {/* Botones */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    Finalizar Compra
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleViewCart}
                    className="w-full bg-white border-2 border-purple-600 text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                  >
                    Ver Carrito Completo
                  </button>
                </div>

                {/* Envío gratis */}
                {getSubtotal() < 100 && (
                  <div className="text-xs text-center text-gray-600 bg-purple-50 p-2 rounded-lg">
                    Agrega ${(100 - getSubtotal()).toFixed(2)} más para envío gratis
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCart;

