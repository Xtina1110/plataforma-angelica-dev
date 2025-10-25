# 🎴 Tarjetas de Servicio Angelicales

Componente unificado para todas las páginas de selección de servicios de la Plataforma Angélica.

## 🎨 Diseño

### Características Visuales
- ✅ **Iconos en círculos dorados** con borde #D4AF37
- ✅ **Fondo transparente** con backdrop-blur
- ✅ **Hover con color de aplicación** correspondiente
- ✅ **Tamaños consistentes** (small, medium, large)
- ✅ **Animaciones suaves** (scale, shadow, color transitions)
- ✅ **Efecto de brillo** en hover
- ✅ **Indicador de selección** con checkmark

---

## 📦 Componentes

### 1. AngelicalServiceCard

Tarjeta individual de servicio.

```javascript
import AngelicalServiceCard from './components/ServiceCard/AngelicalServiceCard';
import { Clock } from 'lucide-react';

<AngelicalServiceCard
  icon={Clock}
  title="1 hora"
  description="Sesión estándar"
  price="$200"
  duration="60 minutos"
  color="#9333ea"
  isSelected={false}
  onClick={() => handleSelect()}
  badge="Popular"
  size="medium"
/>
```

### 2. ServiceCardGrid

Contenedor grid para múltiples tarjetas.

```javascript
import { ServiceCardGrid } from './components/ServiceCard/AngelicalServiceCard';

<ServiceCardGrid columns={3}>
  <AngelicalServiceCard ... />
  <AngelicalServiceCard ... />
  <AngelicalServiceCard ... />
</ServiceCardGrid>
```

### 3. AppColors

Colores predefinidos por aplicación.

```javascript
import { AppColors } from './components/ServiceCard/AngelicalServiceCard';

<AngelicalServiceCard
  color={AppColors.apertura}  // #9333ea (Purple)
  ...
/>
```

---

## 🎯 Props de AngelicalServiceCard

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `icon` | Component | - | Componente de icono de Lucide React |
| `title` | string | **required** | Título del servicio |
| `description` | string | - | Descripción opcional |
| `price` | string | - | Precio (ej: "$200") |
| `duration` | string | - | Duración (ej: "60 minutos") |
| `color` | string | '#9333ea' | Color hex de la aplicación |
| `isSelected` | boolean | false | Si está seleccionado |
| `onClick` | function | - | Callback al hacer click |
| `badge` | string | - | Badge opcional (ej: "Popular") |
| `disabled` | boolean | false | Si está deshabilitado |
| `size` | string | 'medium' | Tamaño: 'small', 'medium', 'large' |

---

## 🎨 Colores por Aplicación

```javascript
export const AppColors = {
  apertura: '#9333ea',      // Purple - Apertura Angelical
  canalizaciones: '#ec4899', // Pink - Canalizaciones
  sonoterapia: '#06b6d4',   // Cyan - Sonoterapia
  terapias: '#10b981',      // Emerald - Terapias y Limpiezas
  academia: '#f59e0b',      // Amber - Academia Angélica
  tienda: '#8b5cf6',        // Violet - Tienda Angelical
  eventos: '#ef4444',       // Red - Eventos
  blog: '#6366f1'           // Indigo - Blog/Podcast
};
```

---

## 📏 Tamaños

### Small
- Card padding: `p-4`
- Icon container: `w-16 h-16` (64px)
- Icon: `w-8 h-8` (32px)
- Title: `text-lg`
- Price: `text-xl`

**Uso**: Opciones de duración, precios

### Medium (Default)
- Card padding: `p-6`
- Icon container: `w-20 h-20` (80px)
- Icon: `w-10 h-10` (40px)
- Title: `text-xl`
- Price: `text-2xl`

**Uso**: Tipos de servicio, categorías principales

### Large
- Card padding: `p-8`
- Icon container: `w-24 h-24` (96px)
- Icon: `w-12 h-12` (48px)
- Title: `text-2xl`
- Price: `text-3xl`

**Uso**: Destacar servicios premium

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Tipos de Consulta (Apertura Angelical)

