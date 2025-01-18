import { useState } from 'react'
import { getAuthToken, getIccid, getMernis, checkBlackGreyList, inquireMernis, inquireMernisnalId, searchCustomer, checkNatId, validateMernisInfo, createCustomerWithNatId, inquireCustomerActiveLine, validateBlacklist, validateChannel, searchCustomerOrder, getCatalog, getOffering, retrieveOfferDetails, validateChannelWithOffer, initializeBusinessFlow, saveUserActionLog, retrieveMsisdnReservation, inquireStandardMsisdn, updateQuotePlan, getOngoingQuote, getCategorizedCharacteristics, validateIccid2, updateQuote, inquireDeputy, getAddressList, deputyCheckout, getSecurityQuestions, updateQuoteSecond, checkMsisdn, getContactInfo, inquireTariffType, sendDocumentToDFM, updateQuoteFourth, submitQuoteWithHeaders, sendResumeCallback, getDocuments, setIccidSold, addActivation } from '../../services/apiService'
import PropTypes from 'prop-types'

function PostpaidActivation({ environment, authToken, onApiCall }) {
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
           // onApiCall('ICCID Set')
          //  const iccid = await getIccid()
           // setIccidPosFonk(iccid)

            // MERNIS bilgisi al
            onApiCall('MERNIS Set')
            const mernis = await getMernis()
            setTcFonk(mernis)

            // Kara/Gri Liste Kontrolü
            onApiCall('checkBlackGreyList')
            await checkBlackGreyList(environment, authToken, mernis)

            // MERNIS Sorgulama (ilk istek - nalId olmadan)
            onApiCall('inquireMernis - İlk İstek')
            await inquireMernis(environment, authToken, mernis, birthDateFonk)

            // MERNIS Sorgulama (ikinci istek - nalId ile)
            onApiCall('inquireMernis - İkinci İstek')
            await inquireMernisnalId(environment, authToken, mernis, birthDateFonk)

            // Müşteri Arama
            onApiCall('search')
            await searchCustomer(environment, authToken, mernis)

            // TC Kimlik Kontrolü
            onApiCall('checkNatId')
            await checkNatId(environment, authToken, mernis)

            // MERNIS Bilgileri Doğrulama (serialNo ile)
            onApiCall('validateCustMernisInfo - serialNo')
            await validateMernisInfo(environment, authToken, mernis, "H11848581", "serialNo")

            // MERNIS Bilgileri Doğrulama (registrationNo ile)
            onApiCall('validateCustMernisInfo - registrationNo')
            await validateMernisInfo(environment, authToken, mernis, "43131", "registrationNo")

            // Müşteri Oluşturma
            onApiCall('createCustomerWithNatId')
            const customerResponse = await createCustomerWithNatId(environment, authToken, {
                natId: mernis,
                idNo: "H11848581",
                registrationNo: "43131",
                firstName: "EN***",
                lastName: "BU***",
                maidenName: "OoO",
                birthDate: "Tue Nov 27 1950 12:00:00 GMT+3 (GMT+03:00)",
                motherName: "S****",
                fatherName: "A*******",
                idTypeShrtCode: "INDNT"
            })
            
            // customerId'yi yanıttan al ve state'e kaydet
            if (customerResponse.data?.custId) {
                setCustomerId(customerResponse.data.custId)
            } else {
                throw new Error('Müşteri ID alınamadı')
            }

            // Aktif Hat Sorgulama
            onApiCall('inquireCustomerActiveLine')
            await inquireCustomerActiveLine(environment, authToken, customerResponse.data.custId)

            // Kara Liste Kontrolü
            onApiCall('blacklist')
            await validateBlacklist(environment, authToken, customerResponse.data.custId)

            // Kanal Doğrulama
            onApiCall('validateChannel')
            await validateChannel(environment, authToken, customerResponse.data.custId, "0775fba1-df3d-44b9-83b9-ceb19bf9936f")

            // Müşteri Siparişi Arama
            onApiCall('searchCustomerOrder')
            await searchCustomerOrder(environment, authToken, customerResponse.data.custId)

            // Katalog Sorgulama
            onApiCall('catalog')
            await getCatalog(environment, authToken)

            // Teklif Sorgulama
            onApiCall('offering')
            await getOffering(environment, authToken, customerResponse.data.custId)

            // Müşteri Siparişi Arama
            onApiCall('searchCustomerOrder')
            await searchCustomerOrder(environment, authToken, customerResponse.data.custId)

            // Teklif Detayları
            onApiCall('retrieveOfferDetails')
            await retrieveOfferDetails(environment, authToken, prod_ofr_id)

            // İkinci Kanal Doğrulama (teklif ile)
            onApiCall('validateChannel - with offer')
            await validateChannelWithOffer(
                environment, authToken, 
                customerResponse.data.custId, 
                "0775fba1-df3d-44b9-83b9-ceb19bf9936f",
                prod_ofr_id
            )

            // İş Akışı Başlatma
            onApiCall('initialize')
            const initializeResponse = await initializeBusinessFlow(
                environment, authToken,
                customerResponse.data.custId,
                iccid,
                prod_ofr_id
            )
            
            // customerOrderId'yi yanıttan al ve state'e kaydet
            if (initializeResponse.data?.quote?.customerOrderId) {
                setCustomerOrder(initializeResponse.data.quote.customerOrderId)
            } else {
                throw new Error('Müşteri sipariş ID alınamadı')
            }

            // Kullanıcı İşlem Logu Kaydet
            onApiCall('saveUserActionLog')
            await saveUserActionLog(environment, authToken, initializeResponse.data.quote.customerOrderId)

            // MSISDN Rezervasyon Sorgula
            onApiCall('retrieveMsisdnReservation')
            await retrieveMsisdnReservation(environment, authToken, customerResponse.data.custId)

            // Token Yenile
            onApiCall('Token - auth FODB (Yenileme)')
            const newAuthToken = await getAuthToken(fonkBaseUrl)
            setAuthorization(newAuthToken)

            // Standart MSISDN Sorgula
            onApiCall('inquireStandardMsisdn')
            const msisdnResponse = await inquireStandardMsisdn(environment, authToken)
            
            // Rastgele bir MSISDN seç ve state'e kaydet
            if (msisdnResponse.data?.length > 0) {
                const randomIndex = Math.floor(Math.random() * msisdnResponse.data.length)
                const randomMsisdn = msisdnResponse.data[randomIndex].msisdn.charValue
                setMsisdn(randomMsisdn)
            } else {
                throw new Error('MSISDN listesi boş')
            }

            // Quote Plan Güncelleme
            onApiCall('updateQuotePlan')
            await updateQuotePlan(
                environment,
                authToken,
                customerResponse.data.custId,
                initializeResponse.data.quote.customerOrderId,
                randomMsisdn,
                iccidPosFonk
            )
            // Devam Eden Quote Sorgula
            onApiCall('ongoingQuote')
            const ongoingQuoteResponse = await getOngoingQuote(
                environment,
                authToken,
                initializeResponse.data.quote.customerOrderId
            )

            onApiCall('categorizedCharacteristics - Son')
            await getCategorizedCharacteristics(environment, authToken, false)

            // Quote Karakteristik Doğrulama
            onApiCall('validateQuoteChar')
            await validateIccid2(environment, authToken, iccidPosFonk, prod_ofr_id, ongoingQuoteResponse.data)

            // Quote Güncelleme
            onApiCall('updateQuote')
            await updateQuote(environment, authToken, initializeResponse.data.quote.customerOrderId, ongoingQuoteResponse.data, customerId)

            // VKL Sorgulama
            onApiCall('inquireVkl')
            await inquireDeputy(environment, authToken, 'vkl', initializeResponse.data.quote.customerOrderId, customerResponse.data.custId)

            // Vasi Sorgulama
            onApiCall('inquireVasi')
            await inquireDeputy(environment, authToken, 'vasi', initializeResponse.data.quote.customerOrderId, customerResponse.data.custId)

            // İlk Adres Listeleri
            onApiCall('addressList - Billing')
            await getAddressList(environment, authToken, initializeResponse.data.quote.customerOrderId, 'Billing')

            onApiCall('addressList - Customer')
            await getAddressList(environment, authToken, initializeResponse.data.quote.customerOrderId, 'Customer')

            onApiCall('addressList - Shipment')
            await getAddressList(environment, authToken, initializeResponse.data.quote.customerOrderId, 'Shipment')

            // Line User Sorgulama
            onApiCall('inquireLineuser')
            await inquireDeputy(environment, authToken, 'lineuser', initializeResponse.data.quote.customerOrderId, customerResponse.data.custId)

            // Deputy Checkout
            onApiCall('deputyCheckout')
            await deputyCheckout(environment, authToken, initializeResponse.data.quote.customerOrderId, customerResponse.data.custId)

            // İkinci OngoingQuote Çağrısı
            onApiCall('ongoingQuote - İkinci İstek')
            await getOngoingQuote(environment, authToken, initializeResponse.data.quote.customerOrderId)

            // İkinci Adres Listeleri
            onApiCall('addressList - Billing (İkinci)')
            await getAddressList(environment, authToken, initializeResponse.data.quote.customerOrderId, 'Billing')

            onApiCall('addressList - Customer (İkinci)')
            await getAddressList(environment, authToken, initializeResponse.data.quote.customerOrderId, 'Customer')

            onApiCall('addressList - Shipment (İkinci)')
            await getAddressList(environment, authToken, initializeResponse.data.quote.customerOrderId, 'Shipment')
 
            // Son Karakteristik Kategorileri
            onApiCall('categorizedCharacteristics - Son')
            await getCategorizedCharacteristics(environment, authToken, true)

           // Güvenlik Soruları
           onApiCall('securityQuestions')
           await getSecurityQuestions(environment, authToken, customerResponse.data.custId)

            // İkinci Quote Güncelleme
            onApiCall('updateQuote - İkinci')
            await updateQuoteSecond(
                environment, authToken, 
                initializeResponse.data.quote.customerOrderId, 
                ongoingQuoteResponse.data
            )

            // Aktif Hat Sorgulama
            onApiCall('inquireCustomerActiveLine')
            await inquireCustomerActiveLine(environment, authToken, customerResponse.data.custId)

            // MSISDN Kontrol
            onApiCall('checkMsisdn')
            await checkMsisdn(environment, authToken, randomMsisdn)

            // İletişim Bilgisi Sorgulama
            onApiCall('contactInfo')
            const contactInfoResponse = await getContactInfo(environment, authToken, customerResponse.data.custId)

            // Tarife Tipi Sorgulama
            onApiCall('inquireTariffType')
            await inquireTariffType(environment, authToken, contactInfoResponse.data.gsmId)

            // DFM Doküman Gönderme
            onApiCall('sendDocumentToDFM')
            await sendDocumentToDFM(environment, authToken, initializeResponse.data.quote.customerOrderId, {
                emailId: contactInfoResponse.data.emailId,
                gsmId: contactInfoResponse.data.gsmId
            })

            // Dördüncü Quote Güncelleme
            onApiCall('updateQuote - Dördüncü')
            await updateQuoteFourth(
                environment, authToken, 
                initializeResponse.data.quote.customerOrderId, 
                ongoingQuoteResponse.data,
                customerId,
                prod_ofr_id,
                iccidPosFonk,
                msisdn
            )

            // Quote Submit
            onApiCall('submitQuote')
            await submitQuoteWithHeaders(
                environment,
                authToken,
                initializeResponse.data.quote.customerOrderId
            )

            // Kullanıcı İşlem Logu
            onApiCall('saveUserActionLog')
            await saveUserActionLog(environment, authToken, initializeResponse.data.quote.customerOrderId)

            // Resume Callback
            onApiCall('resumeCallback')
            await sendResumeCallback(environment, authToken, initializeResponse.data.quote.customerOrderId)

            // Dokümanlar
            onApiCall('documents')
            await getDocuments(environment, authToken, initializeResponse.data.quote.customerOrderId)

            // ICCID Sold
            onApiCall('iccidSold')
            await setIccidSold(authToken, iccid)

            // Aktivasyon Ekle
            onApiCall('addActivation')
            await addActivation(
                authToken,
                randomMsisdn,
                customerResponse.data.tckn,
                customerResponse.data.birthDate,
                'POSTPAID',
                'SİTEOTO'
            )

            setResult({ 
                message: `${count} adet aktivasyon başlatılacak`,
                currentState: {
                    msisdn,
                    tcFonk: mernis,
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
                            <strong>Seçili Ortam:</strong> {`${environment} - ${authToken}`} <br />
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

PostpaidActivation.propTypes = {
    environment: PropTypes.string.isRequired,
    onApiCall: PropTypes.func.isRequired
}

export default PostpaidActivation 