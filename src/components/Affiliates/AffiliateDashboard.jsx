import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { useAffiliates } from '@/hooks/useAffiliates';

const AffiliateDashboard = () => {
  const { userEarnings, referrals, generateAffiliateLink } = useAffiliates();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Afiliado</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ganancias Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              €{userEarnings?.total || 0}
            </div>
            <p className="text-muted-foreground">Comisiones acumuladas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referidos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referrals?.active || 0}</div>
            <p className="text-muted-foreground">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Este Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              €{userEarnings?.thisMonth || 0}
            </div>
            <p className="text-muted-foreground">Ganancia mensual</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tu Enlace de Afiliado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={generateAffiliateLink()}
              readOnly
              className="flex-1 p-2 border rounded-md bg-muted"
            />
            <Button onClick={() => navigator.clipboard.writeText(generateAffiliateLink())}>
              Copiar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Comparte este enlace para ganar 20% de comisión en cada venta
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateDashboard;