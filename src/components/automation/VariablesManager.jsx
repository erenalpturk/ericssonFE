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
      api: 'bg-success',
      script: 'bg-warning', 
      manual: 'bg-info'
    }
    return badges[source] || 'bg-secondary'
  }

  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-gear me-2"></i>
              Değişken Yönetimi
            </h5>
            <button 
              type="button" 
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Yükleniyor...</span>
                </div>
                <div className="mt-2">Değişkenler yükleniyor...</div>
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'static' ? 'active' : ''}`}
                      onClick={() => setActiveTab('static')}
                    >
                      Static Değişkenler ({staticVariables.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'runtime' ? 'active' : ''}`}
                      onClick={() => setActiveTab('runtime')}
                    >
                      Runtime Değişkenler ({Object.keys(runtimeVariables).length})
                    </button>
                  </li>
                </ul>

                {/* Static Variables Tab */}
                {activeTab === 'static' && (
                  <div>
                    <div className="row mb-3">
                      <div className="col-12">
                        <div className="card">
                          <div className="card-header">
                            <h6 className="mb-0">Yeni Static Değişken Ekle</h6>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Anahtar"
                                  value={newVarKey}
                                  onChange={(e) => setNewVarKey(e.target.value)}
                                />
                              </div>
                              <div className="col-md-4">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Değer"
                                  value={newVarValue}
                                  onChange={(e) => setNewVarValue(e.target.value)}
                                />
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Açıklama (opsiyonel)"
                                  value={newVarDescription}
                                  onChange={(e) => setNewVarDescription(e.target.value)}
                                />
                              </div>
                              <div className="col-md-2">
                                <button
                                  className="btn btn-primary w-100"
                                  onClick={handleAddStaticVariable}
                                >
                                  Ekle
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {staticVariables.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-code-square text-muted" style={{fontSize: '3rem'}}></i>
                        <h6 className="text-muted mt-3">Henüz static değişken bulunamadı</h6>
                        <p className="text-muted">İlk static değişkeninizi yukarıdan ekleyin</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Anahtar</th>
                              <th>Değer</th>
                              <th>Açıklama</th>
                              <th>Son Güncelleme</th>
                              <th>İşlemler</th>
                            </tr>
                          </thead>
                          <tbody>
                            {staticVariables.map(variable => (
                              <tr key={variable.id}>
                                <td>
                                  <code className="text-primary">{variable.key}</code>
                                </td>
                                <td>
                                  <span className="text-muted">{variable.value}</span>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {variable.description || '-'}
                                  </small>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {formatTimestamp(variable.updated_at)}
                                  </small>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
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
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6>Runtime Değişkenler</h6>
                        <small className="text-muted">
                          Bu değişkenler API çağrıları sırasında otomatik olarak oluşturulur
                        </small>
                      </div>
                      {Object.keys(runtimeVariables).length > 0 && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={handleClearRuntimeVariables}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Tümünü Temizle
                        </button>
                      )}
                    </div>

                    {Object.keys(runtimeVariables).length === 0 ? (
                      <div className="text-center py-4">
                        <i className="bi bi-clock text-muted" style={{fontSize: '3rem'}}></i>
                        <h6 className="text-muted mt-3">Henüz runtime değişken bulunamadı</h6>
                        <p className="text-muted">
                          API workflow'ları çalıştırıldığında runtime değişkenler burada görünecek
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Anahtar</th>
                              <th>Değer</th>
                              <th>Kaynak</th>
                              <th>Oluşturulma</th>
                              <th>İşlemler</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(runtimeVariables).map(([key, variable]) => (
                              <tr key={key}>
                                <td>
                                  <code className="text-success">{variable.key}</code>
                                </td>
                                <td>
                                  <span className="text-muted">{variable.value}</span>
                                </td>
                                <td>
                                  <span className={`badge ${getSourceBadge(variable.source)}`}>
                                    {variable.source}
                                  </span>
                                </td>
                                <td>
                                  <small className="text-muted">
                                    {formatTimestamp(variable.timestamp)}
                                  </small>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
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
            )}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 