import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

// Predefined static variables
const ALLOWED_VARIABLES = {
  customerId: {
    key: 'customerId',
    label: 'Customer ID',
    description: 'Müşteri kimlik numarası'
  }
}

export default function StaticVariables() {
  const [staticVariables, setStaticVariables] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    loadStaticVariables()
  }, [])

  const loadStaticVariables = () => {
    try {
      // Ayrı static_variables storage'dan yükle
      const staticVars = JSON.parse(localStorage.getItem('static_variables') || '{}')
      const formattedVars = {}
      
      // Sadece izin verilen değişkenleri formatla
      Object.entries(staticVars).forEach(([key, value]) => {
        if (ALLOWED_VARIABLES[key]) {
          formattedVars[key] = value.value
        }
      })
      
      setStaticVariables(formattedVars)
    } catch (error) {
      console.error('Error loading static variables:', error)
      setStaticVariables({})
    }
  }

  const handleSave = () => {
    try {
      console.log('[StaticVariables] Saving customerId value:', editValue)
      
      // Yeni değişken objesi
      const newVariable = {
        key: 'customerId',
        value: editValue,
        type: 'static',
        source: 'script',
        timestamp: Date.now()
      }

      // 1. static_variables'a kaydet
      const staticVars = JSON.parse(localStorage.getItem('static_variables') || '{}')
      staticVars['customerId'] = newVariable
      localStorage.setItem('static_variables', JSON.stringify(staticVars))
      console.log('[StaticVariables] Saved to static_variables:', staticVars)

      // 2. omni_runtime_variables'a da ekle
      const runtimeVars = JSON.parse(localStorage.getItem('omni_runtime_variables') || '{}')
      runtimeVars['customerId'] = newVariable
      localStorage.setItem('omni_runtime_variables', JSON.stringify(runtimeVars))
      console.log('[StaticVariables] Added to omni_runtime_variables:', runtimeVars)
      
      // State'i güncelle
      setStaticVariables(prev => ({
        ...prev,
        customerId: editValue
      }))

      // Değişken değişikliğini yayınla
      window.dispatchEvent(new CustomEvent('runtimeVariablesChanged', {
        detail: {
          type: 'static_variable_added',
          variable: newVariable
        }
      }))
      console.log('[StaticVariables] Dispatched runtimeVariablesChanged event')

      setIsEditing(false)
      setEditValue('')
      toast.success('Değişken kaydedildi')
    } catch (error) {
      console.error('Error saving static variable:', error)
      toast.error('Değişken kaydedilirken hata oluştu')
    }
  }

  const handleDelete = () => {
    try {
      console.log('[StaticVariables] Deleting customerId variable')

      // 1. static_variables'dan sil
      const staticVars = JSON.parse(localStorage.getItem('static_variables') || '{}')
      if (staticVars['customerId']) {
        delete staticVars['customerId']
        localStorage.setItem('static_variables', JSON.stringify(staticVars))
        console.log('[StaticVariables] Removed from static_variables')
      }

      // 2. omni_runtime_variables'dan sil
      const runtimeVars = JSON.parse(localStorage.getItem('omni_runtime_variables') || '{}')
      if (runtimeVars['customerId']) {
        delete runtimeVars['customerId']
        localStorage.setItem('omni_runtime_variables', JSON.stringify(runtimeVars))
        console.log('[StaticVariables] Removed from omni_runtime_variables')
      }
      
      // State'i güncelle
      const newVariables = { ...staticVariables }
      delete newVariables['customerId']
      setStaticVariables(newVariables)

      // Değişken değişikliğini yayınla
      window.dispatchEvent(new CustomEvent('runtimeVariablesChanged', {
        detail: {
          type: 'static_variable_deleted',
          key: 'customerId'
        }
      }))
      console.log('[StaticVariables] Dispatched runtimeVariablesChanged event')
      
      toast.success('Değişken silindi')
    } catch (error) {
      console.error('Error deleting static variable:', error)
      toast.error('Değişken silinirken hata oluştu')
    }
  }

  return (
    <div className="static-variables-container">
      {/* Değişken Listesi */}
      <div className="static-variables-list">
        {Object.entries(staticVariables).map(([key, value]) => (
          <div key={key} className="static-variable-item">
            <div className="static-variable-content">
              <span className="static-variable-key">{ALLOWED_VARIABLES[key].label}:</span>
              <span className="static-variable-value">{value}</span>
            </div>
            <button
              className="static-variable-delete"
              onClick={handleDelete}
              title="Değişkeni sil"
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Yeni Değişken Ekleme */}
      {!staticVariables['customerId'] && (
        <div>
          {isEditing ? (
            <div className="static-variable-edit">
              <input
                type="text"
                className="static-variable-input"
                placeholder="Değer"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <div className="static-variable-actions">
                <button
                  className="static-variable-btn save"
                  onClick={handleSave}
                >
                  <i className="bi bi-check"></i>
                </button>
                <button
                  className="static-variable-btn cancel"
                  onClick={() => {
                    setIsEditing(false)
                    setEditValue('')
                  }}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
          ) : (
            <button
              className="static-variable-add"
              onClick={() => setIsEditing(true)}
            >
              <i className="bi bi-plus"></i>
              <span>Customer ID Ekle</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
} 