# Audio Files para Experiencia Inmersiva 3D

## Archivos Requeridos

Esta carpeta debe contener los siguientes archivos de música ambiente para cada entorno sagrado:

### 1. temple-ambient.mp3
- **Ambiente**: Templo Celestial
- **Duración**: 3-5 minutos (loop)
- **Estilo**: Música celestial, coros angelicales, campanas suaves
- **Instrumentos sugeridos**: Arpa, coros, campanas tibetanas, cuencos de cristal
- **Mood**: Sagrado, elevado, majestuoso

### 2. garden-ambient.mp3
- **Ambiente**: Jardín Angelical
- **Duración**: 3-5 minutos (loop)
- **Estilo**: Música natural, sonidos de la naturaleza, melodías suaves
- **Instrumentos sugeridos**: Flauta, pájaros, agua corriendo, viento suave
- **Mood**: Paz, naturaleza, serenidad

### 3. cosmos-ambient.mp3
- **Ambiente**: Cosmos Estelar
- **Duración**: 3-5 minutos (loop)
- **Estilo**: Música espacial, ambient, etérea
- **Instrumentos sugeridos**: Sintetizadores, pads atmosféricos, resonancias cósmicas
- **Mood**: Expansivo, misterioso, infinito

### 4. sanctuary-ambient.mp3
- **Ambiente**: Santuario de Luz
- **Duración**: 3-5 minutos (loop)
- **Estilo**: Música luminosa, meditativa, elevada
- **Instrumentos sugeridos**: Cuencos cantores, campanas de viento, tonos puros
- **Mood**: Luz, pureza, claridad

## Fuentes Recomendadas

### Opciones Gratuitas (Royalty-Free)
1. **Pixabay Music**: https://pixabay.com/music/
   - Búsqueda: "meditation", "ambient", "celestial", "nature"
   
2. **Free Music Archive**: https://freemusicarchive.org/
   - Categorías: Ambient, New Age, Meditation

3. **YouTube Audio Library**: https://www.youtube.com/audiolibrary
   - Filtrar por género: Ambient, New Age

### Opciones Premium
1. **Epidemic Sound**: https://www.epidemicsound.com/
   - Música profesional con licencia completa
   
2. **Artlist**: https://artlist.io/
   - Biblioteca extensa de música espiritual y ambient

3. **AudioJungle**: https://audiojungle.net/
   - Compra individual de tracks

## Especificaciones Técnicas

- **Formato**: MP3
- **Bitrate**: 128-192 kbps (balance entre calidad y tamaño)
- **Sample Rate**: 44.1 kHz
- **Canales**: Stereo
- **Tamaño máximo**: 5 MB por archivo
- **Loop**: Debe hacer loop sin cortes audibles

## Instrucciones de Implementación

1. Descargar los archivos de música según las especificaciones
2. Convertir a MP3 si es necesario (usar Audacity o similar)
3. Normalizar el volumen (-3 dB pico)
4. Asegurar que hace loop sin cortes
5. Renombrar según los nombres especificados arriba
6. Colocar en esta carpeta `/public/audio/`

## Nota Importante

⚠️ **Los archivos de audio NO están incluidos en el repositorio** debido a:
- Tamaño de archivos
- Derechos de autor
- Licencias de uso

Debes obtener y agregar estos archivos manualmente antes de usar la experiencia inmersiva 3D.

## Alternativa: Usar URLs Externas

Si prefieres no almacenar los archivos localmente, puedes modificar el componente `ImmersiveCardExperience.jsx` para usar URLs de streaming:

```javascript
const environmentMusic = {
  temple: 'https://example.com/temple-ambient.mp3',
  garden: 'https://example.com/garden-ambient.mp3',
  cosmos: 'https://example.com/cosmos-ambient.mp3',
  sanctuary: 'https://example.com/sanctuary-ambient.mp3'
};
```

