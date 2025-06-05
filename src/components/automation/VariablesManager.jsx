import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { VariablesService } from '../../lib/variables-service'

export default function VariablesManager({ onClose, onVariablesChanged }) {
  const [staticVariables, setStaticVariables] = useState([])
  const [runtimeVariables, setRuntimeVariables] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('static')
  const [newVarKey, setNewVarKey] = useState('')
  const [newVarValue, setNewVarValue] = useState('')
  const [newVarDescription, setNewVarDescription] = useState('')

  useEffect(() => {
    loadVariables()
  }, [])

  const loadVariables = async () => {
    try {
      // Static variables
      const staticVars = await VariablesService.getAllStaticVariables()
      setStaticVariables(staticVars)

      // Runtime variables
      const runtimeVars = VariablesService.getRuntimeVariables()
      setRuntimeVariables(runtimeVars)
    } catch (error) {
      console.error('Error loading variables:', error)
      toast.error('Değişkenler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStaticVariable = async () => {
    if (!newVarKey.trim() || !newVarValue.trim()) {
      toast.error('Anahtar ve değer alanları gerekli')
      return
    }

    try {
      await VariablesService.setStaticVariable(newVarKey, newVarValue, newVarDescription)
      toast.success('Değişken eklendi')
      setNewVarKey('')
      setNewVarValue('')
      setNewVarDescription('')
      loadVariables()
      onVariablesChanged()
    } catch (error) {
      console.error('Error adding variable:', error)
      toast.error('Değişken eklenirken hata oluştu')
    }
  }

  const handleDeleteStaticVariable = async (key) => {
    if (!confirm(`"${key}" değişkenini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      await VariablesService.deleteStaticVariable(key)
      toast.success('Değişken silindi')
      loadVariables()
      onVariablesChanged()
    } catch (error) {
      console.error('Error deleting variable:', error)
      toast.error('Değişken silinirken hata oluştu')
    }
  }

  const handleDeleteRuntimeVariable = (key) => {
    if (!confirm(`"${key}" runtime değişkenini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      VariablesService.deleteRuntimeVariable(key)
      toast.success('Runtime değişken silindi')
      loadVariables()
      onVariablesChanged()
    } catch (error) {
      console.error('Error deleting runtime variable:', error)
      toast.error('Runtime değişken silinirken hata oluştu')
    }
  }

  const handleClearRuntimeVariables = () => {
    if (!confirm('Tüm runtime değişkenleri silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      VariablesService.clearRuntimeVariables()
      toast.success('Tüm runtime değişkenler silindi')
      loadVariables()
      onVariablesChanged()
    } catch (error) {
      console.error('Error clearing runtime variables:', error)
      toast.error('Runtime değişkenler silinirken hata oluştu')
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('tr-TR')
  }

  const getSourceBadge = (source) => {
    const badges = {
      api: 'success',
      script: 'warning', 
      manual: 'primary'
    }
    return badges[source] || 'secondary'
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '900px', width: '90vw' }}>
        <div className="modal-header">
          <h3>
            <i className="bi bi-gear-fill"></i>
            Değişken Yönetimi
          </h3>
          <button 
            className="modal-close"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <h4>Yükleniyor...</h4>
              <p>Değişkenler yükleniyor</p>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div className="step-tabs">
                <div className="tab-list">
                  <button 
                    className={`tab-button ${activeTab === 'static' ? 'active' : ''}`}
                    onClick={() => setActiveTab('static')}
                  >
                    <i className="bi bi-code-square"></i>
                    Static Değişkenler ({staticVariables.length})
                  </button>
                  <button 
                    className={`tab-button ${activeTab === 'runtime' ? 'active' : ''}`}
                    onClick={() => setActiveTab('runtime')}
                  >
                    <i className="bi bi-clock"></i>
                    Runtime Değişkenler ({Object.keys(runtimeVariables).length})
                  </button>
                </div>

                <div className="tab-content">
                  {/* Static Variables Tab */}
                  {activeTab === 'static' && (
                    <div className="tab-panel">
                      {/* Add New Variable Form */}
                      <div className="api-step-card" style={{ marginBottom: '2rem' }}>
                        <div className="step-header">
                          <div className="step-info">
                            <div className="step-number">
                              <i className="bi bi-plus"></i>
                            </div>
                            <h4 style={{ margin: 0, color: '#374151' }}>Yeni Static Değişken Ekle</h4>
                          </div>
                        </div>
                        <div className="step-body">
                          <div className="url-section">
                            <div style={{ flex: '0 0 200px' }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Anahtar"
                                value={newVarKey}
                                onChange={(e) => setNewVarKey(e.target.value)}
                              />
                            </div>
                            <div style={{ flex: '1' }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Değer"
                                value={newVarValue}
                                onChange={(e) => setNewVarValue(e.target.value)}
                              />
                            </div>
                            <div style={{ flex: '1' }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Açıklama (opsiyonel)"
                                value={newVarDescription}
                                onChange={(e) => setNewVarDescription(e.target.value)}
                              />
                            </div>
                            <div style={{ flex: '0 0 120px' }}>
                              <button
                                className="action-btn primary"
                                onClick={handleAddStaticVariable}
                                style={{ width: '100%' }}
                              >
                                <i className="bi bi-plus-lg"></i>
                                Ekle
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Variables List */}
                      {staticVariables.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-icon">
                            <i className="bi bi-code-square"></i>
                          </div>
                          <h4>Henüz static değişken bulunamadı</h4>
                          <p>İlk static değişkeninizi yukarıdan ekleyin</p>
                        </div>
                      ) : (
                        <div className="table-container">
                          <table className="modern-table">
                            <thead>
                              <tr>
                                <th style={{ width: '200px' }}>Anahtar</th>
                                <th>Değer</th>
                                <th style={{ width: '200px' }}>Açıklama</th>
                                <th style={{ width: '180px' }}>Son Güncelleme</th>
                                <th style={{ width: '80px' }}>İşlemler</th>
                              </tr>
                            </thead>
                            <tbody>
                              {staticVariables.map(variable => (
                                <tr key={variable.id}>
                                  <td>
                                    <code style={{ 
                                      background: '#e0f2fe', 
                                      color: '#0277bd', 
                                      padding: '0.25rem 0.5rem', 
                                      borderRadius: '0.25rem',
                                      fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
                                    }}>
                                      {variable.key}
                                    </code>
                                  </td>
                                  <td style={{ color: '#374151', fontWeight: '500' }}>
                                    {variable.value}
                                  </td>
                                  <td style={{ color: '#6b7280' }}>
                                    {variable.description || '-'}
                                  </td>
                                  <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                    {formatTimestamp(variable.updated_at)}
                                  </td>
                                  <td>
                                    <button
                                      className="control-btn danger"
                                      onClick={() => handleDeleteStaticVariable(variable.key)}
                                      title="Sil"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Runtime Variables Tab */}
                  {activeTab === 'runtime' && (
                    <div className="tab-panel">
                      <div className="section-header" style={{ marginBottom: '2rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Runtime Değişkenler</h4>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                            Bu değişkenler API çağrıları sırasında otomatik olarak oluşturulur
                          </p>
                        </div>
                        {Object.keys(runtimeVariables).length > 0 && (
                          <button
                            className="action-btn danger"
                            onClick={handleClearRuntimeVariables}
                          >
                            <i className="bi bi-trash"></i>
                            Tümünü Temizle
                          </button>
                        )}
                      </div>

                      {Object.keys(runtimeVariables).length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-icon">
                            <i className="bi bi-clock"></i>
                          </div>
                          <h4>Henüz runtime değişken bulunamadı</h4>
                          <p>
                            API workflow'ları çalıştırıldığında runtime değişkenler burada görünecek
                          </p>
                        </div>
                      ) : (
                        <div className="table-container">
                          <table className="modern-table">
                            <thead>
                              <tr>
                                <th style={{ width: '200px' }}>Anahtar</th>
                                <th>Değer</th>
                                <th style={{ width: '120px' }}>Kaynak</th>
                                <th style={{ width: '180px' }}>Oluşturulma</th>
                                <th style={{ width: '80px' }}>İşlemler</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(runtimeVariables).map(([key, variable]) => (
                                <tr key={key}>
                                  <td>
                                    <code style={{ 
                                      background: '#dcfce7', 
                                      color: '#166534', 
                                      padding: '0.25rem 0.5rem', 
                                      borderRadius: '0.25rem',
                                      fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
                                    }}>
                                      {variable.key}
                                    </code>
                                  </td>
                                  <td style={{ color: '#374151', fontWeight: '500' }}>
                                    {variable.value}
                                  </td>
                                  <td>
                                    <span className={`status-badge ${getSourceBadge(variable.source)}`}>
                                      {variable.source}
                                    </span>
                                  </td>
                                  <td style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                                    {formatTimestamp(variable.timestamp)}
                                  </td>
                                  <td>
                                    <button
                                      className="control-btn danger"
                                      onClick={() => handleDeleteRuntimeVariable(key)}
                                      title="Sil"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="action-btn outline"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
} 