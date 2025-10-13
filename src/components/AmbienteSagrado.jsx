import React, { useState, useEffect } from 'react';
import { Sparkles, Mountain, Waves, TreePine, Church, Home } from 'lucide-react';
import './AmbienteSagrado.css';

const ambientes = {
  ninguno: {
    id: 'ninguno',
    nombre: 'Ninguno',
    icono: Home,
    descripcion: 'Sin ambiente especial',
    fondo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    particulas: false
  },
  celestial: {
    id: 'celestial',
    nombre: 'Celestial',
    icono: Sparkles,
    descripcion: 'Un espacio etéreo lleno de luz divina',
    fondo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    particulas: 'estrellas',
    musica: '/audio/ambientes/celestial.mp3'
  },
  montana: {
    id: 'montana',
    nombre: 'Montaña Sagrada',
    icono: Mountain,
    descripcion: 'La serenidad de las cumbres nevadas',
    fondo: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    particulas: 'nieve',
    musica: '/audio/ambientes/montana.mp3'
  },
  oceano: {
    id: 'oceano',
    nombre: 'Océano Místico',
    icono: Waves,
    descripcion: 'Las profundidades del mar infinito',
    fondo: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)',
    particulas: 'burbujas',
    musica: '/audio/ambientes/oceano.mp3'
  },
  bosque: {
    id: 'bosque',
    nombre: 'Bosque Encantado',
    icono: TreePine,
    descripcion: 'La magia de la naturaleza ancestral',
    fondo: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    particulas: 'hojas',
    musica: '/audio/ambientes/bosque.mp3'
  },
  templo: {
    id: 'templo',
    nombre: 'Templo Angelical',
    icono: Church,
    descripcion: 'Un santuario de paz y devoción',
    fondo: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    particulas: 'luz',
    musica: '/audio/ambientes/templo.mp3'
  }
};

const AmbienteSagrado = ({ ambienteActivo = 'ninguno', onCambiarAmbiente, mostrarSelector = true }) => {
  const [particulas, setParticulas] = useState([]);
  const ambiente = ambientes[ambienteActivo] || ambientes.ninguno;
  
  // Generar partículas
  useEffect(() => {
    if (ambiente.particulas) {
      const nuevasParticulas = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
      }));
      setParticulas(nuevasParticulas);
    } else {
      setParticulas([]);
    }
  }, [ambiente.particulas]);
  
  return (
    <div className="ambiente-sagrado-wrapper">
      {/* Fondo con gradiente */}
      <div 
        className="ambiente-fondo"
        style={{ background: ambiente.fondo }}
      />
      
      {/* Partículas animadas */}
      {ambiente.particulas && (
        <div className={`particulas-container particulas-${ambiente.particulas}`}>
          {particulas.map(p => (
            <div
              key={p.id}
              className="particula"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Selector de ambiente */}
      {mostrarSelector && (
        <div className="ambiente-selector">
          <div className="ambiente-selector-header">
            <Sparkles className="w-5 h-5" />
            <span>Ambiente Sagrado</span>
          </div>
          <div className="ambiente-opciones">
            {Object.values(ambientes).map(amb => {
              const Icono = amb.icono;
              return (
                <button
                  key={amb.id}
                  onClick={() => onCambiarAmbiente && onCambiarAmbiente(amb.id)}
                  className={`ambiente-opcion ${ambienteActivo === amb.id ? 'activo' : ''}`}
                  title={amb.descripcion}
                >
                  <Icono className="w-5 h-5" />
                  <span>{amb.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Overlay sutil para mejor legibilidad */}
      <div className="ambiente-overlay" />
    </div>
  );
};

// Componente de selector independiente
export const SelectorAmbiente = ({ ambienteActivo, onCambiar }) => {
  return (
    <div className="selector-ambiente-compacto">
      <label className="selector-label">
        <Sparkles className="w-4 h-4" />
        Ambiente:
      </label>
      <select 
        value={ambienteActivo} 
        onChange={(e) => onCambiar(e.target.value)}
        className="selector-ambiente-dropdown"
      >
        {Object.values(ambientes).map(amb => (
          <option key={amb.id} value={amb.id}>
            {amb.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export { ambientes };
export default AmbienteSagrado;

