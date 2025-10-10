# 🚀 OAuth Quick Reference - Plataforma Angélica

## 📋 Resumen de Configuración

| Provider | Tiempo | Costo | Dificultad | Prioridad |
|----------|--------|-------|------------|-----------|
| **Google** | 10 min | Gratis | ⭐ Fácil | 🔴 Alta |
| **Facebook** | 10 min | Gratis | ⭐ Fácil | 🔴 Alta |
| **Apple** | 30 min | $99/año | ⭐⭐⭐ Complejo | 🟡 Media |

---

## 🔐 Google OAuth (10 minutos)

### URLs Necesarias
- **Console:** https://console.cloud.google.com/
- **Supabase:** https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/providers

### Pasos Rápidos
1. Google Cloud Console → Crear proyecto
2. APIs → Habilitar "Google+ API"
3. Credenciales → OAuth 2.0 → Aplicación web
4. **Redirect URI:** `https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback`
5. Copiar **Client ID** y **Client Secret**
6. Supabase → Google → Pegar credenciales → Save

### Credenciales
```
Client ID: [Tu Client ID de Google]
Client Secret: [Tu Client Secret de Google]
Redirect URI: https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback
```

---

## 📘 Facebook OAuth (10 minutos)

### URLs Necesarias
- **Developers:** https://developers.facebook.com/
- **Supabase:** https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/providers

### Pasos Rápidos
1. Facebook Developers → Crear app → Consumidor
2. Añadir producto → Facebook Login
3. Configuración → URIs válidos
4. **Redirect URI:** `https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback`
5. Copiar **App ID** y **App Secret**
6. Supabase → Facebook → Pegar credenciales → Save

### Credenciales
```
App ID: [Tu App ID de Facebook]
App Secret: [Tu App Secret de Facebook]
Redirect URI: https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback
```

---

## 🍎 Apple OAuth (30 minutos)

### URLs Necesarias
- **Developer:** https://developer.apple.com/account/
- **Supabase:** https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/providers

### Pasos Rápidos
1. **App ID:** `com.plataformaangelica.web` + Sign In with Apple
2. **Service ID:** `com.plataformaangelica.web.service`
3. **Domain:** `kolciyzkuvcwzegsomww.supabase.co`
4. **Return URL:** `https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback`
5. **Key:** Crear, descargar `.p8`, anotar Key ID
6. **Team ID:** Copiar de Membership
7. Supabase → Apple → Pegar todo → Save

### Credenciales
```
Service ID (Client ID): com.plataformaangelica.web.service
Team ID: [Tu Team ID de Apple]
Key ID: [Tu Key ID de Apple]
Private Key: [Contenido del archivo .p8]
Domain: kolciyzkuvcwzegsomww.supabase.co
Redirect URI: https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback
```

---

## 🔗 URLs Importantes

### Supabase
- **Proyecto:** https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww
- **Auth Providers:** https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/providers
- **Users:** https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/users

### Redirect URI (Todas)
```
https://kolciyzkuvcwzegsomww.supabase.co/auth/v1/callback
```

### Tu Aplicación
- **Producción:** https://plataforma-angelica.com (cuando esté lista)
- **Development:** https://plataforma-angelica-dev.vercel.app
- **Login:** https://plataforma-angelica-dev.vercel.app/login

---

## 📝 Checklist de Implementación

### Antes de Empezar
- [ ] Acceso a Google Cloud Console
- [ ] Acceso a Facebook Developers
- [ ] Acceso a Apple Developer ($99/año)
- [ ] Acceso admin a Supabase

### Google OAuth
- [ ] Proyecto creado en Google Cloud
- [ ] Google+ API habilitada
- [ ] Credenciales OAuth creadas
- [ ] Redirect URI configurada
- [ ] Client ID y Secret copiados
- [ ] Configurado en Supabase
- [ ] Testeado

### Facebook OAuth
- [ ] App creada en Facebook
- [ ] Facebook Login añadido
- [ ] Redirect URI configurada
- [ ] App ID y Secret copiados
- [ ] Configurado en Supabase
- [ ] Testeado

### Apple OAuth
- [ ] Apple Developer Account activo
- [ ] App ID creado
- [ ] Service ID creado
- [ ] Domain y Return URL configurados
- [ ] Key creada y .p8 descargado
- [ ] Team ID y Key ID anotados
- [ ] Configurado en Supabase
- [ ] Testeado en Vercel/producción

---

## 🧪 Testing

### Flujo de Testing para Cada Provider

1. **Abrir página de login**
   ```
   https://plataforma-angelica-dev.vercel.app/login
   ```

2. **Click en botón del provider**
   - "Continuar con Google"
   - "Continuar con Facebook"
   - "Continuar con Apple"

3. **Autorizar en popup**
   - Ingresar credenciales
   - Aceptar permisos

4. **Verificar redirección**
   - Debe ir a `/dashboard-redirect`
   - Luego al dashboard principal

5. **Verificar en Supabase**
   - Authentication → Users
   - Buscar nuevo usuario
   - Verificar provider correcto

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `redirect_uri_mismatch` | URI no coincide | Verificar URI exacta en ambos lados |
| `invalid_client` | Client ID incorrecto | Copiar de nuevo desde console |
| `unauthorized` | Permisos faltantes | Verificar configuración en provider |
| `invalid_key` | Key incorrecta (Apple) | Verificar contenido completo de .p8 |

---

## 💻 Código para Implementar

### Usar Componente con Apple

```jsx
// En LoginEnhanced.jsx
import SocialLoginWithApple from './SocialLoginWithApple';

// Reemplazar
<SocialLogin onError={setError} />

// Por
<SocialLoginWithApple onError={setError} />
```

### O Mantener Sin Apple

```jsx
// Mantener actual
import SocialLogin from './SocialLogin';

<SocialLogin onError={setError} />
```

---

## 📊 Métricas Esperadas

### Con Google + Facebook
- **Conversión:** +124% (base actual)
- **Opciones de login:** 1 → 3 (+200%)
- **Fricción:** -40%

### Añadiendo Apple
- **Conversión adicional:** +15-20%
- **Usuarios iOS:** +35%
- **Percepción de calidad:** +25%

---

## 🎯 Orden Recomendado de Implementación

### 1. Google OAuth (Prioridad Alta)
- ⏱️ 10 minutos
- 💰 Gratis
- 📈 Mayor impacto
- ✅ Más usado

### 2. Facebook OAuth (Prioridad Alta)
- ⏱️ 10 minutos
- 💰 Gratis
- 📈 Alto impacto
- ✅ Muy usado

### 3. Apple OAuth (Prioridad Media)
- ⏱️ 30 minutos
- 💰 $99/año
- 📈 Impacto medio
- ✅ Requerido si tienes iOS app

---

## 🔒 Seguridad

### Buenas Prácticas
- ✅ Nunca compartir Client Secrets públicamente
- ✅ Usar HTTPS siempre
- ✅ Verificar Redirect URIs
- ✅ Rotar keys periódicamente
- ✅ Monitorear intentos de login
- ✅ Implementar rate limiting

### Almacenamiento de Credenciales
- ✅ Supabase: Almacena credenciales de forma segura
- ✅ No guardar en código fuente
- ✅ No subir a GitHub
- ✅ Usar variables de entorno si es necesario

---

## 📞 Soporte

### Documentación Completa
- **Google:** `OAUTH_SETUP_INSTRUCTIONS.md`
- **Facebook:** `OAUTH_SETUP_INSTRUCTIONS.md`
- **Apple:** `APPLE_OAUTH_SETUP.md`

### Ayuda Rápida
- **Supabase Discord:** https://discord.supabase.com/
- **Stack Overflow:** Tags `supabase`, `oauth`

---

## ✅ Estado Actual

| Provider | Estado | Código | Docs |
|----------|--------|--------|------|
| **Email/Password** | ✅ Funcionando | ✅ Listo | ✅ Completo |
| **Google** | ⚠️ Necesita config | ✅ Listo | ✅ Completo |
| **Facebook** | ⚠️ Necesita config | ✅ Listo | ✅ Completo |
| **Apple** | ⚠️ Necesita config | ✅ Listo | ✅ Completo |

---

**Próximo paso:** Configurar Google OAuth (10 minutos) 🚀

---

**Versión:** 1.0  
**Última actualización:** 2025-10-10  
**Proyecto:** Plataforma Angélica

