import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { 
  Float, 
  Environment, 
  ContactShadows, 
  useTexture,
  Html,
  PresentationControls
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { getArcangelColor, getCardBackImage } from '../../../utils/card-helpers/cardMapper';

/**
 * Componente de partículas doradas
 */
const GoldenParticles = ({ color, show }) => {
  const particlesRef = useRef();
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 0.5
        ],
        scale: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return temp;
  });

  useFrame((state) => {
    if (!show || !particlesRef.current) return;
    
    particlesRef.current.children.forEach((particle, i) => {
      particle.position.y += particles[i].speed;
      particle.position.x += Math.sin(state.clock.elapsedTime + i) * 0.001;
      
      if (particle.position.y > 2) {
        particle.position.y = -2;
      }
      
      particle.rotation.z += 0.02;
    });
  });

  if (!show) return null;

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Componente de la carta 3D individual
 */
const Card3DMesh = ({ 
  frontImage, 
  backImage, 
  isRevealed, 
  isHighlighted,
  arcangelColor,
  onFlip,
  enableInteraction = true
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Cargar texturas
  const frontTexture = useTexture(frontImage);
  const backTexture = useTexture(backImage);

  // Animación de rotación
  useFrame((state) => {
    if (!meshRef.current) return;

    // Rotación objetivo
    const targetRotationY = isRevealed ? Math.PI : 0;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotationY,
      0.1
    );

    // Levitación sutil cuando no está en hover
    if (!hovered && !isHighlighted) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const handleClick = () => {
    if (!enableInteraction) return;
    
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
    
    if (onFlip) {
      onFlip();
    }
  };

  const scale = hovered ? 1.1 : isHighlighted ? 1.05 : 1;
  const yPosition = hovered ? 0.3 : 0;

  return (
    <group>
      {/* Carta */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => enableInteraction && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, yPosition, 0]}
        scale={scale}
      >
        {/* Geometría con grosor */}
        <boxGeometry args={[2, 3, 0.02]} />
        
        {/* Material del frente */}
        <meshStandardMaterial
          attach="material-0"
          map={frontTexture}
          metalness={0.2}
          roughness={0.6}
          emissive={arcangelColor}
          emissiveIntensity={isHighlighted ? 0.5 : 0.2}
        />
        
        {/* Material del reverso */}
        <meshStandardMaterial
          attach="material-1"
          map={backTexture}
          metalness={0.5}
          roughness={0.3}
          color="#1a0033"
          emissive="#FFD700"
          emissiveIntensity={0.3}
        />
        
        {/* Materiales de los bordes (dorados) */}
        {[2, 3, 4, 5].map(i => (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            metalness={0.8}
            roughness={0.2}
            color="#FFD700"
          />
        ))}
      </mesh>

      {/* Aura cuando está destacada */}
      {isHighlighted && (
        <mesh scale={[2.5, 3.5, 0.1]} position={[0, 0, -0.1]}>
          <planeGeometry />
          <meshBasicMaterial
            color={arcangelColor}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Partículas al voltear */}
      <GoldenParticles color={arcangelColor} show={showParticles} />

      {/* Sombras de contacto */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.4} 
        scale={3} 
        blur={2} 
      />
    </group>
  );
};

/**
 * Componente principal de carta 3D
 */
const AngelCard3D = ({ 
  carta, 
  isRevealed = false,
  isHighlighted = false,
  onFlip,
  enableInteraction = true,
  showInZoom = false
}) => {
  // Obtener color del arcángel basado en el nombre de la carta
  const arcangelColor = carta.arcangelColor || getArcangelColor(carta.nombre);

  // Imágenes de la carta (usar las imágenes reales del angelólogo)
  const frontImage = carta.imagen;
  const backImage = getCardBackImage();

  if (showInZoom) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onFlip}>
        <div className="w-full h-full max-w-4xl max-h-screen p-8" onClick={(e) => e.stopPropagation()}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            {/* Iluminación */}
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[5, 10, 5]} 
              intensity={1.2} 
              color="#FFD700"
              castShadow
            />
            <pointLight position={[0, 5, 0]} intensity={0.8} decay={2} />
            <hemisphereLight 
              skyColor="#87CEEB" 
              groundColor="#1a0033" 
              intensity={0.6} 
            />

            {/* Entorno HDR */}
            <Environment preset="sunset" />

            {/* Controles de presentación */}
            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Card3DMesh
                frontImage={frontImage}
                backImage={backImage}
                isRevealed={true}
                isHighlighted={false}
                arcangelColor={arcangelColor}
                enableInteraction={false}
              />
            </PresentationControls>

            {/* Post-procesamiento */}
            <EffectComposer>
              <Bloom 
                intensity={1.2} 
                luminanceThreshold={0.9} 
                luminanceSmoothing={0.9} 
              />
            </EffectComposer>
          </Canvas>
          
          <button
            onClick={onFlip}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          color="#FFD700"
          castShadow
        />
        <pointLight position={[0, 5, 0]} intensity={0.8} decay={2} />
        <hemisphereLight 
          skyColor="#87CEEB" 
          groundColor="#1a0033" 
          intensity={0.6} 
        />

        {/* Entorno HDR */}
        <Environment preset="sunset" />

        {/* Carta con levitación */}
        <Float
          speed={2}
          rotationIntensity={0.1}
          floatIntensity={0.5}
          enabled={!isHighlighted}
        >
          <Card3DMesh
            frontImage={frontImage}
            backImage={backImage}
            isRevealed={isRevealed}
            isHighlighted={isHighlighted}
            arcangelColor={arcangelColor}
            onFlip={onFlip}
            enableInteraction={enableInteraction}
          />
        </Float>

        {/* Post-procesamiento */}
        <EffectComposer>
          <Bloom 
            intensity={isHighlighted ? 1.5 : 0.8} 
            luminanceThreshold={0.9} 
            luminanceSmoothing={0.9} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default AngelCard3D;

