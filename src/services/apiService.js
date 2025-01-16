import { API_CONFIG, API_ENDPOINTS } from './config'

const createShipmentBody = (tid, customerOrder, state, status, statusID) => ({
    reqInfo: {
        transactionId: tid
    },
    event: {
        shipmentOrder: {
            relatedParty: [
                {
                    id: "",
                    role: "",
                    name: ""
                }
            ],
            orderItem: [
                {
                    shipment: {
                        shipmentItem: [
                            {
                                resource: {
                                    characteristic: [
                                        {
                                            name: "",
                                            value: ""
                                        }
                                    ],
                                    note: [
                                        {
                                            id: "",
                                            text: ""
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    id: customerOrder
                }
            ],
            id: customerOrder,
            state: state,
            trackingDetails: [
                {
                    id: "",
                    carrierTrackingUrl: "",
                    status: status,
                    statusID: statusID,
                    statusChangeDate: "2023-09-15T11:57:50+03:00"
                }
            ]
        }
    }
})

export const DK_STEPS = {
    KURYE_ATANDI: {
        name: 'KuryeAtandi - 27',
        state: 'KuryeAtandi',
        status: 'KuryeAtandi',
        statusID: '27'
    },
    RANDEVU_ONAYLANDI: {
        name: 'RandevuOnaylandi - 25',
        state: 'RandevuOnaylandi',
        status: 'RandevuOnaylandi',
        statusID: '25'
    },
    ACIK_RIZA_METNI_ONAY_BEKLIYOR: {
        name: 'AcikRizaMetniOnayiBekliyor - 38',
        state: 'AcikRizaMetniOnayiBekliyor',
        status: 'AcikRizaMetniOnayiBekliyor',
        statusID: '38'
    },
    KURYE_YOLA_CIKTI: {
        name: 'KuryeYolaCikti - 30',
        state: 'KuryeYolaCikti',
        status: 'KuryeYolaCikti',
        statusID: '30'
    },
    KURYE_ULASTI: {
        name: 'KuryeUlasti - 31',
        state: 'KuryeUlasti',
        status: 'KuryeUlasti',
        statusID: '31'
    },
    SOZLESME_ONAY_ISLEMI_BASLADI: {
        name: 'SozlesmeOnayIslemiBasladi - 34',
        state: 'SozlesmeOnayIslemiBasladi',
        status: 'SozlesmeOnayIslemiBasladi',
        statusID: '34'
    },
    ACIK_RIZA_METNI_ONAYLANDI: {
        name: 'AcikRizaMetniOnaylandi - 21',
        state: 'AcikRizaMetniOnaylandi',
        status: 'AcikRizaMetniOnaylandi',
        statusID: '21'
    },
    SMS_DOGRULAMA_BEKLIYOR: {
        name: 'SmsDogrulamaBekliyor - 35',
        state: 'SmsDogrulamaBekliyor',
        status: 'SmsDogrulamaBekliyor',
        statusID: '35'
    },
    SMS_DOGRULAMA_TAMAMLANDI: {
        name: 'SmsDogrulamaTamamlandi - 36',
        state: 'SmsDogrulamaTamamlandi',
        status: 'SmsDogrulamaTamamlandi',
        statusID: '36'
    },
    KIMLIK_DOGRULAMA_BEKLIYOR: {
        name: 'KimlikDogrulamaBekliyor - 19',
        state: 'KimlikDogrulamaBekliyor',
        status: 'KimlikDogrulamaBekliyor',
        statusID: '19'
    },
    KIMLIK_DOGRULAMA_TAMAMLANDI: {
        name: 'KimlikDogrulamaTamamlandi - 9',
        state: 'KimlikDogrulamaTamamlandi',
        status: 'KimlikDogrulamaTamamlandi',
        statusID: '9'
    },
    CANLILIK_TESTI_BEKLIYOR: {
        name: 'CanlilikTestiBekliyor - 3',
        state: 'CanlilikTestiBekliyor',
        status: 'CanlilikTestiBekliyor',
        statusID: '3'
    },
    CANLILIK_TESTI_TAMAMLANDI: {
        name: 'CanlilikTestiTamamlandi - 4',
        state: 'CanlilikTestiTamamlandi',
        status: 'CanlilikTestiTamamlandi',
        statusID: '4'
    },
    SELFIE_VIDEO_BEKLIYOR: {
        name: 'SelfieVideoBekliyor - 10',
        state: 'SelfieVideoBekliyor',
        status: 'SelfieVideoBekliyor',
        statusID: '10'
    },
    SELFIE_VIDEO_TAMAMLANMADI: {
        name: 'SelfieVideoTamamlanmadi - 18',
        state: 'SelfieVideoTamamlanmadi',
        status: 'SelfieVideoTamamlanmadi',
        statusID: '18'
    },
    DAGITIM_BEKLIYOR: {
        name: 'DagitimBekliyor - 41',
        state: 'DagitimBekliyor',
        status: 'DagitimBekliyor',
        statusID: '41'
    },
    DAGITIM_TAMAMLANDI: {
        name: 'DagitimTamamlandi - 42',
        state: 'DagitimTamamlandi',
        status: 'DagitimTamamlandi',
        statusID: '42'
    },
    SOZLESME_ONAY_BEKLIYOR: {
        name: 'SozlesmeOnayBekliyor - 12',
        state: 'SozlesmeOnayBekliyor',
        status: 'SozlesmeOnayBekliyor',
        statusID: '12'
    },
    HSM: {
        name: 'Hsm - 57',
        state: 'Hsm',
        status: 'Hsm',
        statusID: '57'
    }
}

export const sendDkRequest = async (environment, tid, customerOrder, step) => {
    const baseUrl = API_CONFIG[environment].baseUrl
    const endpoint = API_ENDPOINTS.courierNotification
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            createShipmentBody(
                tid, 
                customerOrder, 
                step.state, 
                step.status, 
                step.statusID
            )
        )
    })

    if (!response.ok) {
        throw new Error(`${step.name} API isteği başarısız: ${response.status}`)
    }

    return response.json()
}

export const validateIccid = async (environment, tid, customerOrder, iccid) => {
    const baseUrl = API_CONFIG[environment].baseUrl
    const endpoint = API_ENDPOINTS.validateIccid
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reqInfo: {
                transactionId: tid,
                callingSystem: "DIJITALKURYE"
            },
            customerOrderId: customerOrder,
            iccid: iccid
        })
    })

    if (!response.ok) {
        throw new Error(`ICCID doğrulama isteği başarısız: ${response.status}`)
    }

    return response.json()
}

export const sendDocumentConfirmation = async (environment, tid, customerOrder) => {
    const baseUrl = API_CONFIG[environment].baseUrl
    const endpoint = API_ENDPOINTS.documentConfirmation
    const url = `${baseUrl}${endpoint}`

    const currentDate = new Date().toLocaleDateString('tr-TR')
    const currentDateTime = `${currentDate} 00:00:00`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            generalParameterList: [
                {
                    shortCode: "ORDERNUMBER",
                    value: customerOrder
                },
                {
                    shortCode: "CHANNEL_NAME",
                    value: "DIJITAL_KURYE"
                },
                {
                    shortCode: "PROCESS_COMPLETE_STATUS",
                    value: "Scriptli Video"
                },
                {
                    shortCode: "VERIFIED_IDENTITY_TYPE",
                    value: "TC ÇİPLİ KİMLİK KARTI"
                },
                {
                    shortCode: "COURIER_CONFIRMATION_DATE",
                    value: currentDateTime
                },
                {
                    shortCode: "COURIER_CONFIRMATION_REJECT_DATE",
                    value: null
                },
                {
                    shortCode: "TRANSACTION_USER",
                    value: "BAYRAM AKBUZ"
                },
                {
                    shortCode: "PROCESS_COMPLETION_DATE",
                    value: currentDate
                },
                {
                    shortCode: "FAILED_TRANSACTION_REASON",
                    value: null
                },
                {
                    shortCode: "CANCEL_REASON",
                    value: null
                },
                {
                    shortCode: "ID_SERIAL_NO",
                    value: "U07547461"
                }
            ],
            txnId: tid,
            orderStatus: "COMPLETE"
        })
    })

    if (!response.ok) {
        throw new Error(`Doküman onaylama isteği başarısız: ${response.status}`)
    }

    return response.json()
}

export const submitQuote = async (environment, tid, customerOrder) => {
    const baseUrl = API_CONFIG[environment].baseUrl
    const endpoint = API_ENDPOINTS.submitQuote
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reqInfo: {
                transactionId: tid,
                callingSystem: "DIJITALKURYE"
            },
            customerOrderId: customerOrder
        })
    })

    if (!response.ok) {
        throw new Error(`Quote submit isteği başarısız: ${response.status}`)
    }

    return response.json()
} 