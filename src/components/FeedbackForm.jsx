import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const FeedbackForm = ({ onSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        type: 'hata',
        title: '',
        description: '',
        category: '',
        module_name: '',
        priority: 'orta'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Kullanıcı bilgilerini al
    const { user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title || formData.title.length < 10) {
            newErrors.title = 'Başlık en az 10 karakter olmalıdır';
        }
        
        if (!formData.description || formData.description.length < 20) {
            newErrors.description = 'Açıklama en az 20 karakter olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        if (!user.sicil_no) {
            alert('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.');
            return;
        }
        
        setLoading(true);
        
        try {
            const payload = {
                ...formData,
                user_sicil_no: user.sicil_no,
                user_name: user.full_name || user.name || '',
                user_email: user.email || ''
            };
            
            const response = await axios.post('/feedback/create', payload);
            
            if (response.data.success) {
                onSuccess(response.data.data);
                setFormData({
                    type: 'hata',
                    title: '',
                    description: '',
                    category: '',
                    module_name: '',
                    priority: 'orta'
                });
            }
        } catch (error) {
            console.error('Feedback gönderilirken hata:', error);
            
            if (error.response && error.response.data && error.response.data.error) {
                alert(`Hata: ${error.response.data.error}`);
            } else {
                alert('Feedback gönderilirken hata oluştu!');
            }
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { value: '', label: 'Kategori seçin...' },
        { value: 'ui_ux', label: 'Arayüz ve Kullanıcı Deneyimi' },
        { value: 'performance', label: 'Performans' },
        { value: 'functionality', label: 'İşlevsellik' },
        { value: 'security', label: 'Güvenlik' },
        { value: 'integration', label: 'Entegrasyon' },
        { value: 'data', label: 'Veri İşleme' },
        { value: 'mobile', label: 'Mobil Uyumluluk' },
        { value: 'other', label: 'Diğer' }
    ];

    const modules = [
        { value: '', label: 'Modül seçin...' },
        { value: 'aktivasyonlarim', label: 'Aktivasyonlarım' },
        { value: 'omni_otomasyon', label: 'OMNİ Otomasyon' },
        { value: 'dostman', label: 'Dostman' },
        { value: 'iccid', label: 'ICCID' },
        { value: 'sms_decrypt', label: 'SMS Decrypt' },
        { value: 'sql_create', label: 'SQL Create' },
        { value: 'kurye_tetikleme', label: 'Kurye Tetikleme' },
        { value: 'hata_oneri', label: 'Hata & Öneri' }
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Tip ve Öncelik Seçimi */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="bi bi-clipboard-check"></i> Feedback Tipi *
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: 'hata' }))}
                                className={`action-btn ${formData.type === 'hata' ? 'danger' : 'outline'}`}
                                style={{ padding: '1rem', textAlign: 'center', minHeight: '70px' }}
                            >
                                <i className="bi bi-bug-fill" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}></i>
                                <div>Hata Bildirimi</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: 'oneri' }))}
                                className={`action-btn ${formData.type === 'oneri' ? 'success' : 'outline'}`}
                                style={{ padding: '1rem', textAlign: 'center', minHeight: '70px' }}
                            >
                                <i className="bi bi-lightbulb-fill" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}></i>
                                <div>Öneri</div>
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="bi bi-exclamation-triangle"></i> Öncelik Düzeyi *
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {[
                                { value: 'dusuk', label: 'Düşük', icon: 'bi-circle-fill text-green-500' },
                                { value: 'orta', label: 'Orta', icon: 'bi-circle-fill text-yellow-500' },
                                { value: 'yuksek', label: 'Yüksek', icon: 'bi-circle-fill text-orange-500' },
                                { value: 'kritik', label: 'Kritik', icon: 'bi-circle-fill text-red-500' }
                            ].map(priority => (
                                <button
                                    key={priority.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                                    className={`action-btn small ${formData.priority === priority.value ? 'primary' : 'outline'}`}
                                    style={{ padding: '0.75rem', fontSize: '0.875rem', minHeight: '45px' }}
                                >
                                    <i className={priority.icon} style={{ marginRight: '0.5rem' }}></i>
                                    <span>{priority.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Başlık */}
                <div className="form-group">
                    <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="bi bi-pencil"></i> Başlık *
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'normal' }}>(Min 10 karakter)</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`form-input ${errors.title ? 'error' : ''}`}
                        placeholder={formData.type === 'hata' ? 'Örn: Login sayfasında şifre sıfırlama butonu çalışmıyor' : 'Örn: Dashboard\'a hızlı erişim menüsü eklenmesi'}
                        style={{ 
                            borderColor: errors.title ? '#ef4444' : '', 
                            padding: '0.75rem',
                            fontSize: '0.95rem'
                        }}
                    />
                    {errors.title && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <i className="bi bi-exclamation-circle"></i>
                            {errors.title}
                        </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        {formData.title.length}/100 karakter
                    </div>
                </div>

                {/* Kategori ve Modül */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="bi bi-tag"></i> Kategori
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-select"
                            style={{ padding: '0.75rem', fontSize: '0.95rem' }}
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="bi bi-app"></i> İlgili Modül
                        </label>
                        <select
                            name="module_name"
                            value={formData.module_name}
                            onChange={handleChange}
                            className="form-select"
                            style={{ padding: '0.75rem', fontSize: '0.95rem' }}
                        >
                            {modules.map(module => (
                                <option key={module.value} value={module.value}>{module.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Hata Detayları */}
                <div className="form-group">
                    <label className="form-label" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="bi bi-file-text"></i> {formData.type === 'hata' ? 'Hata Detayları' : 'Öneri Detayları'} *
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 'normal' }}>(Min 20 karakter)</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className={`form-textarea ${errors.description ? 'error' : ''}`}
                        rows="6"
                        placeholder={formData.type === 'hata' 
                            ? 'Hatayı detaylı bir şekilde açıklayın. Ne yapmaya çalıştığınızı, ne olduğunu ve ne beklediğinizi yazın...'
                            : 'Önerinizi detaylı bir şekilde açıklayın. Hangi özelliği istediğinizi ve neden faydalı olacağını yazın...'
                        }
                        style={{ 
                            borderColor: errors.description ? '#ef4444' : '', 
                            resize: 'vertical', 
                            minHeight: '150px',
                            padding: '0.75rem',
                            fontSize: '0.95rem',
                            lineHeight: '1.5'
                        }}
                    />
                    {errors.description && (
                        <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <i className="bi bi-exclamation-circle"></i>
                            {errors.description}
                        </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                        {formData.description.length}/1000 karakter
                    </div>
                </div>

                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="action-btn outline"
                        style={{ minWidth: '120px', padding: '0.75rem 1.5rem' }}
                    >
                        <i className="bi bi-x-circle" style={{ marginRight: '0.5rem' }}></i>
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="action-btn primary"
                        style={{ minWidth: '120px', padding: '0.75rem 1.5rem' }}
                    >
                        {loading ? (
                            <>
                                <div className="spin" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}>
                                    <i className="bi bi-arrow-repeat"></i>
                                </div>
                                Gönderiliyor...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-send" style={{ marginRight: '0.5rem' }}></i>
                                Gönder
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm; 