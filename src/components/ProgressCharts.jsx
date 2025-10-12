import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProgressCharts = ({ userData, userActivity }) => {
  // Datos de ejemplo para el gráfico de progreso semanal
  const weeklyProgressData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Puntos de Luz',
        data: [25, 45, 30, 60, 40, 55, userData?.light_points || 0],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  };

  // Datos para el gráfico de actividades
  const activitiesData = {
    labels: ['Tiradas', 'Sonoterapia', 'Canalizaciones', 'Meditaciones', 'Cursos'],
    datasets: [
      {
        label: 'Sesiones',
        data: [
          userData?.total_sessions || 0,
          Math.floor((userData?.total_sessions || 0) * 0.6),
          userData?.total_channeling_sessions || 0,
          Math.floor((userData?.total_sessions || 0) * 0.4),
          userData?.courses_completed || 0
        ],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderColor: [
          '#8B5CF6',
          '#3B82F6',
          '#EC4899',
          '#22C55E',
          '#FB923C'
        ],
        borderWidth: 2,
      }
    ]
  };

  // Datos para el gráfico de nivel espiritual
  const spiritualLevelData = {
    labels: ['Progreso Actual', 'Por Completar'],
    datasets: [
      {
        data: [
          userData?.light_points || 0,
          Math.max(0, 1000 - (userData?.light_points || 0))
        ],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(209, 213, 219, 0.3)'
        ],
        borderColor: [
          '#8B5CF6',
          '#D1D5DB'
        ],
        borderWidth: 2,
      }
    ]
  };

  // Opciones comunes para los gráficos
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#6B7280',
          font: {
            family: 'Poppins, sans-serif',
            size: 12
          },
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        borderColor: '#8B5CF6',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y || context.parsed;
            return label;
          }
        }
      }
    }
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: '70%',
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Progreso Semanal */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Progreso Semanal</h3>
            <p className="text-sm text-gray-500">Puntos de luz ganados</p>
          </div>
        </div>
        <div style={{ height: '250px' }}>
          <Line data={weeklyProgressData} options={lineOptions} />
        </div>
      </div>

      {/* Gráfico de Actividades */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Actividades Completadas</h3>
            <p className="text-sm text-gray-500">Distribución por tipo</p>
          </div>
        </div>
        <div style={{ height: '250px' }}>
          <Bar data={activitiesData} options={barOptions} />
        </div>
      </div>

      {/* Gráfico de Nivel Espiritual */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Target className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Nivel Espiritual</h3>
            <p className="text-sm text-gray-500">{userData?.spiritual_level || 'Iniciado'}</p>
          </div>
        </div>
        <div style={{ height: '250px' }} className="flex items-center justify-center">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <Doughnut data={spiritualLevelData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-purple-600">
                {userData?.light_points || 0}
              </span>
              <span className="text-sm text-gray-500">puntos</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {Math.max(0, 1000 - (userData?.light_points || 0))} puntos para el próximo nivel
          </p>
        </div>
      </div>

      {/* Estadísticas de Racha */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Racha de Días</h3>
            <p className="text-sm text-gray-500">Tu constancia espiritual</p>
          </div>
        </div>
        <div className="space-y-6 mt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg mb-3">
              <span className="text-4xl font-bold text-white">
                {userActivity?.consecutive_days || 0}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Días consecutivos</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {userActivity?.longest_streak || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Mejor racha</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">
                {userActivity?.total_logins || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total de visitas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;

