import React from 'react';
import { Link, DollarSign, TrendingUp, Users } from 'lucide-react';

const AffiliateDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold">🔗 Dashboard de Afiliado</h1>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <DollarSign size={32} className="text-green-600 mb-4" />
          <p className="text-3xl font-bold">$2,450</p>
          <p className="text-gray-600">Comisiones del Mes</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Users size={32} className="text-blue-600 mb-4" />
          <p className="text-3xl font-bold">67</p>
          <p className="text-gray-600">Referidos</p>
        </div>
      </div>
    </div>
  </div>
);

export default AffiliateDashboard;
