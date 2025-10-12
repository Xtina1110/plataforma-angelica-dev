import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/**
 * Componente de una carta individual en el mazo
 */
const DeckCard = ({ position, rotation, delay, isShuffling }) => {
  const meshRef = useRef();
  const [targetPos, setTargetPos] = useState(position);
  const [targetRot, setTargetRot] = useState(rotation);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Animación suave hacia la posición objetivo
    meshRef.current.position.lerp(
      new THREE.Vector3(...targetPos),
      0.1
    );

    meshRef.current.rotation.set(...targetRot);

    // Animación de barajado
    if (isShuffling) {
      const time = state.clock.elapsedTime + delay;
      meshRef.current.position.y += Math.sin(time * 3) * 0.002;
      meshRef.current.rotation.z += Math.sin(time * 2) * 0.001;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
      <boxGeometry args={[0.6, 0.9, 0.01]} />
      <meshStandardMaterial
        color="#1a0033"
        metalness={0.5}
        roughness={0.3}
        emissive="#9370DB"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

/**
 * Componente del mazo completo
 */
const CardDeck = ({ cardCount = 33, isShuffling, phase }) => {
  const cards = Array.from({ length: cardCount }, (_, i) => ({
    position: [0, i * 0.002, 0],
    rotation: [0, 0, (Math.random() - 0.5) * 0.05],
    delay: i * 0.05
  }));

  // Fase 1: Mazo apilado
  if (phase === 'stacked') {
    return (
      <group position={[0, 0, 0]}>
        {cards.map((card, i) => (
          <DeckCard
            key={i}
            position={card.position}
            rotation={card.rotation}
            delay={card.delay}
            isShuffling={false}
          />
        ))}
      </group>
    );
  }

  // Fase 2: Barajando
  if (phase === 'shuffling') {
    return (
      <group>
        {cards.map((card, i) => {
          const side = i % 2 === 0 ? -1 : 1;
          const shufflePos = [
            side * 0.3,
            card.position[1] + Math.sin(i * 0.5) * 0.1,
            card.position[2]
          ];
          return (
            <DeckCard
              key={i}
              position={shufflePos}
              rotation={[0, 0, side * 0.2]}
              delay={card.delay}
              isShuffling={true}
            />
          );
        })}
      </group>
    );
  }

  // Fase 3: Abanico
  if (phase === 'fan') {
    return (
      <group>
        {cards.map((card, i) => {
          const angle = (i / (cardCount - 1) - 0.5) * Math.PI * 0.6;
          const radius = 1.5;
          const fanPos = [
            Math.sin(angle) * radius,
            card.position[1],
            Math.cos(angle) * radius - radius
          ];
          return (
            <DeckCard
              key={i}
              position={fanPos}
              rotation={[0, -angle, 0]}
              delay={card.delay}
              isShuffling={false}
            />
          );
        })}
      </group>
    );
  }

  return null;
};

/**
 * Componente de manos etéreas
 */
const EtherealHands = ({ phase }) => {
  const leftHandRef = useRef();
  const rightHandRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (phase === 'shuffling') {
      // Movimiento de barajado
      if (leftHandRef.current) {
        leftHandRef.current.position.x = -0.4 + Math.sin(time * 2) * 0.1;
        leftHandRef.current.position.y = 0.2 + Math.sin(time * 3) * 0.05;
      }
      if (rightHandRef.current) {
        rightHandRef.current.position.x = 0.4 + Math.sin(time * 2 + Math.PI) * 0.1;
        rightHandRef.current.position.y = 0.2 + Math.sin(time * 3 + Math.PI) * 0.05;
      }
    } else {
      // Posición de reposo
      if (leftHandRef.current) {
        leftHandRef.current.position.x = THREE.MathUtils.lerp(
          leftHandRef.current.position.x,
          -0.8,
          0.05
        );
        leftHandRef.current.position.y = THREE.MathUtils.lerp(
          leftHandRef.current.position.y,
          -0.5,
          0.05
        );
      }
      if (rightHandRef.current) {
        rightHandRef.current.position.x = THREE.MathUtils.lerp(
          rightHandRef.current.position.x,
          0.8,
          0.05
        );
        rightHandRef.current.position.y = THREE.MathUtils.lerp(
          rightHandRef.current.position.y,
          -0.5,
          0.05
        );
      }
    }
  });

  if (phase === 'fan') return null;

  return (
    <group>
      {/* Mano izquierda */}
      <mesh ref={leftHandRef} position={[-0.4, 0.2, 0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Mano derecha */}
      <mesh ref={rightHandRef} position={[0.4, 0.2, 0.5]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          emissive="#FFD700"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

/**
 * Mesa sagrada
 */
const SacredTable = () => {
  return (
    <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4, 3]} />
      <meshStandardMaterial
        color="#2d1b4e"
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  );
};

/**
 * Escena 3D del barajado
 */
const ShufflingScene = ({ phase, onPhaseComplete }) => {
  useEffect(() => {
    if (phase === 'stacked') {
      const timer = setTimeout(() => onPhaseComplete('shuffling'), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'shuffling') {
      const timer = setTimeout(() => onPhaseComplete('fan'), 2000);
      return () => clearTimeout(timer);
    } else if (phase === 'fan') {
      const timer = setTimeout(() => onPhaseComplete('complete'), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, onPhaseComplete]);

  return (
    <>
      {/* Cámara */}
      <perspectiveCamera 
        makeDefault 
        position={[0, 1.5, 3]} 
        fov={50}
        lookAt={[0, 0, 0]}
      />

      {/* Iluminación */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        color="#FFD700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#9370DB" />

      {/* Mesa */}
      <SacredTable />

      {/* Mazo de cartas */}
      <CardDeck 
        cardCount={33} 
        isShuffling={phase === 'shuffling'}
        phase={phase}
      />

      {/* Manos etéreas */}
      <EtherealHands phase={phase} />

      {/* Partículas doradas */}
      {phase === 'shuffling' && (
        <group>
          {Array.from({ length: 20 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 2,
                Math.random() * 1,
                (Math.random() - 0.5) * 1
              ]}
            >
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
};

/**
 * Componente principal de animación de barajado
 */
const ShufflingAnimation = ({ onComplete }) => {
  const [phase, setPhase] = useState('stacked');
  const [message, setMessage] = useState('El mazo angelical aparece...');

  const handlePhaseComplete = (nextPhase) => {
    setPhase(nextPhase);

    if (nextPhase === 'shuffling') {
      setMessage('Las manos angelicales barajean las cartas...');
    } else if (nextPhase === 'fan') {
      setMessage('Las cartas se extienden ante ti...');
    } else if (nextPhase === 'complete') {
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-b from-purple-900/50 to-indigo-900/50 rounded-xl overflow-hidden">
      {/* Escena 3D */}
      <Canvas shadows>
        <ShufflingScene phase={phase} onPhaseComplete={handlePhaseComplete} />
      </Canvas>

      {/* Mensaje */}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute bottom-8 left-0 right-0 text-center"
      >
        <p className="text-purple-100 text-lg font-medium drop-shadow-lg">
          {message}
        </p>
      </motion.div>

      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default ShufflingAnimation;

