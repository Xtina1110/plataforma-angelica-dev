import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { useAffiliates } from '@/hooks/useAffiliates';

const AffiliateRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    socialMedia: ''
  });
  const { registerAffiliate } = useAffiliates();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAffiliate(formData);
      onClose();
    } catch (error) {
      console.error('Error registering affiliate:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registro de Afiliado Angélico</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Nombre completo"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <Input
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          
          <textarea
            placeholder="Experiencia en el ámbito espiritual"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="w-full p-2 border rounded-md h-24 resize-none"
          />
          
          <Input
            placeholder="Redes sociales (opcional)"
            value={formData.socialMedia}
            onChange={(e) => setFormData({...formData, socialMedia: e.target.value})}
          />
          
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Registrarme
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AffiliateRegistration;