import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import { supabase } from '../integrations/supabase/client';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';
import './AnalyticsDashboard.css';

// Registrar componentes de Chart.js
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

const AnalyticsDashboard = ({ userId }) => {
  const [analyticsData, setAnalyticsData] = useState({
    puntosLuzHistory: [],
    sesionesSemanales: [],
    tiempoPorApp: [],
    logros: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [userId]);

  const loadAnalyticsData = async () => {
    try {
      // Obtener datos de progreso
      const { data: progressData } = await supabase
        .from('user_progress_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(30);

      // Obtener sesiones por app
      const { data: sessionsData } = await supabase
        .from('user_sessions')
        .select('app_name, duration')
        .eq('user_id', userId);

      // Procesar datos
      const puntosLuzHistory = progressData?.map(item => ({
        fecha: new Date(item.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        puntos: item.light_points
      })) || [];

      // Agrupar sesiones por semana
      const sesionesSemanales = groupSessionsByWeek(sessionsData || []);

      // Calcular tiempo por app
      const tiempoPorApp = calculateTimePerApp(sessionsData || []);

      setAnalyticsData({
        puntosLuzHistory,
        sesionesSemanales,
        tiempoPorApp,
        logros: [
          { id: 1, nombre: 'Primera Sesión', completado: true },
          { id: 2, nombre: '7 Días Consecutivos', completado: true },
          { id: 3, nombre: '1000 Puntos de Luz', completado: true },
          { id: 4, nombre: '10 Canalizaciones', completado: false }
        ]
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupSessionsByWeek = (sessions) => {
    // Simulación de datos semanales
    return [
      { semana: 'Sem 1', sesiones: 5 },
      { semana: 'Sem 2', sesiones: 8 },
      { semana: 'Sem 3', sesiones: 12 },
      { semana: 'Sem 4', sesiones: 10 }
    ];
  };

  const calculateTimePerApp = (sessions) => {
    const appTimes = {
      'Apertura Angélica': 120,
      'Sonoterapia': 180,
      'Terapias': 90,
      'Academia': 240,
      'Mensaje Diario': 30
    };

    return Object.entries(appTimes).map(([app, tiempo]) => ({
      app,
      tiempo
    }));
  };

  // Configuración de gráficos
  const lineChartData = {
    labels: analyticsData.puntosLuzHistory.map(item => item.fecha),
    datasets: [
      {
        label: 'Puntos de Luz',
        data: analyticsData.puntosLuzHistory.map(item => item.puntos),
        borderColor: '#FFB300',
        backgroundColor: 'rgba(255, 179, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FFB300',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const barChartData = {
    labels: analyticsData.sesionesSemanales.map(item => item.semana),
    datasets: [
      {
        label: 'Sesiones Completadas',
        data: analyticsData.sesionesSemanales.map(item => item.sesiones),
        backgroundColor: [
          'rgba(110, 60, 188, 0.8)',
          'rgba(156, 39, 176, 0.8)',
          'rgba(179, 136, 255, 0.8)',
          'rgba(110, 60, 188, 0.8)'
        ],
        borderColor: [
          '#6E3CBC',
          '#9C27B0',
          '#B388FF',
          '#6E3CBC'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const doughnutChartData = {
    labels: analyticsData.tiempoPorApp.map(item => item.app),
    datasets: [
      {
        data: analyticsData.tiempoPorApp.map(item => item.tiempo),
        backgroundColor: [
          '#00BCD4',
          '#9C27B0',
          '#E91E63',
          '#4CAF50',
          '#B388FF'
        ],
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <TrendingUp className="loading-icon" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>Tu Progreso Espiritual</h2>
        <p>Visualiza tu evolución y logros alcanzados</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Puntos de Luz</p>
            <p className="stat-value">1,500</p>
            <p className="stat-change positive">+250 esta semana</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6E3CBC 0%, #5A2FA3 100%)' }}>
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Sesiones Totales</p>
            <p className="stat-value">35</p>
            <p className="stat-change positive">+12 este mes</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)' }}>
            <Target size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Días Consecutivos</p>
            <p className="stat-value">7</p>
            <p className="stat-change">Racha actual</p>
          </div>
        </div>

        <div className="stat-card-analytics">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)' }}>
            <Award size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Logros</p>
            <p className="stat-value">12/20</p>
            <p className="stat-change">60% completado</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Evolución de Puntos de Luz</h3>
          <div className="chart-container">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Sesiones Semanales</h3>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Tiempo por Aplicación</h3>
          <div className="chart-container">
            <Doughnut 
              data={doughnutChartData} 
              options={{
                ...chartOptions,
                scales: undefined
              }} 
            />
          </div>
        </div>
      </div>

      {/* Logros */}
      <div className="achievements-section">
        <h3>Logros Recientes</h3>
        <div className="achievements-grid">
          {analyticsData.logros.map(logro => (
            <div key={logro.id} className={`achievement-badge ${logro.completado ? 'completed' : 'locked'}`}>
              <Award size={32} />
              <p>{logro.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

