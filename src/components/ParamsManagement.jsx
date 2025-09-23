import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ParamsManagement = () => {
    const [parameters, setParameters] = useState([]);
    const [parameterTypes, setParameterTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingParam, setEditingParam] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        isActive: '',
        userId: ''
    });
    const { baseUrl, user } = useAuth();

    const [newParam, setNewParam] = useState({
        name: '',
        value: '',
        gnl_parm_type_id: '',
        userId: user.sicil_no,
        is_actv: true,
        extra_field1: ''
    });
    const [selectedTypeForAdd, setSelectedTypeForAdd] = useState(null);

    useEffect(() => {
        fetchParameters();
        fetchParameterTypes();
    }, []);

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const fetchParameters = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/params/getAll`);
            const data = await response.json();
            
            if (response.ok && data.success) {
                setParameters(data.data);
            } else {
                showError('Parametreler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Parametreler yüklenirken hata:', error);
            showError('Parametreler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchParameterTypes = async () => {
        try {
            const response = await fetch(`${baseUrl}/params/getTypes`);
            const data = await response.json();
            
            if (response.ok && data.success) {
                setParameterTypes(data.data);
            }
        } catch (error) {
            console.error('Parametre tipleri yüklenirken hata:', error);
        }
    };

    const handleAddParameter = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/params/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newParam),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Parametre başarıyla eklendi');
                setShowAddModal(false);
                setSelectedTypeForAdd(null);
                setNewParam({
                    name: '',
                    value: '',
                    gnl_parm_type_id: '',
                    userId: user.sicil_no,
                    is_actv: true,
                    extra_field1: ''
                });
                fetchParameters();
            } else {
                showError(data.error || 'Parametre eklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Parametre eklenirken hata:', error);
            showError('Parametre eklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToSpecificType = (typeInfo) => {
        setSelectedTypeForAdd(typeInfo);
        setNewParam(prev => ({
            ...prev,
            gnl_parm_type_id: typeInfo.gnl_parm_type_id
        }));
        setShowAddModal(true);
    };

    const handleUpdateParameter = async (paramId, updatedData) => {
        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/params/update/${paramId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Parametre başarıyla güncellendi');
                setEditingParam(null);
                fetchParameters();
            } else {
                showError(data.error || 'Parametre güncellenirken hata oluştu');
            }
        } catch (error) {
            console.error('Parametre güncellenirken hata:', error);
            showError('Parametre güncellenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteParameter = async (paramId) => {
        if (!window.confirm('Bu parametreyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${baseUrl}/params/delete/${paramId}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showSuccess('Parametre başarıyla silindi');
                fetchParameters();
            } else {
                showError(data.error || 'Parametre silinirken hata oluştu');
            }
        } catch (error) {
            console.error('Parametre silinirken hata:', error);
            showError('Parametre silinirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const getParameterTypeName = (typeId) => {
        const type = parameterTypes.find(t => t.gnl_parm_type_id === typeId);
        return type ? type.value : 'Bilinmeyen';
    };

    // Parametreleri tip bazında gruplandır
    const groupParametersByType = () => {
        const grouped = {};
        
        // Önce tüm tipleri ekle
        parameterTypes.forEach(type => {
            grouped[type.gnl_parm_type_id] = {
                typeInfo: type,
                parameters: []
            };
        });
        
        // Parametreleri ilgili tiplere ekle
        filteredParameters.forEach(param => {
            const typeId = param.gnl_parm_type_id;
            if (grouped[typeId]) {
                grouped[typeId].parameters.push(param);
            } else {
                // Tip bilgisi olmayan parametreler için
                if (!grouped['unknown']) {
                    grouped['unknown'] = {
                        typeInfo: { gnl_parm_type_id: 'unknown', value: 'Tip Bilgisi Yok' },
                        parameters: []
                    };
                }
                grouped['unknown'].parameters.push(param);
            }
        });
        
        return grouped;
    };

    const getStatusColor = (isActive) => {
        return isActive ? 'text-green-500' : 'text-red-500';
    };

    const getStatusText = (isActive) => {
        return isActive ? 'Aktif' : 'Pasif';
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

    const filteredParameters = parameters.filter(param => {
        if (filters.search && !param.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !param.value.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.type && param.gnl_parm_type_id !== parseInt(filters.type)) return false;
        if (filters.isActive !== '' && param.is_actv !== (filters.isActive === 'true')) return false;
        if (filters.userId && param.userId !== parseInt(filters.userId)) return false;
        return true;
    });

    const clearFilters = () => {
        setFilters({
            search: '',
            type: '',
            isActive: '',
            userId: ''
        });
    };

    if (loading && parameters.length === 0) {
        return (
            <div className="modern-page">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <div className="spin mb-3">
                            <i className="bi bi-arrow-repeat" style={{ fontSize: '3rem', color: '#8b5cf6' }}></i>
                        </div>
                        <p className="text-muted">Parametreler yükleniyor...</p>
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
                        <i className="bi bi-gear-wide-connected text-blue-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Parametre Yönetimi</h1>
                        <p>Sistem parametrelerini yönetin ve düzenleyin</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-list-ol"></i>
                    <span>{parameters.length} Parametre</span>
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
                                placeholder="İsim veya değer ara..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-tag"></i> Tip
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm tipler</option>
                                {parameterTypes.map(type => (
                                    <option key={type.gnl_parm_type_id} value={type.gnl_parm_type_id}>
                                        {type.value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-toggle-on"></i> Durum
                            </label>
                            <select
                                value={filters.isActive}
                                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                                className="form-select"
                            >
                                <option value="">Tüm durumlar</option>
                                <option value="true">Aktif</option>
                                <option value="false">Pasif</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <i className="bi bi-person"></i> Kullanıcı ID
                            </label>
                            <input
                                type="number"
                                value={filters.userId}
                                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
                                className="form-input"
                                placeholder="Kullanıcı ID..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Parameters List */}
            <div className="output-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-list-ul text-cyan-500"></i>
                        <span>Parametre Listesi ({filteredParameters.length})</span>
                    </div>
                    <div className="card-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            <i className="bi bi-plus-circle"></i>
                            Yeni Parametre
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {filteredParameters.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h3>Parametre bulunamadı</h3>
                            <p>Filtrelerinizi değiştirerek tekrar deneyin</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {Object.entries(groupParametersByType()).map(([typeId, group]) => {
                                if (group.parameters.length === 0) return null;
                                
                                return (
                                    <div key={typeId} className="config-card">
                                        <div className="card-header">
                                            <div className="card-title">
                                                <div 
                                                    className="nav-icon text-blue-500"
                                                    style={{ 
                                                        width: '40px', 
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    <i className="bi bi-tag-fill" style={{ fontSize: '20px' }}></i>
                                                </div>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                                                        {group.typeInfo.value}
                                                    </h3>
                                                    <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                                        {group.parameters.length} parametre
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="card-actions">
                                                <button 
                                                    className="action-btn primary small"
                                                    onClick={() => handleAddToSpecificType(group.typeInfo)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    <i className="bi bi-plus-circle"></i>
                                                    {group.typeInfo.value} Ekle
                                                </button>
                                            </div>
                                        </div>
                                        <div className="card-body" style={{ padding: 0 }}>
                                            {/* Tablo Başlığı */}
                                            <div style={{ 
                                                display: 'grid', 
                                                gridTemplateColumns: '60px 1fr 1fr 100px 120px 100px 120px',
                                                gap: '1rem',
                                                padding: '1rem',
                                                backgroundColor: '#f8fafc',
                                                borderBottom: '1px solid #e2e8f0',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                color: '#374151'
                                            }}>
                                                <div>ID</div>
                                                <div>Parametre Adı</div>
                                                <div>Değer</div>
                                                <div>Durum</div>
                                                <div>Kullanıcı ID</div>
                                                <div>Ek Alan</div>
                                                <div>İşlemler</div>
                                            </div>
                                            
                                            {/* Tablo İçeriği */}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {group.parameters.map((param, index) => (
                                                    <div 
                                                        key={param.id} 
                                                        style={{ 
                                                            display: 'grid', 
                                                            gridTemplateColumns: '60px 1fr 1fr 100px 120px 100px 120px',
                                                            gap: '1rem',
                                                            padding: '1rem',
                                                            borderBottom: index < group.parameters.length - 1 ? '1px solid #e2e8f0' : 'none',
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
                                                        {/* ID */}
                                                        <div style={{ 
                                                            fontWeight: '500', 
                                                            color: '#6b7280',
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            #{param.id}
                                                        </div>
                                                        
                                                        {/* Parametre Adı */}
                                                        <div style={{ 
                                                            fontWeight: '500',
                                                            color: '#1f2937',
                                                            fontSize: '0.875rem',
                                                            wordBreak: 'break-word'
                                                        }}>
                                                            {param.name}
                                                        </div>
                                                        
                                                        {/* Değer */}
                                                        <div style={{ 
                                                            color: '#374151',
                                                            fontSize: '0.875rem',
                                                            wordBreak: 'break-word',
                                                            fontFamily: 'monospace',
                                                            backgroundColor: '#f3f4f6',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            border: '1px solid #d1d5db'
                                                        }}>
                                                            {param.value}
                                                        </div>
                                                        
                                                        {/* Durum */}
                                                        <div>
                                                            <span 
                                                                className={`status-badge ${getStatusColor(param.is_actv)}`}
                                                                style={{
                                                                    fontSize: '0.75rem',
                                                                    padding: '0.25rem 0.5rem',
                                                                    borderRadius: '0.375rem',
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                {getStatusText(param.is_actv)}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Kullanıcı ID */}
                                                        <div style={{ 
                                                            color: '#6b7280',
                                                            fontSize: '0.875rem',
                                                            fontFamily: 'monospace'
                                                        }}>
                                                            {param.userId || '-'}
                                                        </div>
                                                        
                                                        {/* Ek Alan */}
                                                        <div style={{ 
                                                            color: '#6b7280',
                                                            fontSize: '0.875rem',
                                                            wordBreak: 'break-word'
                                                        }}>
                                                            {param.extra_field1 || '-'}
                                                        </div>
                                                        
                                                        {/* İşlemler */}
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button 
                                                                className="action-btn outline small" 
                                                                onClick={() => setEditingParam(param)}
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
                                                                onClick={() => handleDeleteParameter(param.id)}
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
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Parameter Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px', width: '95%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className="bi bi-plus-circle text-green-500"></i>
                                {selectedTypeForAdd ? `${selectedTypeForAdd.value} Parametresi Ekle` : 'Yeni Parametre Ekle'}
                            </h3>
                            <button className="modal-close" onClick={() => {
                                setShowAddModal(false);
                                setSelectedTypeForAdd(null);
                            }}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddParameter}>
                                <div className="form-group">
                                    <label className="form-label">Parametre Adı *</label>
                                    <input
                                        type="text"
                                        value={newParam.name}
                                        onChange={(e) => setNewParam(prev => ({ ...prev, name: e.target.value }))}
                                        className="form-input"
                                        placeholder="Parametre adını girin..."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Değer *</label>
                                    <input
                                        type="text"
                                        value={newParam.value}
                                        onChange={(e) => setNewParam(prev => ({ ...prev, value: e.target.value }))}
                                        className="form-input"
                                        placeholder="Parametre değerini girin..."
                                        required
                                    />
                                </div>
                                {!selectedTypeForAdd && (
                                    <div className="form-group">
                                        <label className="form-label">Parametre Tipi</label>
                                        <select
                                            value={newParam.gnl_parm_type_id}
                                            onChange={(e) => setNewParam(prev => ({ ...prev, gnl_parm_type_id: e.target.value }))}
                                            className="form-select"
                                        >
                                            <option value="">Tip seçin...</option>
                                            {parameterTypes.map(type => (
                                                <option key={type.gnl_parm_type_id} value={type.gnl_parm_type_id}>
                                                    {type.value}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                
                                {selectedTypeForAdd && (
                                    <div className="form-group">
                                        <label className="form-label">Parametre Tipi</label>
                                        <div style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#f0f9ff',
                                            border: '1px solid #0ea5e9',
                                            borderRadius: '0.375rem',
                                            color: '#0369a1',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <i className="bi bi-tag-fill"></i>
                                            {selectedTypeForAdd.value}
                                        </div>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label className="form-label">Kullanıcı ID</label>
                                    <input
                                        type="number"
                                        value={newParam.userId}
                                        onChange={(e) => setNewParam(prev => ({ ...prev, userId: e.target.value }))}
                                        className="form-input"
                                        placeholder="Kullanıcı ID..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ek Alan</label>
                                    <input
                                        type="text"
                                        value={newParam.extra_field1}
                                        onChange={(e) => setNewParam(prev => ({ ...prev, extra_field1: e.target.value }))}
                                        className="form-input"
                                        placeholder="Ek bilgi..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <input
                                            type="checkbox"
                                            checked={newParam.is_actv}
                                            onChange={(e) => setNewParam(prev => ({ ...prev, is_actv: e.target.checked }))}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        Aktif
                                    </label>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button" 
                                        className="action-btn outline"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setSelectedTypeForAdd(null);
                                        }}
                                    >
                                        İptal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="action-btn primary"
                                        disabled={loading || (!selectedTypeForAdd && !newParam.gnl_parm_type_id)}
                                    >
                                        {loading ? 'Ekleniyor...' : 'Ekle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Parameter Modal */}
            {editingParam && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '600px', width: '95%' }}>
                        <div className="modal-header">
                            <h3>
                                <i className="bi bi-pencil text-blue-500"></i>
                                Parametre Düzenle - #{editingParam.id}
                            </h3>
                            <button className="modal-close" onClick={() => setEditingParam(null)}>
                                <i className="bi bi-x"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const updatedData = {
                                    name: formData.get('name'),
                                    value: formData.get('value'),
                                    gnl_parm_type_id: formData.get('gnl_parm_type_id'),
                                    userId: formData.get('userId'),
                                    is_actv: formData.get('is_actv') === 'on',
                                    extra_field1: formData.get('extra_field1')
                                };
                                handleUpdateParameter(editingParam.id, updatedData);
                            }}>
                                <div className="form-group">
                                    <label className="form-label">Parametre Adı *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={editingParam.name}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Değer *</label>
                                    <input
                                        type="text"
                                        name="value"
                                        defaultValue={editingParam.value}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Parametre Tipi</label>
                                    <select
                                        name="gnl_parm_type_id"
                                        defaultValue={editingParam.gnl_parm_type_id}
                                        className="form-select"
                                    >
                                        <option value="">Tip seçin...</option>
                                        {parameterTypes.map(type => (
                                            <option key={type.gnl_parm_type_id} value={type.gnl_parm_type_id}>
                                                {type.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Kullanıcı ID</label>
                                    <input
                                        type="number"
                                        name="userId"
                                        defaultValue={editingParam.userId}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Ek Alan</label>
                                    <input
                                        type="text"
                                        name="extra_field1"
                                        defaultValue={editingParam.extra_field1}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <input
                                            type="checkbox"
                                            name="is_actv"
                                            defaultChecked={editingParam.is_actv}
                                            style={{ marginRight: '0.5rem' }}
                                        />
                                        Aktif
                                    </label>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button" 
                                        className="action-btn outline"
                                        onClick={() => setEditingParam(null)}
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

export default ParamsManagement;
