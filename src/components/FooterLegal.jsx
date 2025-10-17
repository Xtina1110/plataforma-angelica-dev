import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Instagram, Youtube, X, Linkedin } from 'lucide-react';
import './FooterLegal.css';

const FooterLegal = () => {
  const { getCurrentTranslation } = useLanguage();
  const translation = getCurrentTranslation();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white border-t border-purple-500/20 rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-2">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">

          {/* Links legales */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/terminos"
              className="text-white hover:text-yellow-400 transition-colors duration-300 font-semibold relative group text-[10px] sm:text-xs md:text-sm cursor-pointer"
            >
              {translation.footer?.terms || 'Términos de Uso'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <Link
              to="/politica"
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium relative group text-[10px] sm:text-xs md:text-sm"
            >
              {translation.footer.privacy}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <Link
              to="/contacto"
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 font-medium relative group text-[10px] sm:text-xs md:text-sm"
            >
              {translation.footer.contact}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Centro: copyright */}
          <div className="text-center w-full sm:flex-1">
            <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-[11px] leading-tight">
              © 2025 Juan Carlos Ávila - El Angeólogo. {translation.footer.rightsReserved}.
            </p>
          </div>

          {/* Redes sociales */}
          <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <span className="text-gray-400 text-[10px] sm:text-[11px] font-medium">{translation.followUs}</span>
            
            <a 
              href="https://www.facebook.com/elangeologo"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-blue-500/25"
            >
              <Facebook size={16} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a 
              href="https://www.instagram.com/elangeologo/"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-pink-500/25"
            >
              <Instagram size={16} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a 
              href="https://www.youtube.com/@JuanCarlosAvilaElangeologo"
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-red-500/25"
            >
              <Youtube size={16} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative p-2 rounded-full bg-gradient-to-br from-slate-800 to-black hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-slate-500/25"
            >
              <X size={16} className="text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default FooterLegal;