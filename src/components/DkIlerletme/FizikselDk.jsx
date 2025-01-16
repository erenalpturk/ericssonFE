import { useState } from 'react'
import { sendDkRequest, validateIccid, sendDocumentConfirmation, submitQuote, DK_STEPS } from '../../services/apiService'
import { API_CONFIG } from '../../services/config'

function FizikselDk({ environment, onApiCall }) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const getBaseUrl = () => {
        return API_CONFIG[environment].baseUrl
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const tid = formData.get('tid')
        const customerOrder = formData.get('customerOrder')
        const iccid = formData.get('iccid')

        if (!tid || !customerOrder || !iccid) {
            setError('Lütfen tüm alanları doldurun')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            // 1. KuryeAtandi - 27
            onApiCall(DK_STEPS.KURYE_ATANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.KURYE_ATANDI)

            // 2. RandevuOnaylandi - 25
            onApiCall(DK_STEPS.RANDEVU_ONAYLANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.RANDEVU_ONAYLANDI)

            // 3. KuryeYolaCikti - 30
            onApiCall(DK_STEPS.KURYE_YOLA_CIKTI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.KURYE_YOLA_CIKTI)

            // 4. KuryeUlasti - 31
            onApiCall(DK_STEPS.KURYE_ULASTI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.KURYE_ULASTI)

            // 5. SozlesmeOnayIslemiBasladi - 34
            onApiCall(DK_STEPS.SOZLESME_ONAY_ISLEMI_BASLADI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.SOZLESME_ONAY_ISLEMI_BASLADI)

            // 6. AcikRizaMetniOnayiBekliyor - 38
            onApiCall(DK_STEPS.ACIK_RIZA_METNI_ONAY_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.ACIK_RIZA_METNI_ONAY_BEKLIYOR)

            // 7. AcikRizaMetniOnaylandi - 21
            onApiCall(DK_STEPS.ACIK_RIZA_METNI_ONAYLANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.ACIK_RIZA_METNI_ONAYLANDI)

            // 8. SmsDogrulamaBekliyor - 35
            onApiCall(DK_STEPS.SMS_DOGRULAMA_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.SMS_DOGRULAMA_BEKLIYOR)

            // 9. SmsDogrulamaTamamlandi - 36
            onApiCall(DK_STEPS.SMS_DOGRULAMA_TAMAMLANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.SMS_DOGRULAMA_TAMAMLANDI)

            // 10. KimlikDogrulamaBekliyor - 19
            onApiCall(DK_STEPS.KIMLIK_DOGRULAMA_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.KIMLIK_DOGRULAMA_BEKLIYOR)

            // 11. KimlikDogrulamaTamamlandi - 9
            onApiCall(DK_STEPS.KIMLIK_DOGRULAMA_TAMAMLANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.KIMLIK_DOGRULAMA_TAMAMLANDI)

            // 12. CanlilikTestiBekliyor - 3
            onApiCall(DK_STEPS.CANLILIK_TESTI_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.CANLILIK_TESTI_BEKLIYOR)

            // 13. CanlilikTestiTamamlandi - 4
            onApiCall(DK_STEPS.CANLILIK_TESTI_TAMAMLANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.CANLILIK_TESTI_TAMAMLANDI)

            // 14. SelfieVideoBekliyor - 10
            onApiCall(DK_STEPS.SELFIE_VIDEO_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.SELFIE_VIDEO_BEKLIYOR)

            // 15. SelfieVideoTamamlanmadi - 18
            onApiCall(DK_STEPS.SELFIE_VIDEO_TAMAMLANMADI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.SELFIE_VIDEO_TAMAMLANMADI)

            // 16. DagitimBekliyor - 41
            onApiCall(DK_STEPS.DAGITIM_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.DAGITIM_BEKLIYOR)

            // 17. ICCID Doğrulama
            onApiCall('ICCID Doğrulama')
            await validateIccid(environment, tid, customerOrder, iccid)

            // 18. DagitimTamamlandi - 42
            onApiCall(DK_STEPS.DAGITIM_TAMAMLANDI.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.DAGITIM_TAMAMLANDI)

            // 19. SozlesmeOnayBekliyor - 12
            onApiCall(DK_STEPS.SOZLESME_ONAY_BEKLIYOR.name)
            await sendDkRequest(environment, tid, customerOrder, DK_STEPS.SOZLESME_ONAY_BEKLIYOR)

            // 20. Hsm - 57
            onApiCall(DK_STEPS.HSM.name)
            let lastResult = await sendDkRequest(environment, tid, customerOrder, DK_STEPS.HSM)

            // 21. Doküman onaylama
            onApiCall('Doküman Onaylama')
            await sendDocumentConfirmation(environment, tid, customerOrder)

            // 22. Quote submit
            onApiCall('Quote Submit')
            await submitQuote(environment, tid, customerOrder)

            setResult(lastResult)
            console.log('Son API Yanıtı:', lastResult)

        } catch (err) {
            setError(err.message)
            console.error('API Hatası:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h5 className="mb-3">Fiziksel Sim DK ile Teslim</h5>
            <div className="alert alert-info mb-3">
                <small>
                    <strong>Seçili Ortam:</strong> {environment} <br />
                    <strong>API URL:</strong> {getBaseUrl()}/asb-rest/shipment/digital/courier/notification
                </small>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="tid" className="form-label">TID:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="tid" 
                        name="tid"
                        placeholder="TID giriniz"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="iccid" className="form-label">ICCID:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="iccid" 
                        name="iccid"
                        placeholder="ICCID giriniz"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="customerOrder" className="form-label">Customer Order:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="customerOrder" 
                        name="customerOrder"
                        placeholder="Customer Order giriniz"
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
                        'İlerlet'
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
    )
}

export default FizikselDk 