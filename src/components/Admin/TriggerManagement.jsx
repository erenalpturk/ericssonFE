import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Modern CSS Styles
const styles = `
  .filter-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 0;
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.15);
    overflow: hidden;
    position: relative;
  }

  .filter-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    pointer-events: none;
  }

  .filter-container {
    position: relative;
    z-index: 2;
    padding: 30px;
  }

  .filter-header {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    color: white;
  }

  .filter-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .filter-icon i {
    font-size: 22px;
    color: white;
  }

  .filter-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .filter-controls {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 25px;
    align-items: end;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .filter-label {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin: 0;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .select-wrapper {
    position: relative;
  }

  .modern-select {
    width: 100%;
    padding: 15px 20px;
    padding-right: 50px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    font-size: 15px;
    font-weight: 500;
    outline: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .modern-select:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .select-arrow {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #667eea;
    font-size: 14px;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .select-wrapper:hover .select-arrow {
    transform: translateY(-50%) scale(1.1);
  }

  .modern-add-btn {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    border: none;
    border-radius: 15px;
    padding: 15px 25px;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(238, 90, 36, 0.3);
    position: relative;
    overflow: hidden;
    min-height: 55px;
  }

  .modern-add-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .modern-add-btn:hover::before {
    left: 100%;
  }

  .modern-add-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(238, 90, 36, 0.4);
  }

  .modern-add-btn:active {
    transform: translateY(-1px);
  }

  .btn-icon {
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  }

  .btn-icon i {
    font-size: 14px;
  }

  .btn-text {
    font-size: 15px;
    white-space: nowrap;
  }

  .rounded-oval-header {
    border-radius: 20px 20px 0 0 !important;
    border-bottom: 2px solid rgba(0,0,0,0.1);
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
    padding: 20px 25px;
  }

  .rounded-oval-header h5 {
    color: #495057;
    font-weight: 700;
  }

  .rounded-oval-header i {
    color: #667eea;
  }

  .copy-apis-btn {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    color: #667eea;
    transition: all 0.3s ease;
    border-radius: 12px;
    font-weight: 600;
  }

  .copy-apis-btn:hover {
    background: #667eea;
    border-color: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: 768px) {
    .filter-controls {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    .filter-container {
      padding: 20px;
    }
    
    .filter-title {
      font-size: 20px;
    }
  }
`;

const TriggerManagement = () => {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTriggerType, setSelectedTriggerType] = useState('courier');
  const [selectedEnv, setSelectedEnv] = useState('regresyon');
  const [selectedPaymentType, setSelectedPaymentType] = useState('fiziksel');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyData, setCopyData] = useState({
    targetEnv: '',
    targetPaymentType: ''
  });
  const [formData, setFormData] = useState({
    api_name: '',
    endpoint: '',
    method: 'POST',
    body: '',
    headers: '',
    validation_script: '',
    order_index: 0,
    active: true
  });

  const environments = [
    { value: 'fonksiyonel', label: 'Fonksiyonel', color: 'success' },
    { value: 'regresyon', label: 'Regresyon', color: 'warning' },
    { value: 'hotfix', label: 'Hotfix', color: 'danger' }
  ];

  const triggerTypes = [
    { value: 'courier', label: 'Kurye Tetikleme' },
    { value: 'device', label: 'Cihaz Tetikleme' }
  ];

  // Dynamic payment types based on trigger type
  const getPaymentTypes = (triggerType) => {
    if (triggerType === 'courier') {
      return [
        { value: 'fiziksel', label: 'Fiziksel SIM' },
        { value: 'esim', label: 'E-SIM' }
      ];
    } else {
      return [
        { value: 'temlikli', label: 'Temlikli' },
        { value: 'pesin', label: 'Peşin' },
        { value: 'iade_reddi', label: 'İade Reddi' }
      ];
    }
  };

  // Current payment types based on selected trigger type
  const paymentTypes = getPaymentTypes(selectedTriggerType);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  useEffect(() => {
    fetchTriggers();
  }, [selectedTriggerType, selectedEnv, selectedPaymentType]);

  // Trigger type değiştiğinde payment type'ı resetle
  useEffect(() => {
    const paymentTypes = getPaymentTypes(selectedTriggerType);
    if (paymentTypes.length > 0) {
      setSelectedPaymentType(paymentTypes[0].value);
    }
  }, [selectedTriggerType]);

  const fetchTriggers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/courier-triggers', {
        params: {
          trigger_type: selectedTriggerType,
          environment: selectedEnv,
          payment_type: selectedPaymentType
        }
      });
      setTriggers(response.data.data || []);
    } catch (error) {
      toast.error('Tetikleme API\'leri yüklenemedi');
      console.error('Fetch triggers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingTrigger(null);
    setFormData({
      api_name: '',
      endpoint: '',
      method: 'POST',
      body: '',
      headers: '',
      validation_script: '',
      order_index: 0,
      active: true
    });
  };

  const getNextOrderIndex = () => {
    if (triggers.length === 0) return 1;
    return Math.max(...triggers.map(t => t.order_index)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        trigger_type: selectedTriggerType,
        environment: selectedEnv,
        payment_type: selectedPaymentType
      };

      if (editingTrigger) {
        await axios.put(`/api/courier-triggers/${editingTrigger.id}`, payload);
        toast.success('API başarıyla güncellendi');
      } else {
        await axios.post('/api/courier-triggers', payload);
        toast.success('API başarıyla eklendi');
      }

      closeModal();
      fetchTriggers();
    } catch (error) {
      const message = error.response?.data?.message || 'İşlem başarısız';
      toast.error(message);
    }
  };

  const handleEdit = (trigger) => {
    console.log('Editing trigger:', trigger);
    setEditingTrigger(trigger);
    setFormData({
      api_name: trigger.api_name || '',
      endpoint: trigger.endpoint || '',
      method: trigger.method || 'POST',
      body: trigger.body || '',
      headers: trigger.headers || '',
      validation_script: trigger.validation_script || '',
      order_index: trigger.order_index || 0,
      active: trigger.active !== undefined ? trigger.active : true
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu API\'yi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`/api/courier-triggers/${id}`);
      toast.success('API başarıyla silindi');
      fetchTriggers();
    } catch (error) {
      toast.error('API silinemedi');
    }
  };

  const toggleActive = async (trigger) => {
    try {
      await axios.put(`/api/courier-triggers/${trigger.id}`, {
        ...trigger,
        active: !trigger.active
      });
      toast.success(`API ${trigger.active ? 'devre dışı' : 'aktif'} hale getirildi`);
      fetchTriggers();
    } catch (error) {
      toast.error('Durum güncellenemedi');
    }
  };

  const handleCopyAPIs = async (e) => {
    e.preventDefault();
    
    if (!copyData.targetEnv || !copyData.targetPaymentType) {
      toast.error(`Hedef ortam ve ${selectedTriggerType === 'courier' ? 'SIM tipi' : 'tetikleme tipi'} seçiniz`);
      return;
    }

    if (copyData.targetEnv === selectedEnv && copyData.targetPaymentType === selectedPaymentType) {
      toast.error(`Hedef ortam ve ${selectedTriggerType === 'courier' ? 'SIM tipi' : 'tetikleme tipi'} mevcut kombinasyondan farklı olmalıdır`);
      return;
    }

    try {
      const copyPromises = triggers.map(trigger => {
        const newTrigger = {
          api_name: trigger.api_name,
          endpoint: trigger.endpoint,
          method: trigger.method,
          body: trigger.body,
          headers: trigger.headers,
          order_index: trigger.order_index,
          active: trigger.active,
          trigger_type: selectedTriggerType,
          environment: copyData.targetEnv,
          payment_type: copyData.targetPaymentType
        };
        return axios.post('/api/courier-triggers', newTrigger);
      });

      await Promise.all(copyPromises);
      
      toast.success(`${triggers.length} API başarıyla ${environments.find(e => e.value === copyData.targetEnv)?.label} - ${paymentTypes.find(p => p.value === copyData.targetPaymentType)?.label} kombinasyonuna kopyalandı`);
      
      setShowCopyModal(false);
      setCopyData({ targetEnv: '', targetPaymentType: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Kopyalama işlemi başarısız';
      toast.error(message);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="modern-page">
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            {/* Modern Filter Section */}
            <div className="filter-section mb-4">
              <div className="filter-container">
                <div className="filter-header">
                  <div className="filter-icon">
                    <i className="bi bi-funnel"></i>
                  </div>
                  <h5 className="filter-title">Tetikleme Filtreleri</h5>
                </div>
                
                <div className="filter-controls">
                  <div className="filter-group">
                    <label className="filter-label">
                      <i className="bi bi-gear me-2"></i>
                      Tetikleme Tipi
                    </label>
                    <div className="select-wrapper">
                      <select 
                        className="modern-select"
                        value={selectedTriggerType}
                        onChange={(e) => setSelectedTriggerType(e.target.value)}
                      >
                        {triggerTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      <i className="bi bi-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">
                      <i className="bi bi-building me-2"></i>
                      Ortam
                    </label>
                    <div className="select-wrapper">
                      <select 
                        className="modern-select"
                        value={selectedEnv}
                        onChange={(e) => setSelectedEnv(e.target.value)}
                      >
                        {environments.map(env => (
                          <option key={env.value} value={env.value}>{env.label}</option>
                        ))}
                      </select>
                      <i className="bi bi-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  <div className="filter-group">
                                          <label className="filter-label">
                        <i className="bi bi-credit-card me-2"></i>
                        {selectedTriggerType === 'courier' ? 'SIM Tipi' : 'Tetikleme Tipi'}
                      </label>
                    <div className="select-wrapper">
                      <select 
                        className="modern-select"
                        value={selectedPaymentType}
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                      >
                        {paymentTypes.map(payment => (
                          <option key={payment.value} value={payment.value}>{payment.label}</option>
                        ))}
                      </select>
                      <i className="bi bi-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  <div className="filter-group">
                    <button 
                      className="modern-add-btn"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, order_index: getNextOrderIndex() }));
                        setShowAddModal(true);
                      }}
                    >
                      <div className="btn-icon">
                        <i className="bi bi-plus-lg"></i>
                      </div>
                      <span className="btn-text">Yeni API Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* API List */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light rounded-oval-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    {environments.find(e => e.value === selectedEnv)?.label} - {paymentTypes.find(p => p.value === selectedPaymentType)?.label} API'leri
                  </h5>
                  {triggers.length > 0 && (
                    <button 
                      className="btn btn-outline-primary btn-sm copy-apis-btn"
                      onClick={() => setShowCopyModal(true)}
                      title={`API'leri başka ortam/${selectedTriggerType === 'courier' ? 'SIM tipine' : 'tetikleme tipine'} kopyala`}
                    >
                      <i className="bi bi-copy me-1"></i>
                      Kopyala
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Yükleniyor...</p>
                  </div>
                ) : triggers.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <h5 className="mt-3 text-muted">Bu kombinasyon için API bulunamadı</h5>
                    <p className="text-muted">Yeni API ekleyerek başlayın</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th width="5%">#</th>
                          <th width="20%">API Adı</th>
                          <th width="30%">Endpoint</th>
                          <th width="10%">Method</th>
                          <th width="10%">Sıra</th>
                          <th width="10%">Durum</th>
                          <th width="15%">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {triggers.map((trigger, index) => (
                          <tr key={trigger.id}>
                            <td>
                              <span className="badge bg-secondary">{index + 1}</span>
                            </td>
                            <td>
                              <strong>{trigger.api_name}</strong>
                            </td>
                            <td>
                              <code className="small">{trigger.endpoint}</code>
                            </td>
                            <td>
                              <span className={`badge bg-${trigger.method === 'POST' ? 'primary' : trigger.method === 'GET' ? 'success' : 'warning'}`}>
                                {trigger.method}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-info">{trigger.order_index}</span>
                            </td>
                            <td>
                              <div className="form-check form-switch">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  checked={!!trigger.active}
                                  onChange={() => toggleActive(trigger)}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(trigger)}
                                  title="Düzenle"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(trigger.id)}
                                  title="Sil"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-gear me-2"></i>
                  {editingTrigger ? 'API Düzenle' : 'Yeni API Ekle'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-tag me-1"></i>
                        API Adı *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.api_name}
                        onChange={(e) => setFormData(prev => ({...prev, api_name: e.target.value}))}
                        placeholder="Kurye Atandı"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-arrow-right me-1"></i>
                        Method *
                      </label>
                      <select
                        className="form-select"
                        value={formData.method}
                        onChange={(e) => setFormData(prev => ({...prev, method: e.target.value}))}
                        required
                      >
                        {methods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-bold">
                        <i className="bi bi-list-ol me-1"></i>
                        Sıra *
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.order_index}
                        onChange={(e) => setFormData(prev => ({...prev, order_index: parseInt(e.target.value)}))}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="bi bi-link me-1"></i>
                        Endpoint *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.endpoint}
                        onChange={(e) => setFormData(prev => ({...prev, endpoint: e.target.value}))}
                        placeholder="/api/courier/assigned"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-braces me-1"></i>
                        Body (JSON)
                      </label>
                      <textarea
                        className="form-control font-monospace"
                        rows="8"
                        value={formData.body}
                        onChange={(e) => setFormData(prev => ({...prev, body: e.target.value}))}
                        placeholder={
                          selectedTriggerType === 'courier' 
                            ? `{
  "customerOrder": "{{customerOrder}}",
  "transactionId": "{{TID}}",
  "iccid": "{{iccid}}"
}`
                            : selectedPaymentType === 'iade_reddi'
                              ? `{
  "customerOrder": "{{customerOrder}}",
  "action": "reject_refund",
  "reason": "customer_request"
}`
                              : `{
  "customerOrder": "{{customerOrder}}",
  "imei": "{{imei}}",
  "paymentType": "${selectedPaymentType}"
}`
                        }
                      />
                      <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        <strong>Değişkenler:</strong> {
                          selectedTriggerType === 'courier' 
                            ? `{{customerOrder}}, {{TID}}, {{iccid}}` 
                            : selectedPaymentType === 'iade_reddi'
                              ? `{{customerOrder}}`
                              : `{{customerOrder}}, {{imei}}`
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-card-heading me-1"></i>
                        Headers (JSON)
                      </label>
                      <textarea
                        className="form-control font-monospace"
                        rows="8"
                        value={formData.headers}
                        onChange={(e) => setFormData(prev => ({...prev, headers: e.target.value}))}
                        placeholder={`{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{token}}"
}`}
                      />
                      <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        Header bilgilerini JSON formatında girin
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">
                        <i className="bi bi-code-slash me-1"></i>
                        Validation Script (JavaScript)
                        <span className="badge bg-info ms-2">İsteğe Bağlı</span>
                      </label>
                      <textarea
                        className="form-control font-monospace"
                        rows="4"
                        value={formData.validation_script}
                        onChange={(e) => setFormData(prev => ({...prev, validation_script: e.target.value}))}
                        placeholder={`return response.success === true && response.data !== null;

// Kullanılabilir değişkenler:
// response: API cevap body'si (JSON)
// status: HTTP status kodu (number)  
// headers: Response header'ları (object)`}
                      />
                      <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        <strong>Bu script API cevabını kontrol eder.</strong> <code>true</code> döndürürse işlem devam eder, <code>false</code> döndürürse durdurulur.
                        <br />
                        <strong>Örnekler:</strong>
                        <ul className="mb-0 mt-1">
                          <li><code>return response.success === true;</code> - success alanı true mu?</li>
                          <li><code>return status === 200 && response.data.length &gt; 0;</code> - 200 OK + data var mı?</li>
                          <li><code>return response.errorCode === 0;</code> - errorCode 0 mı?</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={!!formData.active}
                          onChange={(e) => setFormData(prev => ({...prev, active: e.target.checked}))}
                        />
                        <label className="form-check-label fw-bold">
                          <i className="bi bi-power me-1"></i>
                          Aktif
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    <i className="bi bi-x-lg me-1"></i>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-lg me-1"></i>
                    {editingTrigger ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Copy APIs Modal */}
      {showCopyModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-copy me-2"></i>
                  API'leri Kopyala
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCopyModal(false)}></button>
              </div>
              <form onSubmit={handleCopyAPIs}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>{triggers.length} API</strong> aşağıdaki kombinasyona kopyalanacak:
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6 className="card-title text-muted mb-2">Kaynak</h6>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary me-2">{environments.find(e => e.value === selectedEnv)?.label}</span>
                            <span className="badge bg-secondary">{paymentTypes.find(p => p.value === selectedPaymentType)?.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-building me-1"></i>
                        Hedef Ortam *
                      </label>
                      <select
                        className="form-select"
                        value={copyData.targetEnv}
                        onChange={(e) => setCopyData(prev => ({...prev, targetEnv: e.target.value}))}
                        required
                      >
                        <option value="">Ortam Seçin</option>
                        {environments.filter(env => env.value !== selectedEnv).map(env => (
                          <option key={env.value} value={env.value}>{env.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-credit-card me-1"></i>
                        Hedef {selectedTriggerType === 'courier' ? 'SIM Tipi' : 'Tetikleme Tipi'} *
                      </label>
                      <select
                        className="form-select"
                        value={copyData.targetPaymentType}
                        onChange={(e) => setCopyData(prev => ({...prev, targetPaymentType: e.target.value}))}
                        required
                      >
                        <option value="">{selectedTriggerType === 'courier' ? 'SIM Tipi Seçin' : 'Tetikleme Tipi Seçin'}</option>
                        {paymentTypes.filter(payment => 
                          !(payment.value === selectedPaymentType && copyData.targetEnv === selectedEnv)
                        ).map(payment => (
                          <option key={payment.value} value={payment.value}>{payment.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="form-text">
                      <i className="bi bi-exclamation-triangle text-warning me-1"></i>
                      <strong>Not:</strong> Mevcut API'ler değiştirilmez, yeni kombinasyona kopyalanır.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCopyModal(false)}>
                    <i className="bi bi-x-lg me-1"></i>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-copy me-1"></i>
                    Kopyala ({triggers.length} API)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TriggerManagement; 