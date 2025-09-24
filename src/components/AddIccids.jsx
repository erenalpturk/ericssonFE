import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext';
import MyIccidList from './MyIccidList';
import ActivationList from './ActivationList';

const AddIccids = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [iccidText, setIccidText] = useState('');
  const [selectedType, setSelectedType] = useState('fonkpos');
  const [customType, setCustomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { baseUrl, user } = useAuth();
  const iccidTypes = [
    { type: 'fonkpos', label: 'Fonksiyonel Postpaid', environment: 'fonk', gsm_type: 'post', dealer: '7101717', },
    { type: 'regpos', label: 'Regresyon Postpaid', environment: 'reg', gsm_type: 'post', dealer: '7101694' },
    { type: 'fonkpre', label: 'Fonksiyonel Prepaid', environment: 'fonk', gsm_type: 'pre', dealer: '7101717' },
    { type: 'regpre', label: 'Regresyon Prepaid', environment: 'reg', gsm_type: 'pre', dealer: '7101694' },
    { type: 'custom', label: 'Diğer', environment: 'fonk', gsm_type: 'post', dealer: '7101717' }
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
      const environment = iccidTypes.find(t => t.type === type).environment;
      const gsm_type = iccidTypes.find(t => t.type === type).gsm_type;
      const dealer = iccidTypes.find(t => t.type === type).dealer;
      const response = await fetch(`${baseUrl}/iccid/formatAndInsertIccids/${type}/${environment}/${gsm_type}/${dealer}/${user.sicil_no}/15`, {
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
                  <option key={type.type} value={type.type}>
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
    </div>
  );
};

export default AddIccids;
