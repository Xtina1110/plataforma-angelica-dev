import React, { useState } from 'react';
import './MisSonoterapias.css';
import { 
  ArrowLeft, Play, Pause, Download, Headphones, Clock, 
  Star, Filter, Search, Grid, List, Music, ShoppingBag
} from 'lucide-react';

const MisSonoterapias = ({ onVolver }) => {
  const [vistaActual, setVistaActual] = useState('grid');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Datos de ejemplo - en producción vendrían del estado global o API
  const sonoterapiasCompradas = [
    {
      id: 2,
      titulo: "528Hz - Reparación del ADN",
      descripcion: "Frecuencia milagrosa para transformación y sanación celular",
      duracion: "10:00:00",
      categoria: "Transformación",
      rating: 5.0,
      imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      fechaCompra: "2025-10-15",
      precio: 9.99,
      tipo: 'comprada'
    },
    {
      id: 3,
      titulo: "741Hz - Despertar Intuitivo",
      descripcion: "Limpia toxinas y despierta la intuición y expresión creativa",
      duracion: "12:00:00",
      categoria: "Despertar",
      rating: 4.8,
      imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      fechaCompra: "2025-10-10",
      precio: 12.99,
      tipo: 'comprada'
    }
  ];

  const sonoterapiasGratis = [
    {
      id: 1,
      titulo: "432Hz - Frecuencia del Amor",
      descripcion: "Armoniza el corazón y equilibra las emociones profundamente",
      duracion: "8:00:00",
      categoria: "Sanación",
      rating: 4.9,
      imagen: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      fechaAcceso: "2025-10-17",
      tipo: 'gratis'
    },
    {
      id: 4,
      titulo: "Meditación Trascendental",
      descripcion: "Alcanza estados profundos de consciencia y paz interior",
      duracion: "20:00:00",
      categoria: "Meditación",
      rating: 4.7,
      imagen: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      fechaAcceso: "2025-10-16",
      tipo: 'gratis'
    }
  ];

  // Combinar todas las sonoterapias
  const todasSonoterapias = [...sonoterapiasCompradas, ...sonoterapiasGratis];

  // Filtrar sonoterapias
  const sonoterapiasFiltradas = todasSonoterapias.filter(audio => {
    if (filtroActivo === 'compradas' && audio.tipo !== 'comprada') return false;
    if (filtroActivo === 'gratis' && audio.tipo !== 'gratis') return false;
    if (busqueda && !audio.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const handleDescargar = (audio) => {
    alert(`Descargando: ${audio.titulo}`);
    // Aquí iría la lógica real de descarga
  };

  const handleReproducir = (audio) => {
    alert(`Reproduciendo: ${audio.titulo}`);
    // Aquí iría la lógica real de reproducción
  };

  return (
    <div className="mis-sonoterapias-container">
      {/* Header */}
      <div className="mis-sonoterapias-header">
        <button onClick={onVolver} className="btn-volver-mis">
          <ArrowLeft size={20} />
          Volver
        </button>
        
        <div className="header-info">
          <div className="header-icon">
            <ShoppingBag size={40} />
          </div>
          <div className="header-text">
            <h1>Mis Sonoterapias</h1>
            <p>Tus sonoterapias compradas y gratuitas</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas-container">
        <div className="estadistica-card">
          <div className="estadistica-icono compradas">
            <Star size={24} />
          </div>
          <div className="estadistica-info">
            <span className="estadistica-numero">{sonoterapiasCompradas.length}</span>
            <span className="estadistica-label">Compradas</span>
          </div>
        </div>
        
        <div className="estadistica-card">
          <div className="estadistica-icono gratis">
            <Music size={24} />
          </div>
          <div className="estadistica-info">
            <span className="estadistica-numero">{sonoterapiasGratis.length}</span>
            <span className="estadistica-label">Gratuitas</span>
          </div>
        </div>
        
        <div className="estadistica-card">
          <div className="estadistica-icono total">
            <Headphones size={24} />
          </div>
          <div className="estadistica-info">
            <span className="estadistica-numero">{todasSonoterapias.length}</span>
            <span className="estadistica-label">Total</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="controles-mis-sonoterapias">
        <div className="busqueda-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar en mis sonoterapias..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />
        </div>

        <div className="filtros-vista-container">
          <select
            value={filtroActivo}
            onChange={(e) => setFiltroActivo(e.target.value)}
            className="filtro-select-mis"
          >
            <option value="todos">Todas</option>
            <option value="compradas">Compradas</option>
            <option value="gratis">Gratuitas</option>
          </select>

          <div className="vista-controles-mis">
            <button
              className={`btn-vista-mis ${vistaActual === 'grid' ? 'activo' : ''}`}
              onClick={() => setVistaActual('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`btn-vista-mis ${vistaActual === 'list' ? 'activo' : ''}`}
              onClick={() => setVistaActual('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de sonoterapias */}
      <div className={`sonoterapias-grid vista-${vistaActual}`}>
        {sonoterapiasFiltradas.length === 0 ? (
          <div className="sin-sonoterapias">
            <Music size={64} />
            <h3>No se encontraron sonoterapias</h3>
            <p>Intenta ajustar tus filtros de búsqueda</p>
          </div>
        ) : (
          sonoterapiasFiltradas.map((audio) => (
            <SonoterapiaCard
              key={audio.id}
              audio={audio}
              onDescargar={handleDescargar}
              onReproducir={handleReproducir}
              vista={vistaActual}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Componente de tarjeta de sonoterapia
const SonoterapiaCard = ({ audio, onDescargar, onReproducir, vista }) => {
  return (
    <div className={`sonoterapia-card-mis ${vista}`}>
      {/* Icono dorado */}
      <div className="sonoterapia-icono-mis">
        <Headphones size={32} />
      </div>

      {/* Contenido */}
      <div className="sonoterapia-contenido-mis">
        {/* Header */}
        <div className="sonoterapia-header-mis">
          <h3 className="sonoterapia-titulo-mis">{audio.titulo}</h3>
          <span className={`badge-tipo ${audio.tipo}`}>
            {audio.tipo === 'comprada' ? 'Comprada' : 'Gratis'}
          </span>
        </div>

        {/* Descripción */}
        <p className="sonoterapia-descripcion-mis">{audio.descripcion}</p>

        {/* Metadatos */}
        <div className="sonoterapia-meta-mis">
          <div className="meta-item-mis">
            <Clock size={16} />
            <span>{audio.duracion}</span>
          </div>
          <div className="meta-item-mis">
            <Star size={16} fill="currentColor" />
            <span>{audio.rating}</span>
          </div>
          <div className="meta-item-mis">
            <span className="categoria-badge">{audio.categoria}</span>
          </div>
        </div>

        {/* Fecha */}
        <div className="sonoterapia-fecha-mis">
          <span className="fecha-label">
            {audio.tipo === 'comprada' ? 'Comprada el:' : 'Acceso desde:'}
          </span>
          <span className="fecha-valor">
            {new Date(audio.tipo === 'comprada' ? audio.fechaCompra : audio.fechaAcceso).toLocaleDateString('es-ES')}
          </span>
        </div>

        {/* Precio (solo para compradas) */}
        {audio.tipo === 'comprada' && (
          <div className="sonoterapia-precio-mis">
            <span className="precio-label">Precio pagado:</span>
            <span className="precio-valor">${audio.precio} USD</span>
          </div>
        )}

        {/* Acciones */}
        <div className="sonoterapia-acciones-mis">
          <button 
            className="btn-accion-mis reproducir"
            onClick={() => onReproducir(audio)}
          >
            <Play size={18} />
            <span>Reproducir</span>
          </button>
          <button 
            className="btn-accion-mis descargar"
            onClick={() => onDescargar(audio)}
          >
            <Download size={18} />
            <span>Descargar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MisSonoterapias;

