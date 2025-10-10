# 🍎 Guía Completa: Apple Sign In para Plataforma Angélica

## 📋 Índice

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración en Apple Developer](#configuración-en-apple-developer)
3. [Configuración en Supabase](#configuración-en-supabase)
4. [Implementación en el Código](#implementación-en-el-código)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Consideraciones Importantes](#consideraciones-importantes)

---

## ✅ Requisitos Previos

### 1. Apple Developer Account

**Costo:** $99 USD/año

**Registro:**
1. Ve a: https://developer.apple.com/programs/enroll/
2. Inicia sesión con tu Apple ID
3. Completa el proceso de inscripción
4. Paga la membresía anual

⚠️ **Importante:** El proceso de aprobación puede tardar 24-48 horas.

### 2. Dominio Verificado

Necesitas un dominio propio para Apple Sign In:
- ✅ Producción: `plataforma-angelica.com` (o tu dominio)
- ✅ Development: `localhost` no funciona con Apple
- ✅ Alternativa: Usar dominio de Vercel temporalmente

### 3. Acceso a Supabase

- ✅ Proyecto: `kolciyzkuvcwzegsomww`
- ✅ URL: `https://kolciyzkuvcwzegsomww.supabase.co`
- ✅ Permisos de administrador

---

## 🔧 Configuración en Apple Developer

### Paso 1: Crear App ID

1. **Ir a Apple Developer Console**
   - https://developer.apple.com/account/resources/identifiers/list

2. **Crear nuevo App ID**
   - Click en el botón **"+"** (Registrar un nuevo identificador)
   - Seleccionar: **"App IDs"**
   - Click: **"Continue"**

3. **Configurar App ID**
   - **Description:** `Plataforma Angelica Web`
   - **Bundle ID:** `com.plataformaangelica.web`
   - **Explicit:** Seleccionar esta opción
   - **Capabilities:** Marcar **"Sign In with Apple"**
   - Click: **"Continue"** → **"Register"**

### Paso 2: Crear Service ID

1. **Registrar nuevo Service ID**
   - En la misma página de Identifiers
   - Click en **"+"**
   - Seleccionar: **"Services IDs"**
   - Click: **"Continue"**

2. **Configurar Service ID**
   - **Description:** `Plataforma Angelica Web Service`
   - **Identifier:** `com.plataformaangelica.web.service`
   - Marcar: **"Sign In with Apple"**
   - Click: **"Continue"** → **"Register"**

3. **Configurar Sign In with Apple**
   - Click en el Service ID recién creado
   - Click en **"Configure"** junto a "Sign In with Apple"
   
   **Primary App ID:**
   - Seleccionar: `com.plataformaangelica.web`
   
   **Web Domain:**
   - Añadir: `kolciyzkuvcwzegsomww.supabase.co`
   
   **Return URLs:**
   - Añadir: `https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback`
   
   - Click: **"Next"** → **"Done"** → **"Continue"** → **"Save"**

### Paso 3: Crear Key para Sign In with Apple

1. **Ir a Keys**
   - https://developer.apple.com/account/resources/authkeys/list

2. **Crear nueva Key**
   - Click en **"+"**
   - **Key Name:** `Plataforma Angelica Sign In Key`
   - Marcar: **"Sign In with Apple"**
   - Click: **"Configure"**

3. **Configurar Key**
   - **Primary App ID:** Seleccionar `com.plataformaangelica.web`
   - Click: **"Save"** → **"Continue"** → **"Register"**

4. **Descargar Key** ⚠️
   - Click en **"Download"**
   - **IMPORTANTE:** Solo puedes descargar esta key UNA VEZ
   - Guarda el archivo `.p8` en un lugar seguro
   - Anota el **Key ID** (aparece en la página)

### Paso 4: Obtener Team ID

1. **Ir a Membership**
   - https://developer.apple.com/account/#/membership/

2. **Copiar Team ID**
   - Aparece como **"Team ID"** en la página
   - Ejemplo: `A1B2C3D4E5`
   - Guárdalo, lo necesitarás para Supabase

---

## 🔐 Configuración en Supabase

### Paso 1: Habilitar Apple Provider

1. **Ir a Authentication**
   - https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/providers

2. **Buscar Apple**
   - Scroll hasta encontrar "Apple"
   - Click en **"Enable"** o en el toggle

### Paso 2: Configurar Credenciales

Necesitarás los siguientes datos de Apple Developer:

1. **Service ID (Client ID)**
   - Valor: `com.plataformaangelica.web.service`
   - Pegar en: **"Client ID"**

2. **Team ID**
   - Valor: El Team ID que copiaste (ej: `A1B2C3D4E5`)
   - Pegar en: **"Team ID"**

3. **Key ID**
   - Valor: El Key ID de la key que creaste
   - Pegar en: **"Key ID"**

4. **Private Key**
   - Abrir el archivo `.p8` que descargaste
   - Copiar TODO el contenido (incluyendo las líneas BEGIN y END)
   - Ejemplo:
   ```
   -----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
   ...
   -----END PRIVATE KEY-----
   ```
   - Pegar en: **"Secret Key"** o **"Private Key"**

### Paso 3: Configurar Redirect URL

En Supabase, verifica que la Redirect URL sea:
```
https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback
```

Esta debe coincidir EXACTAMENTE con la que configuraste en Apple Developer.

### Paso 4: Guardar Configuración

- Click en **"Save"**
- Verifica que el toggle de Apple esté en **"Enabled"**

---

## 💻 Implementación en el Código

### Opción 1: Usar el Componente Nuevo (Recomendado)

Ya está creado: `SocialLoginWithApple.jsx`

**En LoginEnhanced.jsx:**

```jsx
// Cambiar el import
import SocialLoginWithApple from './SocialLoginWithApple';

// Cambiar el componente
<SocialLoginWithApple onError={setError} />
```

### Opción 2: Añadir Apple al Componente Actual

Si prefieres modificar `SocialLogin.jsx`:

```jsx
import { Chrome, Facebook, Apple, Loader2 } from 'lucide-react';

const [loading, setLoading] = useState({ 
  google: false, 
  facebook: false, 
  apple: false 
});

// Añadir botón de Apple
<button
  onClick={() => handleSocialLogin('apple')}
  disabled={loading.google || loading.facebook || loading.apple}
  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-black border-2 border-black rounded-xl hover:bg-gray-900 hover:shadow-md transition-all duration-300 font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed group"
  aria-label="Iniciar sesión con Apple"
>
  {loading.apple ? (
    <Loader2 size={16} className="animate-spin text-white" />
  ) : (
    <Apple size={16} className="text-white group-hover:scale-110 transition-transform" fill="currentColor" />
  )}
  <span className="text-xs">
    {loading.apple ? 'Conectando...' : 'Continuar con Apple'}
  </span>
</button>
```

### Actualizar handleSocialLogin

```jsx
const handleSocialLogin = async (provider) => {
  setLoading(prev => ({ ...prev, [provider]: true }));
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider, // 'google', 'facebook', o 'apple'
      options: {
        redirectTo: `${window.location.origin}/dashboard-redirect`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      const providerNames = {
        google: 'Google',
        facebook: 'Facebook',
        apple: 'Apple'
      };
      onError(`Error al iniciar sesión con ${providerNames[provider]}`);
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  } catch (err) {
    // Error handling
  }
};
```

---

## 🧪 Testing

### Paso 1: Testing en Development

**Problema:** Apple no permite `localhost` directamente.

**Soluciones:**

1. **Usar dominio de Vercel:**
   - Deploy a Vercel
   - Usar URL de Vercel para testing
   - Ejemplo: `https://plataforma-angelica-dev.vercel.app`

2. **Usar ngrok (alternativa):**
   ```bash
   npm run dev
   ngrok http 5173
   ```
   - Usar la URL de ngrok en Apple Developer
   - Añadir a Return URLs

### Paso 2: Flujo de Testing

1. **Abrir la página de login**
   - https://plataforma-angelica-dev.vercel.app/login

2. **Click en "Continuar con Apple"**
   - Debería abrir popup de Apple
   - Pedir credenciales de Apple ID

3. **Autorizar la app**
   - Seleccionar qué información compartir
   - Opción de ocultar email (Hide My Email)

4. **Verificar redirección**
   - Debería redirigir a `/dashboard-redirect`
   - Luego al dashboard principal

### Paso 3: Verificar en Supabase

1. **Ir a Authentication → Users**
   - https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/users

2. **Verificar nuevo usuario**
   - Provider: `apple`
   - Email: El email de Apple (puede ser privado)
   - Metadata: Información de Apple

---

## 🐛 Troubleshooting

### Error: "invalid_client"

**Causa:** Service ID incorrecto

**Solución:**
- Verificar que el Service ID en Supabase sea exactamente: `com.plataformaangelica.web.service`
- Sin espacios, sin mayúsculas incorrectas

### Error: "invalid_request - redirect_uri mismatch"

**Causa:** Return URL no coincide

**Solución:**
1. En Apple Developer, verificar Return URLs:
   - Debe ser: `https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback`
2. En Supabase, verificar Redirect URL
3. Deben ser EXACTAMENTE iguales

### Error: "invalid_key"

**Causa:** Private Key incorrecta

**Solución:**
- Verificar que copiaste TODO el contenido del archivo `.p8`
- Incluyendo las líneas `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`
- Sin espacios extra al inicio o final

### Error: "unauthorized_client"

**Causa:** Team ID o Key ID incorrectos

**Solución:**
- Verificar Team ID en Apple Developer → Membership
- Verificar Key ID en Apple Developer → Keys
- Ambos deben coincidir exactamente con Supabase

### Error: "Domain not verified"

**Causa:** Dominio no verificado en Apple

**Solución:**
1. En Apple Developer → Service ID → Configure
2. Verificar que el dominio esté listado
3. Puede tardar unos minutos en propagarse

### Usuario no puede iniciar sesión

**Causa:** App en modo sandbox

**Solución:**
- En Apple Developer, verificar que la app esté en producción
- Añadir testers en "Sandbox Testers" si está en desarrollo

---

## ⚠️ Consideraciones Importantes

### 1. Hide My Email

Apple permite a los usuarios ocultar su email real:
- Apple genera un email relay: `xyz123@privaterelay.appleid.com`
- Los emails enviados a este relay se reenvían al usuario
- Debes soportar estos emails en tu sistema

**Implementación:**
```javascript
// En tu backend, acepta emails de Apple relay
const isAppleRelayEmail = email.endsWith('@privaterelay.appleid.com');
if (isAppleRelayEmail) {
  // Tratar como email válido
  // Apple se encarga del relay
}
```

### 2. Información del Usuario

Apple proporciona información limitada:
- **Primera vez:** Nombre completo, email
- **Siguientes veces:** Solo ID de usuario

**Solución:** Guardar la información en la primera autenticación.

```javascript
// En DashboardRedirect o callback
const { data: { user } } = await supabase.auth.getUser();

if (user.app_metadata.provider === 'apple') {
  // Primera vez: user.user_metadata tiene nombre
  // Guardar en profiles si existe
  if (user.user_metadata.full_name) {
    await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: user.user_metadata.full_name,
        email: user.email,
      });
  }
}
```

### 3. Renovación de Key

Las keys de Apple no expiran, pero Apple recomienda:
- Rotar keys cada 6-12 meses
- Guardar backup de keys antiguas
- Tener un proceso de rotación documentado

### 4. Costos

- **Apple Developer:** $99/año (obligatorio)
- **Supabase:** Gratis hasta cierto límite
- **Total:** $99/año mínimo

### 5. Compliance

Apple requiere que:
- Si ofreces otros métodos de login social, DEBES ofrecer Apple
- El botón de Apple debe ser prominente
- No puedes requerir más información que la que Apple proporciona

### 6. Testing en Producción

- Apple Sign In solo funciona en HTTPS
- No funciona en `localhost` sin workarounds
- Usa Vercel o similar para testing

---

## 📊 Comparación de Providers

| Característica | Google | Facebook | Apple |
|----------------|--------|----------|-------|
| **Costo** | Gratis | Gratis | $99/año |
| **Setup** | Fácil | Fácil | Complejo |
| **Información** | Completa | Completa | Limitada |
| **Email oculto** | No | No | Sí |
| **Localhost** | Sí | Sí | No |
| **Requerido iOS** | No | No | Sí (si tienes otros) |
| **Popularidad** | Alta | Alta | Media-Alta |

---

## 🎯 Checklist de Implementación

### Antes de Empezar
- [ ] Apple Developer Account activo ($99/año)
- [ ] Dominio verificado o URL de Vercel
- [ ] Acceso a Supabase como admin

### En Apple Developer
- [ ] App ID creado con Sign In with Apple
- [ ] Service ID creado y configurado
- [ ] Web Domain añadido
- [ ] Return URL configurada
- [ ] Key creada y descargada (.p8)
- [ ] Team ID anotado
- [ ] Key ID anotado

### En Supabase
- [ ] Apple provider habilitado
- [ ] Service ID (Client ID) configurado
- [ ] Team ID configurado
- [ ] Key ID configurado
- [ ] Private Key (.p8) configurado
- [ ] Redirect URL verificada
- [ ] Configuración guardada

### En el Código
- [ ] SocialLoginWithApple.jsx implementado
- [ ] LoginEnhanced.jsx actualizado
- [ ] Manejo de Apple relay emails
- [ ] Guardar información de primera autenticación
- [ ] Testing en Vercel/producción

### Testing
- [ ] Login con Apple funciona
- [ ] Redirección correcta
- [ ] Usuario creado en Supabase
- [ ] Información guardada en profiles
- [ ] Hide My Email funciona
- [ ] Testing en diferentes dispositivos

---

## 📚 Recursos Adicionales

### Documentación Oficial
- **Apple Sign In:** https://developer.apple.com/sign-in-with-apple/
- **Supabase Apple OAuth:** https://supabase.com/docs/guides/auth/social-login/auth-apple
- **Apple Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple

### Herramientas
- **Apple Developer Console:** https://developer.apple.com/account/
- **JWT Debugger:** https://jwt.io/ (para debug de tokens)
- **Supabase Dashboard:** https://supabase.com/dashboard/

### Comunidad
- **Supabase Discord:** https://discord.supabase.com/
- **Stack Overflow:** Tag `sign-in-with-apple`

---

## 🚀 Implementación Rápida (Resumen)

### 1. Apple Developer (30 min)
```
1. Crear App ID
2. Crear Service ID
3. Configurar dominio y Return URL
4. Crear Key y descargar .p8
5. Anotar Team ID y Key ID
```

### 2. Supabase (5 min)
```
1. Habilitar Apple provider
2. Pegar Service ID, Team ID, Key ID
3. Pegar contenido de .p8
4. Guardar
```

### 3. Código (2 min)
```javascript
// En LoginEnhanced.jsx
import SocialLoginWithApple from './SocialLoginWithApple';

<SocialLoginWithApple onError={setError} />
```

### 4. Deploy y Test (5 min)
```bash
git add .
git commit -m "Add Apple Sign In"
git push
# Esperar deploy en Vercel
# Probar en la URL de Vercel
```

---

## ✅ Resultado Final

Una vez completado, tendrás:

- ✅ **3 métodos de login social:** Google, Facebook, Apple
- ✅ **Experiencia premium:** Botones bien diseñados
- ✅ **Compliance con Apple:** Requerimiento cumplido
- ✅ **Mayor conversión:** Más opciones = más usuarios
- ✅ **Hide My Email:** Privacidad para usuarios

---

**Versión:** 1.0  
**Última actualización:** 2025-10-10  
**Autor:** Manus AI para Plataforma Angélica  
**Estado:** ✅ Listo para implementar

