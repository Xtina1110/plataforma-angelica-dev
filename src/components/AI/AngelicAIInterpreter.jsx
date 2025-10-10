import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { useAI } from '@/hooks/useAI';

const AngelicAIInterpreter = ({ selectedCards, userQuestion }) => {
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [interpretationStyle, setInterpretationStyle] = useState('traditional');
  const { generateInterpretation, generateAudio } = useAI();

  const styles = [
    { id: 'traditional', name: 'Tradicional', description: 'Interpretación clásica angélica' },
    { id: 'modern', name: 'Moderna', description: 'Enfoque contemporáneo' },
    { id: 'mystical', name: 'Mística', description: 'Perspectiva espiritual profunda' },
    { id: 'practical', name: 'Práctica', description: 'Consejos aplicables' }
  ];

  const handleGenerateInterpretation = async () => {
    if (!selectedCards.length) return;
    
    setIsLoading(true);
    try {
      const result = await generateInterpretation({
        cards: selectedCards,
        question: userQuestion,
        style: interpretationStyle
      });
      setInterpretation(result.interpretation);
    } catch (error) {
      console.error('Error generating interpretation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!interpretation) return;
    
    try {
      await generateAudio(interpretation);
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Intérprete IA Angélico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Estilo de Interpretación
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <Button
                  key={style.id}
                  variant={interpretationStyle === style.id ? "default" : "outline"}
                  onClick={() => setInterpretationStyle(style.id)}
                  className="text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs opacity-70">{style.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleGenerateInterpretation}
              disabled={isLoading || !selectedCards.length}
              className="flex-1"
            >
              {isLoading ? 'Generando...' : 'Interpretar Cartas'}
            </Button>
            {interpretation && (
              <Button variant="outline" onClick={handleGenerateAudio}>
                🎵 Audio
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {interpretation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Interpretación Angélica</CardTitle>
              <Badge variant="outline">
                {styles.find(s => s.id === interpretationStyle)?.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-purple max-w-none">
              <p className="text-muted-foreground italic mb-4">
                {userQuestion && `"${userQuestion}"`}
              </p>
              <div className="whitespace-pre-wrap">{interpretation}</div>
            </div>
            
            <div className="mt-6 flex space-x-2">
              <Button variant="outline" size="sm">
                📄 Exportar PDF
              </Button>
              <Button variant="outline" size="sm">
                💌 Enviar por Email
              </Button>
              <Button variant="outline" size="sm">
                📱 Compartir
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AngelicAIInterpreter;