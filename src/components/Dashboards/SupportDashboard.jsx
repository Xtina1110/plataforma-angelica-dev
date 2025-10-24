import React from 'react';
import { MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const SupportDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold">💬 Dashboard de Soporte</h1>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <Clock size={32} className="text-yellow-600 mb-4" />
          <p className="text-3xl font-bold">12</p>
          <p className="text-gray-600">Tickets Pendientes</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <CheckCircle size={32} className="text-green-600 mb-4" />
          <p className="text-3xl font-bold">156</p>
          <p className="text-gray-600">Resueltos Hoy</p>
        </div>
      </div>
    </div>
  </div>
);

export default SupportDashboard;
