import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';
import { useAuth } from '../contexts/AuthContext';
const UserFeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [userStats, setUserStats] = useState({});
    const [filter, setFilter] = useState('all');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadFeedbacks();
        loadUserStats();
    }, []);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            
            if (!user.sicil_no) {
                showError('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.');
                return;
            }
            
            const response = await axios.post('/feedback/user/feedbacks', {
                user_sicil_no: user.sicil_no
            });

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

    const loadUserStats = async () => {
        try {
            if (!user.sicil_no) {
                return;
            }
            
            const response = await axios.post('/feedback/user/stats', {
                user_sicil_no: user.sicil_no
            });

            if (response.data.success) {
                setUserStats(response.data.data);
            }
        } catch (error) {
            console.error('Kullanıcı istatistikleri yüklenirken hata:', error);
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
        if (filter === 'all') return true;
        if (filter === 'bugs') return feedback.type === 'hata';
        if (filter === 'suggestions') return feedback.type === 'oneri';
        return feedback.status === filter;
    });

    const handleFormSuccess = (newFeedback) => {
        setFeedbacks(prev => [newFeedback, ...prev]);
        setShowForm(false);
        loadUserStats();
        showSuccess('Feedback başarıyla gönderildi!');
    };

    if (loading) {
        return (
            <div className="modern-page">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spin mb-3">
                            <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem', color: '#3b82f6' }}></i>
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
                        <i className="bi bi-chat-dots-fill text-blue-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Hata & Öneri Sistemi</h1>
                        <p>Karşılaştığınız hataları bildirin veya sistem için önerilerinizi paylaşın</p>
                    </div>
                    <button className="action-btn primary" onClick={() => setShowForm(true)}>
                        <i className="bi bi-plus-circle"></i>
                        Yeni Feedback
                    </button>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-list-ol"></i>
                    <span>{feedbacks.length} Feedback</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="content-grid">
                <div className="config-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-graph-up text-blue-500"></i>
                            <span>İstatistikler</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-clipboard-data text-blue-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{userStats.total_feedbacks || 0}</h3>
                                    <p>Toplam Feedback</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-bug-fill text-red-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{userStats.total_bugs || 0}</h3>
                                    <p>Hata Bildirimi</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-lightbulb-fill text-yellow-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{userStats.total_suggestions || 0}</h3>
                                    <p>Öneri</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon">
                                    <i className="bi bi-clock-fill text-orange-500"></i>
                                </div>
                                <div className="info-content">
                                    <h3>{userStats.pending_count || 0}</h3>
                                    <p>Beklemede</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="action-bar">
                <div className="action-group">
                    <h3 style={{ margin: 0, color: '#1f2937' }}>Filtreler</h3>
                </div>
                <div className="action-group">
                    <button 
                        className={`action-btn ${filter === 'all' ? 'primary' : 'outline'}`}
                        onClick={() => setFilter('all')}
                    >
                        Tümü ({feedbacks.length})
                    </button>
                    <button 
                        className={`action-btn ${filter === 'bugs' ? 'danger' : 'outline'}`}
                        onClick={() => setFilter('bugs')}
                    >
                        <i className="bi bi-bug-fill"></i>
                        Hatalar ({feedbacks.filter(f => f.type === 'hata').length})
                    </button>
                    <button 
                        className={`action-btn ${filter === 'suggestions' ? 'success' : 'outline'}`}
                        onClick={() => setFilter('suggestions')}
                    >
                        <i className="bi bi-lightbulb-fill"></i>
                        Öneriler ({feedbacks.filter(f => f.type === 'oneri').length})
                    </button>
                    <button 
                        className={`action-btn ${filter === 'beklemede' ? 'warning' : 'outline'}`}
                        onClick={() => setFilter('beklemede')}
                    >
                        <i className="bi bi-clock-fill"></i>
                        Beklemede ({feedbacks.filter(f => f.status === 'beklemede').length})
                    </button>
                    <button 
                        className={`action-btn ${filter === 'cozuldu' ? 'success' : 'outline'}`}
                        onClick={() => setFilter('cozuldu')}
                    >
                        <i className="bi bi-check-circle-fill"></i>
                        Çözüldü ({feedbacks.filter(f => f.status === 'cozuldu').length})
                    </button>
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
                            <h3>{filter === 'all' ? 'Henüz feedback göndermediniz' : 'Bu filtre için feedback bulunamadı'}</h3>
                            <p>
                                {filter === 'all' 
                                    ? 'İlk hata bildiriminizi veya önerinizi gönderin' 
                                    : 'Farklı bir filtre seçerek diğer feedback\'leri görüntüleyebilirsiniz'
                                }
                            </p>
                            {filter === 'all' && (
                                <button className="action-btn primary" onClick={() => setShowForm(true)}>
                                    <i className="bi bi-plus-circle"></i>
                                    İlk Feedback'inizi Gönderin
                                </button>
                            )}
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
                                                {feedback.description.length > 150 
                                                    ? feedback.description.substring(0, 150) + '...' 
                                                    : feedback.description
                                                }
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
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
                                            {feedback.admin_response && (
                                                <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', borderRadius: '0.375rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: '#1e40af', fontWeight: '600', fontSize: '0.875rem' }}>
                                                        <i className="bi bi-person-badge"></i>
                                                        Admin Yanıtı:
                                                    </div>
                                                    <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem', lineHeight: '1.4' }}>
                                                        {feedback.admin_response}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <button className="action-btn outline small">
                                                <i className="bi bi-eye"></i>
                                                Detay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Feedback Form Modal */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '800px', width: '90%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className="bi bi-plus-circle"></i>
                                Yeni Feedback Oluştur
                            </h3>
                            <button className="modal-close" onClick={() => setShowForm(false)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <FeedbackForm
                                onSuccess={handleFormSuccess}
                                onClose={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Detail Modal */}
            {selectedFeedback && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '1000px', width: '95%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className={getTypeIcon(selectedFeedback.type)}></i>
                                Feedback Detayı - #{selectedFeedback.id}
                            </h3>
                            <button className="modal-close" onClick={() => setSelectedFeedback(null)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                <div className="info-card">
                                    <div className="info-content">
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                            {selectedFeedback.title}
                                            <span className={`status-badge ${getStatusColor(selectedFeedback.status)}`}>
                                                {getStatusText(selectedFeedback.status)}
                                            </span>
                                            <i className={getPriorityIcon(selectedFeedback.priority)}></i>
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                            <div>
                                                <strong>Tip:</strong> {selectedFeedback.type === 'hata' ? '🐛 Hata' : '💡 Öneri'}
                                            </div>
                                            <div>
                                                <strong>Kategori:</strong> {selectedFeedback.category || 'Belirtilmemiş'}
                                            </div>
                                            <div>
                                                <strong>Modül:</strong> {selectedFeedback.module_name || 'Belirtilmemiş'}
                                            </div>
                                            <div>
                                                <strong>Öncelik:</strong> {selectedFeedback.priority}
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
                                        {selectedFeedback.admin_response && (
                                            <div style={{ marginBottom: '1rem' }}>
                                                <strong>Admin Yanıtı:</strong>
                                                <div style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', borderRadius: '0.375rem' }}>
                                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#1e40af' }}>
                                                        {selectedFeedback.admin_response}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                            <span>Oluşturulma: {formatDate(selectedFeedback.created_at)}</span>
                                            {selectedFeedback.resolved_at && (
                                                <span>Çözülme: {formatDate(selectedFeedback.resolved_at)}</span>
                                            )}
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

export default UserFeedbackList; 