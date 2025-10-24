import React from 'react';
import { Building, Users, Calendar, DollarSign } from 'lucide-react';

const CenterDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold">🏢 Dashboard de Centro</h1>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Users size={32} className="text-purple-600 mb-4" />
          <p className="text-3xl font-bold">12</p>
          <p className="text-gray-600">Consultores</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Calendar size={32} className="text-blue-600 mb-4" />
          <p className="text-3xl font-bold">89</p>
          <p className="text-gray-600">Sesiones del Mes</p>
        </div>
      </div>
    </div>
  </div>
);

export default CenterDashboard;
