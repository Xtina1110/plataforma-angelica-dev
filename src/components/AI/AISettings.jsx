import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/integrations/supabase/client';

const AISettings = () => {
  const [settings, setSettings] = useState({
    model: 'gpt-4-turbo-preview',
    interpretationStyle: 'traditional',
    depth: 'medium',
    language: 'es',
    includeAffirmations: true,
    includeMeditations: true,
    includeActions: true,
    spiritualContext: 'angelical',
    temperature: 0.7,
    maxTokens: 1000
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_ai_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSettings({ ...settings, ...data.settings });
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_ai_settings')
        .upsert({
          user_id: user.id,
          settings: settings
        });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const models = [
    {
      id: 'gpt-4-turbo-preview',
      name: 'GPT-4 Turbo',
      description: 'Más inteligente y rápido',
      icon: '🚀',
      recommended: true
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Máxima calidad',
      icon: '💎',
      premium: true
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Rápido y eficiente',
      icon: '⚡',
      economical: true
    }
  ];

  const interpretationStyles = [
    {
      id: 'traditional',
      name: 'Tradicional',
      description: 'Sabiduría ancestral y clásica',
      icon: '🏛️'
    },
    {
      id: 'modern',
      name: 'Moderno',
      description: 'Enfoque contemporáneo y práctico',
      icon: '🌟'
    },
    {
      id: 'mystical',
      name: 'Místico',
      description: 'Conexión espiritual profunda',
      icon: '🔮'
    },
    {
      id: 'practical',
      name: 'Práctico',
      description: 'Consejos accionables',
      icon: '🎯'
    }
  ];

  const depthLevels = [
    {
      id: 'light',
      name: 'Ligero',
      description: 'Interpretaciones breves y directas',
      tokens: '~300 tokens'
    },
    {
      id: 'medium',
      name: 'Medio',
      description: 'Balance entre profundidad y brevedad',
      tokens: '~600 tokens'
    },
    {
      id: 'deep',
      name: 'Profundo',
      description: 'Análisis completo y detallado',
      tokens: '~1000 tokens'
    }
  ];

  const spiritualContexts = [
    { id: 'angelical', name: 'Angélical', icon: '👼' },
    { id: 'tarot', name: 'Tarot', icon: '🃏' },
    { id: 'oracle', name: 'Oráculos', icon: '🔯' },
    { id: 'chakras', name: 'Chakras', icon: '🌈' },
    { id: 'astrology', name: 'Astrología', icon: '⭐' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración de IA Angélica</h1>
        <Button 
          onClick={saveSettings}
          disabled={isLoading}
          className={isSaved ? "bg-green-600" : ""}
        >
          {isLoading ? '💾 Guardando...' : isSaved ? '✅ Guardado' : '💾 Guardar'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Modelo de IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {models.map((model) => (
              <div
                key={model.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  settings.model === model.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                }`}
                onClick={() => setSettings({...settings, model: model.id})}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{model.icon}</span>
                    <div>
                      <div className="font-semibold">{model.name}</div>
                      <div className="text-sm text-muted-foreground">{model.description}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {model.recommended && (
                      <Badge variant="default">Recomendado</Badge>
                    )}
                    {model.premium && (
                      <Badge variant="secondary">Premium</Badge>
                    )}
                    {model.economical && (
                      <Badge variant="outline">Económico</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Interpretation Style */}
        <Card>
          <CardHeader>
            <CardTitle>Estilo de Interpretación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {interpretationStyles.map((style) => (
              <div
                key={style.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  settings.interpretationStyle === style.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                }`}
                onClick={() => setSettings({...settings, interpretationStyle: style.id})}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <div className="font-semibold">{style.name}</div>
                    <div className="text-sm text-muted-foreground">{style.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Depth Level */}
        <Card>
          <CardHeader>
            <CardTitle>Profundidad de Análisis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {depthLevels.map((depth) => (
              <div
                key={depth.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  settings.depth === depth.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                }`}
                onClick={() => setSettings({...settings, depth: depth.id})}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{depth.name}</div>
                    <div className="text-sm text-muted-foreground">{depth.description}</div>
                  </div>
                  <Badge variant="outline">{depth.tokens}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Spiritual Context */}
        <Card>
          <CardHeader>
            <CardTitle>Contexto Espiritual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {spiritualContexts.map((context) => (
                <div
                  key={context.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    settings.spiritualContext === context.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                  }`}
                  onClick={() => setSettings({...settings, spiritualContext: context.id})}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{context.icon}</div>
                    <div className="font-semibold text-sm">{context.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Opciones Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings.includeAffirmations}
                  onCheckedChange={(checked) => setSettings({...settings, includeAffirmations: checked})}
                />
                <label className="text-sm">Incluir Afirmaciones</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings.includeMeditations}
                  onCheckedChange={(checked) => setSettings({...settings, includeMeditations: checked})}
                />
                <label className="text-sm">Sugerir Meditaciones</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={settings.includeActions}
                  onCheckedChange={(checked) => setSettings({...settings, includeActions: checked})}
                />
                <label className="text-sm">Acciones Recomendadas</label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Creatividad (Temperature)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservador (0.0)</span>
                  <span className="font-semibold">{settings.temperature}</span>
                  <span>Creativo (1.0)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Máximo de Tokens</label>
                <select
                  value={settings.maxTokens}
                  onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                >
                  <option value={500}>500 (Breve)</option>
                  <option value={1000}>1000 (Medio)</option>
                  <option value={2000}>2000 (Extenso)</option>
                  <option value={4000}>4000 (Muy Detallado)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AISettings;