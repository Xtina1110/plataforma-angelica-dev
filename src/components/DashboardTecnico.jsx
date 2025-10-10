import React from 'react';
import LogoAngelico from './LogoAngelico';

const fondoMarmol = '/Fondomarmoleado.jpg';

const DashboardTecnico = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${fondoMarmol})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Transparencia */}
      <div className="absolute inset-0 bg-white/70 z-0"></div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen px-6 py-10">
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <LogoAngelico />
        </div>

        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 drop-shadow-md">
            Panel Técnico
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Herramientas para monitoreo y soporte técnico de la plataforma.
          </p>
        </div>

        {/* Módulos técnicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-2">🔧 Diagnóstico</h3>
            <p className="text-gray-700 text-sm mb-4">Verifica el estado general de la plataforma y recursos usados.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ver diagnóstico
            </button>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-2">📦 Logs & Errores</h3>
            <p className="text-gray-700 text-sm mb-4">Consulta logs recientes de errores o eventos críticos.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ver logs
            </button>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-2">📁 Gestión de Archivos</h3>
            <p className="text-gray-700 text-sm mb-4">Sube, reemplaza o elimina recursos multimedia de la plataforma.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ir a gestor
            </button>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-2">👥 Usuarios</h3>
            <p className="text-gray-700 text-sm mb-4">Revisa registros, roles y actividad reciente de los usuarios.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ver usuarios
            </button>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-2">🧪 Entorno</h3>
            <p className="text-gray-700 text-sm mb-4">Consulta variables de entorno configuradas en Vercel o Supabase.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ver entorno
            </button>
          </div>

          <div className="bg-white/90 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-purple-700 mb-2">📈 Métricas</h3>
            <p className="text-gray-700 text-sm mb-4">Visualiza estadísticas de uso y rendimiento de la plataforma.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ver métricas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTecnico;
