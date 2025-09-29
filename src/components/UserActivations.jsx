import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserActivations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const { baseUrl } = useAuth();

  const periodOptions = [
    { value: 'all', label: 'Tüm Zamanlar' },
    { value: '30days', label: 'Son 30 Gün' },
    { value: '7days', label: 'Son 7 Gün' }
  ];

  const fetchUserActivations = async (period) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${baseUrl}/stats/user-activations?period=${period}`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Veriler yüklenirken hata oluştu');
      }
    } catch (err) {
      console.error('Kullanıcı aktivasyonları yüklenirken hata:', err);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchUserActivations(period);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-500 bg-red-50 border-red-200';
      case 'support': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'tester': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return 'bi-shield-check';
      case 'support': return 'bi-headset';
      case 'tester': return 'bi-bug';
      default: return 'bi-person';
    }
  };

  return (
    <div className="modern-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-people-fill text-blue-500"></i>
          </div>
          <div className="header-text">
            <h1>Kişi Bazlı Aktivasyon İstatistikleri</h1>
            <p>Kullanıcıların aktivasyon performansları ve detaylı analizleri</p>
          </div>
        </div>
        
        {/* Period Filter */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Zaman Aralığı:</label>
            <div className="filter-buttons">
              {periodOptions.map(option => (
                <button
                  key={option.value}
                  className={`filter-btn ${selectedPeriod === option.value ? 'active' : ''}`}
                  onClick={() => handlePeriodChange(option.value)}
                  disabled={loading}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spin">
              <i className="bi bi-arrow-repeat" style={{ fontSize: '2rem', color: '#8b5cf6' }}></i>
            </div>
            <p>Veriler yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-card">
          <div className="error-content">
            <i className="bi bi-exclamation-triangle text-red-500"></i>
            <h3>Hata</h3>
            <p>{error}</p>
            <button 
              className="action-btn primary" 
              onClick={() => fetchUserActivations(selectedPeriod)}
            >
              <i className="bi bi-arrow-repeat"></i>
              Tekrar Dene
            </button>
          </div>
        </div>
      )}

      {/* Warning Alert */}
      {data && data.warning && (
        <div className="warning-alert">
          <div className="warning-content">
            <i className="bi bi-exclamation-triangle text-orange-500"></i>
            <div className="warning-text">
              <h4>Veri Uyarısı</h4>
              <p>{data.warning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      {data && !loading && !error && (
        <>
          {/* Summary Stats */}
          <div className="content-grid">
            <div className="config-card">
              <div className="card-header">
                <div className="card-title">
                  <i className="bi bi-graph-up text-green-500"></i>
                  <span>Genel İstatistikler</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="info-card">
                    <div className="info-icon">
                      <i className="bi bi-people text-blue-500"></i>
                    </div>
                    <div className="info-content">
                      <h3>{formatNumber(data.total_stats.total_users)}</h3>
                      <p>Aktif Kullanıcı</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">
                      <i className="bi bi-lightning text-yellow-500"></i>
                    </div>
                    <div className="info-content">
                      <h3>{formatNumber(data.total_stats.total_activations)}</h3>
                      <p>Toplam Aktivasyon</p>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">
                      <i className="bi bi-calculator text-purple-500"></i>
                    </div>
                    <div className="info-content">
                      <h3>{data.total_stats.average_activations_per_user}</h3>
                      <p>Ortalama/Kullanıcı</p>
                    </div>
                  </div>
                  {data.total_stats.most_active_user && (
                    <div className="info-card">
                      <div className="info-icon">
                        <i className="bi bi-trophy text-orange-500"></i>
                      </div>
                      <div className="info-content">
                        <h3>{data.total_stats.most_active_user.name}</h3>
                        <p>{formatNumber(data.total_stats.most_active_user.activations)} aktivasyon</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="config-card">
            <div className="card-header">
              <div className="card-title">
                <i className="bi bi-list-ul text-indigo-500"></i>
                <span>Kullanıcı Detayları</span>
              </div>
              <div className="card-actions">
                <span className="text-sm text-gray-500">
                  {periodOptions.find(p => p.value === selectedPeriod)?.label}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="user-list">
                {data.users.map((user, index) => (
                  <div key={user.sicil_no} className="user-card">
                    <div className="user-header">
                      <div className="user-rank">
                        <span className={`rank-badge ${index < 3 ? 'top' : ''}`}>
                          {index + 1}
                        </span>
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          <h3>{user.full_name}</h3>
                          <span className={`role-badge ${getRoleColor(user.role)}`}>
                            <i className={`bi ${getRoleIcon(user.role)}`}></i>
                            {user.role}
                          </span>
                        </div>
                        <div className="user-stats">
                          <div className="stat-item">
                            <i className="bi bi-lightning text-yellow-500"></i>
                            <span>{formatNumber(user.total_activations)} aktivasyon</span>
                          </div>
                          {user.last_activation && (
                            <div className="stat-item">
                              <i className="bi bi-calendar text-blue-500"></i>
                              <span>Son: {formatDate(user.last_activation)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="user-details">
                      <div className="detail-section">
                        <h4>Aktivasyon Tipleri</h4>
                        <div className="detail-items">
                          {Object.entries(user.by_type).map(([type, count]) => (
                            <div key={type} className="detail-item">
                              <span className="detail-label">{type}</span>
                              <span className="detail-value">{formatNumber(count)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Durumlar</h4>
                        <div className="detail-items">
                          {Object.entries(user.by_status).map(([status, count]) => (
                            <div key={status} className="detail-item">
                              <span className="detail-label">{status}</span>
                              <span className="detail-value">{formatNumber(count)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Ürünler</h4>
                        <div className="detail-items">
                          {Object.entries(user.by_product).slice(0, 5).map(([product, count]) => (
                            <div key={product} className="detail-item">
                              <span className="detail-label">{product}</span>
                              <span className="detail-value">{formatNumber(count)}</span>
                            </div>
                          ))}
                          {Object.keys(user.by_product).length > 5 && (
                            <div className="detail-item">
                              <span className="detail-label">+{Object.keys(user.by_product).length - 5} daha</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Initial Load Button */}
      {!data && !loading && !error && (
        <div className="empty-state">
          <div className="empty-content">
            <i className="bi bi-graph-up" style={{ fontSize: '4rem', color: '#8b5cf6' }}></i>
            <h3>Kişi Bazlı Aktivasyon İstatistikleri</h3>
            <p>Kullanıcıların aktivasyon performanslarını görüntülemek için yukarıdaki filtrelerden birini seçin</p>
            <button 
              className="action-btn primary large"
              onClick={() => fetchUserActivations(selectedPeriod)}
            >
              <i className="bi bi-play-circle"></i>
              Verileri Yükle
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .filter-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-label {
          font-weight: 500;
          color: #374151;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          color: #374151;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .filter-btn.active {
          background: #8b5cf6;
          color: white;
          border-color: #8b5cf6;
        }

        .filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-content {
          text-align: center;
        }

        .error-card {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
        }

        .error-content i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .user-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .user-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          background: white;
          transition: all 0.2s;
        }

        .user-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .user-rank {
          flex-shrink: 0;
        }

        .rank-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: #f3f4f6;
          color: #374151;
          font-weight: bold;
          font-size: 1.125rem;
        }

        .rank-badge.top {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .user-name h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid;
        }

        .user-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .user-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .detail-section h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .detail-items {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.25rem 0;
          font-size: 0.875rem;
        }

        .detail-label {
          color: #6b7280;
        }

        .detail-value {
          font-weight: 500;
          color: #111827;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .empty-content {
          text-align: center;
          max-width: 400px;
        }

        .empty-content i {
          margin-bottom: 1rem;
        }

        .empty-content h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
        }

        .empty-content p {
          margin: 0 0 1.5rem 0;
          color: #6b7280;
        }

        .action-btn.large {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .warning-alert {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .warning-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .warning-content i {
          font-size: 1.5rem;
          margin-top: 0.125rem;
        }

        .warning-text h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #92400e;
        }

        .warning-text p {
          margin: 0;
          font-size: 0.875rem;
          color: #92400e;
        }
      `}</style>
    </div>
  );
};

export default UserActivations;
