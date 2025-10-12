import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  Sky, 
  Stars,
  Cloud,
  OrbitControls,
  PerspectiveCamera
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * Configuración de ambientes sagrados
 */
export const SACRED_ENVIRONMENTS = {
  templo_celestial: {
    id: 'templo_celestial',
    nombre: 'Templo Celestial',
    descripcion: 'Columnas de mármol bajo un cielo estrellado',
    premium: false,
    config: {
      skyColor: '#1a0033',
      groundColor: '#2d1b4e',
      fogColor: '#4a2c6d',
      fogDensity: 0.02,
      stars: true,
      clouds: false,
      lighting: {
        ambient: { color: '#ffffff', intensity: 0.5 },
        directional: { color: '#FFD700', intensity: 1.2, position: [5, 10, 5] },
        point: { color: '#ffffff', intensity: 0.8, position: [0, 5, 0] }
      }
    }
  },
  
  jardin_eden: {
    id: 'jardin_eden',
    nombre: 'Jardín del Edén',
    descripcion: 'Naturaleza exuberante con cascadas celestiales',
    premium: true,
    config: {
      skyColor: '#87CEEB',
      groundColor: '#2d5016',
      fogColor: '#a8d5ba',
      fogDensity: 0.01,
      stars: false,
      clouds: true,
      lighting: {
        ambient: { color: '#ffffff', intensity: 0.7 },
        directional: { color: '#FFF8DC', intensity: 1.5, position: [10, 15, 5] },
        point: { color: '#90EE90', intensity: 0.6, position: [0, 3, 0] }
      }
    }
  },
  
  catedral_cristal: {
    id: 'catedral_cristal',
    nombre: 'Catedral de Cristal',
    descripcion: 'Cristales gigantes que refractan luz divina',
    premium: true,
    config: {
      skyColor: '#E0F7FA',
      groundColor: '#1a1a2e',
      fogColor: '#B2EBF2',
      fogDensity: 0.015,
      stars: false,
      clouds: false,
      lighting: {
        ambient: { color: '#00BCD4', intensity: 0.6 },
        directional: { color: '#00E5FF', intensity: 1.8, position: [0, 10, 0] },
        point: { color: '#80DEEA', intensity: 1.0, position: [0, 5, 0] }
      }
    }
  },
  
  nube_dorada: {
    id: 'nube_dorada',
    nombre: 'Nube Dorada',
    descripcion: 'Flotando entre nubes al amanecer',
    premium: false,
    config: {
      skyColor: '#FFB74D',
      groundColor: '#FF6F00',
      fogColor: '#FFCC80',
      fogDensity: 0.03,
      stars: false,
      clouds: true,
      lighting: {
        ambient: { color: '#FFF3E0', intensity: 0.8 },
        directional: { color: '#FFD54F', intensity: 2.0, position: [15, 5, 5] },
        point: { color: '#FFE082', intensity: 0.7, position: [0, 2, 0] }
      }
    }
  },
  
  biblioteca_akashica: {
    id: 'biblioteca_akashica',
    nombre: 'Biblioteca Akáshica',
    descripcion: 'Biblioteca infinita de sabiduría universal',
    premium: true,
    config: {
      skyColor: '#1a1a2e',
      groundColor: '#0f0f1e',
      fogColor: '#2d2d44',
      fogDensity: 0.025,
      stars: true,
      clouds: false,
      lighting: {
        ambient: { color: '#9C27B0', intensity: 0.4 },
        directional: { color: '#CE93D8', intensity: 1.0, position: [0, 8, 0] },
        point: { color: '#BA68C8', intensity: 0.9, position: [0, 4, 0] }
      }
    }
  }
};

/**
 * Componente de nubes flotantes
 */
const FloatingClouds = ({ count = 5 }) => {
  const clouds = Array.from({ length: count }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 50,
      Math.random() * 10 + 5,
      (Math.random() - 0.5) * 50
    ],
    scale: Math.random() * 2 + 1,
    speed: Math.random() * 0.001 + 0.0005
  }));

  return (
    <group>
      {clouds.map((cloud, i) => (
        <Cloud
          key={i}
          position={cloud.position}
          scale={cloud.scale}
          opacity={0.3}
          speed={cloud.speed}
          color="#ffffff"
        />
      ))}
    </group>
  );
};

/**
 * Componente de partículas flotantes (luciérnagas, mariposas, etc.)
 */
const FloatingParticles = ({ color = '#FFD700', count = 50 }) => {
  const particles = React.useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 30,
          Math.random() * 15,
          (Math.random() - 0.5) * 30
        ],
        scale: Math.random() * 0.05 + 0.02
      });
    }
    return temp;
  }, [count]);

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Componente de suelo con reflejo
 */
const GroundPlane = ({ color }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3}
        roughness={0.7}
        opacity={0.8}
        transparent
      />
    </mesh>
  );
};

/**
 * Componente principal del ambiente sagrado
 */
const SacredEnvironmentScene = ({ environmentId, children }) => {
  const env = SACRED_ENVIRONMENTS[environmentId] || SACRED_ENVIRONMENTS.templo_celestial;
  const config = env.config;

  return (
    <>
      {/* Cámara */}
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
      
      {/* Controles de órbita (opcional, deshabilitado por defecto) */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />

      {/* Cielo */}
      {config.stars ? (
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
      ) : (
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.6}
          azimuth={0.25}
        />
      )}

      {/* Niebla */}
      <fog attach="fog" args={[config.fogColor, 5, 50]} />

      {/* Iluminación */}
      <ambientLight 
        color={config.lighting.ambient.color} 
        intensity={config.lighting.ambient.intensity} 
      />
      
      <directionalLight
        color={config.lighting.directional.color}
        intensity={config.lighting.directional.intensity}
        position={config.lighting.directional.position}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <pointLight
        color={config.lighting.point.color}
        intensity={config.lighting.point.intensity}
        position={config.lighting.point.position}
        decay={2}
      />

      {/* Hemisferio de luz */}
      <hemisphereLight
        skyColor={config.skyColor}
        groundColor={config.groundColor}
        intensity={0.6}
      />

      {/* Suelo */}
      <GroundPlane color={config.groundColor} />

      {/* Nubes (si aplica) */}
      {config.clouds && <FloatingClouds count={8} />}

      {/* Partículas flotantes */}
      <FloatingParticles color={config.lighting.directional.color} count={30} />

      {/* Contenido (cartas, etc.) */}
      {children}

      {/* Post-procesamiento */}
      <EffectComposer>
        <Bloom 
          intensity={0.5} 
          luminanceThreshold={0.9} 
          luminanceSmoothing={0.9} 
        />
        <DepthOfField 
          focusDistance={0.01} 
          focalLength={0.02} 
          bokehScale={2} 
        />
      </EffectComposer>
    </>
  );
};

/**
 * Componente wrapper del ambiente sagrado
 */
const SacredEnvironment = ({ 
  environmentId = 'templo_celestial', 
  children,
  className = ''
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <SacredEnvironmentScene environmentId={environmentId}>
            {children}
          </SacredEnvironmentScene>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SacredEnvironment;

