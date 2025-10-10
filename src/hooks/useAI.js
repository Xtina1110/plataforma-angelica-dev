import { useState } from 'react';

export const useAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInterpretation = async ({ cards, question, style = 'traditional' }) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai-interpretation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cards: cards.map(card => ({
            name: card.nombre,
            description: card.descripcion,
            position: card.position
          })),
          question,
          style,
          language: 'es'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate interpretation');
      }

      const data = await response.json();
      return {
        interpretation: data.interpretation,
        confidence: data.confidence,
        suggestions: data.suggestions
      };
    } catch (error) {
      console.error('Error in AI interpretation:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAudio = async (text, voice = 'es-ES-ElviraNeural') => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          format: 'mp3'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play audio
      const audio = new Audio(audioUrl);
      await audio.play();
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  };

  const analyzeUserPattern = async (userId, timeframe = '30d') => {
    try {
      const response = await fetch(`/api/user-pattern-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          timeframe
        })
      });

      const data = await response.json();
      return data.patterns;
    } catch (error) {
      console.error('Error analyzing patterns:', error);
      return null;
    }
  };

  return {
    generateInterpretation,
    generateAudio,
    analyzeUserPattern,
    isGenerating
  };
};