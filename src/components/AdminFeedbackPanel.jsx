import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminFeedbackPanel = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({});
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        priority: '',
        search: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadFeedbacks();
        loadDashboardStats();
    }, []);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/feedback/admin/all');
            
            if (response.data.success) {
                setFeedbacks(response.data.data);
            }
        } catch (error) {
            console.error('Feedback\'ler yüklenirken hata:', error);
            showError('Feedback\'ler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardStats = async () => {
        try {
            const response = await axios.get('/feedback/admin/dashboard');
            
            if (response.data.success) {
                setDashboardStats(response.data.data);
            } else {
                console.error('Dashboard stats başarısız:', response.data.error);
            }
        } catch (error) {
            console.error('Dashboard istatistikleri yüklenirken hata:', error);
            console.error('Error response:', error.response?.data);
        }
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const handleStatusUpdate = async (feedbackId, newStatus, adminResponse = '') => {
        try {
            const response = await axios.put(`/feedback/admin/update/${feedbackId}`, {
                status: newStatus,
                admin_response: adminResponse
            });

            if (response.data.success) {
                setFeedbacks(prev => prev.map(feedback => 
                    feedback.id === feedbackId 
                        ? { ...feedback, status: newStatus, admin_response: adminResponse }
                        : feedback
                ));
                
                if (selectedFeedback && selectedFeedback.id === feedbackId) {
                    setSelectedFeedback(prev => ({
                        ...prev,
                        status: newStatus,
                        admin_response: adminResponse
                    }));
                }
                
                loadDashboardStats();
                showSuccess('Feedback durumu başarıyla güncellendi');
                
                if (adminResponse) {
                    setSelectedFeedback(null);
                }
            }
        } catch (error) {
            console.error('Durum güncellenirken hata:', error);
            showError('Durum güncellenirken hata oluştu');
        }
    };

    const handlePriorityUpdate = async (feedbackId, newPriority) => {
        try {
            const response = await axios.put(`/feedback/admin/update/${feedbackId}`, {
                priority: newPriority
            });

            if (response.data.success) {
                setFeedbacks(prev => prev.map(feedback => 
                    feedback.id === feedbackId 
                        ? { ...feedback, priority: newPriority }
                        : feedback
                ));
                
                if (selectedFeedback && selectedFeedback.id === feedbackId) {
                    setSelectedFeedback(prev => ({
                        ...prev,
                        priority: newPriority
                    }));
                }
                
                showSuccess('Öncelik başarıyla güncellendi');
            }
        } catch (error) {
            console.error('Öncelik güncellenirken hata:', error);
            showError('Öncelik güncellenirken hata oluştu');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'beklemede': 'warning',
            'inceleniyor': 'primary',
            'cozuldu': 'success',
            'eklendi': 'success',
            'reddedildi': 'danger'
        };
        return colors[status] || 'secondary';
    };

    const getStatusText = (status) => {
        const texts = {
            'beklemede': 'Beklemede',
            'inceleniyor': 'İnceleniyor',
            'cozuldu': 'Çözüldü',
            'eklendi': 'Eklendi',
            'reddedildi': 'Reddedildi'
        };
        return texts[status] || status;
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            'dusuk': 'bi-circle-fill text-green-500',
            'orta': 'bi-circle-fill text-yellow-500',
            'yuksek': 'bi-circle-fill text-orange-500',
            'kritik': 'bi-circle-fill text-red-500'
        };
        return icons[priority] || 'bi-circle-fill';
    };

    const getTypeIcon = (type) => {
        return type === 'hata' ? 'bi-bug-fill text-red-500' : 'bi-lightbulb-fill text-yellow-500';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Şimdi';
        if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
        return `${Math.floor(diffInMinutes / 1440)} gün önce`;
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        if (filters.status && feedback.status !== filters.status) return false;
        if (filters.type && feedback.type !== filters.type) return false;
        if (filters.priority && feedback.priority !== filters.priority) return false;
        if (filters.search && !feedback.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !feedback.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

    const clearFilters = () => {
        setFilters({
            status: '',
            type: '',
            priority: '',
            search: ''
        });
    };

    if (loading) {
        return (
            <div className="modern-page">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spin mb-3">
                            <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem', color: '#8b5cf6' }}></i>
                        </div>
                        <p className="text-muted">Feedback'ler yükleniyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modern-page">
            {/* Success/Error Messages */}
            {successMessage && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="result-alert success">
                        <div className="alert-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="alert-content">
                            <strong>Başarılı!</strong>
                            <p>{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="result-alert error">
                        <div className="alert-icon">
                            <i className="bi bi-x-circle-fill"></i>
                        </div>
                        <div className="alert-content">
                            <strong>Hata!</strong>
                            <p>{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-shield-check text-purple-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Admin - Feedback Yönetimi</h1>
                        <p>Kullanıcı feedback'lerini görüntüleyip yönetin</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-list-ol"></i>
                    <span>{feedbacks.length} Feedback</span>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="content-grid">
                <div className="config-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-graph-up text-purple-500"></i>
                            <span>Dashboard İstatistikleri</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-clipboard-data text-blue-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{dashboardStats.total_feedbacks || 0}</h3>
                                    <p>Toplam Feedback</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-clock-fill text-orange-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{dashboardStats.pending_count || 0}</h3>
                                    <p>Beklemede</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-exclamation-triangle-fill text-red-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{dashboardStats.critical_count || 0}</h3>
                                    <p>Kritik Öncelik</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-calendar-week text-cyan-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{dashboardStats.this_week_count || 0}</h3>
                                    <p>Bu Hafta</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="config-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-funnel text-blue-500"></i>
                        <span>Filtreler</span>
                    </div>
                    <div className="card-actions">
                        <button 
                            className="action-btn outline small"
                            onClick={clearFilters}
                        >
                            <i className="bi bi-x-circle"></i>
                            Temizle
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-search"></i> Arama
                            </label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="form-input"
                                placeholder="Başlık veya açıklama ara..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-flag"></i> Durum
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm durumlar</option>
                                <option value="beklemede">Beklemede</option>
                                <option value="inceleniyor">İnceleniyor</option>
                                <option value="cozuldu">Çözüldü</option>
                                <option value="eklendi">Eklendi</option>
                                <option value="reddedildi">Reddedildi</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-type"></i> Tip
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm tipler</option>
                                <option value="hata">Hata</option>
                                <option value="oneri">Öneri</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-exclamation-triangle"></i> Öncelik
                            </label>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm öncelikler</option>
                                <option value="dusuk">Düşük</option>
                                <option value="orta">Orta</option>
                                <option value="yuksek">Yüksek</option>
                                <option value="kritik">Kritik</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="output-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-list-ul text-cyan-500"></i>
                        <span>Feedback Listesi ({filteredFeedbacks.length})</span>
                    </div>
                </div>
                <div className="card-body">
                    {filteredFeedbacks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h3>Feedback bulunamadı</h3>
                            <p>Filtrelerinizi değiştirerek tekrar deneyin</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredFeedbacks.map((feedback) => (
                                <div key={feedback.id} className="info-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedFeedback(feedback)}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                        <div className="info-icon">
                                            <i className={getTypeIcon(feedback.type)}></i>
                                        </div>
                                        <div className="info-content" style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>#{feedback.id} - {feedback.title}</h3>
                                                <span className={`status-badge ${getStatusColor(feedback.status)}`}>
                                                    {getStatusText(feedback.status)}
                                                </span>
                                                <i className={getPriorityIcon(feedback.priority)}></i>
                                            </div>
                                            <p style={{ margin: '0.5rem 0', color: '#6b7280', lineHeight: '1.5' }}>
                                                {feedback.description.length > 120 
                                                    ? feedback.description.substring(0, 120) + '...' 
                                                    : feedback.description
                                                }
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                                                <span>
                                                    <i className="bi bi-person"></i> {feedback.user_name || 'Bilinmeyen'}
                                                </span>
                                                <span>
                                                    <i className="bi bi-calendar3"></i> {formatRelativeTime(feedback.created_at)}
                                                </span>
                                                {feedback.category && (
                                                    <span>
                                                        <i className="bi bi-tag-fill"></i> {feedback.category}
                                                    </span>
                                                )}
                                                {feedback.module_name && (
                                                    <span>
                                                        <i className="bi bi-app"></i> {feedback.module_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div 
                                                className={`priority-badge ${feedback.priority}`}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.25rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    backgroundColor: 
                                                        feedback.priority === 'kritik' ? '#fecaca' :
                                                        feedback.priority === 'yuksek' ? '#fed7aa' :
                                                        feedback.priority === 'orta' ? '#fde68a' : '#bbf7d0',
                                                    color: 
                                                        feedback.priority === 'kritik' ? '#dc2626' :
                                                        feedback.priority === 'yuksek' ? '#ea580c' :
                                                        feedback.priority === 'orta' ? '#d97706' : '#16a34a',
                                                    border: `1px solid ${
                                                        feedback.priority === 'kritik' ? '#f87171' :
                                                        feedback.priority === 'yuksek' ? '#fb923c' :
                                                        feedback.priority === 'orta' ? '#fbbf24' : '#4ade80'
                                                    }`
                                                }}
                                            >
                                                <i className={getPriorityIcon(feedback.priority)}></i>
                                                <span>
                                                    {feedback.priority === 'dusuk' ? 'Düşük' :
                                                     feedback.priority === 'orta' ? 'Orta' :
                                                     feedback.priority === 'yuksek' ? 'Yüksek' : 'Kritik'}
                                                </span>
                                            </div>
                                            <button 
                                                className="action-btn outline small" 
                                                style={{ minWidth: '80px', padding: '0.5rem 0.75rem' }}
                                            >
                                                <i className="bi bi-eye" style={{ marginRight: '0.25rem' }}></i>
                                                Yönet
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Management Modal */}
            {selectedFeedback && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '1200px', width: '95%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className={getTypeIcon(selectedFeedback.type)}></i>
                                Feedback Yönetimi - #{selectedFeedback.id}
                            </h3>
                            <button className="modal-close" onClick={() => setSelectedFeedback(null)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                                {/* Sol Taraf - Feedback Detayları */}
                                <div className="info-card">
                                    <div className="info-content">
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            {selectedFeedback.title}
                                            <span className={`status-badge ${getStatusColor(selectedFeedback.status)}`}>
                                                {getStatusText(selectedFeedback.status)}
                                            </span>
                                            <i className={getPriorityIcon(selectedFeedback.priority)}></i>
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                            <div>
                                                <strong>Kullanıcı:</strong> {selectedFeedback.user_name || 'Bilinmeyen'}
                                            </div>
                                            <div>
                                                <strong>Tip:</strong> {selectedFeedback.type === 'hata' ? '🐛 Hata' : '💡 Öneri'}
                                            </div>
                                            <div>
                                                <strong>Kategori:</strong> {selectedFeedback.category || 'Belirtilmemiş'}
                                            </div>
                                            <div>
                                                <strong>Modül:</strong> {selectedFeedback.module_name || 'Belirtilmemiş'}
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <strong>Açıklama:</strong>
                                            <p style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', whiteSpace: 'pre-wrap' }}>
                                                {selectedFeedback.description}
                                            </p>
                                        </div>
                                        {selectedFeedback.steps_to_reproduce && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <strong>Yeniden Üretme Adımları:</strong>
                                                <p style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0.375rem', whiteSpace: 'pre-wrap' }}>
                                                    {selectedFeedback.steps_to_reproduce}
                                                </p>
                                            </div>
                                        )}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                            {selectedFeedback.expected_result && (
                                                <div>
                                                    <strong>Beklenen Sonuç:</strong>
                                                    <p style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', borderRadius: '0.375rem', whiteSpace: 'pre-wrap' }}>
                                                        {selectedFeedback.expected_result}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedFeedback.actual_result && (
                                                <div>
                                                    <strong>Gerçek Sonuç:</strong>
                                                    <p style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '0.375rem', whiteSpace: 'pre-wrap' }}>
                                                        {selectedFeedback.actual_result}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Oluşturulma: {formatDate(selectedFeedback.created_at)}</span>
                                                {selectedFeedback.resolved_at && (
                                                    <span>Çözülme: {formatDate(selectedFeedback.resolved_at)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sağ Taraf - Yönetim Paneli */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Öncelik Yönetimi */}
                                    <div className="config-card">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <i className="bi bi-exclamation-triangle text-orange-500"></i>
                                                <span>Öncelik Yönetimi</span>
                                            </div>
                                        </div>
                                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {[
                                                { value: 'dusuk', label: 'Düşük', color: 'success', bgColor: '#10b981' },
                                                { value: 'orta', label: 'Orta', color: 'warning', bgColor: '#f59e0b' },
                                                { value: 'yuksek', label: 'Yüksek', color: 'danger', bgColor: '#f97316' },
                                                { value: 'kritik', label: 'Kritik', color: 'critical', bgColor: '#dc2626' }
                                            ].map(priority => (
                                                <button
                                                    key={priority.value}
                                                    onClick={() => handlePriorityUpdate(selectedFeedback.id, priority.value)}
                                                    className={`action-btn ${selectedFeedback.priority === priority.value ? 'active' : 'outline'}`}
                                                    style={{ 
                                                        textAlign: 'left', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '0.5rem',
                                                        ...(selectedFeedback.priority === priority.value && {
                                                            backgroundColor: priority.bgColor,
                                                            borderColor: priority.bgColor,
                                                            color: 'white'
                                                        })
                                                    }}
                                                >
                                                    <i className={getPriorityIcon(priority.value)}></i>
                                                    {priority.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Admin Yanıtı */}
                                    <div className="config-card">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <i className="bi bi-chat-text text-purple-500"></i>
                                                <span>Admin Yanıtı</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                const formData = new FormData(e.target);
                                                const adminResponse = formData.get('admin_response');
                                                const newStatus = formData.get('status');
                                                handleStatusUpdate(selectedFeedback.id, newStatus, adminResponse);
                                            }}>
                                                <div className="form-group">
                                                    <label className="form-label">Yanıt Mesajı</label>
                                                    <textarea
                                                        name="admin_response"
                                                        defaultValue={selectedFeedback.admin_response || ''}
                                                        className="form-textarea"
                                                        rows={4}
                                                        placeholder="Kullanıcıya gönderilecek yanıt mesajını yazın..."
                                                        style={{ resize: 'vertical' }}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Yeni Durum</label>
                                                    <select name="status" className="form-select" defaultValue={selectedFeedback.status}>
                                                        <option value="beklemede">Beklemede</option>
                                                        <option value="inceleniyor">İnceleniyor</option>
                                                        <option value="cozuldu">Çözüldü</option>
                                                        <option value="eklendi">Eklendi</option>
                                                        <option value="reddedildi">Reddedildi</option>
                                                    </select>
                                                </div>
                                                <button type="submit" className="action-btn primary">
                                                    <i className="bi bi-send"></i>
                                                    Yanıtla ve Güncelle
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedbackPanel; 