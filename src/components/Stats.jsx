import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import UserActivations from './UserActivations';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#4ECDC4', '#82ca9d', '#ffc658', '#ff7300'];

const Stats = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { baseUrl } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

    const fetchStats = async () => {
      try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/stats/system`);
      const data = await response.json();
      
      if (data.success) {
        setStatsData(data.data);
      } else {
        setError('İstatistikler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('İstatistikler yüklenirken hata:', err);
      setError('İstatistikler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercentage = (num) => {
    return `${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="modern-page">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spin mb-3">
              <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem', color: '#8b5cf6' }}></i>
            </div>
            <p className="text-muted">İstatistikler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="modern-page">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
            <h3 className="mt-3">Hata</h3>
            <p className="text-muted">{error || 'İstatistikler yüklenemedi'}</p>
            <button className="action-btn primary" onClick={fetchStats}>
              <i className="bi bi-arrow-repeat"></i>
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Veri hazırlama
  const activationTypeData = Object.entries(statsData.activations.by_type).map(([name, value]) => ({
    name,
    value,
    color: COLORS[Object.keys(statsData.activations.by_type).indexOf(name) % COLORS.length]
  }));

  const activationStatusData = Object.entries(statsData.activations.by_status).map(([name, value]) => ({
    name,
    value,
    color: COLORS[Object.keys(statsData.activations.by_status).indexOf(name) % COLORS.length]
  }));

  const last30DaysData = statsData.activations.last_30_days_trend;

  return (
    <div className="modern-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-graph-up text-purple-500"></i>
          </div>
          <div className="header-text">
            <h1>Sistem İstatistikleri</h1>
            <p>Kapsamlı sistem analizi ve kullanım raporları</p>
          </div>
        </div>
        <div className="stats-badge">
          <i className="bi bi-calendar3"></i>
          <span>Son Güncelleme: {new Date(statsData.generated_at).toLocaleString('tr-TR')}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-graph-up"></i>
            Genel Bakış
          </button>
          <button
            className={`tab-btn ${activeTab === 'user-activations' ? 'active' : ''}`}
            onClick={() => setActiveTab('user-activations')}
          >
            <i className="bi bi-people-fill"></i>
            Kişi Bazlı Aktivasyonlar
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Ana İstatistik Kartları */}
          <div className="content-grid">
        <div className="config-card">
          <div className="card-header">
            <div className="card-title">
              <i className="bi bi-lightning-fill text-yellow-500"></i>
              <span>Aktivasyon İstatistikleri</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-graph-up text-green-500"></i>
                </div>
                <div className="info-content">
                  <h3>{formatNumber(statsData.activations.total_activations)}</h3>
                  <p>Toplam Aktivasyon</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-calendar-day text-blue-500"></i>
                </div>
                <div className="info-content">
                  <h3>{formatNumber(statsData.activations.average_daily_last_30_days)}</h3>
                  <p>Günlük Ortalama</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-calendar-week text-purple-500"></i>
                </div>
                <div className="info-content">
                  <h3>{formatNumber(statsData.activations.average_weekly_last_30_days)}</h3>
                  <p>Haftalık Ortalama</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="config-card">
          <div className="card-header">
            <div className="card-title">
              <i className="bi bi-bug-fill text-red-500"></i>
              <span>Feedback İstatistikleri</span>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-chat-dots text-blue-500"></i>
                </div>
                <div className="info-content">
                  <h3>{formatNumber(statsData.feedback.total_feedbacks)}</h3>
                  <p>Toplam Feedback</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <i className="bi bi-calendar-month text-purple-500"></i>
                </div>
                <div className="info-content">
                  <h3>{formatNumber(statsData.feedback.this_month)}</h3>
                  <p>Bu Ay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="content-grid">
        {/* Aktivasyon Tipleri */}
        <div className="config-card">
          <div className="card-header">
            <div className="card-title">
              <i className="bi bi-bar-chart text-green-500"></i>
              <span>Aktivasyon Tipleri</span>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activationTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Son 30 Günlük Trend */}
        <div className="config-card">
          <div className="card-header">
            <div className="card-title">
              <i className="bi bi-graph-up text-purple-500"></i>
              <span>Son 30 Günlük Aktivasyon Trendi</span>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={last30DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="activations" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
        </>
      )}

      {/* User Activations Tab */}
      {activeTab === 'user-activations' && (
        <UserActivations />
      )}

      <style jsx>{`
        .tab-navigation {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 2rem;
        }

        .tab-buttons {
          display: flex;
          gap: 0;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }

        .tab-btn:hover {
          color: #374151;
          background: #f9fafb;
        }

        .tab-btn.active {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
          background: #faf5ff;
        }

        .tab-btn i {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Stats; 