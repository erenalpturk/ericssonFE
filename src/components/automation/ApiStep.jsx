import React, { useState } from 'react'

export default function ApiStep({ 
  step, 
  index, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown, 
  variables = {}, 
  isRunning = false 
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState('request')

  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value })
  }

  const handleHeaderChange = (key, value, oldKey = null) => {
    const newHeaders = { ...step.headers }
    
    if (oldKey && oldKey !== key) {
      delete newHeaders[oldKey]
    }
    
    if (key && key.trim()) {
      newHeaders[key] = value || ''
    }
    
    handleInputChange('headers', newHeaders)
  }

  const addHeader = () => {
    const headers = step.headers || {}
    const newKey = 'New-Header'
    let counter = 1
    let finalKey = newKey
    
    while (headers[finalKey]) {
      finalKey = `${newKey}-${counter}`
      counter++
    }
    
    // Direkt yeni header'ı ekle
    const newHeaders = { ...headers, [finalKey]: '' }
    handleInputChange('headers', newHeaders)
  }

  const removeHeader = (key) => {
    const newHeaders = { ...step.headers }
    delete newHeaders[key]
    handleInputChange('headers', newHeaders)
  }

  const handleVariableChange = (varName, path, oldVarName = null) => {
    const newVariables = { ...step.variables }
    
    if (oldVarName && oldVarName !== varName) {
      delete newVariables[oldVarName]
    }
    
    if (!varName || !varName.trim()) {
      // Eğer variable name boşsa, eski variable'ı sil
      if (oldVarName) {
        delete newVariables[oldVarName]
      }
    } else {
      newVariables[varName] = path || ''
    }
    
    handleInputChange('variables', newVariables)
  }

  const addVariable = () => {
    const newVarName = 'newVariable'
    let counter = 1
    let finalVarName = newVarName
    
    while (step.variables[finalVarName]) {
      finalVarName = `${newVarName}${counter}`
      counter++
    }
    
    handleVariableChange(finalVarName, 'response.')
  }

  const removeVariable = (varName) => {
    const newVariables = { ...step.variables }
    delete newVariables[varName]
    handleInputChange('variables', newVariables)
  }

  const getMethodColor = () => {
    const colors = {
      GET: 'text-emerald-500',
      POST: 'text-blue-500',
      PUT: 'text-orange-500',
      DELETE: 'text-red-500',
      PATCH: 'text-purple-500'
    }
    return colors[step.method] || 'text-gray-500'
  }

  const getMethodBadgeClass = () => {
    const classes = {
      GET: 'method-badge success',
      POST: 'method-badge primary',
      PUT: 'method-badge warning',
      DELETE: 'method-badge danger',
      PATCH: 'method-badge purple'
    }
    return classes[step.method] || 'method-badge secondary'
  }

  return (
    <div className="api-step-card">
      <div className="step-header">
        <div className="step-info">
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isRunning}
          >
            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>
          
          <div className="step-number">
            {index + 1}
          </div>
          
          <div className={getMethodBadgeClass()}>
            {step.method}
          </div>
          
          <input
            type="text"
            className="step-name-input"
            value={step.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="API Adım Adı"
            disabled={isRunning}
          />
        </div>
        
        <div className="step-controls">
          <div className="status-toggle">
            <input 
              type="checkbox" 
              id={`enabled-${step.id}`}
              checked={step.enabled}
              onChange={(e) => handleInputChange('enabled', e.target.checked)}
              disabled={isRunning}
            />
            <label htmlFor={`enabled-${step.id}`} className="toggle-label">
              <span className="toggle-text">Aktif</span>
            </label>
          </div>
          
          <div className="control-buttons">
            <button
              className="control-btn"
              onClick={onMoveUp}
              disabled={!canMoveUp || isRunning}
              title="Yukarı Taşı"
            >
              <i className="bi bi-arrow-up"></i>
            </button>
            
            <button
              className="control-btn"
              onClick={onMoveDown}
              disabled={!canMoveDown || isRunning}
              title="Aşağı Taşı"
            >
              <i className="bi bi-arrow-down"></i>
            </button>
            
            <button
              className="control-btn danger"
              onClick={onDelete}
              disabled={isRunning}
              title="Sil"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="step-body">
          {/* Method and URL */}
          <div className="url-section">
            <div className="method-select">
              <select
                className="form-select"
                value={step.method}
                onChange={(e) => handleInputChange('method', e.target.value)}
                disabled={isRunning}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div className="url-input">
              <input
                type="text"
                className="form-input"
                value={step.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="API URL'i girin (örn: https://api.example.com/users)"
                disabled={isRunning}
              />
              {Object.keys(variables).length > 0 && (
                <div className="form-help">
                  <i className="bi bi-info-circle"></i>
                  Kullanılabilir değişkenler: {Object.keys(variables).map(key => `{{${key}}}`).join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="step-tabs">
            <div className="tab-list">
              <button 
                className={`tab-button ${activeTab === 'request' ? 'active' : ''}`}
                onClick={() => setActiveTab('request')}
              >
                <i className="bi bi-file-text"></i>
                İstek
              </button>
              <button 
                className={`tab-button ${activeTab === 'headers' ? 'active' : ''}`}
                onClick={() => setActiveTab('headers')}
              >
                <i className="bi bi-list-ul"></i>
                Headers ({Object.keys(step.headers || {}).length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'variables' ? 'active' : ''}`}
                onClick={() => setActiveTab('variables')}
              >
                <i className="bi bi-code-square"></i>
                Değişkenler ({Object.keys(step.variables).length})
              </button>
              <button 
                className={`tab-button ${activeTab === 'scripts' ? 'active' : ''}`}
                onClick={() => setActiveTab('scripts')}
              >
                <i className="bi bi-file-code"></i>
                Scripts
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'request' && (
                <div className="tab-panel">
                  <div className="form-group">
                    <label className="form-label">Request Body (JSON)</label>
                    <textarea
                      className="form-textarea code"
                      rows="8"
                      value={step.body}
                      onChange={(e) => handleInputChange('body', e.target.value)}
                      placeholder="JSON request body'sini girin..."
                      disabled={isRunning}
                    />
                    <div className="form-help">
                      <i className="bi bi-info-circle"></i>
                      Değişkenler için {`{{variableName}}`} formatını kullanın. 
                      Mevcut değişkenler: {Object.keys(variables).join(', ') || 'Henüz tanımlanmamış'}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'headers' && (
                <div className="tab-panel">
                  <div className="section-header">
                    <h4>Request Headers</h4>
                    <button 
                      className="action-btn secondary small"
                      onClick={addHeader}
                      disabled={isRunning}
                    >
                      <i className="bi bi-plus"></i>
                      Header Ekle
                    </button>
                  </div>
                  
                  {(!step.headers || Object.keys(step.headers).length === 0) ? (
                    <div className="empty-state small">
                      <div className="empty-icon">
                        <i className="bi bi-list-ul"></i>
                      </div>
                      <p>Henüz header eklenmedi</p>
                    </div>
                  ) : (
                    <div className="headers-list">
                      {Object.entries(step.headers || {}).map(([key, value]) => (
                        <div key={key} className="header-item">
                          <div className="header-key">
                            <input
                              type="text"
                              className="form-input small"
                              value={key}
                              onChange={(e) => handleHeaderChange(e.target.value, value, key)}
                              placeholder="Header adı"
                              disabled={isRunning}
                            />
                          </div>
                          <div className="header-value">
                            <input
                              type="text"
                              className="form-input small"
                              value={value || ''}
                              onChange={(e) => handleHeaderChange(key, e.target.value)}
                              placeholder="Header değeri"
                              disabled={isRunning}
                            />
                          </div>
                          <button
                            className="control-btn danger small"
                            onClick={() => removeHeader(key)}
                            disabled={isRunning}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'variables' && (
                <div className="tab-panel">
                  <div className="section-header">
                    <h4>Response'dan Değişken Çıkarımı</h4>
                    <button 
                      className="action-btn secondary small"
                      onClick={addVariable}
                      disabled={isRunning}
                    >
                      <i className="bi bi-plus"></i>
                      Değişken Ekle
                    </button>
                  </div>
                  
                  {Object.keys(step.variables).length === 0 ? (
                    <div className="empty-state small">
                      <div className="empty-icon">
                        <i className="bi bi-code-square"></i>
                      </div>
                      <p>Henüz değişken tanımlanmadı</p>
                      <button 
                        className="action-btn primary small"
                        onClick={addVariable}
                        disabled={isRunning}
                      >
                        İlk Değişkeni Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="variables-list">
                      {Object.entries(step.variables).map(([varName, path]) => (
                        <div key={varName} className="variable-item">
                          <div className="variable-name">
                            <input
                              type="text"
                              className="form-input small"
                              value={varName}
                              onChange={(e) => handleVariableChange(e.target.value, path, varName)}
                              placeholder="Değişken adı"
                              disabled={isRunning}
                            />
                          </div>
                          <div className="variable-path">
                            <input
                              type="text"
                              className="form-input small"
                              value={path}
                              onChange={(e) => handleVariableChange(varName, e.target.value)}
                              placeholder="response.fieldName"
                              disabled={isRunning}
                            />
                          </div>
                          <button
                            className="control-btn danger small"
                            onClick={() => removeVariable(varName)}
                            disabled={isRunning}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'scripts' && (
                <div className="tab-panel">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Pre-request Script */}
                    <div>
                      <div className="section-header" style={{ marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1rem' }}>Pre-request Script</h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
                            API çağrısından önce çalışır. Request'i değiştirebilir ve değişken ekleyebilir.
                          </p>
                        </div>
                      </div>

                      <textarea
                        className="form-textarea code"
                        rows="8"
                        value={step.preRequestScript || ''}
                        onChange={(e) => handleInputChange('preRequestScript', e.target.value)}
                        placeholder="// Pre-request script'inizi buraya yazın..."
                        disabled={isRunning}
                      />
                    </div>

                    {/* Post-response Script */}
                    <div>
                      <div className="section-header" style={{ marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1rem' }}>Post-response Script (Tests)</h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
                            API response'undan sonra çalışır. Response'u test edebilir ve değişken çıkarabilir.
                          </p>
                        </div>
                      </div>

                      <textarea
                        className="form-textarea code"
                        rows="10"
                        value={step.postResponseScript || ''}
                        onChange={(e) => handleInputChange('postResponseScript', e.target.value)}
                        placeholder="// Post-response script'inizi buraya yazın..."
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 