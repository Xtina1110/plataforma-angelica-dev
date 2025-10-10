import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
// import { Card, CardContent } from "@/components/ui/card";
import ARControls from './ARControls';
import AREffects from './AREffects';

const ARCardModel = ({ cardData, position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial 
          map={cardData.texture} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      <AREffects />
    </group>
  );
};

const ARCardViewerWebXR = ({ selectedCards = [] }) => {
  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          {selectedCards.map((card, index) => (
            <ARCardModel
              key={card.id}
              cardData={card}
              position={[(index - 1) * 3, 0, 0]}
            />
          ))}
          
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="bg-background/80 backdrop-blur">
          <CardContent className="p-4">
            <ARControls 
              onCapture={() => console.log('Capture AR')}
              onShare={() => console.log('Share AR')}
              onReset={() => console.log('Reset AR')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARCardViewerWebXR;