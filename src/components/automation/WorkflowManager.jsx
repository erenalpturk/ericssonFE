import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { WorkflowService } from '../../lib/workflow-service'

export default function WorkflowManager({ onClose, onLoadWorkflow, user }) {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      const data = await WorkflowService.getAllWorkflows()
      setWorkflows(data)
    } catch (error) {
      console.error('Error loading workflows:', error)
      toast.error('Workflow\'lar yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadWorkflow = async (workflow) => {
    try {
      console.log('[WorkflowManager] Loading workflow:', workflow.name)
      const { workflow: workflowData, steps } = await WorkflowService.loadWorkflow(workflow.id)
      console.log('[WorkflowManager] Workflow loaded, calling onLoadWorkflow callback...')
      await onLoadWorkflow(workflowData, steps)
      console.log('[WorkflowManager] Workflow loading completed')
    } catch (error) {
      console.error('Error loading workflow:', error)
      toast.error('Workflow yüklenirken hata oluştu')
    }
  }

  const handleDeleteWorkflow = async (workflowId) => {
    if (!confirm('Bu workflow\'u silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      await WorkflowService.deleteWorkflow(workflowId)
      toast.success('Workflow silindi')
      loadWorkflows() // Listeyi yenile
    } catch (error) {
      console.error('Error deleting workflow:', error)
      toast.error('Workflow silinirken hata oluştu')
    }
  }

  const handleDuplicateWorkflow = async (workflowId) => {
    try {
      await WorkflowService.duplicateWorkflow(workflowId)
      toast.success('Workflow kopyalandı')
      loadWorkflows() // Listeyi yenile
    } catch (error) {
      console.error('Error duplicating workflow:', error)
      toast.error('Workflow kopyalanırken hata oluştu')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR')
  }

  return (
    <div className="modal-overlay workflow-manager-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <i className="bi bi-folder-fill"></i>
            Workflow Yönetimi
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
            <div className="empty-state small">
              <div className="empty-icon">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <h3>Yükleniyor...</h3>
              <p>Workflow'lar yükleniyor</p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="empty-state small">
              <div className="empty-icon">
                <i className="bi bi-folder-x"></i>
              </div>
              <h3>Henüz workflow bulunamadı</h3>
              <p>İlk workflow'unuzu oluşturun</p>
            </div>
          ) : (
            <div>
              <div className="section-header">
                <div>
                  <h4>Kayıtlı Workflow'lar</h4>
                  <p>Workflow'larınızı yükleyin, kopyalayın veya silin</p>
                </div>
                <div className="stats-badge">
                  <i className="bi bi-folder"></i>
                  {workflows.length} Workflow
                </div>
              </div>

              <div className="workflow-list">
                {workflows.map(workflow => (
                  <div key={workflow.id} className="workflow-card">
                    <div className="workflow-card-header">
                      <div className="workflow-card-title">
                        <div className="workflow-icon">
                          <i className="bi bi-gear-wide-connected"></i>
                        </div>
                        <div className="workflow-name">
                          {workflow.name}
                        </div>
                      </div>
                      <div className="workflow-actions">
                        <button
                          className="workflow-action-btn load"
                          onClick={() => handleLoadWorkflow(workflow)}
                          title="Yükle"
                        >
                          <i className="bi bi-upload"></i>
                        </button>
                        <button
                          className="workflow-action-btn copy"
                          onClick={() => handleDuplicateWorkflow(workflow.id)}
                          title="Kopyala"
                          disabled={user.role !== 'admin'}
                        >
                          <i className="bi bi-copy"></i>
                        </button>
                        {user.role === 'admin' && ( 
                        <button
                          className="workflow-action-btn delete"
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          title="Sil"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        )}
                      </div>
                    </div>
                    <div className="workflow-card-body">
                      <div className="workflow-info">
                        <div className="workflow-description">
                          {workflow.description || 'Açıklama yok'}
                        </div>
                        <div className="workflow-date">
                          <i className="bi bi-clock"></i>
                          {formatDate(workflow.updated_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <style jsx>{`
                .workflow-list {
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                }

                .workflow-card {
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  overflow: hidden;
                }

                .workflow-card-header {
                  padding: 1rem;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 1px solid #eee;
                }

                .workflow-card-title {
                  display: flex;
                  align-items: center;
                  gap: 0.75rem;
                }

                .workflow-card-body {
                  padding: 1rem;
                }

                .workflow-info {
                  display: flex;
                  flex-direction: column;
                  gap: 0.5rem;
                }

                .workflow-description {
                  color: #666;
                  font-size: 0.9rem;
                }

                .workflow-date {
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                  color: #888;
                  font-size: 0.85rem;
                }

                .workflow-actions {
                  display: flex;
                  gap: 0.5rem;
                }

                .workflow-action-btn {
                  padding: 0.5rem;
                  border: none;
                  border-radius: 4px;
                  background: transparent;
                  cursor: pointer;
                  transition: all 0.2s;
                }

                .workflow-action-btn:hover {
                  background: #f5f5f5;
                }

                .workflow-action-btn.load {
                  color: #2196f3;
                }

                .workflow-action-btn.copy {
                  color: #4caf50;
                }

                .workflow-action-btn.delete {
                  color: #f44336;
                }

                .workflow-action-btn:disabled {
                  opacity: 0.5;
                  cursor: not-allowed;
                }

                @media (min-width: 768px) {
                  .workflow-list {
                    display: none;
                  }

                  .table-container {
                    display: block;
                  }
                }

                @media (max-width: 767px) {
                  .table-container {
                    display: none;
                  }

                  .workflow-list {
                    display: flex;
                  }

                  .modal-content {
                    width: 95%;
                    max-width: 95%;
                    margin: 1rem;
                  }
                }
              `}</style>

              <div className="table-container">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Workflow Adı</th>
                      <th style={{ width: '300px' }}>Açıklama</th>
                      <th style={{ width: '180px' }}>Son Güncelleme</th>
                      <th style={{ width: '150px' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map(workflow => (
                      <tr key={workflow.id}>
                        <td>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem' 
                          }}>
                            <div className="workflow-icon">
                              <i className="bi bi-gear-wide-connected"></i>
                            </div>
                            <div>
                              <div className="workflow-name">
                                {workflow.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={workflow.description ? 'workflow-description' : 'workflow-description'}>
                            {workflow.description || 'Açıklama yok'}
                          </span>
                        </td>
                        <td>
                          <span className="workflow-date">
                            {formatDate(workflow.updated_at)}
                          </span>
                        </td>
                        <td>
                          <div className="workflow-actions">
                            <button
                              className="workflow-action-btn load"
                              onClick={() => handleLoadWorkflow(workflow)}
                              title="Yükle"
                            >
                              <i className="bi bi-upload"></i>
                            </button>
                            <button
                              className="workflow-action-btn copy"
                              onClick={() => handleDuplicateWorkflow(workflow.id)}
                              title="Kopyala"
                              disabled={user.role !== 'admin'}
                            >
                              <i className="bi bi-copy"></i>
                            </button>
                            {user.role === 'admin' && ( 
                            <button
                              className="workflow-action-btn delete"
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                              title="Sil"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="action-btn outline"
            onClick={onClose}
          >
            <i className="bi bi-x-circle"></i>
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
} 