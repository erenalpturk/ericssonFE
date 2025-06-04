import { Link } from 'react-router-dom'

function Home() {
    const tools = [
        {
            path: '/sms-decrypt',
            icon: 'bi-shield-lock-fill',
            title: 'SMS Decrypt',
            description: 'SMS şifre çözme ve token doğrulama aracı',
            color: 'text-purple-500',
            bgGradient: 'from-purple-500 to-indigo-600',
            category: 'Güvenlik'
        },
        // {
        //     path: '/postpaid-activation',
        //     icon: 'bi-phone-fill',
        //     title: 'Postpaid Activation',
        //     description: 'Hat aktivasyon otomasyonu',
        //     color: 'text-orange-500',
        //     bgGradient: 'from-orange-500 to-red-600',
        //     category: 'Aktivasyon',
        //     disabled: true
        // },
        {
            path: '/sql-create',
            icon: 'bi-database-fill',
            title: 'SQL Create',
            description: 'SQL sorgusu oluşturur',
            color: 'text-emerald-500',
            bgGradient: 'from-emerald-500 to-teal-600',
            category: 'SQL Araçları'
        },
        // {
        //     path: '/infodealer-to-sql',
        //     icon: 'bi-database-add',
        //     title: 'Infodealer Insert',
        //     description: 'Infodealer için toplu INSERT sorgusu oluşturur',
        //     color: 'text-emerald-600',
        //     bgGradient: 'from-emerald-600 to-green-600',
        //     category: 'SQL Araçları'
        // },
        // {
        //     path: '/infodealer-to-sql-update',
        //     icon: 'bi-database-up',
        //     title: 'Infodealer Update',
        //     description: 'Dealer kodu güncelleme sorguları oluşturur',
        //     color: 'text-emerald-600',
        //     bgGradient: 'from-emerald-600 to-green-600',
        //     category: 'SQL Araçları'
        // },
        // {
        //     path: '/selfybest-insert-sql',
        //     icon: 'bi-database-gear',
        //     title: 'Selfybest Insert',
        //     description: 'Youth tariff konfigürasyonu için INSERT sorgusu',
        //     color: 'text-emerald-600',
        //     bgGradient: 'from-emerald-600 to-green-600',
        //     category: 'SQL Araçları'
        // },
        
        {
            path: '/iccid-management',
            icon: 'bi-credit-card-2-front',
            title: 'ICCID Management',
            description: 'ICCID ve aktivasyon verilerini yönetin',
            color: 'text-emerald-500',
            bgGradient: 'from-emerald-500 to-teal-600',
            category: 'Yönetim'
        },
        {
            path: '/courier-actions',
            icon: 'bi-truck',
            title: 'DK Kurye Tetikleme',
            description: 'Kurye işlemlerini tetikleyin ve yönetin',
            color: 'text-cyan-500',
            bgGradient: 'from-cyan-500 to-blue-600',
            category: 'Otomasyon'
        }
    ];

    const categories = [...new Set(tools.map(tool => tool.category))];

    return (
        <div className="modern-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-icon">
                        <i className="bi bi-gear-wide-connected"></i>
                    </div>
                    <h1 className="hero-title">OMNI Tools</h1>
                    <p className="hero-subtitle">Test Team Otomasyon Araçları Koleksiyonu</p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">{tools.filter(t => !t.disabled).length}</span>
                            <span className="stat-label">Aktif Araç</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{categories.length}</span>
                            <span className="stat-label">Kategori</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{tools.filter(t => t.disabled).length}</span>
                            <span className="stat-label">Geliştiriliyor</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="tools-section">
                <div className="section-header">
                    <h2>Araçlar</h2>
                    <p>İhtiyacınıza uygun aracı seçin</p>
                </div>
                
                <div className="tools-grid">
                    {tools.map((tool) => (
                        <div key={tool.path} className="tool-card-wrapper">
                            {tool.disabled ? (
                                <div className="tool-card disabled">
                                    <div className="tool-card-header">
                                        <div className={`tool-icon ${tool.color}`}>
                                            <i className={tool.icon}></i>
                                        </div>
                                        <div className="construction-badge">
                                            <i className="bi bi-hammer"></i>
                                            <span>Yapım Aşamasında</span>
                                        </div>
                                    </div>
                                    <div className="tool-card-body">
                                        <div className="tool-category">{tool.category}</div>
                                        <h3 className="tool-title">{tool.title}</h3>
                                        <p className="tool-description">{tool.description}</p>
                                    </div>
                                    <div className="tool-card-footer">
                                        <div className="coming-soon-badge">
                                            <i className="bi bi-clock"></i>
                                            Yakında
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to={tool.path} className="tool-card">
                                    <div className="tool-card-header">
                                        <div className={`tool-icon ${tool.color}`}>
                                            <i className={tool.icon}></i>
                                        </div>
                                        <div className="tool-glow"></div>
                                    </div>
                                    <div className="tool-card-body">
                                        <div className="tool-category">{tool.category}</div>
                                        <h3 className="tool-title">{tool.title}</h3>
                                        <p className="tool-description">{tool.description}</p>
                                    </div>
                                    <div className="tool-card-footer">
                                        <div className="launch-btn">
                                            <span>Başlat</span>
                                            <i className="bi bi-arrow-right"></i>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stats-card">
                    <div className="stats-header">
                        <i className="bi bi-speedometer2 text-blue-500"></i>
                        <span>Sistem Durumu</span>
                    </div>
                    <div className="stats-body">
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <span>Tüm servisler aktif</span>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <span>API bağlantıları stabil</span>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <span>Veritabanı erişilebilir</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home