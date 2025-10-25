import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Volume2, VolumeX, Maximize, Minimize, Settings, Camera, RotateCcw } from 'lucide-react';
import SacredEnvironments from './SacredEnvironments';

// Componente de Carta 3D Individual (versión mejorada)
const Card3D = ({ position, rotation, cardData, isFlipped, onSelect, isSelected, index, quality }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [localFlipped, setLocalFlipped] = useState(isFlipped);

  // Animación de hover y selección
  useFrame((state) => {
    if (!meshRef.current) return;

    // Efecto de levitación cuando está en hover
    if (hovered && !isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.3;
      meshRef.current.scale.setScalar(1.1);
    } else if (isSelected) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.5;
      meshRef.current.scale.setScalar(1.15);
    } else {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        position[1],
        0.1
      );
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }

    // Rotación suave al voltear
    const targetRotation = localFlipped ? Math.PI : 0;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation + rotation[1],
      0.1
    );

    // Brillo cuando está seleccionada
    if (isSelected) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
      meshRef.current.material.emissiveIntensity = pulse;
    } else {
      meshRef.current.material.emissiveIntensity = 0;
    }
  });

  useEffect(() => {
    setLocalFlipped(isFlipped);
  }, [isFlipped]);

  const handleClick = () => {
    if (!localFlipped) {
      setLocalFlipped(true);
      onSelect(index);
    }
  };

  // Colores según el arcángel
  const getCardColor = () => {
    if (!cardData) return '#9333ea';
    const colors = {
      'Miguel': '#ff0000',
      'Gabriel': '#0066ff',
      'Rafael': '#00ff00',
      'Uriel': '#ffaa00',
      'Chamuel': '#ff69b4',
      'Jophiel': '#ffff00',
      'Zadkiel': '#9400d3'
    };
    return colors[cardData.archangel] || '#9333ea';
  };

  const particleCount = quality === 'high' ? 30 : quality === 'medium' ? 15 : 5;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.5, 2.5, 0.05]} />
        <meshStandardMaterial
          color={localFlipped ? getCardColor() : '#1a1a2e'}
          emissive={getCardColor()}
          emissiveIntensity={isSelected ? 0.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Aura de luz alrededor de la carta */}
      {(hovered || isSelected) && (
        <pointLight
          position={[position[0], position[1], position[2] + 0.5]}
          color={getCardColor()}
          intensity={isSelected ? 2 : 1}
          distance={3}
        />
      )}

      {/* Partículas doradas cuando está seleccionada */}
      {isSelected && quality !== 'low' && (
        <Sparkles
          count={particleCount}
          scale={3}
          size={2}
          speed={0.4}
          color="#ffd700"
          position={position}
        />
      )}
    </group>
  );
};

