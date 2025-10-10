import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AREffects = () => {
  const pointsRef = useRef();
  
  // Generate particle positions
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={particlePositions}>
      <PointMaterial
        color="#9333ea"
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </Points>
  );
};

export default AREffects;