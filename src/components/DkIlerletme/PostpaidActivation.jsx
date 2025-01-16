import { useState } from 'react'
import { getAuthToken, getIccid, validateIccid } from '../../services/apiService'

function PostpaidActivation({ environment, onApiCall }) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    // API'den gelecek değişkenler
    const [msisdn, setMsisdn] = useState('')
    const [tcFonk, setTcFonk] = useState('')
    const [birthDateFonk, setBirthDateFonk] = useState('')
    const [iccidPosFonk, setIccidPosFonk] = useState('')
    const [authorization, setAuthorization] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [customerOrder, setCustomerOrder] = useState('')

    // Sabit değişkenler
    const [fonkBaseUrl] = useState('https://omni-zone-bau.turktelekom.com.tr/OdfCommerceBackendTtgTest1')
    const [prod_ofr_id] = useState('400079751')
    const [completed] = useState(true)
    const [stopPostmanRunner] = useState(true)
    const [activationtype] = useState('fonkpos')
    const [user] = useState('siteoto')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const count = formData.get('count')

        if (!count || count <= 0) {
            setError('Lütfen geçerli bir aktivasyon sayısı girin')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            // Token al
            onApiCall('Token - auth FODB')
            const authToken = await getAuthToken(fonkBaseUrl)
            setAuthorization(authToken)

            // ICCID al
            onApiCall('ICCID Set')
            const iccid = await getIccid()
            setIccidPosFonk(iccid)

            // ICCID doğrula
            onApiCall('ICCID Sorgula')
            const validationResult = await validateIccid(fonkBaseUrl, authToken, iccid)
            
            if (validationResult.data?.generalParameterList) {
                const msisdnParam = validationResult.data.generalParameterList.find(
                    param => param.shortCode === 'aa_msisdn'
                )
                if (msisdnParam) {
                    setMsisdn(msisdnParam.value)
                }
            }

            setResult({ 
                message: `${count} adet aktivasyon başlatılacak`,
                currentState: {
                    msisdn,
                    tcFonk,
                    birthDateFonk,
                    iccidPosFonk: iccid,
                    authorization: authToken,
                    fonkBaseUrl,
                    customerId,
                    customerOrder,
                    prod_ofr_id,
                    completed,
                    stopPostmanRunner,
                    activationtype,
                    user
                }
            })

        } catch (err) {
            setError(err.message)
            console.error('API Hatası:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h5 className="mb-0">Postpaid Aktivasyon</h5>
                </div>
                <div className="card-body">
                    <div className="alert alert-info mb-3">
                        <small>
                            <strong>Seçili Ortam:</strong> {environment} <br />
                            <strong>Base URL:</strong> {fonkBaseUrl}
                        </small>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="count" className="form-label">Aktivasyon Sayısı:</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                id="count" 
                                name="count"
                                min="1"
                                placeholder="Çıkılacak aktivasyon sayısını giriniz"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" /> 
                                    İşleniyor...
                                </>
                            ) : (
                                'Aktivasyonları Başlat'
                            )}
                        </button>
                    </form>
                    
                    {error && (
                        <div className="alert alert-danger mt-3">
                            <strong>Hata:</strong> {error}
                        </div>
                    )}
                    
                    {result && (
                        <div className="alert alert-success mt-3">
                            <strong>Başarılı:</strong>
                            <pre className="mt-2 mb-0">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostpaidActivation 