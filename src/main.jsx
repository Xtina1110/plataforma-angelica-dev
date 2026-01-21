import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css'; // ✅ Importa estilos globales de Tailwind y fuentes

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ No se encontró el elemento raíz (#root) en index.html');
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </React.StrictMode>
    );
    console.log('✅ Plataforma Angélica montada con éxito');
  } catch (error) {
    console.error('❌ Error al montar la Plataforma Angélica:', error);
  }
}
