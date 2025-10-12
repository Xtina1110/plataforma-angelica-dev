import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Sparkles, RefreshCw } from 'lucide-react';
import './AIDailyMessage.css';

// Configuración de los 7 arcángeles (uno por día de la semana)
const ARCANGELES = {
  0: { // Domingo
    nombre: 'Zadquiel',
    tema: 'Perdón y Transformación',
    color: '#9C27B0',
    imagen: '/angeles/zadquiel.png'
  },
  1: { // Lunes
    nombre: 'Miguel',
    tema: 'Protección y Fuerza',
    color: '#2196F3',
    imagen: '/angeles/miguel.png'
  },
  2: { // Martes
    nombre: 'Gabriel',
    tema: 'Comunicación y Claridad',
    color: '#FFFFFF',
    imagen: '/angeles/gabriel.png'
  },
  3: { // Miércoles
    nombre: 'Rafael',
    tema: 'Sanación y Salud',
    color: '#4CAF50',
    imagen: '/angeles/rafael.png'
  },
  4: { // Jueves
    nombre: 'Uriel',
    tema: 'Sabiduría y Claridad',
    color: '#FFD700',
    imagen: '/angeles/uriel.png'
  },
  5: { // Viernes
    nombre: 'Chamuel',
    tema: 'Amor y Relaciones',
    color: '#E91E63',
    imagen: '/angeles/chamuel.png'
  },
  6: { // Sábado
    nombre: 'Jofiel',
    tema: 'Belleza y Creatividad',
    color: '#FFC107',
    imagen: '/angeles/jofiel.png'
  }
};

const AIDailyMessage = () => {
  const [message, setMessage] = useState('');
  const [angel, setAngel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadDailyMessage();
  }, []);

  const loadDailyMessage = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dateString = today.toISOString().split('T')[0];

    // Obtener ángel del día
    const angelDelDia = ARCANGELES[dayOfWeek];
    setAngel(angelDelDia);

    try {
      // Verificar si ya existe mensaje para hoy
      const { data: existingMessage, error: fetchError } = await supabase
        .from('daily_messages')
        .select('*')
        .eq('date', dateString)
        .single();

      if (existingMessage && !fetchError) {
        setMessage(existingMessage.message);
        setLoading(false);
        return;
      }

      // Si no existe, generar nuevo mensaje con IA
      await generateNewMessage(angelDelDia, dateString);
    } catch (error) {
      console.error('Error loading daily message:', error);
      // Mensaje de fallback
      setMessage(`Hoy ${angelDelDia.nombre} te acompaña en tu camino espiritual. ${angelDelDia.tema} es la energía que te guía.`);
      setLoading(false);
    }
  };

  const generateNewMessage = async (angelDelDia, dateString) => {
    try {
      // Llamar a OpenAI para generar el mensaje
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'Eres un canal espiritual que transmite mensajes de los arcángeles. Genera mensajes inspiradores, profundos y llenos de sabiduría angelical. Los mensajes deben ser de 2-3 líneas, poéticos y motivadores.'
            },
            {
              role: 'user',
              content: `Genera un mensaje del Arcángel ${angelDelDia.nombre} sobre ${angelDelDia.tema}. El mensaje debe ser inspirador, profundo y guiar al usuario en su camino espiritual.`
            }
          ],
          max_tokens: 150,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const data = await response.json();
      const generatedMessage = data.choices[0].message.content.trim();

      // Guardar en Supabase
      const { error: insertError } = await supabase
        .from('daily_messages')
        .insert({
          date: dateString,
          angel_name: angelDelDia.nombre,
          theme: angelDelDia.tema,
          message: generatedMessage
        });

      if (insertError) {
        console.error('Error saving message:', insertError);
      }

      setMessage(generatedMessage);
    } catch (error) {
      console.error('Error generating message:', error);
      // Mensaje de fallback
      setMessage(`Hoy ${angelDelDia.nombre} te acompaña en tu camino espiritual. ${angelDelDia.tema} es la energía que te guía.`);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (regenerating) return;
    
    setRegenerating(true);
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Eliminar mensaje actual
    await supabase
      .from('daily_messages')
      .delete()
      .eq('date', dateString);
    
    // Generar nuevo
    await generateNewMessage(angel, dateString);
  };

  if (loading) {
    return (
      <div className="ai-daily-message loading">
        <div className="message-loader">
          <Sparkles className="sparkle-icon" />
          <p>Canalizando mensaje angelical...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-daily-message" style={{ '--angel-color': angel?.color }}>
      <div className="message-header">
        <div className="angel-info">
          <div className="angel-icon">
            <Sparkles size={24} />
          </div>
          <div className="angel-details">
            <h3>Arcángel {angel?.nombre}</h3>
            <p>{angel?.tema}</p>
          </div>
        </div>
        <button 
          className="regenerate-button" 
          onClick={handleRegenerate}
          disabled={regenerating}
          title="Generar nuevo mensaje"
        >
          <RefreshCw size={18} className={regenerating ? 'spinning' : ''} />
        </button>
      </div>

      <div className="message-content">
        <div className="quote-mark">❝</div>
        <p className="message-text">{message}</p>
        <div className="quote-mark closing">❞</div>
      </div>

      <div className="message-footer">
        <button className="cta-button">
          VER TODOS LOS MENSAJES
        </button>
      </div>
    </div>
  );
};

export default AIDailyMessage;

