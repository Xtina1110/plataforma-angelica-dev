import React, { useState } from 'react';
import { ShoppingCart, Star, Heart, Package, Sparkles, Gift, Crown, Zap } from 'lucide-react';
import InstruccionesAngelicales from './InstruccionesAngelicales';
import './Dashboard.css';

const TiendaAngelical = ({ user, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [cartItems, setCartItems] = useState([]);

  const categories = [
    { id: 'todos', name: 'Todos los Productos', icon: Package },
    { id: 'cristales', name: 'Cristales Angelicales', icon: Sparkles },
    { id: 'velas', name: 'Velas Sagradas', icon: Star },
    { id: 'aceites', name: 'Aceites Esenciales', icon: Heart },
    { id: 'inciensos', name: 'Inciensos Divinos', icon: Zap },
    { id: 'joyeria', name: 'Joyería Angelical', icon: Crown },
    { id: 'libros', name: 'Libros Espirituales', icon: Gift }
  ];

  const products = [
    {
      id: 1,
      name: 'Cuarzo Rosa Angelical',
      category: 'cristales',
      price: 25.99,
      originalPrice: 35.99,
      rating: 4.8,
      reviews: 124,
      image: '/api/placeholder/300/300',
      description: 'Cristal de cuarzo rosa bendecido para el amor incondicional',
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: 'Vela de Arcángel Miguel',
      category: 'velas',
      price: 18.50,
      originalPrice: 24.99,
      rating: 4.9,
      reviews: 89,
      image: '/api/placeholder/300/300',
      description: 'Vela consagrada para protección y fortaleza espiritual',
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: 'Aceite de Sanación Angelical',
      category: 'aceites',
      price: 32.00,
      originalPrice: 42.00,
      rating: 4.7,
      reviews: 156,
      image: '/api/placeholder/300/300',
      description: 'Mezcla sagrada de aceites para sanación energética',
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: 'Incienso de Purificación',
      category: 'inciensos',
      price: 15.75,
      originalPrice: 20.00,
      rating: 4.6,
      reviews: 78,
      image: '/api/placeholder/300/300',
      description: 'Incienso natural para limpiar energías negativas',
      inStock: true,
      featured: false
    },
    {
      id: 5,
      name: 'Collar de Amatista Angelical',
      category: 'joyeria',
      price: 65.00,
      originalPrice: 85.00,
      rating: 4.9,
      reviews: 45,
      image: '/api/placeholder/300/300',
      description: 'Collar de amatista con símbolo angelical en plata',
      inStock: false,
      featured: true
    },
    {
      id: 6,
      name: 'Libro: Mensajes Angelicales',
      category: 'libros',
      price: 28.99,
      originalPrice: 35.99,
      rating: 4.8,
      reviews: 203,
      image: '/api/placeholder/300/300',
      description: 'Guía completa para conectar con tus ángeles guardianes',
      inStock: true,
      featured: false
    }
  ];

  const filteredProducts = selectedCategory === 'todos' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="dashboard-container">
      <main className="main-content min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Carrito en barra superior */}
      <div className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:shadow-lg transition-all duration-300">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">{getCartItemsCount()}</span>
                  <span className="text-sm">${getCartTotal().toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sección de instrucciones */}
        <InstruccionesAngelicales 
          titulo="Tienda Angelical"
          descripcion="Productos sagrados para tu bienestar espiritual y conexión divina"
          colorPrimario="amber"
          instrucciones={[
            {
              icono: Sparkles,
              titulo: "Elección Intuitiva",
              descripcion: "Deja que tu intuición te guíe hacia los productos que necesitas en este momento."
            },
            {
              icono: Heart,
              titulo: "Consagración Personal",
              descripcion: "Bendice y consagra cada producto con tu intención antes de usarlo."
            },
            {
              icono: Star,
              titulo: "Uso Sagrado",
              descripcion: "Utiliza cada artículo con respeto y gratitud hacia la energía que contiene."
            }
          ]}
          llamadaAccion="Explora nuestra tienda"
        />
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-xs font-medium text-center block">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'todos' ? 'Todos los Productos' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-600">{filteredProducts.length} productos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-purple-400" />
                  </div>
                  
                  {product.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ⭐ Destacado
                      </span>
                    </div>
                  )}
                  
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? (
                      <span className="flex items-center justify-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Agregar al Carrito</span>
                      </span>
                    ) : (
                      'No Disponible'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Suscríbete a Nuestro Newsletter Angelical</h3>
          <p className="text-lg mb-6 opacity-90">
            Recibe ofertas exclusivas y consejos espirituales directamente en tu correo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default TiendaAngelical;

