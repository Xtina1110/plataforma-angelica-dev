import React, { useState } from 'react';
import { useAperturaAngelical } from '../contexts/AperturaAngelicalContext';
import { Star, Trash2, Eye, Edit2, Save, X } from 'lucide-react';
import './FavoritosTiradas.css';

const FavoritosTiradas = ({ onClose, onVerTirada }) => {
  const { aperturaState, quitarFavorito, actualizarNotasFavorito } = useAperturaAngelical();
  const [editandoNotas, setEditandoNotas] = useState(null);
  const [notasTemp, setNotasTemp] = useState('');
  
  const guardarNotas = async (favoritoId) => {
    await actualizarNotasFavorito(favoritoId, notasTemp);
    setEditandoNotas(null);
  };
  
  const handleEliminarFavorito = async (favoritoId) => {
    if (window.confirm('¿Estás seguro de quitar esta tirada de favoritos?')) {
      await quitarFavorito(favoritoId);
    }
  };
  
  return (
    <div className="favoritos-modal-overlay" onClick={onClose}>
      <div className="favoritos-modal" onClick={(e) => e.stopPropagation()}>
        <div className="favoritos-header">
          <div className="favoritos-header-content">
            <h2>⭐ Tiradas Favoritas</h2>
            <p className="favoritos-subtitle">
              {aperturaState.tiradasFavoritas.length} {aperturaState.tiradasFavoritas.length === 1 ? 'favorita' : 'favoritas'}
            </p>
          </div>
          <button onClick={onClose} className="btn-close" title="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="favoritos-lista">
          {aperturaState.tiradasFavoritas.length === 0 ? (
            <div className="empty-state">
              <Star className="w-16 h-16 opacity-20" />
              <p className="empty-title">No tienes tiradas favoritas aún</p>
              <p className="empty-subtitle">
                Marca tus tiradas especiales como favoritas para acceder a ellas rápidamente
              </p>
            </div>
          ) : (
            aperturaState.tiradasFavoritas.map(favorito => (
              <div key={favorito.id} className="favorito-item">
                <div className="favorito-content">
                  <div className="favorito-header-item">
                    <Star className="w-5 h-5 favorito-star" fill="currentColor" />
                    <h3>{favorito.tema}</h3>
                    <span className={`badge-tipo ${favorito.tipo_tirada.replace(' ', '-').toLowerCase()}`}>
                      {favorito.tipo_tirada}
                    </span>
                  </div>
                  
                  <p className="favorito-fecha">
                    Agregado el {new Date(favorito.fecha_agregado).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  
                  <div className="favorito-cartas-grid">
                    {favorito.cartas.map((carta, i) => (
                      <div key={i} className="favorito-carta">
                        <img 
                          src={carta.imagen} 
                          alt={carta.nombre}
                          className="favorito-carta-img"
                        />
                        <span className="favorito-carta-nombre">{carta.nombre}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="favorito-notas">
                    <div className="notas-header">
                      <span className="notas-label">📝 Notas personales</span>
                      {editandoNotas !== favorito.id && (
                        <button 
                          onClick={() => {
                            setEditandoNotas(favorito.id);
                            setNotasTemp(favorito.notas || '');
                          }}
                          className="btn-editar-notas"
                          title="Editar notas"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    {editandoNotas === favorito.id ? (
                      <div className="notas-editor">
                        <textarea
                          value={notasTemp}
                          onChange={(e) => setNotasTemp(e.target.value)}
                          placeholder="Escribe tus reflexiones, aprendizajes o mensajes importantes de esta tirada..."
                          rows={4}
                          autoFocus
                        />
                        <div className="notas-acciones">
                          <button 
                            onClick={() => guardarNotas(favorito.id)}
                            className="btn-guardar"
                          >
                            <Save className="w-4 h-4" />
                            Guardar
                          </button>
                          <button 
                            onClick={() => setEditandoNotas(null)}
                            className="btn-cancelar"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="notas-display">
                        {favorito.notas ? (
                          <p>{favorito.notas}</p>
                        ) : (
                          <p className="notas-vacio">Sin notas. Haz click en editar para agregar tus reflexiones.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="favorito-acciones">
                  <button 
                    onClick={() => onVerTirada(favorito)}
                    className="btn-accion btn-ver"
                    title="Ver tirada completa"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver</span>
                  </button>
                  <button 
                    onClick={() => handleEliminarFavorito(favorito.id)}
                    className="btn-accion btn-eliminar"
                    title="Quitar de favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Quitar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {aperturaState.tiradasFavoritas.length > 0 && (
          <div className="favoritos-footer">
            <p className="favoritos-tip">
              💡 <strong>Tip:</strong> Usa las notas para registrar insights, sincronicidades o acciones que quieras recordar de cada tirada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritosTiradas;

