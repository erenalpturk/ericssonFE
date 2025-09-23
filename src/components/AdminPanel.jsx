import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminFeedbackPanel from './AdminFeedbackPanel';
import NotificationCreator from './Admin/NotificationCreator';
import Stats from './Stats';
import ParamsManagement from './ParamsManagement';
import UserManagement from './UserManagement';

const AdminPanel = () => {
    const [activeComponent, setActiveComponent] = useState(null);
    const navigate = useNavigate();

    const adminComponents = [
        {
            id: 'feedback',
            title: 'Feedback Yönetimi',
            description: 'Kullanıcı feedback\'lerini görüntüleyip yönetin',
            icon: 'bi-shield-check',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            component: AdminFeedbackPanel
        },
        {
            id: 'notifications',
            title: 'Bildirim Yönetimi',
            description: 'Bildirim oluşturun ve geçmişi yönetin',
            icon: 'bi-bell-fill',
            color: 'text-amber-500',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            component: NotificationCreator
        },
        {
            id: 'stats',
            title: 'İstatistikler',
            description: 'Sistem istatistiklerini görüntüleyin',
            icon: 'bi-graph-up',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            component: Stats
        },
        {
            id: 'params',
            title: 'Parametre Yönetimi',
            description: 'Sistem parametrelerini yönetin ve düzenleyin',
            icon: 'bi-gear-wide-connected',
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            component: ParamsManagement
        },
        {
            id: 'users',
            title: 'Kullanıcı Yönetimi',
            description: 'Sistem kullanıcılarını yönetin ve düzenleyin',
            icon: 'bi-people-fill',
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            component: UserManagement
        }
    ];

    const handleComponentSelect = (component) => {
        setActiveComponent(component);
    };

    const handleBackToMenu = () => {
        setActiveComponent(null);
    };

    // Eğer bir komponent seçilmişse, o komponenti render et
    if (activeComponent) {
        const Component = activeComponent.component;
        return (
            <div className="modern-page">
                <div className="page-header">
                    <div className="header-content">
                        <button
                            onClick={handleBackToMenu}
                            className="action-btn outline"
                            style={{ marginRight: '1rem' }}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Geri Dön
                        </button>
                        <div className="header-icon">
                            <i className={`${activeComponent.icon} ${activeComponent.color}`}></i>
                        </div>
                        <div className="header-text">
                            <h1>{activeComponent.title}</h1>
                            <p>{activeComponent.description}</p>
                        </div>
                    </div>
                </div>
                <Component />
            </div>
        );
    }

    return (
        <div className="modern-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-gear-fill text-indigo-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Admin Panel</h1>
                        <p>Sistem yönetimi ve istatistikleri</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-shield-check"></i>
                    <span>Admin Yetkisi</span>
                </div>
            </div>

            {/* Admin Components Grid */}
            <div className="content-grid">
                {adminComponents.map((component) => (
                    <div
                        key={component.id}
                        className={`config-card ${component.bgColor} ${component.borderColor}`}
                        style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: '2px solid transparent'
                        }}
                        onClick={() => handleComponentSelect(component)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.style.borderColor = component.color.replace('text-', '');
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        <div className="card-header">
                            <div className="card-title">
                                <div 
                                    className={`nav-icon ${component.color}`}
                                    style={{ 
                                        width: '48px', 
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '1rem'
                                    }}
                                >
                                    <i className={component.icon} style={{ fontSize: '24px' }}></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                                        {component.title}
                                    </h3>
                                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                        {component.description}
                                    </p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="action-btn primary">
                                    <i className="bi bi-arrow-right"></i>
                                    Aç
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="config-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-info-circle text-blue-500"></i>
                        <span>Admin Panel Bilgileri</span>
                    </div>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="bi bi-shield-check text-purple-500"></i>
                            </div>
                            <div className="info-content">
                                <h3>Feedback Yönetimi</h3>
                                <p>Kullanıcı geri bildirimlerini inceleyin ve yanıtlayın</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="bi bi-bell-fill text-amber-500"></i>
                            </div>
                            <div className="info-content">
                                <h3>Bildirim Sistemi</h3>
                                <p>Kullanıcılara toplu veya tekil bildirimler gönderin</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="bi bi-graph-up text-blue-500"></i>
                            </div>
                            <div className="info-content">
                                <h3>Sistem İstatistikleri</h3>
                                <p>Detaylı kullanım raporları ve analizler</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="bi bi-gear-wide-connected text-green-500"></i>
                            </div>
                            <div className="info-content">
                                <h3>Parametre Yönetimi</h3>
                                <p>Sistem parametrelerini yönetin ve düzenleyin</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <i className="bi bi-people-fill text-purple-500"></i>
                            </div>
                            <div className="info-content">
                                <h3>Kullanıcı Yönetimi</h3>
                                <p>Sistem kullanıcılarını yönetin ve düzenleyin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
