import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';
import angelSinFondo from '../assets/AngelEleganteSinFondo.png';

// Imagen temática para login
const loginHeaderImage = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=400&fit=crop';

const Login = () => {
  const navigate = useNavigate();
  const { getCurrentTranslation } = useLanguage();
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

  // Validación de email en tiempo real
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Calcular fortaleza de contraseña
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return Math.min(strength, 4);
  };

  const getPasswordStrengthLabel = (strength) => {
    const labels = ['Muy débil', 'Débil', 'Media', 'Fuerte', 'Muy fuerte'];
    return labels[strength] || '';
  };

  const getPasswordStrengthColor = (strength) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-600'];
    return colors[strength] || 'bg-gray-300';
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translation.loginPage.invalidCredentials);
      setLoading(false);
    } else {
      // Animación de éxito
      setLoginSuccess(true);
      
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError('Error al enviar email de recuperación');
    } else {
      setError('Email de recuperación enviado');
    }
    setLoading(false);
    setShowForgotPassword(false);
  };

  // Cargar email recordado al montar el componente
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setEmailValid(validateEmail(rememberedEmail));
      setRememberMe(true);
    }
  }, []);

  return (
    <>
      {/* Efecto de luz divina desde arriba (sin partículas ni nubes) */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-200/20 via-purple-200/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Botones de idioma y audio */}
      <div className="fixed top-4 right-4 z-[9999] flex items-center gap-3">
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>

      {/* Animación de éxito con escudo */}
      {loginSuccess && (
        <div className="fixed inset-0 bg-purple-900/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="relative">
              <Shield size={120} className="text-yellow-400 mx-auto mb-6 animate-pulse" />
              <Sparkles size={40} className="absolute top-0 right-1/4 text-yellow-300 animate-ping" />
              <Sparkles size={30} className="absolute bottom-0 left-1/4 text-yellow-300 animate-ping" style={{ animationDelay: '0.3s' }} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">✨ Acceso Seguro ✨</h2>
            <p className="text-xl text-yellow-200">Los ángeles te dan la bienvenida...</p>
          </div>
        </div>
      )}

      <AuthPageLayout
        title={translation.loginPage.title}
        headerImage={loginHeaderImage}
        icon={LogIn}
      >
      {/* Contenido de login con TODAS las mejoras */}
      <div className="max-w-3xl mx-auto relative">
        {/* Header mejorado con mensaje angelical dentro del recuadro */}
        <div className="text-center mb-6 animate-fade-in">
          <p className="text-yellow-600 text-xl md:text-2xl font-bold italic mb-2">
            ✨ {translation.loginPage.subtitle} ✨
          </p>
          <p className="text-purple-600 text-base font-semibold flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-yellow-500" />
            Los ángeles te dan la bienvenida
            <Sparkles size={18} className="text-yellow-500" />
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" role="form" aria-label="Formulario de inicio de sesión">
          {/* Email con validación visual mejorada */}
          <div className="relative group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico *
            </label>
            <div className="absolute left-4 top-[42px] transform text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
              <Mail size={20} />
            </div>
            <input
              id="email"
              type="email"
              placeholder={translation.loginPage.email}
              value={email}
              onChange={handleEmailChange}
              aria-label="Correo electrónico"
              aria-required="true"
              aria-invalid={email && !emailValid}
              aria-describedby={email && !emailValid ? "email-error" : undefined}
              className="w-full pl-12 pr-12 py-2.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-yellow-400 bg-white/90 backdrop-blur-sm text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md"
              required
            />
            {email && (
              <div className="absolute right-4 top-[42px] transform" role="status" aria-live="polite">
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

          {/* Password con indicador de fortaleza */}
          <div className="relative group">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña *
            </label>
            <div className="absolute left-4 top-[42px] transform text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
              <Lock size={20} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={translation.loginPage.password}
              value={password}
              onChange={handlePasswordChange}
              aria-label="Contraseña"
              aria-required="true"
              aria-describedby="password-strength"
              className="w-full pl-12 pr-12 py-2.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-yellow-400 bg-white/90 backdrop-blur-sm text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden"
              style={{
                WebkitTextSecurity: showPassword ? 'none' : 'disc'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-4 top-[42px] transform text-gray-400 hover:text-purple-600 transition-all duration-300 hover:scale-110"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            
            {/* Indicador de fortaleza de contraseña */}
            {password && (
              <div id="password-strength" className="mt-2" role="status" aria-live="polite">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  {passwordStrength < 3 && "Usa mayúsculas, números y símbolos para mayor seguridad"}
                </p>
              </div>
            )}
          </div>

          {/* Remember me mejorado con mejor accesibilidad */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center cursor-pointer group" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                aria-label="Recordar mi sesión"
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-2.5 text-gray-700 font-medium text-sm group-hover:text-purple-600 transition-colors">
                Recordarme
              </span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-all focus:outline-2 focus:outline-purple-500"
              disabled={!email}
              aria-label="¿Olvidaste tu contraseña?"
            >
              {translation.loginPage.forgotPassword}
            </button>
          </div>

          {/* Error message mejorado con iconos y mejor contraste */}
          {error && (
            <div 
              className={`p-4 rounded-2xl text-center font-semibold flex items-center justify-center gap-2 animate-shake ${
                error.includes('enviado') 
                  ? 'bg-green-50 text-green-800 border-2 border-green-400' 
                  : 'bg-red-50 text-red-800 border-2 border-red-400'
              }`}
              role="alert"
              aria-live="assertive"
            >
              {error.includes('enviado') ? (
                <CheckCircle size={22} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={22} className="flex-shrink-0" />
              )}
              <span>{error}</span>
            </div>
          )}

          {/* Submit button premium con efecto de brillo y escudo */}
          <button 
            type="submit" 
            aria-label="Iniciar sesión de forma segura"
            className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base overflow-hidden group"
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

        {/* Footer con botón de registro igual al de inicio */}
        <div className="text-center mt-4">
          <p className="text-gray-700 text-base mb-3">
            {translation.loginPage.noAccount}
          </p>
          <button 
            onClick={() => navigate('/registro')}
            className="w-full bg-white hover:bg-purple-50 text-purple-700 font-bold py-3 px-6 rounded-2xl border-3 border-purple-600 hover:border-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            aria-label="Ir a la página de registro"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>{translation.loginPage.registerHere}</span>
          </button>
        </div>

        {/* Modal de recuperación mejorado con mejor accesibilidad */}
        {showForgotPassword && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
          >
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border-2 border-yellow-400/70 animate-scale-in">
              <h3 id="forgot-password-title" className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                <Lock size={24} className="text-purple-600" />
                Recuperar Contraseña
              </h3>
              <p className="text-gray-700 mb-6 text-center leading-relaxed">
                Se enviará un enlace de recuperación a: <br />
                <strong className="text-purple-700 text-lg">{email}</strong>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium focus:outline-2 focus:outline-gray-500"
                  aria-label="Cancelar recuperación de contraseña"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg hover:shadow-xl focus:outline-2 focus:outline-purple-500"
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

export default Login;

