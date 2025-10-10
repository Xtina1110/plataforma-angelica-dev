import { supabase } from '../integrations/supabase/client';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class LoadingMessagesService {
  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.model = 'gpt-4-turbo-preview';
    this.messagesCache = {};
  }

  async generateAngelicMessages(language = 'ES', count = 10) {
    const languagePrompts = {
      ES: 'español',
      EN: 'inglés',
      FR: 'francés',
      IT: 'italiano',
      DE: 'alemán'
    };

    const systemPrompt = `Eres un canal angelical que crea mensajes inspiradores para una pantalla de carga espiritual.

INSTRUCCIONES:
- Genera exactamente ${count} mensajes únicos y diferentes
- Cada mensaje debe ser corto (máximo 60 caracteres)
- Usa lenguaje angelical, inspirador y positivo
- Los mensajes deben relacionarse con: conexión espiritual, luz divina, ángeles, transformación, paz interior
- IMPORTANTE: Cada mensaje debe ser completamente diferente de los demás
- No uses puntos suspensivos al final
- Escribe en ${languagePrompts[language]}
- Formato: Devuelve solo los mensajes separados por saltos de línea, sin numeración ni viñetas`;

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Genera ${count} mensajes angelicales únicos para una pantalla de carga espiritual.` }
          ],
          temperature: 0.9,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const messagesText = data.choices[0].message.content.trim();

      const messages = messagesText
        .split('\n')
        .map(msg => msg.trim())
        .filter(msg => msg.length > 0 && !msg.match(/^\d+[\.\)]/))
        .map(msg => msg.replace(/^[-•*]\s*/, ''))
        .slice(0, count);

      return messages;
    } catch (error) {
      console.error('Error generating messages with AI:', error);
      return this.getFallbackMessages(language);
    }
  }

  async getLoadingMessages(language = 'ES', count = 10) {
    try {
      const { data: existingMessages, error } = await supabase
        .from('loading_messages')
        .select('*')
        .eq('language', language)
        .eq('is_active', true)
        .order('used_count', { ascending: true })
        .limit(count);

      if (error) throw error;

      if (existingMessages && existingMessages.length >= count) {
        const messages = existingMessages.map(m => m.message);

        for (const msg of existingMessages) {
          await supabase
            .from('loading_messages')
            .update({
              used_count: msg.used_count + 1,
              last_used_at: new Date().toISOString()
            })
            .eq('id', msg.id);
        }

        return this.shuffleArray(messages);
      }

      const newMessages = await this.generateAngelicMessages(language, count);

      for (const message of newMessages) {
        const { data: existing } = await supabase
          .from('loading_messages')
          .select('id')
          .eq('message', message)
          .eq('language', language)
          .maybeSingle();

        if (!existing) {
          await supabase
            .from('loading_messages')
            .insert({
              message,
              language,
              used_count: 1,
              last_used_at: new Date().toISOString()
            });
        }
      }

      return this.shuffleArray(newMessages);
    } catch (error) {
      console.error('Error getting loading messages:', error);
      return this.getFallbackMessages(language);
    }
  }

  getFallbackMessages(language) {
    const fallbackMessages = {
      ES: [
        "Preparando tu espacio sagrado",
        "Conectando con la energía angelical",
        "Abriendo canales de luz divina",
        "Invocando protección celestial",
        "Activando tu conexión espiritual",
        "Los ángeles te esperan",
        "Creando ambiente de paz y amor",
        "Sintonizando frecuencias angelicales",
        "Preparando tu encuentro divino",
        "Bienvenido a tu transformación"
      ],
      EN: [
        "Preparing your sacred space",
        "Connecting with angelic energy",
        "Opening divine light channels",
        "Invoking celestial protection",
        "Activating your spiritual connection",
        "Angels are waiting for you",
        "Creating peace and love atmosphere",
        "Tuning into angelic frequencies",
        "Preparing your divine encounter",
        "Welcome to your transformation"
      ],
      FR: [
        "Préparation de votre espace sacré",
        "Connexion avec l'énergie angélique",
        "Ouverture des canaux de lumière divine",
        "Invocation de la protection céleste",
        "Activation de votre connexion spirituelle",
        "Les anges vous attendent",
        "Création d'une atmosphère de paix",
        "Syntonisation des fréquences angéliques",
        "Préparation de votre rencontre divine",
        "Bienvenue dans votre transformation"
      ],
      IT: [
        "Preparazione dello spazio sacro",
        "Connessione con l'energia angelica",
        "Apertura dei canali di luce divina",
        "Invocazione della protezione celeste",
        "Attivazione della connessione spirituale",
        "Gli angeli ti aspettano",
        "Creazione di un'atmosfera di pace",
        "Sintonizzazione sulle frequenze angeliche",
        "Preparazione dell'incontro divino",
        "Benvenuto nella tua trasformazione"
      ]
    };

    return fallbackMessages[language] || fallbackMessages.ES;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async regenerateMessagesForLanguage(language = 'ES', count = 10) {
    try {
      await supabase
        .from('loading_messages')
        .update({ is_active: false })
        .eq('language', language);

      const newMessages = await this.generateAngelicMessages(language, count);

      for (const message of newMessages) {
        await supabase
          .from('loading_messages')
          .insert({
            message,
            language,
            used_count: 0,
            is_active: true
          });
      }

      return newMessages;
    } catch (error) {
      console.error('Error regenerating messages:', error);
      throw error;
    }
  }
}

export default new LoadingMessagesService();
