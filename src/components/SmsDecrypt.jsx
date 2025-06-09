import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { DECRYPT_ENDPOINTS } from '../services/config'

function SmsDecrypt() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [authToken, setAuthToken] = useState(null)
    const [tokenError, setTokenError] = useState(null)
    const [apiLogs, setApiLogs] = useState([])
    const [inputValue, setInputValue] = useState('')

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString()
        setApiLogs(prev => [...prev, { timestamp, message, type }])
    }

    useEffect(() => {
        let mounted = true;

        const getToken = async () => {
            const loginBody = {
                "userName": "Etiya_Admin",
                "password": "aa1234"
            }

            if (authToken) return;

            addLog('Token alınıyor...', 'info')

            try {
                const response = await fetch(DECRYPT_ENDPOINTS.auth, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginBody)
                })

                if (!mounted) return;

                if (!response.ok) {
                    throw new Error('Token alınamadı')
                }

                const token = response.headers.get('authorization')
                if (!token) {
                    throw new Error('Authorization token bulunamadı')
                }

                setAuthToken(token)
                setTokenError(null)
                addLog('Token başarıyla alındı', 'success')
                addLog(`Token: ${token.substring(0, 20)}...`, 'success')
            } catch (error) {
                if (!mounted) return;
                
                setTokenError(error.message)
                setAuthToken(null)
                addLog(`Token hatası: ${error.message}`, 'error')
            }
        }

        getToken()

        return () => {
            mounted = false;
        }
    }, [])

    const refreshToken = async () => {
        setTokenError(null)
        setAuthToken(null)
        addLog('Token yenileniyor...', 'info')
        
        try {
            const loginBody = {
                "userName": "Etiya_Admin",
                "password": "aa1234"
            }

            const response = await fetch(DECRYPT_ENDPOINTS.auth, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginBody)
            })

            if (!response.ok) {
                throw new Error('Token alınamadı')
            }

            const token = response.headers.get('authorization')
            if (!token) {
                throw new Error('Authorization token bulunamadı')
            }

            setAuthToken(token)
            setTokenError(null)
            addLog('Token başarıyla yenilendi', 'success')
            addLog(`Yeni Token: ${token.substring(0, 20)}...`, 'success')
        } catch (error) {
            setTokenError(error.message)
            setAuthToken(null)
            addLog(`Token yenileme hatası: ${error.message}`, 'error')
        }
    }

    const sendRequest = async (e) => {
        e.preventDefault()
        const trimmedValue = inputValue.trim()

        if (!trimmedValue) {
            setError('Lütfen şifrelenmiş bir değer girin')
            addLog('Boş değer girişi', 'error')
            return
        }

        if (!authToken) {
            setError('Token bulunamadı. Lütfen sayfayı yenileyin.')
            addLog('Token bulunamadı, işlem iptal edildi', 'error')
            return
        }

        addLog(`Şifrelenmiş değer gönderiliyor: ${trimmedValue}`, 'info')

        try {
            setLoading(true)
            setError(null)
            setResult(null)

            const response2 = await fetch(DECRYPT_ENDPOINTS.decrypt, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                    'LocalToken': '1'
                },
                body: JSON.stringify({ value: trimmedValue })
            })

            if (!response2.ok) {
                throw new Error('Decrypt API request failed')
            }

            const data = await response2.json()
            setResult(data)
            addLog('Şifre çözme işlemi başarılı', 'success')
            addLog(`Çözülen değer: ${JSON.stringify(data)}`, 'success')
        } catch (error) {
            setError(error.message)
            addLog(`Şifre çözme hatası: ${error.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const clearAll = () => {
        setInputValue('')
        setResult(null)
        setError(null)
        setApiLogs([])
    }

    const copyResult = async () => {
        if (result) {
            try {
                await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
                addLog('Sonuç panoya kopyalandı', 'success')
            } catch (err) {
                addLog('Kopyalama başarısız', 'error')
            }
        }
    }

    const getTokenStatus = () => {
        if (tokenError) return { status: 'error', text: 'Token Hatası', color: 'text-red-500' }
        if (!authToken) return { status: 'loading', text: 'Token Yükleniyor', color: 'text-yellow-500' }
        return { status: 'success', text: 'Token Aktif', color: 'text-green-500' }
    }

    const tokenStatus = getTokenStatus()

    return (
        <div className="modern-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-shield-lock-fill text-purple-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>SMS Decrypt Tool</h1>
                        <p>Şifrelenmiş SMS değerlerini güvenli şekilde çözün</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className={`bi ${tokenStatus.status === 'success' ? 'bi-shield-check' : tokenStatus.status === 'error' ? 'bi-shield-x' : 'bi-shield'}`}></i>
                    <span className={tokenStatus.color}>{tokenStatus.text}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Input Section */}
                <div className="input-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-key-fill text-blue-500"></i>
                            <span>Şifrelenmiş Değer</span>
                        </div>
                        <div className="card-actions">
                            <button 
                                className="action-btn secondary"
                                onClick={clearAll}
                                disabled={!inputValue && !result && apiLogs.length === 0}
                            >
                                <i className="bi bi-trash"></i>
                                Temizle
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {/* Token Status Alert */}
                        {tokenError && (
                            <div className="status-alert error">
                                <div className="alert-content">
                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                    <div>
                                        <strong>Token Hatası:</strong>
                                        <p>{tokenError}</p>
                                    </div>
                                </div>
                                <button 
                                    className="action-btn danger small"
                                    onClick={refreshToken}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                    Yenile
                                </button>
                            </div>
                        )}
                        
                        {!tokenError && !authToken && (
                            <div className="status-alert warning">
                                <div className="alert-content">
                                    <i className="bi bi-hourglass-split"></i>
                                    <div>
                                        <strong>Token Bekleniyor...</strong>
                                        <p>Lütfen bekleyin</p>
                                    </div>
                                </div>
                                <button 
                                    className="action-btn warning small"
                                    onClick={refreshToken}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                    Yeniden Dene
                                </button>
                            </div>
                        )}

                        <form onSubmit={sendRequest}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="modern-input"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Şifrelenmiş değeri buraya yapıştırın..."
                                    disabled={!authToken}
                                />
                            </div>
                            <button 
                                type="submit"
                                className={`decrypt-btn ${loading ? 'loading' : ''} ${!authToken ? 'disabled' : ''}`}
                                disabled={loading || !authToken || !inputValue.trim()}
                            >
                                {loading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat spin"></i>
                                        Şifre Çözülüyor...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-unlock-fill"></i>
                                        Şifreyi Çöz
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                <div className="output-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-file-earmark-text text-green-500"></i>
                            <span>Sonuçlar</span>
                        </div>
                        <div className="card-actions">
                            {result && (
                                <button 
                                    className="action-btn success"
                                    onClick={copyResult}
                                >
                                    <i className="bi bi-clipboard"></i>
                                    Kopyala
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
                                    <strong>Hata Oluştu</strong>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}
                        
                        {result && (
                            <div className="result-alert success">
                                <div className="alert-icon">
                                    <i className="bi bi-check-circle-fill"></i>
                                </div>
                                <div className="alert-content">
                                    <strong>Şifre Çözüldü!</strong>
                                    <div className="result-box">
                                        <pre>{JSON.stringify(result, null, 2)}</pre>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!error && !result && (
                            <div className="empty-state">
                                <i className="bi bi-file-text"></i>
                                <p>Şifre çözme sonuçları burada görünecek</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Logs */}
            <div className="logs-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-list-ul text-cyan-500"></i>
                        <span>İşlem Detayları</span>
                    </div>
                    <div className="logs-count">
                        {apiLogs.length} işlem
                    </div>
                </div>
                <div className="card-body">
                    <div className="logs-container">
                        {apiLogs.map((log, index) => (
                            <div 
                                key={index} 
                                className={`log-item ${log.type}`}
                            >
                                <div className="log-time">
                                    {log.timestamp}
                                </div>
                                <div className="log-content">
                                    <div className="log-icon">
                                        <i className={`bi ${
                                            log.type === 'error' ? 'bi-x-circle' :
                                            log.type === 'success' ? 'bi-check-circle' :
                                            'bi-info-circle'
                                        }`}></i>
                                    </div>
                                    <span>{log.message}</span>
                                </div>
                            </div>
                        ))}
                        {apiLogs.length === 0 && (
                            <div className="empty-logs">
                                <i className="bi bi-journal-text"></i>
                                <p>Henüz işlem yapılmadı</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                            <span>Token'in aktif olduğundan emin olun</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">2</span>
                            <span>Şifrelenmiş değeri sol tarafa yapıştırın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">3</span>
                            <span>"Şifreyi Çöz" butonuna tıklayın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">4</span>
                            <span>Çözülen değeri sağ taraftan kopyalayın</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmsDecrypt 