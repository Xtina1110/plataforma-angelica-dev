# 📧 Email Templates - Plataforma Angélica

## Templates Creados

Este directorio contiene los templates de email personalizados para Supabase Auth.

### 1. **confirm-signup.html** - Verificación de Email
- **Uso:** Cuando un usuario se registra
- **Propósito:** Verificar dirección de email
- **Expira:** 24 horas

### 2. **reset-password.html** - Recuperar Contraseña
- **Uso:** Cuando un usuario olvida su contraseña
- **Propósito:** Restablecer contraseña de forma segura
- **Expira:** 1 hora

### 3. **magic-link.html** - Acceso Rápido
- **Uso:** Login sin contraseña
- **Propósito:** Acceso rápido y seguro
- **Expira:** 15 minutos

---

## 🚀 Cómo Implementar en Supabase

### Paso 1: Acceder a Email Templates

1. Ve a tu proyecto en Supabase:
   ```
   https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/auth/templates
   ```

2. Verás 4 templates disponibles:
   - Confirm signup
   - Invite user
   - Magic Link
   - Reset Password

### Paso 2: Copiar y Pegar Templates

Para cada template:

1. **Click en el template** que quieres editar
2. **Borra el contenido** actual
3. **Copia el contenido** del archivo HTML correspondiente
4. **Pega** en el editor de Supabase
5. **Click en "Save"**

### Paso 3: Verificar Variables

Asegúrate de que estas variables estén presentes:

- `{{ .ConfirmationURL }}` - URL de confirmación/acción
- `{{ .Token }}` - Token de verificación
- `{{ .Email }}` - Email del destinatario
- `{{ .SiteURL }}` - URL del sitio

---

## 🎨 Características de los Templates

### Diseño
- ✅ Responsive (mobile-first)
- ✅ Colores corporativos (morado/violeta)
- ✅ Iconos emoji para mejor visualización
- ✅ Gradientes angelicales
- ✅ Botones CTA destacados

### Branding
- ✅ Logo 🕊️ (paloma angelical)
- ✅ Nombre "Plataforma Angélica"
- ✅ Tagline "Tu camino espiritual"
- ✅ Footer con copyright
- ✅ Links a web y soporte

### Seguridad
- ✅ Advertencias de expiración
- ✅ Consejos de seguridad
- ✅ Información de contacto
- ✅ Disclaimers claros

### UX
- ✅ Mensajes claros y amigables
- ✅ Instrucciones paso a paso
- ✅ Fallback con URL copiable
- ✅ Información de ayuda

---

## 📝 Personalización Adicional

### Cambiar Colores

Busca estos valores en los templates y cámbialos:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Color de acento */
color: #667eea;

/* Botones */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Cambiar Logo

Reemplaza el emoji 🕊️ con:
- Una imagen: `<img src="URL_LOGO" alt="Logo" style="width: 80px;">`
- Otro emoji: 👼, ✨, 🌟, 💜, etc.

### Añadir Redes Sociales

En la sección `.social-links`:

```html
<div class="social-links">
    <a href="https://facebook.com/plataforma-angelica">Facebook</a>
    <a href="https://instagram.com/plataforma-angelica">Instagram</a>
    <a href="https://twitter.com/plataforma-angelica">Twitter</a>
</div>
```

---

## 🧪 Testing

### Test en Supabase

1. Ve a Authentication → Users
2. Crea un usuario de prueba
3. Verifica que recibe el email
4. Comprueba que el diseño se ve bien en:
   - Gmail
   - Outlook
   - Apple Mail
   - Mobile

### Test Manual

Puedes usar herramientas como:
- [Litmus](https://litmus.com) - Testing de emails
- [Email on Acid](https://www.emailonacid.com) - Testing cross-client
- [Mailtrap](https://mailtrap.io) - Inbox de prueba

---

## 📊 Métricas Recomendadas

Trackea estas métricas en tus emails:

- **Tasa de apertura** (Open rate)
- **Tasa de click** (CTR)
- **Tasa de conversión** (Verification rate)
- **Tiempo hasta verificación**
- **Emails rebotados** (Bounce rate)

---

## 🔧 Troubleshooting

### Los emails no llegan

1. Verifica la configuración SMTP en Supabase
2. Revisa la carpeta de spam
3. Verifica que el dominio esté verificado
4. Comprueba los logs en Supabase

### El diseño no se ve bien

1. Algunos clientes de email no soportan CSS avanzado
2. Usa inline styles cuando sea posible
3. Evita JavaScript
4. Usa tablas para layout (si es necesario)

### Las variables no funcionan

1. Verifica la sintaxis: `{{ .Variable }}`
2. Asegúrate de usar las variables correctas
3. Revisa la documentación de Supabase

---

## 📚 Recursos

### Documentación
- [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)

### Herramientas
- [Can I Email](https://www.caniemail.com) - Compatibilidad CSS
- [HTML Email Check](https://www.htmlemailcheck.com) - Validador
- [Really Good Emails](https://reallygoodemails.com) - Inspiración

---

## ✅ Checklist de Implementación

```
[ ] 1. Copiar confirm-signup.html a Supabase
[ ] 2. Copiar reset-password.html a Supabase
[ ] 3. Copiar magic-link.html a Supabase
[ ] 4. Personalizar colores (opcional)
[ ] 5. Personalizar logo (opcional)
[ ] 6. Añadir redes sociales (opcional)
[ ] 7. Guardar todos los cambios
[ ] 8. Hacer test con usuario de prueba
[ ] 9. Verificar en diferentes clientes
[ ] 10. Activar en producción
```

---

## 🎉 Resultado

Con estos templates, tus usuarios recibirán emails:

- ✅ Profesionales y bonitos
- ✅ Con branding consistente
- ✅ Fáciles de entender
- ✅ Seguros y confiables
- ✅ Optimizados para conversión

---

**Creado con 💜 para Plataforma Angélica**  
**Última actualización:** $(date)

