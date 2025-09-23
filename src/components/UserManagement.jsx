import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        status: ''
    });
    const { baseUrl, user } = useAuth();

    const [newUser, setNewUser] = useState({
        sicil_no: '',
        full_name: '',
        role: 'tester',
        password: ''
    });

    const roleOptions = [
        { value: 'admin', label: 'Admin', color: 'text-red-500' },
        { value: 'support', label: 'Support', color: 'text-blue-500' },
        { value: 'tester', label: 'Tester', color: 'text-green-500' }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/users/getAll`);
            const data = await response.json();
            
            if (response.ok && data.success) {
                setUsers(data.data);
            } else {
                showError('Kullanıcılar yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
            showError('Kullanıcılar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Kullanıcı başarıyla eklendi');
                setShowAddModal(false);
                setNewUser({
                    sicil_no: '',
                    full_name: '',
                    role: 'tester',
                    password: ''
                });
                fetchUsers();
            } else {
                showError(data.error || 'Kullanıcı eklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Kullanıcı eklenirken hata:', error);
            showError('Kullanıcı eklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId, updatedData) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/users/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Kullanıcı başarıyla güncellendi');
                setEditingUser(null);
                fetchUsers();
            } else {
                showError(data.error || 'Kullanıcı güncellenirken hata oluştu');
            }
        } catch (error) {
            console.error('Kullanıcı güncellenirken hata:', error);
            showError('Kullanıcı güncellenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/users/delete/${userId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Kullanıcı başarıyla silindi');
                fetchUsers();
            } else {
                showError(data.error || 'Kullanıcı silinirken hata oluştu');
            }
        } catch (error) {
            console.error('Kullanıcı silinirken hata:', error);
            showError('Kullanıcı silinirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (userId) => {
        if (!window.confirm('Bu kullanıcının şifresini sıfırlamak istediğinizden emin misiniz?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/users/reset-password/${userId}`, {
                method: 'POST',
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Şifre başarıyla sıfırlandı');
                fetchUsers();
            } else {
                showError(data.error || 'Şifre sıfırlanırken hata oluştu');
            }
        } catch (error) {
            console.error('Şifre sıfırlanırken hata:', error);
            showError('Şifre sıfırlanırken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        const roleOption = roleOptions.find(r => r.value === role);
        return roleOption ? roleOption.color : 'text-gray-500';
    };

    const getRoleLabel = (role) => {
        const roleOption = roleOptions.find(r => r.value === role);
        return roleOption ? roleOption.label : role;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'Hiç giriş yapmamış';
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Şimdi';
        if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
        return `${Math.floor(diffInMinutes / 1440)} gün önce`;
    };

    const filteredUsers = users.filter(userItem => {
        if (filters.search && !userItem.full_name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !userItem.sicil_no.toString().includes(filters.search)) return false;
        if (filters.role && userItem.role !== filters.role) return false;
        if (filters.status === 'active' && !userItem.last_login) return false;
        if (filters.status === 'inactive' && userItem.last_login) return false;
        return true;
    });

    const clearFilters = () => {
        setFilters({
            search: '',
            role: '',
            status: ''
        });
    };

    if (loading && users.length === 0) {
        return (
            <div className="modern-page">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spin mb-3">
                            <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem', color: '#8b5cf6' }}></i>
                        </div>
                        <p className="text-muted">Kullanıcılar yükleniyor...</p>
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
                        <i className="bi bi-people-fill text-blue-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Kullanıcı Yönetimi</h1>
                        <p>Sistem kullanıcılarını yönetin ve düzenleyin</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-list-ol"></i>
                    <span>{users.length} Kullanıcı</span>
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
                                placeholder="İsim veya sicil no ara..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-person-badge"></i> Rol
                            </label>
                            <select
                                value={filters.role}
                                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm roller</option>
                                {roleOptions.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-toggle-on"></i> Durum
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm durumlar</option>
                                <option value="active">Aktif (Giriş yapmış)</option>
                                <option value="inactive">Pasif (Giriş yapmamış)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="output-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-list-ul text-cyan-500"></i>
                        <span>Kullanıcı Listesi ({filteredUsers.length})</span>
                    </div>
                    <div className="card-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            <i className="bi bi-plus-circle"></i>
                            Yeni Kullanıcı
                        </button>
                    </div>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {/* Tablo Başlığı */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '80px 1fr 120px 150px 150px 120px',
                        gap: '1rem',
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        color: '#374151'
                    }}>
                        <div>Sicil No</div>
                        <div>Ad Soyad</div>
                        <div>Rol</div>
                        <div>Oluşturulma</div>
                        <div>Son Giriş</div>
                        <div>İşlemler</div>
                    </div>
                    
                    {/* Tablo İçeriği */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredUsers.length === 0 ? (
                            <div style={{ 
                                padding: '3rem', 
                                textAlign: 'center', 
                                color: '#6b7280' 
                            }}>
                                <i className="bi bi-search" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                                <h3>Kullanıcı bulunamadı</h3>
                                <p>Filtrelerinizi değiştirerek tekrar deneyin</p>
                            </div>
                        ) : (
                            filteredUsers.map((userItem, index) => (
                                <div 
                                    key={userItem.id} 
                                    style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '80px 1fr 120px 150px 150px 120px',
                                        gap: '1rem',
                                        padding: '1rem',
                                        borderBottom: index < filteredUsers.length - 1 ? '1px solid #e2e8f0' : 'none',
                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                                        alignItems: 'center',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                                    }}
                                >
                                    {/* Sicil No */}
                                    <div style={{ 
                                        fontWeight: '500', 
                                        color: '#1f2937',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace'
                                    }}>
                                        {userItem.sicil_no}
                                    </div>
                                    
                                    {/* Ad Soyad */}
                                    <div style={{ 
                                        fontWeight: '500',
                                        color: '#1f2937',
                                        fontSize: '0.875rem',
                                        wordBreak: 'break-word'
                                    }}>
                                        {userItem.full_name || '-'}
                                    </div>
                                    
                                    {/* Rol */}
                                    <div>
                                        <span 
                                            className={`status-badge ${getRoleColor(userItem.role)}`}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.375rem',
                                                fontWeight: '500',
                                                backgroundColor: userItem.role === 'admin' ? '#fef2f2' : 
                                                               userItem.role === 'support' ? '#eff6ff' : '#f0fdf4',
                                                color: userItem.role === 'admin' ? '#dc2626' : 
                                                       userItem.role === 'support' ? '#2563eb' : '#16a34a',
                                                border: `1px solid ${userItem.role === 'admin' ? '#fecaca' : 
                                                                    userItem.role === 'support' ? '#bfdbfe' : '#bbf7d0'}`
                                            }}
                                        >
                                            {getRoleLabel(userItem.role)}
                                        </span>
                                    </div>
                                    
                                    {/* Oluşturulma */}
                                    <div style={{ 
                                        color: '#6b7280',
                                        fontSize: '0.875rem'
                                    }}>
                                        {formatDate(userItem.created_at)}
                                    </div>
                                    
                                    {/* Son Giriş */}
                                    <div style={{ 
                                        color: '#6b7280',
                                        fontSize: '0.875rem'
                                    }}>
                                        {formatRelativeTime(userItem.last_login)}
                                    </div>
                                    
                                    {/* İşlemler */}
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button 
                                            className="action-btn outline small" 
                                            onClick={() => setEditingUser(userItem)}
                                            style={{ 
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                minWidth: 'auto'
                                            }}
                                            title="Düzenle"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            className="action-btn outline small" 
                                            onClick={() => handleResetPassword(userItem.id)}
                                            style={{ 
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                minWidth: 'auto',
                                                borderColor: 'rgba(59, 130, 246, 0.3)',
                                                color: 'rgb(59, 130, 246)'
                                            }}
                                            title="Şifre Sıfırla"
                                        >
                                            <i className="bi bi-key"></i>
                                        </button>
                                        <button 
                                            className="action-btn outline small" 
                                            onClick={() => handleDeleteUser(userItem.id)}
                                            style={{ 
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                minWidth: 'auto',
                                                borderColor: 'rgba(239, 68, 68, 0.3)',
                                                color: 'rgb(239, 68, 68)'
                                            }}
                                            title="Sil"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px', width: '95%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className="bi bi-plus-circle text-green-500"></i>
                                Yeni Kullanıcı Ekle
                            </h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddUser}>
                                <div className="form-group">
                                    <label className="form-label">Sicil No *</label>
                                    <input
                                        type="number"
                                        value={newUser.sicil_no}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, sicil_no: e.target.value }))}
                                        className="form-input"
                                        placeholder="Sicil numarasını girin..."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ad Soyad *</label>
                                    <input
                                        type="text"
                                        value={newUser.full_name}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="form-input"
                                        placeholder="Ad soyad girin..."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rol *</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                                        className="form-select"
                                        required
                                    >
                                        {roleOptions.map(role => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Şifre *</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                        className="form-input"
                                        placeholder="Şifre girin..."
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button" 
                                        className="action-btn outline"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        İptal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="action-btn primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Ekleniyor...' : 'Ekle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px', width: '95%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className="bi bi-pencil text-blue-500"></i>
                                Kullanıcı Düzenle - {editingUser.sicil_no}
                            </h3>
                            <button className="modal-close" onClick={() => setEditingUser(null)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const updatedData = {
                                    full_name: formData.get('full_name'),
                                    role: formData.get('role')
                                };
                                handleUpdateUser(editingUser.id, updatedData);
                            }}>
                                <div className="form-group">
                                    <label className="form-label">Sicil No</label>
                                    <input
                                        type="number"
                                        value={editingUser.sicil_no}
                                        className="form-input"
                                        disabled
                                        style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ad Soyad *</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        defaultValue={editingUser.full_name}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rol *</label>
                                    <select
                                        name="role"
                                        defaultValue={editingUser.role}
                                        className="form-select"
                                        required
                                    >
                                        {roleOptions.map(role => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button" 
                                        className="action-btn outline"
                                        onClick={() => setEditingUser(null)}
                                    >
                                        İptal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="action-btn primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Güncelleniyor...' : 'Güncelle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
