# 🛒 Guía de Integración del Carrito de Compras

## 📋 Resumen

Sistema completo de carrito de compras integrado con todas las aplicaciones de pago de la Plataforma Angélica.

---

## ✅ Lo Que Se Ha Creado

### 1. **Sistema de Carrito Completo**

#### Archivos Creados:
```
src/context/CartContext.jsx          - Contexto global del carrito
src/components/Cart/ShoppingCart.jsx - Carrito completo
src/components/Cart/MiniCart.jsx     - Mini carrito para header
src/pages/Checkout.jsx               - Página de checkout
src/pages/TiendaAngelical.jsx        - Tienda integrada
database/cart-and-coupons.sql        - Tablas y funciones SQL
```

### 2. **Características Implementadas**

✅ **Persistencia del Carrito**
- LocalStorage para persistencia offline
- Sincronización con Supabase
- Recuperación automática al recargar

✅ **Gestión de Productos**
- Agregar/remover productos
- Actualizar cantidades
- Validación de stock en tiempo real
- Notificaciones de stock bajo

✅ **Sistema de Cupones**
- Cupones de descuento (porcentaje y fijo)
- Validación de expiración
- Límite de usos
- Compra mínima requerida

✅ **Cálculos Automáticos**
- Subtotal
- Descuentos
- Envío (gratis >$100)
- Impuestos (IVA 16%)
- Total

✅ **Lista de Deseos (Wishlist)**
- Agregar productos a favoritos
- Mover de wishlist a carrito
- Persistencia en localStorage

✅ **Checkout Completo**
- Formulario de envío
- Información de pago
- Validación de datos
- Creación de orden
- Confirmación

---

## 🔧 Cómo Integrar en Otras Aplicaciones

### Paso 1: Envolver la App con CartProvider

```javascript
// src/App.jsx
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      {/* Tu aplicación */}
    </CartProvider>
  );
}
```

### Paso 2: Usar el Hook useCart

```javascript
import { useCart } from '../context/CartContext';

function MiComponente() {
  const {
    addToCart,
    cart,
    getTotal,
    getItemCount
  } = useCart();

  const handleAgregar = async (producto) => {
    const result = await addToCart(producto, 1);
    if (result.success) {
      alert('Producto agregado al carrito');
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <p>Items en carrito: {getItemCount()}</p>
      <p>Total: ${getTotal().toFixed(2)}</p>
      <button onClick={() => handleAgregar(miProducto)}>
        Agregar al Carrito
      </button>
    </div>
  );
}
```

---

## 📦 Integración por Aplicación

### 1. **Tienda Angelical** ✅ COMPLETADO

**Archivo**: `src/pages/TiendaAngelical.jsx`

**Integración**:
```javascript
import { useCart } from '../context/CartContext';

const TiendaAngelical = () => {
  const { addToCart, addToWishlist } = useCart();

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    // Mostrar notificación
  };

  return (
    // UI de la tienda
  );
};
```

**Estado**: ✅ Completamente integrado con el carrito

---

### 2. **Academia Angélica** 🔄 PENDIENTE

**Archivos a modificar**:
- `src/components/AcademiaAngelica/CourseCard.jsx`
- `src/components/AcademiaAngelica/CourseDetail.jsx`

**Integración necesaria**:

```javascript
// En CourseCard.jsx
import { useCart } from '../../context/CartContext';

const CourseCard = ({ course }) => {
  const { addToCart } = useCart();

  const handleEnroll = async () => {
    // Convertir curso a formato de producto
    const courseProduct = {
      id: course.id,
      name: course.title,
      price: course.price,
      image_url: course.thumbnail_url,
      description: course.short_description,
      type: 'course', // Identificar como curso
      category: 'cursos'
    };

    const result = await addToCart(courseProduct, 1);
    if (result.success) {
      // Mostrar notificación de éxito
    }
  };

  return (
    <div className="course-card">
      {/* ... */}
      <button onClick={handleEnroll}>
        Inscribirse - ${course.price}
      </button>
    </div>
  );
};
```

**Pasos**:
1. Importar `useCart` hook
2. Agregar botón "Agregar al Carrito" en cada curso
3. Convertir curso a formato de producto
4. Llamar a `addToCart()`
5. Mostrar notificación

---

### 3. **Consultas Online** 🔄 PENDIENTE

**Archivos a modificar**:
- `src/components/OnlineConsultation/BookingForm.jsx`
- `src/components/OnlineConsultation/ConsultantCard.jsx`

**Integración necesaria**:

```javascript
// En BookingForm.jsx
import { useCart } from '../../context/CartContext';

const BookingForm = ({ consultant, duration }) => {
  const { addToCart } = useCart();

  const handleBookSession = async () => {
    // Convertir sesión a formato de producto
    const sessionProduct = {
      id: `session-${consultant.id}-${Date.now()}`,
      name: `Consulta con ${consultant.name}`,
      price: consultant.rates[duration],
      image_url: consultant.avatar_url,
      description: `Sesión de ${duration} minutos`,
      type: 'consultation', // Identificar como consulta
      category: 'consultas',
      metadata: {
        consultant_id: consultant.id,
        duration: duration,
        scheduled_at: selectedDateTime
      }
    };

    const result = await addToCart(sessionProduct, 1);
    if (result.success) {
      // Redirigir al carrito o checkout
      navigate('/carrito');
    }
  };

  return (
    // Formulario de reserva
  );
};
```

**Pasos**:
1. Importar `useCart` hook
2. Agregar opción "Agregar al Carrito" además de "Reservar Ahora"
3. Convertir sesión a formato de producto
4. Incluir metadata (consultor, duración, fecha)
5. Llamar a `addToCart()`

---

### 4. **Sonoterapia** 🔄 PENDIENTE

**Archivos a modificar**:
- `src/components/Sonoterapia.jsx`
- `src/components/AudioCardWorldClass.jsx`

**Integración necesaria**:

```javascript
// En AudioCardWorldClass.jsx
import { useCart } from '../context/CartContext';

const AudioCardWorldClass = ({ audio }) => {
  const { addToCart } = useCart();

  const handleComprarAudio = async () => {
    // Convertir audio a formato de producto
    const audioProduct = {
      id: audio.id,
      name: audio.titulo,
      price: audio.precio,
      image_url: audio.portada,
      description: audio.descripcion,
      type: 'audio', // Identificar como audio
      category: 'sonoterapia',
      metadata: {
        duration: audio.duracion,
        frequency: audio.frecuencia
      }
    };

    const result = await addToCart(audioProduct, 1);
    if (result.success) {
      // Mostrar notificación
    }
  };

  return (
    <div className="audio-card">
      {/* ... */}
      {!audio.esGratis && (
        <button onClick={handleComprarAudio}>
          Comprar - ${audio.precio}
        </button>
      )}
    </div>
  );
};
```

**Pasos**:
1. Importar `useCart` hook
2. Agregar botón "Agregar al Carrito" en audios de pago
3. Convertir audio a formato de producto
4. Llamar a `addToCart()`
5. Mantener opción de "Comprar Ahora" para checkout directo

---

### 5. **Canalizaciones** 🔄 PENDIENTE

**Archivos a modificar**:
- `src/components/CanalizacionesSonoterapia.jsx`
- `src/components/CanalizacionCard.jsx`

**Integración necesaria**:

```javascript
// En CanalizacionCard.jsx
import { useCart } from '../context/CartContext';

const CanalizacionCard = ({ canalizacion }) => {
  const { addToCart } = useCart();

  const handleReservar = async () => {
    // Convertir canalización a formato de producto
    const canalizacionProduct = {
      id: canalizacion.id,
      name: canalizacion.titulo,
      price: canalizacion.precio,
      image_url: canalizacion.imagen,
      description: canalizacion.descripcion,
      type: 'channeling', // Identificar como canalización
      category: 'canalizaciones',
      metadata: {
        archangel: canalizacion.arcangel,
        duration: canalizacion.duracion
      }
    };

    const result = await addToCart(canalizacionProduct, 1);
    if (result.success) {
      // Mostrar notificación
    }
  };

  return (
    // Card de canalización
  );
};
```

---

### 6. **Terapias y Limpiezas** 🔄 PENDIENTE

**Archivos a modificar**:
- `src/components/MarketplaceTerapias.jsx`
- `src/components/MarketplaceLimpiezas.jsx`

**Integración necesaria**:

```javascript
// En MarketplaceTerapias.jsx
import { useCart } from '../context/CartContext';

const MarketplaceTerapias = () => {
  const { addToCart } = useCart();

  const handleReservarTerapia = async (terapia) => {
    // Convertir terapia a formato de producto
    const terapiaProduct = {
      id: terapia.id,
      name: terapia.titulo,
      price: terapia.precio,
      image_url: terapia.imagen,
      description: terapia.descripcion,
      type: 'therapy', // Identificar como terapia
      category: 'terapias',
      metadata: {
        duration: terapia.duracion,
        modality: terapia.modalidad
      }
    };

    const result = await addToCart(terapiaProduct, 1);
    if (result.success) {
      // Mostrar notificación
    }
  };

  return (
    // Marketplace de terapias
  );
};
```

---

## 🎯 Formato Estándar de Producto

Para mantener consistencia, todos los productos deben seguir este formato:

```javascript
const producto = {
  // Campos obligatorios
  id: 'unique-id',                    // ID único del producto
  name: 'Nombre del Producto',        // Nombre descriptivo
  price: 99.99,                       // Precio en número decimal
  
  // Campos opcionales pero recomendados
  image_url: 'https://...',           // URL de la imagen
  description: 'Descripción...',      // Descripción corta
  short_description: 'Resumen...',    // Resumen muy corto
  
  // Campos de clasificación
  type: 'product',                    // Tipo: product, course, consultation, audio, etc.
  category: 'categoria',              // Categoría del producto
  
  // Campos de inventario (solo para productos físicos)
  stock: 10,                          // Cantidad disponible
  
  // Metadata adicional (opcional)
  metadata: {
    // Datos específicos del tipo de producto
    duration: '60 min',
    instructor_id: 'uuid',
    scheduled_at: '2024-10-25T10:00:00Z'
  }
};
```

---

## 📊 Tipos de Productos

### Productos Físicos (Tienda)
```javascript
{
  type: 'product',
  category: 'cristales' | 'velas' | 'aceites' | 'inciensos' | 'joyeria' | 'libros',
  stock: 10 // Requerido
}
```

### Cursos (Academia)
```javascript
{
  type: 'course',
  category: 'cursos',
  metadata: {
    instructor_id: 'uuid',
    duration: 120, // minutos
    level: 'beginner' | 'intermediate' | 'advanced'
  }
}
```

### Consultas (Sesiones)
```javascript
{
  type: 'consultation',
  category: 'consultas',
  metadata: {
    consultant_id: 'uuid',
    duration: 30 | 60 | 90, // minutos
    scheduled_at: '2024-10-25T10:00:00Z'
  }
}
```

### Audios (Sonoterapia)
```javascript
{
  type: 'audio',
  category: 'sonoterapia',
  metadata: {
    duration: '8:00:00',
    frequency: '432Hz',
    format: 'mp3'
  }
}
```

### Canalizaciones
```javascript
{
  type: 'channeling',
  category: 'canalizaciones',
  metadata: {
    archangel: 'Miguel' | 'Gabriel' | 'Rafael' | 'Uriel',
    duration: 60 // minutos
  }
}
```

### Terapias
```javascript
{
  type: 'therapy',
  category: 'terapias',
  metadata: {
    modality: 'presencial' | 'online',
    duration: 90 // minutos
  }
}
```

---

## 🔄 Flujo de Compra

### 1. **Agregar al Carrito**
```
Usuario → Producto → Click "Agregar" → addToCart() → Notificación
```

### 2. **Ver Carrito**
```
Usuario → MiniCart (header) → Ver productos → Modificar cantidades
```

### 3. **Checkout**
```
Usuario → Carrito → "Proceder al Pago" → Formulario → Pago → Confirmación
```

### 4. **Después de la Compra**
```
Orden creada → Stock actualizado → Email confirmación → Dashboard usuario
```

---

## 🎨 Componentes UI Disponibles

### MiniCart (Header)
```javascript
import MiniCart from './components/Cart/MiniCart';

<MiniCart />
```

### Botón Agregar al Carrito
```javascript
const { addToCart } = useCart();

<button onClick={() => addToCart(producto)}>
  <ShoppingCart /> Agregar al Carrito
</button>
```

### Badge de Cantidad
```javascript
const { getItemCount } = useCart();

<span className="badge">{getItemCount()}</span>
```

---

## 📝 Checklist de Integración

### Para cada aplicación con pagos:

- [ ] Importar `useCart` hook
- [ ] Convertir items a formato de producto estándar
- [ ] Agregar botón "Agregar al Carrito"
- [ ] Implementar función `handleAddToCart`
- [ ] Mostrar notificaciones de éxito/error
- [ ] Actualizar UI según estado del carrito
- [ ] Probar flujo completo de compra
- [ ] Verificar validación de stock (si aplica)
- [ ] Documentar metadata específica

---

## 🐛 Troubleshooting

### Error: "useCart must be used within CartProvider"
**Solución**: Envolver la app con `<CartProvider>`

### Error: "Insufficient stock"
**Solución**: Verificar que el producto tenga stock disponible

### Carrito no persiste
**Solución**: Verificar que localStorage esté habilitado

### Cupón no aplica
**Solución**: Verificar que el cupón esté activo y no expirado

---

## 🚀 Próximos Pasos

1. ✅ Integrar Tienda Angelical (COMPLETADO)
2. 🔄 Integrar Academia Angélica
3. 🔄 Integrar Consultas Online
4. 🔄 Integrar Sonoterapia
5. 🔄 Integrar Canalizaciones
6. 🔄 Integrar Terapias y Limpiezas
7. 🔄 Agregar MiniCart al header global
8. 🔄 Configurar Stripe en producción
9. 🔄 Implementar emails de confirmación
10. 🔄 Agregar tracking de pedidos

---

## 📞 Soporte

Para preguntas sobre la integración:
- Revisar esta documentación
- Consultar código de TiendaAngelical.jsx (ejemplo completo)
- Verificar CartContext.jsx para API disponible

---

**Última actualización**: Octubre 2024
**Versión**: 1.0.0
**Estado**: En desarrollo

