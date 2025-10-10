import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { useAffiliates } from '@/hooks/useAffiliates';

const AffiliateSystemComplete = () => {
  const { affiliates, earnings, addAffiliate } = useAffiliates();
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sistema de Afiliados Angélicos</h1>
        <Button onClick={() => setShowRegistration(true)}>
          Nuevo Afiliado
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Afiliados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{affiliates?.length || 0}</div>
            <p className="text-muted-foreground">Activos este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comisiones Generadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              €{earnings?.total || 0}
            </div>
            <p className="text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversión Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12%</div>
            <p className="text-muted-foreground">Tasa de éxito</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Afiliados Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {affiliates?.map((affiliate) => (
              <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{affiliate.name}</h3>
                  <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={affiliate.status === 'active' ? 'default' : 'secondary'}>
                    {affiliate.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    €{affiliate.earnings} generados
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateSystemComplete;