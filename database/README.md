# 📚 Configuración de Base de Datos - Plataforma Angélica

## 🎯 Objetivo

Este directorio contiene el esquema completo de base de datos para la Plataforma Angélica, incluyendo todas las tablas necesarias para:

- ✅ Lecturas de cartas angelicales
- ✅ Sesiones de consulta online
- ✅ Academia (cursos, lecciones, inscripciones)
- ✅ Chatbot angelical
- ✅ Tienda (productos, pedidos)
- ✅ Blog y contenido

---

## 🚀 Método 1: Supabase Dashboard (RECOMENDADO - 2 minutos)

**Este es el método más fácil y rápido:**

### Paso 1: Abrir SQL Editor

```
https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/sql/new
```

O manualmente:
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto: `kolciyzkuvcwzegsomww`
3. Click en "SQL Editor" en el menú lateral
4. Click en "New query"

### Paso 2: Copiar y Ejecutar SQL

1. Abre el archivo `database/schema.sql`
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. Pégalo en el SQL Editor de Supabase
4. Click en **"Run"** (botón verde abajo a la derecha)
5. Espera ~30 segundos

### Paso 3: Verificar

Deberías ver mensajes de éxito. Verifica que se crearon las tablas:

1. Click en "Table Editor" en el menú lateral
2. Deberías ver las nuevas tablas:
   - `card_readings`
   - `consultation_sessions`
   - `courses`
   - `lessons`
   - `enrollments`
   - `chatbot_messages`
   - `products`
   - `orders`
   - `blog_posts`

¡Listo! ✅

---

## 🔧 Método 2: Node.js Script (Alternativo)

**Solo si prefieres usar código:**

### Requisitos

- Node.js instalado
- Service Role Key de Supabase

### Paso 1: Obtener Service Role Key

1. Ve a: https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/settings/api
2. En "Project API keys", copia la **"service_role"** key
3. ⚠️ **NUNCA** compartas esta key públicamente

### Paso 2: Ejecutar Script

```bash
cd plataforma-angelica-current

# Opción A: Con variable de entorno
SERVICE_ROLE_KEY=tu_service_role_key_aqui node database/setup-database.js

# Opción B: Crear archivo .env.local
echo "SERVICE_ROLE_KEY=tu_service_role_key_aqui" > .env.local
node database/setup-database.js
```

---

## 📊 Tablas Creadas

### 1. card_readings
Almacena las lecturas de cartas angelicales.

**Campos principales**:
- `user_id`: Usuario que hizo la lectura
- `mode`: Tipo de lectura (3, 6 o 9 cartas)
- `cards`: Array JSON de cartas seleccionadas
- `interpretation`: Interpretación de IA
- `environment`: Ambiente 3D usado

### 2. consultation_sessions
Almacena las sesiones de consulta online.

**Campos principales**:
- `user_id`: Cliente
- `consultant_id`: Terapeuta/Angelólogo
- `duration`: Duración en minutos
- `recording_url`: URL de grabación
- `transcript`: Transcripción de IA
- `pdf_url`: URL del PDF generado

### 3. courses
Almacena los cursos de la Academia Angélica.

**Campos principales**:
- `title`: Título del curso
- `instructor_id`: Instructor
- `price`: Precio
- `is_published`: Si está publicado

### 4. lessons
Almacena las lecciones de cada curso.

**Campos principales**:
- `course_id`: Curso al que pertenece
- `title`: Título de la lección
- `video_url`: URL del video
- `order_index`: Orden en el curso

### 5. enrollments
Almacena las inscripciones de usuarios a cursos.

**Campos principales**:
- `user_id`: Usuario inscrito
- `course_id`: Curso
- `progress`: Progreso (0-100%)
- `completed_lessons`: Array de lecciones completadas

### 6. chatbot_messages
Almacena los mensajes del chatbot angelical.

**Campos principales**:
- `user_id`: Usuario
- `angel`: Ángel seleccionado (angela, miguel, rafael, gabriel, uriel)
- `message`: Mensaje del usuario
- `response`: Respuesta del ángel

### 7. products
Almacena los productos de la tienda.

**Campos principales**:
- `name`: Nombre del producto
- `price`: Precio
- `category`: Categoría
- `stock`: Stock disponible

### 8. orders
Almacena los pedidos.

**Campos principales**:
- `user_id`: Usuario
- `total`: Total del pedido
- `status`: Estado (pending, processing, completed, cancelled)
- `items`: Array JSON de productos

### 9. blog_posts
Almacena los artículos del blog.

**Campos principales**:
- `title`: Título
- `content`: Contenido
- `author_id`: Autor
- `is_published`: Si está publicado

### 10. usuarios (actualizada)
Se agregó la columna `role`.

**Roles disponibles**:
- `usuario`: Cliente normal
- `terapeuta`: Consultor/Angelólogo
- `instructor`: Profesor de academia
- `admin`: Administrador
- `support`: Soporte técnico
- `affiliate`: Afiliado
- `center`: Centro/Empresa

---

## 🔒 Seguridad (Row Level Security)

Todas las tablas tienen **RLS habilitado** con políticas que:

- ✅ Los usuarios solo ven sus propios datos
- ✅ Los instructores solo editan sus propios cursos
- ✅ Los consultores solo ven sus propias sesiones
- ✅ Todos pueden ver contenido publicado

---

## 🔄 Triggers Automáticos

Se crearon triggers para:

- ✅ Actualizar `updated_at` automáticamente en cada UPDATE
- ✅ Mantener consistencia de datos

---

## 📝 Índices

Se crearon índices en:

- ✅ Claves foráneas (user_id, course_id, etc.)
- ✅ Campos de búsqueda (slug, category, status)
- ✅ Campos de ordenamiento (created_at, published_at)

Esto mejora el rendimiento de las consultas.

---

## 🧪 Verificar que Todo Funciona

### Opción 1: Desde Supabase Dashboard

1. Ve a "Table Editor"
2. Selecciona cualquier tabla
3. Click en "Insert row"
4. Llena los campos y guarda
5. Deberías ver el registro creado

### Opción 2: Desde el Código

```javascript
import { supabase } from './src/supabase';

// Probar insertar una lectura de cartas
const { data, error } = await supabase
  .from('card_readings')
  .insert({
    mode: '3-cards',
    cards: [
      { name: 'Miguel', archangel: 'Miguel' },
      { name: 'Gabriel', archangel: 'Gabriel' },
      { name: 'Rafael', archangel: 'Rafael' }
    ],
    environment: 'temple'
  })
  .select();

console.log('Resultado:', data, error);
```

---

## 🐛 Troubleshooting

### Error: "permission denied"

**Solución**: Asegúrate de estar usando el SQL Editor de Supabase Dashboard, que tiene permisos completos.

### Error: "relation already exists"

**Solución**: La tabla ya existe. El script usa `IF NOT EXISTS` para evitar esto, pero si ya existe, simplemente ignora el error.

### Error: "syntax error"

**Solución**: Asegúrate de copiar TODO el contenido de `schema.sql`, incluyendo el final del archivo.

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los mensajes de error en Supabase
2. Verifica que copiaste TODO el SQL
3. Intenta ejecutar el SQL en partes (por tabla)
4. Contacta al equipo de desarrollo

---

## 🎉 ¡Listo!

Una vez ejecutado el SQL, tu base de datos estará lista para:

- ✅ Guardar lecturas de cartas
- ✅ Gestionar consultas online
- ✅ Administrar cursos de academia
- ✅ Almacenar mensajes del chatbot
- ✅ Gestionar productos y pedidos
- ✅ Publicar artículos de blog

**¡La Plataforma Angélica está lista para funcionar al 100%!** ✨🙏

