import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud, Sky, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Templo Celestial
export const CelestialTemple = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Piso dorado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#ffd700"
          metalness={0.9}
          roughness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Columnas del templo */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]}>
            {/* Columna */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.4, 6, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                metalness={0.3}
                roughness={0.4}
                emissive="#ffffff"
                emissiveIntensity={0.1}
              />
            </mesh>
            {/* Capitel */}
            <mesh position={[0, 3.5, 0]} castShadow>
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial
                color="#ffd700"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Luz en la columna */}
            <pointLight
              position={[0, 3, 0]}
              color="#ffd700"
              intensity={0.5}
              distance={5}
            />
          </group>
        );
      })}

      {/* Cúpula celestial */}
      <mesh position={[0, 8, 0]}>
        <sphereGeometry args={[12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#87ceeb"
          side={THREE.BackSide}
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Partículas doradas flotantes */}
      <Sparkles
        count={200}
        scale={15}
        size={2}
        speed={0.3}
        color="#ffd700"
        opacity={0.6}
      />

      {/* Iluminación ambiental del templo */}
      <pointLight position={[0, 10, 0]} color="#ffffff" intensity={1} distance={20} />
      <pointLight position={[5, 5, 5]} color="#ffd700" intensity={0.5} />
      <pointLight position={[-5, 5, -5]} color="#ffd700" intensity={0.5} />
    </group>
  );
};

// Jardín Angelical
export const AngelicGarden = () => {
  const groupRef = useRef();

  return (
    <group ref={groupRef}>
      {/* Piso de hierba */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#2d5016"
          roughness={0.8}
        />
      </mesh>

      {/* Árboles */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 10 + Math.random() * 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, -3, z]}>
            {/* Tronco */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.4, 4, 8]} />
              <meshStandardMaterial color="#654321" roughness={0.9} />
            </mesh>
            {/* Copa del árbol */}
            <mesh position={[0, 3, 0]} castShadow>
              <sphereGeometry args={[2, 8, 8]} />
              <meshStandardMaterial
                color="#228b22"
                roughness={0.7}
              />
            </mesh>
          </group>
        );
      })}

      {/* Flores brillantes */}
      {[...Array(30)].map((_, i) => {
        const x = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        const colors = ['#ff69b4', '#ff1493', '#ff00ff', '#9370db', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return (
          <group key={i} position={[x, -2.5, z]}>
            <mesh>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
              />
            </mesh>
            <pointLight
              position={[0, 0.2, 0]}
              color={color}
              intensity={0.3}
              distance={2}
            />
          </group>
        );
      })}

      {/* Mariposas (partículas) */}
      <Sparkles
        count={50}
        scale={20}
        size={3}
        speed={0.5}
        color="#ffffff"
        opacity={0.8}
      />

      {/* Cielo del jardín */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0.6}
        azimuth={0.25}
      />

      {/* Iluminación natural */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#fffacd"
        castShadow
      />
      <ambientLight intensity={0.4} color="#87ceeb" />
    </group>
  );
};

// Cosmos Estelar
export const StellarCosmos = () => {
  const nebulasRef = useRef();

  useFrame((state) => {
    if (nebulasRef.current) {
      nebulasRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group>
      {/* Estrellas de fondo */}
      <Stars
        radius={100}
        depth={50}
        count={10000}
        factor={6}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Nebulosas */}
      <group ref={nebulasRef}>
        {[...Array(5)].map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 15;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const colors = ['#9370db', '#4169e1', '#ff69b4', '#00ced1', '#ff00ff'];

          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[3, 32, 32]} />
              <meshStandardMaterial
                color={colors[i]}
                transparent
                opacity={0.3}
                emissive={colors[i]}
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* Planetas */}
      {[...Array(3)].map((_, i) => {
        const angle = (i / 3) * Math.PI * 2 + Math.PI / 3;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const sizes = [1.5, 2, 1.2];
        const planetColors = ['#ff8c00', '#4169e1', '#32cd32'];

        return (
          <group key={i} position={[x, i * 3 - 3, z]}>
            <mesh castShadow>
              <sphereGeometry args={[sizes[i], 32, 32]} />
              <meshStandardMaterial
                color={planetColors[i]}
                emissive={planetColors[i]}
                emissiveIntensity={0.2}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            <pointLight
              color={planetColors[i]}
              intensity={0.5}
              distance={10}
            />
          </group>
        );
      })}

      {/* Partículas cósmicas */}
      <Sparkles
        count={300}
        scale={30}
        size={1.5}
        speed={0.2}
        color="#ffffff"
        opacity={0.4}
      />

      {/* Iluminación cósmica */}
      <ambientLight intensity={0.2} color="#1a1a2e" />
      <pointLight position={[0, 0, 0]} color="#ffffff" intensity={1} distance={50} />
      <pointLight position={[10, 10, 10]} color="#9370db" intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#4169e1" intensity={0.5} />
    </group>
  );
};

// Santuario de Luz
export const LightSanctuary = () => {
  const raysRef = useRef();

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      {/* Piso luminoso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Rayos de luz */}
      <group ref={raysRef}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.cos(angle) * 0.1;
          const z = Math.sin(angle) * 0.1;

          return (
            <mesh
              key={i}
              position={[x, 5, z]}
              rotation={[0, angle, 0]}
            >
              <coneGeometry args={[0.5, 10, 4, 1, true]} />
              <meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={0.2}
                emissive="#ffffff"
                emissiveIntensity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>

      {/* Esferas de luz flotantes */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 2) * 2;

        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1}
                transparent
                opacity={0.8}
              />
            </mesh>
            <pointLight
              color="#ffffff"
              intensity={1}
              distance={5}
            />
          </group>
        );
      })}

      {/* Partículas de luz */}
      <Sparkles
        count={500}
        scale={20}
        size={1}
        speed={0.2}
        color="#ffffff"
        opacity={0.6}
      />

      {/* Iluminación del santuario */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 10, 0]} color="#ffffff" intensity={2} distance={30} />
      <pointLight position={[5, 5, 5]} color="#ffd700" intensity={0.5} />
      <pointLight position={[-5, 5, -5]} color="#87ceeb" intensity={0.5} />
    </group>
  );
};

// Componente selector de ambiente
const SacredEnvironments = ({ environment = 'temple' }) => {
  switch (environment) {
    case 'temple':
      return <CelestialTemple />;
    case 'garden':
      return <AngelicGarden />;
    case 'cosmos':
      return <StellarCosmos />;
    case 'sanctuary':
      return <LightSanctuary />;
    default:
      return <CelestialTemple />;
  }
};

export default SacredEnvironments;

