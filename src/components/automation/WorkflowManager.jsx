import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { WorkflowService } from '../../lib/workflow-service'

export default function WorkflowManager({ onClose, onLoadWorkflow }) {
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
      const { workflow: workflowData, steps } = await WorkflowService.loadWorkflow(workflow.id)
      onLoadWorkflow(workflowData, steps)
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
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-folder me-2"></i>
              Workflow Yönetimi
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
                <div className="mt-2">Workflow'lar yükleniyor...</div>
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-folder-x text-muted" style={{fontSize: '3rem'}}></i>
                <h6 className="text-muted mt-3">Henüz workflow bulunamadı</h6>
                <p className="text-muted">İlk workflow'unuzu oluşturun</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Workflow Adı</th>
                      <th>Açıklama</th>
                      <th>Son Güncelleme</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map(workflow => (
                      <tr key={workflow.id}>
                        <td>
                          <div className="fw-medium">{workflow.name}</div>
                        </td>
                        <td>
                          <div className="text-muted small">
                            {workflow.description || 'Açıklama yok'}
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDate(workflow.updated_at)}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleLoadWorkflow(workflow)}
                              title="Yükle"
                            >
                              <i className="bi bi-upload"></i>
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleDuplicateWorkflow(workflow.id)}
                              title="Kopyala"
                            >
                              <i className="bi bi-copy"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteWorkflow(workflow.id)}
                              title="Sil"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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