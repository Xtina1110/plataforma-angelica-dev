import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Mock data - replace with actual API call
    setPayments([
      {
        id: 'pay_001',
        date: '2024-01-15',
        plan: 'Premium',
        amount: 19.99,
        currency: 'EUR',
        status: 'completed',
        method: 'Tarjeta **** 4242',
        invoice_url: '#'
      },
      {
        id: 'pay_002',
        date: '2023-12-15',
        plan: 'Básico',
        amount: 9.99,
        currency: 'EUR',
        status: 'completed',
        method: 'PayPal',
        invoice_url: '#'
      },
      {
        id: 'pay_003',
        date: '2023-11-15',
        plan: 'Premium',
        amount: 19.99,
        currency: 'EUR',
        status: 'refunded',
        method: 'Tarjeta **** 4242',
        invoice_url: '#'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallido';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(payment => payment.status === filter);

  const downloadInvoice = (payment) => {
    // Implementation for downloading invoice
    console.log('Downloading invoice for payment:', payment.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historial de Pagos</CardTitle>
          <div className="flex space-x-2">
            {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'Todos' : getStatusText(status)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay pagos en el historial
            </p>
          ) : (
            filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{payment.plan}</span>
                    <Badge variant={getStatusColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString('es-ES')} • {payment.method}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {payment.id}
                  </p>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="font-semibold">
                    {payment.currency} {payment.amount}
                  </div>
                  {payment.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadInvoice(payment)}
                    >
                      📄 Factura
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {payments.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline">
              Exportar Historial
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;