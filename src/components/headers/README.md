# 🎨 Headers Angelicales Unificados

Sistema de headers consistente para toda la Plataforma Angélica con diseño y botones homogéneos.

## 🌟 Características

### ✅ Diseño Unificado
- **Botones iguales** en todas las aplicaciones
- **Mismo formato** y estilo de botones
- **Colores personalizados** por aplicación
- **Animaciones consistentes**

### ✅ Componentes
- **UnifiedAngelicalHeader** - Componente base reutilizable
- **8 Headers específicos** - Uno por cada aplicación
- **Botones estándar** - Carrito, Usuario, Logout, Audio, Volver

---

## 🎨 Colores por Aplicación

| Aplicación | Color | Hex | Tema |
|------------|-------|-----|------|
| 🟣 Apertura Angelical | Purple | #9333ea | apertura |
| 🌸 Canalizaciones | Pink | #ec4899 | canalizaciones |
| 🌊 Sonoterapia | Cyan | #06b6d4 | sonoterapia |
| 💚 Terapias y Limpiezas | Emerald | #10b981 | terapias |
| 🟡 Academia Angélica | Amber | #f59e0b | academia |
| 🟣 Tienda Angelical | Violet | #8b5cf6 | tienda |
| 🔴 Eventos | Red | #ef4444 | eventos |
| 🔵 Blog & Podcast | Indigo | #6366f1 | blog |

---

## 📦 Uso

### Importar Header Específico

```javascript
import { AperturaAngelicaHeader } from './components/headers';

<AperturaAngelicaHeader
  user={user}
  cartCount={cartCount}
  onCartClick={() => navigate('/carrito')}
  onProfileClick={() => navigate('/perfil')}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
  audioActive={audioActive}
  onToggleAudio={handleToggleAudio}
/>
```

### Usar Componente Unificado Directamente

```javascript
import { UnifiedAngelicalHeader } from './components/headers';

<UnifiedAngelicalHeader
  app="apertura"  // apertura, canalizaciones, sonoterapia, etc.
  user={user}
  cartCount={cartCount}
  onCartClick={() => navigate('/carrito')}
  onProfileClick={() => navigate('/perfil')}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
/>
```

---

## ⚙️ Props

### Props Requeridas

| Prop | Tipo | Descripción |
|------|------|-------------|
| `user` | object | Usuario actual de Supabase |
| `onCartClick` | function | Callback al click en carrito |
| `onProfileClick` | function | Callback al click en perfil |
| `onLogout` | function | Callback al click en logout |
| `onNavigateHome` | function | Callback al click en volver |

### Props Opcionales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `app` | string | 'apertura' | Tema de la aplicación |
| `title` | string | - | Título personalizado |
| `subtitle` | string | - | Subtítulo personalizado |
| `cartCount` | number | 0 | Cantidad de items en carrito |
| `audioActive` | boolean | false | Estado del audio |
| `onToggleAudio` | function | - | Callback toggle audio |
| `showStats` | boolean | true | Mostrar stats del usuario |
| `showAudioControl` | boolean | true | Mostrar control de audio |
| `customStats` | ReactNode | - | Stats personalizados |

---

## 🎯 Botones Estándar

Todos los headers incluyen estos botones con el mismo formato:

### 1. **Selector de Idioma**
- Componente: `LanguageSelector`
- Posición: Primera fila, izquierda
- Inline con variant="header"

### 2. **Carrito** 🛒
```javascript
className="flex items-center space-x-2 
  bg-{color}-700 hover:bg-{color}-600 
  border-2 border-{color}-500 hover:border-{color}-400
  text-white px-5 py-3 rounded-xl 
  transition-all duration-300 font-semibold 
  shadow-xl hover:shadow-2xl hover:scale-105"
```
- Icono: `ShoppingCart`
- Badge: Contador de items (si > 0)

### 3. **Usuario** 👤
- Icono: `User`
- Texto: Nombre del usuario
- Mismo estilo que carrito

### 4. **Logout** 🚪
- Icono: `LogOut`
- Sin texto
- Mismo estilo que carrito

### 5. **Audio** 🔊
- Iconos: `Volume2` / `VolumeX`
- Texto: "Audio" / "Silenciar"
- Segunda fila
- Mismo estilo que carrito

### 6. **Volver** ⬅️
- Icono: `ArrowLeft`
- Texto: "Volver"
- Segunda fila
- Mismo estilo que carrito

---

## 🎨 Estructura Visual

```
┌─────────────────────────────────────────────────────────────┐
│  [Fondo Angelical con Overlay de Color]                    │
│                                                              │
│  Título Grande                    [Stats del Usuario]       │
│  Subtítulo                        ┌──────────────────────┐  │
│                                   │ Nivel | Puntos       │  │
│                                   └──────────────────────┘  │
│                                   [Idioma][🛒][👤][🚪]     │
│                                   [🔊][⬅️]                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Ejemplos

### Ejemplo 1: Apertura Angelical

```javascript
import { AperturaAngelicaHeader } from './components/headers';

<AperturaAngelicaHeader
  user={user}
  cartCount={3}
  onCartClick={() => navigate('/carrito')}
  onProfileClick={() => navigate('/perfil')}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
  audioActive={true}
  onToggleAudio={toggleAudio}