// Componente de Escena 3D
const Scene3D = ({ 
  cards, 
  onCardSelect, 
  selectedCards, 
  environment, 
  quality,
  cameraControlsRef 
}) => {
  const [flippedCards, setFlippedCards] = useState([]);

  const handleCardSelect = (index) => {
    if (!flippedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
      if (onCardSelect) {
        onCardSelect(cards[index], index);
      }
    }
  };

  // Posiciones para diferentes modalidades
  const getCardPositions = () => {
    const count = cards.length;
    
    if (count === 3) {
      return [
        [-2.5, 0, 0],
        [0, 0, 0],
        [2.5, 0, 0]
      ];
    } else if (count === 6) {
      return [
        [0, 2, 0],
        [-2, 0, 0],
        [0, 0, 0],
        [2, 0, 0],
        [0, -2, 0],
        [0, 0, -1]
      ];
    } else if (count === 9) {
      return [
        [-3, 2, 0],
        [0, 2, 0],
        [3, 2, 0],
        [-3, 0, 0],
        [0, 0, 0],
        [3, 0, 0],
        [-3, -2, 0],
        [0, -2, 0],
        [3, -2, 0]
      ];
    }
    
    return [[0, 0, 0]];
  };

  const positions = getCardPositions();
  const shadowMapSize = quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      
      {/* Iluminación base */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={quality !== 'low'}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
      />

      {/* Ambiente sagrado */}
      <Suspense fallback={null}>
        <SacredEnvironments environment={environment} />
      </Suspense>

      {/* Cartas */}
      {cards.map((card, index) => (
        <Card3D
          key={index}
          position={positions[index]}
          rotation={[0, 0, 0]}
          cardData={card}
          isFlipped={flippedCards.includes(index)}
          onSelect={handleCardSelect}
          isSelected={selectedCards.includes(index)}
          index={index}
          quality={quality}
        />
      ))}

      {/* Controles de cámara */}
      <OrbitControls
        ref={cameraControlsRef}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

// Componente Principal de Experiencia Inmersiva
const ImmersiveCardExperience = ({ 
  cards = [],
  onCardSelect,
  selectedCards = [],
  onComplete
}) => {
  const [environment, setEnvironment] = useState('temple');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState('medium');
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const cameraControlsRef = useRef(null);

  // Música de fondo por ambiente
  const environmentMusic = {
    temple: '/audio/temple-ambient.mp3',
    garden: '/audio/garden-ambient.mp3',
    cosmos: '/audio/cosmos-ambient.mp3',
    sanctuary: '/audio/sanctuary-ambient.mp3'
  };

  // Control de audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isAudioEnabled) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioEnabled, volume, environment]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Reset camera
  const resetCamera = () => {
    if (cameraControlsRef.current) {
      cameraControlsRef.current.reset();
    }
  };

  // Ambientes disponibles
  const environments = [
    { id: 'temple', name: 'Templo Celestial', icon: '🏛️', color: '#ffd700' },
    { id: 'garden', name: 'Jardín Angelical', icon: '🌸', color: '#228b22' },
    { id: 'cosmos', name: 'Cosmos Estelar', icon: '🌌', color: '#9370db' },
    { id: 'sanctuary', name: 'Santuario de Luz', icon: '✨', color: '#ffffff' }
  ];

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black overflow-hidden"
    >
      {/* Audio de fondo */}
      <audio
        ref={audioRef}
        src={environmentMusic[environment]}
        loop
        preload="auto"
      />

      {/* Canvas 3D */}
      <Canvas shadows={quality !== 'low'}>
        <Scene3D
          cards={cards}
          onCardSelect={onCardSelect}
          selectedCards={selectedCards}
          environment={environment}
          quality={quality}
          cameraControlsRef={cameraControlsRef}
        />
      </Canvas>

      {/* Panel de información superior */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 text-white border border-white/20">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            ✨ Experiencia Inmersiva 3D
          </h2>
          <p className="text-sm text-white/80">
            Selecciona {cards.length} carta{cards.length > 1 ? 's' : ''}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedCards.length / cards.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/60 whitespace-nowrap">
              {selectedCards.length}/{cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* Selector de ambientes */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-white/20">
          <p className="text-white text-xs font-semibold mb-2">Ambiente Sagrado</p>
          <div className="grid grid-cols-2 gap-2">
            {environments.map((env) => (
              <button
                key={env.id}
                onClick={() => setEnvironment(env.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  environment === env.id
                    ? 'bg-white/30 text-white border-2 border-white/50'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
                style={{
                  borderColor: environment === env.id ? env.color : 'transparent'
                }}
              >
                <span className="mr-1">{env.icon}</span>
                {env.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controles de audio y cámara */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        {/* Audio */}
        <button
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          className="bg-black/50 backdrop-blur-md rounded-xl p-3 text-white hover:bg-black/70 transition-all border border-white/20"
          title={isAudioEnabled ? 'Silenciar música' : 'Activar música'}
        >
          {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Control de volumen */}
        {isAudioEnabled && (
          <div className="bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 flex items-center gap-2 border border-white/20">
            <Volume2 size={16} className="text-white/70" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-purple-500"
            />
          </div>
        )}

        {/* Reset cámara */}
        <button
          onClick={resetCamera}
          className="bg-black/50 backdrop-blur-md rounded-xl p-3 text-white hover:bg-black/70 transition-all border border-white/20"
          title="Resetear cámara"
        >
          <RotateCcw size={20} />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="bg-black/50 backdrop-blur-md rounded-xl p-3 text-white hover:bg-black/70 transition-all border border-white/20"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-black/50 backdrop-blur-md rounded-xl p-3 text-white hover:bg-black/70 transition-all border border-white/20"
          title="Configuración de calidad"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <div className="absolute bottom-20 left-4 z-10">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 text-white border border-white/20">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Settings size={16} />
              Calidad Gráfica
            </h3>
            <div className="space-y-2">
              {['low', 'medium', 'high'].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    quality === q
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {q === 'low' && '⚡ Baja (Rápido)'}
                  {q === 'medium' && '⚖️ Media (Balanceado)'}
                  {q === 'high' && '✨ Alta (Máxima calidad)'}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/50 mt-3">
              {quality === 'low' && 'Menos efectos, mejor rendimiento'}
              {quality === 'medium' && 'Balance entre calidad y rendimiento'}
              {quality === 'high' && 'Máximos efectos visuales'}
            </p>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 text-white text-sm border border-white/20">
          <p className="mb-1 flex items-center gap-2">
            <Camera size={16} className="text-purple-400" />
            <span className="text-white/80">Click en carta para seleccionar</span>
          </p>
          <p className="mb-1 text-white/60">🔄 Arrastra para rotar vista</p>
          <p className="text-white/60">🔍 Scroll para zoom</p>
        </div>
      </div>

      {/* Botón de completar (cuando todas las cartas están seleccionadas) */}
      {selectedCards.length === cards.length && onComplete && (
        <div className="absolute bottom-20 right-4 z-10">
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-white/30"
          >
            ✨ Continuar con la Interpretación
          </button>
        </div>
      )}
    </div>
  );
};

export default ImmersiveCardExperience;

