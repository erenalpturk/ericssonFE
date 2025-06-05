import React, { useState } from 'react'

export default function WorkflowResults({ results }) {
  const [expandedResult, setExpandedResult] = useState(null)
  const [activeTab, setActiveTab] = useState('response')

  const toggleExpand = (stepId) => {
    setExpandedResult(expandedResult === stepId ? null : stepId)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'bi-check-circle-fill text-emerald-500'
      case 'error':
        return 'bi-x-circle-fill text-red-500'
      case 'pending':
        return 'bi-clock-fill text-orange-500'
      default:
        return 'bi-question-circle-fill text-gray-500'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'danger'
      case 'pending':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const formatJson = (obj) => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return String(obj)
    }
  }

  const formatDuration = (duration) => {
    if (!duration) return 'N/A'
    return `${duration}ms`
  }

  return (
    <div className="results-panel">
      <div className="panel-header">
        <div className="panel-title">
          <i className="bi bi-list-check"></i>
          <h3>Workflow Sonuçları</h3>
          <span className="result-count">{results.length}</span>
        </div>
      </div>
      
      <div className="panel-body">
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-hourglass-split"></i>
            </div>
            <h4>Henüz sonuç yok</h4>
            <p>Workflow çalıştırıldığında sonuçlar burada görünecek</p>
          </div>
        ) : (
          <div className="results-list">
            {results.map((result, index) => (
              <div key={result.stepId} className="result-item">
                <div 
                  className="result-header"
                  onClick={() => toggleExpand(result.stepId)}
                >
                  <div className="result-info">
                    <div className="result-status">
                      <i className={getStatusIcon(result.status)}></i>
                    </div>
                    <div className="result-details">
                      <div className="result-name">{result.stepName}</div>
                      <div className="result-meta">
                        {result.httpStatus && (
                          <span className="status-code">HTTP {result.httpStatus}</span>
                        )}
                        <span className="duration">{formatDuration(result.duration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="result-actions">
                    <div className={`status-badge ${getStatusColor(result.status)}`}>
                      {result.status}
                    </div>
                    <button className="expand-btn">
                      <i className={`bi bi-chevron-${expandedResult === result.stepId ? 'up' : 'down'}`}></i>
                    </button>
                  </div>
                </div>

                {expandedResult === result.stepId && (
                  <div className="result-body">
                    {/* Error Display */}
                    {result.error && (
                      <div className="error-message">
                        <div className="error-header">
                          <i className="bi bi-exclamation-triangle"></i>
                          <span>Hata</span>
                        </div>
                        <div className="error-content">
                          {result.error}
                        </div>
                      </div>
                    )}

                    {/* Extracted Variables */}
                    {result.extractedVariables && Object.keys(result.extractedVariables).length > 0 && (
                      <div className="variables-section">
                        <div className="section-header">
                          <i className="bi bi-code-square"></i>
                          <span>Çıkarılan Değişkenler</span>
                        </div>
                        <div className="variables-list">
                          {Object.entries(result.extractedVariables).map(([key, value]) => (
                            <div key={key} className="variable-item">
                              <code className="variable-key">{key}</code>
                              <span>=</span>
                              <code className="variable-value">{value}</code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Data */}
                    {result.response && (
                      <div className="response-section">
                        <div className="response-tabs">
                          <button 
                            className={`tab-btn ${activeTab === 'response' ? 'active' : ''}`}
                            onClick={() => setActiveTab('response')}
                          >
                            <i className="bi bi-file-text"></i>
                            Response
                          </button>
                          {result.responseHeaders && (
                            <button 
                              className={`tab-btn ${activeTab === 'headers' ? 'active' : ''}`}
                              onClick={() => setActiveTab('headers')}
                            >
                              <i className="bi bi-list-ul"></i>
                              Headers
                            </button>
                          )}
                        </div>

                        <div className="tab-content">
                          {activeTab === 'response' && (
                            <div className="response-content">
                              <pre className="code-block">
                                {formatJson(result.response)}
                              </pre>
                            </div>
                          )}

                          {activeTab === 'headers' && result.responseHeaders && (
                            <div className="headers-content">
                              {Object.entries(result.responseHeaders).map(([key, value]) => (
                                <div key={key} className="header-item">
                                  <div className="header-key">{key}</div>
                                  <div className="header-value">{value}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pending/Disabled Step Message */}
                    {result.message && (
                      <div className="info-message">
                        <div className="info-header">
                          <i className="bi bi-info-circle"></i>
                          <span>Bilgi</span>
                        </div>
                        <div className="info-content">
                          {result.message}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 