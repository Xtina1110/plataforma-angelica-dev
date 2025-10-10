import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";

const ReminderSettings = () => {
  const [settings, setSettings] = useState({
    dailyMessage: { enabled: true, time: '09:00' },
    consultation: { enabled: true, advance: 24 },
    meditation: { enabled: false, time: '18:00' },
    energyCleansing: { enabled: false, frequency: 'weekly' }
  });

  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    push: true,
    whatsapp: false
  });

  const handleSettingChange = (type, key, value) => {
    setSettings(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: value }
    }));
  };

  const handleChannelChange = (channel, enabled) => {
    setChannels(prev => ({ ...prev, [channel]: enabled }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Recordatorios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Tipos de Recordatorio</h3>
            <div className="space-y-4">
              {Object.entries(settings).map(([type, config]) => (
                <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Checkbox
                      checked={config.enabled}
                      onCheckedChange={(checked) => handleSettingChange(type, 'enabled', checked)}
                    />
                    <span className="ml-2 font-medium capitalize">
                      {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                  </div>
                  {config.enabled && (
                    <div className="flex items-center space-x-2">
                      {config.time && (
                        <Input
                          type="time"
                          value={config.time}
                          onChange={(e) => handleSettingChange(type, 'time', e.target.value)}
                          className="w-20"
                        />
                      )}
                      {config.advance && (
                        <Input
                          type="number"
                          value={config.advance}
                          onChange={(e) => handleSettingChange(type, 'advance', parseInt(e.target.value))}
                          className="w-16"
                          min="1"
                          max="168"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Canales de Notificación</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(channels).map(([channel, enabled]) => (
                <div key={channel} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="capitalize">{channel}</span>
                  <Checkbox
                    checked={enabled}
                    onCheckedChange={(checked) => handleChannelChange(channel, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReminderSettings;