import { useState } from 'react';
import axios from 'axios';

function CudbFeed() {
    const [msisdn, setMsisdn] = useState('');
    const [coId, setCoId] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [env, setEnv] = useState('fonk');
    const [copySuccess, setCopySuccess] = useState(false);
    const [requestHistory, setRequestHistory] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const currentDate = new Date();
        const tid = `YukseLTEST0${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${String(currentDate.getHours()).padStart(2, '0')}${String(currentDate.getMinutes()).padStart(2, '0')}${String(currentDate.getSeconds()).padStart(2, '0')}`;

        const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<IWIS_IN_DATA_UNIT>
<IWIS_IN_HEADER version="1.0">
<s>BSCS</s>
<SERVICE>BPM_GNL_CUDB_FEED</SERVICE>
<TID>${tid}</TID>
</IWIS_IN_HEADER>
<IWIS_SERVICE_PARAMS>
<XML>
<sch:CUDBFeedingProcessRequest xmlns:sch="avea/bpm/schemas">
<TYPE>1</TYPE>
<s>BSCS</s>
<MSISDN>${msisdn}</MSISDN>
<CO_ID>${coId}</CO_ID>
</sch:CUDBFeedingProcessRequest>
</XML>
</IWIS_SERVICE_PARAMS>
</IWIS_IN_DATA_UNIT>`;

        // Ortama göre URL seçimi
        const url = env === 'fonk'
            ? 'http://10.248.68.188/WEB/IWIS'
            : 'http://10.248.68.161/WEB/IWIS';

        const timestamp = new Date().toLocaleTimeString();
        
        try {
            const result = await axios.post(url, xmlBody, {
                headers: {
                    'Content-Type': 'application/xml'
                }
            });
            setResponse(result.data);
            
            // İstek geçmişine ekle
            setRequestHistory(prev => [{
                timestamp,
                msisdn,
                coId,
                env: env.toUpperCase(),
                status: 'success',
                tid
            }, ...prev.slice(0, 4)]); // Son 5 isteği tut
            
        } catch (err) {
            setError(err.message);
            
            // Hata geçmişine ekle
            setRequestHistory(prev => [{
                timestamp,
                msisdn,
                coId,
                env: env.toUpperCase(),
                status: 'error',
                error: err.message
            }, ...prev.slice(0, 4)]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(response, null, 2));
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    };

    const handleClear = () => {
        setMsisdn('');
        setCoId('');
        setResponse(null);
        setError(null);
        setEnv('fonk');
    };

    const handlePreset = (preset) => {
        switch(preset) {
            case 'test_user':
                setMsisdn('5052389924');
                setCoId('123456');
                break;
            case 'sample_data':
                setMsisdn('5551234567');
                setCoId('789012');
                break;
            default:
                break;
        }
    };

    return (
        <div className="modern-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-cloud-upload-fill text-emerald-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>CUDB Feed Service</h1>
                        <p>Customer Database feeding işlemleri için XML API servisi</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-server"></i>
                    <span>{env.toUpperCase()}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Input Section */}
                <div className="input-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-send text-blue-500"></i>
                            <span>Request Parameters</span>
                        </div>
                        <div className="card-actions">
                            <button 
                                className="preset-btn"
                                onClick={() => handlePreset('test_user')}
                                title="Test User Data"
                            >
                                Test Data
                            </button>
                            <button 
                                className="action-btn secondary"
                                onClick={handleClear}
                                disabled={!msisdn && !coId && !response && !error}
                            >
                                <i className="bi bi-trash"></i>
                                Temizle
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="config-label">
                                    <i className="bi bi-hdd text-purple-500"></i>
                                    Ortam
                                </label>
                                <select
                                    className="config-input"
                                    value={env}
                                    onChange={e => setEnv(e.target.value)}
                                >
                                    <option value="fonk">FONK (10.248.68.188)</option>
                                    <option value="reg">REG (10.248.68.161)</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label className="config-label">
                                    <i className="bi bi-telephone text-green-500"></i>
                                    MSISDN
                                </label>
                                <input
                                    type="text"
                                    className="config-input"
                                    value={msisdn}
                                    onChange={(e) => setMsisdn(e.target.value)}
                                    placeholder="5052389924"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="config-label">
                                    <i className="bi bi-hash text-orange-500"></i>
                                    CO ID
                                </label>
                                <input
                                    type="text"
                                    className="config-input"
                                    value={coId}
                                    onChange={(e) => setCoId(e.target.value)}
                                    placeholder="123456"
                                    required
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                className={`convert-btn ${loading ? 'loading' : ''}`}
                                disabled={loading || !msisdn.trim() || !coId.trim()}
                            >
                                {loading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat spin"></i>
                                        İşlem Yapılıyor...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-upload"></i>
                                        CUDB Feed Gönder
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Output Section */}
                <div className="output-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-file-earmark-code text-purple-500"></i>
                            <span>Response</span>
                        </div>
                        <div className="card-actions">
                            {response && (
                                <button 
                                    className={`action-btn ${copySuccess ? 'success' : 'primary'}`}
                                    onClick={handleCopy}
                                >
                                    {copySuccess ? (
                                        <>
                                            <i className="bi bi-check-circle"></i>
                                            Kopyalandı!
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-clipboard"></i>
                                            Kopyala
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="result-alert error">
                                <div className="alert-icon">
                                    <i className="bi bi-x-circle-fill"></i>
                                </div>
                                <div className="alert-content">
                                    <strong>API Hatası</strong>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}
                        
                        {response && (
                            <div className="result-alert success">
                                <div className="alert-icon">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div className="alert-content">
                                    <strong>CUDB Feed Başarılı!</strong>
                                    <div className="result-box">
                                        <pre>{JSON.stringify(response, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!error && !response && (
                            <div className="empty-state">
                                <i className="bi bi-cloud-download"></i>
                                <p>API yanıtı burada görünecek</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request History */}
            {requestHistory.length > 0 && (
                <div className="logs-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-clock-history text-cyan-500"></i>
                            <span>İstek Geçmişi</span>
                        </div>
                        <div className="logs-count">
                            {requestHistory.length} işlem
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="logs-container">
                            {requestHistory.map((request, index) => (
                                <div 
                                    key={index} 
                                    className={`log-item ${request.status}`}
                                >
                                    <div className="log-time">
                                        {request.timestamp}
                                    </div>
                                    <div className="log-content">
                                        <div className="log-icon">
                                            <i className={`bi ${
                                                request.status === 'error' ? 'bi-x-circle' : 'bi-check-circle'
                                            }`}></i>
                                        </div>
                                        <div className="log-details">
                                            <span><strong>{request.env}</strong> - MSISDN: {request.msisdn}, CO ID: {request.coId}</span>
                                            {request.tid && <div className="log-sub">TID: {request.tid}</div>}
                                            {request.error && <div className="log-sub error-text">Hata: {request.error}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="help-card">
                <div className="help-header">
                    <i className="bi bi-question-circle text-orange-500"></i>
                    <span>Nasıl Kullanılır?</span>
                </div>
                <div className="help-content">
                    <div className="help-steps">
                        <div className="help-step">
                            <span className="step-number">1</span>
                            <span>Ortam seçin (FONK test ortamı, REG production ortamı)</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">2</span>
                            <span>MSISDN (telefon numarası) ve CO ID bilgilerini girin</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">3</span>
                            <span>"CUDB Feed Gönder" butonuna tıklayın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">4</span>
                            <span>API yanıtını sağ taraftan kontrol edin ve gerekirse kopyalayın</span>
                        </div>
                    </div>
                    <div className="help-note">
                        <div className="note-header">
                            <i className="bi bi-lightbulb text-yellow-500"></i>
                            <span>İpucu</span>
                        </div>
                        <p>CUDB Feed servisi XML formatında veri gönderir ve otomatik olarak TID (Transaction ID) oluşturur. İstek geçmişi son 5 işlemi gösterir.</p>
                    </div>
                    <div className="help-warning">
                        <div className="warning-header">
                            <i className="bi bi-exclamation-triangle text-red-500"></i>
                            <span>Dikkat</span>
                        </div>
                        <p>REG ortamı production ortamıdır, gerçek verileri etkileyebilir. Test işlemleri için FONK ortamını kullanın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CudbFeed; 