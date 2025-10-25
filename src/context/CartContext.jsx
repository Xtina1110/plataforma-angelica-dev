/**
 * Contexto del Carrito de Compras
 * 
 * Características:
 * - Persistencia en localStorage
 * - Sincronización con Supabase
 * - Gestión de cantidades
 * - Cálculo de totales
 * - Cupones de descuento
 * - Validación de stock
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    loadCartFromStorage();
    loadWishlistFromStorage();
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage();
    }
  }, [cart]);

  // Guardar wishlist en localStorage cuando cambie
  useEffect(() => {
    if (!isLoading) {
      saveWishlistToStorage();
    }
  }, [wishlist]);

  // Cargar carrito desde localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('angelica_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar carrito en localStorage
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('angelica_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  // Cargar wishlist desde localStorage
  const loadWishlistFromStorage = () => {
    try {
      const savedWishlist = localStorage.getItem('angelica_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  // Guardar wishlist en localStorage
  const saveWishlistToStorage = () => {
    try {
      localStorage.setItem('angelica_wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  // Agregar producto al carrito
  const addToCart = async (product, quantity = 1) => {
    try {
      // Verificar stock
      const { data: productData, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product.id)
        .single();

      if (error) throw error;

      const existingItem = cart.find(item => item.id === product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + quantity;

      if (newQuantity > productData.stock) {
        throw new Error(`Solo hay ${productData.stock} unidades disponibles`);
      }

      if (existingItem) {
        // Actualizar cantidad
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        ));
      } else {
        // Agregar nuevo producto
        setCart([...cart, { ...product, quantity }]);
      }

      return { success: true, message: 'Producto agregado al carrito' };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, message: error.message };
    }
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de producto
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      // Verificar stock
      const { data: productData, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

      if (error) throw error;

      if (quantity > productData.stock) {
        throw new Error(`Solo hay ${productData.stock} unidades disponibles`);
      }

      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { success: false, message: error.message };
    }
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Calcular subtotal
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Aplicar cupón de descuento
  const applyCoupon = async (couponCode) => {
    try {
      // Buscar cupón en base de datos
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new Error('Cupón inválido o expirado');
      }

      // Verificar fecha de expiración
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        throw new Error('Cupón expirado');
      }

      // Verificar uso mínimo
      const subtotal = getSubtotal();
      if (data.min_purchase && subtotal < data.min_purchase) {
        throw new Error(`Compra mínima de $${data.min_purchase} requerida`);
      }

      setCoupon(data);
      return { success: true, message: 'Cupón aplicado exitosamente' };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: error.message };
    }
  };

  // Remover cupón
  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calcular descuento
  const getDiscount = () => {
    if (!coupon) return 0;

    const subtotal = getSubtotal();

    if (coupon.type === 'percentage') {
      return subtotal * (coupon.value / 100);
    } else if (coupon.type === 'fixed') {
      return Math.min(coupon.value, subtotal);
    }

    return 0;
  };

  // Calcular envío (puede ser más complejo según ubicación)
  const getShipping = () => {
    const subtotal = getSubtotal();
    
    // Envío gratis para compras mayores a $100
    if (subtotal >= 100) return 0;
    
    // Envío estándar
    return 10;
  };

  // Calcular impuestos (ejemplo: 16% IVA)
  const getTax = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    return (subtotal - discount) * 0.16;
  };

  // Calcular total
  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const shipping = getShipping();
    const tax = getTax();
    return subtotal - discount + shipping + tax;
  };

  // Obtener cantidad de items en el carrito
  const getItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Agregar a wishlist
  const addToWishlist = (product) => {
    if (!wishlist.find(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      return { success: true, message: 'Agregado a favoritos' };
    }
    return { success: false, message: 'Ya está en favoritos' };
  };

  // Remover de wishlist
  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  // Verificar si está en wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Mover de wishlist a carrito
  const moveToCart = async (product) => {
    const result = await addToCart(product);
    if (result.success) {
      removeFromWishlist(product.id);
    }
    return result;
  };

  // Crear orden
  const createOrder = async (shippingAddress, paymentMethod) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Verificar stock de todos los productos
      for (const item of cart) {
        const { data: productData, error } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (error) throw error;

        if (item.quantity > productData.stock) {
          throw new Error(`${item.name}: Solo hay ${productData.stock} unidades disponibles`);
        }
      }

      // Crear orden
      const orderData = {
        user_id: user.id,
        total: getTotal(),
        status: 'pending',
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: getSubtotal(),
        discount: getDiscount(),
        shipping: getShipping(),
        tax: getTax(),
        coupon_code: coupon?.code || null
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Actualizar stock
      for (const item of cart) {
        await supabase.rpc('decrease_product_stock', {
          product_id: item.id,
          quantity: item.quantity
        });
      }

      // Limpiar carrito
      clearCart();

      return { success: true, order: data };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    // Estado
    cart,
    wishlist,
    coupon,
    isLoading,

    // Acciones del carrito
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,

    // Cálculos
    getSubtotal,
    getDiscount,
    getShipping,
    getTax,
    getTotal,
    getItemCount,

    // Cupones
    applyCoupon,
    removeCoupon,

    // Wishlist
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,

    // Órdenes
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

