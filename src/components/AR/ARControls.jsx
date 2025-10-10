import React from 'react';
// import { Button } from "@/components/ui/button";

const ARControls = ({ onCapture, onShare, onReset }) => {
  return (
    <div className="flex justify-center space-x-4">
      <Button variant="outline" onClick={onCapture}>
        📸 Capturar
      </Button>
      <Button variant="outline" onClick={onShare}>
        📱 Compartir
      </Button>
      <Button variant="outline" onClick={onReset}>
        🔄 Reiniciar
      </Button>
    </div>
  );
};

export default ARControls;