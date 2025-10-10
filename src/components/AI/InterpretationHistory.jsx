import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';

const InterpretationHistory = () => {
  const [interpretations, setInterpretations] = useState([]);
  const [filteredInterpretations, setFilteredInterpretations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadInterpretations();
  }, []);

  useEffect(() => {
    filterInterpretations();
  }, [interpretations, searchTerm, filterStyle, filterDate]);

  const loadInterpretations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_interpretations')
        .select(`
          *,
          session:sessions(id, created_at)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInterpretations(data || []);
      
      // Load favorites
      const { data: favData } = await supabase
        .from('user_favorites')
        .select('interpretation_id')
        .eq('user_id', user.id)
        .eq('type', 'interpretation');

      const favSet = new Set(favData?.map(f => f.interpretation_id) || []);
      setFavorites(favSet);
    } catch (error) {
      console.error('Error loading interpretations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInterpretations = () => {
    let filtered = interpretations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.interpretation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cards_used?.some(card => card.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.question?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Style filter
    if (filterStyle !== 'all') {
      filtered = filtered.filter(item => item.style === filterStyle);
    }

    // Date filter
    if (filterDate !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterDate) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate = null;
      }

      if (filterDate) {
        filtered = filtered.filter(item => 
          new Date(item.created_at) >= filterDate
        );
      }
    }

    setFilteredInterpretations(filtered);
  };

  const toggleFavorite = async (interpretationId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isFavorite = favorites.has(interpretationId);
      
      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('interpretation_id', interpretationId)
          .eq('type', 'interpretation');
        
        const newFavorites = new Set(favorites);
        newFavorites.delete(interpretationId);
        setFavorites(newFavorites);
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            interpretation_id: interpretationId,
            type: 'interpretation'
          });
        
        const newFavorites = new Set(favorites);
        newFavorites.add(interpretationId);
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const exportInterpretation = (interpretation) => {
    const content = `
INTERPRETACIÓN ANGÉLICA
========================

Fecha: ${new Date(interpretation.created_at).toLocaleString('es-ES')}
Pregunta: ${interpretation.question || 'Consulta general'}
Estilo: ${interpretation.style}
Cartas utilizadas: ${interpretation.cards_used?.join(', ') || 'No especificado'}

INTERPRETACIÓN:
${interpretation.interpretation}

${interpretation.affirmation ? `\nAFIRMACIÓN:\n${interpretation.affirmation}` : ''}
${interpretation.suggestions?.length ? `\nSUGERENCIAS:\n${interpretation.suggestions.join('\n')}` : ''}

---
Generado por IA Angélica
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interpretacion_${interpretation.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStyleIcon = (style) => {
    const icons = {
      traditional: '🏛️',
      modern: '🌟',
      mystical: '🔮',
      practical: '🎯'
    };
    return icons[style] || '✨';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center space-y-2">
              <div className="animate-spin text-2xl">🔮</div>
              <p>Cargando interpretaciones...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Historial de Interpretaciones IA</h1>
        <Badge variant="outline">
          {filteredInterpretations.length} interpretaciones
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar en interpretaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Todos los estilos</option>
              <option value="traditional">🏛️ Tradicional</option>
              <option value="modern">🌟 Moderno</option>
              <option value="mystical">🔮 Místico</option>
              <option value="practical">🎯 Práctico</option>
            </select>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>

            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterStyle('all');
              setFilterDate('all');
            }}>
              🔄 Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interpretations List */}
      <div className="space-y-4">
        {filteredInterpretations.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center space-y-2">
                <div className="text-4xl">📚</div>
                <p className="text-muted-foreground">No se encontraron interpretaciones</p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Limpiar búsqueda
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredInterpretations.map((interpretation) => (
            <Card key={interpretation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStyleIcon(interpretation.style)}</span>
                    <div>
                      <CardTitle className="text-lg">
                        {interpretation.question || 'Consulta General'}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{new Date(interpretation.created_at).toLocaleDateString('es-ES')}</span>
                        <Badge variant="outline" className="text-xs">
                          {interpretation.style}
                        </Badge>
                        {interpretation.cards_used && (
                          <Badge variant="secondary" className="text-xs">
                            {interpretation.cards_used.length} cartas
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(interpretation.id)}
                    >
                      {favorites.has(interpretation.id) ? '⭐' : '☆'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exportInterpretation(interpretation)}
                    >
                      📄
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedId(
                        expandedId === interpretation.id ? null : interpretation.id
                      )}
                    >
                      {expandedId === interpretation.id ? '🔼' : '🔽'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {interpretation.cards_used && (
                  <div className="mb-3">
                    <div className="text-sm text-muted-foreground mb-1">Cartas utilizadas:</div>
                    <div className="flex flex-wrap gap-1">
                      {interpretation.cards_used.map((card, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {card}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Interpretación:</div>
                    <p className={`text-sm leading-relaxed ${
                      expandedId === interpretation.id ? '' : 'line-clamp-3'
                    }`}>
                      {interpretation.interpretation}
                    </p>
                  </div>
                  
                  {expandedId === interpretation.id && (
                    <div className="space-y-3 pt-3 border-t">
                      {interpretation.affirmation && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Afirmación:</div>
                          <p className="text-sm italic bg-muted p-2 rounded">
                            {interpretation.affirmation}
                          </p>
                        </div>
                      )}
                      
                      {interpretation.suggestions?.length > 0 && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Sugerencias:</div>
                          <ul className="text-sm space-y-1">
                            {interpretation.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span>•</span>
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InterpretationHistory;