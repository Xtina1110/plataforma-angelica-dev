import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
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
      setRememberMe(true);
    }
  }, []);

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSelector inline />
        <AudioButton variant="header" />
      </div>
      <AuthPageLayout
        title={translation.loginPage.title}
        headerImage={loginHeaderImage}
        icon={LogIn}
      >
      {/* Contenido de login */}
      <div className="max-w-sm mx-auto">
        {/* Header compacto */}
        <div className="text-center mb-3">
          <p className="text-gray-600 text-sm font-medium">{translation.loginPage.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Email */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder={translation.loginPage.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={translation.loginPage.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden"
              style={{
                WebkitTextSecurity: showPassword ? 'none' : 'disc'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember me compacto */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3 h-3 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span className="ml-2 text-gray-700 font-medium text-sm">Recordarme</span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              disabled={!email}
            >
              {translation.loginPage.forgotPassword}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className={`p-4 rounded-xl text-center font-medium ${
              error.includes('enviado') 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {error}
            </div>
          )}

          {/* Submit button compacto */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-2.5 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {translation.loginPage.loading}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <LogIn size={18} /> 
                {translation.loginPage.loginButton}
              </div>
            )}
          </button>
        </form>

        {/* Footer SIEMPRE VISIBLE con enlaces */}
        <div className="text-center mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 text-xs mb-2">
            {translation.loginPage.noAccount}{' '}
            <button 
              onClick={() => navigate('/registro')}
              className="text-purple-600 hover:text-purple-700 font-bold underline"
            >
              {translation.loginPage.registerHere}
            </button>
          </p>
        </div>

        {/* Modal de recuperación de contraseña */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Recuperar Contraseña</h3>
              <p className="text-gray-600 mb-6 text-center">
                Se enviará un enlace de recuperación al email: <br />
                <strong className="text-purple-600">{email}</strong>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
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