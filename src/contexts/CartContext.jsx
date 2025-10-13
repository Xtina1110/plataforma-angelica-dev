import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * CartContext - Contexto global para gestión del carrito de compras
 * Proporciona estado y funciones para manejar items del carrito en tiempo real
 */

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('angelical_cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setCartItems(items);
          updateCartMetrics(items);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    };

    loadCart();
  }, []);

  // Actualizar métricas del carrito (count y total)
  const updateCartMetrics = useCallback((items) => {
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    setCartCount(count);
    setCartTotal(total);
  }, []);

  // Guardar carrito en localStorage
  const saveCart = useCallback((items) => {
    try {
      localStorage.setItem('angelical_cart', JSON.stringify(items));
      updateCartMetrics(items);
      
      // Disparar evento para compatibilidad con código legacy
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [updateCartMetrics]);

  // Añadir item al carrito
  const addToCart = useCallback((item) => {
    setCartItems(prevItems => {
      // Verificar si el item ya existe
      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.id === item.id && cartItem.type === item.type
      );

      let newItems;
      if (existingItemIndex !== -1) {
        // Item existe, incrementar cantidad
        newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + 1
        };
      } else {
        // Item nuevo, añadir al carrito
        newItems = [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }

      saveCart(newItems);
      return newItems;
    });
  }, [saveCart]);

  // Remover item del carrito
  const removeFromCart = useCallback((itemId, itemType) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(
        item => !(item.id === itemId && item.type === itemType)
      );
      saveCart(newItems);
      return newItems;
    });
  }, [saveCart]);

  // Actualizar cantidad de un item
  const updateQuantity = useCallback((itemId, itemType, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === itemId && item.type === itemType
          ? { ...item, quantity: newQuantity }
          : item
      );
      saveCart(newItems);
      return newItems;
    });
  }, [removeFromCart, saveCart]);

  // Limpiar carrito
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
    localStorage.removeItem('angelical_cart');
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  // Obtener item específico del carrito
  const getCartItem = useCallback((itemId, itemType) => {
    return cartItems.find(item => item.id === itemId && item.type === itemType);
  }, [cartItems]);

  // Verificar si un item está en el carrito
  const isInCart = useCallback((itemId, itemType) => {
    return cartItems.some(item => item.id === itemId && item.type === itemType);
  }, [cartItems]);

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

