import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useTexture, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Componente de Carta 3D Individual
const Card3D = ({ position, rotation, cardData, isFlipped, onSelect, isSelected, index }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [localFlipped, setLocalFlipped] = useState(isFlipped);

  // Animación de hover
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

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
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
      {isSelected && (
        <Sparkles
          count={30}
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

// Componente principal de Cartas 3D
const AngelicCard3D = ({ 
  cards = [], 
  onCardSelect, 
  selectedCards = [],
  environment = 'temple',
  showParticles = true 
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
      // Pasado, Presente, Futuro
      return [
        [-2.5, 0, 0],
        [0, 0, 0],
        [2.5, 0, 0]
      ];
    } else if (count === 6) {
      // Cruz Angelical
      return [
        [0, 2, 0],      // Arriba
        [-2, 0, 0],     // Izquierda
        [0, 0, 0],      // Centro
        [2, 0, 0],      // Derecha
        [0, -2, 0],     // Abajo
        [0, 0, -1]      // Fondo
      ];
    } else if (count === 9) {
      // Mandala Completo
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

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        
        {/* Iluminación */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#9333ea" />
        <pointLight position={[-5, 0, 0]} intensity={0.3} color="#3b82f6" />
        <pointLight position={[5, 0, 0]} intensity={0.3} color="#ec4899" />

        {/* Estrellas de fondo */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Partículas ambientales */}
        {showParticles && (
          <Sparkles
            count={100}
            scale={20}
            size={1}
            speed={0.2}
            color="#ffffff"
            opacity={0.3}
          />
        )}

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
          />
        ))}

        {/* Controles de cámara */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 text-white">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-4">
          <h2 className="text-2xl font-bold mb-2">✨ Cartas Angelicales 3D</h2>
          <p className="text-sm text-white/80">
            Selecciona {cards.length} carta{cards.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-white/60 mt-2">
            {flippedCards.length} / {cards.length} seleccionadas
          </p>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="absolute bottom-4 right-4 text-white">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 text-sm">
          <p className="mb-1">🖱️ Click para seleccionar carta</p>
          <p className="mb-1">🔄 Arrastra para rotar vista</p>
          <p>🔍 Scroll para zoom</p>
        </div>
      </div>
    </div>
  );
};

export default AngelicCard3D;

