import { supabase, isSupabaseConfigured } from './supabase'

export class VariablesService {
  // Supabase yapılandırma kontrolü
  static checkSupabaseConfig() {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase configuration is missing. Some features may not work properly.')
      return false
    }
    return true
  }

  // Static Variables (Database) - Konfigürasyon değişkenleri
  static async getStaticVariables() {
    if (!VariablesService.checkSupabaseConfig()) {
      return {}
    }

    const { data, error } = await supabase
      .from('global_variables')
      .select('key, value')
      .order('key')

    if (error) {
      console.error('Error fetching static variables:', error)
      return {}
    }

    const variables = {}
    data.forEach(item => {
      variables[item.key] = item.value
    })

    return variables
  }

  static async setStaticVariable(key, value, description) {
    const { error } = await supabase
      .from('global_variables')
      .upsert({
        key,
        value,
        description,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error setting static variable:', error)
      throw error
    }
  }

  static async deleteStaticVariable(key) {
    const { error } = await supabase
      .from('global_variables')
      .delete()
      .eq('key', key)

    if (error) {
      console.error('Error deleting static variable:', error)
      throw error
    }
  }

  static async getAllStaticVariables() {
    const { data, error } = await supabase
      .from('global_variables')
      .select('*')
      .order('key')

    if (error) {
      console.error('Error fetching all static variables:', error)
      throw error
    }

    return data || []
  }

  // Runtime Variables (LocalStorage) - API'den gelen dinamik değişkenler
  static getRuntimeVariables() {
    try {
      const stored = localStorage.getItem('omni_runtime_variables')
      let variables = stored ? JSON.parse(stored) : {}
      
      // Otomatik olarak currentUsername'i user variable'ı olarak ekle
      const currentUsername = localStorage.getItem('currentUsername')
      const currentUserSicilNo = localStorage.getItem('currentUserSicilNo')
      if (currentUsername && currentUserSicilNo) {
        variables['user'] = {
          key: 'user',
          value: currentUserSicilNo,
          source: 'auth',
          timestamp: Date.now()
        }
      } else {
        // User bilgisi yoksa console'da uyarı ver ama hata fırlatma
        console.warn('[VariablesService] User bilgisi localStorage\'da bulunamadı. Otomasyonda ayarlanacak.')
      }
      
      return variables
    } catch (error) {
      console.error('Error reading runtime variables from localStorage:', error)
      return {}
    }
  }

  static setRuntimeVariable(key, value, source = 'manual') {
    try {
      const variables = this.getRuntimeVariables()
      variables[key] = {
        key,
        value,
        source,
        timestamp: Date.now()
      }
      localStorage.setItem('omni_runtime_variables', JSON.stringify(variables))
    } catch (error) {
      console.error('Error saving runtime variable to localStorage:', error)
    }
  }

  static deleteRuntimeVariable(key) {
    try {
      // User variable'ını silme - otomatik olarak yönetiliyor
      if (key === 'user') {
        console.warn('User variable cannot be deleted manually - it is managed by auth system')
        return
      }
      
      const variables = this.getRuntimeVariables()
      delete variables[key]
      localStorage.setItem('omni_runtime_variables', JSON.stringify(variables))
    } catch (error) {
      console.error('Error deleting runtime variable from localStorage:', error)
    }
  }

  static clearRuntimeVariables() {
    try {
      localStorage.removeItem('omni_runtime_variables')
    } catch (error) {
      console.error('Error clearing runtime variables:', error)
    }
  }

  // Combined Variables - Her ikisini birleştir
  static async getAllVariables() {
    const staticVars = await this.getStaticVariables()
    const runtimeVars = this.getRuntimeVariables()
    
    // Runtime değişkenleri sadece value olarak al
    const runtimeValues = {}
    Object.values(runtimeVars).forEach(variable => {
      runtimeValues[variable.key] = variable.value
    })

    // Runtime değişkenler static'leri override eder
    return { ...staticVars, ...runtimeValues }
  }

  static getVariableSource(key) {
    const runtimeVars = this.getRuntimeVariables()
    if (runtimeVars[key]) return 'runtime'
    
    // Static kontrolü async olduğu için burada direkt kontrol edemeyiz
    // Bu durumda caller async kontrol yapmalı
    return null
  }

  // Cleanup - Eski runtime değişkenleri temizle
  static cleanupOldRuntimeVariables(maxAgeHours = 24) {
    try {
      const variables = this.getRuntimeVariables()
      const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000)
      
      Object.keys(variables).forEach(key => {
        // User variable'ını temizleme - otomatik olarak yönetiliyor
        if (key === 'user') return
        
        if (variables[key].timestamp < cutoffTime) {
          delete variables[key]
        }
      })
      
      localStorage.setItem('omni_runtime_variables', JSON.stringify(variables))
    } catch (error) {
      console.error('Error cleaning up old runtime variables:', error)
    }
  }
} 