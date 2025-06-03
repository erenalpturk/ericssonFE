import { Link, useLocation } from 'react-router-dom'

function Sidebar({ isCollapsed, onToggle }) {
    const location = useLocation()

    const menuItems = [
        { 
            path: '/', 
            icon: 'bi-house-door-fill', 
            label: 'Ana Sayfa',
            color: 'text-blue-500'
        },
        { 
            path: '/sms-decrypt', 
            icon: 'bi-shield-lock-fill', 
            label: 'SMS Decrypt',
            color: 'text-purple-500'
        },
        { 
            path: '/postpaid-activation', 
            icon: 'bi-phone-fill', 
            label: 'Postpaid Activation',
            color: 'text-orange-500',
            disabled: true,
            badge: 'Yapım Aşamasında'
        },
        { 
            path: '/iccid-to-sql', 
            icon: 'bi-database-fill', 
            label: 'ICCID to SQL',
            color: 'text-emerald-500'
        },
        // { 
        //     path: '/infodealer-to-sql', 
        //     icon: 'bi-database-add', 
        //     label: 'Infodealer Insert',
        //     color: 'text-emerald-600'
        // },
        // { 
        //     path: '/infodealer-to-sql-update', 
        //     icon: 'bi-database-up', 
        //     label: 'Infodealer Update',
        //     color: 'text-emerald-600'
        // },
        // { 
        //     path: '/selfybest-insert-sql', 
        //     icon: 'bi-database-gear', 
        //     label: 'Selfybest Insert',
        //     color: 'text-emerald-600'
        // },
        // { 
        //     path: '/cudb-feed', 
        //     icon: 'bi-arrow-repeat', 
        //     label: 'CUDB Feed',
        //     color: 'text-cyan-500'
        // },
        { 
            path: '/iccid-management', 
            icon: 'bi-gear-wide-connected', 
            label: 'ICCID Management',
            color: 'text-emerald-500'
        },
        { 
            path: '/courier-actions', 
            icon: 'bi-truck', 
            label: 'Kurye Tetikleme',
            color: 'text-cyan-500'
        }
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
                    {menuItems.map((item) => (
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
                    </div>
                </div>
            )}
        </aside>
    )
}

export default Sidebar 