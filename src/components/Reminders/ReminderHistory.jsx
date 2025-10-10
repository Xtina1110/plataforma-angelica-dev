import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

const ReminderHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    setHistory([
      {
        id: 1,
        type: 'daily_message',
        message: 'Tu mensaje angélico de hoy te espera',
        sent_at: '2024-01-15T09:00:00Z',
        channel: 'email',
        status: 'delivered'
      },
      {
        id: 2,
        type: 'consultation',
        message: 'Recordatorio: Consulta angélica en 1 hora',
        sent_at: '2024-01-15T14:00:00Z',
        channel: 'push',
        status: 'delivered'
      },
      {
        id: 3,
        type: 'meditation',
        message: 'Es momento de tu sesión de meditación',
        sent_at: '2024-01-15T18:00:00Z',
        channel: 'sms',
        status: 'failed'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return '📧';
      case 'sms': return '📱';
      case 'push': return '🔔';
      case 'whatsapp': return '💚';
      default: return '📬';
    }
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.status === filter);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historial de Recordatorios</CardTitle>
          <div className="flex space-x-2">
            {['all', 'delivered', 'pending', 'failed'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType)}
              >
                {filterType === 'all' ? 'Todos' : filterType}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay recordatorios en el historial
            </p>
          ) : (
            filteredHistory.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getChannelIcon(reminder.channel)}</span>
                  <div>
                    <p className="font-medium">{reminder.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reminder.sent_at).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {reminder.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getStatusColor(reminder.status)}>
                    {reminder.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderHistory;