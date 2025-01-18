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
        const inputValue = e.target.inputField.value.trim()

        if (!inputValue) {
            setError('Lütfen şifrelenmiş bir değer girin')
            addLog('Boş değer girişi', 'error')
            return
        }

        if (!authToken) {
            setError('Token bulunamadı. Lütfen sayfayı yenileyin.')
            addLog('Token bulunamadı, işlem iptal edildi', 'error')
            return
        }

        addLog(`Şifrelenmiş değer gönderiliyor: ${inputValue}`, 'info')

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
                body: JSON.stringify({ value: inputValue })
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

    return (
        <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="card h-100 shadow-sm bg-light">
                <div className="card-header text-center">
                    <h3 className="mb-0 text-center">SMS Decrypt</h3>
                </div>
                <div className="card-body ">
                    {tokenError && (
                        <div className="alert alert-danger mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Token Hatası:</strong> {tokenError}
                                </div>
                                <button 
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={refreshToken}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    Token Yenile
                                </button>
                            </div>
                        </div>
                    )}
                    {!tokenError && !authToken && (
                        <div className="alert alert-warning mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>Token bekleniyor...</div>
                                <button 
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={refreshToken}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-clockwise me-1"></i>
                                    Yeniden Dene
                                </button>
                            </div>
                        </div>
                    )}
                    <form onSubmit={sendRequest}>
                        <div className="form-group">
                            <label htmlFor="inputField" className="form-label">
                                Şifrelenmiş Değer:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputField"
                                name="inputField"
                                placeholder="Şifrelenmiş değeri giriniz"
                                required
                                minLength="1"
                            />
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button
                                type="submit"
                                className={`btn ${tokenError ? 'btn-danger' : !authToken ? 'btn-warning' : loading ? 'btn-secondary' : 'btn-primary'}`}
                                disabled={loading || !authToken}
                                data-bs-toggle="tooltip"
                                title={tokenError ? 'Token alınamadı. Lütfen sayfayı yenileyip tekrar deneyin.' : !authToken ? 'Token bekleniyor... Lütfen bekleyin.' : 'Şifrelenmiş değeri çözmek için tıklayın'}
                            >
                                {tokenError ? (
                                    <>
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        Token Alınamadı! Ortamı Kontrol Edin
                                    </>
                                ) : !authToken ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                        Token Bekleniyor...
                                    </>
                                ) : loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-unlock-fill me-2"></i>
                                        Şifreyi Çöz
                                    </>
                                )}
                            </button>
                            <small className="text-muted text-center">
                                {tokenError ? (
                                    'Lütfen ortam erişimini kontrol edip sayfayı yenileyin'
                                ) : !authToken ? (
                                    'Token alınıyor, lütfen bekleyin...'
                                ) : loading ? (
                                    'İşlem devam ediyor, lütfen bekleyin...'
                                ) : (
                                    'Şifrelenmiş değeri girin ve butona tıklayın'
                                )}
                            </small>
                        </div>
                    </form>

                    <div className="mt-4">
                        {error && (
                            <div className="alert alert-danger">
                                <strong>Hata:</strong> {error}
                            </div>
                        )}
                        {result && (
                            <div className="alert alert-success">
                                <h5>Şifre Çözüldü:</h5>
                                <pre className="mb-0">{JSON.stringify(result, null, 2)}</pre>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <h5 className="mb-3">İşlem Detayları:</h5>
                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {apiLogs.map((log, index) => (
                                <div 
                                    key={index} 
                                    className={`mb-2 p-2 rounded ${
                                        log.type === 'error' ? 'bg-danger bg-opacity-10 text-danger' :
                                        log.type === 'success' ? 'bg-success bg-opacity-10 text-success' :
                                        'bg-info bg-opacity-10 text-info'
                                    }`}
                                >
                                    <small className="text-muted">{log.timestamp}</small>
                                    <span className="ms-2">{log.message}</span>
                                </div>
                            ))}
                            {apiLogs.length === 0 && (
                                <div className="text-muted text-center">
                                    Henüz işlem yapılmadı
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card-footer text-muted text-center">
                    <small>Prepared by Alp | Gulay S. sms istemesin diye yapilmistir.</small>
                </div>
            </div>
        </div>
    )
}

export default SmsDecrypt 