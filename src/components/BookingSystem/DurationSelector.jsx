import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const DurationSelector = ({ services, selectedService, onSelectService }) => {
  console.log('DurationSelector - All services:', services);

  // Filtrar solo servicios de consulta online
  const consultaServices = services.filter(service =>
    service.category === 'apertura_angelical' &&
    service.name.toLowerCase().includes('consulta online')
  );

  console.log('DurationSelector - Filtered consulta services:', consultaServices);

  // Ordenar por duración
  const sortedServices = [...consultaServices].sort((a, b) => a.duration - b.duration);

  console.log('DurationSelector - Sorted services:', sortedServices);

  const formatDuration = (minutes) => {
    const hours = minutes / 60;
    if (hours === 1) return '1 hora';
    if (hours < 1) return `${minutes} minutos`;
    if (Number.isInteger(hours)) return `${hours} horas`;
    return `${hours.toFixed(1)} horas`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Selecciona la Duración de tu Consulta
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Elige la duración de tu sesión de Apertura Angelical Online. Mínimo recomendado: 1.5 horas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedService?.id === service.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  selectedService?.id === service.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-r from-blue-100 to-indigo-100'
                }`}>
                  <Clock className={`w-8 h-8 ${
                    selectedService?.id === service.id ? 'text-white' : 'text-blue-600'
                  }`} />
                </div>

                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  {formatDuration(service.duration)}
                </h4>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-600">${service.price}</span>
                  <span className="text-gray-500 text-sm ml-1">USD</span>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  {service.description}
                </div>

                {selectedService?.id === service.id && (
                  <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Seleccionada</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay opciones de consulta online disponibles en este momento</p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          ¿Por qué mínimo 1.5 horas?
        </h4>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Tiempo suficiente para una lectura profunda y significativa</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Permite una conexión angelical más completa y detallada</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Incluye tiempo para preguntas y reflexión personal</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Sesiones más largas ofrecen mayor transformación espiritual</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DurationSelector;
