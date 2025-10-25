/**
 * Componente del Carrito de Compras
 * Carrito completo con todas las funcionalidades
 */

import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Truck,
  CreditCard,
  ArrowRight,
  X,
  Heart,
  ShoppingBag
} from 'lucide-react';

const ShoppingCart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
    getItemCount,
    applyCoupon,
    removeCoupon,
    coupon,
    addToWishlist
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) {
      setCouponError('Ingresa un código de cupón');
      return;
    }

    const result = await applyCoupon(couponCode);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponCode('');
    } else {
      setCouponError(result.message);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const result = await updateQuantity(productId, newQuantity);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleMoveToWishlist = (product) => {
    addToWishlist(product);
    removeFromCart(product.id);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              Descubre nuestros productos angelicales y comienza tu viaje espiritual
            </p>
            <button
              onClick={() => navigate('/tienda')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Ir a la Tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Imagen del producto */}
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-purple-400" />
                      </div>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        {item.short_description && (
                          <p className="text-sm text-gray-600">
                            {item.short_description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Precio y cantidad */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} c/u
                        </div>
                      </div>
                    </div>

                    {/* Acciones adicionales */}
                    <div className="mt-4 flex gap-4">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                      >
                        <Heart className="w-4 h-4" />
                        Mover a favoritos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón limpiar carrito */}
            <button
              onClick={clearCart}
              className="w-full py-3 text-red-600 hover:text-red-800 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Vaciar Carrito
            </button>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              {/* Cupón de descuento */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cupón de Descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Código"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={coupon}
                  />
                  {coupon ? (
                    <button
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Tag className="w-5 h-5" />
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-sm text-red-600 mt-2">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-sm text-green-600 mt-2">{couponSuccess}</p>
                )}
                {coupon && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-semibold">
                      ✓ Cupón "{coupon.code}" aplicado
                    </p>
                  </div>
                )}
              </div>

              {/* Desglose de precios */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>

                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span className="font-semibold">-${getDiscount().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Envío
                  </span>
                  <span className="font-semibold">
                    {getShipping() === 0 ? (
                      <span className="text-green-600">GRATIS</span>
                    ) : (
                      `$${getShipping().toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Impuestos (IVA 16%)</span>
                  <span className="font-semibold">${getTax().toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold text-purple-600">
                  ${getTotal().toFixed(2)}
                </span>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceder al Pago
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/tienda')}
                  className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>

              {/* Información adicional */}
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Envío gratis en compras mayores a $100</span>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Pago seguro con encriptación SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

