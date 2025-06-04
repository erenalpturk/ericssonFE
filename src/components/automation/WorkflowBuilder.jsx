import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import ApiStep from './ApiStep'
import WorkflowResults from './WorkflowResults'
import WorkflowManager from './WorkflowManager'
import VariablesManager from './VariablesManager'
import { WorkflowService } from '../../lib/workflow-service'
import { VariablesService } from '../../lib/variables-service'

export default function WorkflowBuilder() {
  const [steps, setSteps] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState([])
  const [globalVariables, setGlobalVariables] = useState({})
  const [staticVariables, setStaticVariables] = useState({})
  const [runtimeVariables, setRuntimeVariables] = useState({})
  
  // Veritabanı işlemleri için state'ler
  const [currentWorkflow, setCurrentWorkflow] = useState(null)
  const [showWorkflowManager, setShowWorkflowManager] = useState(false)
  const [showVariablesManager, setShowVariablesManager] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  // Variables'ları yükle
  useEffect(() => {
    loadVariables()
    VariablesService.cleanupOldRuntimeVariables(24)
  }, [])

  // Global variables'ı güncelle
  useEffect(() => {
    const combined = { ...staticVariables, ...runtimeVariables }
    setGlobalVariables(combined)
  }, [staticVariables, runtimeVariables])

  const loadVariables = async () => {
    try {
      const staticVars = await VariablesService.getStaticVariables()
      setStaticVariables(staticVars)

      const runtimeVars = VariablesService.getRuntimeVariables()
      const runtimeValues = {}
      Object.values(runtimeVars).forEach(variable => {
        runtimeValues[variable.key] = variable.value
      })
      setRuntimeVariables(runtimeValues)

      const combinedVariables = { ...staticVars, ...runtimeValues }
      setGlobalVariables(combinedVariables)
    } catch (error) {
      console.error('Error loading variables:', error)
    }
  }

  const handleVariablesChanged = async () => {
    await loadVariables()
    setTimeout(() => {
      loadVariables()
    }, 100)
  }

  const addStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: `API Adımı ${steps.length + 1}`,
      method: 'GET',
      url: '',
      headers: {},
      body: '',
      variables: {},
      preRequestScript: '',
      postResponseScript: '',
      enabled: true
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (id, updatedStep) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updatedStep } : step
    ))
  }

  const deleteStep = async (id) => {
    try {
      if (currentWorkflow && !id.startsWith('step-')) {
        await WorkflowService.deleteApiStep(id)
      }
      
      setSteps(steps.filter(step => step.id !== id))
      
      if (currentWorkflow) {
        await WorkflowService.updateWorkflow(currentWorkflow.id, { 
          updated_at: new Date().toISOString() 
        })
        toast.success('API adımı silindi')
      }
    } catch (error) {
      console.error('Error deleting step:', error)
      toast.error('API adımı silinirken hata oluştu')
    }
  }

  const moveStep = (id, direction) => {
    const index = steps.findIndex(step => step.id === id)
    if (index === -1) return

    const newSteps = [...steps]
    if (direction === 'up' && index > 0) {
      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]]
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]]
    }
    setSteps(newSteps)
  }

  const replaceVariables = (text, variables) => {
    let result = text
    
    if (text.includes('{{')) {
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        result = result.replace(regex, value)
      })
    }
    
    return result
  }

  const runWorkflow = async () => {
    if (steps.length === 0) {
      toast.error('Çalıştırılacak adım bulunamadı')
      return
    }

    setIsRunning(true)
    setResults([])
    
    const workflowResults = []
    let workflowVariables = { ...globalVariables }

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        
        if (!step.enabled) {
          workflowResults.push({
            stepId: step.id,
            stepName: step.name,
            status: 'pending',
            message: 'Adım devre dışı'
          })
          continue
        }

        const result = await runSingleStep(step, workflowVariables)
        workflowResults.push(result)
        setResults([...workflowResults])

        if (result.status === 'error') {
          toast.error(`Workflow durdu: ${result.error}`)
          break
        }

        if (result.extractedVariables) {
          workflowVariables = { ...workflowVariables, ...result.extractedVariables }
          setGlobalVariables(workflowVariables)
        }
      }

      toast.success('Workflow tamamlandı')
    } catch (error) {
      console.error('Workflow error:', error)
      toast.error('Workflow çalıştırılırken hata oluştu')
    } finally {
      setIsRunning(false)
    }
  }

  const runSingleStep = async (step, variables = {}) => {
    const startTime = Date.now()
    
    try {
      const processedUrl = replaceVariables(step.url, variables)
      const processedBody = replaceVariables(step.body, variables)
      
      const processedHeaders = {}
      Object.entries(step.headers).forEach(([key, value]) => {
        processedHeaders[key] = replaceVariables(value, variables)
      })

      const response = await fetch(processedUrl, {
        method: step.method,
        headers: processedHeaders,
        body: step.method !== 'GET' ? processedBody : undefined,
      })

      const responseData = await response.text()
      let parsedData
      try {
        parsedData = JSON.parse(responseData)
      } catch {
        parsedData = responseData
      }

      const duration = Date.now() - startTime
      const responseHeaders = {}
      for (const [key, value] of response.headers.entries()) {
        responseHeaders[key] = value
      }

      const extractedVariables = {}
      if (step.variables && Object.keys(step.variables).length > 0) {
        Object.entries(step.variables).forEach(([varName, path]) => {
          try {
            if (path.startsWith('response.')) {
              const value = getNestedValue(parsedData, path.replace('response.', ''))
              if (value !== undefined) {
                extractedVariables[varName] = String(value)
                VariablesService.setRuntimeVariable(varName, String(value), 'api')
              }
            }
          } catch (error) {
            console.error(`Error extracting variable ${varName}:`, error)
          }
        })
      }

      return {
        stepId: step.id,
        stepName: step.name,
        status: response.ok ? 'success' : 'error',
        response: parsedData,
        responseHeaders,
        httpStatus: response.status,
        duration,
        extractedVariables,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      }

    } catch (error) {
      const duration = Date.now() - startTime
      
      return {
        stepId: step.id,
        stepName: step.name,
        status: 'error',
        error: error.message,
        duration
      }
    }
  }

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  const stopWorkflow = () => {
    setIsRunning(false)
    toast.success('Workflow durduruldu')
  }

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Workflow adı gerekli')
      return
    }

    try {
      if (currentWorkflow) {
        await WorkflowService.updateWorkflow(currentWorkflow.id, {
          name: workflowName,
          description: workflowDescription
        })
        await WorkflowService.saveWorkflowSteps(currentWorkflow.id, steps)
        toast.success('Workflow güncellendi')
      } else {
        const newWorkflow = await WorkflowService.createWorkflow(workflowName, workflowDescription)
        setCurrentWorkflow(newWorkflow)
        await WorkflowService.saveWorkflowSteps(newWorkflow.id, steps)
        toast.success('Workflow kaydedildi')
      }
    } catch (error) {
      console.error('Save workflow error:', error)
      toast.error('Workflow kaydedilirken hata oluştu')
    } finally {
      setSaveDialogOpen(false)
    }
  }

  const handleLoadWorkflow = (workflow, loadedSteps) => {
    setCurrentWorkflow(workflow)
    setSteps(loadedSteps)
    setWorkflowName(workflow.name)
    setWorkflowDescription(workflow.description || '')
    setShowWorkflowManager(false)
    toast.success(`Workflow yüklendi: ${workflow.name}`)
  }

  const handleCreateNewWorkflow = () => {
    setCurrentWorkflow(null)
    setSteps([])
    setWorkflowName('')
    setWorkflowDescription('')
    setResults([])
    toast.success('Yeni workflow oluşturuldu')
  }

  return (
    <div className="modern-page">
      {/* Hero Section */}
      <div className="hero-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="hero-content">
          <div className="hero-icon">
            <i className="bi bi-cpu-fill"></i>
          </div>
          <h1 className="hero-title">API Otomasyon Aracı</h1>
          <p className="hero-subtitle">Workflow'larınızı oluşturun ve API'lerinizi otomatik olarak test edin</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{steps.length}</span>
              <span className="stat-label">API Adımı</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(globalVariables).length}</span>
              <span className="stat-label">Değişken</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{results.filter(r => r.status === 'success').length}</span>
              <span className="stat-label">Başarılı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        <div className="action-group">
          <button 
            className="action-btn primary"
            onClick={addStep}
            disabled={isRunning}
          >
            <i className="bi bi-plus-lg"></i>
            <span>API Adımı Ekle</span>
          </button>
          
          {steps.length > 0 && (
            <button 
              className={`action-btn ${isRunning ? 'danger' : 'success'}`}
              onClick={isRunning ? stopWorkflow : runWorkflow}
            >
              <i className={`bi ${isRunning ? 'bi-stop-fill' : 'bi-play-fill'}`}></i>
              <span>{isRunning ? 'Durdur' : 'Workflow Çalıştır'}</span>
            </button>
          )}
        </div>

        <div className="action-group">
          <button 
            className="action-btn secondary"
            onClick={() => setShowVariablesManager(true)}
          >
            <i className="bi bi-gear-fill"></i>
            <span>Değişkenler</span>
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={() => setShowWorkflowManager(true)}
          >
            <i className="bi bi-folder-fill"></i>
            <span>Workflow Yönetimi</span>
          </button>
          
          <button 
            className="action-btn outline"
            onClick={() => setSaveDialogOpen(true)}
            disabled={steps.length === 0}
          >
            <i className="bi bi-save-fill"></i>
            <span>{currentWorkflow ? 'Güncelle' : 'Kaydet'}</span>
          </button>
          
          <button 
            className="action-btn outline"
            onClick={handleCreateNewWorkflow}
          >
            <i className="bi bi-plus-square-fill"></i>
            <span>Yeni</span>
          </button>
        </div>
      </div>

      {/* Current Workflow Info */}
      {currentWorkflow && (
        <div className="workflow-info">
          <div className="info-card">
            <div className="info-icon">
              <i className="bi bi-folder-check text-blue-500"></i>
            </div>
            <div className="info-content">
              <h3>{currentWorkflow.name}</h3>
              <p>{currentWorkflow.description || 'Açıklama yok'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="tools-section">
        {steps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-arrow-down-circle"></i>
            </div>
            <h3>Henüz API adımı eklenmedi</h3>
            <p>Workflow'unuzu oluşturmaya başlamak için yukarıdan "API Adımı Ekle" butonuna tıklayın</p>
            <button 
              className="action-btn primary"
              onClick={addStep}
            >
              <i className="bi bi-plus-lg"></i>
              <span>İlk Adımı Ekle</span>
            </button>
          </div>
        ) : (
          <div className="workflow-container">
            {/* Steps Column */}
            <div className="steps-column">
              <div className="section-header">
                <h2>API Adımları ({steps.length})</h2>
                <p>Workflow'unuzun adımlarını burada yönetin</p>
              </div>
              
              <div className="steps-list">
                {steps.map((step, index) => (
                  <ApiStep
                    key={step.id}
                    step={step}
                    index={index}
                    onUpdate={(updatedStep) => updateStep(step.id, updatedStep)}
                    onDelete={() => deleteStep(step.id)}
                    onMoveUp={() => moveStep(step.id, 'up')}
                    onMoveDown={() => moveStep(step.id, 'down')}
                    canMoveUp={index > 0}
                    canMoveDown={index < steps.length - 1}
                    variables={globalVariables}
                    isRunning={isRunning}
                  />
                ))}
              </div>
            </div>

            {/* Results Column */}
            <div className="results-column">
              {results.length > 0 && (
                <WorkflowResults results={results} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showWorkflowManager && (
        <WorkflowManager
          onClose={() => setShowWorkflowManager(false)}
          onLoadWorkflow={handleLoadWorkflow}
        />
      )}

      {showVariablesManager && (
        <VariablesManager
          onClose={() => setShowVariablesManager(false)}
          onVariablesChanged={handleVariablesChanged}
        />
      )}

      {/* Save Dialog */}
      {saveDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentWorkflow ? 'Workflow Güncelle' : 'Workflow Kaydet'}</h3>
              <button 
                className="modal-close"
                onClick={() => setSaveDialogOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Workflow Adı *</label>
                <input 
                  type="text"
                  className="form-input"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Workflow adını girin"
                />
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea 
                  className="form-input"
                  rows="3"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Workflow açıklaması (opsiyonel)"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="action-btn outline"
                onClick={() => setSaveDialogOpen(false)}
              >
                İptal
              </button>
              <button 
                className="action-btn primary"
                onClick={handleSaveWorkflow}
              >
                {currentWorkflow ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 