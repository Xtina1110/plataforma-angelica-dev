import React from 'react';
import { Calendar, Star, Users, Video } from 'lucide-react';

const ReservasHeader = ({
  title = "Sistema de Reservas",
  subtitle = "Agenda tu sesión personalizada con nuestros expertos",
  description = null,
  icon = null
}) => {
  const HeaderIcon = icon || Calendar;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '280px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/FondoMarmoleado02.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 text-center px-4 py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
            <HeaderIcon className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            {title}
          </h1>
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        <p
          className="text-white/95 text-lg md:text-xl max-w-3xl mx-auto mb-2"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
        >
          {subtitle}
        </p>

        {description && (
          <p
            className="text-white/85 text-base max-w-3xl mx-auto"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
          >
            {description}
          </p>
        )}

        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Reserva Flexible</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Expertos Certificados</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Star className="w-5 h-5 fill-white" />
            <span className="text-sm font-medium">Experiencia Premium</span>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-16"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1))'
        }}
      />
    </div>
  );
};

export default ReservasHeader;
