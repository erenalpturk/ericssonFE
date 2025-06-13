import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import contactsService from '../services/contactsService';
import toast from 'react-hot-toast';
import '../styles/Contacts.css';

const Contacts = () => {
    const { user, baseUrl } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [editData, setEditData] = useState({
        system_info: '',
        contact_info: '',
        contact_type: 'defect',
        support_test: ''
    });

    // Kontakları yükle
    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await contactsService.getAllContacts(baseUrl);
            setContacts(response.data || []);
        } catch (err) {
            console.error('Kontaklar yüklenirken hata:', err);
            setError(err.message || 'Kontaklar yüklenirken hata oluştu');
            toast.error('Kontaklar yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Arama için debounce uygula
        const timeoutId = setTimeout(() => {
            fetchContacts();
        }, searchTerm ? 500 : 0);

        return () => clearTimeout(timeoutId);
    }, [baseUrl, searchTerm]);

    // Düzenleme başlat
    const startEdit = (contact) => {
        setEditingId(contact.id);
        setEditData({
            system_info: contact.system_info,
            contact_info: contact.contact_info,
            contact_type: contact.contact_type,
            support_test: contact.support_test || ''
        });
        setShowNewForm(false);
    };

    // Yeni form göster
    const showNewContact = () => {
        setShowNewForm(true);
        setEditingId(null);
        setEditData({
            system_info: '',
            contact_info: '',
            contact_type: 'defect',
            support_test: ''
        });
    };

    // Formu iptal et
    const cancelEdit = () => {
        setEditingId(null);
        setShowNewForm(false);
        setEditData({
            system_info: '',
            contact_info: '',
            contact_type: 'defect',
            support_test: ''
        });
    };

    // Kontak kaydet
    const saveContact = async () => {
        if (!editData.system_info.trim() || !editData.contact_info.trim()) {
            toast.error('Lütfen tüm alanları doldurun');
            return;
        }

        // Defect seçiliyse support_test zorunlu
        if (editData.contact_type === 'defect' && !editData.support_test.trim()) {
            toast.error('Defect tipi için Support/Test bilgisi zorunludur');
            return;
        }

        try {
            // User name'i her zaman login olan kullanıcıdan al
            const dataToSend = {
                ...editData,
                user_name: user.full_name
            };

            if (editingId) {
                await contactsService.updateContact(baseUrl, editingId, dataToSend);
                toast.success('Kontak başarıyla güncellendi');
            } else {
                await contactsService.createContact(baseUrl, dataToSend);
                toast.success('Kontak başarıyla oluşturuldu');
            }
            
            fetchContacts();
            cancelEdit();
        } catch (error) {
            console.error('Kontak kaydedilirken hata:', error);
            toast.error(error.message || 'Kontak kaydedilirken hata oluştu');
        }
    };

    // Kontak sil
    const deleteContact = async (contactId, contactName) => {
        if (!window.confirm(`"${contactName}" kontağını silmek istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            await contactsService.deleteContact(baseUrl, contactId);
            toast.success('Kontak başarıyla silindi');
            fetchContacts();
        } catch (error) {
            console.error('Kontak silinirken hata:', error);
            toast.error(error.message || 'Kontak silinirken hata oluştu');
        }
    };

    // Input değişikliklerini handle et
    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Sıralama
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

    // Filtreleme ve sıralama
    const filteredAndSortedContacts = contacts
        .filter(contact => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                contact.user_name.toLowerCase().includes(searchLower) ||
                contact.system_info.toLowerCase().includes(searchLower) ||
                contact.contact_info.toLowerCase().includes(searchLower) ||
                contact.contact_type.toLowerCase().includes(searchLower) ||
                (contact.support_test && contact.support_test.toLowerCase().includes(searchLower))
            );
        })
        .sort((a, b) => {
            let aValue, bValue;
            
            if (sortField === 'created_at') {
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

    return (
        <div className="contacts-container">
            <div className="page-header">
                <h2 className="page-title">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Kontak Bilgileri
                </h2>
                <p className="page-subtitle">
                    Sistem kontakları ve iletişim bilgileri
                </p>
            </div>

            <div className="controls-section">
                <div className="search-container">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Kontak ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-info">
                    <span className="result-count">
                        {filteredAndSortedContacts.length} kontak bulundu
                    </span>
                </div>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Yükleniyor...</span>
                        </div>
                        <p className="mt-3">Kontaklar yükleniyor...</p>
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
                            onClick={() => fetchContacts()}
                        >
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Tekrar Dene
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table contacts-table">
                                <thead>
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => handleSort('user_name')}
                                        >
                                            <div className="th-content">
                                                Kullanıcı Adı
                                                <i className={`bi ${getSortIcon('user_name')} ms-1`}></i>
                                            </div>
                                        </th>
                                        <th scope="col">Sistem Bilgisi</th>
                                        <th scope="col">İletişim Bilgisi</th>
                                        <th 
                                            scope="col" 
                                            className="sortable"
                                            onClick={() => handleSort('contact_type')}
                                        >
                                            <div className="th-content">
                                                Kontak Tipi
                                                <i className={`bi ${getSortIcon('contact_type')} ms-1`}></i>
                                            </div>
                                        </th>
                                        <th scope="col">Support/Test</th>
                                        <th scope="col">Oluşturan</th>
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
                                    {filteredAndSortedContacts.map((contact) => 
                                        editingId === contact.id ? (
                                            // Edit satırı
                                            <tr key={contact.id} className="contact-row editing">
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">
                                                            {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : '??'}
                                                        </div>
                                                        <span className="user-name">{user.full_name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        value={editData.system_info}
                                                        onChange={(e) => handleInputChange('system_info', e.target.value)}
                                                        placeholder="Sistem bilgisi"
                                                        rows="2"
                                                    />
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="form-control form-control-sm"
                                                        value={editData.contact_info}
                                                        onChange={(e) => handleInputChange('contact_info', e.target.value)}
                                                        placeholder="İletişim bilgisi"
                                                        rows="2"
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={editData.contact_type}
                                                        onChange={(e) => handleInputChange('contact_type', e.target.value)}
                                                    >
                                                        <option value="defect">Defect</option>
                                                        <option value="mail">Mail</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    {editData.contact_type === 'defect' ? (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editData.support_test}
                                                            onChange={(e) => handleInputChange('support_test', e.target.value)}
                                                            placeholder="Support/Test bilgisi"
                                                        />
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="creator-cell">
                                                        <i className="bi bi-person me-2"></i>
                                                        {contact.created_by}
                                                    </div>
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
                                                            onClick={saveContact}
                                                            title="Kaydet"
                                                        >
                                                            <i className="bi bi-check"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-secondary"
                                                            onClick={cancelEdit}
                                                            title="İptal"
                                                        >
                                                            <i className="bi bi-x"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            // Normal satır
                                            <tr key={contact.id} className="contact-row">
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">
                                                            {contact.user_name ? contact.user_name.split(' ').map(n => n[0]).join('') : '??'}
                                                        </div>
                                                        <span className="user-name">{contact.user_name}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="system-info-cell">
                                                        <i className="bi bi-laptop me-2"></i>
                                                        <span className="system-info">{contact.system_info}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="contact-info-cell">
                                                        <i className="bi bi-envelope me-2"></i>
                                                        <span className="contact-info">{contact.contact_info}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`contact-type-badge ${contact.contact_type}`}>
                                                        <i className={`bi ${contact.contact_type === 'defect' ? 'bi-bug' : 'bi-envelope'} me-1`}></i>
                                                        {contact.contact_type === 'defect' ? 'Defect' : 'Mail'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="support-test-cell">
                                                        {contact.contact_type === 'defect' && contact.support_test ? (
                                                            <>
                                                                <i className="bi bi-tools me-2"></i>
                                                                <span className="support-test">{contact.support_test}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="creator-cell">
                                                        <i className="bi bi-person me-2"></i>
                                                        {contact.created_by}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-cell">
                                                        <i className="bi bi-calendar-event me-2"></i>
                                                        {new Date(contact.created_at).toLocaleDateString('tr-TR')}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button 
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            onClick={() => startEdit(contact)}
                                                            title="Düzenle"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => deleteContact(contact.id, contact.user_name)}
                                                            title="Sil"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}

                                    {/* Yeni kontak ekleme satırı */}
                                    {showNewForm && (
                                        <tr className="contact-row adding">
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : '??'}
                                                    </div>
                                                    <span className="user-name">{user.full_name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    value={editData.system_info}
                                                    onChange={(e) => handleInputChange('system_info', e.target.value)}
                                                    placeholder="Sistem bilgisi"
                                                    rows="2"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    className="form-control form-control-sm"
                                                    value={editData.contact_info}
                                                    onChange={(e) => handleInputChange('contact_info', e.target.value)}
                                                    placeholder="İletişim bilgisi"
                                                    rows="2"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={editData.contact_type}
                                                    onChange={(e) => handleInputChange('contact_type', e.target.value)}
                                                >
                                                    <option value="defect">Defect</option>
                                                    <option value="mail">Mail</option>
                                                </select>
                                            </td>
                                            <td>
                                                {editData.contact_type === 'defect' ? (
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={editData.support_test}
                                                        onChange={(e) => handleInputChange('support_test', e.target.value)}
                                                        placeholder="Support/Test bilgisi"
                                                    />
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="creator-cell">
                                                    <i className="bi bi-person me-2"></i>
                                                    {user.sicil_no}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    <i className="bi bi-clock me-2"></i>
                                                    <small>Yeni</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="btn btn-sm btn-success me-1"
                                                        onClick={saveContact}
                                                        title="Kaydet"
                                                    >
                                                        <i className="bi bi-check"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={cancelEdit}
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

                        {/* Yeni Kontak Ekle Butonu */}
                        {!showNewForm && !editingId && (
                            <div className="add-contact-container">
                                <button
                                    onClick={showNewContact}
                                    className="add-contact-btn"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Yeni Kontak Ekle
                                </button>
                            </div>
                        )}

                        {/* Boş durum */}
                        {filteredAndSortedContacts.length === 0 && !showNewForm && !loading && (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <i className="bi bi-person-lines-fill"></i>
                                </div>
                                <h5>Henüz kontak yok</h5>
                                <p>İlk kontağı oluşturarak başlayın.</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={showNewContact}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    İlk Kontağı Ekle
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Contacts; 