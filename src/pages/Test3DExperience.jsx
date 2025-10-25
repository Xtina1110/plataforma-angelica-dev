import React from 'react';
import AngelicInterpreterWith3D from '../components/AngelicInterpreterWith3D';

/**
 * Página de prueba para la experiencia 3D de cartas angelicales
 * 
 * Para probar:
 * 1. Agregar ruta en App.jsx: <Route path="/test-3d" element={<Test3DExperience />} />
 * 2. Navegar a: http://localhost:5173/test-3d
 */
const Test3DExperience = () => {
  return (
    <div className="w-full h-screen">
      <AngelicInterpreterWith3D />
    </div>
  );
};

export default Test3DExperience;