```javascript
import AngelicalServiceCard, { ServiceCardGrid, AppColors } from './components/ServiceCard';
import { Sparkles, Heart, Wind } from 'lucide-react';

const consultTypes = [
  {
    id: 'apertura',
    icon: Sparkles,
    title: 'Apertura Angelical',
    description: 'Conexión profunda con tus ángeles guardianes'
  },
  {
    id: 'terapias',
    icon: Heart,
    title: 'Terapias Energéticas',
    description: 'Sanación y equilibrio energético'
  },
  {
    id: 'limpiezas',
    icon: Wind,
    title: 'Limpiezas Espirituales',
    description: 'Purificación del aura y energía'
  }
];

<ServiceCardGrid columns={3}>
  {consultTypes.map(type => (
    <AngelicalServiceCard
      key={type.id}
      icon={type.icon}
      title={type.name}
      description={type.description}
      color={AppColors.apertura}
      isSelected={selectedType === type.id}
      onClick={() => setSelectedType(type.id)}
      size="medium"
    />
  ))}
</ServiceCardGrid>
```

---

### Ejemplo 2: Duraciones con Precios

```javascript
import { Clock } from 'lucide-react';

const durations = [
  { minutes: 60, label: '1 hora', price: 200 },
  { minutes: 75, label: '1h 15min', price: 250 },
  { minutes: 90, label: '1h 30min', price: 295 },
  { minutes: 120, label: '2 horas', price: 360 }
];

<ServiceCardGrid columns={4}>
  {durations.map(duration => (
    <AngelicalServiceCard
      key={duration.minutes}
      icon={Clock}
      title={duration.label}
      price={`$${duration.price}`}
      color={AppColors.apertura}
      isSelected={selectedDuration === duration.minutes}
      onClick={() => setSelectedDuration(duration.minutes)}
      size="small"
    />
  ))}
</ServiceCardGrid>
```

---

### Ejemplo 3: Cursos de Academia

```javascript
import { BookOpen, Video, FileText } from 'lucide-react';

const courses = [
  {
    id: 1,
    icon: BookOpen,
    title: 'Fundamentos Angelicales',
    description: 'Aprende los conceptos básicos',
    price: '$99',
    duration: '8 semanas',
    badge: 'Popular'
  },
  {
    id: 2,
    icon: Video,
    title: 'Meditación Avanzada',
    description: 'Técnicas profundas de conexión',
    price: '$149',
    duration: '12 semanas',
    badge: 'Nuevo'
  }
];

<ServiceCardGrid columns={3}>
  {courses.map(course => (
    <AngelicalServiceCard
      key={course.id}
      icon={course.icon}
      title={course.title}
      description={course.description}
      price={course.price}
      duration={course.duration}
      badge={course.badge}
      color={AppColors.academia}
      isSelected={selectedCourse === course.id}
      onClick={() => setSelectedCourse(course.id)}
      size="medium"
    />
  ))}
</ServiceCardGrid>
```

---

### Ejemplo 4: Productos de Tienda

```javascript
import { Package, Star, Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    icon: Package,
    title: 'Vela Angelical',
    description: 'Vela aromática para meditación',
    price: '$25'
  },
  {
    id: 2,
    icon: Star,
    title: 'Cristal de Cuarzo',
    description: 'Energía y protección',
    price: '$45',
    badge: 'Destacado'
  }
];

<ServiceCardGrid columns={4}>
  {products.map(product => (
    <AngelicalServiceCard
      key={product.id}
      icon={product.icon}
      title={product.title}
      description={product.description}
      price={product.price}
      badge={product.badge}
      color={AppColors.tienda}
      isSelected={false}
      onClick={() => addToCart(product)}
      size="medium"
    />
  ))}
</ServiceCardGrid>
```

---

### Ejemplo 5: Tipos de Terapia

