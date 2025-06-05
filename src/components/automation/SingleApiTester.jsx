import React, { useState, useEffect } from 'react'
import ApiStep from './ApiStep'
import { VariablesService } from '../../lib/variables-service'

export default function SingleApiTester() {
  const [apiStep, setApiStep] = useState({
    id: 'single-api',
    name: 'API Test',
    method: 'GET',
    url: '',
    headers: {},
    body: '',
    variables: {},
    enabled: true,
    preRequestScript: '',
    postResponseScript: ''
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [variables, setVariables] = useState({})
  const [savedApis, setSavedApis] = useState([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveName, setSaveName] = useState('')

  useEffect(() => {
    // Load variables
    loadVariables()
    
    // Load saved APIs
    loadSavedApis()
  }, [])

  const loadVariables = async () => {
    try {
      const currentVars = await VariablesService.getAllVariables()
      setVariables(currentVars)
    } catch (error) {
      console.error('Error loading variables:', error)
      // Fallback to runtime variables only
      const runtimeVars = VariablesService.getRuntimeVariables()
      const runtimeValues = {}
      Object.values(runtimeVars).forEach(variable => {
        runtimeValues[variable.key] = variable.value
      })
      setVariables(runtimeValues)
    }
  }

  const loadSavedApis = () => {
    const saved = JSON.parse(localStorage.getItem('savedSingleApis') || '[]')
    setSavedApis(saved)
  }

  const handleStepUpdate = (updates) => {
    setApiStep(prev => ({ ...prev, ...updates }))
  }

  const runApi = async () => {
    setIsRunning(true)
    setResult(null)
    
    try {
      // Execute pre-request script
      if (apiStep.preRequestScript?.trim()) {
        try {
          const scriptFunction = new Function('variables', apiStep.preRequestScript)
          scriptFunction(variables)
        } catch (error) {
          console.warn('Pre-request script error:', error)
        }
      }

      // Replace variables in URL and body
      let processedUrl = apiStep.url
      let processedBody = apiStep.body
      
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        processedUrl = processedUrl.replace(regex, value)
        processedBody = processedBody.replace(regex, value)
      })

      // Prepare headers
      const headers = { 'Content-Type': 'application/json', ...apiStep.headers }
      
      // Make request
      const startTime = Date.now()
      const response = await fetch(processedUrl, {
        method: apiStep.method,
        headers: headers,
        body: ['GET', 'DELETE'].includes(apiStep.method) ? undefined : processedBody
      })
      
      const duration = Date.now() - startTime
      const responseText = await response.text()
      let responseData
      
      try {
        responseData = JSON.parse(responseText)
      } catch {
        responseData = responseText
      }

      // Extract variables
      const newVariables = { ...variables }
      Object.entries(apiStep.variables).forEach(([varName, path]) => {
        if (path.startsWith('response.')) {
          const responsePath = path.substring(9)
          try {
            const value = getNestedValue(responseData, responsePath)
            if (value !== undefined) {
              newVariables[varName] = value
              VariablesService.setRuntimeVariable(varName, value, 'api_response')
            }
          } catch (error) {
            console.warn(`Error extracting variable ${varName}:`, error)
          }
        }
      })
      
      setVariables(newVariables)

      // Execute post-response script
      if (apiStep.postResponseScript?.trim()) {
        try {
          const scriptFunction = new Function('response', 'variables', apiStep.postResponseScript)
          scriptFunction(responseData, newVariables)
        } catch (error) {
          console.warn('Post-response script error:', error)
        }
      }

      setResult({
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        duration,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  const saveApi = () => {
    if (!saveName.trim()) return
    
    const savedApi = {
      ...apiStep,
      savedName: saveName,
      savedAt: new Date().toISOString()
    }
    
    const updated = [...savedApis, savedApi]
    setSavedApis(updated)
    localStorage.setItem('savedSingleApis', JSON.stringify(updated))
    
    setShowSaveModal(false)
    setSaveName('')
  }

  const loadApi = (savedApi) => {
    const { savedName, savedAt, ...apiData } = savedApi
    setApiStep(apiData)
    setResult(null)
  }

  const deleteApi = (index) => {
    const updated = savedApis.filter((_, i) => i !== index)
    setSavedApis(updated)
    localStorage.setItem('savedSingleApis', JSON.stringify(updated))
  }

  return (
    <div className="modern-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-lightning"></i>
          </div>
          <div className="header-text">
            <h1>API Tester</h1>
            <p>Tek bir API'yi test edin ve kaydedin</p>
          </div>
        </div>
        <div className="stats-badge">
          <i className="bi bi-bookmark"></i>
          <span>{savedApis.length} Kayıtlı API</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar-minimal">
        <div className="action-group-left">
          <button 
            className="action-btn primary" 
            onClick={runApi} 
            disabled={isRunning || !apiStep.url.trim()}
          >
            <i className={`bi ${isRunning ? 'bi-arrow-clockwise spin' : 'bi-play'}`}></i>
            <span>{isRunning ? 'Çalışıyor...' : 'Çalıştır'}</span>
          </button>
          
          <button 
            className="action-btn secondary" 
            onClick={() => setShowSaveModal(true)}
            disabled={!apiStep.url.trim()}
          >
            <i className="bi bi-bookmark"></i>
            <span>Kaydet</span>
          </button>
        </div>
        
        <div className="action-group-right">
          <div className="dropdown">
            <button className="action-btn outline dropdown-toggle">
              <i className="bi bi-collection"></i>
              <span>Kayıtlı API'ler</span>
            </button>
            <div className="dropdown-menu">
              {savedApis.length === 0 ? (
                <div className="dropdown-item" style={{opacity: 0.5, cursor: 'default'}}>
                  <i className="bi bi-inbox"></i>
                  <span>Kayıtlı API yok</span>
                </div>
              ) : (
                savedApis.map((savedApi, index) => (
                  <div key={index} className="dropdown-item" style={{flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span className={`method-badge-modern ${savedApi.method.toLowerCase()}`}>
                        {savedApi.method}
                      </span>
                      <span style={{fontWeight: 600, flex: 1}}>{savedApi.savedName}</span>
                      <button
                        className="remove-btn-modern"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteApi(index)
                        }}
                        style={{width: '1.5rem', height: '1.5rem'}}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                    <button
                      onClick={() => loadApi(savedApi)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        color: '#2563eb',
                        cursor: 'pointer'
                      }}
                    >
                      Yükle
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* API Configuration */}
        <div className="api-config-card">
          <ApiStep
            step={apiStep}
            index={0}
            onUpdate={handleStepUpdate}
            onDelete={() => {}}
            onMoveUp={() => {}}
            onMoveDown={() => {}}
            canMoveUp={false}
            canMoveDown={false}
            variables={variables}
            isRunning={isRunning}
          />
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <div className="panel-header">
            <div className="panel-title">
              <i className="bi bi-graph-up"></i>
              <h3>Sonuç</h3>
              {result && (
                <span className={`result-count ${result.success ? 'success' : 'error'}`}>
                  {result.success ? 'Başarılı' : 'Hata'}
                </span>
              )}
            </div>
          </div>
          
          <div className="panel-body">
            {!result ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-play-circle"></i>
                </div>
                <h3>API'yi Çalıştırın</h3>
                <p>Sonuçları görmek için API'yi çalıştırın</p>
              </div>
            ) : (
              <div className="result-item">
                <div className="result-body">
                  {/* Status Info */}
                  {result.success ? (
                    <div className="info-message">
                      <div className="info-header">
                        <i className="bi bi-check-circle"></i>
                        <span>İstek Başarılı</span>
                      </div>
                      <div className="info-content">
                        <p><strong>Status:</strong> {result.status} {result.statusText}</p>
                        <p><strong>Süre:</strong> {result.duration}ms</p>
                        <p><strong>Zaman:</strong> {new Date(result.timestamp).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="error-message">
                      <div className="error-header">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>İstek Hatası</span>
                      </div>
                      <div className="error-content">
                        <p>{result.error}</p>
                        <p><strong>Zaman:</strong> {new Date(result.timestamp).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  )}

                  {/* Variables Section */}
                  {Object.keys(variables).length > 0 && (
                    <div className="variables-section">
                      <div className="section-header">
                        <span>Değişkenler ({Object.keys(variables).length})</span>
                      </div>
                      <div className="variables-list">
                        {Object.entries(variables).map(([key, value]) => (
                          <div key={key} className="variable-item">
                            <span className="variable-key">{key}</span>
                            <span>=</span>
                            <span className="variable-value">{JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Response Section */}
                  {result.success && (
                    <div className="response-section">
                      <div className="response-tabs">
                        <button className="tab-btn active">
                          <i className="bi bi-code"></i>
                          Response
                        </button>
                        <button className="tab-btn">
                          <i className="bi bi-list"></i>
                          Headers
                        </button>
                      </div>
                      
                      <div className="response-content">
                        <pre className="code-block">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="bi bi-bookmark"></i>
                API'yi Kaydet
              </h3>
              <button className="modal-close" onClick={() => setShowSaveModal(false)}>
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">API Adı</label>
                <input
                  type="text"
                  className="form-input"
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  placeholder="Örnek: User API, Product List..."
                  autoFocus
                />
              </div>
              <div className="info-box">
                <div className="info-header">
                  <i className="bi bi-info-circle"></i>
                  <span>Kaydedilecek Bilgiler</span>
                </div>
                <div className="info-content">
                  <p>• Method: {apiStep.method}</p>
                  <p>• URL: {apiStep.url || 'Belirtilmedi'}</p>
                  <p>• Headers: {Object.keys(apiStep.headers).length} adet</p>
                  <p>• Variables: {Object.keys(apiStep.variables).length} adet</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn outline"
                onClick={() => setShowSaveModal(false)}
              >
                İptal
              </button>
              <button 
                className="action-btn primary"
                onClick={saveApi}
                disabled={!saveName.trim()}
              >
                <i className="bi bi-bookmark"></i>
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 