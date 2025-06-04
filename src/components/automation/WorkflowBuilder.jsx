import React, { useState, useEffect, useCallback } from 'react'
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
    console.log('[WorkflowBuilder] Component mounted, loading variables...')
    loadVariables()
    VariablesService.cleanupOldRuntimeVariables(24)
  }, [])

  // Component focus aldığında variables'ları yenile
  useEffect(() => {
    const handleFocus = () => {
      console.log('[WorkflowBuilder] Window focused, refreshing variables...')
      loadVariables()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('[WorkflowBuilder] Page visible, refreshing variables...')
        loadVariables()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Global variables'ı güncelle
  useEffect(() => {
    const combined = { ...staticVariables, ...runtimeVariables }
    setGlobalVariables(combined)
    console.log('[WorkflowBuilder] Updated global variables:', combined)
  }, [staticVariables, runtimeVariables])

  const loadVariables = async () => {
    try {
      console.log('[WorkflowBuilder] Loading static variables...')
      const staticVars = await VariablesService.getStaticVariables()
      console.log('[WorkflowBuilder] Static variables loaded:', staticVars)
      setStaticVariables(staticVars)

      console.log('[WorkflowBuilder] Loading runtime variables...')
      const runtimeVars = VariablesService.getRuntimeVariables()
      const runtimeValues = {}
      Object.values(runtimeVars).forEach(variable => {
        runtimeValues[variable.key] = variable.value
      })
      console.log('[WorkflowBuilder] Runtime variables loaded:', runtimeValues)
      setRuntimeVariables(runtimeValues)

      const combinedVariables = { ...staticVars, ...runtimeValues }
      console.log('[WorkflowBuilder] Combined variables:', combinedVariables)
      setGlobalVariables(combinedVariables)
    } catch (error) {
      console.error('[WorkflowBuilder] Error loading variables:', error)
      // Hata durumunda boş objeler set et
      setStaticVariables({})
      setRuntimeVariables({})
      setGlobalVariables({})
    }
  }

  const handleVariablesChanged = async () => {
    console.log('[WorkflowBuilder] Variables changed, refreshing...')
    await loadVariables()
    setTimeout(async () => {
      console.log('[WorkflowBuilder] Secondary variables refresh...')
      await loadVariables()
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
    const newSteps = [...steps, newStep]
    setSteps(newSteps)
    
    // Mevcut workflow varsa otomatik kaydet
    if (currentWorkflow) {
      autoSaveWorkflow(newSteps)
    }
  }

  const updateStep = (id, updatedStep) => {
    const newSteps = steps.map(step => 
      step.id === id ? { ...step, ...updatedStep } : step
    )
    setSteps(newSteps)
    
    // Mevcut workflow varsa otomatik kaydet (debounced)
    if (currentWorkflow) {
      debouncedAutoSave(newSteps)
    }
  }

  const deleteStep = async (id) => {
    try {
      if (currentWorkflow && !id.startsWith('step-')) {
        await WorkflowService.deleteApiStep(id)
      }
      
      const newSteps = steps.filter(step => step.id !== id)
      setSteps(newSteps)
      
      if (currentWorkflow) {
        await autoSaveWorkflow(newSteps)
        toast.success('API adımı silindi')
      }
    } catch (error) {
      console.error('Error deleting step:', error)
      toast.error('API adımı silinirken hata oluştu')
    }
  }

  // Otomatik kaydetme fonksiyonu
  const autoSaveWorkflow = async (stepsToSave = steps) => {
    if (!currentWorkflow) return
    
    try {
      console.log('[WorkflowBuilder] Auto-saving workflow:', currentWorkflow.id)
      await WorkflowService.saveWorkflowSteps(currentWorkflow.id, stepsToSave)
      
      // Gerçek UUID'leri almak için step'leri yeniden yükle
      const freshSteps = await WorkflowService.getWorkflowSteps(currentWorkflow.id)
      setSteps(freshSteps)
      
      console.log('[WorkflowBuilder] Auto-save completed, refreshed steps')
    } catch (error) {
      console.error('[WorkflowBuilder] Auto-save failed:', error)
      // Otomatik kaydetme hatalarını sessizce logla, kullanıcıyı rahatsız etme
    }
  }

  // Debounced auto-save (sık güncellemeler için)
  const debouncedAutoSave = useCallback(
    debounce((stepsToSave) => {
      autoSaveWorkflow(stepsToSave)
    }, 2000), // 2 saniye gecikme
    [currentWorkflow]
  )

  // Debounce utility function
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
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
    if (!text || typeof text !== 'string') return text
    
    let result = text
    
    if (text.includes('{{')) {
      console.log('[WorkflowBuilder] Replacing variables in:', text)
      console.log('[WorkflowBuilder] Available variables:', variables)
      
      Object.entries(variables || {}).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        const oldResult = result
        result = result.replace(regex, value || '')
        
        if (oldResult !== result) {
          console.log(`[WorkflowBuilder] Replaced {{${key}}} with "${value}" in: ${oldResult} -> ${result}`)
        }
      })
      
      // Eğer hala {{ }} varsa, bunları logla
      const remainingVariables = result.match(/\{\{[^}]+\}\}/g)
      if (remainingVariables) {
        console.warn('[WorkflowBuilder] Unreplaced variables found:', remainingVariables)
        console.warn('[WorkflowBuilder] Available variable keys:', Object.keys(variables || {}))
      }
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
    
    console.log('[WorkflowBuilder] === Starting Workflow ===')
    console.log('[WorkflowBuilder] Available global variables:', globalVariables)
    console.log('[WorkflowBuilder] Static variables:', staticVariables)
    console.log('[WorkflowBuilder] Runtime variables:', runtimeVariables)
    
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

        console.log(`[WorkflowBuilder] Step ${i + 1}: Using variables:`, workflowVariables)
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
          console.log('[WorkflowBuilder] Updated variables after step:', workflowVariables)
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
    
    console.log(`[WorkflowBuilder] === Running Step: ${step.name} ===`)
    console.log('[WorkflowBuilder] Step URL:', step.url)
    console.log('[WorkflowBuilder] Available variables for this step:', variables)
    console.log('[WorkflowBuilder] Global variables:', globalVariables)
    
    try {
      const processedUrl = replaceVariables(step.url, variables)
      const processedBody = replaceVariables(step.body, variables)
      
      console.log('[WorkflowBuilder] Processed URL:', processedUrl)
      
      const processedHeaders = {}
      Object.entries(step.headers || {}).forEach(([key, value]) => {
        processedHeaders[key] = replaceVariables(value, variables)
      })

      // Content-Type yoksa default olarak application/json ekle
      const hasContentType = Object.keys(processedHeaders).some(
        key => key.toLowerCase() === 'content-type'
      )
      
      if (!hasContentType && step.method !== 'GET') {
        processedHeaders['Content-Type'] = 'application/json'
        console.log('[WorkflowBuilder] Added default Content-Type: application/json')
      }

      // Execute pre-request script
      let requestVariables = variables
      let finalRequest = {
        url: processedUrl,
        headers: processedHeaders,
        body: processedBody
      }

      if (step.preRequestScript?.trim()) {
        try {
          console.log('[WorkflowBuilder] Executing pre-request script...')
          const preRequestResult = executePreRequestScript(step.preRequestScript, requestVariables, finalRequest)
          requestVariables = preRequestResult.variables
          finalRequest = preRequestResult.request
          console.log('[WorkflowBuilder] Pre-request script executed successfully')
        } catch (error) {
          console.warn('[WorkflowBuilder] Pre-request script failed:', error)
          // Continue with original request if script fails
        }
      }

      const response = await fetch(finalRequest.url, {
        method: step.method,
        headers: finalRequest.headers,
        body: step.method !== 'GET' ? finalRequest.body : undefined,
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

      // Execute post-response script
      let finalVariables = requestVariables
      if (step.postResponseScript?.trim()) {
        try {
          console.log('[WorkflowBuilder] Executing post-response script...')
          finalVariables = executePostResponseScript(
            step.postResponseScript, 
            requestVariables, 
            parsedData, 
            responseHeaders, 
            response.status
          )
          console.log('[WorkflowBuilder] Post-response script executed successfully')
        } catch (error) {
          console.warn('[WorkflowBuilder] Post-response script failed:', error)
          // Post-response script errors can be more critical
          return {
            stepId: step.id,
            stepName: step.name,
            status: 'error',
            error: `Post-response script error: ${error.message}`,
            duration
          }
        }
      }

      // Extract variables (existing logic)
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

      // Combine script variables with extracted variables
      const allExtractedVariables = { ...extractedVariables }
      Object.keys(finalVariables).forEach(key => {
        if (finalVariables[key] !== variables[key]) {
          allExtractedVariables[key] = finalVariables[key]
        }
      })

      return {
        stepId: step.id,
        stepName: step.name,
        status: response.ok ? 'success' : 'error',
        response: parsedData,
        responseHeaders,
        httpStatus: response.status,
        duration,
        extractedVariables: allExtractedVariables,
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

  // Pre-request script execution
  const executePreRequestScript = (script, variables, request) => {
    if (!script?.trim()) return { variables, request }

    try {
      // Mutable copies
      const mutableVariables = { ...variables }
      const mutableRequest = { 
        url: request.url,
        headers: { ...request.headers },
        body: request.body 
      }
      
      const scriptContext = {
        // Safe JavaScript operations
        console: {
          log: (...args) => console.log('[Pre-request Script]:', ...args)
        },
        Date: Date,
        Math: Math,
        JSON: JSON,
        String: String,
        Number: Number,
        parseInt: parseInt,
        parseFloat: parseFloat
      }

      // Execute script with direct parameters
      const scriptFunction = new Function('variables', 'request', 'console', 'Date', 'Math', 'JSON', 'String', 'Number', 'parseInt', 'parseFloat', `
        ${script}
        return { variables, request };
      `)

      return scriptFunction(
        mutableVariables,
        mutableRequest,
        scriptContext.console,
        scriptContext.Date,
        scriptContext.Math,
        scriptContext.JSON,
        scriptContext.String,
        scriptContext.Number,
        scriptContext.parseInt,
        scriptContext.parseFloat
      )
    } catch (error) {
      console.warn('Pre-request script execution failed:', error)
      return { variables, request }
    }
  }

  // Post-response script execution
  const executePostResponseScript = (script, variables, response, responseHeaders, httpStatus) => {
    if (!script?.trim()) return variables

    try {
      // Mutable variables copy
      const mutableVariables = { ...variables }
      
      const scriptContext = {
        response: {
          data: response,
          headers: responseHeaders,
          status: httpStatus
        },
        // Safe JavaScript operations
        console: {
          log: (...args) => console.log('[Post-response Script]:', ...args)
        },
        Date: Date,
        Math: Math,
        JSON: JSON,
        String: String,
        Number: Number,
        parseInt: parseInt,
        parseFloat: parseFloat
      }

      // Execute script with variables object
      const scriptFunction = new Function('variables', 'response', 'console', 'Date', 'Math', 'JSON', 'String', 'Number', 'parseInt', 'parseFloat', `
        ${script}
        return variables;
      `)

      const resultVariables = scriptFunction(
        mutableVariables,
        scriptContext.response,
        scriptContext.console,
        scriptContext.Date,
        scriptContext.Math,
        scriptContext.JSON,
        scriptContext.String,
        scriptContext.Number,
        scriptContext.parseInt,
        scriptContext.parseFloat
      )

      // Save new variables from script as runtime variables
      Object.keys(resultVariables).forEach(key => {
        if (resultVariables[key] !== variables[key]) {
          // If there's a change, save as runtime variable
          VariablesService.setRuntimeVariable(key, resultVariables[key], 'script')
        }
      })

      return resultVariables
    } catch (error) {
      console.warn('Post-response script execution failed:', error)
      throw error // Post-response script errors can stop workflow
    }
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

    // Loading toast
    const loadingToastId = toast.loading('Workflow kaydediliyor...')

    try {
      // Step validasyonu
      const invalidSteps = steps.filter(step => 
        !step.method || 
        !step.url?.trim() || 
        !step.name?.trim()
      )

      if (invalidSteps.length > 0) {
        toast.dismiss(loadingToastId)
        toast.error(`${invalidSteps.length} adım eksik bilgi içeriyor. Lütfen tüm alanları doldurun.`)
        return
      }

      if (currentWorkflow) {
        // Mevcut workflow'u güncelle
        console.log('[WorkflowBuilder] Updating existing workflow:', currentWorkflow.id)
        console.log('[WorkflowBuilder] Steps to save:', steps.length, steps.map(s => ({ id: s.id, name: s.name })))
        
        await WorkflowService.updateWorkflow(currentWorkflow.id, {
          name: workflowName,
          description: workflowDescription
        })
        await WorkflowService.saveWorkflowSteps(currentWorkflow.id, steps)
        
        // Step'leri veritabanından yeniden yükle - gerçek UUID'leri al
        console.log('[WorkflowBuilder] Reloading steps to get actual UUIDs...')
        const freshSteps = await WorkflowService.getWorkflowSteps(currentWorkflow.id)
        setSteps(freshSteps)
        
        toast.dismiss(loadingToastId)
        toast.success('Workflow başarıyla güncellendi!')
      } else {
        // Yeni workflow oluştur
        console.log('[WorkflowBuilder] Creating new workflow:', workflowName)
        console.log('[WorkflowBuilder] Steps to save:', steps.length)
        
        const newWorkflow = await WorkflowService.createWorkflow(workflowName, workflowDescription)
        console.log('[WorkflowBuilder] Created workflow:', newWorkflow.id)
        
        await WorkflowService.saveWorkflowSteps(newWorkflow.id, steps)
        
        // Step'leri veritabanından yükle - gerçek UUID'leri al
        console.log('[WorkflowBuilder] Loading saved steps with actual UUIDs...')
        const savedSteps = await WorkflowService.getWorkflowSteps(newWorkflow.id)
        setSteps(savedSteps)
        
        setCurrentWorkflow(newWorkflow)
        toast.dismiss(loadingToastId)
        toast.success(`Workflow "${workflowName}" oluşturuldu ve kaydedildi!`)
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.error('[WorkflowBuilder] ❌ Error saving workflow:', error)
      
      // Hata tipine göre daha detaylı mesaj
      let errorMessage = 'Workflow kaydedilirken bilinmeyen bir hata oluştu'
      
      if (error?.code === '23502') {
        errorMessage = 'Veri doğrulama hatası: Eksik bilgi tespit edildi. Lütfen tüm alanları kontrol edin.'
      } else if (error?.code === '23505') {
        errorMessage = 'Bu workflow adı zaten kullanımda. Farklı bir ad seçin.'
      } else if (error?.message?.includes('violates not-null constraint')) {
        errorMessage = 'Veri bütünlüğü hatası: Zorunlu alanlar eksik. Lütfen sayfayı yenileyin ve tekrar deneyin.'
      } else if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
        errorMessage = 'Bağlantı hatası: Lütfen internet bağlantınızı kontrol edin.'
      } else if (error?.message?.includes('duplicate') || error?.code === '23505') {
        errorMessage = 'Bu workflow adı zaten kullanımda. Farklı bir ad seçin.'
      } else if (error?.message) {
        errorMessage = `Hata: ${error.message}`
      }
      
      toast.error(errorMessage)
      
      // Development ortamında daha detaylı log
      console.error('[WorkflowBuilder] Error details:', {
        error,
        steps: steps.map(s => ({ id: s.id, name: s.name, method: s.method, url: s.url })),
        currentWorkflow: currentWorkflow?.id
      })
    } finally {
      setSaveDialogOpen(false)
    }
  }

  const handleLoadWorkflow = async (workflow, loadedSteps) => {
    console.log('[WorkflowBuilder] Loading workflow:', workflow.name)
    setCurrentWorkflow(workflow)
    setSteps(loadedSteps)
    setWorkflowName(workflow.name)
    setWorkflowDescription(workflow.description || '')
    setResults([])
    setGlobalVariables({})
    setShowWorkflowManager(false)
    
    // Workflow yüklendiğinde variables'ları yenile
    console.log('[WorkflowBuilder] Refreshing variables after workflow load...')
    await loadVariables()
    
    toast.success(`Workflow yüklendi: ${workflow.name}`)
  }

  const handleCreateNewWorkflow = () => {
    // Mevcut workspace'i temizle
    console.log('[WorkflowBuilder] Creating new workflow - clearing current workspace')
    setCurrentWorkflow(null)
    setSteps([])
    setWorkflowName('')
    setWorkflowDescription('')
    setResults([])
    setGlobalVariables({})
    setSaveDialogOpen(false)
    toast.success('Yeni workflow oluşturuldu')
  }

  // Hızlı kaydetme fonksiyonu (mevcut workflow için)
  const quickSave = async () => {
    if (!currentWorkflow) {
      setSaveDialogOpen(true)
      return
    }

    const loadingToastId = toast.loading('Kaydet ediliyor...')
    
    try {
      await WorkflowService.saveWorkflowSteps(currentWorkflow.id, steps)
      
      // Step'leri yeniden yükle
      const freshSteps = await WorkflowService.getWorkflowSteps(currentWorkflow.id)
      setSteps(freshSteps)
      
      toast.dismiss(loadingToastId)
      toast.success('Workflow kaydedildi!')
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.error('[WorkflowBuilder] Quick save failed:', error)
      toast.error('Kaydetme sırasında hata oluştu')
    }
  }

  return (
    <div className="modern-page">
  

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
            onClick={loadVariables}
            title="Değişkenleri yenile"
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span>Yenile</span>
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
            onClick={quickSave}
            disabled={steps.length === 0}
          >
            <i className="bi bi-save-fill"></i>
            <span>{currentWorkflow ? 'Hızlı Kaydet' : 'Kaydet'}</span>
          </button>
          
          <button 
            className="action-btn outline"
            onClick={() => setSaveDialogOpen(true)}
            disabled={steps.length === 0}
          >
            <i className="bi bi-save2-fill"></i>
            <span>{currentWorkflow ? 'Farklı Kaydet' : 'Kaydet'}</span>
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
              <i className="bi bi-plus-circle"></i>
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
                <h2>
                  <i className="bi bi-list-check"></i>
                  API Adımları ({steps.length})
                </h2>
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