```javascript
import { Heart, Zap, Waves, Sparkles } from 'lucide-react';

const therapies = [
  {
    id: 'reiki',
    icon: Heart,
    title: 'Reiki Angelical',
    description: 'Sanación energética con guía angelical'
  },
  {
    id: 'limpieza',
    icon: Sparkles,
    title: 'Limpieza Áurica',
    description: 'Purificación profunda del aura'
  },
  {
    id: 'equilibrio',
    icon: Waves,
    title: 'Equilibrio Chakras',
    description: 'Armonización de centros energéticos'
  }
];

<ServiceCardGrid columns={3}>
  {therapies.map(therapy => (
    <AngelicalServiceCard
      key={therapy.id}
      icon={therapy.icon}
      title={therapy.title}
      description={therapy.description}
      color={AppColors.terapias}
      isSelected={selectedTherapy === therapy.id}
      onClick={() => setSelectedTherapy(therapy.id)}
      size="medium"
    />
  ))}
</ServiceCardGrid>
```

---

## 🎨 Estados Visuales

### Normal
- Borde gris claro (#e5e7eb)
- Fondo blanco/80 con backdrop-blur
- Icono dorado (#D4AF37)

### Hover
- Borde dorado semi-transparente
- Scale 1.05
- Shadow aumentada
- Efecto de brillo radial con color de aplicación

### Selected
- Borde dorado (#D4AF37)
- Fondo con gradiente sutil (amarillo/blanco)
- Icono con color de aplicación
- Shadow con color de aplicación
- Checkmark con texto "Seleccionado"

### Disabled
- Opacity 50%
- Cursor not-allowed
- Sin efectos hover

---

## 🔄 Migración

### Antes (Código Antiguo)

```javascript
<button
  onClick={() => setSelected(id)}
  className={`p-6 rounded-2xl border-2 ${
    selected === id ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
  }`}
>
  <div className="text-5xl mb-4">✨</div>
  <h3 className="text-xl font-bold">Apertura Angelical</h3>
  <p className="text-gray-600">Descripción</p>
</button>
```

### Después (Nuevo Diseño)

```javascript
<AngelicalServiceCard
  icon={Sparkles}
  title="Apertura Angelical"
  description="Descripción"
  color={AppColors.apertura}
  isSelected={selected === id}
  onClick={() => setSelected(id)}
/>
```

---

## ✅ Checklist de Implementación

Para actualizar una página de servicio:

1. [ ] Importar componentes
   ```javascript
   import AngelicalServiceCard, { ServiceCardGrid, AppColors } from './components/ServiceCard';
   ```

2. [ ] Importar iconos de Lucide React
   ```javascript
   import { Sparkles, Heart, Clock } from 'lucide-react';
   ```

3. [ ] Reemplazar grid manual con ServiceCardGrid
   ```javascript
   <ServiceCardGrid columns={3}>
   ```

4. [ ] Reemplazar botones/cards con AngelicalServiceCard
   ```javascript
   <AngelicalServiceCard
     icon={Icon}
     title="Título"
     ...
   />
   ```

5. [ ] Usar color apropiado de AppColors
   ```javascript
   color={AppColors.apertura}
   ```

6. [ ] Ajustar tamaño según contexto
   ```javascript
   size="medium"  // small, medium, large
   ```

7. [ ] Probar estados: normal, hover, selected, disabled

---

## 🎯 Aplicaciones a Actualizar

### ✅ Completadas
- [x] Apertura Angelical (SistemaReservasCompleto)

### ⏳ Pendientes
- [ ] Canalizaciones y Sonoterapia
- [ ] Terapias y Limpiezas
- [ ] Academia Angélica
- [ ] Tienda Angelical
- [ ] Eventos

---

## 💎 Ventajas del Diseño Unificado

### ✅ Consistencia Visual
- Mismo look en todas las aplicaciones
- Iconos dorados característicos
- Animaciones uniformes

### ✅ Mejor UX
- Feedback visual claro
- Animaciones suaves
- Estados bien definidos

### ✅ Mantenibilidad
- Un solo componente para actualizar
- Props consistentes
- Fácil de extender

### ✅ Profesionalismo
- Diseño moderno
- Atención al detalle
- Marca angelical fuerte

---

**Desarrollado con 💜 para la Plataforma Angélica**

