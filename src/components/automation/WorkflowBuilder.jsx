import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import ApiStep from './ApiStep'
import WorkflowResults from './WorkflowResults'
import WorkflowManager from './WorkflowManager'
import VariablesManager from './VariablesManager'
import StaticVariables from './StaticVariables'
import { WorkflowService } from '../../lib/workflow-service'
import { VariablesService } from '../../lib/variables-service'
import { useAuth } from '../../contexts/AuthContext'

export default function WorkflowBuilder() {
  const { user, setIsWorkflowRunning, isWorkflowRunning } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [steps, setSteps] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState([])
  const [globalVariables, setGlobalVariables] = useState({})
  const [staticVariables, setStaticVariables] = useState({})
  const [runtimeVariables, setRuntimeVariables] = useState({})
  const [fullRuntimeVariables, setFullRuntimeVariables] = useState({}) // Yeni state

  // Veritabanı işlemleri için state'ler
  const [currentWorkflow, setCurrentWorkflow] = useState(null)
  const [showWorkflowManager, setShowWorkflowManager] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showVariablesManager, setShowVariablesManager] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const [workflowDescription, setWorkflowDescription] = useState('')

  // Dropdown state'leri
  const [showToolsDropdown, setShowToolsDropdown] = useState(false)
  const [showSaveDropdown, setShowSaveDropdown] = useState(false)
  const [availableWorkflows, setAvailableWorkflows] = useState([])
  const [showWorkflowDropdown, setShowWorkflowDropdown] = useState(false)

  // AbortController for cancelling workflow
  const [abortController, setAbortController] = useState(null)

  // Tekrar sayısı state'leri
  const [repeatCount, setRepeatCount] = useState(1)
  const [currentRun, setCurrentRun] = useState(0)
  const [isRepeating, setIsRepeating] = useState(false)

  // LocalStorage bilgileri state'i - artık array olacak her run için
  const [localStorageData, setLocalStorageData] = useState([])
  const [runResults, setRunResults] = useState([])

  // Variables'ları yükle
  useEffect(() => {
    console.log('[WorkflowBuilder] Component mounted, loading variables...')
    loadVariables()
    VariablesService.cleanupOldRuntimeVariables(24)
    loadAvailableWorkflows() // Workflow'ları yükle
    
    // Component mount olduğunda localStorage verilerini yükleme - sadece otomasyon sonrası
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

    // Runtime değişkenler değiştiğinde yenile
    const handleRuntimeVariablesChanged = () => {
      console.log('[WorkflowBuilder] Runtime variables changed, refreshing...')
      loadVariables()
    }

    // Sayfa yenilendiğinde isWorkflowRunning kontrolü
    const handleBeforeUnload = (e) => {
      if (isWorkflowRunning) {
        e.preventDefault()
        e.returnValue = 'Dikkat! Aktif bir iş akışı çalışıyor. Sayfadan ayrılırsanız işleminiz sonlanacaktır. Devam etmek istiyor musunuz?'
        return e.returnValue
      }
    }

    // Dropdown'ları kapatmak için global click listener
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setShowToolsDropdown(false)
        setShowSaveDropdown(false)
        setShowWorkflowDropdown(false)
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('runtimeVariablesChanged', handleRuntimeVariablesChanged)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('runtimeVariablesChanged', handleRuntimeVariablesChanged)
    }
  }, [isWorkflowRunning]) // isWorkflowRunning'i dependency olarak ekledik

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
      setFullRuntimeVariables(runtimeVars) // Yeni state'i doldur
      const runtimeValues = {}
      Object.values(runtimeVars).forEach(variable => {
        // Sadece silinmemiş değişkenleri al
        if (!variable.deleted) {
          runtimeValues[variable.key] = variable.value
        }
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
    await loadAvailableWorkflows() // Workflow'ları da yenile
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

    // Otomatik kaydetme kapatıldı
    // if (currentWorkflow) {
    //   autoSaveWorkflow(newSteps)
    // }
  }

  const updateStep = (id, updatedStep) => {
    const newSteps = steps.map(step =>
      step.id === id ? { ...step, ...updatedStep } : step
    )
    setSteps(newSteps)

    // Otomatik kaydetme kapatıldı
    // if (currentWorkflow) {
    //   debouncedAutoSave(newSteps)
    // }
  }

  const deleteStep = async (id) => {
    try {
      if (currentWorkflow && !id.startsWith('step-')) {
        await WorkflowService.deleteApiStep(id)
      }

      const newSteps = steps.filter(step => step.id !== id)
      setSteps(newSteps)

      // Otomatik kaydetme kapatıldı
      // if (currentWorkflow) {
      //   await autoSaveWorkflow(newSteps)
      //   toast.success('API adımı silindi')
      // }

      toast.success('API adımı silindi')
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
    console.log('[WorkflowBuilder] runWorkflow called with repeatCount:', repeatCount)
    
    if (steps.length === 0) {
      toast.error('Çalıştırılacak adım bulunamadı')
      return
    }

    // Create new AbortController for this workflow run
    const controller = new AbortController()
    setAbortController(controller)

    setIsWorkflowRunning(true)
    setIsRunning(true)
    setIsRepeating(repeatCount > 1)
    setCurrentRun(0)
    setResults([])
    setRunResults([]) // Yeni - run özetlerini temizle
    setLocalStorageData([]) // Yeni - localStorage verilerini temizle

    console.log('[WorkflowBuilder] === Starting Workflow ===')
    console.log('[WorkflowBuilder] Repeat count:', repeatCount, typeof repeatCount)
    console.log('[WorkflowBuilder] Steps length:', steps.length)
    console.log('[WorkflowBuilder] Available global variables:', globalVariables)

    // Otomasyon başlarken sadece step'lerde kullanılan global değişkenleri localStorage'a sakla
    try {
      console.log('[WorkflowBuilder] Finding variables used in steps...')
      
      // Step'lerde kullanılan değişkenleri tespit et
      const usedVariables = new Set()
      
      steps.forEach((step, index) => {
        console.log(`[WorkflowBuilder] Scanning step ${index + 1}: ${step.name}`)
        
        // URL'deki değişkenleri bul
        const urlMatches = (step.url || '').match(/\{\{(\w+)\}\}/g)
        if (urlMatches) {
          urlMatches.forEach(match => {
            const varName = match.replace(/\{\{|\}\}/g, '')
            usedVariables.add(varName)
          })
        }
        
        // Headers'daki değişkenleri bul
        Object.values(step.headers || {}).forEach(headerValue => {
          const headerMatches = (headerValue || '').match(/\{\{(\w+)\}\}/g)
          if (headerMatches) {
            headerMatches.forEach(match => {
              const varName = match.replace(/\{\{|\}\}/g, '')
              usedVariables.add(varName)
            })
          }
        })
        
        // Body'deki değişkenleri bul
        const bodyMatches = (step.body || '').match(/\{\{(\w+)\}\}/g)
        if (bodyMatches) {
          bodyMatches.forEach(match => {
            const varName = match.replace(/\{\{|\}\}/g, '')
            usedVariables.add(varName)
          })
        }
        
        // Pre-request script'teki değişkenleri bul
        const preScriptMatches = (step.preRequestScript || '').match(/\{\{(\w+)\}\}/g)
        if (preScriptMatches) {
          preScriptMatches.forEach(match => {
            const varName = match.replace(/\{\{|\}\}/g, '')
            usedVariables.add(varName)
          })
        }
        
        // Post-response script'teki değişkenleri bul
        const postScriptMatches = (step.postResponseScript || '').match(/\{\{(\w+)\}\}/g)
        if (postScriptMatches) {
          postScriptMatches.forEach(match => {
            const varName = match.replace(/\{\{|\}\}/g, '')
            usedVariables.add(varName)
          })
        }
      })
      
      console.log('[WorkflowBuilder] Used variables found:', Array.from(usedVariables))
      console.log('[WorkflowBuilder] Saving only used variables to localStorage...')
      
      let savedCount = 0
      usedVariables.forEach(varName => {
        const value = globalVariables[varName]
        if (value !== undefined && value !== null && value !== '') {
          const existingRuntimeVar = fullRuntimeVariables[varName];

          let type, source;

          if (existingRuntimeVar && existingRuntimeVar.type) {
              // Değişken localStorage'da mevcut ve bir tipi var, onu koru
              type = existingRuntimeVar.type;
              source = existingRuntimeVar.source || 'runtime';
          } else if (staticVariables.hasOwnProperty(varName)) {
              // Değişken localStorage'da yok (veya tipi yok), ama statik listesinde var
              type = 'static';
              source = 'automation';
          } else {
              // Diğer tüm durumlar için varsayılan
              type = 'runtime';
              source = 'automation';
          }

          VariablesService.setRuntimeVariable(varName, String(value), source, type)
          console.log(`[WorkflowBuilder] Saved used variable to localStorage: ${varName} = ${value} (type: ${type})`)
          savedCount++
        }
      })
      
      console.log(`[WorkflowBuilder] Successfully saved ${savedCount} used variables to localStorage`)
    } catch (error) {
      console.error('[WorkflowBuilder] Error saving used variables to localStorage:', error)
    }

    const allResults = []
    const allRunResults = [] // Yeni - her run'ın özet bilgilerini sakla

    try {
      // Workflow'u belirtilen sayıda tekrarla
      console.log('[WorkflowBuilder] Starting for loop with repeatCount:', repeatCount)
      for (let runIndex = 0; runIndex < repeatCount; runIndex++) {
        console.log('[WorkflowBuilder] For loop iteration:', runIndex, 'of', repeatCount)
        
        if (controller.signal.aborted) {
          console.log('[WorkflowBuilder] Workflow cancelled by user')
          break
        }

        setCurrentRun(runIndex + 1)
        
        // Her çalıştırma için başlangıç mesajı
        if (repeatCount > 1) {
          toast(`Çalıştırma ${runIndex + 1}/${repeatCount} başlıyor...`, {
            duration: 1500,
            icon: '🚀'
          })
        }

        console.log(`[WorkflowBuilder] === Run ${runIndex + 1}/${repeatCount} ===`)
        
        const runResults = []
    let workflowVariables = { ...globalVariables }

        // Bu çalıştırma için adımları sırayla çalıştır
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]

        // Check if workflow was cancelled
        if (controller.signal.aborted) {
          console.log('[WorkflowBuilder] Workflow cancelled by user')
          break
        }

        if (!step.enabled) {
            runResults.push({
            stepId: step.id,
            stepName: step.name,
            status: 'pending',
              message: 'Adım devre dışı',
              runNumber: runIndex + 1
          })
          continue
        }

          console.log(`[WorkflowBuilder] Run ${runIndex + 1} - Step ${i + 1}: Using variables:`, workflowVariables)
        const result = await runSingleStep(step, workflowVariables, controller.signal)
          
          // Çalıştırma numarasını ve timestamp'i sonuçlara ekle
          const resultWithRun = {
            ...result,
            runNumber: runIndex + 1,
            timestamp: new Date().toISOString()
          }
          
          runResults.push(resultWithRun)
          allResults.push(resultWithRun)
          setResults([...allResults])

        if (result.status === 'error') {
          if (result.error?.includes('aborted')) {
            console.log('[WorkflowBuilder] Workflow was aborted by user')
            toast.success('Workflow durduruldu')
            return // Kullanıcı durdurduğu zaman tamamen çık
          } else {
            const errorMsg = `Çalıştırma ${runIndex + 1}/${repeatCount} - Adım ${i + 1} hatası: ${result.error}`
            console.error('[WorkflowBuilder] Step error:', errorMsg)
            console.log(`[WorkflowBuilder] Run ${runIndex + 1} failed, skipping to next run`)
            
            // Toast mesajını göster
            toast.error(errorMsg, {
              duration: 3000,
              icon: '❌'
            })
            
            // Hata durumunda bu run'ı atla, bir sonraki run'a geç
            break // Bu run'ın kalan adımlarını atla, bir sonraki run'a geç
          }
        }

        if (result.extractedVariables) {
          workflowVariables = { ...workflowVariables, ...result.extractedVariables }
          setGlobalVariables(workflowVariables)
          console.log('[WorkflowBuilder] Updated variables after step:', workflowVariables)
          }
        }

        // Bu çalıştırma tamamlandı mesajı ve localStorage verilerini topla
        if (!controller.signal.aborted) {
          const hasError = runResults.some(r => r.status === 'error')
          
          // Bu run'ın localStorage verilerini topla (başarılı ise)
          if (!hasError) {
            const currentRunData = loadLocalStorageDataForRun(runIndex + 1)
            setLocalStorageData(prev => [...prev, currentRunData])
          }
          
          // Run özet bilgilerini kaydet
          const runSummary = {
            runNumber: runIndex + 1,
            status: hasError ? 'error' : 'success',
            completedAt: new Date().toISOString(),
            stepCount: runResults.length,
            successCount: runResults.filter(r => r.status === 'success').length,
            errorCount: runResults.filter(r => r.status === 'error').length
          }
          allRunResults.push(runSummary)
          setRunResults([...allRunResults])
          
          if (repeatCount > 1) {
            if (hasError) {
              const errorMsg = `Çalıştırma ${runIndex + 1}/${repeatCount} hatalarla tamamlandı`
              console.warn(`[WorkflowBuilder] ${errorMsg}`)
              toast.error(errorMsg, {
                duration: 2000,
                icon: '⚠️'
              })
            } else {
              const successMsg = `Çalıştırma ${runIndex + 1}/${repeatCount} başarıyla tamamlandı`
              console.log(`[WorkflowBuilder] ${successMsg}`)
              toast.success(successMsg, {
                duration: 2000,
                icon: '✅'
              })
            }
          }
        }

        // Çalıştırmalar arası kısa bekleme (opsiyonel)
        if (runIndex < repeatCount - 1 && !controller.signal.aborted) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }

      if (!controller.signal.aborted) {
        if (repeatCount > 1) {
          // Tüm sonuçları kontrol et ve özet bilgi ver
          const totalRuns = repeatCount
          const successfulRuns = []
          const failedRuns = []
          
          for (let i = 0; i < totalRuns; i++) {
            const runResults = allResults.filter(r => r.runNumber === i + 1)
            const hasError = runResults.some(r => r.status === 'error')
            if (hasError) {
              failedRuns.push(i + 1)
            } else {
              successfulRuns.push(i + 1)
            }
          }
          
          if (failedRuns.length === 0) {
            const finalMsg = `Tüm workflow çalıştırmaları başarıyla tamamlandı! (${totalRuns}/${totalRuns})`
            console.log(`[WorkflowBuilder] ${finalMsg}`)
            toast.success(finalMsg, {
              duration: 4000,
              icon: '🎉'
            })
            // Tüm çalıştırmalar başarılı - localStorage verileri zaten toplandı
            // Otomasyon tamamlandı, localStorage'ı temizle (user ve static değişkenler hariç)
            setTimeout(() => {
              cleanupLocalStorageAfterAutomation()
              console.log('[WorkflowBuilder] Running cleanup after successful automation')
            }, 2000)
          } else if (successfulRuns.length === 0) {
            const finalMsg = `Tüm workflow çalıştırmaları başarısız oldu! (0/${totalRuns})`
            console.error(`[WorkflowBuilder] ${finalMsg}`)
            toast.error(finalMsg, {
              duration: 4000,
              icon: '❌'
            })
            // Tüm çalıştırmalar başarısız - localStorage verilerini temizle
            setLocalStorageData([])
            // Hata durumunda da localStorage'ı temizle (user ve static değişkenler hariç)
            setTimeout(() => {
              cleanupLocalStorageAfterAutomation()
              console.log('[WorkflowBuilder] Running cleanup after failed automation')
            }, 2000)
          } else {
            const finalMsg = `${successfulRuns.length}/${totalRuns} çalıştırma başarılı, ${failedRuns.length} çalıştırma başarısız`
            console.warn(`[WorkflowBuilder] ${finalMsg}`)
            console.log(`[WorkflowBuilder] Successful runs: ${successfulRuns.join(', ')}`)
            console.log(`[WorkflowBuilder] Failed runs: ${failedRuns.join(', ')}`)
            toast(finalMsg, {
              icon: '⚠️',
              duration: 4000,
              style: {
                background: '#f59e0b',
                color: 'white'
              }
            })
            // Kısmi başarı - localStorage verileri zaten başarılı run'lar için toplandı
            // Otomasyon tamamlandı, localStorage'ı temizle (user hariç)
            setTimeout(() => {
              cleanupLocalStorageAfterAutomation()
            }, 2000)
          }
        } else {
          // Tek çalıştırma için başarı kontrolü
          const hasErrors = allResults.some(r => r.status === 'error')
          if (hasErrors) {
            toast.error('Workflow hatalarla tamamlandı')
            // Hata var - localStorage verilerini temizle
            setLocalStorageData([])
            // Hata durumunda da localStorage'ı temizle (user ve static değişkenler hariç)
            setTimeout(() => {
              cleanupLocalStorageAfterAutomation()
              console.log('[WorkflowBuilder] Running cleanup after error')
            }, 2000)
          } else {
            toast.success('Workflow tamamlandı')
            // Başarılı - localStorage verilerini yükle (tek run için)
            const currentRunData = loadLocalStorageDataForRun(1)
            setLocalStorageData([currentRunData])
            setRunResults([{
              runNumber: 1,
              status: 'success',
              completedAt: new Date().toISOString(),
              stepCount: allResults.length,
              successCount: allResults.filter(r => r.status === 'success').length,
              errorCount: allResults.filter(r => r.status === 'error').length
            }])
            // Otomasyon tamamlandı, localStorage'ı temizle (user hariç)
            setTimeout(() => {
              cleanupLocalStorageAfterAutomation()
            }, 2000)
          }
        }
      }
    } catch (error) {
      console.error('Workflow error:', error)
      if (error.name === 'AbortError') {
        toast.success('Workflow durduruldu')
      } else {
        toast.error('Workflow çalıştırılırken hata oluştu')
      }
      // Hata durumunda da localStorage'ı temizle (user ve static değişkenler hariç)
      setTimeout(() => {
        cleanupLocalStorageAfterAutomation()
        console.log('[WorkflowBuilder] Running cleanup after workflow error')
      }, 2000)
    } finally {
      setIsRunning(false)
      setIsRepeating(false)
      setCurrentRun(0)
      setAbortController(null)
      setIsWorkflowRunning(false)
    }
  }
  const runSingleStep = async (step, variables = {}, signal) => {
    const startTime = Date.now()

    console.log(`[WorkflowBuilder] === Running Step: ${step.name} ===`)
    console.log('[WorkflowBuilder] Step URL:', step.url)
    console.log('[WorkflowBuilder] Available variables for this step:', variables)
    console.log('[WorkflowBuilder] Global variables:', globalVariables)

    try {
      // Runtime variables'ları da ekle
      const allVariables = {
        ...variables,
        ...globalVariables,
        user: user?.sicil_no, // user değişkenini sicil_no ile değiştirdik
        sicil_no: user?.sicil_no
      }

      const processedUrl = replaceVariables(step.url, allVariables)
      const processedBody = replaceVariables(step.body, allVariables)

      console.log('[WorkflowBuilder] Processed URL:', processedUrl)

      const processedHeaders = {}
      Object.entries(step.headers || {}).forEach(([key, value]) => {
        processedHeaders[key] = replaceVariables(value, allVariables)
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

          // Eğer script adımın atlanmasını istiyorsa
          if (requestVariables.skipStep) {
            console.log('[WorkflowBuilder] Step skipped by pre-request script:', requestVariables.skipReason)
            return {
              stepId: step.id,
              stepName: step.name,
              status: 'skipped',
              message: requestVariables.skipReason || 'Pre-request script tarafından atlandı',
              duration: Date.now() - startTime
            }
          }
        } catch (error) {
          console.warn('[WorkflowBuilder] Pre-request script failed:', error)
          // Continue with original request if script fails
        }
      }

      const response = await fetch(finalRequest.url, {
        method: step.method,
        headers: finalRequest.headers,
        body: step.method !== 'GET' ? finalRequest.body : undefined,
        signal
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

      // Handle AbortError specially
      if (error.name === 'AbortError') {
        return {
          stepId: step.id,
          stepName: step.name,
          status: 'error',
          error: 'Request aborted by user',
          duration
        }
      }

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
        localStorage: window.localStorage, // localStorage'ı context'e ekle
        Date: Date,
        Math: Math,
        JSON: JSON,
        String: String,
        Number: Number,
        parseInt: parseInt,
        parseFloat: parseFloat
      }

      // Execute script with direct parameters
      const scriptFunction = new Function('variables', 'request', 'console', 'localStorage', 'Date', 'Math', 'JSON', 'String', 'Number', 'parseInt', 'parseFloat', `
        ${script}
        return { variables, request };
      `)

      return scriptFunction(
        mutableVariables,
        mutableRequest,
        scriptContext.console,
        scriptContext.localStorage,
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
    if (abortController) {
      console.log('[WorkflowBuilder] Aborting workflow...')
      abortController.abort()
    }
    setIsRunning(false)
    setAbortController(null)
    
    // Otomasyon durdurulduğunda da localStorage'ı temizle (user hariç)
    setTimeout(() => {
      cleanupLocalStorageAfterAutomation()
    }, 1000)
    
    toast.success('Workflow durduruldu')
  }

  // Workflow bilgilerini güncelleme (sadece ad ve açıklama)
  const handleUpdateWorkflowInfo = async () => {
    if (!workflowName.trim()) {
      toast.error('Workflow adı gerekli')
      return
    }

    if (!currentWorkflow) {
      toast.error('Güncellenecek workflow bulunamadı')
      return
    }

    const loadingToastId = toast.loading('Workflow bilgileri güncelleniyor...')

    try {
      await WorkflowService.updateWorkflow(currentWorkflow.id, {
        name: workflowName,
        description: workflowDescription
      })

      // Current workflow'u güncelle
      setCurrentWorkflow({
        ...currentWorkflow,
        name: workflowName,
        description: workflowDescription
      })

      toast.dismiss(loadingToastId)
      toast.success('Workflow bilgileri başarıyla güncellendi!')
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.error('[WorkflowBuilder] Error updating workflow info:', error)
      
      let errorMessage = 'Workflow güncellenirken hata oluştu'
      if (error?.code === '23505') {
        errorMessage = 'Bu workflow adı zaten kullanımda. Farklı bir ad seçin.'
      } else if (error?.message) {
        errorMessage = `Hata: ${error.message}`
      }
      
      toast.error(errorMessage)
    } finally {
      setSaveDialogOpen(false)
    }
  }

  // Farklı kaydet (yeni workflow oluşturma)
  const handleSaveAsNewWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Workflow adı gerekli')
      return
    }

    // Loading toast
    const loadingToastId = toast.loading('Yeni workflow oluşturuluyor...')

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
      setWorkflowName(newWorkflow.name)
      setWorkflowDescription(newWorkflow.description || '')
      
        toast.dismiss(loadingToastId)
      toast.success(`Yeni workflow "${workflowName}" oluşturuldu ve kaydedildi!`)
    } catch (error) {
      toast.dismiss(loadingToastId)
      console.error('[WorkflowBuilder] ❌ Error creating new workflow:', error)

      // Hata tipine göre daha detaylı mesaj
      let errorMessage = 'Workflow kaydedilirken bilinmeyen bir hata oluştu'

      if (error?.code === '23502') {
        errorMessage = 'Veri doğrulama hatası: Eksik bilgi tespit edildi. Lütfen tüm alanları doldurun.'
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
    setRunResults([]) // Yeni workflow yüklendiğinde run sonuçlarını temizle
    setLocalStorageData([]) // Yeni workflow yüklendiğinde localStorage verilerini temizle
    setGlobalVariables({})
    setShowWorkflowManager(false)

    // Workflow yüklendiğinde variables'ları yenile
    console.log('[WorkflowBuilder] Refreshing variables after workflow load...')
    await loadVariables()

    // Loading state'ini false yap
    setLoading(false)
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
    setRunResults([]) // Yeni workflow oluşturulduğunda run sonuçlarını temizle
    setLocalStorageData([]) // Yeni workflow oluşturulduğunda localStorage verilerini temizle
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

  // Postman Collection Import
  const handlePostmanImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)
        const importResult = parsePostmanCollection(jsonData)

        if (importResult.steps.length > 0) {
          setSteps([...steps, ...importResult.steps])

          let message = `${importResult.steps.length} API adımı Postman'den import edildi!`
          if (importResult.scriptsCount > 0) {
            message += ` (${importResult.scriptsCount} script dahil)`
          }

          toast.success(message)
          console.log('[PostmanImport] Import completed:', {
            steps: importResult.steps.length,
            scripts: importResult.scriptsCount,
            details: importResult
          })
        } else {
          toast.error('Postman collection\'da geçerli request bulunamadı')
        }
      } catch (error) {
        console.error('Postman import error:', error)
        toast.error('Postman collection parse edilemedi. Geçerli bir JSON dosyası seçin.')
      }
    }
    reader.readAsText(file)
    // Input'u temizle
    event.target.value = ''
  }

  const parsePostmanCollection = (collection) => {
    const steps = []
    let scriptsCount = 0

    const parseItems = (items, parentName = '') => {
      items.forEach((item, index) => {
        if (item.item) {
          // Folder ise, içindeki item'ları parse et
          parseItems(item.item, item.name)
        } else if (item.request) {
          // Request ise, step'e çevir
          const request = item.request

          // URL parse et
          let url = ''
          if (typeof request.url === 'string') {
            url = request.url
          } else if (request.url && request.url.raw) {
            url = request.url.raw
          } else if (request.url && request.url.host) {
            const protocol = request.url.protocol || 'https'
            const host = Array.isArray(request.url.host) ? request.url.host.join('.') : request.url.host
            const path = request.url.path ? '/' + (Array.isArray(request.url.path) ? request.url.path.join('/') : request.url.path) : ''
            const query = request.url.query ? '?' + request.url.query.map(q => `${q.key}=${q.value || ''}`).join('&') : ''
            url = `${protocol}://${host}${path}${query}`
          }

          // Headers parse et
          const headers = {}
          if (request.header && Array.isArray(request.header)) {
            request.header.forEach(h => {
              if (h.key && !h.disabled) {
                headers[h.key] = h.value || ''
              }
            })
          }

          // Body parse et
          let body = ''
          if (request.body) {
            if (request.body.mode === 'raw') {
              body = request.body.raw || ''
            } else if (request.body.mode === 'formdata') {
              // Form data'yı JSON'a çevir (basit yaklaşım)
              const formData = {}
              if (request.body.formdata) {
                request.body.formdata.forEach(item => {
                  if (item.key && !item.disabled) {
                    formData[item.key] = item.value || ''
                  }
                })
              }
              body = JSON.stringify(formData, null, 2)
            } else if (request.body.mode === 'urlencoded') {
              // URL encoded'ı JSON'a çevir
              const formData = {}
              if (request.body.urlencoded) {
                request.body.urlencoded.forEach(item => {
                  if (item.key && !item.disabled) {
                    formData[item.key] = item.value || ''
                  }
                })
              }
              body = JSON.stringify(formData, null, 2)
            }
          }

          // Script'leri parse et
          let preRequestScript = ''
          let postResponseScript = ''

          if (item.event && Array.isArray(item.event)) {
            item.event.forEach(event => {
              if (event.listen === 'prerequest' && event.script && event.script.exec) {
                // Pre-request script'i birleştir
                preRequestScript = Array.isArray(event.script.exec)
                  ? event.script.exec.join('\n')
                  : event.script.exec || ''
                if (preRequestScript.trim()) scriptsCount++
              } else if (event.listen === 'test' && event.script && event.script.exec) {
                // Test script'i post-response script olarak kullan
                postResponseScript = Array.isArray(event.script.exec)
                  ? event.script.exec.join('\n')
                  : event.script.exec || ''
                if (postResponseScript.trim()) scriptsCount++
              }
            })
          }

          const stepName = parentName ? `${parentName} - ${item.name}` : item.name

          const step = {
            id: `imported-${Date.now()}-${Math.random()}-${index}`, // Daha unique ID
            name: stepName || `İmport Edilen Adım ${steps.length + 1}`,
            method: (request.method || 'GET').toUpperCase(),
            url: url,
            headers: headers,
            body: body,
            variables: {},
            preRequestScript: preRequestScript,
            postResponseScript: postResponseScript,
            enabled: true
          }

          steps.push(step)

          // Debug log
          console.log('[PostmanImport] Parsed step:', {
            name: step.name,
            method: step.method,
            url: step.url,
            hasPreScript: !!preRequestScript.trim(),
            hasPostScript: !!postResponseScript.trim(),
            headersCount: Object.keys(headers).length
          })
        }
      })
    }

    if (collection.item) {
      parseItems(collection.item)
    } else if (collection.collection && collection.collection.item) {
      // Bazı export formatlarında collection nested olabilir
      parseItems(collection.collection.item)
    }

    console.log('[PostmanImport] Parse completed:', {
      totalSteps: steps.length,
      totalScripts: scriptsCount,
      collectionName: collection.info?.name || collection.collection?.info?.name || 'Unknown'
    })

    return { steps, scriptsCount }
  }

  // Tek API çalıştırma
  const runSingleApi = async (step) => {
    console.log('[WorkflowBuilder] runSingleApi called with step:', step)

    if (!step.url || !step.enabled) {
      console.log('[WorkflowBuilder] runSingleApi: Invalid step - URL:', step.url, 'Enabled:', step.enabled)
      return
    }

    const stepWithId = step.id || `temp-${Date.now()}`
    const uniqueResultId = `${stepWithId}-single-${Date.now()}`

    try {
      console.log('[WorkflowBuilder] runSingleApi: Starting execution for step:', stepWithId)
      setIsRunning(true)

      // Show loading toast
      const loadingToastId = toast.loading(`${step.name || 'API'} çalıştırılıyor...`)

      const result = await runSingleStep(step, globalVariables)
      console.log('[WorkflowBuilder] runSingleApi: Result received:', result)

      toast.dismiss(loadingToastId)

      if (result.status === 'success') {
        toast.success(`${step.name || 'API'} başarıyla çalıştırıldı!`)
        // Update results - remove previous single results for this step and add new one
        const newResult = {
          stepId: uniqueResultId,
          stepName: step.name || 'API Test',
          singleExecution: true,
          originalStepId: stepWithId,
          ...result
        }
        setResults(prev => {
          // Remove previous single execution results for this step
          const filteredResults = prev.filter(r =>
            !(r.singleExecution && r.originalStepId === stepWithId)
          )
          return [...filteredResults, newResult]
        })
      } else {
        toast.error(`${step.name || 'API'} çalıştırma hatası: ${result.error}`)
        // Add error result
        const errorResult = {
          stepId: uniqueResultId,
          stepName: step.name || 'API Test',
          singleExecution: true,
          originalStepId: stepWithId,
          ...result
        }
        setResults(prev => {
          // Remove previous single execution results for this step
          const filteredResults = prev.filter(r =>
            !(r.singleExecution && r.originalStepId === stepWithId)
          )
          return [...filteredResults, errorResult]
        })
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`)
      console.error('[WorkflowBuilder] Error running single API:', error)
    } finally {
      setIsRunning(false)
    }
  }

  // Tek API kaydetme  
  const saveSingleApi = async (step) => {
    console.log('[WorkflowBuilder] saveSingleApi called with step:', step)

    if (!step.url) {
      console.log('[WorkflowBuilder] saveSingleApi: No URL provided')
      toast.error('API URL\'si gerekli')
      return
    }

    if (!step.name || !step.name.trim()) {
      toast.error('API adı gerekli')
      return
    }

    if (!currentWorkflow) {
      toast.error('Önce bir workflow yükleyin veya oluşturun')
      return
    }

    try {
      console.log('[WorkflowBuilder] saveSingleApi: Processing single step save for workflow:', currentWorkflow.id)

      // Show loading toast
      const loadingToastId = toast.loading('API kaydediliyor...')

      // Step mevcut mu kontrol et (gerçek UUID var mı)
      const isExistingStep = step.id &&
        !step.id.startsWith('step-') &&
        step.id.length === 36 &&
        step.id.includes('-')

      if (isExistingStep) {
        // Mevcut step'i güncelle
        console.log('[WorkflowBuilder] Updating existing step:', step.id)
        await WorkflowService.updateSingleStep(step.id, step)

        // Lokal state'i güncelle
        const updatedSteps = steps.map(s => s.id === step.id ? step : s)
        setSteps(updatedSteps)

        toast.dismiss(loadingToastId)
        toast.success(`"${step.name.trim()}" başarıyla güncellendi!`)

      } else {
        // Yeni step ekle
        console.log('[WorkflowBuilder] Adding new step to workflow')
        const insertedStep = await WorkflowService.insertSingleStep(currentWorkflow.id, step)

        // Lokal state'i güncelle - eski step'i yenisiyle değiştir
        const updatedSteps = steps.map(s => s.id === step.id ? {
          ...step,
          id: insertedStep.id // Yeni UUID'yi kullan
        } : s)
        setSteps(updatedSteps)

        toast.dismiss(loadingToastId)
        toast.success(`"${step.name.trim()}" başarıyla eklendi!`)
      }

      // Workflow'un updated_at'ini güncelle
      await WorkflowService.updateWorkflow(currentWorkflow.id, {
        updated_at: new Date().toISOString()
      })

      console.log('[WorkflowBuilder] saveSingleApi: Single step operation completed')

    } catch (error) {
      console.error('[WorkflowBuilder] Error in single step save:', error)
      toast.error(`Step kaydetme hatası: ${error.message}`)
    }
  }

  // LocalStorage verilerini oku
  // Her run için localStorage verilerini topla
  const loadLocalStorageDataForRun = (runNumber) => {
    try {
      // Runtime variables'dan veri al
      const runtimeVars = VariablesService.getRuntimeVariables()
      
      // User verisi için localStorage'dan al (farklı formatta)
    
      
      // User'ı parse et
      let userValue = ''
      if (user) {
        userValue = user?.sicil_no || ''
      }

      // TCKN için tcReg veya tcFonk'u kontrol et
      const tcknValue = runtimeVars.tcReg?.value || runtimeVars.tcFonk?.value || ''
      
      // Doğum tarihi için birthDateReg veya birthDateFonk'u kontrol et
      const birthDateValue = runtimeVars.birthDateReg?.value || runtimeVars.birthDateFonk?.value || ''
      
      // Tarife mapping - değişken adına göre tarife adını belirle
      let tarifeValue = ''
      
      // Önce değişken adlarına göre tarife belirle
      if (runtimeVars.kral_prod_ofr_id?.value) {
        tarifeValue = 'Kral Tarife'
      } else if (runtimeVars.uygun_prod_ofr_id?.value) {
        tarifeValue = 'Uygun 10GB'
      } else if (runtimeVars.prod_ofr_id?.value) {
        // Geriye uyumluluk için eski prod_ofr_id değişkeni
        tarifeValue = 'Ailece 15GB'
      } else {
        // Diğer _prod_ofr_id ile biten değişkenleri otomatik algıla
        const prodOfrVariables = Object.keys(runtimeVars).filter(key => 
          key.endsWith('_prod_ofr_id') && runtimeVars[key]?.value
        )
        
        if (prodOfrVariables.length > 0) {
          // İlk bulunan değişkenin adından tarife adını çıkar
          const variableName = prodOfrVariables[0]
          const tariffeName = variableName.replace('_prod_ofr_id', '')
          // İlk harfi büyük yap ve "Tarife" ekle
          tarifeValue = tariffeName.charAt(0).toUpperCase() + tariffeName.slice(1) + ' Tarife'
        }
      }

      // Ortam belirleme - localStorage key'lerine göre
      let ortamValue = ''
      if (runtimeVars.RegPost?.value || runtimeVars.RegPre?.value) {
        ortamValue = 'Regresyon'
      } else if (runtimeVars.FonkPost?.value || runtimeVars.FonkPre?.value) {
        ortamValue = 'Fonksiyonel'
      }

      return {
        runNumber: runNumber,
        user: userValue,
        msisdn: runtimeVars.msisdn?.value || '',
        tckn: tcknValue,
        birthDate: birthDateValue,
        customerId: runtimeVars.customerId?.value || '',
        customerOrder: runtimeVars.customerOrder?.value || '',
        tarife: tarifeValue,
        ortam: ortamValue,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('[WorkflowBuilder] Error loading localStorage data for run:', runNumber, error)
      return {
        runNumber: runNumber,
        user: '',
        msisdn: '',
        tckn: '',
        birthDate: '',
        customerId: '',
        customerOrder: '',
        tarife: '',
        ortam: '',
        timestamp: new Date().toISOString()
      }
    }
  }

  // Eski loadLocalStorageData fonksiyonu - geriye dönük uyumluluk için
  const loadLocalStorageData = () => {
    const data = loadLocalStorageDataForRun(1)
    setLocalStorageData([data])
  }

  // Otomasyon sonrası localStorage temizlik fonksiyonu (user hariç)
  const cleanupLocalStorageAfterAutomation = () => {
    try {
      console.log('[WorkflowBuilder] 🧹 Starting post-automation cleanup...')
      
      // 1. static_variables'dan değişkenleri al
      const staticVars = JSON.parse(localStorage.getItem('static_variables') || '{}')
      console.log('[WorkflowBuilder] 📦 Loading static variables:', Object.keys(staticVars))

      // 2. Sadece user değişkenini koru
      const runtimeVars = JSON.parse(localStorage.getItem('omni_runtime_variables') || '{}')
      const userVar = runtimeVars['user']
      
      // 3. Yeni runtime variables oluştur (user + static değişkenler)
      const cleanedVars = {}
      
      // User değişkenini ekle
      if (userVar) {
        cleanedVars['user'] = userVar
        console.log('[WorkflowBuilder] 🔒 Preserving user variable')
      }

      // Static değişkenleri ekle
      Object.entries(staticVars).forEach(([key, value]) => {
        cleanedVars[key] = value
        console.log(`[WorkflowBuilder] 📌 Restoring static variable: ${key}`)
      })

      // 4. Temizlenmiş değişkenleri kaydet
      localStorage.setItem('omni_runtime_variables', JSON.stringify(cleanedVars))
      console.log('[WorkflowBuilder] ✅ Updated omni_runtime_variables with user and static variables')
      
      // 5. Variables'ları yeniden yükle ki UI güncellensin
      loadVariables()
      
      // Log sonuçları
      const preservedVars = Object.keys(cleanedVars)
      console.log('[WorkflowBuilder] ✅ Cleanup completed.')
      console.log('[WorkflowBuilder] 🔒 Preserved variables:', preservedVars)
      console.log('[WorkflowBuilder] 📝 Final variables state:', cleanedVars)
    } catch (error) {
      console.error('[WorkflowBuilder] ❌ Error during post-automation cleanup:', error)
    }
  }

  const loadAvailableWorkflows = async () => {
    if (!isAdmin) {
      try {
        const workflows = await WorkflowService.getActiveWorkflows()
        const sortedWorkflows = workflows.sort((a, b) => b.name.localeCompare(a.name))
        setAvailableWorkflows(sortedWorkflows)
      } catch (error) {
        console.error('[WorkflowBuilder] Error loading active workflows:', error)
      }
    }
  }

  return (
    <div className="modern-page">


      {/* Action Bar */}
      <div className="action-bar-minimal">
        {/* Sol grup - Ana işlemler */}
        <div className="action-group-left">
          {/* Statik Değişkenler - sadece workflow yüklendiğinde göster */}
          {currentWorkflow && <StaticVariables />}

          {/* Normal kullanıcılar için araçlar */}
          {!isAdmin && (
            <>
              {/* Workflow Butonları */}
              <div className="workflow-buttons-container">
                {availableWorkflows.length === 0 ? (
                  <div className="no-workflows-message">
                    <i className="bi bi-folder-x"></i>
                    <span>Henüz workflow bulunamadı</span>
                  </div>
                ) : (
                  <div className="dropdown">
                    <button
                      className="action-btn secondary dropdown-toggle"
                      type="button"
                      title="Workflow seçin"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowToolsDropdown(false)
                        setShowSaveDropdown(false)
                        setShowWorkflowDropdown(!showWorkflowDropdown)
                      }}
                    >
                      <i className="bi bi-gear-wide-connected"></i>
                      <span>{currentWorkflow ? currentWorkflow.name : 'Workflow Seç'}</span>
                    </button>
                    <div className={`dropdown-menu ${showWorkflowDropdown ? 'show' : ''}`}>
                      {availableWorkflows.map(workflow => (
                        <button
                          key={workflow.id}
                          className={`dropdown-item ${currentWorkflow?.id === workflow.id ? 'active' : ''} ${workflow.name.includes('Fonksiyonel') ? 'FunctionalWorkflow' : 'RegressionWorkflow'}`}
                          onClick={() => {
                            setShowWorkflowDropdown(false)
                            setLoading(true)
                            try {
                              WorkflowService.loadWorkflow(workflow.id)
                                .then(({ workflow: workflowData, steps }) => {
                                  handleLoadWorkflow(workflowData, steps)
                                })
                                .catch(error => {
                                  console.error('Error loading workflow:', error)
                                  setLoading(false)
                                  toast.error('Workflow yüklenirken hata oluştu')
                                })
                            } catch (error) {
                              console.error('Error loading workflow:', error)
                              setLoading(false)
                              toast.error('Workflow yüklenirken hata oluştu') 
                            }
                          }}
                          title={`${workflow.name}${workflow.description ? ' - ' + workflow.description : ''}`}
                        >
                          <i className="bi bi-gear-wide-connected"></i>
                          <span>{workflow.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="action-divider"></div>
{/*               
              <button
                className="action-btn secondary refresh-variables-btn"
                onClick={() => loadVariables()}
                title="Değişkenleri yenile"
              >
                <i className="bi bi-arrow-clockwise"></i>
                <span>Yenile</span>
              </button> */}
            </>
          )}

          {/* Admin kullanıcılar için ana işlemler */}
          {isAdmin && (
            <button
              className="action-btn primary"
              onClick={addStep}
              disabled={isRunning}
              title="Yeni API adımı ekle"
            >
              <i className="bi bi-plus-lg"></i>
              <span>API Adımı Ekle</span>
            </button>
          )}
          {isAdmin && (
            <label className="action-btn secondary" style={{ cursor: 'pointer', margin: 0 }} title="Postman collection import et">
              <i className="bi bi-upload"></i>
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handlePostmanImport}
                style={{ display: 'none' }}
                disabled={isRunning}
              />
            </label>
          )}

          {steps.length > 0 && (
            <div className="run-controls">
              <div className="repeat-control">
                <label className="repeat-label">
                  <i className="bi bi-arrow-repeat"></i>
                  <span>Tekrar:</span>
                </label>
                <select
                  className="repeat-select"
                  value={repeatCount}
                  onChange={(e) => {
                    const newValue = Number(e.target.value)
                    console.log('[WorkflowBuilder] Repeat count changed from', repeatCount, 'to', newValue)
                    setRepeatCount(newValue)
                  }}
                  disabled={isRunning}
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                  <option value={5}>5x</option>
                  <option value={10}>10x</option>
                  <option value={25}>25x</option>
                  <option value={50}>50x</option>
                </select>
              </div>
            <button
              className={`action-btn ${isRunning ? 'danger' : 'success'}`}
              onClick={isRunning ? stopWorkflow : runWorkflow}
              title={isRunning ? 'Workflow\'u durdur' : 'Workflow\'u çalıştır'}
            >
              <i className={`bi ${isRunning ? 'bi-stop-fill' : 'bi-play-fill'}`}></i>
                <span>
                  {isRunning ? (
                    isRepeating ? `Durduruluyor... (${currentRun}/${repeatCount})` : 'Durdur'
                  ) : (
                    repeatCount > 1 ? `${repeatCount}x Çalıştır` : 'Çalıştır'
                  )}
                </span>
            </button>
            </div>
          )}
        </div>

        {/* Sağ grup - Yönetim */}
        <div className="action-group-right">
          {/* Admin kullanıcılar için araçlar dropdown */}
          {isAdmin && (
          <div className="dropdown">
            <button
              className="action-btn secondary dropdown-toggle"
              type="button"
              title="Araçlar ve ayarlar"
              onClick={(e) => {
                e.stopPropagation()
                setShowToolsDropdown(!showToolsDropdown)
                setShowSaveDropdown(false)
              }}
            >
              <i className="bi bi-three-dots"></i>
              <span>Araçlar</span>
            </button>
            <div className={`dropdown-menu ${showToolsDropdown ? 'show' : ''}`}>
              <button className="dropdown-item" onClick={() => {
                setShowVariablesManager(true)
                setShowToolsDropdown(false)
              }}>
                <i className="bi bi-gear-fill"></i>
                <span>Değişkenler</span>
              </button>
              <button className="dropdown-item" onClick={() => {
                loadVariables()
                setShowToolsDropdown(false)
              }} title="Değişkenleri yenile">
                <i className="bi bi-arrow-clockwise"></i>
                <span>Yenile</span>
              </button>
              <button className="dropdown-item" onClick={() => {
                setShowWorkflowManager(true)
                setShowToolsDropdown(false)
              }}>
                <i className="bi bi-folder-fill"></i>
                <span>Workflow Yönetimi</span>
              </button>
            </div>
          </div>
          )}
          {isAdmin && (
            <div className="dropdown">
              <button
                className="action-btn outline dropdown-toggle"
                type="button"
                disabled={steps.length === 0}
                title="Kaydetme seçenekleri"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSaveDropdown(!showSaveDropdown)
                  setShowToolsDropdown(false)
                }}
              >
                <i className="bi bi-save-fill"></i>
                <span>Kaydet</span>
              </button>
              <div className={`dropdown-menu ${showSaveDropdown ? 'show' : ''}`}>
                <button className="dropdown-item" onClick={() => {
                  quickSave()
                  setShowSaveDropdown(false)
                }} disabled={steps.length === 0}>
                  <i className="bi bi-save-fill"></i>
                  <span>{currentWorkflow ? 'Hızlı Kaydet' : 'Kaydet'}</span>
                </button>
                {currentWorkflow && (
                <button className="dropdown-item" onClick={() => {
                    setSaveDialogOpen(true)
                    setShowSaveDropdown(false)
                  }}>
                    <i className="bi bi-pencil-square"></i>
                    <span>Bilgileri Düzenle</span>
                  </button>
                )}
                <button className="dropdown-item" onClick={() => {
                  // Yeni workflow oluşturmak için workflow'u temizleyip dialog aç
                  const currentName = workflowName
                  const currentDesc = workflowDescription
                  setCurrentWorkflow(null)
                  setWorkflowName(currentName ? `${currentName} - Kopya` : '')
                  setWorkflowDescription(currentDesc)
                  setSaveDialogOpen(true)
                  setShowSaveDropdown(false)
                }} disabled={steps.length === 0}>
                  <i className="bi bi-save2-fill"></i>
                  <span>Farklı Kaydet</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => {
                  handleCreateNewWorkflow()
                  setShowSaveDropdown(false)
                }}>
                  <i className="bi bi-plus-square-fill"></i>
                  <span>Yeni Workflow</span>
                </button>
              </div>
            </div>
          )}
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
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <p>Workflow yükleniyor...</p>
          </div>
        ) : steps.length === 0 && isAdmin ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-plus-circle"></i>
            </div>
            <h3>Henüz API adımı eklenmedi</h3>
            <p>Workflow'unuzu oluşturmaya başlamak için yukarıdan "API Adımı Ekle" butonuna tıklayın veya Postman collection'ınızı import edin</p>
          
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="action-btn primary"
                onClick={addStep}
              >
                <i className="bi bi-plus-lg"></i>
                <span>İlk Adımı Ekle</span>
              </button>

              <label className="action-btn outline" style={{ cursor: 'pointer', margin: 0 }}>
                <i className="bi bi-file-earmark-code"></i>
                <span>Postman Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handlePostmanImport}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

          </div>
        ) : steps.length === 0 && !isAdmin ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-gear-wide-connected"></i>
            </div>
            <h3>Workflow Seçin</h3>
            <p>Otomasyonu başlatmak için yukarıdan bir workflow seçin</p>
            
            {availableWorkflows.length === 0 && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle"></i>
                Henüz kullanılabilir workflow bulunamadı. Lütfen admin ile iletişime geçin.
              </div>
            )}
          </div>
        ) : (
          <div className={isAdmin ? "workflow-container" : "workflow-container-user"}>
            {/* Steps Column */}
            <div className="steps-column" style={{ display: isAdmin ? 'block' : 'none' }}>
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
                    onRunSingle={runSingleApi}
                    onSaveSingle={saveSingleApi}
                  />
                ))}
              </div>
            </div>

            {/* Results Column - Sadece admin için */}
            {isAdmin && (
              <div className="results-column">
                {results.length > 0 && (
                  <WorkflowResults results={results} />
                )}
              </div>
            )}

            {/* Normal kullanıcı için sol tarafta workflow sonuçları */}
            {!isAdmin && results.length > 0 && (
              <div className="steps-column">
                <WorkflowResults results={results} />
              </div>
            )}

            {/* LocalStorage Info Column - Sadece normal kullanıcılar için */}
            {!isAdmin && localStorageData.length > 0 && (
              <div className="localstorage-column">
                <div className="section-header">
                  <h2>
                    <i className="bi bi-check-circle-fill text-emerald-500"></i>
                    Otomasyon Bilgileri
                  </h2>
                </div>

                <div className="localstorage-card">
                  <div className="localstorage-content">
                    <div className="data-content">
                      {localStorageData.map((runData, index) => (
                        <div key={runData.runNumber} className="data-block">
                          <div className="data-header">
                            <h4>Data {runData.runNumber}</h4>
                          </div>
                          <div className="data-items">
                            {runData.msisdn && (
                              <div className="data-line">
                                <strong>MSISDN:</strong> {runData.msisdn}
                              </div>
                            )}
                            {runData.tckn && (
                              <div className="data-line">
                                <strong>TCKN:</strong> {runData.tckn}
                              </div>
                            )}
                            {runData.birthDate && (
                              <div className="data-line">
                                <strong>Doğum Tarihi:</strong> {runData.birthDate}
                              </div>
                            )}
                            {runData.customerId && (
                              <div className="data-line">
                                <strong>Müşteri no:</strong> {runData.customerId}
                              </div>
                            )}
                            {runData.customerOrder && (
                              <div className="data-line">
                                <strong>Sipariş no:</strong> {runData.customerOrder}
                              </div>
                            )}
                            {runData.tarife && (
                              <div className="data-line">
                                <strong>Tarife:</strong> {runData.tarife}
                              </div>
                            )}
                            {runData.ortam && (
                              <div className="data-line">
                                <strong>Ortam:</strong> {runData.ortam}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showWorkflowManager && isAdmin && (
        <WorkflowManager
          onClose={() => setShowWorkflowManager(false)}
          onLoadWorkflow={handleLoadWorkflow}
          user={user}
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
              <h3>
                <i className={`bi ${currentWorkflow ? 'bi-pencil-square' : 'bi-save'}`}></i>
                {currentWorkflow ? 'Workflow Bilgilerini Güncelle' : 'Yeni Workflow Kaydet'}
              </h3>
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
                <i className="bi bi-x-circle"></i>
                İptal
              </button>
              <button
                className="action-btn primary"
                onClick={currentWorkflow ? handleUpdateWorkflowInfo : handleSaveAsNewWorkflow}
              >
                <i className="bi bi-check-circle"></i>
                {currentWorkflow ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 1rem;
        }

        .loading-spinner {
          font-size: 2rem;
          color: white;
          animation: spin 1s linear infinite;
        }

        .loading-spinner i {
          display: inline-block;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .loading-container p {
          color: white;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  )
}