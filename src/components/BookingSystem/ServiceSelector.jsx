import React, { useState } from 'react';
import { Clock, DollarSign, Star, CheckCircle, Sparkles, Heart, Shield } from 'lucide-react';

const ServiceSelector = ({ services, selectedService, onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = {
    all: { name: 'Todos los Servicios', icon: Sparkles, color: 'text-purple-600' },
    apertura_angelical: { name: 'Apertura Angelical', icon: Heart, color: 'text-blue-600' },
    terapias: { name: 'Terapias', icon: Sparkles, color: 'text-green-600' },
    sonoterapia: { name: 'Sonoterapia', icon: Shield, color: 'text-cyan-600' }
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  const getCategoryInfo = (category) => {
    return categories[category] || categories.all;
  };

  return (
    <div className="space-y-6">
      {/* Filtros de categoría */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Categorías de Servicios</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const categoryInfo = getCategoryInfo(service.category);
          const Icon = categoryInfo.icon;

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`bg-white rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedService?.id === service.id
                  ? 'ring-2 ring-blue-500 shadow-2xl'
                  : ''
              }`}
            >
              {/* Header del servicio */}
              <div className="p-6 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                      <Icon className={`w-6 h-6 ${categoryInfo.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                      <p className={`text-sm ${categoryInfo.color} font-medium`}>
                        {categoryInfo.name}
                      </p>
                    </div>
                  </div>

                  {selectedService?.id === service.id && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Descripción */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Detalles del servicio */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>${service.price}</span>
                  </div>
                </div>

                {/* Botón de selección */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectService(service);
                  }}
                  className={`w-full px-4 py-2 rounded-lg transition-all ${
                    selectedService?.id === service.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {selectedService?.id === service.id ? 'Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensaje si no hay servicios */}
      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay servicios disponibles
          </h3>
          <p className="text-gray-600">
            No encontramos servicios en esta categoría. Intenta con otra categoría.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
