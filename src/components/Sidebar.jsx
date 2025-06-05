import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Sidebar({ isCollapsed, onToggle }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuth()

    const handleLogout = async () => {
        const result = await logout()
        if (result.success) {
            navigate('/login')
        }
    }

    const menuItems = [
        { 
            path: '/', 
            icon: 'bi-house-door-fill', 
            label: 'Ana Sayfa',
            color: 'text-blue-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/sms-decrypt', 
            icon: 'bi-shield-lock-fill', 
            label: 'SMS Decrypt',
            color: 'text-purple-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/sql-create', 
            icon: 'bi-database-fill', 
            label: 'SQL Create',
            color: 'text-emerald-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/iccid-list', 
            icon: 'bi-credit-card-2-front', 
            label: 'ICCID List',
            color: 'text-emerald-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/activation-list', 
            icon: 'bi-check-circle', 
            label: 'Aktivasyon List',
            color: 'text-emerald-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/courier-actions', 
            icon: 'bi-truck', 
            label: 'Kurye Tetikleme',
            color: 'text-cyan-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/api-automation', 
            icon: 'bi-cpu-fill', 
            label: 'API Otomasyon',
            color: 'text-orange-500',
            roles: ['admin', 'support', 'tester']
        },
        { 
            path: '/api-tester', 
            icon: 'bi-lightning-fill', 
            label: 'API Tester',
            color: 'text-yellow-500',
            roles: ['admin', 'support', 'tester']
        }
        // { 
        //     path: '/api-automation-management', 
        //     icon: 'bi-cpu-fill', 
        //     label: 'API Otomasyon Management',
        //     color: 'text-orange-500',
        //     roles: ['admin', 'support']
        // },
        // { 
        //     path: '/iccid-management', 
        //     icon: 'bi-gear-wide-connected', 
        //     label: 'ICCID Management',
        //     color: 'text-emerald-500',
        //     roles: ['admin', 'support']
        // }
    ]

    return (
        <aside className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <div className="brand">
                    <div className="brand-icon">
                        <i className="bi bi-gear-wide-connected"></i>
                    </div>
                    {!isCollapsed && (
                        <div className="brand-text">
                            <h1>OMNI</h1>
                            <span>Tools</span>
                        </div>
                    )}
                </div>
                <button 
                    className="toggle-btn"
                    onClick={() => onToggle(!isCollapsed)}
                    title={isCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
                >
                    <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
                        <li key={item.path} className="nav-item">
                            {item.disabled ? (
                                <div className={`nav-link disabled ${item.color}`}>
                                    <div className={`nav-icon ${item.color}`}>
                                        <i className={item.icon}></i>
                                    </div>
                                    {!isCollapsed && (
                                        <>
                                            <span className="nav-text">{item.label}</span>
                                            {item.badge && (
                                                <span className="construction-badge">
                                                    <i className="bi bi-hammer"></i>
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link 
                                    to={item.path} 
                                    className={`nav-link group ${location.pathname === item.path ? 'active' : ''}`}
                                    title={isCollapsed ? item.label : ''}
                                >
                                    <div className={`nav-icon ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                                        <i className={item.icon}></i>
                                    </div>
                                    {!isCollapsed && (
                                        <span className="nav-text">{item.label}</span>
                                    )}
                                    {location.pathname === item.path && !isCollapsed && (
                                        <div className="active-indicator"></div>
                                    )}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            {!isCollapsed && (
                <div className="sidebar-footer">
                    <div className="footer-content">
                        <div className="team-info">
                            <i className="bi bi-people-fill"></i>
                            <span>OMNI Test Team</span>
                        </div>
                        <div className="version">v1.0.0</div>
                        <div className="user-info">
                            <i className="bi bi-person-fill"></i>
                            <span>{user.full_name}</span>
                        </div>
                        <button 
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default Sidebar 