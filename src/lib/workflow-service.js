import { supabase, isSupabaseConfigured } from './supabase'

export class WorkflowService {
  // Supabase yapılandırma kontrolü
  static checkSupabaseConfig() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
    }
  }

  // Workflow işlemleri
  static async getAllWorkflows() {
    WorkflowService.checkSupabaseConfig()
    
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching workflows:', error)
      throw error
    }

    return data || []
  }

  static async createWorkflow(name, description) {
    const { data, error } = await supabase
      .from('workflows')
      .insert([{ name, description }])
      .select()
      .single()

    if (error) {
      console.error('Error creating workflow:', error)
      throw error
    }

    return data
  }

  static async updateWorkflow(id, updates) {
    const { data, error } = await supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating workflow:', error)
      throw error
    }

    return data
  }

  static async deleteWorkflow(id) {
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting workflow:', error)
      throw error
    }
  }

  // API Steps işlemleri
  static async getWorkflowSteps(workflowId) {
    const { data, error } = await supabase
      .from('api_steps')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching workflow steps:', error)
      throw error
    }

    // Database formatından uygulama formatına dönüştür
    return (data || []).map(step => ({
      id: step.id,
      name: step.name,
      method: step.method,
      url: step.url,
      headers: step.headers || {},
      body: step.body || '',
      variables: step.variables || {},
      preRequestScript: step.pre_request_script || '',
      postResponseScript: step.post_response_script || '',
      enabled: step.enabled
    }))
  }

  static async saveWorkflowSteps(workflowId, steps) {
    console.log('[WorkflowService] Starting saveWorkflowSteps for workflow:', workflowId)
    console.log('[WorkflowService] Steps to save:', steps.length)

    try {
      // Mevcut step'leri al - bunları UPDATE için kullanacağız
      const { data: existingSteps, error: fetchError } = await supabase
        .from('api_steps')
        .select('id, order_index')
        .eq('workflow_id', workflowId)

      if (fetchError) {
        console.error('Error fetching existing steps:', fetchError)
        throw fetchError
      }

      console.log('[WorkflowService] Existing steps count:', existingSteps?.length || 0)

      // Sıralama değişikliği var mı kontrol et
      let hasOrderChange = false
      if (existingSteps && existingSteps.length > 0) {
        // Mevcut step'lerin order'larını yenisiyle karşılaştır
        const existingOrderMap = new Map(existingSteps.map(s => [s.id, s.order_index]))
        
        for (let index = 0; index < steps.length; index++) {
          const step = steps[index]
          if (step.id && 
              !step.id.startsWith('step-') && 
              existingOrderMap.has(step.id) && 
              existingOrderMap.get(step.id) !== index) {
            hasOrderChange = true
            console.log(`[WorkflowService] Order change detected for step ${step.id}: ${existingOrderMap.get(step.id)} → ${index}`)
            break
          }
        }
      }

      if (hasOrderChange) {
        console.log('[WorkflowService] 🔄 Order change detected - using DELETE ALL + INSERT strategy')
        
        // Order değişikliği varsa tüm step'leri sil ve yeniden ekle
        const { error: deleteAllError } = await supabase
          .from('api_steps')
          .delete()
          .eq('workflow_id', workflowId)

        if (deleteAllError) {
          console.error('[WorkflowService] ❌ Delete all steps failed:', deleteAllError)
          throw deleteAllError
        }
        console.log('[WorkflowService] ✅ Deleted all existing steps for reordering')

        // Tüm step'leri INSERT et (ID'leri preserve et)
        if (steps.length > 0) {
          const stepsToInsert = steps.map((step, index) => ({
            id: step.id && !step.id.startsWith('step-') ? step.id : undefined, // Gerçek UUID'leri koru
            workflow_id: workflowId,
            name: step.name || `API Adımı ${index + 1}`,
            method: step.method,
            url: step.url || '',
            headers: step.headers || {},
            body: step.body || '',
            variables: step.variables || {},
            pre_request_script: step.preRequestScript || '',
            post_response_script: step.postResponseScript || '',
            enabled: step.enabled !== false,
            order_index: index
          }))

          const { error: insertError } = await supabase
            .from('api_steps')
            .insert(stepsToInsert)

          if (insertError) {
            console.error('[WorkflowService] ❌ Reorder insert failed:', insertError)
            throw insertError
          }
          console.log('[WorkflowService] ✅ Successfully reinserted all steps with new order')
        }
      } else {
        console.log('[WorkflowService] 📝 No order change - using normal UPSERT strategy')
        
        // Normal UPSERT logic (önceki kod)
        const stepsToUpdate = []
        const stepsToInsert = []

        if (steps.length > 0) {
          for (let index = 0; index < steps.length; index++) {
            const step = steps[index]
            
            const stepData = {
              workflow_id: workflowId,
              name: step.name || `API Adımı ${index + 1}`,
              method: step.method,
              url: step.url || '',
              headers: step.headers || {},
              body: step.body || '',
              variables: step.variables || {},
              pre_request_script: step.preRequestScript || '',
              post_response_script: step.postResponseScript || '',
              enabled: step.enabled !== false,
              order_index: index
            }

            if (step.id && 
                !step.id.startsWith('step-') && 
                step.id.length === 36 && 
                step.id.includes('-') &&
                existingSteps?.some(existing => existing.id === step.id)) {
              
              stepData.id = step.id
              stepsToUpdate.push(stepData)
              console.log(`[WorkflowService] Will UPDATE existing step ${index}:`, step.id)
            } else {
              stepsToInsert.push(stepData)
              console.log(`[WorkflowService] Will INSERT new step ${index} (current ID: ${step.id})`)
            }
          }
        }

        console.log(`[WorkflowService] Steps to UPDATE: ${stepsToUpdate.length}`)
        console.log(`[WorkflowService] Steps to INSERT: ${stepsToInsert.length}`)

        // UPDATE işlemleri
        for (const stepData of stepsToUpdate) {
          const { error: updateError } = await supabase
            .from('api_steps')
            .update(stepData)
            .eq('id', stepData.id)

          if (updateError) {
            console.error(`[WorkflowService] ❌ Update failed for step ${stepData.id}:`, updateError)
            throw updateError
          }
          console.log(`[WorkflowService] ✅ Updated step: ${stepData.id}`)
        }

        // INSERT işlemleri
        if (stepsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('api_steps')
            .insert(stepsToInsert)

          if (insertError) {
            console.error('[WorkflowService] ❌ Insert failed:', insertError)
            throw insertError
          }
          console.log(`[WorkflowService] ✅ Inserted ${stepsToInsert.length} new steps`)
        }
      }

      // Workflow'un updated_at'ini güncelle
      await WorkflowService.updateWorkflow(workflowId, { 
        updated_at: new Date().toISOString() 
      })

      console.log('[WorkflowService] ✅ Workflow steps saved successfully')
    } catch (error) {
      console.error('[WorkflowService] ❌ Error in saveWorkflowSteps:', error)
      throw error
    }
  }

  static async deleteApiStep(stepId) {
    const { error } = await supabase
      .from('api_steps')
      .delete()
      .eq('id', stepId)

    if (error) {
      console.error('Error deleting API step:', error)
      throw error
    }
  }

  static async loadWorkflow(workflowId) {
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single()

    if (workflowError) {
      console.error('Error loading workflow:', workflowError)
      throw workflowError
    }

    const steps = await WorkflowService.getWorkflowSteps(workflowId)

    return { workflow, steps }
  }

  static async duplicateWorkflow(workflowId) {
    const { workflow, steps } = await WorkflowService.loadWorkflow(workflowId)
    
    const newWorkflow = await WorkflowService.createWorkflow(
      `${workflow.name} (Kopya)`,
      workflow.description
    )

    if (steps.length > 0) {
      await WorkflowService.saveWorkflowSteps(newWorkflow.id, steps)
    }

    return newWorkflow
  }
} 