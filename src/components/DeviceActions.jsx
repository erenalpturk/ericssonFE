import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DeviceActions = () => {
  const [formData, setFormData] = useState({
    environment: 'fonksiyonel',
    paymentType: 'temlikli',
    imei: '',
    customerOrder: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triggerProgress, setTriggerProgress] = useState({
    isActive: false,
    currentStep: 0,
    totalSteps: 0,
    triggers: [],
    results: []
  });
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const replaceVariables = (template, variables) => {
    if (!template) return template;
    let result = template;
    Object.keys(variables).forEach(key => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), variables[key] || '');
    });
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Zorunlu alan kontrolü
    const errors = [];
    
    if (!formData.customerOrder || !formData.customerOrder.trim()) {
      errors.push('Müşteri Sipariş No');
    }
    
    // İade Reddi için IMEI zorunlu değil
    if (formData.paymentType !== 'iade_reddi' && (!formData.imei || !formData.imei.trim())) {
      errors.push('IMEI');
    }
    
    if (errors.length > 0) {
      toast.error(`Lütfen şu alanları doldurun: ${errors.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    setShowResults(false);
    
    try {
      // Aktif tetikleme API'lerini getir (cihaz tipi için)
      const response = await axios.get(`/api/courier-triggers/active/device/${formData.environment}/${formData.paymentType}`);
      const triggers = response.data.data;

      if (!triggers || triggers.length === 0) {
        toast.warning('Bu kombinasyon için tanımlı tetikleme API\'si bulunamadı!');
        return;
      }

      // Progress state'ini başlat
      setTriggerProgress({
        isActive: true,
        currentStep: 0,
        totalSteps: triggers.length,
        triggers: triggers,
        results: []
      });

      // Değişken değerlerini hazırla
      const variables = {
        customerOrder: formData.customerOrder,
        // LocalStorage'dan additional variables alabilir
        ...JSON.parse(localStorage.getItem('deviceVariables') || '{}')
      };

      // İade Reddi dışında IMEI ekle
      if (formData.paymentType !== 'iade_reddi') {
        variables.imei = formData.imei;
      }

      toast.loading(`${triggers.length} API tetikleniyor...`);
      let successCount = 0;
      let failureCount = 0;
      const results = [];

      // Her API'yi sırasıyla çağır
      for (let i = 0; i < triggers.length; i++) {
        const trigger = triggers[i];
        const startTime = Date.now();
        
        // Progress güncelle
        setTriggerProgress(prev => ({
          ...prev,
          currentStep: i + 1
        }));

        try {
          // Body'yi parse et ve değişkenleri değiştir
          let requestBody = null;
          if (trigger.body) {
            const bodyTemplate = typeof trigger.body === 'string' ? trigger.body : JSON.stringify(trigger.body);
            const processedBody = replaceVariables(bodyTemplate, variables);
            requestBody = JSON.parse(processedBody);
          }

          // Headers'ı parse et ve değişkenleri değiştir
          let requestHeaders = {
            'Content-Type': 'application/json'
          };
          if (trigger.headers) {
            const headersTemplate = typeof trigger.headers === 'string' ? trigger.headers : JSON.stringify(trigger.headers);
            const processedHeaders = replaceVariables(headersTemplate, variables);
            requestHeaders = { ...requestHeaders, ...JSON.parse(processedHeaders) };
          }

          // Endpoint'teki değişkenleri değiştir
          const endpoint = replaceVariables(trigger.endpoint, variables);

          console.log(`Tetikleniyor: ${trigger.api_name}`, {
            method: trigger.method,
            url: endpoint,
            data: requestBody,
            headers: requestHeaders
          });

          // API çağrısını proxy üzerinden yap (CORS bypass)
          const proxyResponse = await axios.post('/api/courier-triggers/proxy', {
            endpoint: endpoint,
            method: trigger.method,
            headers: requestHeaders,
            body: requestBody
          }, {
            timeout: 60000 // 60 saniye timeout
          });

          // Proxy response kontrol et
          // Backend'den gelen success flag'ini kontrol et
          if (!proxyResponse.data?.success) {
            const errorStatus = proxyResponse.data?.originalStatus || proxyResponse.data?.status || 'Unknown';
            throw new Error(proxyResponse.data?.message || `HTTP ${errorStatus}: API isteği başarısız`);
          }
          
          // Boş response'ları da başarılı kabul et
          const responseData = proxyResponse.data.data || {};
          const isEmpty = proxyResponse.data.isEmpty || false;

          // Validation script kontrolü
          if (trigger.validation_script && trigger.validation_script.trim() !== '') {
            try {
              // Script'i güvenli bir şekilde çalıştır
              const scriptFunction = new Function('response', 'status', 'headers', trigger.validation_script);
              const validationResult = scriptFunction(
                responseData, 
                proxyResponse.data.status, 
                proxyResponse.data.headers
              );

              if (!validationResult) {
                throw new Error(`Validation script başarısız: API cevabı beklendiği gibi değil`);
              }

              console.log(`✅ ${trigger.api_name} - Validation script başarılı`);
            } catch (scriptError) {
              console.error(`❌ ${trigger.api_name} - Validation script hatası:`, scriptError);
              throw new Error(`Validation script hatası: ${scriptError.message}`);
            }
          }

          const endTime = Date.now();
          const duration = endTime - startTime;

          // Başarılı sonuç kaydet
          const result = {
            trigger,
            success: true,
            response: {
              ...proxyResponse.data,
              isEmpty: isEmpty,
              data: responseData
            },
            duration,
            endpoint,
            timestamp: new Date().toISOString()
          };
          results.push(result);

          // Progress'e sonuç ekle
          setTriggerProgress(prev => ({
            ...prev,
            results: [...prev.results, result]
          }));

          successCount++;
          toast.success(`✅ ${trigger.api_name} başarılı (${duration}ms)`);
          
          // API'ler arasında kısa bekleme
          if (i < triggers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }

        } catch (apiError) {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // Hatalı sonuç kaydet
          const result = {
            trigger,
            success: false,
            error: apiError.response?.data?.message || apiError.message,
            duration,
            endpoint: replaceVariables(trigger.endpoint, variables),
            timestamp: new Date().toISOString()
          };
          results.push(result);

          // Progress'e sonuç ekle
          setTriggerProgress(prev => ({
            ...prev,
            results: [...prev.results, result]
          }));

          failureCount++;
          console.error(`${trigger.api_name} hatası:`, apiError);
          toast.error(`❌ ${trigger.api_name} başarısız: ${apiError.response?.data?.message || apiError.message}`);
          
          // API hatası durumunda işlemi durdur
          toast.error(`🛑 Tetikleme işlemi durduruldu: ${trigger.api_name} API'si başarısız oldu`);
          break; // Loop'u durdur
        }
      }

      // Progress'i tamamla ve sonuçları göster
      setTriggerProgress(prev => ({
        ...prev,
        isActive: false
      }));
      
      setShowResults(true);

      // Sonuç özeti
      const totalProcessed = successCount + failureCount;
      const wasInterrupted = totalProcessed < triggers.length;
      
      if (successCount > 0 && failureCount === 0) {
        toast.success(`🎉 Tüm tetiklemeler başarılı! (${successCount}/${triggers.length})`);
      } else if (failureCount > 0 && wasInterrupted) {
        toast.error(`🛑 Tetikleme durduruldu: ${successCount} başarılı, ${failureCount} başarısız (${totalProcessed}/${triggers.length} işlendi)`);
      } else if (successCount > 0) {
        toast.warning(`⚠️ Kısmi başarı: ${successCount} başarılı, ${failureCount} başarısız`);
      } else {
        toast.error(`💥 Tüm tetiklemeler başarısız! (${failureCount}/${triggers.length})`);
      }

    } catch (error) {
      console.error('Tetikleme hatası:', error);
      toast.error('Tetikleme API\'leri alınamadı: ' + (error.response?.data?.message || error.message));
      
      // Hata durumunda progress'i sıfırla
      setTriggerProgress({
        isActive: false,
        currentStep: 0,
        totalSteps: 0,
        triggers: [],
        results: []
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      environment: 'fonksiyonel',
      paymentType: 'temlikli',
      imei: '',
      customerOrder: ''
    });
  };

  return (
    <div className="modern-page">
      {/* Main Content */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Unified Form Card with Hero */}
            <div className="card shadow-lg border-0" style={{borderRadius: '25px', overflow: 'hidden'}}>
              {/* Enhanced Header with Hero Elements */}
              <div className="card-header text-center" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #3b82f6 100%)', 
                color: 'white', 
                padding: '3rem 2rem 2rem',
                position: 'relative'
              }}>
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3
                }}></div>
                
                {/* Hero Icon */}
                <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{
                  width: '80px', 
                  height: '80px', 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: '50%',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <i className="bi bi-phone" style={{fontSize: '2.5rem'}}></i>
                </div>
                
                {/* Hero Content */}
                <div style={{position: 'relative', zIndex: 2}}>
                  <h1 className="mb-3" style={{fontSize: '2.5rem', fontWeight: '700', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                    Cihaz Tetikleme Sistemi
                  </h1>
                  <p className="mb-4" style={{fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto'}}>
                    Cihaz süreçlerini tetiklemek için gerekli bilgileri girin
                  </p>
                  
                  {/* Decorative Elements */}
                  <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-gear-fill me-2"></i>
                      <span>Tetikleme Parametreleri</span>
                    </div>
                  </div>
                  
                  {/* Subtle Divider */}
                  <div style={{
                    width: '100px',
                    height: '3px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '2px',
                    margin: '0 auto'
                  }}></div>
                </div>
              </div>
              
              <div className="card-body" style={{padding: '2rem'}}>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Sol Sütun - Ortam ve Ödeme Tipi */}
                    <div className="col-lg-6">
                      {/* Ortam Seçimi */}
                      <div className="form-group mb-4">
                        <label className="form-label fw-bold mb-3">
                          <i className="bi bi-globe2 me-2 text-blue-500"></i>
                          Ortam Seçimi
                        </label>
                        <div className="row g-3">
                          {[
                            { value: 'fonksiyonel', label: 'Fonksiyonel', color: 'success', icon: 'bi-check-circle' },
                            { value: 'regresyon', label: 'Regresyon', color: 'warning', icon: 'bi-arrow-repeat' },
                            { value: 'hotfix', label: 'Hotfix', color: 'danger', icon: 'bi-lightning' }
                          ].map((env) => (
                            <div key={env.value} className="col-4">
                              <div 
                                className={`card text-center cursor-pointer transition-all ${formData.environment === env.value ? `border-${env.color} bg-${env.color} bg-opacity-10` : 'border-light'}`}
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  border: formData.environment === env.value ? '2px solid' : '1px solid #dee2e6',
                                  borderRadius: '12px'
                                }}
                                onClick={() => handleInputChange('environment', env.value)}
          >
                                <div className="card-body py-3">
                                  <i className={`${env.icon} fs-4 mb-2 d-block text-${env.color}`}></i>
                                  <small className="fw-medium">{env.label}</small>
                                  {formData.environment === env.value && (
                                    <div className="position-absolute top-0 end-0 translate-middle">
                                      <span className="badge bg-success rounded-circle p-1">
                                        <i className="bi bi-check" style={{fontSize: '10px'}}></i>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tetikleme Tipi Seçimi */}
                      <div className="form-group mb-4">
                        <label className="form-label fw-bold mb-3">
                          <i className="bi bi-gear me-2 text-purple-500"></i>
                          Tetikleme Tipi
                        </label>
                        <div className="row g-3">
                          {[
                            { value: 'temlikli', label: 'Temlikli', icon: 'bi-shield-check', desc: 'Taksitli ödeme süreçleri' },
                            { value: 'pesin', label: 'Peşin', icon: 'bi-cash-coin', desc: 'Peşin ödeme süreçleri' },
                            { value: 'iade_reddi', label: 'İade Reddi', icon: 'bi-x-octagon', desc: 'İade red süreçleri' }
                                                      ].map((payment) => (
                            <div key={payment.value} className="col-4">
                              <div 
                                className={`card text-center cursor-pointer h-100 d-flex ${formData.paymentType === payment.value ? 'border-primary bg-primary bg-opacity-10' : 'border-light'}`}
                                style={{
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  border: formData.paymentType === payment.value ? '2px solid #0d6efd' : '1px solid #dee2e6',
                                  borderRadius: '12px',
                                  minHeight: '120px'
                                }}
                                onClick={() => handleInputChange('paymentType', payment.value)}
                              >
                                <div className="card-body py-3 d-flex flex-column justify-content-center align-items-center">
                                  <i className={`${payment.icon} fs-3 mb-2 d-block text-primary`}></i>
                                  <div className="fw-medium small mb-1">{payment.label}</div>
                                  <div className="text-muted text-center" style={{fontSize: '11px', lineHeight: '1.2'}}>{payment.desc}</div>
                                  {formData.paymentType === payment.value && (
                                    <div className="position-absolute top-0 end-0 translate-middle">
                                      <span className="badge bg-primary rounded-circle p-1">
                                        <i className="bi bi-check" style={{fontSize: '10px'}}></i>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
        </div>

                    {/* Sağ Sütun - Input Alanları */}
                    <div className="col-lg-6">
                      {/* IMEI Alanı - İade Reddi'nde gizli */}
                      {formData.paymentType !== 'iade_reddi' && (
                        <div className="form-group mb-4">
                          <label className="form-label fw-bold">
                            <i className="bi bi-phone me-2 text-success"></i>
                            IMEI
                            <span className="text-danger ms-1">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text" style={{borderRadius: '12px 0 0 12px'}}>
                              <i className="bi bi-phone text-success"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control placeholder-lighter"
                              style={{borderRadius: '0 12px 12px 0'}}
                              value={formData.imei}
                              onChange={(e) => handleInputChange('imei', e.target.value)}
                              placeholder="123456789012345"
                            />
                          </div>
                          <div className="form-text">15 haneli IMEI numarasını girin</div>
                        </div>
                      )}

                      {/* Customer Order */}
                      <div className="form-group mb-4">
                        <label className="form-label fw-bold">
                          <i className="bi bi-receipt me-2 text-primary"></i>
                          Müşteri Sipariş No
                          <span className="text-danger ms-1">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text" style={{borderRadius: '12px 0 0 12px'}}>
                            <i className="bi bi-receipt text-primary"></i>
                          </span>
          <input
            type="text"
            className="form-control placeholder-lighter"
                            style={{borderRadius: '0 12px 12px 0'}}
                            value={formData.customerOrder}
                            onChange={(e) => handleInputChange('customerOrder', e.target.value)}
                            placeholder="ORD123456789"
          />
                        </div>
                        <div className="form-text">Müşteri sipariş numarasını girin</div>
        </div>


                    </div>
                  </div>

                  {/* Progress Section */}
                  {triggerProgress.isActive && (
                    <>
                      <hr className="my-4" />
                      <div className="progress-section mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h5 className="mb-0">
                            <i className="bi bi-gear-fill me-2 text-primary"></i>
                            API Tetikleme Durumu
                          </h5>
                          <span className="badge bg-primary">
                            {triggerProgress.currentStep} / {triggerProgress.totalSteps}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="progress mb-3" style={{height: '8px'}}>
                          <div 
                            className="progress-bar progress-bar-striped progress-bar-animated"
                            style={{width: `${(triggerProgress.currentStep / triggerProgress.totalSteps) * 100}%`}}
                          ></div>
                        </div>

                        {/* Current Triggers */}
                        <div className="row g-2">
                          {triggerProgress.triggers.map((trigger, index) => {
                            const result = triggerProgress.results.find(r => r.trigger.id === trigger.id);
                            const isCurrent = index + 1 === triggerProgress.currentStep;
                            const isCompleted = result !== undefined;
                            
                            return (
                              <div key={trigger.id} className="col-md-6 col-lg-4">
                                <div className={`card border-0 ${
                                  isCompleted 
                                    ? result.success ? 'bg-success bg-opacity-10 border-success' : 'bg-danger bg-opacity-10 border-danger'
                                    : isCurrent ? 'bg-primary bg-opacity-10 border-primary' : 'bg-light'
                                }`} style={{borderWidth: '2px!important'}}>
                                  <div className="card-body py-2 px-3">
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">
                                        {isCompleted ? (
                                          result.success ? (
                                            <i className="bi bi-check-circle-fill text-success"></i>
                                          ) : (
                                            <i className="bi bi-x-circle-fill text-danger"></i>
                                          )
                                        ) : isCurrent ? (
                                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                        ) : (
                                          <i className="bi bi-clock text-muted"></i>
                                        )}
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className="fw-medium small">{trigger.api_name}</div>
                                        <div className="text-muted" style={{fontSize: '11px'}}>
                                          {trigger.method} {trigger.endpoint}
                                        </div>
                                        {result && (
                                          <div className="text-muted" style={{fontSize: '10px'}}>
                                            {result.duration}ms
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Results Panel */}
                  {showResults && triggerProgress.results.length > 0 && (
                    <>
                      <hr className="my-4" />
                      <div className="results-section">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <h5 className="mb-0">
                            <i className="bi bi-list-check me-2 text-success"></i>
                            Tetikleme Sonuçları
                          </h5>
          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setShowResults(false)}
          >
                            <i className="bi bi-x-lg"></i>
          </button>
                        </div>

                        <div className="row g-3">
                          {triggerProgress.results.map((result, index) => (
                            <div key={index} className="col-12">
                              <div className={`card border-0 ${
                                result.success ? 'bg-success bg-opacity-5 border-success' : 'bg-danger bg-opacity-5 border-danger'
                              }`} style={{borderWidth: '1px!important'}}>
                                <div className="card-body">
                                  <div className="row align-items-center">
                                    <div className="col-md-8">
                                      <div className="d-flex align-items-center mb-2">
                                        <div className="me-3">
                                          {result.success ? (
                                            <i className="bi bi-check-circle-fill text-success fs-4"></i>
                                          ) : (
                                            <i className="bi bi-x-circle-fill text-danger fs-4"></i>
                                          )}
                                        </div>
                                        <div>
                                          <h6 className="mb-1">{result.trigger.api_name}</h6>
                                          <div className="text-muted small">
                                            <span className={`badge me-2 ${
                                              result.trigger.method === 'POST' ? 'bg-primary' : 
                                              result.trigger.method === 'GET' ? 'bg-success' : 'bg-warning'
                                            }`}>
                                              {result.trigger.method}
                                            </span>
                                            <code>{result.endpoint}</code>
                                          </div>
                                        </div>
                                      </div>
                                      {!result.success && (
                                        <div className="alert alert-danger py-2 mb-0">
                                          <small><strong>Hata:</strong> {result.error}</small>
                                        </div>
                                      )}
                                    </div>
                                    <div className="col-md-4 text-end">
                                      <div className="text-muted small">
                                        <div><strong>Süre:</strong> {result.duration}ms</div>
                                        <div><strong>Zaman:</strong> {new Date(result.timestamp).toLocaleTimeString('tr-TR')}</div>
                                                                                 {result.success && result.response?.status && (
                                           <div>
                                             <strong>Status:</strong> 
                                             <span className="badge bg-success me-1">{result.response.status}</span>
                                             {(result.response.status === 204 || result.response.isEmpty) && (
                                               <small className="text-muted">(No Content)</small>
                                             )}
                                           </div>
                                         )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-4 p-3 bg-light rounded">
                          <div className="row text-center">
                            <div className="col-4">
                              <div className="h4 mb-1 text-success">
                                {triggerProgress.results.filter(r => r.success).length}
                              </div>
                              <div className="small text-muted">Başarılı</div>
                            </div>
                            <div className="col-4">
                              <div className="h4 mb-1 text-danger">
                                {triggerProgress.results.filter(r => !r.success).length}
                              </div>
                              <div className="small text-muted">Başarısız</div>
                            </div>
                            <div className="col-4">
                              <div className="h4 mb-1 text-primary">
                                {Math.round(triggerProgress.results.reduce((acc, r) => acc + r.duration, 0) / triggerProgress.results.length)}ms
                              </div>
                              <div className="small text-muted">Ort. Süre</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Form Actions */}
                  <hr className="my-4" />
                  <div className="d-flex justify-content-between flex-wrap gap-3">
          <button
            type="button"
                      onClick={resetForm}
                      className="btn btn-outline-secondary d-flex align-items-center"
                      style={{borderRadius: '12px', padding: '0.75rem 1.5rem'}}
          >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Formu Temizle
          </button>
                    
          <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg d-flex align-items-center"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.75rem 2rem',
                        fontWeight: '600'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Kurye Tetiklemesini Başlat
                        </>
                      )}
          </button>
        </div>
      </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceActions;
