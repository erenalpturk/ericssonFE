import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { scriptsService } from '../services/scriptsService';
import { projectsService } from '../services/projectsService';
import '../styles/Scriptler.css';

const Scriptler = () => {
    const { user, baseUrl } = useAuth();
    
    // State değişkenleri
    const [scripts, setScripts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [activeProject, setActiveProject] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0
    });
    
    // Inline editing state'leri
    const [showAddRow, setShowAddRow] = useState(false);
    const [editingScript, setEditingScript] = useState(null);
    const [formData, setFormData] = useState({
        script_name: '',
        description: '',
        usage_area: '',
        category: 'general',
        project_name: ''
    });

    // Admin proje ekleme state'leri
    const [showAddProject, setShowAddProject] = useState(false);
    const [projectFormData, setProjectFormData] = useState({
        project_name: '',
        description: '',
        project_code: ''
    });

    // API'den veri çekme
    const fetchScripts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            // Filtreleme parametreleri
            if (activeTab === 'general') {
                params.category = 'general';
            } else if (activeTab === 'project') {
                params.category = 'project';
                if (activeProject) {
                    params.project_name = activeProject;
                }
            }

            let response;
            if (searchTerm && searchTerm.length >= 2) {
                // Arama yap
                response = await scriptsService.searchScripts(baseUrl, searchTerm, params);
            } else {
                // Normal listeleme
                response = await scriptsService.getAllScripts(baseUrl, params);
            }

            setScripts(response.data || []);
            if (response.pagination) {
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination.total
                }));
            }

        } catch (err) {
            console.error('Scripts fetch error:', err);
            setError(err.message || 'Scriptler yüklenirken hata oluştu');
            toast.error('Scriptler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Proje listesini çek
    const fetchProjects = async () => {
        try {
            const response = await projectsService.getProjectNames(baseUrl);
            setProjects(response.data || []);
        } catch (err) {
            console.error('Projects fetch error:', err);
        }
    };

    // Component mount edildiğinde ve filtreler değiştiğinde veri çek
    useEffect(() => {
        // Arama için debounce uygula
        const timeoutId = setTimeout(() => {
            fetchScripts();
        }, searchTerm ? 500 : 0); // Arama varsa 500ms bekle, yoksa hemen çek

        return () => clearTimeout(timeoutId);
    }, [activeTab, activeProject, pagination.page, searchTerm]);

    useEffect(() => {
        fetchProjects();
    }, []);

    // Filtreleme ve sıralama (client-side)
    const filteredAndSortedScripts = scripts
        .sort((a, b) => {
            let aValue, bValue;
            
            if (sortField === 'user') {
                aValue = a.user_name;
                bValue = b.user_name;
            } else if (sortField === 'script') {
                aValue = a.script_name;
                bValue = b.script_name;
            } else if (sortField === 'created_at') {
                aValue = new Date(a.created_at);
                bValue = new Date(b.created_at);
            } else {
                aValue = a[sortField];
                bValue = b[sortField];
            }
            
            if (sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return 'bi-arrow-down-up';
        return sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
    };

    const handleCopyScript = (scriptName) => {
        navigator.clipboard.writeText(scriptName).then(() => {
            toast.success(`"${scriptName}" kopyalandı!`);
        }).catch(() => {
            toast.error('Kopyalama işlemi başarısız!');
        });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActiveProject('');
        setSearchTerm('');
        
        // Tab değiştirildiğinde tüm açık formları kapat
        setShowAddRow(false);
        setEditingScript(null);
        setShowAddProject(false);
        resetForm();
        setProjectFormData({
            project_name: '',
            description: '',
            project_code: ''
        });
    };

    const handleProjectChange = (project) => {
        setActiveProject(project);
        setSearchTerm('');
        
        // Proje değiştirildiğinde tüm açık formları kapat
        setShowAddRow(false);
        setEditingScript(null);
        setShowAddProject(false);
        resetForm();
        setProjectFormData({
            project_name: '',
            description: '',
            project_code: ''
        });
    };

    // Form işlemleri
    const resetForm = () => {
        setFormData({
            script_name: '',
            description: '',
            usage_area: '',
            category: 'general',
            project_name: ''
        });
    };

    const handleCreateScript = () => {
        resetForm();
        // Aktif tab'a göre kategori ayarla
        const category = activeTab === 'project' ? 'project' : 'general';
        const project_name = activeTab === 'project' && activeProject ? activeProject : '';
        
        setFormData(prev => ({
            ...prev,
            category,
            project_name,
            script_name: '',
            description: '',
            usage_area: ''
        }));
        
        setShowAddRow(true);
    };

    const handleEditScript = (script) => {
        setEditingScript(script);
        setFormData({
            script_name: script.script_name,
            description: script.description,
            usage_area: script.usage_area || '',
            category: script.category,
            project_name: script.project_name || ''
        });
    };

    const handleDeleteScript = async (scriptId, scriptName) => {
        if (!window.confirm(`"${scriptName}" scriptini silmek istediğinize emin misiniz?`)) {
            return;
        }

        try {
            await scriptsService.deleteScript(baseUrl, scriptId, user.sicil_no);
            toast.success('Script başarıyla silindi');
            fetchScripts(); // Listeyi yenile
        } catch (err) {
            console.error('Delete script error:', err);
            toast.error(err.message || 'Script silinirken hata oluştu');
        }
    };

    const handleSaveScript = async () => {
        if (!formData.script_name.trim() || !formData.description.trim() || !formData.usage_area.trim()) {
            toast.error('Script adı, açıklama ve kullanım alanı zorunludur');
            return;
        }

        if (formData.category === 'project' && !formData.project_name.trim()) {
            toast.error('Proje kategorisi için proje adı zorunludur');
            return;
        }

        try {
            const scriptData = {
                user_sicil_no: user.sicil_no,
                user_name: user.full_name,
                script_name: formData.script_name.trim(),
                description: formData.description.trim(),
                usage_area: formData.usage_area.trim(),
                category: formData.category,
                project_name: formData.category === 'project' ? formData.project_name.trim() : null
            };

            if (editingScript) {
                // Güncelleme
                await scriptsService.updateScript(baseUrl, editingScript.id, scriptData);
                toast.success('Script başarıyla güncellendi');
                setEditingScript(null);
            } else {
                // Yeni oluşturma
                await scriptsService.createScript(baseUrl, scriptData);
                toast.success('Script başarıyla oluşturuldu');
                setShowAddRow(false);
            }
            
            resetForm();
            fetchScripts(); // Listeyi yenile
        } catch (err) {
            console.error('Save script error:', err);
            toast.error(err.message || 'İşlem sırasında hata oluştu');
        }
    };

    const handleCancelEdit = () => {
        setEditingScript(null);
        setShowAddRow(false);
        resetForm();
    };

    // Proje ekleme fonksiyonları
    const handleCreateProject = () => {
        setProjectFormData({
            project_name: '',
            description: '',
            project_code: ''
        });
        setShowAddProject(true);
    };

    const handleSaveProject = async () => {
        if (!projectFormData.project_name.trim()) {
            toast.error('Proje adı zorunludur');
            return;
        }

        try {
            await projectsService.createProject(baseUrl, projectFormData);
            toast.success('Proje başarıyla oluşturuldu');
            setShowAddProject(false);
            setProjectFormData({
                project_name: '',
                description: '',
                project_code: ''
            });
            fetchProjects(); // Proje listesini yenile
        } catch (err) {
            console.error('Create project error:', err);
            toast.error(err.message || 'Proje oluşturulurken hata oluştu');
        }
    };

    const handleCancelProject = () => {
        setShowAddProject(false);
        setProjectFormData({
            project_name: '',
            description: '',
            project_code: ''
        });
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="scriptler-container">
            <div className="page-header">
                <h2 className="page-title">
                    <i className="bi bi-code-slash me-2"></i>
                    Scriptler
                </h2>
                <p className="page-subtitle">
                    Sistem scriptleri ve otomasyonları
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <div className="nav nav-pills" role="tablist">
                    <button
                        className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => handleTabChange('general')}
                    >
                        <i className="bi bi-gear me-2"></i>
                        Genel Scriptler
                    </button>
                    <button
                        className={`nav-link ${activeTab === 'project' ? 'active' : ''}`}
                        onClick={() => handleTabChange('project')}
                    >
                        <i className="bi bi-folder me-2"></i>
                        Proje Özelinde Scriptler
                    </button>
                </div>
            </div>

            {/* Project Filter - Sadece proje sekmesinde göster */}
            {activeTab === 'project' && (
                <div className="project-filter">
                    <div className="project-buttons">
                        <button
                            className={`project-btn ${!activeProject ? 'active' : ''}`}
                            onClick={() => handleProjectChange('')}
                        >
                            <i className="bi bi-list-ul me-2"></i>
                            Tüm Projeler
                        </button>
                        {projects.map((project) => (
                            <button
                                key={project}
                                className={`project-btn ${activeProject === project ? 'active' : ''}`}
                                onClick={() => handleProjectChange(project)}
                            >
                                <i className="bi bi-folder-fill me-2"></i>
                                {project}
                            </button>
                        ))}
                        
                        {/* Admin için yeni proje ekleme butonu */}
                        {user.role === 'admin' && !showAddProject && (
                            <button 
                                className="project-btn add-project-btn"
                                onClick={handleCreateProject}
                                title="Yeni proje ekle"
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Yeni Proje Ekle
                            </button>
                        )}
                    </div>

                    {/* Admin proje ekleme satırı */}
                    {showAddProject && user.role === 'admin' && (
                        <div className="add-project-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="project_name"
                                        value={projectFormData.project_name}
                                        onChange={handleProjectInputChange}
                                        placeholder="Proje adı (örn: 5G Migration)"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="project_code"
                                        value={projectFormData.project_code}
                                        onChange={handleProjectInputChange}
                                        placeholder="Proje kodu (örn: 5GM001)"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        value={projectFormData.description}
                                        onChange={handleProjectInputChange}
                                        placeholder="Proje açıklaması"
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={handleSaveProject}
                                        title="Kaydet"
                                    >
                                        <i className="bi bi-check"></i>
                                    </button>
                                    <button 
                                        className="btn btn-secondary btn-sm"
                                        onClick={handleCancelProject}
                                        title="İptal"
                                    >
                                        <i className="bi bi-x"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="controls-section">
                <div className="search-container">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Script ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-info">
                    <span className="result-count">
                        {filteredAndSortedScripts.length} script bulundu
                    </span>
                    {activeTab === 'project' && activeProject && (
                        <span className="active-project-badge">
                            <i className="bi bi-folder-fill me-1"></i>
                            {activeProject}
                        </span>
                    )}
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-3">Scriptler yükleniyor...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <div className="error-icon">
                            <i className="bi bi-exclamation-triangle text-danger"></i>
                        </div>
                        <h5>Hata Oluştu</h5>
                        <p>{error}</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => fetchScripts()}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Tekrar Dene
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table scripts-table">
                                <thead>
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => handleSort('user')}
                                        >
                                            <div className="th-content">
                                                User
                                                <i className={`bi ${getSortIcon('user')} ms-1`}></i>
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => handleSort('script')}
                                        >
                                            <div className="th-content">
                                                Script
                                                <i className={`bi ${getSortIcon('script')} ms-1`}></i>
                                            </div>
                                        </th>
                                        <th scope="col">Ne işe yarar?</th>
                                        <th scope="col">Nerelerde kullanılır?</th>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => handleSort('created_at')}
                                        >
                                            <div className="th-content">
                                                Tarih
                                                <i className={`bi ${getSortIcon('created_at')} ms-1`}></i>
                                            </div>
                                        </th>
                                        <th scope="col" style={{width: '120px'}}>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAndSortedScripts.map((script) => 
                                        editingScript && editingScript.id === script.id ? (
                                            // Edit satırı
                                            <tr key={script.id} className="script-row editing">
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">
                                                            {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : '??'}
                                                        </div>
                                                        <span className="user-name">{user.full_name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        name="script_name"
                                                        value={formData.script_name}
                                                        onChange={handleInputChange}
                                                        placeholder="Script adı"
                                                    />
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        placeholder="Ne işe yarar?"
                                                        rows="2"
                                                    />
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        name="usage_area"
                                                        value={formData.usage_area}
                                                        onChange={handleInputChange}
                                                        placeholder="Nerelerde kullanılır?"
                                                        rows="2"
                                                    />
                                                </td>
                                                <td>
                                                    <div className="date-cell">
                                                        <i className="bi bi-clock me-2"></i>
                                                        <small>Düzenleniyor...</small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn btn-sm btn-success me-1"
                                                            onClick={handleSaveScript}
                                                            title="Kaydet"
                                                        >
                                                            <i className="bi bi-check"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={handleCancelEdit}
                                                            title="İptal"
                                                        >
                                                            <i className="bi bi-x"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            // Normal satır
                                            <tr key={script.id} className="script-row">
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">
                                                            {script.user_name ? script.user_name.split(' ').map(n => n[0]).join('') : '??'}
                                                        </div>
                                                        <span className="user-name">{script.user_name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="script-cell">
                                                        <i className="bi bi-file-earmark-code me-2"></i>
                                                        <span className="script-name">{script.script_name}</span>
                                                        <button 
                                                            className="copy-btn"
                                                            onClick={() => handleCopyScript(script.script_name)}
                                                            title="Script adını kopyala"
                                                        >
                                                            <i className="bi bi-copy"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="description-cell">
                                                        {script.description}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="usage-cell">
                                                        {script.usage_area || 'Belirtilmemiş'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-cell">
                                                        <i className="bi bi-calendar-event me-2"></i>
                                                        {new Date(script.created_at).toLocaleDateString('tr-TR')}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {(user.role === 'admin' || script.created_by === `${user.sicil_no}@company.com`) && (
                                                            <>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-primary me-1"
                                                                    onClick={() => handleEditScript(script)}
                                                                    title="Düzenle"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteScript(script.id, script.script_name)}
                                                                    title="Sil"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}

                                    {/* Yeni script ekleme satırı */}
                                    {showAddRow && (
                                        <tr className="script-row adding">
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : '??'}
                                                    </div>
                                                    <span className="user-name">{user.full_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    name="script_name"
                                                    value={formData.script_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Script adı (örn: backup_db.sh)"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Ne işe yarar?"
                                                    rows="2"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    name="usage_area"
                                                    value={formData.usage_area}
                                                    onChange={handleInputChange}
                                                    placeholder="Nerelerde kullanılır?"
                                                    rows="2"
                                                />
                                            </td>
                                            <td>
                                                <div className="category-info">
                                                    <span className={`badge ${formData.category === 'project' ? 'badge-project' : 'badge-general'}`}>
                                                        {formData.category === 'project' ? 'Proje' : 'Genel'}
                                                    </span>
                                                    {formData.category === 'project' && formData.project_name && (
                                                        <small className="d-block mt-1">{formData.project_name}</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn btn-sm btn-success me-1"
                                                        onClick={handleSaveScript}
                                                        title="Kaydet"
                                                    >
                                                        <i className="bi bi-check"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={handleCancelEdit}
                                                        title="İptal"
                                                    >
                                                        <i className="bi bi-x"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Add New Script Button - Sadece belirli bir proje seçildiğinde veya genel tab'da göster */}
                        {!showAddRow && !editingScript && (activeTab === 'general' || (activeTab === 'project' && activeProject)) && (
                            <div className="add-script-container">
                                <button 
                                    className="add-script-btn"
                                    onClick={handleCreateScript}
                                    title="Yeni script ekle"
                                >
                                    <i className="bi bi-plus-circle"></i>
                                    <span>Yeni Script Ekle</span>
                                </button>
                            </div>
                        )}

                        {!loading && filteredAndSortedScripts.length === 0 && !showAddRow && (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <i className="bi bi-code-slash"></i>
                                </div>
                                <h3>
                                    {searchTerm 
                                        ? 'Sonuç bulunamadı' 
                                        : activeTab === 'project' && !activeProject
                                            ? 'Proje seçin'
                                            : 'Henüz script yok'
                                    }
                                </h3>
                                <p>
                                    {searchTerm 
                                        ? 'Arama kriterlerinize uygun script bulunamadı.' 
                                        : activeTab === 'project' && !activeProject
                                            ? 'Script eklemek için önce bir proje seçin.'
                                            : 'İlk scripti oluşturmak için aşağıdaki butona tıklayın'
                                    }
                                </p>
                                {!searchTerm && (activeTab === 'general' || (activeTab === 'project' && activeProject)) && (
                                    <button 
                                        className="btn btn-primary btn-lg mt-3"
                                        onClick={handleCreateScript}
                                    >
                                        <i className="bi bi-plus-circle me-2"></i>
                                        İlk Script'i Ekle
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>


        </div>
    );
};

export default Scriptler; 