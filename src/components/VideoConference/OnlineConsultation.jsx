import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import VideoCallSystem from './VideoCallSystem';

const OnlineConsultation = () => {
  const [consultationActive, setConsultationActive] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Consulta Angélica Online</h1>
          </div>
          <Badge variant={consultationActive ? "default" : "secondary"}>
            {consultationActive ? "En Sesión" : "Disponible"}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoCallSystem />
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notas de Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Anota los mensajes angélicos recibidos..."
                  className="w-full h-32 p-3 border rounded-md resize-none"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nombre:</span>
                  <span className="text-sm font-medium">María González</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duración:</span>
                  <span className="text-sm font-medium">60 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="text-sm font-medium">Lectura Angélica</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineConsultation;