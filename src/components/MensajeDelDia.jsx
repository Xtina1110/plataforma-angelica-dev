import React from 'react';
import fondoPaisaje from '../assets/FondoPaisajeTranquilo.png';
import ScrollIndicator from './ScrollIndicator';

const MensajeDelDia = () => {
  // Sistema de mensajes diarios con rotación automática
  const mensajesAngelicales = [
    { mensaje: "Tu luz interior brilla más fuerte cada día. Los ángeles amplifican tu radiancia espiritual.", arcangel: "Arcángel Miguel", energia: "Protección y Fuerza" },
    { mensaje: "Encuentra la belleza en cada momento. Los ángeles te invitan a celebrar la alegría que existe en tu vida.", arcangel: "Arcángel Gabriel", energia: "Comunicación Divina" },
    { mensaje: "La sanación fluye a través de ti como un río de luz dorada. Permite que tu corazón se abra a nuevas posibilidades.", arcangel: "Arcángel Rafael", energia: "Sanación y Renovación" },
    { mensaje: "Tu sabiduría interior es un faro que guía a otros hacia la luz. Confía en tu intuición angelical.", arcangel: "Arcángel Uriel", energia: "Sabiduría y Claridad" },
    { mensaje: "El amor incondicional fluye desde tu corazón hacia todo lo que te rodea. Eres un canal de amor divino.", arcangel: "Arcángel Chamuel", energia: "Amor Incondicional" },
    { mensaje: "La creatividad divina se manifiesta a través de tus acciones. Cada paso que das crea belleza en el mundo.", arcangel: "Arcángel Jofiel", energia: "Belleza y Creatividad" },
    { mensaje: "La justicia divina trabaja a tu favor. Confía en que el universo conspira para tu mayor bien.", arcangel: "Arcángel Raguel", energia: "Justicia Divina" }
  ];

  const obtenerMensajeDelDia = () => {
    const hoy = new Date();
    const inicioAño = new Date(hoy.getFullYear(), 0, 1);
    const diaDelAño = Math.floor((hoy - inicioAño) / (24 * 60 * 60 * 1000));
    const indiceMensaje = diaDelAño % mensajesAngelicales.length;
    
    const opcionesFecha = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return {
      fecha: hoy.toLocaleDateString('es-ES', opcionesFecha),
      ...mensajesAngelicales[indiceMensaje]
    };
  };

  const mensajeDelDia = obtenerMensajeDelDia();

  return (
    <div className="mensaje-del-dia-section mx-4"
      style={{
        marginTop: '40px', // Separación superior como en dashboard
        paddingTop: '0'
      }}
    >

      <div className="mensaje-del-dia-hero" style={{
        backgroundImage: `url(${fondoPaisaje})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        borderRadius: '25px',
        overflow: 'hidden',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '40px 50px',
        marginBottom: '50px',
        marginTop: '40px' // Separación adicional desde el título
      }}>
        
        {/* Overlay con gradiente morado a azul */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(106, 13, 173, 0.4) 0%, rgba(138, 43, 226, 0.35) 50%, rgba(30, 144, 255, 0.3) 100%)',
          backdropFilter: 'blur(3px)',
          zIndex: 1
        }}></div>
        
        {/* Contenido del texto - lado izquierdo */}
        <div className="mensaje-content" style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'left',
          flex: 1,
          maxWidth: '65%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Mensaje principal con más transparencia */}
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#2D1B69',
            lineHeight: 1.6,
            margin: '15px 0',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.3px',
            textShadow: '0 2px 4px rgba(255, 255, 255, 0.9)',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.5)'
          }}>
            {mensajeDelDia.mensaje}
          </h2>
          
          {/* Información del arcángel sin fondo - color dorado SIN SOMBRA */}
          <div style={{
            fontSize: '1.2rem',
            color: '#d4af37',
            fontWeight: 700,
            marginBottom: '20px',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.5px',
            padding: '12px 0'
          }}>
            — {mensajeDelDia.arcangel} • {mensajeDelDia.energia}
          </div>
        </div>

        {/* Ícono de ángel y botón - lado derecho */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          paddingBottom: '40px',
          paddingRight: '20px'
        }}>
          {/* Imagen del ángel que se extiende hasta el cuadro blanco del mensaje */}
          <img 
            src="/lovable-uploads/dbd24812-a6f2-4ba0-aa75-7d20336a21aa.png"
            alt="San Gabriel"
            style={{
              position: 'absolute',
              top: '100px',
              right: '20px',
              width: '450px',
              height: 'auto',
              filter: 'drop-shadow(0 8px 16px rgba(106, 13, 173, 0.4)) drop-shadow(0 4px 8px rgba(30, 144, 255, 0.3))',
              animation: 'float 3s ease-in-out infinite',
              zIndex: 1
            }}
          />
          
          {/* Botón de acción */}
          <button style={{
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
            transition: 'all 0.3s ease',
            outline: 'none',
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 3
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.6)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.4)';
          }}>
            Mensajes de tus Ángeles
          </button>
        </div>
      </div>

      {/* Scroll Indicator ya se incluye en el header */}
    </div>
  );
};

export default MensajeDelDia;

