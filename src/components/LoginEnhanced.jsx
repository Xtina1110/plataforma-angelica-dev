import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';
import ThemeToggle from './ThemeToggle';
import SocialLogin from './SocialLogin';
import LazyImage from './LazyImage';
import AngelicParticles from './AngelicParticles';
import { preloadImages, debounce, getOptimizedImageUrl } from '../utils/performanceUtils';
import analytics from '../utils/analytics';
import angelSinFondo from '../assets/AngelEleganteSinFondo.png';
import fondoAngelico from '../assets/FondoAngelicoDashboard.png';

// Imagen temática para login con optimización
const loginHeaderImage = getOptimizedImageUrl(
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=400&fit=crop',
  { width: 800, quality: 85, format: 'webp' }
);

const LoginEnhanced = () => {
  const navigate = useNavigate();
  const { getCurrentTranslation } = useLanguage();
  const { isDark } = useTheme();
  const translation = getCurrentTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [showParticles, setShowParticles] = useState(true);

  // Track page view
  useEffect(() => {
    analytics.pageView('/login', 'Login Page');
  }, []);

  // Precargar imágenes críticas al montar
  useEffect(() => {
    const criticalImages = [angelSinFondo, fondoAngelico];
    preloadImages(criticalImages)
      .then(() => setImagesPreloaded(true))
      .catch(err => console.error('Error preloading images:', err));
  }, []);

  // Validación de email en tiempo real
  const validateEmail = useMemo(() => {
    return (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
  }, []);

  // Calcular fortaleza de contraseña (memoizado)
  const calculatePasswordStrength = useMemo(() => {
    return (pwd) => {
      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (pwd.length >= 12) strength++;
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
      if (/\d/.test(pwd)) strength++;
      if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
      return Math.min(strength, 4);
    };
  }, []);

  const getPasswordStrengthLabel = (strength) => {
    const labels = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    return labels[strength] || '';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];
    return colors[strength] || 'bg-gray-300';
  };

  // Debounced email validation
  const debouncedEmailValidation = useMemo(
    () => debounce((email) => {
      setEmailValid(validateEmail(email));
      if (email) {
        analytics.trackFormInteraction('login', 'email_validated', 'email');
      }
    }, 300),
    [validateEmail]
  );

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    debouncedEmailValidation(newEmail);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = calculatePasswordStrength(newPassword);
    setPasswordStrength(strength);
    
    if (newPassword) {
      analytics.trackPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    analytics.trackFormInteraction('login', 'submit');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translation.loginPage.invalidCredentials);
      setLoading(false);
      analytics.trackLogin('email', false);
      analytics.trackError('login_failed', error.message, { method: 'email' });
    } else {
      // Animación de éxito
      setLoginSuccess(true);
      analytics.trackLogin('email', true);
      analytics.trackConversion('login', 1);
      
      // Si "Recordarme" está activado, guardar email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Esperar animación antes de navegar
      setTimeout(() => {
        navigate('/dashboard-redirect');
      }, 1500);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor ingresa tu email primero');
      return;
    }

    setLoading(true);
    analytics.track('password_reset_requested', { email });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError('Error al enviar email de recuperación');
      analytics.trackError('password_reset_failed', error.message);
    } else {
      setError('Email de recuperación enviado');
      analytics.track('password_reset_sent', { email });
    }
    setLoading(false);
    setShowForgotPassword(false);
  };

  // Cargar email recordado al montar el componente
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setEmailValid(validateEmail(rememberedEmail));
      setRememberMe(true);
    }

    // Check user preference for particles
    const particlesPref = localStorage.getItem('show_particles');
    if (particlesPref !== null) {
      setShowParticles(particlesPref === 'true');
    }
  }, [validateEmail]);

  return (
    <>
      {/* Partículas angelicales animadas */}
      {showParticles && (
        <AngelicParticles 
          count={30} 
          color={isDark ? 'lavender' : 'gold'} 
        />
      )}

      {/* Efecto de luz divina desde arriba */}
      <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial ${
        isDark 
          ? 'from-purple-500/20 via-blue-500/10 to-transparent' 
          : 'from-yellow-200/20 via-purple-200/10 to-transparent'
      } rounded-full blur-3xl pointer-events-none z-0`} />

      {/* Botones de idioma, audio y tema */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3">
        <ThemeToggle variant="loading" />
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>

      {/* Pantalla de Acceso Seguro con fondo del dashboard */}
      {loginSuccess && imagesPreloaded && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] animate-fade-in">
          {/* Fondo con imagen angélica del dashboard */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${fondoAngelico})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Capas de gradiente morado como en el dashboard */}
          <div className="absolute inset-0 bg-purple-600/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-purple-600/25 to-violet-500/20" />
          
          {/* Contenido centrado */}
          <div className="relative z-10 text-center animate-scale-in max-w-2xl mx-auto px-6">
            {/* Ángel de la guarda flotando */}
            <div className="mb-8">
              <LazyImage 
                src={angelSinFondo}
                alt="Ángel de la guarda"
                className="w-48 h-48 mx-auto object-contain animate-float drop-shadow-2xl"
                priority={true}
              />
            </div>
            
            {/* Mensaje angelical */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield size={48} className="text-yellow-300 animate-pulse" />
                <h2 className="text-5xl font-bold text-white drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Acceso Seguro
                </h2>
                <Shield size={48} className="text-yellow-300 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles size={24} className="text-yellow-200 animate-pulse" />
                <p className="text-2xl text-yellow-100 font-semibold">
                  Los ángeles te dan la bienvenida
                </p>
                <Sparkles size={24} className="text-yellow-200 animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
              
              <p className="text-lg text-white/90 italic">
                Tu conexión espiritual está protegida ✨
              </p>
            </div>
          </div>
        </div>
      )}

      <AuthPageLayout
        title={translation.loginPage.title}
        headerImage={loginHeaderImage}
        icon={LogIn}
      >
      {/* Contenido de login con espaciado optimizado */}
      <div className="max-w-md mx-auto relative">
        {/* Header con tipografía mejorada en dorado */}
        <div className="text-center mb-3 animate-fade-in">
          <h2 className={`text-base font-serif ${
            isDark ? 'text-yellow-400' : 'text-yellow-600'
          }`} style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
            {translation.loginPage.subtitle}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2" role="form" aria-label="Formulario de inicio de sesión">
          {/* Email con validación visual mejorada */}
          <div className="relative group">
            <label htmlFor="email" className={`block text-xs font-semibold mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Correo Electrónico *
            </label>
            <div className={`absolute left-3 top-[30px] transform transition-colors duration-300 ${
              isDark ? 'text-gray-400 group-focus-within:text-purple-400' : 'text-gray-400 group-focus-within:text-purple-500'
            }`}>
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder={translation.loginPage.email}
              value={email}
              onChange={handleEmailChange}
              onFocus={() => analytics.trackFormInteraction('login', 'focus', 'email')}
              aria-label="Correo electrónico"
              aria-required="true"
              aria-invalid={email && !emailValid}
              aria-describedby={email && !emailValid ? "email-error" : undefined}
              className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl focus:ring-2 text-sm transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/90 border-gray-600 focus:ring-purple-400 focus:border-purple-400 text-white placeholder-gray-400'
                  : 'bg-white/90 border-gray-200 focus:ring-purple-400 focus:border-yellow-400 text-gray-900 placeholder-gray-500'
              } backdrop-blur-sm hover:shadow-md`}
              required
              autoComplete="email"
            />
            {email && (
              <div className="absolute right-3 top-[30px] transform" role="status" aria-live="polite">
                {emailValid ? (
                  <CheckCircle size={20} className="text-green-500 animate-scale-in" aria-label="Email válido" />
                ) : (
                  <AlertCircle size={20} className="text-red-400 animate-scale-in" aria-label="Email inválido" />
                )}
              </div>
            )}
            {email && !emailValid && (
              <p id="email-error" className="text-red-500 text-xs mt-1 ml-1" role="alert">
                Por favor ingresa un email válido
              </p>
            )}
          </div>

          {/* Password con indicador de fortaleza - altura fija para evitar saltos */}
          <div className="relative group">
            <label htmlFor="password" className={`block text-xs font-semibold mb-1 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contraseña *
            </label>
            <div className={`absolute left-3 top-[30px] transform transition-colors duration-300 ${
              isDark ? 'text-gray-400 group-focus-within:text-purple-400' : 'text-gray-400 group-focus-within:text-purple-500'
            }`}>
              <Lock size={20} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={translation.loginPage.password}
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => analytics.trackFormInteraction('login', 'focus', 'password')}
              aria-label="Contraseña"
              aria-required="true"
              aria-describedby="password-strength"
              className={`w-full pl-10 pr-10 py-2 border-2 rounded-xl focus:ring-2 text-base transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800/90 border-gray-600 focus:ring-purple-400 focus:border-purple-400 text-white'
                  : 'bg-white/90 border-gray-200 focus:ring-purple-400 focus:border-yellow-400 text-gray-900'
              } backdrop-blur-sm hover:shadow-md [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden`}
              style={{
                WebkitTextSecurity: showPassword ? 'none' : 'disc'
              }}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className={`absolute right-3 top-[30px] transform transition-all duration-300 hover:scale-110 ${
                isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'
              }`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            
            {/* Indicador de fortaleza de contraseña con altura fija */}
            <div id="password-strength" className="mt-1.5 h-10" role="status" aria-live="polite">
              {password && (
                <>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold w-20 text-right ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {getPasswordStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  {passwordStrength < 3 && (
                    <p className={`text-xs ml-1 leading-tight ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Usa mayúsculas, números y símbolos
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Remember me mejorado con mejor accesibilidad */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center cursor-pointer group" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                aria-label="Recordar mi sesión"
                className={`w-4 h-4 rounded focus:ring-2 cursor-pointer ${
                  isDark 
                    ? 'text-purple-500 bg-gray-700 border-gray-600 focus:ring-purple-500'
                    : 'text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500'
                }`}
              />
              <span className={`ml-2.5 font-medium text-sm transition-colors ${
                isDark 
                  ? 'text-gray-300 group-hover:text-purple-400'
                  : 'text-gray-700 group-hover:text-purple-600'
              }`}>
                Recordarme
              </span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className={`font-medium text-sm hover:underline transition-all focus:outline-2 ${
                isDark 
                  ? 'text-purple-400 hover:text-purple-300 focus:outline-purple-400'
                  : 'text-purple-600 hover:text-purple-700 focus:outline-purple-500'
              }`}
              disabled={!email}
              aria-label="¿Olvidaste tu contraseña?"
            >
              {translation.loginPage.forgotPassword}
            </button>
          </div>

          {/* Error message mejorado con iconos y mejor contraste */}
          {error && (
            <div 
              className={`p-3 rounded-xl text-center font-semibold flex items-center justify-center gap-2 animate-shake text-sm ${
                error.includes('enviado') 
                  ? isDark 
                    ? 'bg-green-900/50 text-green-200 border-2 border-green-500'
                    : 'bg-green-50 text-green-800 border-2 border-green-400'
                  : isDark
                    ? 'bg-red-900/50 text-red-200 border-2 border-red-500'
                    : 'bg-red-50 text-red-800 border-2 border-red-400'
              }`}
              role="alert"
              aria-live="assertive"
            >
              {error.includes('enviado') ? (
                <CheckCircle size={20} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0" />
              )}
              <span>{error}</span>
            </div>
          )}

          {/* Submit button premium con efecto de brillo y escudo */}
          <button 
            type="submit" 
            aria-label="Iniciar sesión de forma segura"
            className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base overflow-hidden group"
            disabled={loading}
          >
            {/* Efecto de brillo deslizante */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            
            {loading ? (
              <div className="flex items-center justify-center gap-3 relative z-10">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{translation.loginPage.loading}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Shield size={20} className="animate-pulse" /> 
                <span>{translation.loginPage.loginButton}</span>
                <LogIn size={20} />
              </div>
            )}
          </button>
        </form>

        {/* Social Login */}
        <SocialLogin onError={setError} />

        {/* Footer con link de registro */}
        <div className="text-center mt-3">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {translation.loginPage.noAccount}{' '}
            <button 
              onClick={() => navigate('/registro')}
              className={`font-semibold underline ${
                isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
              }`}
              aria-label="Ir a la página de registro"
            >
              {translation.loginPage.registerHere}
            </button>
          </p>
        </div>

        {/* Modal de recuperación mejorado con mejor accesibilidad */}
        {showForgotPassword && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForgotPassword(false);
            }}
          >
            <div className={`p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border-2 animate-scale-in ${
              isDark 
                ? 'bg-gray-800 border-purple-500/70'
                : 'bg-white border-yellow-400/70'
            }`}>
              <h3 id="forgot-password-title" className={`text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                <Lock size={24} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                Recuperar Contraseña
              </h3>
              <p className={`mb-6 text-center leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Se enviará un enlace de recuperación a: <br />
                <strong className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>{email}</strong>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className={`flex-1 px-4 py-3 border-2 rounded-xl transition-all font-medium focus:outline-2 ${
                    isDark 
                      ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500 focus:outline-gray-500'
                      : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-gray-500'
                  }`}
                  aria-label="Cancelar recuperación de contraseña"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleForgotPassword}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl focus:outline-2 ${
                    isDark 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white focus:outline-purple-500'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white focus:outline-purple-500'
                  }`}
                  disabled={loading}
                  aria-label="Enviar email de recuperación"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthPageLayout>
    </>
  );
};

export default LoginEnhanced;

