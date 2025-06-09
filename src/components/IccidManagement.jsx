import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import IccidList from './IccidList';
import ActivationList from './ActivationList';

const IccidManagement = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [iccidText, setIccidText] = useState('');
  const [selectedType, setSelectedType] = useState('fonkpos');
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { baseUrl, user } = useAuth();
  const iccidTypes = [
    { value: 'fonkpos', label: 'Fonksiyonel Postpaid' },
    { value: 'regpos', label: 'Regresyon Postpaid' },
    { value: 'fonkpre', label: 'Fonksiyonel Prepaid' },
    { value: 'regpre', label: 'Regresyon Prepaid' },
    { value: 'custom', label: 'Diğer' }
  ];

  useEffect(() => {
    if (user.role === 'tester') {
      navigate('/home');
    }
  }, [user]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleIccidSubmit = async () => {
    try {
      setLoading(true);
      const type = selectedType === 'custom' ? customType : selectedType;
      const response = await fetch(`${baseUrl}/iccid/formatAndInsertIccids/${type}/${user.sicil_no}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: iccidText,
      });
      const data = await response.json();
      showSuccess(data.message);
      setIccidText('');
      setCustomType('');
      setSelectedType('fonkpos');
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      showError('ICCID\'ler eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setIccidText('');
    setCustomType('');
    setSelectedType('fonkpos');
  };

  const inputCount = iccidText.trim() ? iccidText.trim().split('\n').filter(line => line.trim()).length : 0;

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


      {/* Add ICCID Section */}
      <div className="input-card">
        <div className="card-header">
          <div className="card-title">
            <i className="bi bi-plus-circle text-blue-500"></i>
            <span>Yeni ICCID Ekle</span>
          </div>
          <div className="card-actions">
            <span className="stats-badge small">
              <i className="bi bi-hash"></i>
              {inputCount} ICCID
            </span>
            <button 
              className="action-btn secondary"
              onClick={handleClearAll}
              disabled={!iccidText}
            >
              <i className="bi bi-trash"></i>
              Temizle
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="config-grid">
            <div className="config-item">
              <label className="config-label">
                <i className="bi bi-tags text-purple-500"></i>
                ICCID Tipi
              </label>
              <select
                className="config-input"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {iccidTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedType === 'custom' && (
              <div className="config-item">
                <label className="config-label">
                  <i className="bi bi-pencil text-orange-500"></i>
                  Özel Tip
                </label>
                <input
                  type="text"
                  className="config-input"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Özel tip adını girin"
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <textarea
              className="modern-textarea"
              rows="6"
              value={iccidText}
              onChange={(e) => setIccidText(e.target.value)}
              placeholder="ICCID'leri her satıra bir tane olacak şekilde girin...&#10;&#10;Örnek:&#10;8990011234567890123&#10;8990011234567890124&#10;8990011234567890125"
            />
          </div>
          <button
            className={`convert-btn ${loading ? 'loading' : ''}`}
            onClick={handleIccidSubmit}
            disabled={loading || !iccidText.trim() || (selectedType === 'custom' && !customType.trim())}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat spin"></i>
                ICCID'ler Ekleniyor...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle"></i>
                ICCID'leri Ekle
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs and Table Section */}
      {/* <div className="output-card">
        <div className="card-header">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              <i className="bi bi-credit-card text-blue-500"></i>
              ICCID Listesi
            </button>
            <button
              className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <i className="bi bi-check-circle text-green-500"></i>
              Aktivasyonlar
            </button>
          </div>
        </div>
        <div className="card-body">
          {activeTab === 0 ? <IccidList /> : <ActivationList />}
        </div>
      </div> */}

      {/* Help Section */}
      {/* <div className="help-card">
        <div className="help-header">
          <i className="bi bi-question-circle text-orange-500"></i>
          <span>Nasıl Kullanılır?</span>
        </div>
        <div className="help-content">
          <div className="help-steps">
            <div className="help-step">
              <span className="step-number">1</span>
              <span>ICCID tipini seçin veya özel tip tanımlayın</span>
            </div>
            <div className="help-step">
              <span className="step-number">2</span>
              <span>ICCID'leri metin alanına yapıştırın (her satıra bir ICCID)</span>
            </div>
            <div className="help-step">
              <span className="step-number">3</span>
              <span>"ICCID'leri Ekle" butonuna tıklayın</span>
            </div>
            <div className="help-step">
              <span className="step-number">4</span>
              <span>Tabloda ICCID'leri yönetin, durum güncelleyin veya toplu silme yapın</span>
            </div>
          </div>
          <div className="help-note">
            <div className="note-header">
              <i className="bi bi-lightbulb text-yellow-500"></i>
              <span>İpucu</span>
            </div>
            <p>Durum renkleri: Yeşil (Müsait), Sarı (Rezerve), Kırmızı (Satıldı). Arama ile tabloda filtreleme yapabilirsiniz.</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default IccidManagement;
