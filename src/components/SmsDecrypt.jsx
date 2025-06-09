import { useState, useEffect } from 'react'
import { DECRYPT_ENDPOINTS } from '../services/config'
import { useAuth } from '../contexts/AuthContext'

function SmsDecrypt() {
    const [loading, setLoading] = useState(false)
    const [selectedEnvironment, setSelectedEnvironment] = useState(null)
    const [authToken, setAuthToken] = useState(null)
    const [tokenError, setTokenError] = useState(null)
    const [smsData, setSmsData] = useState([])
    const [decryptedResults, setDecryptedResults] = useState({})
    const { baseUrl } = useAuth()

    useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        if (authToken) return;

        try {
            const response = await fetch(DECRYPT_ENDPOINTS.auth, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: "Etiya_Admin",
                    password: "aa1234"
                })
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
        } catch (error) {
            setTokenError(error.message)
            setAuthToken(null)
        }
    }

    const selectEnvironment = async (environment) => {
        setSelectedEnvironment(environment)
        setSmsData([])
        setDecryptedResults({})
        
        const dbName = environment === 'functional' ? 'OMNI4' : 'OMNI2'
        await fetchEncryptedSms(dbName)
    }

    const fetchEncryptedSms = async (dbName) => {
        try {
            setLoading(true)
            const response = await fetch(`${baseUrl}/oracle/encrypted-sms/${dbName}`, {
                timeout: 30000, // 30 second timeout
                signal: AbortSignal.timeout(30000)
            })

            if (!response.ok) {
                throw new Error('Şifrelenmiş SMS verileri alınamadı')
            }

            const data = await response.json()
            setSmsData(data.data)
            
            // Otomatik şifre çözme
            await decryptAllSms(data.data)
        } catch (error) {
            console.error('Hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const decryptAllSms = async (smsData) => {
        if (!authToken) return;

        const results = {}

        for (const sms of smsData) {
            try {
                const response = await fetch(DECRYPT_ENDPOINTS.decrypt, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken,
                        'LocalToken': '1'
                    },
                    body: JSON.stringify({ value: sms.encryptedValue })
                })

                if (!response.ok) {
                    throw new Error('Şifre çözme API hatası')
                }

                const decryptedData = await response.json()
                results[sms.msisdn] = {
                    status: 'success',
                    data: decryptedData
                }
            } catch (error) {
                results[sms.msisdn] = {
                    status: 'error',
                    error: error.message
            }
        }
    }

        setDecryptedResults(results)
    }

    const refreshData = async () => {
        if (!selectedEnvironment) return;
        
        setSmsData([])
        setDecryptedResults({})
        
        const dbName = selectedEnvironment === 'functional' ? 'OMNI4' : 'OMNI2'
        await fetchEncryptedSms(dbName)
    }

    const copyResult = async (content) => {
        try {
            await navigator.clipboard.writeText(content)
            alert('📋 Başarıyla kopyalandı!')
        } catch (err) {
            console.error('Kopyalama hatası:', err)
            alert('❌ Kopyalama başarısız!')
        }
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
        }}>
            {/* Header */}
            <div style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        🔐
                    </div>
                    <div>
                        <h1 style={{ 
                            margin: '0 0 8px 0', 
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            SMS Decrypt Tool
                        </h1>
                        <p style={{ margin: '0', color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
                            Oracle veritabanından son 5 şifrelenmiş SMS'i otomatik çözün
                        </p>
                    </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        borderRadius: '50px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: tokenError 
                            ? 'linear-gradient(135deg, #fee2e2, #fecaca)' 
                            : !authToken 
                                ? 'linear-gradient(135deg, #fef3c7, #fde68a)' 
                                : 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                        color: tokenError ? '#dc2626' : !authToken ? '#d97706' : '#065f46',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        animation: tokenError ? 'shake 0.5s ease-in-out' : 'none'
                    }}>
                        <span style={{ fontSize: '16px' }}>
                            {tokenError ? '❌' : !authToken ? '⏳' : '✅'}
                        </span>
                        {tokenError ? 'Token Hatası' : !authToken ? 'Token Yükleniyor' : 'Token Aktif'}
                    </div>
                    
                    {tokenError && (
                        <button 
                            onClick={getToken}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            🔄 Token Yenile
                        </button>
                    )}
                </div>
            </div>

            {/* Environment Selection */}
            {!selectedEnvironment ? (
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '48px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center'
                }}>
                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ 
                            margin: '0 0 16px 0', 
                            fontSize: '2.25rem',
                            fontWeight: '700',
                            color: '#1e293b'
                        }}>
                            Ortam Seçimi
                        </h2>
                        <p style={{ 
                            margin: '0', 
                            fontSize: '1.2rem',
                            color: '#64748b',
                            fontWeight: '500'
                        }}>
                            Şifrelenmiş SMS'leri almak istediğiniz ortamı seçin
                        </p>
                    </div>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px', 
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <div 
                            onClick={() => authToken && selectEnvironment('functional')}
                            style={{
                                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                                border: '2px solid #22c55e',
                                borderRadius: '20px',
                                padding: '40px',
                                cursor: authToken ? 'pointer' : 'not-allowed',
                                opacity: authToken ? 1 : 0.6,
                                textAlign: 'center',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                if (authToken) {
                                    e.target.style.transform = 'translateY(-8px) scale(1.02)'
                                    e.target.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.3)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (authToken) {
                                    e.target.style.transform = 'translateY(0) scale(1)'
                                    e.target.style.boxShadow = '0 10px 30px rgba(34, 197, 94, 0.2)'
                                }
                            }}
                        >
                            <div style={{ 
                                fontSize: '64px', 
                                marginBottom: '24px',
                                animation: 'bounce 2s infinite'
                            }}>
                                ⚙️
                            </div>
                            <h3 style={{ 
                                margin: '0', 
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#16a34a'
                            }}>
                                Fonksiyonel
                            </h3>
                        </div>

                        <div 
                            onClick={() => authToken && selectEnvironment('regression')}
                            style={{
                                background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                                border: '2px solid #f59e0b',
                                borderRadius: '20px',
                                padding: '40px',
                                cursor: authToken ? 'pointer' : 'not-allowed',
                                opacity: authToken ? 1 : 0.6,
                                textAlign: 'center',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                if (authToken) {
                                    e.target.style.transform = 'translateY(-8px) scale(1.02)'
                                    e.target.style.boxShadow = '0 20px 40px rgba(245, 158, 11, 0.3)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (authToken) {
                                    e.target.style.transform = 'translateY(0) scale(1)'
                                    e.target.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.2)'
                                }
                            }}
                            >
                            <div style={{ 
                                fontSize: '64px', 
                                marginBottom: '24px',
                                animation: 'wiggle 2s ease-in-out infinite'
                            }}>
                                🐛
                            </div>
                            <h3 style={{ 
                                margin: '0', 
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#d97706'
                            }}>
                                Regresyon
                            </h3>
                        </div>
                    </div>

                    {!authToken && (
                        <div style={{ 
                            marginTop: '40px',
                            padding: '20px',
                            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                            borderRadius: '16px',
                            color: '#64748b',
                            fontSize: '1.1rem',
                            fontWeight: '500'
                        }}>
                            Token alınırken bekleyin...
                            </div>
                        )}
                                    </div>
            ) : (
                /* Results Section */
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '32px',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <h2 style={{ 
                            margin: '0', 
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: '#1e293b'
                        }}>
                            {selectedEnvironment === 'functional' ? 'Fonksiyonel (OMNI4)' : 'Regresyon (OMNI2)'}
                        </h2>
                        <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                onClick={refreshData}
                                    disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    background: loading 
                                        ? 'linear-gradient(135deg, #94a3b8, #64748b)' 
                                        : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-2px)'
                                        e.target.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.4)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)'
                                        e.target.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.3)'
                                    }
                                }}
                            >
                                {loading ? 'Yenileniyor...' : 'Yenile'}
                                </button>
                            <button 
                                onClick={() => {
                                    setSelectedEnvironment(null)
                                    setSmsData([])
                                    setDecryptedResults({})
                                }}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #64748b, #475569)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 16px rgba(100, 116, 139, 0.3)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)'
                                    e.target.style.boxShadow = '0 8px 24px rgba(100, 116, 139, 0.4)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)'
                                    e.target.style.boxShadow = '0 4px 16px rgba(100, 116, 139, 0.3)'
                                }}
                            >
                                ← Geri Dön
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '80px 20px',
                            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                            borderRadius: '20px',
                            border: '1px solid rgba(0, 0, 0, 0.05)'
                        }}>
                                                    <div style={{ 
                            width: '60px',
                            height: '60px',
                            border: '4px solid #e5e7eb',
                            borderTop: '4px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 24px auto'
                        }}>
                </div>
                            <h3 style={{ 
                                margin: '0 0 16px 0',
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#1e293b'
                            }}>
                                Veriler İşleniyor
                            </h3>
                            <p style={{ 
                                margin: '0',
                                fontSize: '1.1rem',
                                color: '#64748b',
                                fontWeight: '500'
                            }}>
                                Şifrelenmiş SMS'ler getiriliyor ve çözülüyor...
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                            {smsData.map((sms, index) => {
                                const result = decryptedResults[sms.msisdn]
                                
                                return (
                                    <div 
                                        key={index} 
                                        style={{
                                            background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
                                            border: '1px solid rgba(0, 0, 0, 0.05)',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-4px)'
                                            e.target.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)'
                                            e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '16px',
                                            flexWrap: 'wrap',
                                            gap: '12px'
                                        }}>
                                            <div>
                                                <h4 style={{ 
                                                    margin: '0 0 8px 0', 
                                                    fontFamily: "'JetBrains Mono', 'Monaco', monospace", 
                                                    fontSize: '1.2rem',
                                                    fontWeight: '700',
                                                    color: '#1e293b'
                                                }}>
                                                    {sms.msisdn}
                                                </h4>
                                                <span style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '50px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: result?.status === 'success' 
                                                        ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
                                                        : result?.status === 'error' 
                                                            ? 'linear-gradient(135deg, #fee2e2, #fecaca)' 
                                                            : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                                                    color: result?.status === 'success' 
                                                        ? '#065f46' 
                                                        : result?.status === 'error' 
                                                            ? '#991b1b' 
                                                            : '#92400e',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                                }}>
                                                    {result ? 
                                                        (result.status === 'success' ? 'Çözüldü' : 'Hata') : 
                                                        'Çözülüyor...'
                                                    }
                                                </span>
                                            </div>
                                            {result?.status === 'success' && (
                                <button 
                                                    onClick={() => copyResult(JSON.stringify(result.data, null, 2))}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '50px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '12px',
                                                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'translateY(-2px) scale(1.05)'
                                                        e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'translateY(0) scale(1)'
                                                        e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)'
                                                    }}
                                                >
                                    Kopyala
                                </button>
                            )}
                        </div>
                                        
                                        <div style={{ display: 'grid', gap: '16px' }}>
                                            <div>
                                                <label style={{ 
                                                    display: 'block', 
                                                    marginBottom: '8px', 
                                                    fontSize: '1rem',
                                                    fontWeight: '700',
                                                    color: '#1e293b'
                                                }}>
                                                    Şifrelenmiş Kod
                                                </label>
                                                <div style={{
                                                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                                                    border: '2px solid #f59e0b',
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    fontFamily: "'JetBrains Mono', 'Monaco', monospace",
                                                    fontSize: '13px',
                                                    wordBreak: 'break-all',
                                                    color: '#92400e',
                                                    lineHeight: '1.4',
                                                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                                                }}>
                                                    {sms.encryptedValue}
                                </div>
                            </div>
                                            
                                                                        <div style={{ 
                                textAlign: 'center', 
                                fontSize: '1.2rem',
                                color: '#94a3b8',
                                fontWeight: '600',
                                margin: '8px 0'
                            }}>
                                ↓
                            </div>
                                            
                                            <div>
                                                <label style={{ 
                                                    display: 'block', 
                                                    marginBottom: '8px', 
                                                    fontSize: '1rem',
                                                    fontWeight: '700',
                                                    color: '#1e293b'
                                                }}>
                                                    Çözülmüş Kod
                                                </label>
                                                <div style={{
                                                    background: result?.status === 'success' 
                                                        ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' 
                                                        : result?.status === 'error' 
                                                            ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' 
                                                            : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                                                    border: `2px solid ${result?.status === 'success' 
                                                        ? '#22c55e' 
                                                        : result?.status === 'error' 
                                                            ? '#ef4444' 
                                                            : '#cbd5e1'}`,
                                                    padding: '12px',
                                                    borderRadius: '12px',
                                                    fontFamily: "'JetBrains Mono', 'Monaco', monospace",
                                                    fontSize: '13px',
                                                    minHeight: '60px',
                                                    color: result?.status === 'success' 
                                                        ? '#14532d' 
                                                        : result?.status === 'error' 
                                                            ? '#991b1b' 
                                                            : '#64748b',
                                                    lineHeight: '1.4',
                                                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    {result ? (
                                                        result.status === 'success' ? (
                                                            <pre style={{ 
                                                                margin: 0, 
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'inherit',
                                                                fontSize: 'inherit'
                                                            }}>
                                                                {JSON.stringify(result.data, null, 2)}
                                                            </pre>
                                                        ) : (
                                                            <div style={{ 
                                                                fontStyle: 'italic'
                                                            }}>
                                                                Hata: {result.error}
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div style={{ 
                                                            fontStyle: 'italic',
                                                            color: '#94a3b8'
                                                        }}>
                                                            Çözülüyor...
                            </div>
                        )}
                    </div>
                </div>
            </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
            
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-20px); }
                    70% { transform: translateY(-10px); }
                    90% { transform: translateY(-4px); }
                }
                
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                /* Responsive Design */
                @media (max-width: 768px) {
                    /* Mobile responsive styles here */
                }
            `}</style>
        </div>
    )
}

export default SmsDecrypt 