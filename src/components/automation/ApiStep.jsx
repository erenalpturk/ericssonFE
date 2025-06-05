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
  isRunning = false,
  onRunSingle = null,
  onSaveSingle = null
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
    <div className={`api-step-card-modern ${!step.enabled ? 'disabled' : ''} ${isRunning ? 'running' : ''}`}>
      {/* Compact Header */}
      <div className="step-header-modern">
        <div className="step-info-modern">
          <div className="step-number-modern">
            {index + 1}
          </div>
          
          <div className={`method-badge-modern ${step.method.toLowerCase()}`}>
            {step.method}
          </div>
          
          <div className="step-details-modern">
            <input
              type="text"
              className="step-name-modern"
              value={step.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="API Adım Adı"
              disabled={isRunning}
            />
            <div className="step-url-preview">
              {step.url || 'URL henüz girilmedi'}
            </div>
          </div>
        </div>
        
        <div className="step-actions-modern">
          {/* Single API Actions */}
          {(onRunSingle || onSaveSingle) && (
            <div className="single-api-actions">
              {onRunSingle && (
                <button
                  className="single-action-btn run"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('[ApiStep] Run button clicked for step:', step.name)
                    onRunSingle(step)
                  }}
                  disabled={isRunning || !step.url.trim() || !step.enabled}
                  title="Bu API'yi çalıştır"
                >
                  <i className={`bi ${isRunning ? 'bi-arrow-clockwise spin' : 'bi-play-fill'}`}></i>
                </button>
              )}
              
              {onSaveSingle && (
                <button
                  className="single-action-btn save"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('[ApiStep] Save button clicked for step:', step.name)
                    onSaveSingle(step)
                  }}
                  disabled={!step.url.trim()}
                  title="Bu API'yi kaydet"
                >
                  <i className="bi bi-bookmark-fill"></i>
                </button>
              )}
            </div>
          )}
          
          <div className="step-toggle-modern">
            <input 
              type="checkbox" 
              id={`enabled-${step.id}`}
              checked={step.enabled}
              onChange={(e) => handleInputChange('enabled', e.target.checked)}
              disabled={isRunning}
              className="modern-checkbox"
            />
            <label htmlFor={`enabled-${step.id}`} className="checkbox-label">
              <span className="checkmark"></span>
            </label>
          </div>
          
          <button
            className="expand-btn-modern"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isRunning}
          >
            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>
          
          <div className="dropdown step-menu">
            <button className="menu-btn-modern">
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <div className="dropdown-menu step-dropdown-menu">
              <button className="dropdown-item" onClick={onMoveUp} disabled={!canMoveUp || isRunning}>
                <i className="bi bi-arrow-up"></i>
                <span>Yukarı Taşı</span>
              </button>
              <button className="dropdown-item" onClick={onMoveDown} disabled={!canMoveDown || isRunning}>
                <i className="bi bi-arrow-down"></i>
                <span>Aşağı Taşı</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={onDelete} disabled={isRunning}>
                <i className="bi bi-trash"></i>
                <span>Sil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="step-body-modern">
          {/* Quick URL Edit */}
          <div className="url-section-modern">
            <div className="method-select-modern">
              <select
                className="form-select-modern"
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
            <div className="url-input-modern">
              <input
                type="text"
                className="form-input-modern"
                value={step.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Modern Tabs */}
          <div className="tabs-modern">
            <div className="tab-list-modern">
              <button 
                className={`tab-btn-modern ${activeTab === 'request' ? 'active' : ''}`}
                onClick={() => setActiveTab('request')}
              >
                <i className="bi bi-file-text"></i>
                <span>Body</span>
              </button>
              <button 
                className={`tab-btn-modern ${activeTab === 'headers' ? 'active' : ''}`}
                onClick={() => setActiveTab('headers')}
              >
                <i className="bi bi-list-ul"></i>
                <span>Headers</span>
                {Object.keys(step.headers || {}).length > 0 && (
                  <span className="tab-badge">{Object.keys(step.headers || {}).length}</span>
                )}
              </button>
              <button 
                className={`tab-btn-modern ${activeTab === 'variables' ? 'active' : ''}`}
                onClick={() => setActiveTab('variables')}
              >
                <i className="bi bi-code-square"></i>
                <span>Variables</span>
                {Object.keys(step.variables).length > 0 && (
                  <span className="tab-badge">{Object.keys(step.variables).length}</span>
                )}
              </button>
              <button 
                className={`tab-btn-modern ${activeTab === 'scripts' ? 'active' : ''}`}
                onClick={() => setActiveTab('scripts')}
              >
                <i className="bi bi-file-code"></i>
                <span>Scripts</span>
                {(step.preRequestScript?.trim() || step.postResponseScript?.trim()) && (
                  <span className="tab-badge">!</span>
                )}
              </button>
            </div>

            <div className="tab-content-modern">
              {activeTab === 'request' && (
                <div className="tab-panel-modern">
                  <textarea
                    className="form-textarea-modern"
                    rows="8"
                    value={step.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    placeholder="JSON request body..."
                    disabled={isRunning}
                  />
                </div>
              )}

              {activeTab === 'headers' && (
                <div className="tab-panel-modern">
                  <div className="panel-header-modern">
                    <button 
                      className="add-btn-modern"
                      onClick={addHeader}
                      disabled={isRunning}
                    >
                      <i className="bi bi-plus"></i>
                      <span>Header Ekle</span>
                    </button>
                  </div>
                  
                  {(!step.headers || Object.keys(step.headers).length === 0) ? (
                    <div className="empty-state-modern">
                      <i className="bi bi-list-ul"></i>
                      <p>Header eklenmedi</p>
                    </div>
                  ) : (
                    <div className="items-list-modern">
                      {Object.entries(step.headers || {}).map(([key, value]) => (
                        <div key={key} className="item-row-modern">
                          <input
                            type="text"
                            className="item-input-modern key"
                            value={key}
                            onChange={(e) => handleHeaderChange(e.target.value, value, key)}
                            placeholder="Header adı"
                            disabled={isRunning}
                          />
                          <input
                            type="text"
                            className="item-input-modern value"
                            value={value || ''}
                            onChange={(e) => handleHeaderChange(key, e.target.value)}
                            placeholder="Header değeri"
                            disabled={isRunning}
                          />
                          <button
                            className="remove-btn-modern"
                            onClick={() => removeHeader(key)}
                            disabled={isRunning}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'variables' && (
                <div className="tab-panel-modern">
                  <div className="panel-header-modern">
                    <button 
                      className="add-btn-modern"
                      onClick={addVariable}
                      disabled={isRunning}
                    >
                      <i className="bi bi-plus"></i>
                      <span>Değişken Ekle</span>
                    </button>
                  </div>
                  
                  {Object.keys(step.variables).length === 0 ? (
                    <div className="empty-state-modern">
                      <i className="bi bi-code-square"></i>
                      <p>Değişken tanımlanmadı</p>
                    </div>
                  ) : (
                    <div className="items-list-modern">
                      {Object.entries(step.variables).map(([varName, path]) => (
                        <div key={varName} className="item-row-modern">
                          <input
                            type="text"
                            className="item-input-modern key"
                            value={varName}
                            onChange={(e) => handleVariableChange(e.target.value, path, varName)}
                            placeholder="Değişken adı"
                            disabled={isRunning}
                          />
                          <input
                            type="text"
                            className="item-input-modern value"
                            value={path}
                            onChange={(e) => handleVariableChange(varName, e.target.value)}
                            placeholder="response.field"
                            disabled={isRunning}
                          />
                          <button
                            className="remove-btn-modern"
                            onClick={() => removeVariable(varName)}
                            disabled={isRunning}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'scripts' && (
                <div className="tab-panel-modern">
                  <div className="scripts-container-modern">
                    <div className="script-section-modern">
                      <label className="script-label-modern">Pre-request Script</label>
                      <textarea
                        className="form-textarea-modern script"
                        rows="6"
                        value={step.preRequestScript || ''}
                        onChange={(e) => handleInputChange('preRequestScript', e.target.value)}
                        placeholder="// Pre-request script..."
                        disabled={isRunning}
                      />
                    </div>

                    <div className="script-section-modern">
                      <label className="script-label-modern">Post-response Script</label>
                      <textarea
                        className="form-textarea-modern script"
                        rows="6"
                        value={step.postResponseScript || ''}
                        onChange={(e) => handleInputChange('postResponseScript', e.target.value)}
                        placeholder="// Post-response script..."
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