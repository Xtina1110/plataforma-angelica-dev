import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import paisesTraducidos from '../data/paisesTraducidos';
import idiomasTraducidos from '../data/idiomasTraducidos';
import { Mail, Lock, User, Phone, MapPin, Globe, Eye, EyeOff, UserPlus, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RegisterPageLayout from './RegisterPageLayout';
import LanguageSelector from './LanguageSelector';
import AudioButton from './AudioButton';

// Imagen temática para registro
const registerHeaderImage = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop';

export default function Registro() {
  const navigate = useNavigate();
  const { getCurrentTranslation, language, changeLanguage, availableLanguages } = useLanguage();
  const translation = getCurrentTranslation();
  
  // Obtener listas traducidas según el idioma actual
  const paisesActuales = paisesTraducidos[language] || paisesTraducidos['Español'];
  const idiomasActuales = idiomasTraducidos[language] || idiomasTraducidos['Español'];
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    nacimiento: '',
    idioma: '',
    direccion: '',
    ciudad: '',
    estado: '',
    pais: '',
    codigo_postal: '',
    telefono: '',
    contacto_preferido: '',
    rol: 'usuario',
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setExito('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError(translation.registerPage.passwordMismatch);
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    // Validar edad mayor de 18 años
    if (formData.nacimiento) {
      const fechaNacimiento = new Date(formData.nacimiento);
      const fechaActual = new Date();
      let edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      const mesDiferencia = fechaActual.getMonth() - fechaNacimiento.getMonth();
      
      if (mesDiferencia < 0 || (mesDiferencia === 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      
      if (edad < 18) {
        setShowAgeModal(true);
        setLoading(false);
        return;
      }
    }

    const { email } = formData;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setShowErrorModal(true);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Esperar un momento para que la autenticación se complete
      setTimeout(async () => {
        // Remove rol from formData to prevent role escalation
        const { rol, ...secureFormData } = formData;
        
        const { error: insertError } = await supabase.from('usuarios').insert([
          {
            id: data.user.id,
            ...secureFormData,
            // rol is automatically set to 'usuario' by database default
          },
        ]);

        if (insertError) {
          setError(insertError.message);
          setShowErrorModal(true);
          setLoading(false);
        } else {
          setExito(translation.registerPage.success);
          setShowSuccessModal(true);
          setLoading(false);
        }
      }, 1000);
    } else {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSelector inline />
        <AudioButton variant="header" />
      </div>
      
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {translation.registerPage?.errorTitle || 'Error en el Registro'}
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {error}
            </p>
            <button
              onClick={() => {
                setShowErrorModal(false);
                setError('');
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {translation.registerPage?.understood || 'Entendido'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {translation.registerPage?.successTitle || '¡Registro Exitoso!'}
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {exito}
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/login');
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {translation.registerPage?.goToLogin || 'Ir al Login'}
            </button>
          </div>
        </div>
      )}
      
      {/* Modal de error de edad */}
      {showAgeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {translation.registerPage?.ageErrorTitle || 'Registro No Permitido'}
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {translation.registerPage?.ageErrorMessage || 'Lo sentimos, el registro está restringido a personas mayores de 18 años.'}
            </p>
            <button
              onClick={() => setShowAgeModal(false)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {translation.registerPage?.understood || 'Entendido'}
            </button>
          </div>
        </div>
      )}

      <RegisterPageLayout
        title={translation.registerPage.title}
        headerImage={registerHeaderImage}
        icon={UserPlus}
      >
      {/* Contenido de registro */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-gray-600 text-lg">{translation.registerPage.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información personal */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <User size={24} className="mr-2 text-purple-600" />
              {translation.registerPage?.personalInfo || 'Información Personal'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input 
                  name="nombre" 
                  placeholder={translation.registerPage.firstName} 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input 
                  name="apellidos" 
                  placeholder={translation.registerPage.lastName} 
                  value={formData.apellidos} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder={translation.registerPage.email} 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative">
                <input 
                  type="date" 
                  name="nacimiento" 
                  value={formData.nacimiento} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Lock size={24} className="mr-2 text-red-600" />
              {translation.registerPage?.security || 'Seguridad'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder={translation.registerPage.password} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden"
                  style={{
                    WebkitTextSecurity: showPassword ? 'none' : 'disc'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  placeholder={translation.registerPage.confirmPassword} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm [&::-ms-reveal]:hidden [&::-webkit-textfield-decoration-container]:hidden"
                  style={{
                    WebkitTextSecurity: showConfirmPassword ? 'none' : 'disc'
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl border border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Globe size={24} className="mr-2 text-green-600" />
              {translation.registerPage?.preferences || 'Preferencias y Contacto'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={20} />
                </div>
                <select 
                  name="idioma" 
                  value={formData.idioma} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                >
                  <option value="">{translation.registerPage.preferredLanguage}</option>
                  {idiomasActuales.map((idioma, i) => <option key={i} value={idioma}>{idioma}</option>)}
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <input 
                  name="telefono" 
                  placeholder={translation.registerPage.phone} 
                  value={formData.telefono} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <select 
                  name="contacto_preferido" 
                  value={formData.contacto_preferido} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                >
                  <option value="">{translation.registerPage.preferredContact}</option>
                  <option value="Correo electrónico">{translation.registerPage.email}</option>
                  <option value="Teléfono">{translation.registerPage.phone}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin size={24} className="mr-2 text-blue-600" />
              {translation.registerPage?.location || 'Ubicación'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <input 
                  name="direccion" 
                  placeholder={translation.registerPage.address} 
                  value={formData.direccion} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <input 
                  name="ciudad" 
                  placeholder={translation.registerPage.city} 
                  value={formData.ciudad} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <input 
                  name="estado" 
                  placeholder={translation.registerPage.state} 
                  value={formData.estado} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative">
                <input 
                  name="codigo_postal" 
                  placeholder={translation.registerPage.postalCode} 
                  value={formData.codigo_postal} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required 
                />
              </div>
              
              <div className="relative md:col-span-2">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={20} />
                </div>
                <select 
                  name="pais" 
                  value={formData.pais} 
                  onChange={handleChange} 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                  required
                >
                  <option value="">{translation.registerPage.selectCountry}</option>
                  {paisesActuales.map((pais, i) => <option key={i} value={pais}>{pais}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div className="flex items-start space-x-3">
              <input 
                type="checkbox" 
                required 
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 mt-1" 
              />
              <p className="text-gray-700">
                {translation.registerPage.acceptTerms}{' '}
                <a href="/terminos" className="text-purple-600 underline hover:text-purple-800 font-medium">
                  {translation.registerPage.termsAndConditions}
                </a> {translation.registerPage.and}{' '}
                <a href="/privacidad" className="text-purple-600 underline hover:text-purple-800 font-medium">
                  {translation.registerPage.privacyPolicy}
                </a>.
              </p>
            </div>
          </div>

          {/* Mensajes eliminados - ahora solo pop-ups */}

          {/* Botón de envío */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-4 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {translation.registerPage.registering}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <UserPlus size={24} /> 
                {translation.registerPage.registerButton}
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-xl">
          <p className="text-gray-600">
            {translation.registerPage.alreadyHaveAccount}{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-700 font-bold underline"
            >
              {translation.registerPage.loginHere}
            </button>
          </p>
        </div>
      </div>
    </RegisterPageLayout>
    </>
  );
}
