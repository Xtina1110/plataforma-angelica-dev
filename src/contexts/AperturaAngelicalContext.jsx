import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

// Create Context
const AperturaAngelicalContext = createContext();

// Provider Component
export const AperturaAngelicalProvider = ({ children, user }) => {
  const { toast } = useToast();
  
  const [aperturaState, setAperturaState] = useState({
    // Estado de la tirada actual
    tiradaActual: null,
    paso: 'instrucciones',
    tipoSeleccionado: null,
    temaSeleccionado: null,
    cartasSeleccionadas: [],
    interpretaciones: [],
    
    // Historial y favoritos
    historialTiradas: [],
    tiradasFavoritas: [],
    cargandoHistorial: false,
    
    // Configuración de visualización
    visualizacion: {
      tipoCartas: '2D', // '2D' | '3D'
      animaciones: 'completas', // 'completas' | 'reducidas' | 'ninguna'
      velocidad: 'normal' // 'lenta' | 'normal' | 'rapida'
    },
    
    // Configuración de audio
    audio: {
      musica: true,
      volumenMusica: 0.3,
      narracion: true,
      volumenNarracion: 0.7,
      vozNarracion: 'femenina' // 'masculina' | 'femenina' | 'neutral'
    },
    
    // Configuración de ambiente
    ambiente: {
      tipo: 'cielo', // 'cielo' | 'bosque' | 'oceano' | 'templo' | 'galaxia'
      particulas: true,
      efectosVisuales: true
    },
    
    // Configuración de privacidad
    privacidad: {
      guardarHistorial: true,
      compartirEstadisticas: false,
      permitirGrabacion: true
    },
    
    // Estadísticas del usuario
    estadisticas: {
      totalTiradas: 0,
      tiradas3Cartas: 0,
      tiradas6Cartas: 0,
      tiradas9Cartas: 0,
      temasFrecuentes: {},
      cartasFrecuentes: {},
      racha: 0,
      ultimaTirada: null
    }
  });

  // Cargar historial al montar
  useEffect(() => {
    if (user && aperturaState.privacidad.guardarHistorial) {
      cargarHistorial();
      cargarEstadisticas();
    }
  }, [user]);

  // Función para actualizar el estado
  const updateAperturaState = (updates) => {
    setAperturaState(prev => ({ ...prev, ...updates }));
  };

  // Función para actualizar configuración específica
  const updateConfiguracion = (seccion, updates) => {
    setAperturaState(prev => ({
      ...prev,
      [seccion]: { ...prev[seccion], ...updates }
    }));
  };

  // Cargar historial de tiradas
  const cargarHistorial = async () => {
    if (!user) return;
    
    try {
      updateAperturaState({ cargandoHistorial: true });
      
      const { data, error } = await supabase
        .from('historial_tiradas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha', { ascending: false })
        .limit(20);

      if (error) throw error;

      updateAperturaState({
        historialTiradas: data || [],
        cargandoHistorial: false
      });
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el historial de tiradas',
        variant: 'destructive'
      });
      updateAperturaState({ cargandoHistorial: false });
    }
  };

  // Cargar tiradas favoritas
  const cargarFavoritos = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tiradas_favoritas')
        .select('*')
        .eq('usuario_id', user.id)
        .order('fecha_agregado', { ascending: false });

      if (error) throw error;

      updateAperturaState({
        tiradasFavoritas: data || []
      });
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('estadisticas_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        updateAperturaState({
          estadisticas: {
            totalTiradas: data.total_tiradas || 0,
            tiradas3Cartas: data.tiradas_3_cartas || 0,
            tiradas6Cartas: data.tiradas_6_cartas || 0,
            tiradas9Cartas: data.tiradas_9_cartas || 0,
            temasFrecuentes: data.temas_frecuentes || {},
            cartasFrecuentes: data.cartas_frecuentes || {},
            racha: data.racha || 0,
            ultimaTirada: data.ultima_tirada
          }
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  // Guardar tirada en historial
  const guardarTirada = async (tirada) => {
    if (!user || !aperturaState.privacidad.guardarHistorial) return;
    
    try {
      const { data, error } = await supabase
        .from('historial_tiradas')
        .insert({
          usuario_id: user.id,
          tipo_tirada: tirada.tipo,
          tema: tirada.tema,
          cartas: tirada.cartas,
          interpretaciones: tirada.interpretaciones,
          fecha: new Date().toISOString(),
          ambiente: aperturaState.ambiente.tipo,
          visualizacion: aperturaState.visualizacion.tipoCartas
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar historial local
      updateAperturaState({
        historialTiradas: [data, ...aperturaState.historialTiradas]
      });

      // Actualizar estadísticas
      await actualizarEstadisticas(tirada);

      toast({
        title: 'Tirada guardada',
        description: 'Tu tirada ha sido guardada en el historial',
      });

      return data;
    } catch (error) {
      console.error('Error guardando tirada:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la tirada',
        variant: 'destructive'
      });
    }
  };

  // Agregar tirada a favoritos
  const agregarFavorito = async (tirada, notas = '') => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tiradas_favoritas')
        .insert({
          usuario_id: user.id,
          tirada_id: tirada.id,
          tipo_tirada: tirada.tipo_tirada,
          tema: tirada.tema,
          cartas: tirada.cartas,
          interpretaciones: tirada.interpretaciones,
          notas: notas,
          fecha_agregado: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      updateAperturaState({
        tiradasFavoritas: [data, ...aperturaState.tiradasFavoritas]
      });

      toast({
        title: '⭐ Agregado a favoritos',
        description: 'Esta tirada ha sido guardada en tus favoritos',
      });

      return data;
    } catch (error) {
      console.error('Error agregando a favoritos:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar a favoritos',
        variant: 'destructive'
      });
    }
  };

  // Quitar de favoritos
  const quitarFavorito = async (favoritoId) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tiradas_favoritas')
        .delete()
        .eq('id', favoritoId)
        .eq('usuario_id', user.id);

      if (error) throw error;

      updateAperturaState({
        tiradasFavoritas: aperturaState.tiradasFavoritas.filter(f => f.id !== favoritoId)
      });

      toast({
        title: 'Eliminado de favoritos',
        description: 'La tirada ha sido eliminada de tus favoritos',
      });
    } catch (error) {
      console.error('Error quitando de favoritos:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar de favoritos',
        variant: 'destructive'
      });
    }
  };

  // Actualizar notas de favorito
  const actualizarNotasFavorito = async (favoritoId, notas) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('tiradas_favoritas')
        .update({ notas })
        .eq('id', favoritoId)
        .eq('usuario_id', user.id);

      if (error) throw error;

      updateAperturaState({
        tiradasFavoritas: aperturaState.tiradasFavoritas.map(f =>
          f.id === favoritoId ? { ...f, notas } : f
        )
      });
    } catch (error) {
      console.error('Error actualizando notas:', error);
    }
  };

  // Actualizar estadísticas
  const actualizarEstadisticas = async (tirada) => {
    if (!user) return;
    
    try {
      const stats = { ...aperturaState.estadisticas };
      stats.totalTiradas += 1;
      
      // Incrementar contador según tipo
      if (tirada.tipo === '3 Cartas') stats.tiradas3Cartas += 1;
      if (tirada.tipo === '6 Cartas') stats.tiradas6Cartas += 1;
      if (tirada.tipo === '9 Cartas') stats.tiradas9Cartas += 1;
      
      // Actualizar temas frecuentes
      stats.temasFrecuentes[tirada.tema] = (stats.temasFrecuentes[tirada.tema] || 0) + 1;
      
      // Actualizar cartas frecuentes
      tirada.cartas.forEach(carta => {
        stats.cartasFrecuentes[carta.nombre] = (stats.cartasFrecuentes[carta.nombre] || 0) + 1;
      });
      
      // Calcular racha
      const hoy = new Date().toDateString();
      const ultimaTirada = stats.ultimaTirada ? new Date(stats.ultimaTirada).toDateString() : null;
      
      if (ultimaTirada === hoy) {
        // Ya hizo tirada hoy, mantener racha
      } else if (ultimaTirada === new Date(Date.now() - 86400000).toDateString()) {
        // Tirada fue ayer, incrementar racha
        stats.racha += 1;
      } else {
        // Racha rota, reiniciar
        stats.racha = 1;
      }
      
      stats.ultimaTirada = new Date().toISOString();

      // Guardar en Supabase
      const { error } = await supabase
        .from('estadisticas_usuario')
        .upsert({
          usuario_id: user.id,
          total_tiradas: stats.totalTiradas,
          tiradas_3_cartas: stats.tiradas3Cartas,
          tiradas_6_cartas: stats.tiradas6Cartas,
          tiradas_9_cartas: stats.tiradas9Cartas,
          temas_frecuentes: stats.temasFrecuentes,
          cartas_frecuentes: stats.cartasFrecuentes,
          racha: stats.racha,
          ultima_tirada: stats.ultimaTirada
        });

      if (error) throw error;

      updateAperturaState({ estadisticas: stats });
    } catch (error) {
      console.error('Error actualizando estadísticas:', error);
    }
  };

  // Buscar en historial
  const buscarEnHistorial = (termino, filtros = {}) => {
    let resultados = [...aperturaState.historialTiradas];
    
    // Filtrar por término de búsqueda
    if (termino) {
      resultados = resultados.filter(tirada =>
        tirada.tema.toLowerCase().includes(termino.toLowerCase()) ||
        tirada.tipo_tirada.toLowerCase().includes(termino.toLowerCase()) ||
        tirada.cartas.some(carta => carta.nombre.toLowerCase().includes(termino.toLowerCase()))
      );
    }
    
    // Filtrar por tipo de tirada
    if (filtros.tipo) {
      resultados = resultados.filter(t => t.tipo_tirada === filtros.tipo);
    }
    
    // Filtrar por tema
    if (filtros.tema) {
      resultados = resultados.filter(t => t.tema === filtros.tema);
    }
    
    // Filtrar por rango de fechas
    if (filtros.fechaInicio) {
      resultados = resultados.filter(t => new Date(t.fecha) >= new Date(filtros.fechaInicio));
    }
    
    if (filtros.fechaFin) {
      resultados = resultados.filter(t => new Date(t.fecha) <= new Date(filtros.fechaFin));
    }
    
    return resultados;
  };

  // Valor del contexto
  const contextValue = {
    aperturaState,
    updateAperturaState,
    updateConfiguracion,
    cargarHistorial,
    cargarFavoritos,
    cargarEstadisticas,
    guardarTirada,
    agregarFavorito,
    quitarFavorito,
    actualizarNotasFavorito,
    buscarEnHistorial
  };

  return (
    <AperturaAngelicalContext.Provider value={contextValue}>
      {children}
    </AperturaAngelicalContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAperturaAngelical = () => {
  const context = useContext(AperturaAngelicalContext);
  
  if (!context) {
    throw new Error('useAperturaAngelical must be used within an AperturaAngelicalProvider');
  }
  
  return context;
};

export default AperturaAngelicalContext;