/>
```

**Resultado**:
- Color: Purple (#9333ea)
- Título: "Apertura Angelical"
- Subtítulo: "Abre tu corazón a la energía divina ✨"

---

### Ejemplo 2: Sonoterapia

```javascript
import { SonoterapiaHeader } from './components/headers';

<SonoterapiaHeader
  user={user}
  cartCount={0}
  onCartClick={() => navigate('/carrito')}
  onProfileClick={() => navigate('/perfil')}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
/>
```

**Resultado**:
- Color: Cyan (#06b6d4)
- Título: "Sonoterapia Angelical"
- Subtítulo: "Sana con frecuencias divinas 🎵"

---

### Ejemplo 3: Terapias con Stats Personalizados

```javascript
import { TerapiasHeader } from './components/headers';

const customStats = (
  <>
    <div className="text-center">
      <div className="text-sm opacity-80">Sesiones</div>
      <div className="font-bold text-lg">25</div>
    </div>
    <div className="w-px h-12 bg-white/30"></div>
    <div className="text-center">
      <div className="text-sm opacity-80">Energía</div>
      <div className="font-bold text-lg">95%</div>
    </div>
  </>
);

<TerapiasHeader
  user={user}
  cartCount={1}
  customStats={customStats}
  onCartClick={() => navigate('/carrito')}
  onProfileClick={() => navigate('/perfil')}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
/>
```

**Resultado**:
- Color: Emerald (#10b981)
- Stats personalizados mostrados

---

### Ejemplo 4: Academia sin Audio Control

```javascript
import { AcademiaHeader } from './components/headers';

<AcademiaHeader
  user={user}
  cartCount={5}
  showAudioControl={false}
  onCartClick={() => navigate('/carrito')}
  onProfileClick={() => navigate('/perfil')}
  onLogout={handleLogout}
  onNavigateHome={() => navigate('/dashboard')}
/>
```

**Resultado**:
- Color: Amber (#f59e0b)
- Sin botón de audio

---

## 🔄 Migración

### Antes (Header Antiguo)

```javascript
import SonoterapiaHeader from './components/headers/SonoterapiaHeader';

// 8,661 líneas de código duplicado
// Botones con estilos inconsistentes
// Colores hardcodeados
```

### Después (Header Unificado)

```javascript
import { SonoterapiaHeader } from './components/headers';

// 350 líneas de código reutilizable
// Botones consistentes
// Colores centralizados en AppThemes
```

---

## 📊 Ventajas

### ✅ Consistencia Total
- Mismo diseño en todas las aplicaciones
- Botones idénticos
- Animaciones uniformes

### ✅ Mantenibilidad
- Un solo componente base
- Cambios se propagan automáticamente
- Código DRY (Don't Repeat Yourself)

### ✅ Flexibilidad
- Props personalizables
- Stats personalizados
- Títulos/subtítulos opcionales

### ✅ Reducción de Código
- De ~70,000 líneas a ~12,000 líneas
- 83% menos código
- Más fácil de mantener

---

## 🎨 Personalización

### Cambiar Color de una Aplicación

```javascript
// En UnifiedAngelicalHeader.jsx
const AppThemes = {
  apertura: {
    primaryColor: '#9333ea', // Cambiar aquí
    buttonBg: 'bg-purple-700',
    // ...
  }
};
```

### Agregar Nueva Aplicación

1. Agregar tema en `AppThemes`:
```javascript
miapp: {
  name: 'Mi Aplicación',
  subtitle: 'Mi subtítulo ✨',
  primaryColor: '#123456',
  overlayColor: 'bg-mycolor-600/40',
  // ...
}
```

2. Crear header específico:
```javascript
// MiAppHeader.jsx
import UnifiedAngelicalHeader from './UnifiedAngelicalHeader';

const MiAppHeader = (props) => {
  return (
    <UnifiedAngelicalHeader
      app="miapp"
      {...props}
    />
  );
};

export default MiAppHeader;
```

3. Exportar en index.js:
```javascript
export { default as MiAppHeader } from './MiAppHeader';
```

---

## 📚 Headers Disponibles

### ✅ Implementados

1. **AperturaAngelicaHeader** - Purple
2. **CanalizacionesHeader** - Pink
3. **SonoterapiaHeader** - Cyan
4. **TerapiasHeader** - Emerald
5. **AcademiaHeader** - Amber
6. **TiendaHeader** - Violet
7. **EventosHeader** - Red
8. **BlogHeader** - Indigo

### 📝 Otros (Sin actualizar)

9. **MensajeHeader** - Mensaje del Día
10. **ReservasHeader** - Sistema de Reservas

---

## 🔧 Troubleshooting

### Los botones no tienen el color correcto
- Verificar que el prop `app` sea correcto
- Verificar que el tema exista en `AppThemes`

### El nombre de usuario no aparece
- Verificar que `user` esté pasado correctamente
- Verificar conexión con Supabase

### El contador del carrito no se actualiza
- Verificar que `cartCount` se actualice en el estado padre
- Verificar que `CartContext` esté funcionando

---

## 💡 Mejores Prácticas

1. **Usar headers específicos** en lugar del unificado cuando sea posible
2. **Pasar todas las props requeridas** para evitar errores
3. **Personalizar stats** solo cuando sea necesario
4. **Mantener callbacks simples** (navigate, setState, etc.)
5. **No modificar UnifiedAngelicalHeader** directamente, extender si es necesario

---

**Desarrollado con 💜 para la Plataforma Angélica**

