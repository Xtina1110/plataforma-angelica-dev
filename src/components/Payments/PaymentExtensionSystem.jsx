import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { usePayments } from '@/hooks/usePayments';

const PaymentExtensionSystem = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const { processPayment, paymentMethods, subscriptions } = usePayments();

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 9.99,
      features: ['3 consultas/mes', 'Cartas básicas', 'Soporte email'],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      features: ['Consultas ilimitadas', 'Todas las cartas', 'IA avanzada', 'Soporte prioritario'],
      popular: true
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 39.99,
      features: ['Todo Premium', 'Consultas en vivo', 'AR exclusivo', 'Coach personal'],
      popular: false
    }
  ];

  const handlePayment = async (planId) => {
    try {
      await processPayment({
        planId,
        paymentMethod,
        amount: plans.find(p => p.id === planId)?.price
      });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Planes de Suscripción Angélicos</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                Más Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                €{plan.price}
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePayment(plan.id)}
              >
                Suscribirse
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={paymentMethod === 'stripe' ? "default" : "outline"}
              onClick={() => setPaymentMethod('stripe')}
            >
              💳 Tarjeta
            </Button>
            <Button
              variant={paymentMethod === 'paypal' ? "default" : "outline"}
              onClick={() => setPaymentMethod('paypal')}
            >
              🅿️ PayPal
            </Button>
            <Button
              variant={paymentMethod === 'crypto' ? "default" : "outline"}
              onClick={() => setPaymentMethod('crypto')}
            >
              ₿ Crypto
            </Button>
            <Button
              variant={paymentMethod === 'bank' ? "default" : "outline"}
              onClick={() => setPaymentMethod('bank')}
            >
              🏦 Banco
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentExtensionSystem;