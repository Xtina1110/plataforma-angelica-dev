import { useState, useEffect } from 'react';
import { Star, Clock, Globe, Award, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import supabase from '../../services/supabaseClient';
import './OnlineConsultation.css';

const ReaderSelector = ({ selectedTheme, onReaderSelected }) => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    loadReaders();
  }, [selectedTheme]);

  const loadReaders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('readers')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (selectedTheme && selectedTheme !== 'general') {
        query = query.contains('specialties', [selectedTheme]);
      }

      const { data, error } = await query;

      if (error) throw error;

      setReaders(data || []);
    } catch (error) {
      console.error('Error loading readers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReader = (reader) => {
    setSelectedReader(reader);
    onReaderSelected(reader);
  };

  const getThemeDisplay = (theme) => {
    const themes = {
      general: { name: 'General', icon: '🌟', color: '#d4af37' },
      amor: { name: 'Amor y Relaciones', icon: '💕', color: '#ec4899' },
      trabajo: { name: 'Trabajo y Abundancia', icon: '💰', color: '#10b981' },
      salud: { name: 'Salud y Bienestar', icon: '🌿', color: '#3b82f6' },
      proposito: { name: 'Propósito y Misión', icon: '🎯', color: '#8b5cf6' },
      crecimiento: { name: 'Crecimiento Espiritual', icon: '🧘', color: '#7c3aed' }
    };
    return themes[theme] || themes.general;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando angelólogos especializados...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Card className="border-2 mb-6" style={{ borderColor: '#d4af37', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.15)' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            Angelólogos Especializados
          </CardTitle>
          <CardDescription>
            Selecciona el lector angelical certificado que resonará con tu energía
            {selectedTheme && selectedTheme !== 'general' && (
              <span style={{ marginLeft: '0.5rem', fontWeight: '600' }}>
                - Especialistas en {getThemeDisplay(selectedTheme).name}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {readers.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay lectores disponibles para este tema en este momento
              </p>
            ) : (
              readers.map((reader) => (
                <div
                  key={reader.id}
                  onClick={() => handleSelectReader(reader)}
                  className={`reader-card ${selectedReader?.id === reader.id ? 'selected' : ''}`}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                    <div
                      className="reader-avatar"
                      style={{
                        background: reader.avatar_url
                          ? `url(${reader.avatar_url})`
                          : 'linear-gradient(135deg, #d4af37, #f59e0b)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                      {!reader.avatar_url && reader.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {reader.name}
                      </h3>

                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star className="w-4 h-4" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                          <span style={{ fontWeight: '600' }}>{reader.rating.toFixed(1)}</span>
                          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            ({reader.total_sessions} sesiones)
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                          <Clock className="w-4 h-4" />
                          <span style={{ fontSize: '0.875rem' }}>
                            ${reader.hourly_rate}/hora
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}>
                          <Globe className="w-4 h-4" />
                          <span style={{ fontSize: '0.875rem' }}>
                            {reader.languages?.join(', ')}
                          </span>
                        </div>
                      </div>

                      {reader.specialties && reader.specialties.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                          {reader.specialties.map((specialty, idx) => {
                            const theme = getThemeDisplay(specialty);
                            return (
                              <span
                                key={idx}
                                className="reader-specialty-badge"
                                style={{
                                  background: `${theme.color}15`,
                                  color: theme.color,
                                  borderColor: `${theme.color}40`
                                }}
                              >
                                {theme.icon} {theme.name}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {reader.bio && (
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          marginTop: '0.5rem'
                        }}>
                          {reader.bio}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      className="w-6 h-6"
                      style={{
                        color: selectedReader?.id === reader.id ? '#f59e0b' : '#d4af37',
                        transition: 'transform 0.3s ease',
                        transform: selectedReader?.id === reader.id ? 'translateX(4px)' : 'none'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReaderSelector;
