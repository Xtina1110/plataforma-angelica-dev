import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";

const ReminderSystemMultiChannel = () => {
  const [reminders, setReminders] = useState([]);
  const [channels] = useState(['email', 'sms', 'push', 'whatsapp']);

  const createReminder = (type, message, schedule) => {
    const newReminder = {
      id: Date.now(),
      type,
      message,
      schedule,
      channels: ['email'],
      active: true,
      created: new Date()
    };
    setReminders([...reminders, newReminder]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Sistema de Recordatorios Angélicos</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear Recordatorio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select className="w-full p-2 border rounded-md">
              <option value="daily_message">Mensaje Diario</option>
              <option value="consultation">Consulta Programada</option>
              <option value="meditation">Meditación</option>
              <option value="energy_cleansing">Limpieza Energética</option>
            </select>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Canales de Notificación</label>
              <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Checkbox id={channel} />
                    <label htmlFor={channel} className="text-sm capitalize">
                      {channel}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => createReminder('daily_message', 'Tu mensaje angélico te espera', 'daily')}
              className="w-full"
            >
              Crear Recordatorio
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recordatorios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={reminder.active ? "default" : "secondary"}>
                      {reminder.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {reminder.schedule}
                    </span>
                  </div>
                  <p className="text-sm">{reminder.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex space-x-1">
                      {reminder.channels.map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReminderSystemMultiChannel;