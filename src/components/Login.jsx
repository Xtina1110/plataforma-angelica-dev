import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthPageLayout from './AuthPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';

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

  // Validación de email en tiempo real
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
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
      // Si "Recordarme" está activado, guardar email
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      navigate('/dashboard-redirect');
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
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSelector inline variant="loading" />
        <AudioButton variant="loading" />
      </div>
      <AuthPageLayout
        title={translation.loginPage.title}
        headerImage={loginHeaderImage}
        icon={LogIn}
      >
      {/* Contenido de login con mejoras TOP 3 */}
      <div className="max-w-sm mx-auto">
        {/* Header mejorado con mensaje angelical */}
        <div className="text-center mb-6 animate-fade-in">
          <p className="text-gray-700 text-base font-medium leading-relaxed">
            ✨ {translation.loginPage.subtitle} ✨
          </p>
          <p className="text-purple-600 text-sm mt-2 italic">
            Los ángeles te dan la bienvenida
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email con validación visual */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder={translation.loginPage.email}
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-yellow-400 bg-white/80 backdrop-blur-sm text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md"
              required
            />
            {email && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {emailValid ? (
                  <CheckCircle size={20} className="text-green-500 animate-scale-in" />
                ) : (
                  <AlertCircle size={20} className="text-red-400 animate-scale-in" />
                )}
              </div>
            )}
          </div>

          {/* Password con toggle mejorado */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={translation.loginPage.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-yellow-400 bg-white/80 backdrop-blur-sm text-base transition-all duration-300 hover:border-purple-300 hover:shadow-md [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden"
              style={{
                WebkitTextSecurity: showPassword ? 'none' : 'disc'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-all duration-300 hover:scale-110"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Remember me mejorado */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <span className="ml-2.5 text-gray-700 font-medium text-sm group-hover:text-purple-600 transition-colors">
                Recordarme
              </span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-all"
              disabled={!email}
            >
              {translation.loginPage.forgotPassword}
            </button>
          </div>

          {/* Error message mejorado con iconos */}
          {error && (
            <div className={`p-4 rounded-2xl text-center font-medium flex items-center justify-center gap-2 animate-shake ${
              error.includes('enviado') 
                ? 'bg-green-50 text-green-700 border-2 border-green-300' 
                : 'bg-red-50 text-red-700 border-2 border-red-300'
            }`}>
              {error.includes('enviado') ? (
                <CheckCircle size={20} className="flex-shrink-0" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0" />
              )}
              <span>{error}</span>
            </div>
          )}

          {/* Submit button premium con efecto de brillo */}
          <button 
            type="submit" 
            className="relative w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base overflow-hidden group"
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
                <LogIn size={20} /> 
                <span>{translation.loginPage.loginButton}</span>
              </div>
            )}
          </button>
        </form>

        {/* Footer mejorado con borde dorado */}
        <div className="text-center mt-6 p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-yellow-400/60 shadow-sm">
          <p className="text-gray-700 text-sm">
            {translation.loginPage.noAccount}{' '}
            <button 
              onClick={() => navigate('/registro')}
              className="text-purple-600 hover:text-purple-700 font-bold underline hover:no-underline transition-all"
            >
              {translation.loginPage.registerHere}
            </button>
          </p>
        </div>

        {/* Modal de recuperación mejorado */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border-2 border-yellow-400/60 animate-scale-in">
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 flex items-center justify-center gap-2">
                <Lock size={24} className="text-purple-600" />
                Recuperar Contraseña
              </h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">
                Se enviará un enlace de recuperación a: <br />
                <strong className="text-purple-600 text-lg">{email}</strong>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-medium shadow-lg hover:shadow-xl"
                  disabled={loading}
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

