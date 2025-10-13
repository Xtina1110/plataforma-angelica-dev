import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import './Carta3D.css';

// Componente de carta 3D individual
const Carta3DModel = ({ imagenFrente, imagenDorso, isFlipped, onFlip, position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Cargar texturas
  const frenteTexture = useTexture(imagenFrente);
  const dorsoTexture = useTexture(imagenDorso);
  
  // Animación de rotación
  useFrame((state) => {
    if (meshRef.current) {
      // Animación suave al voltear
      const targetRotation = isFlipped ? Math.PI : 0;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.1
      );
      
      // Efecto de hover
      if (hovered) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + position[1];
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          position[1],
          0.1
        );
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={onFlip}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Geometría de la carta (plano con grosor) */}
      <boxGeometry args={[2, 3, 0.05]} />
      
      {/* Material del frente */}
      <meshStandardMaterial
        attach="material-0"
        map={frenteTexture}
        side={THREE.FrontSide}
      />
      <meshStandardMaterial
        attach="material-1"
        map={frenteTexture}
        side={THREE.FrontSide}
      />
      
      {/* Material del dorso */}
      <meshStandardMaterial
        attach="material-2"
        map={dorsoTexture}
        side={THREE.FrontSide}
      />
      <meshStandardMaterial
        attach="material-3"
        map={dorsoTexture}
        side={THREE.FrontSide}
      />
      
      {/* Bordes */}
      <meshStandardMaterial
        attach="material-4"
        color="#d4af37"
        metalness={0.8}
        roughness={0.2}
      />
      <meshStandardMaterial
        attach="material-5"
        color="#d4af37"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// Componente principal de visualización 3D
const Carta3D = ({ 
  carta, 
  imagenDorso = '/cartas/dorso.png',
  modo = 'simple', // 'simple', 'multiple', 'spread'
  cartas = [],
  onCartaClick 
}) => {
  const [cartasVolteadas, setCartasVolteadas] = useState(new Set());
  
  const handleFlip = (index) => {
    const newFlipped = new Set(cartasVolteadas);
    if (newFlipped.has(index)) {
      newFlipped.delete(index);
    } else {
      newFlipped.add(index);
    }
    setCartasVolteadas(newFlipped);
    
    if (onCartaClick) {
      onCartaClick(index);
    }
  };
  
  // Renderizar según el modo
  const renderCartas = () => {
    switch (modo) {
      case 'simple':
        return (
          <Carta3DModel
            imagenFrente={carta.imagen}
            imagenDorso={imagenDorso}
            isFlipped={cartasVolteadas.has(0)}
            onFlip={() => handleFlip(0)}
          />
        );
      
      case 'multiple':
        // Disposición en línea horizontal
        return cartas.map((c, i) => {
          const spacing = 2.5;
          const offset = (cartas.length - 1) * spacing / 2;
          return (
            <Carta3DModel
              key={i}
              imagenFrente={c.imagen}
              imagenDorso={imagenDorso}
              isFlipped={cartasVolteadas.has(i)}
              onFlip={() => handleFlip(i)}
              position={[i * spacing - offset, 0, 0]}
              scale={0.8}
            />
          );
        });
      
      case 'spread':
        // Disposición en abanico
        return cartas.map((c, i) => {
          const totalCartas = cartas.length;
          const angleSpread = Math.PI / 6; // 30 grados de apertura
          const angle = (i / (totalCartas - 1) - 0.5) * angleSpread;
          const radius = 4;
          const x = Math.sin(angle) * radius;
          const z = -Math.cos(angle) * radius + 2;
          
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <Carta3DModel
                imagenFrente={c.imagen}
                imagenDorso={imagenDorso}
                isFlipped={cartasVolteadas.has(i)}
                onFlip={() => handleFlip(i)}
                position={[x, 0, z]}
                scale={0.7}
              />
            </group>
          );
        });
      
      default:
        return null;
    }
  };
  
  return (
    <div className="carta-3d-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a78bfa" />
        <pointLight position={[5, -5, 5]} intensity={0.5} color="#60a5fa" />
        
        {/* Cartas */}
        {renderCartas()}
        
        {/* Controles de cámara */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Fondo con gradiente */}
        <mesh position={[0, 0, -5]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      </Canvas>
      
      <div className="carta-3d-controles">
        <button 
          onClick={() => setCartasVolteadas(new Set())}
          className="btn-control"
        >
          🔄 Voltear Todas
        </button>
        <div className="carta-3d-info">
          <span>🖱️ Arrastra para rotar</span>
          <span>🖱️ Scroll para zoom</span>
          <span>👆 Click para voltear</span>
        </div>
      </div>
    </div>
  );
};

export default Carta3D;

