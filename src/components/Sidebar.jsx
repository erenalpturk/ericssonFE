import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import NotificationBell from './Notifications/NotificationBell'

function Sidebar({ isCollapsed, onToggle }) {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user, isWorkflowRunning } = useAuth()
    const [isBilgiMerkeziOpen, setIsBilgiMerkeziOpen] = useState(false)
    const [isTetiklemelerOpen, setIsTetiklemelerOpen] = useState(false)

    const handleLogout = async () => {
        const result = await logout()
        if (result.success) {
            navigate('/login')
        }
    }

    const handleNavigation = (path) => {
        if (isWorkflowRunning) {
            const userConfirmed = window.confirm('Dikkat! Aktif bir iş akışı çalışıyor. Sayfadan ayrılırsanız işleminiz sonlanacaktır. Devam etmek istiyor musunuz?')
            if (!userConfirmed) {
                return
            }
        }
        navigate(path)
    }

    const handleBilgiMerkeziToggle = () => {
        if (!isCollapsed) {
            setIsBilgiMerkeziOpen(!isBilgiMerkeziOpen)
        }
    }

    const handleTetiklemelerToggle = () => {
        if (!isCollapsed) {
            setIsTetiklemelerOpen(!isTetiklemelerOpen)
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
            path: '/stats',
            icon: 'bi-graph-up',
            label: 'İstatistikler',
            color: 'text-purple-500',
            roles: ['admin']
        },
        {
            path: '/activation-list',
            icon: 'bi-check-circle',
            label: 'Aktivasyonlarım',
            color: 'text-emerald-500',
            roles: ['admin', 'support', 'tester']
        },
        {
            path: '/api-automation',
            icon: 'bi-cpu-fill',
            label: 'OMNI Otomasyon',
            color: 'text-orange-500',
            roles: ['admin', 'support', 'tester']
        },
        {
            path: '/api-tester',
            icon: 'bi-lightning-fill',
            label: 'Dostman',
            color: 'text-yellow-500',
            roles: ['admin', 'support', 'tester']
        },
        {
            path: '/iccid-list',
            icon: 'bi-credit-card-2-front',
            label: 'ICCID',
            color: 'text-emerald-500',
            roles: ['admin', 'support', 'tester']
        },
        // {
        //     path: '/iccid-management',
        //     icon: 'bi-gear-wide-connected',
        //     label: 'Yeni ICCID Ekle',
        //     color: 'text-emerald-500',
        //     roles: ['admin', 'support']
        // },
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
            path: '/feedback',
            icon: 'bi-bug-fill',
            label: 'Hata & Öneri',
            color: 'text-red-500',
            roles: ['support', 'tester']
        },
        {
            path: '/admin/feedback',
            icon: 'bi-gear-fill',
            label: 'Feedback Yönetimi',
            color: 'text-indigo-500',
            roles: ['admin']
        },
        {
            path: '/admin/notifications',
            icon: 'bi-bell-fill',
            label: 'Bildirim Oluştur',
            color: 'text-amber-500',
            roles: ['admin']
        },

    ]

    // Omni Bilgi Merkezi alt menüleri
    const bilgiMerkeziItems = [
        {
            path: '/bilgi-merkezi/scriptler',
            icon: 'bi-code-slash',
            label: 'Scriptler',
            color: 'text-blue-400',
            roles: ['admin', 'support', 'tester']
        },
        {
            path: '/bilgi-merkezi/kontak-bilgileri',
            icon: 'bi-telephone-fill',
            label: 'Kontak Bilgileri',
            color: 'text-green-400',
            roles: ['admin', 'support', 'tester']
        }
    ]

    // Tetiklemeler alt menüleri
    const tetiklemelerItems = [
        {
            path: '/courier-actions',
            icon: 'bi-truck',
            label: 'Kurye',
            color: 'text-cyan-400',
            roles: ['admin', 'support', 'tester']
        },
        {
            path: '/admin/trigger-management',
            icon: 'bi-gear-wide-connected',
            label: 'Tetikleme Yönetimi',
            color: 'text-indigo-400',
            roles: ['admin']
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
                <div className="header-actions">
                    {!isCollapsed && <NotificationBell />}
                    <button
                        className="toggle-btn"
                        onClick={() => onToggle(!isCollapsed)}
                        title={isCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
                    >
                        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {menuItems.filter(item => item.roles.includes(user.role)).map((item, index) => (
                        <React.Fragment key={item.path}>
                            <li className="nav-item">
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
                                        onClick={(e) => {
                                            if (isWorkflowRunning) {
                                                e.preventDefault()
                                                handleNavigation(item.path)
                                            }
                                        }}
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

                            {/* SQL Create'den sonra Tetiklemeler Dropdown ekle */}
                            {item.path === '/sql-create' && (
                                <li className="nav-item">
                                    <div 
                                        className={`nav-link group cursor-pointer ${tetiklemelerItems.some(item => location.pathname === item.path) ? 'active' : ''}`}
                                        onClick={handleTetiklemelerToggle}
                                        title={isCollapsed ? "Tetiklemeler" : ''}
                                    >
                                        <div className="nav-icon text-violet-500 group-hover:scale-110 transition-transform duration-200">
                                            <i className="bi bi-play-circle-fill"></i>
                                        </div>
                                        {!isCollapsed && (
                                            <>
                                                <span className="nav-text">Tetiklemeler</span>
                                                <div className="dropdown-arrow">
                                                    <i className={`bi ${isTetiklemelerOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Alt Menü */}
                                    {!isCollapsed && isTetiklemelerOpen && (
                                        <ul className="sub-nav-list">
                                            {tetiklemelerItems.filter(item => item.roles.includes(user.role)).map((subItem) => (
                                                <li key={subItem.path} className="sub-nav-item">
                                                    <Link
                                                        to={subItem.path}
                                                        className={`sub-nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            if (isWorkflowRunning) {
                                                                e.preventDefault()
                                                                handleNavigation(subItem.path)
                                                            }
                                                        }}
                                                    >
                                                        <div className={`sub-nav-icon ${subItem.color}`}>
                                                            <i className={subItem.icon}></i>
                                                        </div>
                                                        <span className="sub-nav-text">{subItem.label}</span>
                                                        {location.pathname === subItem.path && (
                                                            <div className="active-indicator"></div>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            )}

                            {/* Tetiklemeler'den sonra Omni Bilgi Merkezi Dropdown ekle */}
                            {item.path === '/admin/notifications' && (
                                <li className="nav-item">
                                    <div 
                                        className={`nav-link group cursor-pointer ${bilgiMerkeziItems.some(item => location.pathname === item.path) ? 'active' : ''}`}
                                        onClick={handleBilgiMerkeziToggle}
                                        title={isCollapsed ? "Omni Bilgi Merkezi" : ''}
                                    >
                                        <div className="nav-icon text-indigo-500 group-hover:scale-110 transition-transform duration-200">
                                            <i className="bi bi-info-circle-fill"></i>
                                        </div>
                                        {!isCollapsed && (
                                            <>
                                                <span className="nav-text">Omni Bilgi Merkezi</span>
                                                <div className="dropdown-arrow">
                                                    <i className={`bi ${isBilgiMerkeziOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Alt Menü */}
                                    {!isCollapsed && isBilgiMerkeziOpen && (
                                        <ul className="sub-nav-list">
                                            {bilgiMerkeziItems.filter(item => item.roles.includes(user.role)).map((subItem) => (
                                                <li key={subItem.path} className="sub-nav-item">
                                                    <Link
                                                        to={subItem.path}
                                                        className={`sub-nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                                                        onClick={(e) => {
                                                            if (isWorkflowRunning) {
                                                                e.preventDefault()
                                                                handleNavigation(subItem.path)
                                                            }
                                                        }}
                                                    >
                                                        <div className={`sub-nav-icon ${subItem.color}`}>
                                                            <i className={subItem.icon}></i>
                                                        </div>
                                                        <span className="sub-nav-text">{subItem.label}</span>
                                                        {location.pathname === subItem.path && (
                                                            <div className="active-indicator"></div>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            )}
                        </React.Fragment>
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