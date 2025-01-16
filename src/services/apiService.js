import { API_CONFIG, API_ENDPOINTS, EXTERNAL_ENDPOINTS } from './config'

const commonHeaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'User-Agent': 'PostmanRuntime/7.43.0'
}

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
        headers: commonHeaders,
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

export const validateIccid = async (baseUrl, authToken, iccid) => {
    const endpoint = API_ENDPOINTS.iccidValidate
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        },
        body: JSON.stringify({
            "businessFlowInitializerRequest": {},
            "odfOfferCharacteristicsRequests": [
                {
                    "charCode": "aa_iccid",
                    "charId": "291150",
                    "charVal": iccid,
                    "dataTpId": "111",
                    "rowId": "171190",
                    "productOfferId": "400041110"
                }
            ],
            "quote": {
        "referenceNo": "DQngYUjp8MOvPTFr/R7EVAZD+GgeYRMqjV/qFnFtYUphuecuSDitl/CRHuB9a0cHJZLk9yRotI5h0fcxhdPk8ugL7cwsomeM4bxOmUKLs6XKnCD/OV6Agcxbx3jt7G9ZF7xFNdhNcqAmWfNF54dRSZvc2aGhvkjL6h8QJxGs4rVMahj2NorSm/rMRzC6gD/Orm3Ojf01vcd9pwHl7kDiVBMa6QyUTmcvrf+daJmod6ML9Hj70pzo643nhn+WPzxBo1vz2t8bpClBzAOiBHwJBumSrMrJ2w122mroXxofcZLZSJuaAdRt9nTHkMHf3e3bA05veyi4mTnjbNgr5tBNJg==",
        "customerOrderId": 69115,
        "offerInstances": [
            {
                "customerOrderItemId": -2,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400041110,
                    "offerName": "Ailece 15GB Tarifesi",
                    "description": "Ailece 15GB Tarifesi",
                    "contractName": "Ailece 15GB Tarifesi",
                    "offerStatus": "Aktif",
                    "bundle": true,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [
                        {
                            "type": "PICTURE",
                            "mediaUrl": "https://bireysel.turktelekom.com.tr/mobil/web/tarife-ve-paketler/sayfalar/ailece-15gb-tarifesi-mevcut.aspx",
                            "name": "Ailece 15GB Tarifesi",
                            "targetUrl": "https://bireysel.turktelekom.com.tr/mobil/web/tarife-ve-paketler/sayfalar/ailece-15gb-tarifesi-mevcut.aspx",
                            "priority": 300
                        }
                    ],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 141100,
                    "virtual": false,
                    "componentGroupReferenceList": [
                        {
                            "componentGroupId": 513,
                            "shortCode": "COMPNT_GRP_1783",
                            "bundleProductOfferId": 400041110
                        }
                    ],
                    "checkServiceAvailable": false,
                    "contentType": {
                        "id": 1003000007,
                        "shortCode": "internetBundle",
                        "entityCodeName": "BUNDLE_CONTENT_TP",
                        "entityName": "PROD_OFR",
                        "resourceKey": "GNL_TP_1003000007",
                        "sortId": 0,
                        "externalShortCode": "internetBundle",
                        "externalShortCodeWithRollbackValue": "internetBundle"
                    },
                    "saleType": {
                        "id": 8,
                        "name": "Post Paid tr",
                        "description": "Post Paid tr",
                        "shortCode": "POST_PAID",
                        "entityCodeName": "PROD_OFR_SALES_TP",
                        "entityName": "PROD_OFR",
                        "resourceKey": "GNL_TP_8",
                        "sortId": 0,
                        "externalShortCode": "POST_PAID",
                        "externalShortCodeWithRollbackValue": "POST_PAID"
                    }
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "customer": {
                    "custId": 437130,
                    "name": "AHMET",
                    "surname": "MEHTAP"
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317105047,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [
                    {
                        "customerOrderItemId": -3,
                        "quoteKey": {
                            "customerOrderId": 69115
                        },
                        "productOffer": {
                            "productOfferId": 400041109,
                            "offerName": "Ailece 15GB Tarifesi",
                            "description": "Ailece 15GB Tarifesi",
                            "contractName": "Ailece 15GB Tarifesi",
                            "offerStatus": "Aktif",
                            "bundle": false,
                            "quoteTemplate": false,
                            "offerType": "POFFR",
                            "productOfferPrices": [
                                {
                                    "priceId": 5017670,
                                    "priceName": "Tarife dummy price",
                                    "offerChargeType": "RECURRING",
                                    "externalOfferChargeType": 2,
                                    "shortCode": "RECURRING",
                                    "tariffOriginalPriceValue": 111.17,
                                    "priceValue": 111.17,
                                    "calculatedPriceValue": 111.17,
                                    "taxPriceValue": 111.17,
                                    "taxCalculatedPriceValue": 111.17,
                                    "currency": {
                                        "curId": 2,
                                        "currencyCode": "CAD"
                                    },
                                    "priceCoefficient": 0,
                                    "taxInfos": [],
                                    "externalTariffId": 5017670,
                                    "description": "Tarife dummy price",
                                    "keyword": "s"
                                }
                            ],
                            "vendorKey": {
                                "vendorId": 0
                            },
                            "supplierKey": {
                                "supplierId": 0
                            },
                            "medias": [],
                            "discounts": [],
                            "quickAddSupported": false,
                            "favor": false,
                            "charValueProductOfferRelations": [],
                            "temporaryOffer": false,
                            "installmentRequired": false,
                            "shipmentRequired": false,
                            "quantityEnabled": false,
                            "productSpecId": 413983511,
                            "virtual": false,
                            "familyDefinition": {
                                "productSpecId": 413983511,
                                "family": {
                                    "productSpecFamilyId": 500001,
                                    "shortCode": "ALLTARIFF",
                                    "sortId": 1,
                                    "name": "Tüm Satılabilir Tarifeler",
                                    "description": "Tüm Satılabilir Tarifeler",
                                    "categories": [
                                        {
                                            "productSpecFamilyCategoryId": 5024,
                                            "shortCode": "tariff",
                                            "name": "Satılabilir Tarifeler",
                                            "description": "Satılabilir Tarifeler",
                                            "equipment": false
                                        }
                                    ]
                                },
                                "familyCategory": {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                },
                                "familySubcategory": {
                                    "productSpecFamilySubcategoryId": 545,
                                    "shortCode": "tariff_sub1",
                                    "primary": false,
                                    "secondary": false,
                                    "name": "Satılabilir Tarifeler Alt Grup 1",
                                    "description": "Satılabilir Tarifeler Alt Grup 1"
                                },
                                "familyOperationList": [
                                    {
                                        "productSpecFamilyOperationId": 5,
                                        "shortCode": "view_detail",
                                        "name": "view_detail",
                                        "description": "view_detail"
                                    }
                                ],
                                "valid": true
                            },
                            "componentGroupReferenceList": [],
                            "serviceSpecKey": {
                                "serviceSpecId": 211450,
                                "serviceCode": "postpaid_basic_telco",
                                "networkServiceCode": "postpaid_basic_telco",
                                "name": "Postpaid Basic Telco Servisi"
                            },
                            "checkServiceAvailable": false
                        },
                        "quantity": 1,
                        "user": {
                            "userId": 1128958,
                            "name": "DİLEK MARİA",
                            "saleCnlId": 1109,
                            "saleCnlName": "BAYI",
                            "employeeId": 7782679,
                            "employeeNumber": "7782679",
                            "preferredCollation": "en",
                            "userType": "CSR",
                            "userScreenName": "DİLEK MARİA",
                            "employeeName": "DİLEK MARİA",
                            "employeeFirstName": "DİLEK",
                            "id": 1128958
                        },
                        "customer": {
                            "custId": 437130,
                            "name": "AHMET",
                            "surname": "MEHTAP"
                        },
                        "channel": {
                            "channelId": 1109,
                            "name": "BAYİ",
                            "shortCode": "BAYI",
                            "anonymous": false
                        },
                        "createDate": 1716317105047,
                        "status": "QUOTE",
                        "prices": [
                            {
                                "priceId": 5017670,
                                "priceName": "Tarife dummy price",
                                "offerChargeType": "RECURRING",
                                "shortCode": "RECURRING",
                                "tariffOriginalPriceValue": 111.17,
                                "priceValue": 111.17,
                                "calculatedPriceValue": 111.17,
                                "taxPriceValue": 111.17,
                                "taxCalculatedPriceValue": 111.17,
                                "priceCoefficient": 0,
                                "currency": {
                                    "curId": 2,
                                    "currencyCode": "CAD"
                                },
                                "totalCalculatedPriceValue": 111.17,
                                "totalTaxCalculatedPriceValue": 111.17,
                                "taxInfos": [],
                                "externalTariffId": 5017670,
                                "discountAppliedCalculatedPriceValue": 111.17,
                                "discountAppliedTaxCalculatedPriceValue": 111.17,
                                "externalTaxablePriceApplied": false,
                                "installmentPlans": []
                            }
                        ],
                        "discounts": [],
                        "subItems": [],
                        "actionCode": "ACTIVATION",
                        "selected": true,
                        "removable": true,
                        "offerInstanceInvolvements": [],
                        "quantityEnabled": false,
                        "unsubscribed": false,
                        "reactivated": false,
                        "installmentRequired": false,
                        "shipmentRequired": false,
                        "appointmentRequired": false,
                        "oliAddedType": "STATIC_OLI",
                        "chargable": true,
                        "referenceOrderItemId": 0,
                        "virtual": false,
                        "involvementManageManually": false,
                        "notRefreshPrice": false,
                        "name": "Ailece 15GB Tarifesi",
                        "documents": [],
                        "productChars": [
                            {
                                "capturedValue": {
                                    "charId": 61335,
                                    "charShortCode": "HERYONE_DK",
                                    "charValueId": 61190,
                                    "shortCode": "HERYONE_DK",
                                    "charValue": "5000",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61335,
                                "shortCode": "HERYONE_DK",
                                "charName": "Her Yöne dakika kullanım süresi",
                                "description": "Her Yöne dakika kullanım süresi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61335,
                                        "charShortCode": "HERYONE_DK",
                                        "charValueId": 61190,
                                        "shortCode": "HERYONE_DK",
                                        "charValue": "5000",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61514,
                                    "charShortCode": "HERYONE_SMS",
                                    "charValueId": 61191,
                                    "shortCode": "HERYONE_SMS",
                                    "charValue": "SINIRSIZ",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61514,
                                "shortCode": "HERYONE_SMS",
                                "charName": "Her Yöne sms kullanım adedi",
                                "description": "Her Yöne sms kullanım adedi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61514,
                                        "charShortCode": "HERYONE_SMS",
                                        "charValueId": 61191,
                                        "shortCode": "HERYONE_SMS",
                                        "charValue": "SINIRSIZ",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61515,
                                    "charShortCode": "DATA_MB",
                                    "charValueId": 61192,
                                    "shortCode": "DATA_MB",
                                    "charValue": "15360",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61515,
                                "shortCode": "DATA_MB",
                                "charName": "Kullanılabilir data",
                                "description": "Kullanılabilir data",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61515,
                                        "charShortCode": "DATA_MB",
                                        "charValueId": 61192,
                                        "shortCode": "DATA_MB",
                                        "charValue": "15360",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61516,
                                    "charShortCode": "ONNET_DK",
                                    "charValueId": 61193,
                                    "shortCode": "ONNET_DK",
                                    "charValue": "0",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61516,
                                "shortCode": "ONNET_DK",
                                "charName": "Şebeke içi dakika kullanım süresi",
                                "description": "Şebeke içi dakika kullanım süresi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61516,
                                        "charShortCode": "ONNET_DK",
                                        "charValueId": 61193,
                                        "shortCode": "ONNET_DK",
                                        "charValue": "0",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61517,
                                    "charShortCode": "PSTN_DK",
                                    "charValueId": 61194,
                                    "shortCode": "PSTN_DK",
                                    "charValue": "0",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61517,
                                "shortCode": "PSTN_DK",
                                "charName": "Sabit hat arama kullanım süresi",
                                "description": "Sabit hat arama kullanım süresi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61517,
                                        "charShortCode": "PSTN_DK",
                                        "charValueId": 61194,
                                        "shortCode": "PSTN_DK",
                                        "charValue": "0",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61518,
                                    "charShortCode": "INTERCOM_DK",
                                    "charValueId": 61195,
                                    "shortCode": "INTERCOM_DK",
                                    "charValue": "SINIRSIZ",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61518,
                                "shortCode": "INTERCOM_DK",
                                "charName": "Intercom kullanım süresi",
                                "description": "Intercom kullanım süresi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61518,
                                        "charShortCode": "INTERCOM_DK",
                                        "charValueId": 61195,
                                        "shortCode": "INTERCOM_DK",
                                        "charValue": "SINIRSIZ",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61519,
                                    "charShortCode": "ONNET_SMS",
                                    "charValueId": 61196,
                                    "shortCode": "ONNET_SMS",
                                    "charValue": "0",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61519,
                                "shortCode": "ONNET_SMS",
                                "charName": "Şebeke içi sms kullanım adedi",
                                "description": "Şebeke içi sms kullanım adedi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61519,
                                        "charShortCode": "ONNET_SMS",
                                        "charValueId": 61196,
                                        "shortCode": "ONNET_SMS",
                                        "charValue": "0",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 61520,
                                    "charShortCode": "OTHER",
                                    "charValueId": 61197,
                                    "shortCode": "OTHER",
                                    "charValue": "Uzaktan Egitim Paketi (EBA+YOK) - 8192 MB",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 61520,
                                "shortCode": "OTHER",
                                "charName": "Diğer",
                                "description": "Diğer",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 61520,
                                        "charShortCode": "OTHER",
                                        "charValueId": 61197,
                                        "shortCode": "OTHER",
                                        "charValue": "Uzaktan Egitim Paketi (EBA+YOK) - 8192 MB",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": true,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291080,
                                    "charShortCode": "aa_tariff_segment",
                                    "charValueId": 646140,
                                    "shortCode": "MASS",
                                    "charValue": "MASS",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "MASS",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 291080,
                                "shortCode": "aa_tariff_segment",
                                "charName": "Tarife segmenti",
                                "description": "Tarife segmenti",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291080,
                                        "charShortCode": "aa_tariff_segment",
                                        "charValueId": 646140,
                                        "shortCode": "MASS",
                                        "charValue": "MASS",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "MASS",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291100,
                                    "charShortCode": "aa_threshold_for_tariff_change",
                                    "charValueId": 639750,
                                    "shortCode": "EMPTY",
                                    "charValue": "31",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 291100,
                                "shortCode": "aa_threshold_for_tariff_change",
                                "charName": "Tarife Değişikliği için Beklenecek Minimum Gün Sayısı",
                                "description": "Tarife Değişikliği için Beklenecek Minimum Gün Sayısı",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291100,
                                        "charShortCode": "aa_threshold_for_tariff_change",
                                        "charValueId": 639750,
                                        "shortCode": "EMPTY",
                                        "charValue": "31",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291280,
                                    "charShortCode": "aa_tariff_type",
                                    "charValueId": 639950,
                                    "shortCode": "SES,SMS,DATA",
                                    "charValue": "SES,SMS,DATA",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Ses,Sms,Data",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 291280,
                                "shortCode": "aa_tariff_type",
                                "charName": "Tarife Tipi",
                                "description": "Tarife Tipi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291280,
                                        "charShortCode": "aa_tariff_type",
                                        "charValueId": 639950,
                                        "shortCode": "SES,SMS,DATA",
                                        "charValue": "SES,SMS,DATA",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Ses,Sms,Data",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291350,
                                    "charShortCode": "aa_tmcode",
                                    "charValueId": 640350,
                                    "shortCode": "EMPTY",
                                    "charValue": "1783",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Postpaid Tarife",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 291350,
                                "shortCode": "aa_tmcode",
                                "charName": "Tmcode",
                                "description": "Tmcode",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291350,
                                        "charShortCode": "aa_tmcode",
                                        "charValueId": 640350,
                                        "shortCode": "EMPTY",
                                        "charValue": "1783",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Postpaid Tarife",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 293660,
                                    "charShortCode": "aa_mvno_name",
                                    "charValueId": 645130,
                                    "shortCode": "0",
                                    "charValue": "AVEA",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "TT Mobil",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 293660,
                                "shortCode": "aa_mvno_name",
                                "charName": "MVNO Bilgisi",
                                "description": "MVNO",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 293660,
                                        "charShortCode": "aa_mvno_name",
                                        "charValueId": 645130,
                                        "shortCode": "0",
                                        "charValue": "AVEA",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "TT Mobil",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 294630,
                                    "charShortCode": "aa_sncode_64",
                                    "charValueId": 643970,
                                    "shortCode": "TRUE",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Evet",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 294630,
                                "shortCode": "aa_sncode_64",
                                "charName": "Sncode 64",
                                "description": "Sncode 64",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 294630,
                                        "charShortCode": "aa_sncode_64",
                                        "charValueId": 643970,
                                        "shortCode": "TRUE",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 294640,
                                    "charShortCode": "aa_sncode_65",
                                    "charValueId": 50013605,
                                    "shortCode": "TRUE",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Evet",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 294640,
                                "shortCode": "aa_sncode_65",
                                "charName": "Sncode 65",
                                "description": "Sncode 65",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 294640,
                                        "charShortCode": "aa_sncode_65",
                                        "charValueId": 50013605,
                                        "shortCode": "TRUE",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 3346124,
                                    "charShortCode": "aa_sms_trf_chg_keyword",
                                    "charValueId": 50059148,
                                    "shortCode": "aa_sms_trf_chg_keyword",
                                    "charValue": "AILECE 15GB",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Tarife Değişikliği SMS Keyword",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3346124,
                                "shortCode": "aa_sms_trf_chg_keyword",
                                "charName": "Tarife Değişikliği SMS Keyword",
                                "description": "Tarife Değişikliği SMS Keyword",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3346124,
                                        "charShortCode": "aa_sms_trf_chg_keyword",
                                        "charValueId": 50059148,
                                        "shortCode": "aa_sms_trf_chg_keyword",
                                        "charValue": "AILECE 15GB",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Tarife Değişikliği SMS Keyword",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 293650,
                                    "charShortCode": "aa_price_group",
                                    "charValueId": 0,
                                    "shortCode": "14",
                                    "charValue": "14",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Bakanlıklar",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 293650,
                                "shortCode": "aa_price_group",
                                "charName": "Müsteri Grubu",
                                "description": "Müsteri Grubu",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "14",
                                        "charValue": "14",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Bakanlıklar",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "15",
                                        "charValue": "15",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Bankalar",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "1",
                                        "charValue": "1",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Normal",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "105",
                                        "charValue": "105",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "TTNET FATURALI",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "17",
                                        "charValue": "17",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Kamu Kurumları",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "18",
                                        "charValue": "18",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Dernekler/Birlikler/Odalar",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "20",
                                        "charValue": "20",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Üniversite",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 293650,
                                        "charShortCode": "aa_price_group",
                                        "charValueId": 0,
                                        "shortCode": "13",
                                        "charValue": "13",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Institutional TT Mobil",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "LIST",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3346161,
                                    "charShortCode": "aa_voice_bill",
                                    "charValueId": 50075862,
                                    "shortCode": "FALSE",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3346161,
                                "shortCode": "aa_voice_bill",
                                "charName": "Fatura bilgilendirmeleri sesli yapılsın",
                                "description": "Fatura bilgilendirmeleri sesli yapılsın",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3346161,
                                        "charShortCode": "aa_voice_bill",
                                        "charValueId": 50075862,
                                        "shortCode": "FALSE",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 3346161,
                                        "charShortCode": "aa_voice_bill",
                                        "charValueId": 50075863,
                                        "shortCode": "TRUE",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3346162,
                                    "charShortCode": "aa_voice_tariff",
                                    "charValueId": 50075864,
                                    "shortCode": "FALSE",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3346162,
                                "shortCode": "aa_voice_tariff",
                                "charName": "Tarife bilgilendirmeleri sesli yapılsın",
                                "description": "Tarife bilgilendirmeleri sesli yapılsın",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3346162,
                                        "charShortCode": "aa_voice_tariff",
                                        "charValueId": 50075864,
                                        "shortCode": "FALSE",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 3346162,
                                        "charShortCode": "aa_voice_tariff",
                                        "charValueId": 50075865,
                                        "shortCode": "TRUE",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3346163,
                                    "charShortCode": "aa_voice_inter",
                                    "charValueId": 50075866,
                                    "shortCode": "FALSE",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3346163,
                                "shortCode": "aa_voice_inter",
                                "charName": "Yurt dışı bilgilendirmeleri sesli yapılsın",
                                "description": "Yurt dışı bilgilendirmeleri sesli yapılsın",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3346163,
                                        "charShortCode": "aa_voice_inter",
                                        "charValueId": 50075866,
                                        "shortCode": "FALSE",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 3346163,
                                        "charShortCode": "aa_voice_inter",
                                        "charValueId": 50075867,
                                        "shortCode": "TRUE",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290620,
                                    "charShortCode": "msisdn",
                                    "charValueId": 638960,
                                    "shortCode": "msisdn",
                                    "charValue": "5010042487",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 290620,
                                "shortCode": "msisdn",
                                "charName": "MSISDN",
                                "description": "Seçilen Telefon Numarası",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290620,
                                        "charShortCode": "msisdn",
                                        "charValueId": 638960,
                                        "shortCode": "msisdn",
                                        "charValue": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 290630,
                                    "charShortCode": "aa_intcall",
                                    "charValueId": 50000359,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290630,
                                "shortCode": "aa_intcall",
                                "charName": "Hattım yurtdışına arama yapmaya açık olsun.",
                                "description": "Hattım yurtdışına arama yapmaya açık olsun.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290630,
                                        "charShortCode": "aa_intcall",
                                        "charValueId": 50000359,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 290630,
                                        "charShortCode": "aa_intcall",
                                        "charValueId": 50000360,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290680,
                                    "charShortCode": "aa_2g_only",
                                    "charValueId": 50000370,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290680,
                                "shortCode": "aa_2g_only",
                                "charName": "Sadece 2G hizmetinden yararlanmak istiyorum.",
                                "description": "Sadece 2G hizmetinden yararlanmak istiyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290680,
                                        "charShortCode": "aa_2g_only",
                                        "charValueId": 50000370,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 290680,
                                        "charShortCode": "aa_2g_only",
                                        "charValueId": 50000369,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.OdfPackageFourGsmGenerationControlValidator",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": true,
                                "effectsPrice": false,
                                "effectsTo": [
                                    {
                                        "charId": 3345855,
                                        "shortCode": "aa_3g",
                                        "charName": "3G hizmetlerinden yararlanmak istiyorum.",
                                        "effectTypeShrtCode": "SET",
                                        "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                        "effectCharVal": {
                                            "charValId": 50000369,
                                            "val": "true",
                                            "shrtCode": "true"
                                        },
                                        "effectedCharValues": [
                                            {
                                                "charValId": 50031737,
                                                "val": "false",
                                                "shrtCode": "false"
                                            }
                                        ]
                                    },
                                    {
                                        "charId": 3345856,
                                        "shortCode": "aa_4g",
                                        "charName": "4.5G hizmetlerinden yararlanmak istiyorum.",
                                        "effectTypeShrtCode": "SET",
                                        "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                        "effectCharVal": {
                                            "charValId": 50000369,
                                            "val": "true",
                                            "shrtCode": "true"
                                        },
                                        "effectedCharValues": [
                                            {
                                                "charValId": 50031739,
                                                "val": "false",
                                                "shrtCode": "false"
                                            }
                                        ]
                                    }
                                ],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290690,
                                    "charShortCode": "aa_cust_share",
                                    "charValueId": 50000372,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290690,
                                "shortCode": "aa_cust_share",
                                "charName": "Kişisel bilgilerim paylaşılsın(Sadece TTMobil)",
                                "description": "Kişisel bilgilerim paylaşılsın(Sadece TTMobil)",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290690,
                                        "charShortCode": "aa_cust_share",
                                        "charValueId": 50000372,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 290690,
                                        "charShortCode": "aa_cust_share",
                                        "charValueId": 50000371,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290730,
                                    "charShortCode": "aa_line_clsd_doc",
                                    "charValueId": 50000377,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290730,
                                "shortCode": "aa_line_clsd_doc",
                                "charName": "Hat kapama belgesi var mı?",
                                "description": "Hat kapama belgesi var mı?",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290730,
                                        "charShortCode": "aa_line_clsd_doc",
                                        "charValueId": 50000378,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 290730,
                                        "charShortCode": "aa_line_clsd_doc",
                                        "charValueId": 50000377,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [
                                    {
                                        "charId": 290770,
                                        "shortCode": "aa_old_msisdn",
                                        "charName": "Eski Telefon Numarası",
                                        "effectTypeShrtCode": "FILTER",
                                        "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                        "effectCharVal": {
                                            "charValId": 50000378,
                                            "val": "true",
                                            "shrtCode": "true"
                                        },
                                        "effectedCharValues": [
                                            {
                                                "charValId": 639200,
                                                "shrtCode": "EMPTY"
                                            }
                                        ]
                                    }
                                ],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290770,
                                    "charShortCode": "aa_old_msisdn",
                                    "charValueId": 639200,
                                    "shortCode": "EMPTY",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 290770,
                                "shortCode": "aa_old_msisdn",
                                "charName": "Eski Telefon Numarası",
                                "description": "Eski Telefon Numarası",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290770,
                                        "charShortCode": "aa_old_msisdn",
                                        "charValueId": 639200,
                                        "shortCode": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 290780,
                                    "charShortCode": "aa_detailed_bill",
                                    "charValueId": 50000379,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290780,
                                "shortCode": "aa_detailed_bill",
                                "charName": "Ayrıntılı fatura istiyorum",
                                "description": "Ayrıntılı fatura istiyorum",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290780,
                                        "charShortCode": "aa_detailed_bill",
                                        "charValueId": 50000380,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 290780,
                                        "charShortCode": "aa_detailed_bill",
                                        "charValueId": 50000379,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290790,
                                    "charShortCode": "aa_credit_card_payment",
                                    "charValueId": 50000381,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290790,
                                "shortCode": "aa_credit_card_payment",
                                "charName": "Kredi Kartımla Otomatik Ödeme Talimatı vermek istiyorum",
                                "description": "Kredi Kartımla Otomatik Ödeme Talimatı vermek istiyorum",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290790,
                                        "charShortCode": "aa_credit_card_payment",
                                        "charValueId": 50000382,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 290790,
                                        "charShortCode": "aa_credit_card_payment",
                                        "charValueId": 50000381,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290800,
                                    "charShortCode": "aa_simcard_with_mobile_sign",
                                    "charValueId": 50000384,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 290800,
                                "shortCode": "aa_simcard_with_mobile_sign",
                                "charName": "Mobil imzalı SIM Kart istiyorum.",
                                "description": "Mobil imzalı SIM Kart istiyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290800,
                                        "charShortCode": "aa_simcard_with_mobile_sign",
                                        "charValueId": 50000383,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 290800,
                                        "charShortCode": "aa_simcard_with_mobile_sign",
                                        "charValueId": 50000384,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 290840,
                                    "charShortCode": "aa_payment_type",
                                    "charValueId": 50000505,
                                    "shortCode": "POSTPAID",
                                    "charValue": "POSTPAID",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Faturalı",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 290840,
                                "shortCode": "aa_payment_type",
                                "charName": "Ödeme Tipi",
                                "description": "Ödeme Tipi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290840,
                                        "charShortCode": "aa_payment_type",
                                        "charValueId": 50000505,
                                        "shortCode": "POSTPAID",
                                        "charValue": "POSTPAID",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Faturalı",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 290900,
                                    "charShortCode": "aa_mnp_subs",
                                    "charValueId": 50000389,
                                    "shortCode": "true",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Evet",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 290900,
                                "shortCode": "aa_mnp_subs",
                                "charName": "NT ile Gelen",
                                "description": "NT ile Gelen",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 290900,
                                        "charShortCode": "aa_mnp_subs",
                                        "charValueId": 50000389,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 290900,
                                        "charShortCode": "aa_mnp_subs",
                                        "charValueId": 50000390,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 291110,
                                    "charShortCode": "aa_churn_score",
                                    "charValueId": 639760,
                                    "shortCode": "EMPTY",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 291110,
                                "shortCode": "aa_churn_score",
                                "charName": "Churn (risk) Skor",
                                "description": "Churn (risk) Skor",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291110,
                                        "charShortCode": "aa_churn_score",
                                        "charValueId": 639760,
                                        "shortCode": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "INT",
                                "displayType": "INT",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291120,
                                    "charShortCode": "aa_influencer_score",
                                    "charValueId": 639770,
                                    "shortCode": "EMPTY",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 291120,
                                "shortCode": "aa_influencer_score",
                                "charName": "Influencer (Etki) Skoru",
                                "description": "Influencer (Etki) Skoru",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291120,
                                        "charShortCode": "aa_influencer_score",
                                        "charValueId": 639770,
                                        "shortCode": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "INT",
                                "displayType": "INT",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291130,
                                    "charShortCode": "aa_usage_score",
                                    "charValueId": 640100,
                                    "shortCode": "aa_usage_score",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 291130,
                                "shortCode": "aa_usage_score",
                                "charName": "Kullanım Skoru",
                                "description": "Kullanım skoru\n",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291130,
                                        "charShortCode": "aa_usage_score",
                                        "charValueId": 640100,
                                        "shortCode": "aa_usage_score",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "INT",
                                "displayType": "INT",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291140,
                                    "charShortCode": "aa_finans_score",
                                    "charValueId": 639790,
                                    "shortCode": "EMPTY",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 291140,
                                "shortCode": "aa_finans_score",
                                "charName": "Finans Skoru",
                                "description": "Finans Skoru (cihaz kampanyalarında bu bilgi kullanılabilecektir",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291140,
                                        "charShortCode": "aa_finans_score",
                                        "charValueId": 639790,
                                        "shortCode": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "INT",
                                "displayType": "INT",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 291620,
                                    "charShortCode": "aa_old_line_type",
                                    "charValueId": 640970,
                                    "shortCode": "POSTPAID",
                                    "charValue": "FATURALI",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Faturalı",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 291620,
                                "shortCode": "aa_old_line_type",
                                "charName": "Diğer Operatör Hat Tipi",
                                "description": "Diğer Operatör Hat Tipi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 291620,
                                        "charShortCode": "aa_old_line_type",
                                        "charValueId": 640970,
                                        "shortCode": "POSTPAID",
                                        "charValue": "FATURALI",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Faturalı",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 291620,
                                        "charShortCode": "aa_old_line_type",
                                        "charValueId": 640960,
                                        "shortCode": "PREPAID",
                                        "charValue": "FATURASIZ",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "TTNet Bayikodu",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 297620,
                                    "charShortCode": "aa_vip_desc",
                                    "charValueId": 50000283,
                                    "shortCode": "aa_vip_desc",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 297620,
                                "shortCode": "aa_vip_desc",
                                "charName": "VIP kişi bilgisi",
                                "description": "VIP kişi bilgisi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 297620,
                                        "charShortCode": "aa_vip_desc",
                                        "charValueId": 50000283,
                                        "shortCode": "aa_vip_desc",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 297630,
                                    "charShortCode": "aa_detailed_bill_mask",
                                    "charValueId": 666130,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 297630,
                                "shortCode": "aa_detailed_bill_mask",
                                "charName": "Ayrıntılı faturada numaralar maskelensin.",
                                "description": "Ayrıntılı faturada numaralar maskelensin.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 297630,
                                        "charShortCode": "aa_detailed_bill_mask",
                                        "charValueId": 647970,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 297630,
                                        "charShortCode": "aa_detailed_bill_mask",
                                        "charValueId": 666130,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 297820,
                                    "charShortCode": "aa_name",
                                    "charValueId": 50000211,
                                    "shortCode": "EMPTY",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 297820,
                                "shortCode": "aa_name",
                                "charName": "Ad",
                                "description": "Ad",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 297820,
                                        "charShortCode": "aa_name",
                                        "charValueId": 50000211,
                                        "shortCode": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 297831,
                                    "charShortCode": "aa_surname",
                                    "charValueId": 50000212,
                                    "shortCode": "EMPTY",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "EMPTY",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 297831,
                                "shortCode": "aa_surname",
                                "charName": "Soyad",
                                "description": "Soyad",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 297831,
                                        "charShortCode": "aa_surname",
                                        "charValueId": 50000212,
                                        "shortCode": "EMPTY",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "EMPTY",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 297842,
                                    "charShortCode": "aa_rsrc_doc",
                                    "charValueId": 50000433,
                                    "shortCode": "true",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Evet",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 297842,
                                "shortCode": "aa_rsrc_doc",
                                "charName": "Cihaz boşa çıktı belgesi var mı",
                                "description": "Cihaz boşa çıktı belgesi var mı",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 297842,
                                        "charShortCode": "aa_rsrc_doc",
                                        "charValueId": 50000433,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 297842,
                                        "charShortCode": "aa_rsrc_doc",
                                        "charValueId": 50000432,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 298018,
                                    "charShortCode": "aa_lang_id",
                                    "charValueId": 50000281,
                                    "shortCode": "TUR",
                                    "charValue": "TUR",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Türkçe",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 298018,
                                "shortCode": "aa_lang_id",
                                "charName": "Dil Tercihi",
                                "description": "Dil Tercihi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 298018,
                                        "charShortCode": "aa_lang_id",
                                        "charValueId": 50000281,
                                        "shortCode": "TUR",
                                        "charValue": "TUR",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Türkçe",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 298018,
                                        "charShortCode": "aa_lang_id",
                                        "charValueId": 50000280,
                                        "shortCode": "ENG",
                                        "charValue": "ENG",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "İngilizce",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "RADIO_GROUP",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 303690,
                                    "charShortCode": "aa_cust_vip_spec",
                                    "charValueId": 50000528,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 303690,
                                "shortCode": "aa_cust_vip_spec",
                                "charName": "Müşteriye VIP özellik tanımlama talebi",
                                "description": "Müşteriye VIP özellik tanımlama talebi",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 303690,
                                        "charShortCode": "aa_cust_vip_spec",
                                        "charValueId": 50000528,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 303690,
                                        "charShortCode": "aa_cust_vip_spec",
                                        "charValueId": 50000527,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 304860,
                                    "charShortCode": "aa_vip_list",
                                    "charValueId": 50000518,
                                    "shortCode": "MILLETVEKILI",
                                    "charValue": "MILLETVEKILI\r\n",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Milletvekili\r\n",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 304860,
                                "shortCode": "aa_vip_list",
                                "charName": "VIP Meslek",
                                "description": "VIP Meslek",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000518,
                                        "shortCode": "MILLETVEKILI",
                                        "charValue": "MILLETVEKILI\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Milletvekili\r\n",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000519,
                                        "shortCode": "VAKIF_DERNEK_BASKANI",
                                        "charValue": "VAKIF_DERNEK_BASKANI\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Vakıf Dernek Başkanı",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000520,
                                        "shortCode": "UST_DUZEY_YONETICI",
                                        "charValue": "UST_DUZEY_YONETICI\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Üst Düzey Yönetici\r\n",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000521,
                                        "shortCode": "TV_BASIN_MENSUBU",
                                        "charValue": "TV_BASIN_MENSUBU\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "TV-Basın Mensubu\r\n",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000522,
                                        "shortCode": "SIYASETCI",
                                        "charValue": "SIYASETCI\r\n\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Siyasetçi",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000523,
                                        "shortCode": "SANATCI",
                                        "charValue": "SANATCI\r\n\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Sanatçı",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000524,
                                        "shortCode": "DANISMAN",
                                        "charValue": "DANISMAN\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Danışman",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000525,
                                        "shortCode": "AKADEMISYEN",
                                        "charValue": "AKADEMISYEN\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Akademisyen\r\n",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50000526,
                                        "shortCode": "BAKAN",
                                        "charValue": "BAKAN\r\n\r\n",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Bakan\r\n",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078582,
                                        "shortCode": "Eski Milletvekili",
                                        "charValue": "Eski Milletvekili",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Eski Milletvekili",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078583,
                                        "shortCode": "Eski Bakan",
                                        "charValue": "Eski Bakan",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Eski Bakan",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078584,
                                        "shortCode": "Mevcut TTG Yönetim Kurulu Üyesi",
                                        "charValue": "Mevcut TTG Yönetim Kurulu Üyesi",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut TTG Yönetim Kurulu Üyesi",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078585,
                                        "shortCode": "Mevcut TTG Üst Yönetimi (GM / GMY)",
                                        "charValue": "Mevcut TTG Üst Yönetimi (GM / GMY)",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut TTG Üst Yönetimi (GM / GMY)",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078586,
                                        "shortCode": "Mevcut TTG Bölge Müdürleri",
                                        "charValue": "Mevcut TTG Bölge Müdürleri",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut TTG Bölge Müdürleri",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078587,
                                        "shortCode": "Mevcut TTG Direktörleri",
                                        "charValue": "Mevcut TTG Direktörleri",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut TTG Direktörleri",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078588,
                                        "shortCode": "TTG Üst Yönetim Yakinlari",
                                        "charValue": "TTG Üst Yönetim Yakinlari",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "TTG Üst Yönetim Yakinlari",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078589,
                                        "shortCode": "Eski TTG Yönetim Kurulu Üyesi",
                                        "charValue": "Eski TTG Yönetim Kurulu Üyesi",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Eski TTG Yönetim Kurulu Üyesi",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078590,
                                        "shortCode": "Eski TTG Üst Yönetim (GM/GMY)",
                                        "charValue": "Eski TTG Üst Yönetim (GM/GMY)",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Eski TTG Üst Yönetim (GM/GMY)",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078591,
                                        "shortCode": "Mevcut Grup Sirketleri Üst Yönetimi",
                                        "charValue": "Mevcut Grup Sirketleri Üst Yönetimi",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut Grup Sirketleri Üst Yönetimi",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078592,
                                        "shortCode": "Mevcut Grup Sirketleri Yönetim Kurulu Üyesi",
                                        "charValue": "Mevcut Grup Sirketleri Yönetim Kurulu Üyesi",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut Grup Sirketleri Yönetim Kurulu Üyesi",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078593,
                                        "shortCode": "Vali / Kaymakam / Belediye Baskani",
                                        "charValue": "Vali / Kaymakam / Belediye Baskani",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Vali / Kaymakam / Belediye Baskani",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078594,
                                        "shortCode": "Mevcut BTK Kurul Üyeleri",
                                        "charValue": "Mevcut BTK Kurul Üyeleri",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Mevcut BTK Kurul Üyeleri",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078595,
                                        "shortCode": "Kurumsal Sirket Yöneticileri / Isadami",
                                        "charValue": "Kurumsal Sirket Yöneticileri / Isadami",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Kurumsal Sirket Yöneticileri / Isadami",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078596,
                                        "shortCode": "Sporcu (Futbolcu, Basketbolcu, Voleybolcu, ...)",
                                        "charValue": "Sporcu (Futbolcu, Basketbolcu, Voleybolcu, ...)",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Sporcu (Futbolcu, Basketbolcu, Voleybolcu, ...)",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078597,
                                        "shortCode": "Gazeteci",
                                        "charValue": "Gazeteci",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Gazeteci",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 304860,
                                        "charShortCode": "aa_vip_list",
                                        "charValueId": 50078598,
                                        "shortCode": "Sosyal Medya Fenomen",
                                        "charValue": "Sosyal Medya Fenomen",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Sosyal Medya Fenomen",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3345855,
                                    "charShortCode": "aa_3g",
                                    "charValueId": 50031737,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3345855,
                                "shortCode": "aa_3g",
                                "charName": "3G hizmetlerinden yararlanmak istiyorum.",
                                "description": "3G hizmetlerinden yararlanmak istiyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3345855,
                                        "charShortCode": "aa_3g",
                                        "charValueId": 50031736,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 3345855,
                                        "charShortCode": "aa_3g",
                                        "charValueId": 50031737,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.OdfPackageFourGsmGenerationControlValidator",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": true,
                                "effectsPrice": false,
                                "effectsTo": [
                                    {
                                        "charId": 290680,
                                        "shortCode": "aa_2g_only",
                                        "charName": "Sadece 2G hizmetinden yararlanmak istiyorum.",
                                        "effectTypeShrtCode": "SET",
                                        "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                        "effectCharVal": {
                                            "charValId": 50031736,
                                            "val": "true",
                                            "shrtCode": "true"
                                        },
                                        "effectedCharValues": [
                                            {
                                                "charValId": 50000370,
                                                "val": "false",
                                                "shrtCode": "false"
                                            }
                                        ]
                                    },
                                    {
                                        "charId": 3345856,
                                        "shortCode": "aa_4g",
                                        "charName": "4.5G hizmetlerinden yararlanmak istiyorum.",
                                        "effectTypeShrtCode": "SET",
                                        "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                        "effectCharVal": {
                                            "charValId": 50031736,
                                            "val": "true",
                                            "shrtCode": "true"
                                        },
                                        "effectedCharValues": [
                                            {
                                                "charValId": 50031739,
                                                "val": "false",
                                                "shrtCode": "false"
                                            }
                                        ]
                                    },
                                    {
                                        "charId": 1315162,
                                        "shortCode": "ADC",
                                        "charName": "ADC",
                                        "effectTypeShrtCode": "EXCLUDE",
                                        "effectLevelTypeShrtCode": "CHAR_CHAR_REL",
                                        "effectedCharValues": []
                                    }
                                ],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3345856,
                                    "charShortCode": "aa_4g",
                                    "charValueId": 50031740,
                                    "shortCode": "true",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Evet",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 3345856,
                                "shortCode": "aa_4g",
                                "charName": "4.5G hizmetlerinden yararlanmak istiyorum.",
                                "description": "4.5G hizmetlerinden yararlanmak istiyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3345856,
                                        "charShortCode": "aa_4g",
                                        "charValueId": 50031740,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 3345856,
                                        "charShortCode": "aa_4g",
                                        "charValueId": 50031739,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "derivationFormula": "etiya.commerce.backend.odf.order.service.deriveredformula.offerinstance.OdfLteDerivedFormula",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3345893,
                                    "charShortCode": "aa_volte",
                                    "charValueId": 50038498,
                                    "shortCode": "true",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3345893,
                                "shortCode": "aa_volte",
                                "charName": "HD+ Görüntü ve Ses Teknolojisi (VoLTE) hizmetlerinden yararlanmak istiyorum.",
                                "description": "HD+ Görüntü ve Ses Teknolojisi (VoLTE) hizmetlerinden yararlanmak istiyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3345893,
                                        "charShortCode": "aa_volte",
                                        "charValueId": 50038498,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 3345893,
                                        "charShortCode": "aa_volte",
                                        "charValueId": 50038499,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.VolteValidator",
                                "charType": "CONFIG",
                                "valueValidated": true,
                                "autoValidate": true,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 3345894,
                                    "charShortCode": "aa_gprs",
                                    "charValueId": 50038501,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 3345894,
                                "shortCode": "aa_gprs",
                                "charName": "İnternet hizmetinden faydalanmak istemiyorum",
                                "description": "Internet hizmetinden faydalanmak istemiyorum",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 3345894,
                                        "charShortCode": "aa_gprs",
                                        "charValueId": 50038500,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 3345894,
                                        "charShortCode": "aa_gprs",
                                        "charValueId": 50038501,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 200000500,
                                    "charShortCode": "aa_ovit",
                                    "charValueId": 200001711,
                                    "shortCode": "FALSE",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Hayır",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 200000500,
                                "shortCode": "aa_ovit",
                                "charName": "Bana özel fırsatların iletilmesine ve abonelik, konum ve kullanım bilgilerimin, iznimi iptal etmediğim sürece Türk Telekomünikasyon A.S., TTNET A.Ş., TT Mobil İletişim Hizmetleri A.S. ve grup şirketleri (Net Ekran 3 Televizyon ve Medya Hizmetleri AŞ., Net Ekran 11 Televizyon ve Medya Hizmetleri AŞ., TT Ödeme Hizmetleri AŞ., TT Ventures Proje Geliştirme AŞ., TT Satış ve Dağıtım Hizmetleri AŞ.) arasında paylaşılarak kullanılmasına izin veriyorum.",
                                "description": "Bana özel fırsatların iletilmesine ve abonelik, konum ve kullanım bilgilerimin, iznimi iptal etmediğim sürece Türk Telekomünikasyon A.S., TTNET A.Ş., TT Mobil İletişim Hizmetleri A.S. ve grup şirketleri (Net Ekran 3 Televizyon ve Medya Hizmetleri AŞ., Net Ekran 11 Televizyon ve Medya Hizmetleri AŞ., TT Ödeme Hizmetleri AŞ., TT Ventures Proje Geliştirme AŞ., TT Satış ve Dağıtım Hizmetleri AŞ.) arasında paylaşılarak kullanılmasına izin veriyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 200000500,
                                        "charShortCode": "aa_ovit",
                                        "charValueId": 200001710,
                                        "shortCode": "TRUE",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": false
                                    },
                                    {
                                        "charId": 200000500,
                                        "charShortCode": "aa_ovit",
                                        "charValueId": 200001711,
                                        "shortCode": "FALSE",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": true,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.VolteValidator",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": true,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            },
                            {
                                "capturedValue": {
                                    "charId": 200000511,
                                    "charShortCode": "aa_notice",
                                    "charValueId": 200001803,
                                    "shortCode": "true",
                                    "charValue": "true",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Evet",
                                    "visible": true,
                                    "disabled": false,
                                    "scrOrd": 0,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 200000511,
                                "shortCode": "aa_notice",
                                "charName": "Ücretli aramalar öncesinde anons ile bilgilendirme istiyorum.",
                                "description": "Ücretli aramalar öncesinde anons ile bilgilendirme istiyorum.",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 200000511,
                                        "charShortCode": "aa_notice",
                                        "charValueId": 200001803,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Evet",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    },
                                    {
                                        "charId": 200000511,
                                        "charShortCode": "aa_notice",
                                        "charValueId": 200001804,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Hayır",
                                        "visible": true,
                                        "disabled": false,
                                        "scrOrd": 0,
                                        "default": true
                                    }
                                ],
                                "visible": true,
                                "editable": false,
                                "optional": false,
                                "valueType": "STR",
                                "displayType": "BOOLEAN",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            }
                        ],
                        "offerInstanceChars": [
                            {
                                "capturedValue": {
                                    "charId": 100192,
                                    "charShortCode": "resourceQualificationStatus",
                                    "charValueId": 100301,
                                    "shortCode": "resourceQualificationStatus",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "visible": true,
                                    "disabled": false,
                                    "default": false
                                },
                                "updated": false,
                                "charId": 100192,
                                "shortCode": "resourceQualificationStatus",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 100192,
                                        "charShortCode": "resourceQualificationStatus",
                                        "charValueId": 100301,
                                        "shortCode": "resourceQualificationStatus",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "visible": true,
                                        "disabled": false,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": true,
                                "optional": true,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": false
                            },
                            {
                                "capturedValue": {
                                    "charId": 200000528,
                                    "charShortCode": "implicitItem",
                                    "charValueId": 200001832,
                                    "shortCode": "false",
                                    "charValue": "false",
                                    "minValue": 0,
                                    "maxValue": 0,
                                    "charValueLabel": "Implicit Item",
                                    "visible": true,
                                    "disabled": false,
                                    "default": true
                                },
                                "updated": false,
                                "charId": 200000528,
                                "shortCode": "implicitItem",
                                "charName": "Implicit Item",
                                "description": "Implicit Item",
                                "displayOrder": 0,
                                "valueList": [
                                    {
                                        "charId": 200000528,
                                        "charShortCode": "implicitItem",
                                        "charValueId": 200001832,
                                        "shortCode": "false",
                                        "charValue": "false",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Implicit Item",
                                        "visible": true,
                                        "disabled": false,
                                        "default": true
                                    },
                                    {
                                        "charId": 200000528,
                                        "charShortCode": "implicitItem",
                                        "charValueId": 200001831,
                                        "shortCode": "true",
                                        "charValue": "true",
                                        "minValue": 0,
                                        "maxValue": 0,
                                        "charValueLabel": "Implicit Item",
                                        "visible": true,
                                        "disabled": false,
                                        "default": false
                                    }
                                ],
                                "visible": false,
                                "editable": true,
                                "optional": true,
                                "valueType": "STR",
                                "displayType": "STR",
                                "charType": "CONFIG",
                                "valueValidated": false,
                                "autoValidate": false,
                                "effectsPrice": false,
                                "effectsTo": [],
                                "effectsQuote": false,
                                "lov": true
                            }
                        ],
                        "involvementEditorList": [],
                        "charValueOfferInstanceRelations": [],
                        "additionalParameters": [],
                        "byodOffer": false,
                        "equipment": false,
                        "shipmentOffer": false,
                        "rentalOffer": false,
                        "purchaseOffer": false,
                        "vaporized": false,
                        "inclusiveChannel": false,
                        "quoteTemplate": false,
                        "transferred": false,
                        "offerInstancePrice": {
                            "oneTime": 0,
                            "recurring": 111.17,
                            "usage": 0,
                            "total": 111.17,
                            "taxOneTime": 0,
                            "taxRecurring": 111.17,
                            "taxUsage": 0,
                            "taxTotal": 111.17,
                            "vat": 0,
                            "delivery": 0,
                            "voucherDiscount": 0,
                            "currency": {
                                "curId": 2,
                                "currencyCode": "CAD"
                            },
                            "taxInfos": [],
                            "oneTimeSubItems": [],
                            "recurringSubItems": [],
                            "usageSubItems": [],
                            "oneTimeTaxInfos": [],
                            "recurringTaxInfos": [],
                            "nextRecurringTaxInfos": [],
                            "usageTaxInfos": [],
                            "discountAppliedOneTime": 0,
                            "discountAppliedRecurring": 111.17,
                            "discountAppliedUsage": 0,
                            "discountAppliedTotal": 111.17,
                            "discountAppliedTaxOneTime": 0,
                            "discountAppliedTaxRecurring": 111.17,
                            "discountAppliedTaxUsage": 0,
                            "discountAppliedTaxTotal": 111.17,
                            "monthlyTotalWithoutFirstMonthDisc": 0
                        }
                    }
                ],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": true,
                "offerInstanceInvolvements": [],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Ailece 15GB Tarifesi",
                "documents": [],
                "productChars": [],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 111.17,
                    "usage": 0,
                    "total": 111.17,
                    "taxOneTime": 0,
                    "taxRecurring": 111.17,
                    "taxUsage": 0,
                    "taxTotal": 111.17,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "currency": {
                        "curId": 2,
                        "currencyCode": "CAD"
                    },
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 111.17,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 111.17,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 111.17,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 111.17,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -4,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999911,
                    "offerName": "Numaram Rehbere Kaydolsun",
                    "description": "Numaram Rehbere Kaydolsun",
                    "contractName": "Numaram Rehbere Kaydolsun",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413968431,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413968431,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 212510,
                        "serviceCode": "nws_coop_dir",
                        "networkServiceCode": "nws_coop_dir",
                        "name": "Numaram Rehbere Kaydolsun Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317106580,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Numaram Rehbere Kaydolsun",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290650,
                            "charShortCode": "aa_coop_dir",
                            "charValueId": 50000364,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 290650,
                        "shortCode": "aa_coop_dir",
                        "charName": "Rehberlik hizmetleri kapsamında ad soyad, telefon numarası ve adres bilgilerimin iznimi geri almadığım sürece rehberlik hizmeti sunan firmalarla ve TCKN bilgime sahip üçüncü taraflarla (banka ve finans kuruluşları, varlık yönetim şirketleri, avukatlık büroları, belediyeler, iş ortakları ve tedarikçiler tarafından yapılacak sorgulama neticesinde) paylaşılmasına izin veriyorum.",
                        "description": "Rehberlik hizmetleri kapsamında ad soyad, telefon numarası ve adres bilgilerimin iznimi geri almadığım sürece rehberlik hizmeti sunan firmalarla ve TCKN bilgime sahip üçüncü taraflarla (banka ve finans kuruluşları, varlık yönetim şirketleri, avukatlık büroları, belediyeler, iş ortakları ve tedarikçiler tarafından yapılacak sorgulama neticesinde) paylaşılmasına izin veriyorum.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290650,
                                "charShortCode": "aa_coop_dir",
                                "charValueId": 50000364,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 290650,
                                "charShortCode": "aa_coop_dir",
                                "charValueId": 50000363,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3,
                            "prodOfrId": 39999911,
                            "prodOfrName": "Numaram Rehbere Kaydolsun",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 39999911,
                            "gnlSpecRolRelId": 2141,
                            "cDate": 1600509969000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -5,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999913,
                    "offerName": "Diğer Firma Hizmetleri Duyuru",
                    "description": "Diğer Firma Hizmetleri Duyuru",
                    "contractName": "Diğer Firma Hizmetleri Duyuru",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413968461,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413968461,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 212540,
                        "serviceCode": "nws_sms_other",
                        "networkServiceCode": "nws_sms_other",
                        "name": "Diğer Firma Hizmetleri Duyuru Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317107166,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Diğer Firma Hizmetleri Duyuru",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290720,
                            "charShortCode": "aa_sms_other",
                            "charValueId": 50000375,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 290720,
                        "shortCode": "aa_sms_other",
                        "charName": "Diğer firmaların hizmetleri hakkında duyuru gelsin.",
                        "description": "Diğer firmaların hizmetleri hakkında duyuru gelsin.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290720,
                                "charShortCode": "aa_sms_other",
                                "charValueId": 50000376,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 290720,
                                "charShortCode": "aa_sms_other",
                                "charValueId": 50000375,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 4,
                            "prodOfrId": 39999913,
                            "prodOfrName": "Diğer Firma Hizmetleri Duyuru",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 39999913,
                            "gnlSpecRolRelId": 2142,
                            "cDate": 1600509969000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -6,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999914,
                    "offerName": "Kampanya Duyuruları",
                    "description": "Kampanya Duyuruları",
                    "contractName": "Kampanya Duyuruları",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413968481,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413968481,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 212550,
                        "serviceCode": "nws_broadcast_sms",
                        "networkServiceCode": "nws_broadcast_sms",
                        "name": "Kampanya Duyuruları Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317107707,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Kampanya Duyuruları",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290700,
                            "charShortCode": "aa_broadcast_sms",
                            "charValueId": 50000373,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 290700,
                        "shortCode": "aa_broadcast_sms",
                        "charName": "TT Mobil'den avantajlı servis ve tarifelerle ilgili kampanya duyuruları gelmesin.",
                        "description": "TT Mobil'den avantajlı servis ve tarifelerle ilgili kampanya duyuruları gelmesin.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290700,
                                "charShortCode": "aa_broadcast_sms",
                                "charValueId": 50000374,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 290700,
                                "charShortCode": "aa_broadcast_sms",
                                "charValueId": 50000373,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 5,
                            "prodOfrId": 39999914,
                            "prodOfrName": "Kampanya Duyuruları",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 39999914,
                            "gnlSpecRolRelId": 2143,
                            "cDate": 1600509969000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -7,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999915,
                    "offerName": "900 lü Hatlar Servisi",
                    "description": "900 lü Hatlar Servisi",
                    "contractName": "900 lü Hatlar Servisi",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413983801,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413983801,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 223560,
                        "serviceCode": "nws_900",
                        "networkServiceCode": "nws_900",
                        "name": "900 lü Hatlar Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317108284,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "900 lü Hatlar Servisi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290670,
                            "charShortCode": "aa_900",
                            "charValueId": 50000368,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 290670,
                        "shortCode": "aa_900",
                        "charName": "Hattım 900'lü hatlara açık olsun. (Canlı sohbet içeriğine ait katma değerli elektronik haberleşme hizmetleri)",
                        "description": "Hattım 900'lü hatlara açık olsun. (Canlı sohbet içeriğine ait katma değerli elektronik haberleşme hizmetleri)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290670,
                                "charShortCode": "aa_900",
                                "charValueId": 50000368,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 290670,
                                "charShortCode": "aa_900",
                                "charValueId": 50000367,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 6,
                            "prodOfrId": 39999915,
                            "prodOfrName": "900 lü Hatlar Servisi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 39999915,
                            "gnlSpecRolRelId": 2145,
                            "cDate": 1600509969000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -8,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999916,
                    "offerName": "Roaming Servisi (IR)",
                    "description": "Roaming Servisi (IR)",
                    "contractName": "Roaming Servisi (IR)",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413983811,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413983811,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 223570,
                        "serviceCode": "nws_ir",
                        "networkServiceCode": "nws_ir",
                        "name": "Roaming Servisi (IR)"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317108888,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Roaming Servisi (IR)",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290640,
                            "charShortCode": "aa_ir",
                            "charValueId": 50000361,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 290640,
                        "shortCode": "aa_ir",
                        "charName": "Hattım yurtdışında arama yapmaya açık olsun.",
                        "description": "Hattım yurtdışında arama yapmaya açık olsun.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290640,
                                "charShortCode": "aa_ir",
                                "charValueId": 50000362,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 290640,
                                "charShortCode": "aa_ir",
                                "charValueId": 50000361,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.InternationalRoamingValidator",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 7,
                            "prodOfrId": 39999916,
                            "prodOfrName": "Roaming Servisi (IR)",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 39999916,
                            "gnlSpecRolRelId": 2146,
                            "cDate": 1600509969000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -9,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999919,
                    "offerName": "Güvenli Internet",
                    "description": "Güvenli Internet",
                    "contractName": "Güvenli Internet",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413968491,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413968491,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 212560,
                        "serviceCode": "nws_vsme",
                        "networkServiceCode": "nws_vsme",
                        "name": "Güvenli Internet Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317109657,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Güvenli Internet",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 314890,
                            "charShortCode": "aa_secure_int",
                            "charValueId": 50000502,
                            "shortCode": "TRUE",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Evet",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 314890,
                        "shortCode": "aa_secure_int",
                        "charName": "Güvenli internet istiyorum",
                        "description": "Güvenli internet istiyorum",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 314890,
                                "charShortCode": "aa_secure_int",
                                "charValueId": 50000500,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 314890,
                                "charShortCode": "aa_secure_int",
                                "charValueId": 50000502,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [
                            {
                                "charId": 314900,
                                "shortCode": "aa_secure_int_cocuk",
                                "charName": "Çocuk Filtresi",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000502,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50000537,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            },
                            {
                                "charId": 314910,
                                "shortCode": "aa_secure_int_aile",
                                "charName": "Aile Filtresi",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000502,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 666150,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            },
                            {
                                "charId": 314910,
                                "shortCode": "aa_secure_int_aile",
                                "charName": "Aile Filtresi",
                                "effectTypeShrtCode": "SET",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000502,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50000538,
                                        "val": "true",
                                        "shrtCode": "TRUE"
                                    }
                                ]
                            }
                        ],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 314900,
                            "charShortCode": "aa_secure_int_cocuk",
                            "charValueId": 50000537,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 2,
                            "default": true
                        },
                        "updated": false,
                        "charId": 314900,
                        "shortCode": "aa_secure_int_cocuk",
                        "charName": "Çocuk Filtresi",
                        "description": "Çocuk Filtresi",
                        "displayOrder": 2,
                        "valueList": [
                            {
                                "charId": 314900,
                                "charShortCode": "aa_secure_int_cocuk",
                                "charValueId": 666140,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 2,
                                "default": false
                            },
                            {
                                "charId": 314900,
                                "charShortCode": "aa_secure_int_cocuk",
                                "charValueId": 50000537,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 2,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [
                            {
                                "charId": 314910,
                                "shortCode": "aa_secure_int_aile",
                                "charName": "Aile Filtresi",
                                "effectTypeShrtCode": "HIDE_VAL",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 666140,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 666150,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            },
                            {
                                "charId": 314910,
                                "shortCode": "aa_secure_int_aile",
                                "charName": "Aile Filtresi",
                                "effectTypeShrtCode": "SET",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 666140,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 666150,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            }
                        ],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 314910,
                            "charShortCode": "aa_secure_int_aile",
                            "charValueId": 50000538,
                            "shortCode": "TRUE",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Evet",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 2,
                            "default": false
                        },
                        "updated": false,
                        "charId": 314910,
                        "shortCode": "aa_secure_int_aile",
                        "charName": "Aile Filtresi",
                        "description": "Aile Filtresi",
                        "displayOrder": 2,
                        "valueList": [
                            {
                                "charId": 314910,
                                "charShortCode": "aa_secure_int_aile",
                                "charValueId": 50000538,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 2,
                                "default": false
                            },
                            {
                                "charId": 314910,
                                "charShortCode": "aa_secure_int_aile",
                                "charValueId": 666150,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 2,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [
                            {
                                "charId": 314940,
                                "shortCode": "aa_secure_int_sosyal_medya",
                                "charName": "Sosyal Medya Filtresi",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000538,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50000541,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            },
                            {
                                "charId": 314920,
                                "shortCode": "aa_secure_int_oyun",
                                "charName": "Oyun Filtresi",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000538,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50000539,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            },
                            {
                                "charId": 314930,
                                "shortCode": "aa_secure_int_sohbet",
                                "charName": "Sohbet Filtresi",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000538,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50000540,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            },
                            {
                                "charId": 314900,
                                "shortCode": "aa_secure_int_cocuk",
                                "charName": "Çocuk Filtresi",
                                "effectTypeShrtCode": "SET",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50000538,
                                    "val": "true",
                                    "shrtCode": "TRUE"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50000537,
                                        "val": "false",
                                        "shrtCode": "FALSE"
                                    }
                                ]
                            }
                        ],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 314920,
                            "charShortCode": "aa_secure_int_oyun",
                            "charValueId": 50000539,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 314920,
                        "shortCode": "aa_secure_int_oyun",
                        "charName": "Oyun Filtresi",
                        "description": "Oyun Filtresi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 314920,
                                "charShortCode": "aa_secure_int_oyun",
                                "charValueId": 666160,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 314920,
                                "charShortCode": "aa_secure_int_oyun",
                                "charValueId": 50000539,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 314930,
                            "charShortCode": "aa_secure_int_sohbet",
                            "charValueId": 50000540,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 314930,
                        "shortCode": "aa_secure_int_sohbet",
                        "charName": "Sohbet Filtresi",
                        "description": "Sohbet Filtresi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 314930,
                                "charShortCode": "aa_secure_int_sohbet",
                                "charValueId": 666170,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 314930,
                                "charShortCode": "aa_secure_int_sohbet",
                                "charValueId": 50000540,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 314940,
                            "charShortCode": "aa_secure_int_sosyal_medya",
                            "charValueId": 50000541,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 314940,
                        "shortCode": "aa_secure_int_sosyal_medya",
                        "charName": "Sosyal Medya Filtresi",
                        "description": "Sosyal Medya Filtresi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 314940,
                                "charShortCode": "aa_secure_int_sosyal_medya",
                                "charValueId": 50000541,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 314940,
                                "charShortCode": "aa_secure_int_sosyal_medya",
                                "charValueId": 666180,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 12,
                            "prodOfrId": 39999919,
                            "prodOfrName": "Güvenli Internet",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 39999919,
                            "gnlSpecRolRelId": 2144,
                            "cDate": 1600509969000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -10,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400041128,
                    "offerName": "LTE Roaming",
                    "description": "LTE Roaming",
                    "contractName": "LTE Roaming",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009478,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009478,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246524,
                        "serviceCode": "nws_lte_data_roaming",
                        "networkServiceCode": "nws_lte_data_roaming",
                        "name": "LTE Data Roaming Servisi"
                    },
                    "checkServiceAvailable": false,
                    "rankingCategoryContents": []
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317110669,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "LTE Roaming",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3345857,
                            "charShortCode": "aa_lte_data_roaming",
                            "charValueId": 50031742,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 3345857,
                        "shortCode": "aa_lte_data_roaming",
                        "charName": "4.5G yurtdışında data kullanım hizmetlerinden faydalanmak istiyorum.",
                        "description": "4.5G yurtdışında data kullanım hizmetlerinden faydalanmak istiyorum.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3345857,
                                "charShortCode": "aa_lte_data_roaming",
                                "charValueId": 50031742,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3345857,
                                "charShortCode": "aa_lte_data_roaming",
                                "charValueId": 50031741,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.LteDataRoamingValidator",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 2128,
                            "prodOfrId": 400041128,
                            "prodOfrName": "LTE Roaming",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400041128,
                            "gnlSpecRolRelId": 2153,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -11,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080068,
                    "offerName": "Mobil Ödeme Teklifi",
                    "description": "Mobil Ödeme Teklifi",
                    "contractName": "Mobil Ödeme Teklifi",
                    "smsName": "MBLODM",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009503,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009503,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246525,
                        "serviceCode": "nws_mobile_payment",
                        "networkServiceCode": "nws_mobile_payment",
                        "name": "Mobil Ödeme Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317111764,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Mobil Ödeme Teklifi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346075,
                            "charShortCode": "aa_mobile_paym",
                            "charValueId": 50058983,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346075,
                        "shortCode": "aa_mobile_paym",
                        "charName": "Hattım mobil ödemelere açık olsun.",
                        "description": "Hattım mobil ödemelere açık olsun.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346075,
                                "charShortCode": "aa_mobile_paym",
                                "charValueId": 50058983,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346075,
                                "charShortCode": "aa_mobile_paym",
                                "charValueId": 50058984,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [
                            {
                                "charId": 3346134,
                                "shortCode": "aa_premium_apps",
                                "charName": "PREMIUM UYGULAMA ve ICERIK DUKKANLARI (Playstore E-pin- Playstore Kutulu Oyun-Tivibu- Spotify- Passolig- Ulasim- PUBG- Uygulama Dukkanlari)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346135,
                                "shortCode": "aa_govr_payment",
                                "charName": "DEVLET ÖDEMELERİ (HGSTL- HGS TL10- HGS TL15- Ankara Gaz- Ankara Su- SGK- Tramer)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346136,
                                "shortCode": "aa_dontn_subscr",
                                "charName": "BAGIS-AIDAT-ABONELIK (Aidat Abonman- Topluluk- Unicef10- Unicef20)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346137,
                                "shortCode": "aa_phys_prods",
                                "charName": "FIZIKSEL URUN (Egitim, Pilot- Fiziksel Urun- Fiziksel2- Fiziksel3- Online Cihaz Satis- Sigorta)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346138,
                                "shortCode": "aa_bet",
                                "charName": "BAHİS (Bahis)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346139,
                                "shortCode": "aa_food_bevrg",
                                "charName": "YEMEK ÖDEMELERİ (Pepsi- Setcard Zincir- Setcard Zincirdışı- Metropolcard- Fast Food)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346140,
                                "shortCode": "aa_game_entertn",
                                "charName": "OYUN-EGLENCE-VIDEOLAR (Etkinlik- Dijital Icerik- html5- Hybrid Flow- Hybrid Flow2- Kupon Indirim- Kurulu Oyun- Mobil Icerik- OTP- OTP2- Oyun- Oyun Kampanya- Oyun29- Steam)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346141,
                                "shortCode": "aa_spcl_prm_fct",
                                "charName": "ÖZEL İZİNLİ KURGULAR (Google Play- Apple)",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            },
                            {
                                "charId": 3346142,
                                "shortCode": "aa_selected_all",
                                "charName": "Tümünü Seç",
                                "effectTypeShrtCode": "FILTER",
                                "effectLevelTypeShrtCode": "VAL_CHAR_REL",
                                "effectCharVal": {
                                    "charValId": 50058984,
                                    "val": "true",
                                    "shrtCode": "true"
                                },
                                "effectedCharValues": [
                                    {
                                        "charValId": 50064153,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064155,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064157,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064159,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064161,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064163,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064165,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064151,
                                        "val": "false",
                                        "shrtCode": "false"
                                    },
                                    {
                                        "charValId": 50064167,
                                        "val": "false",
                                        "shrtCode": "false"
                                    }
                                ]
                            }
                        ],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346134,
                            "charShortCode": "aa_premium_apps",
                            "charValueId": 50064153,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346134,
                        "shortCode": "aa_premium_apps",
                        "charName": "PREMIUM UYGULAMA ve ICERIK DUKKANLARI (Playstore E-pin- Playstore Kutulu Oyun-Tivibu- Spotify- Passolig- Ulasim- PUBG- Uygulama Dukkanlari)",
                        "description": "PREMIUM UYGULAMA ve ICERIK DUKKANLARI (Playstore E-pin, Playstore Kutulu Oyun,Tivibu, Spotify, Passolig,  Ulasim, PUBG, Uygulama Dukkanlari)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346134,
                                "charShortCode": "aa_premium_apps",
                                "charValueId": 50064153,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346134,
                                "charShortCode": "aa_premium_apps",
                                "charValueId": 50064154,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346135,
                            "charShortCode": "aa_govr_payment",
                            "charValueId": 50064155,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346135,
                        "shortCode": "aa_govr_payment",
                        "charName": "DEVLET ÖDEMELERİ (HGSTL- HGS TL10- HGS TL15- Ankara Gaz- Ankara Su- SGK- Tramer)",
                        "description": "DEVLET ODEMELERI (HGSTL, HGS TL10, HGS TL15, Ankara Gaz, Ankara Su, SGK, Tramer)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346135,
                                "charShortCode": "aa_govr_payment",
                                "charValueId": 50064156,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346135,
                                "charShortCode": "aa_govr_payment",
                                "charValueId": 50064155,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346136,
                            "charShortCode": "aa_dontn_subscr",
                            "charValueId": 50064157,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346136,
                        "shortCode": "aa_dontn_subscr",
                        "charName": "BAGIS-AIDAT-ABONELIK (Aidat Abonman- Topluluk- Unicef10- Unicef20)",
                        "description": "BAGIS, AIDAT, ABONELIK (Aidat Abonman, Topluluk, Unicef10, Unicef20)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346136,
                                "charShortCode": "aa_dontn_subscr",
                                "charValueId": 50064158,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346136,
                                "charShortCode": "aa_dontn_subscr",
                                "charValueId": 50064157,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346137,
                            "charShortCode": "aa_phys_prods",
                            "charValueId": 50064159,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346137,
                        "shortCode": "aa_phys_prods",
                        "charName": "FIZIKSEL URUN (Egitim, Pilot- Fiziksel Urun- Fiziksel2- Fiziksel3- Online Cihaz Satis- Sigorta)",
                        "description": "FIZIKSEL URUN (Egitim, Pilot, Fiziksel Urun, Fiziksel2, Fiziksel3, Online Cihaz Satis, Sigorta)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346137,
                                "charShortCode": "aa_phys_prods",
                                "charValueId": 50064160,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346137,
                                "charShortCode": "aa_phys_prods",
                                "charValueId": 50064159,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346138,
                            "charShortCode": "aa_bet",
                            "charValueId": 50064161,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346138,
                        "shortCode": "aa_bet",
                        "charName": "BAHİS (Bahis)",
                        "description": "BAHIS (Bahis)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346138,
                                "charShortCode": "aa_bet",
                                "charValueId": 50064162,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346138,
                                "charShortCode": "aa_bet",
                                "charValueId": 50064161,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346139,
                            "charShortCode": "aa_food_bevrg",
                            "charValueId": 50064163,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346139,
                        "shortCode": "aa_food_bevrg",
                        "charName": "YEMEK ÖDEMELERİ (Pepsi- Setcard Zincir- Setcard Zincirdışı- Metropolcard- Fast Food)",
                        "description": "YEMEK ODEMELERI (Pepsi, Setcard Zincir, Setcard Zincirdisi, Metropolcard, Fast Food)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346139,
                                "charShortCode": "aa_food_bevrg",
                                "charValueId": 50064163,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346139,
                                "charShortCode": "aa_food_bevrg",
                                "charValueId": 50064164,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346140,
                            "charShortCode": "aa_game_entertn",
                            "charValueId": 50064165,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346140,
                        "shortCode": "aa_game_entertn",
                        "charName": "OYUN-EGLENCE-VIDEOLAR (Etkinlik- Dijital Icerik- html5- Hybrid Flow- Hybrid Flow2- Kupon Indirim- Kurulu Oyun- Mobil Icerik- OTP- OTP2- Oyun- Oyun Kampanya- Oyun29- Steam)",
                        "description": "OYUN,EGLENCE,VIDEOLAR(Etkinlik, Dijital Icerik, html5, Hybrid Flow, Hybrid Flow2, Kupon Indirim,Kurulu Oyun, Mobil Icerik, OTP, OTP2, Oyun, Oyun Kampanya, Oyun29, Steam)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346140,
                                "charShortCode": "aa_game_entertn",
                                "charValueId": 50064165,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346140,
                                "charShortCode": "aa_game_entertn",
                                "charValueId": 50064166,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346141,
                            "charShortCode": "aa_spcl_prm_fct",
                            "charValueId": 50064151,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346141,
                        "shortCode": "aa_spcl_prm_fct",
                        "charName": "ÖZEL İZİNLİ KURGULAR (Google Play- Apple)",
                        "description": "OZEL IZINLI KURGULAR (Google Play, Apple)",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346141,
                                "charShortCode": "aa_spcl_prm_fct",
                                "charValueId": 50064151,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346141,
                                "charShortCode": "aa_spcl_prm_fct",
                                "charValueId": 50064152,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346142,
                            "charShortCode": "aa_selected_all",
                            "charValueId": 50064167,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346142,
                        "shortCode": "aa_selected_all",
                        "charName": "Tümünü Seç",
                        "description": "Tumunu Sec",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346142,
                                "charShortCode": "aa_selected_all",
                                "charValueId": 50064167,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346142,
                                "charShortCode": "aa_selected_all",
                                "charValueId": 50064168,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3167,
                            "prodOfrId": 400080068,
                            "prodOfrName": "Mobil Ödeme Teklifi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080068,
                            "gnlSpecRolRelId": 2147,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -12,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080604,
                    "offerName": "SabitHat Kampanya Duyuru Teklifi",
                    "description": "SabitHat Kampanya Duyuru Teklifi",
                    "contractName": "SabitHat Kampanya Duyuru Teklifi",
                    "smsName": "SBT_CMPG_SMS_OFR",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009504,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009504,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246526,
                        "serviceCode": "nws_ttg_fixedline",
                        "networkServiceCode": "nws_ttg_fixedline",
                        "name": "SabitHat Kampanya Duyuruları Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317112526,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "SabitHat Kampanya Duyuru Teklifi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346132,
                            "charShortCode": "aa_fixedline_offr",
                            "charValueId": 50063107,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346132,
                        "shortCode": "aa_fixedline_offr",
                        "charName": "Sabit-hat yeni abonelik teklifi istemiyorum",
                        "description": "Sabit-hat yeni abonelik teklifi istemiyorum",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346132,
                                "charShortCode": "aa_fixedline_offr",
                                "charValueId": 50063108,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346132,
                                "charShortCode": "aa_fixedline_offr",
                                "charValueId": 50063107,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3192,
                            "prodOfrId": 400080604,
                            "prodOfrName": "SabitHat Kampanya Duyuru Teklifi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080604,
                            "gnlSpecRolRelId": 2154,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -13,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080605,
                    "offerName": "Genişbant Kampanya Duyuru Teklifi",
                    "description": "Genişbant Kampanya Duyuru Teklifi",
                    "contractName": "Genişbant Kampanya Duyuru Teklifi",
                    "smsName": "GNSBNT_CMPG_SMS_OFR",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009505,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009505,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246527,
                        "serviceCode": "nws_ttg_broadband",
                        "networkServiceCode": "nws_ttg_broadband",
                        "name": "Genişbant Kampanya Duyuruları Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317113254,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Genişbant Kampanya Duyuru Teklifi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346131,
                            "charShortCode": "aa_broadband_offr",
                            "charValueId": 50063109,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346131,
                        "shortCode": "aa_broadband_offr",
                        "charName": "İnternet/Tivibu yeni abonelik teklifi istemiyorum",
                        "description": "İnternet/Tivibu yeni abonelik teklifi istemiyorum",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346131,
                                "charShortCode": "aa_broadband_offr",
                                "charValueId": 50063110,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346131,
                                "charShortCode": "aa_broadband_offr",
                                "charValueId": 50063109,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3193,
                            "prodOfrId": 400080605,
                            "prodOfrName": "Genişbant Kampanya Duyuru Teklifi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080605,
                            "gnlSpecRolRelId": 2148,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -14,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080733,
                    "offerName": "888 Hat Servis Teklifi",
                    "description": "888 Hat Servis Teklifi",
                    "contractName": "888 Hat Servis Teklifi",
                    "smsName": "MK_KNL",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009506,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009506,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246528,
                        "serviceCode": "nws_888",
                        "networkServiceCode": "nws_888",
                        "name": "888 Hat Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317114195,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "888 Hat Servis Teklifi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346143,
                            "charShortCode": "aa_888",
                            "charValueId": 50064169,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346143,
                        "shortCode": "aa_888",
                        "charName": "Hattım 888li hatlara açık olsun",
                        "description": "Hattım 888li hatlara açık olsun",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346143,
                                "charShortCode": "aa_888",
                                "charValueId": 50064170,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346143,
                                "charShortCode": "aa_888",
                                "charValueId": 50064169,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3196,
                            "prodOfrId": 400080733,
                            "prodOfrName": "888 Hat Servis Teklifi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080733,
                            "gnlSpecRolRelId": 2149,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -15,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080734,
                    "offerName": "898 Hat Servis Ürünü",
                    "description": "898 Hat Servis Ürünü",
                    "contractName": "898 Hat Servis Ürünü",
                    "smsName": "MK_KNL1",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009507,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009507,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246529,
                        "serviceCode": "nws_898",
                        "networkServiceCode": "nws_898",
                        "name": "898 Hat Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317115079,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "898 Hat Servis Ürünü",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346144,
                            "charShortCode": "aa_898",
                            "charValueId": 50064171,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346144,
                        "shortCode": "aa_898",
                        "charName": "Hattım 898li hatlara açık olsun",
                        "description": "Hattım 898li hatlara açık olsun",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346144,
                                "charShortCode": "aa_898",
                                "charValueId": 50064172,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346144,
                                "charShortCode": "aa_898",
                                "charValueId": 50064171,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3197,
                            "prodOfrId": 400080734,
                            "prodOfrName": "898 Hat Servis Ürünü",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080734,
                            "gnlSpecRolRelId": 2150,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -16,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080735,
                    "offerName": "Gizli Numara Servis Teklifi",
                    "description": "Gizli Numara Servis Teklifi",
                    "contractName": "Gizli Numara Servis Teklifi",
                    "smsName": "MK_KNL2",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009509,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009509,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246530,
                        "serviceCode": "nws_unknw_nmbr",
                        "networkServiceCode": "nws_unknw_nmbr",
                        "name": "Gizli Numara Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317115777,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Gizli Numara Servis Teklifi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346145,
                            "charShortCode": "aa_unknw_nmbr",
                            "charValueId": 50064174,
                            "shortCode": "TRUE",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Evet",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346145,
                        "shortCode": "aa_unknw_nmbr",
                        "charName": "Gizli Numara Beni Aramasın.",
                        "description": "Gizli Numara Beni Aramasın.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346145,
                                "charShortCode": "aa_unknw_nmbr",
                                "charValueId": 50064174,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346145,
                                "charShortCode": "aa_unknw_nmbr",
                                "charValueId": 50064173,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3198,
                            "prodOfrId": 400080735,
                            "prodOfrName": "Gizli Numara Servis Teklifi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080735,
                            "gnlSpecRolRelId": 2151,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -17,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400080736,
                    "offerName": "Numara Taşıma Uyarı Tonu Servis Ürünü",
                    "description": "Numara Taşıma Uyarı Tonu Servis Ürünü",
                    "contractName": "Numara Taşıma Uyarı Tonu Servis Ürünü",
                    "smsName": "MK_KNL3",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009510,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009510,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246531,
                        "serviceCode": "nws_mnp_wrn_tn",
                        "networkServiceCode": "nws_mnp_wrn_tn",
                        "name": "Numara Taşıma Uyarı Tonu Servisi"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317116587,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Numara Taşıma Uyarı Tonu Servis Ürünü",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346146,
                            "charShortCode": "aa_mnp_wrn_tn",
                            "charValueId": 50064176,
                            "shortCode": "TRUE",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Evet",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346146,
                        "shortCode": "aa_mnp_wrn_tn",
                        "charName": "Numara Taşıma Uyarı Tonu Açık Olsun.",
                        "description": "Numara Taşıma Uyarı Tonu Açık Olsun",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346146,
                                "charShortCode": "aa_mnp_wrn_tn",
                                "charValueId": 50064176,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 3346146,
                                "charShortCode": "aa_mnp_wrn_tn",
                                "charValueId": 50064175,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3199,
                            "prodOfrId": 400080736,
                            "prodOfrName": "Numara Taşıma Uyarı Tonu Servis Ürünü",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400080736,
                            "gnlSpecRolRelId": 2152,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -18,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 400081581,
                    "offerName": "Wifi Arama Tercih Teklifi",
                    "description": "Wifi Arama Tercih Teklifi",
                    "contractName": "Wifi Arama Tercih Teklifi",
                    "smsName": "MK_VWF",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414009513,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414009513,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 246532,
                        "serviceCode": "nws_vowifi",
                        "networkServiceCode": "nws_vowifi",
                        "name": "Vowifi Arama Tercih Servis"
                    },
                    "checkServiceAvailable": false
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317117341,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -2
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -3
                        },
                        "involvementKey": {
                            "involvementId": 2150,
                            "involvementName": "tarifeCategory",
                            "involvementCode": "tarifeCategory"
                        },
                        "fictitious": false,
                        "label": "3 - Ailece 15GB Tarifesi"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Wifi Arama Tercih Teklifi",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 3346151,
                            "charShortCode": "aa_vowifi",
                            "charValueId": 50068168,
                            "shortCode": "true",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346151,
                        "shortCode": "aa_vowifi",
                        "charName": "Wi-Fi üzerinden telefon araması yapmak veya almak istiyorum.",
                        "description": "Wi-Fi üzerinden telefon araması yapmak veya almak istiyorum.",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346151,
                                "charShortCode": "aa_vowifi",
                                "charValueId": 50068168,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346151,
                                "charShortCode": "aa_vowifi",
                                "charValueId": 50068167,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "BOOLEAN",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 3340,
                            "prodOfrId": 400081581,
                            "prodOfrName": "Wifi Arama Tercih Teklifi",
                            "gnlRoleSpecId": 2150,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 40,
                            "rowId": 400081581,
                            "gnlSpecRolRelId": 2155,
                            "cDate": 1600509970000,
                            "cUser": 1,
                            "name": "tarifeCategory",
                            "descr": "tarifeCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_2150",
                            "roleCode": "tarifeCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -3
                                },
                                "involvementKey": {
                                    "involvementId": 2150,
                                    "involvementName": "tarifeCategory",
                                    "involvementCode": "tarifeCategory"
                                },
                                "fictitious": false,
                                "label": "3 - Ailece 15GB Tarifesi"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -19,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 5001919,
                    "offerName": "Line",
                    "description": "Line",
                    "contractName": "Line",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferNumber": "5001919",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "keywords": "Line",
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 500002,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 500002,
                        "family": {
                            "productSpecFamilyId": 500000,
                            "shortCode": "TMO",
                            "sortId": 1,
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5000,
                                    "shortCode": "mobile",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5001,
                                    "shortCode": "mobileBroadband",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5002,
                                    "shortCode": "m2mIot",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5004,
                                    "shortCode": "simCard",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5005,
                                    "shortCode": "msisdn",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5006,
                                    "shortCode": "line",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5007,
                                    "shortCode": "commitment",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5008,
                                    "shortCode": "coverage",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5009,
                                    "shortCode": "tax911",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5010,
                                    "shortCode": "warranty",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5012,
                                    "shortCode": "apn",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5013,
                                    "shortCode": "fixedIp",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5014,
                                    "shortCode": "specificIp",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5015,
                                    "shortCode": "ipAddress",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5016,
                                    "shortCode": "privateApn",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5017,
                                    "shortCode": "professionalServices",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5018,
                                    "shortCode": "mdm",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5011,
                                    "shortCode": "rollover",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5019,
                                    "shortCode": "voWifi",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5003,
                                    "shortCode": "mobileNetworkElements",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5020,
                                    "shortCode": "mobileBbNetworkElements",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5021,
                                    "shortCode": "m2mIotNetworkElements",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5022,
                                    "shortCode": "sharingBaData",
                                    "equipment": false
                                },
                                {
                                    "productSpecFamilyCategoryId": 5023,
                                    "shortCode": "shipmentTmo",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5006,
                            "shortCode": "line",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 508,
                            "shortCode": "line",
                            "primary": false,
                            "secondary": false
                        },
                        "familyOperationList": [],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 500000,
                        "serviceCode": "tmoLineCfs",
                        "name": "Line Service Specification"
                    },
                    "checkServiceAvailable": false,
                    "rankingCategoryContents": [],
                    "saleType": {
                        "id": 8,
                        "name": "Post Paid tr",
                        "description": "Post Paid tr",
                        "shortCode": "POST_PAID",
                        "entityCodeName": "PROD_OFR_SALES_TP",
                        "entityName": "PROD_OFR",
                        "resourceKey": "GNL_TP_8",
                        "sortId": 0,
                        "externalShortCode": "POST_PAID",
                        "externalShortCodeWithRollbackValue": "POST_PAID"
                    }
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317178195,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "customerAccount": {
                    "accountId": 800004801364
                },
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": true,
                "offerInstanceInvolvements": [],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Line",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 5000004,
                            "charShortCode": "endUserName",
                            "charValueId": 5500392,
                            "shortCode": "endUserName",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 5000004,
                        "shortCode": "endUserName",
                        "charName": "End User Name",
                        "description": "End User Name",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 5000004,
                                "charShortCode": "endUserName",
                                "charValueId": 5500392,
                                "shortCode": "endUserName",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 5000005,
                            "charShortCode": "endUserSurname",
                            "charValueId": 5500393,
                            "shortCode": "endUserSurname",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 5000005,
                        "shortCode": "endUserSurname",
                        "charName": "End User Surname",
                        "description": "End User Surname",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 5000005,
                                "charShortCode": "endUserSurname",
                                "charValueId": 5500393,
                                "shortCode": "endUserSurname",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 5000006,
                            "charShortCode": "endUserEmail",
                            "charValueId": 5500394,
                            "shortCode": "endUserEmail",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 5000006,
                        "shortCode": "endUserEmail",
                        "charName": "End User E-mail",
                        "description": "End User E-mail",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 5000006,
                                "charShortCode": "endUserEmail",
                                "charValueId": 5500394,
                                "shortCode": "endUserEmail",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -20,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999918,
                    "offerName": "MSISDN",
                    "description": "MSISDN",
                    "contractName": "MSISDN",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 413995411,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 413995411,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "resourceSpecKey": {
                        "resourceSpecId": 171150,
                        "resourceCode": "msisdn_rsrc",
                        "name": "MSISDN"
                    },
                    "checkServiceAvailable": false,
                    "rankingCategoryContents": [],
                    "saleType": {
                        "id": 8,
                        "name": "Post Paid tr",
                        "description": "Post Paid tr",
                        "shortCode": "POST_PAID",
                        "entityCodeName": "PROD_OFR_SALES_TP",
                        "entityName": "PROD_OFR",
                        "resourceKey": "GNL_TP_8",
                        "sortId": 0,
                        "externalShortCode": "POST_PAID",
                        "externalShortCodeWithRollbackValue": "POST_PAID"
                    }
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317178704,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -19
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -19
                        },
                        "involvementKey": {
                            "involvementId": 594,
                            "involvementName": "lineCategory",
                            "involvementCode": "lineCategory"
                        },
                        "fictitious": false,
                        "label": "19 - Line"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "MSISDN",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290620,
                            "charShortCode": "msisdn",
                            "charValueId": 638960,
                            "shortCode": "msisdn",
                            "charValue": "5010042487",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 290620,
                        "shortCode": "msisdn",
                        "charName": "MSISDN",
                        "description": "Seçilen Telefon Numarası",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290620,
                                "charShortCode": "msisdn",
                                "charValueId": 638960,
                                "shortCode": "msisdn",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 291340,
                            "charShortCode": "aa_msisdn_type",
                            "charValueId": 50000494,
                            "shortCode": "aa_msisdn_type",
                            "charValue": "N",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Normal",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 291340,
                        "shortCode": "aa_msisdn_type",
                        "charName": "MSISDN Tipi",
                        "description": "MSISDN Tipi\n",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 291340,
                                "charShortCode": "aa_msisdn_type",
                                "charValueId": 50000494,
                                "shortCode": "N",
                                "charValue": "N",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Normal",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 291340,
                                "charShortCode": "aa_msisdn_type",
                                "charValueId": 50000493,
                                "shortCode": "G",
                                "charValue": "G",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Gold",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 298050,
                            "charShortCode": "aa_telco_IMEI",
                            "charValueId": 50000456,
                            "shortCode": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 298050,
                        "shortCode": "aa_telco_IMEI",
                        "charName": "Mevcut IMEI",
                        "description": "Mevcut IMEI",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 298050,
                                "charShortCode": "aa_telco_IMEI",
                                "charValueId": 50000456,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 315860,
                            "charShortCode": "aa_churn",
                            "charValueId": 669130,
                            "shortCode": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 315860,
                        "shortCode": "aa_churn",
                        "charName": "Churn",
                        "description": "Churn",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 315860,
                                "charShortCode": "aa_churn",
                                "charValueId": 669130,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 1311082,
                            "charShortCode": "aa_msisdn_segment",
                            "charValueId": 50011543,
                            "shortCode": "SEGMENT1",
                            "charValue": "SEGMENT1",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "SEGMENT1",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 1311082,
                        "shortCode": "aa_msisdn_segment",
                        "charName": "Numara Segmenti",
                        "description": "Numara Segmenti",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 1311082,
                                "charShortCode": "aa_msisdn_segment",
                                "charValueId": 50011543,
                                "shortCode": "SEGMENT1",
                                "charValue": "SEGMENT1",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "SEGMENT1",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 1311082,
                                "charShortCode": "aa_msisdn_segment",
                                "charValueId": 50011553,
                                "shortCode": "SEGMENT2",
                                "charValue": "SEGMENT2",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "SEGMENT2",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 1313179,
                            "charShortCode": "aa_payflex_msisdn_prod_id",
                            "charValueId": 50013654,
                            "shortCode": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 1313179,
                        "shortCode": "aa_payflex_msisdn_prod_id",
                        "charName": "Payflex ürün id(msisdn)",
                        "description": "MSISDN için Payflex ürün id",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 1313179,
                                "charShortCode": "aa_payflex_msisdn_prod_id",
                                "charValueId": 50013654,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 21000034,
                            "charShortCode": "aa_msisdn_sncode",
                            "charValueId": 200001828,
                            "shortCode": "GOLDSTAR",
                            "charValue": "0",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "GOLDSTAR",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 21000034,
                        "shortCode": "aa_msisdn_sncode",
                        "charName": "aa_msisdn_sncode",
                        "description": "aa_msisdn_sncode",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 21000034,
                                "charShortCode": "aa_msisdn_sncode",
                                "charValueId": 200001828,
                                "shortCode": "GOLDSTAR",
                                "charValue": "20430",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "GOLDSTAR",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 21000034,
                                "charShortCode": "aa_msisdn_sncode",
                                "charValueId": 200001827,
                                "shortCode": "GOLD",
                                "charValue": "20429",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "GOLD",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 11,
                            "prodOfrId": 39999918,
                            "prodOfrName": "MSISDN",
                            "gnlRoleSpecId": 594,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 111,
                            "rowId": 171150,
                            "gnlSpecRolRelId": 2122,
                            "cDate": 1600184790000,
                            "cUser": 1,
                            "name": "lineCategory",
                            "descr": "lineCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_594",
                            "roleCode": "lineCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -19
                                },
                                "involvementKey": {
                                    "involvementId": 594,
                                    "involvementName": "lineCategory",
                                    "involvementCode": "lineCategory"
                                },
                                "fictitious": false,
                                "label": "19 - Line"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -21,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 39999917,
                    "offerName": "SimCard",
                    "description": "SimCard",
                    "contractName": "SimCard",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 414007571,
                    "virtual": false,
                    "familyDefinition": {
                        "productSpecId": 414007571,
                        "family": {
                            "productSpecFamilyId": 500001,
                            "shortCode": "ALLTARIFF",
                            "sortId": 1,
                            "name": "Tüm Satılabilir Tarifeler",
                            "description": "Tüm Satılabilir Tarifeler",
                            "categories": [
                                {
                                    "productSpecFamilyCategoryId": 5024,
                                    "shortCode": "tariff",
                                    "name": "Satılabilir Tarifeler",
                                    "description": "Satılabilir Tarifeler",
                                    "equipment": false
                                }
                            ]
                        },
                        "familyCategory": {
                            "productSpecFamilyCategoryId": 5024,
                            "shortCode": "tariff",
                            "name": "Satılabilir Tarifeler",
                            "description": "Satılabilir Tarifeler",
                            "equipment": false
                        },
                        "familySubcategory": {
                            "productSpecFamilySubcategoryId": 545,
                            "shortCode": "tariff_sub1",
                            "primary": false,
                            "secondary": false,
                            "name": "Satılabilir Tarifeler Alt Grup 1",
                            "description": "Satılabilir Tarifeler Alt Grup 1"
                        },
                        "familyOperationList": [
                            {
                                "productSpecFamilyOperationId": 5,
                                "shortCode": "view_detail",
                                "name": "view_detail",
                                "description": "view_detail"
                            }
                        ],
                        "valid": true
                    },
                    "componentGroupReferenceList": [],
                    "resourceSpecKey": {
                        "resourceSpecId": 171190,
                        "resourceCode": "sim_rsrc",
                        "name": "SIMCARD"
                    },
                    "checkServiceAvailable": false,
                    "rankingCategoryContents": [],
                    "saleType": {
                        "id": 8,
                        "name": "Post Paid tr",
                        "description": "Post Paid tr",
                        "shortCode": "POST_PAID",
                        "entityCodeName": "PROD_OFR_SALES_TP",
                        "entityName": "PROD_OFR",
                        "resourceKey": "GNL_TP_8",
                        "sortId": 0,
                        "externalShortCode": "POST_PAID",
                        "externalShortCodeWithRollbackValue": "POST_PAID"
                    }
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317179321,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -19
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -19
                        },
                        "involvementKey": {
                            "involvementId": 594,
                            "involvementName": "lineCategory",
                            "involvementCode": "lineCategory"
                        },
                        "fictitious": false,
                        "label": "19 - Line"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "SimCard",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 290620,
                            "charShortCode": "msisdn",
                            "charValueId": 638960,
                            "shortCode": "msisdn",
                            "charValue": "5010042487",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 290620,
                        "shortCode": "msisdn",
                        "charName": "MSISDN",
                        "description": "Seçilen Telefon Numarası",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 290620,
                                "charShortCode": "msisdn",
                                "charValueId": 638960,
                                "shortCode": "msisdn",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "derivationFormula": "etiya.commerce.backend.odf.order.service.deriveredformula.offerinstance.OdfMsisdnDerivedFormula",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 291150,
                            "charShortCode": "aa_iccid",
                            "charValueId": 639800,
                            "shortCode": "aa_iccid",
                            "charValue": "{{iccidPosFonk}}",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 291150,
                        "shortCode": "aa_iccid",
                        "charName": "ICCID",
                        "description": "Sim Kart Seri Numarası",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 291150,
                                "charShortCode": "aa_iccid",
                                "charValueId": 639800,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.OdfValidateIccidNumberValidator",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 291340,
                            "charShortCode": "aa_msisdn_type",
                            "charValueId": 50000494,
                            "shortCode": "N",
                            "charValue": "N",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Normal",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 291340,
                        "shortCode": "aa_msisdn_type",
                        "charName": "MSISDN Tipi",
                        "description": "MSISDN Tipi\n",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 291340,
                                "charShortCode": "aa_msisdn_type",
                                "charValueId": 50000493,
                                "shortCode": "G",
                                "charValue": "G",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Gold",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 291340,
                                "charShortCode": "aa_msisdn_type",
                                "charValueId": 50000494,
                                "shortCode": "N",
                                "charValue": "N",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Normal",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 291430,
                            "charShortCode": "aa_credit_basket",
                            "charValueId": 640410,
                            "shortCode": "aa_credit_basket",
                            "charValue": "0",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 291430,
                        "shortCode": "aa_credit_basket",
                        "charName": "Credit Basket",
                        "description": "Credit Basket",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 291430,
                                "charShortCode": "aa_credit_basket",
                                "charValueId": 640410,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": false,
                        "valueType": "INT",
                        "displayType": "INT",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 291440,
                            "charShortCode": "aa_bonus_basket",
                            "charValueId": 640420,
                            "shortCode": "aa_bonus_basket",
                            "charValue": "0",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 291440,
                        "shortCode": "aa_bonus_basket",
                        "charName": "Bonus Basket",
                        "description": "Bonus Basket",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 291440,
                                "charShortCode": "aa_bonus_basket",
                                "charValueId": 640420,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": false,
                        "valueType": "INT",
                        "displayType": "INT",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296730,
                            "charShortCode": "aa_is_flexible_sim",
                            "charValueId": 50000414,
                            "shortCode": "aa_is_flexible_sim",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Evet",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296730,
                        "shortCode": "aa_is_flexible_sim",
                        "charName": "Esnek Sim mi",
                        "description": "Esnek Sim mi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296730,
                                "charShortCode": "aa_is_flexible_sim",
                                "charValueId": 50000414,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 296730,
                                "charShortCode": "aa_is_flexible_sim",
                                "charValueId": 50000413,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 296740,
                            "charShortCode": "aa_imsi",
                            "charValueId": 647150,
                            "shortCode": "aa_imsi",
                            "charValue": "286037200144508",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296740,
                        "shortCode": "aa_imsi",
                        "charName": "IMSI",
                        "description": "IMSI",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296740,
                                "charShortCode": "aa_imsi",
                                "charValueId": 647150,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296750,
                            "charShortCode": "aa_pin1",
                            "charValueId": 647160,
                            "shortCode": "aa_pin1",
                            "charValue": "2947",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296750,
                        "shortCode": "aa_pin1",
                        "charName": "PIN1",
                        "description": "PIN1",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296750,
                                "charShortCode": "aa_pin1",
                                "charValueId": 647160,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296760,
                            "charShortCode": "aa_pin2",
                            "charValueId": 647170,
                            "shortCode": "aa_pin2",
                            "charValue": "3431",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296760,
                        "shortCode": "aa_pin2",
                        "charName": "PIN2",
                        "description": "PIN2",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296760,
                                "charShortCode": "aa_pin2",
                                "charValueId": 647170,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296770,
                            "charShortCode": "aa_puk1",
                            "charValueId": 647180,
                            "shortCode": "aa_puk1",
                            "charValue": "07794346",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296770,
                        "shortCode": "aa_puk1",
                        "charName": "PUK1",
                        "description": "PUK1",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296770,
                                "charShortCode": "aa_puk1",
                                "charValueId": 647180,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296780,
                            "charShortCode": "aa_puk2",
                            "charValueId": 647190,
                            "shortCode": "aa_puk2",
                            "charValue": "27622940",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296780,
                        "shortCode": "aa_puk2",
                        "charName": "PUK2",
                        "description": "PUK2",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296780,
                                "charShortCode": "aa_puk2",
                                "charValueId": 647190,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296790,
                            "charShortCode": "aa_simcard_memory",
                            "charValueId": 50000415,
                            "shortCode": "aa_simcard_memory",
                            "charValue": "64KB",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296790,
                        "shortCode": "aa_simcard_memory",
                        "charName": "Simkart Hafızası",
                        "description": "Simkart Hafızası",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296790,
                                "charShortCode": "aa_simcard_memory",
                                "charValueId": 50000415,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296800,
                            "charShortCode": "aa_simcard_nmu",
                            "charValueId": 647220,
                            "shortCode": "aa_simcard_nmu",
                            "charValue": "117415",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296800,
                        "shortCode": "aa_simcard_nmu",
                        "charName": "Simkart NMU",
                        "description": "NMU",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296800,
                                "charShortCode": "aa_simcard_nmu",
                                "charValueId": 647220,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296810,
                            "charShortCode": "aa_simcard_nmu_code",
                            "charValueId": 647230,
                            "shortCode": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296810,
                        "shortCode": "aa_simcard_nmu_code",
                        "charName": "Simkart NMU Kodu",
                        "description": "Simkart NMU Kodu",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296810,
                                "charShortCode": "aa_simcard_nmu_code",
                                "charValueId": 647230,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 296830,
                            "charShortCode": "aa_sim_physical_size",
                            "charValueId": 50000418,
                            "shortCode": "nano",
                            "charValue": "Nano",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Nano",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296830,
                        "shortCode": "aa_sim_physical_size",
                        "charName": "Simkart Boyutu",
                        "description": "Simkart Boyutu",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296830,
                                "charShortCode": "aa_sim_physical_size",
                                "charValueId": 50000418,
                                "shortCode": "nano",
                                "charValue": "Nano",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Nano",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 296830,
                                "charShortCode": "aa_sim_physical_size",
                                "charValueId": 50000416,
                                "shortCode": "normal",
                                "charValue": "Normal",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Normal",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 296830,
                                "charShortCode": "aa_sim_physical_size",
                                "charValueId": 50000417,
                                "shortCode": "micro",
                                "charValue": "Mikro",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Mikro",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 296840,
                            "charShortCode": "aa_is_sim_nfc",
                            "charValueId": 50000420,
                            "shortCode": "FALSE",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Hayır",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 296840,
                        "shortCode": "aa_is_sim_nfc",
                        "charName": "Simkart NFC mi",
                        "description": "Simkart NFC mi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 296840,
                                "charShortCode": "aa_is_sim_nfc",
                                "charValueId": 50000420,
                                "shortCode": "FALSE",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 296840,
                                "charShortCode": "aa_is_sim_nfc",
                                "charValueId": 50000419,
                                "shortCode": "TRUE",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 297952,
                            "charShortCode": "aa_distributor_code",
                            "charValueId": 50000272,
                            "shortCode": "aa_distributor_code",
                            "charValue": "550005",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 297952,
                        "shortCode": "aa_distributor_code",
                        "charName": "Distribütör kodu",
                        "description": "Distribitör kodu",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 297952,
                                "charShortCode": "aa_distributor_code",
                                "charValueId": 50000272,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 298038,
                            "charShortCode": "aa_simcard_type",
                            "charValueId": 50000357,
                            "shortCode": "aa_simcard_type",
                            "charValue": "WHITECARD",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Whitecard",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 298038,
                        "shortCode": "aa_simcard_type",
                        "charName": "Simkart Tipi",
                        "description": "Simkart Tipi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 298038,
                                "charShortCode": "aa_simcard_type",
                                "charValueId": 50000357,
                                "shortCode": "WHITECARD",
                                "charValue": "WHITECARD",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Whitecard",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 298038,
                                "charShortCode": "aa_simcard_type",
                                "charValueId": 50000358,
                                "shortCode": "PREASSIGNED",
                                "charValue": "PREASSIGNED",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Preassigned",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 298046,
                            "charShortCode": "aa_mvno_value",
                            "charValueId": 50000454,
                            "shortCode": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 298046,
                        "shortCode": "aa_mvno_value",
                        "charName": "Simkart Mvno Degeri",
                        "description": "Simkart Mvno Degeri",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 298046,
                                "charShortCode": "aa_mvno_value",
                                "charValueId": 50000454,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 298048,
                            "charShortCode": "aa_sim_lang_id",
                            "charValueId": 50000455,
                            "shortCode": "aa_sim_lang_id",
                            "charValue": "TUR",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 298048,
                        "shortCode": "aa_sim_lang_id",
                        "charName": "Simkart Dili",
                        "description": "Simkart Dili",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 298048,
                                "charShortCode": "aa_sim_lang_id",
                                "charValueId": 50000455,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 305450,
                            "charShortCode": "aa_mvno_code",
                            "charValueId": 655190,
                            "shortCode": "aa_mvno_code",
                            "charValue": "AVEA",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 305450,
                        "shortCode": "aa_mvno_code",
                        "charName": "MVNO Kodu",
                        "description": "MVNO Kodu",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 305450,
                                "charShortCode": "aa_mvno_code",
                                "charValueId": 655190,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 1310082,
                            "charShortCode": "aa_payflex_prod_id",
                            "charValueId": 50010753,
                            "shortCode": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "EMPTY",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 1310082,
                        "shortCode": "aa_payflex_prod_id",
                        "charName": "Payflex Ürün Id",
                        "description": "Payflex Ürün Id",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 1310082,
                                "charShortCode": "aa_payflex_prod_id",
                                "charValueId": 50010753,
                                "shortCode": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "EMPTY",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 3345858,
                            "charShortCode": "aa_lte_support",
                            "charValueId": 50031743,
                            "shortCode": "aa_lte_support",
                            "charValue": "true",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Evet",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 3345858,
                        "shortCode": "aa_lte_support",
                        "charName": "Usim support",
                        "description": "Usim support",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3345858,
                                "charShortCode": "aa_lte_support",
                                "charValueId": 50031743,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Evet",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3345858,
                                "charShortCode": "aa_lte_support",
                                "charValueId": 50031744,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Hayır",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346158,
                            "charShortCode": "aa_sim_type",
                            "charValueId": 50073859,
                            "shortCode": "STANDART",
                            "charValue": "STANDART",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "standart",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": true,
                        "charId": 3346158,
                        "shortCode": "aa_sim_type",
                        "charName": "SIM Tipi",
                        "description": "SIM Tipi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346158,
                                "charShortCode": "aa_sim_type",
                                "charValueId": 50073860,
                                "shortCode": "ESIM",
                                "charValue": "ESIM",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "esim",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 3346158,
                                "charShortCode": "aa_sim_type",
                                "charValueId": 50073859,
                                "shortCode": "STANDART",
                                "charValue": "STANDART",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "standart",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.SimTypeValidator",
                        "charType": "CONFIG",
                        "valueValidated": true,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 3346159,
                            "charShortCode": "aa_esim_type",
                            "charValueId": 50073859,
                            "shortCode": "STANDART",
                            "charValue": "printed",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "standart",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 3346159,
                        "shortCode": "aa_esim_type",
                        "charName": "ESIM Tipi",
                        "description": "ESIM Tipi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 3346159,
                                "charShortCode": "aa_esim_type",
                                "charValueId": 50073859,
                                "shortCode": "STANDART",
                                "charValue": "printed",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "standart",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 21000034,
                            "charShortCode": "aa_msisdn_sncode",
                            "charValueId": 200001827,
                            "shortCode": "GOLD",
                            "charValue": "0",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "GOLD",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": false
                        },
                        "updated": false,
                        "charId": 21000034,
                        "shortCode": "aa_msisdn_sncode",
                        "charName": "aa_msisdn_sncode",
                        "description": "aa_msisdn_sncode",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 21000034,
                                "charShortCode": "aa_msisdn_sncode",
                                "charValueId": 200001827,
                                "shortCode": "GOLD",
                                "charValue": "20430",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "GOLD",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            },
                            {
                                "charId": 21000034,
                                "charShortCode": "aa_msisdn_sncode",
                                "charValueId": 200001828,
                                "shortCode": "GOLDSTAR",
                                "charValue": "20429",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "GOLDSTAR",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": false,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 200000353,
                            "charShortCode": "aa_simcard_price",
                            "charValueId": 200000923,
                            "shortCode": "INTERNET_PACKAGE_OFFER",
                            "charValue": "20",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Ek 2GB İnternet Paket Kampanyası",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000353,
                        "shortCode": "aa_simcard_price",
                        "charName": "SIM Kart Ucreti",
                        "description": "SIM Kart Ucreti",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000353,
                                "charShortCode": "aa_simcard_price",
                                "charValueId": 200000923,
                                "shortCode": "INTERNET_PACKAGE_OFFER",
                                "charValue": "20",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Ek 2GB İnternet Paket Kampanyası",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            },
                            {
                                "charId": 200000353,
                                "charShortCode": "aa_simcard_price",
                                "charValueId": 200000922,
                                "shortCode": "SIM_CARD_OFFER",
                                "charValue": "20",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Sim Kart Ücreti",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": false
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    },
                    {
                        "capturedValue": {
                            "charId": 291160000000,
                            "charShortCode": "aa_esim_imei",
                            "charValueId": 50073859,
                            "shortCode": "STANDART",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "standart",
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 291160000000,
                        "shortCode": "aa_esim_imei",
                        "charName": "aa_esim_imei",
                        "description": "aa_esim_imei",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 291160000000,
                                "charShortCode": "aa_esim_imei",
                                "charValueId": 50073859,
                                "shortCode": "STANDART",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "standart",
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "validatorClass": "etiya.commerce.backend.odf.pcm.operation.validator.EsimImeiValidator",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": true,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 9,
                            "prodOfrId": 39999917,
                            "prodOfrName": "SimCard",
                            "gnlRoleSpecId": 594,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 111,
                            "rowId": 171190,
                            "gnlSpecRolRelId": 2123,
                            "cDate": 1600184790000,
                            "cUser": 1,
                            "name": "lineCategory",
                            "descr": "lineCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_594",
                            "roleCode": "lineCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -19
                                },
                                "involvementKey": {
                                    "involvementId": 594,
                                    "involvementName": "lineCategory",
                                    "involvementCode": "lineCategory"
                                },
                                "fictitious": false,
                                "label": "19 - Line"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            },
            {
                "customerOrderItemId": -22,
                "quoteKey": {
                    "customerOrderId": 69115
                },
                "productOffer": {
                    "productOfferId": 1003623,
                    "offerName": "Network Service Specification",
                    "description": "Network Service Specification",
                    "contractName": "Network Service Specification",
                    "billingName": "Network Service Specification",
                    "offerStatus": "Aktif",
                    "bundle": false,
                    "quoteTemplate": false,
                    "offerType": "POFFR",
                    "productOfferPrices": [],
                    "vendorKey": {
                        "vendorId": 0
                    },
                    "supplierKey": {
                        "supplierId": 0
                    },
                    "medias": [],
                    "discounts": [],
                    "quickAddSupported": false,
                    "favor": false,
                    "charValueProductOfferRelations": [],
                    "temporaryOffer": false,
                    "installmentRequired": false,
                    "shipmentRequired": false,
                    "quantityEnabled": false,
                    "productSpecId": 3732,
                    "virtual": false,
                    "componentGroupReferenceList": [],
                    "serviceSpecKey": {
                        "serviceSpecId": 2374,
                        "serviceCode": "networkCfs",
                        "networkServiceCode": "networkCfs",
                        "name": "Network Service Specification"
                    },
                    "checkServiceAvailable": false,
                    "rankingCategoryContents": [],
                    "saleType": {
                        "id": 8,
                        "name": "Post Paid tr",
                        "description": "Post Paid tr",
                        "shortCode": "POST_PAID",
                        "entityCodeName": "PROD_OFR_SALES_TP",
                        "entityName": "PROD_OFR",
                        "resourceKey": "GNL_TP_8",
                        "sortId": 0,
                        "externalShortCode": "POST_PAID",
                        "externalShortCodeWithRollbackValue": "POST_PAID"
                    }
                },
                "quantity": 1,
                "user": {
                    "userId": 1128958,
                    "name": "DİLEK MARİA",
                    "saleCnlId": 1109,
                    "saleCnlName": "BAYI",
                    "employeeId": 7782679,
                    "employeeNumber": "7782679",
                    "preferredCollation": "en",
                    "userType": "CSR",
                    "userScreenName": "DİLEK MARİA",
                    "employeeName": "DİLEK MARİA",
                    "employeeFirstName": "DİLEK",
                    "id": 1128958
                },
                "channel": {
                    "channelId": 1109,
                    "name": "BAYİ",
                    "shortCode": "BAYI",
                    "anonymous": false
                },
                "createDate": 1716317179901,
                "status": "QUOTE",
                "prices": [],
                "discounts": [],
                "subItems": [],
                "actionCode": "ACTIVATION",
                "selected": true,
                "removable": false,
                "offerInstanceInvolvements": [
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -19
                        },
                        "involvementKey": {
                            "involvementId": 0,
                            "involvementCode": "RELEVANT"
                        },
                        "fictitious": true
                    },
                    {
                        "offerInstanceKey": {
                            "customerOrderItemId": -19
                        },
                        "involvementKey": {
                            "involvementId": 594,
                            "involvementName": "lineCategory",
                            "involvementCode": "lineCategory"
                        },
                        "fictitious": false,
                        "label": "19 - Line"
                    }
                ],
                "quantityEnabled": false,
                "unsubscribed": false,
                "reactivated": false,
                "installmentRequired": false,
                "shipmentRequired": false,
                "appointmentRequired": false,
                "oliAddedType": "STATIC_OLI",
                "chargable": true,
                "referenceOrderItemId": 0,
                "virtual": false,
                "involvementManageManually": false,
                "notRefreshPrice": false,
                "name": "Network Service Specification",
                "documents": [],
                "productChars": [
                    {
                        "capturedValue": {
                            "charId": 61521,
                            "charShortCode": "VMS_CALL_FWD_NO",
                            "charValueId": 61198,
                            "shortCode": "VMS_CALL_FWD_NO",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61521,
                        "shortCode": "VMS_CALL_FWD_NO",
                        "charName": "VoiceMail servisi ile yönlendirilen msisdn",
                        "description": "VoiceMail servisi ile yönlendirilen msisdn",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61521,
                                "charShortCode": "VMS_CALL_FWD_NO",
                                "charValueId": 61198,
                                "shortCode": "VMS_CALL_FWD_NO",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61522,
                            "charShortCode": "CALL_FWD_NO",
                            "charValueId": 61199,
                            "shortCode": "CALL_FWD_NO",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61522,
                        "shortCode": "CALL_FWD_NO",
                        "charName": "Yönlendirilen msisdn",
                        "description": "Yönlendirilen msisdn",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61522,
                                "charShortCode": "CALL_FWD_NO",
                                "charValueId": 61199,
                                "shortCode": "CALL_FWD_NO",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61523,
                            "charShortCode": "CALL_FWD_TYPE",
                            "charValueId": 61200,
                            "shortCode": "CALL_FWD_TYPE",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61523,
                        "shortCode": "CALL_FWD_TYPE",
                        "charName": "Çağrı Yönlendirme Tipi",
                        "description": "Çağrı Yönlendirme Tipi",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61523,
                                "charShortCode": "CALL_FWD_TYPE",
                                "charValueId": 61200,
                                "shortCode": "CALL_FWD_TYPE",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61524,
                            "charShortCode": "SENT_EMAIL",
                            "charValueId": 61201,
                            "shortCode": "SENT_EMAIL",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61524,
                        "shortCode": "SENT_EMAIL",
                        "charName": "Mail Iletilecek Adres",
                        "description": "Mail Iletilecek Adres",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61524,
                                "charShortCode": "SENT_EMAIL",
                                "charValueId": 61201,
                                "shortCode": "SENT_EMAIL",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61525,
                            "charShortCode": "CLIP",
                            "charValueId": 61202,
                            "shortCode": "CLIP",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61525,
                        "shortCode": "CLIP",
                        "charName": "CLIP ",
                        "description": "CLIP ",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61525,
                                "charShortCode": "CLIP",
                                "charValueId": 61202,
                                "shortCode": "CLIP",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61526,
                            "charShortCode": "CLIR",
                            "charValueId": 61203,
                            "shortCode": "CLIR",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61526,
                        "shortCode": "CLIR",
                        "charName": "CLIR",
                        "description": "CLIR",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61526,
                                "charShortCode": "CLIR",
                                "charValueId": 61203,
                                "shortCode": "CLIR",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61527,
                            "charShortCode": "OUT_CALL_BARR",
                            "charValueId": 61204,
                            "shortCode": "OUT_CALL_BARR",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61527,
                        "shortCode": "OUT_CALL_BARR",
                        "charName": "OUT_CALL_BARR",
                        "description": "OUT_CALL_BARR",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61527,
                                "charShortCode": "OUT_CALL_BARR",
                                "charValueId": 61204,
                                "shortCode": "OUT_CALL_BARR",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61528,
                            "charShortCode": "IN_CALL_BARR",
                            "charValueId": 61205,
                            "shortCode": "IN_CALL_BARR",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61528,
                        "shortCode": "IN_CALL_BARR",
                        "charName": "IN_CALL_BARR",
                        "description": "IN_CALL_BARR",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61528,
                                "charShortCode": "IN_CALL_BARR",
                                "charValueId": 61205,
                                "shortCode": "IN_CALL_BARR",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61529,
                            "charShortCode": "ROAM",
                            "charValueId": 61206,
                            "shortCode": "ROAM",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61529,
                        "shortCode": "ROAM",
                        "charName": "ROAM",
                        "description": "ROAM",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61529,
                                "charShortCode": "ROAM",
                                "charValueId": 61206,
                                "shortCode": "ROAM",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61530,
                            "charShortCode": "INT_OUT_CALL_BARR",
                            "charValueId": 61207,
                            "shortCode": "INT_OUT_CALL_BARR",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61530,
                        "shortCode": "INT_OUT_CALL_BARR",
                        "charName": "INT_OUT_CALL_BARR",
                        "description": "INT_OUT_CALL_BARR",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61530,
                                "charShortCode": "INT_OUT_CALL_BARR",
                                "charValueId": 61207,
                                "shortCode": "INT_OUT_CALL_BARR",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61531,
                            "charShortCode": "CALL_WAIT",
                            "charValueId": 61208,
                            "shortCode": "CALL_WAIT",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61531,
                        "shortCode": "CALL_WAIT",
                        "charName": "CALL_WAIT",
                        "description": "CALL_WAIT",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61531,
                                "charShortCode": "CALL_WAIT",
                                "charValueId": 61208,
                                "shortCode": "CALL_WAIT",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61532,
                            "charShortCode": "CALL_HOLD",
                            "charValueId": 61209,
                            "shortCode": "CALL_HOLD",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61532,
                        "shortCode": "CALL_HOLD",
                        "charName": "CALL_HOLD",
                        "description": "CALL_HOLD",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61532,
                                "charShortCode": "CALL_HOLD",
                                "charValueId": 61209,
                                "shortCode": "CALL_HOLD",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61533,
                            "charShortCode": "CALL_FWD",
                            "charValueId": 61210,
                            "shortCode": "CALL_FWD",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61533,
                        "shortCode": "CALL_FWD",
                        "charName": "CALL_FWD",
                        "description": "CALL_FWD",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61533,
                                "charShortCode": "CALL_FWD",
                                "charValueId": 61210,
                                "shortCode": "CALL_FWD",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 61536,
                            "charShortCode": "CONF_CALL",
                            "charValueId": 61211,
                            "shortCode": "CONF_CALL",
                            "charValue": "EMPTY",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "scrOrd": 0,
                            "default": true
                        },
                        "updated": false,
                        "charId": 61536,
                        "shortCode": "CONF_CALL",
                        "charName": "CONF_CALL                             ",
                        "description": "CONF_CALL                             ",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 61536,
                                "charShortCode": "CONF_CALL",
                                "charValueId": 61211,
                                "shortCode": "CONF_CALL",
                                "charValue": "EMPTY",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "scrOrd": 0,
                                "default": true
                            }
                        ],
                        "visible": true,
                        "editable": true,
                        "optional": false,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    }
                ],
                "offerInstanceChars": [
                    {
                        "capturedValue": {
                            "charId": 100192,
                            "charShortCode": "resourceQualificationStatus",
                            "charValueId": 100301,
                            "shortCode": "resourceQualificationStatus",
                            "minValue": 0,
                            "maxValue": 0,
                            "visible": true,
                            "disabled": false,
                            "default": false
                        },
                        "updated": false,
                        "charId": 100192,
                        "shortCode": "resourceQualificationStatus",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 100192,
                                "charShortCode": "resourceQualificationStatus",
                                "charValueId": 100301,
                                "shortCode": "resourceQualificationStatus",
                                "minValue": 0,
                                "maxValue": 0,
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": false
                    },
                    {
                        "capturedValue": {
                            "charId": 200000528,
                            "charShortCode": "implicitItem",
                            "charValueId": 200001832,
                            "shortCode": "false",
                            "charValue": "false",
                            "minValue": 0,
                            "maxValue": 0,
                            "charValueLabel": "Implicit Item",
                            "visible": true,
                            "disabled": false,
                            "default": true
                        },
                        "updated": false,
                        "charId": 200000528,
                        "shortCode": "implicitItem",
                        "charName": "Implicit Item",
                        "description": "Implicit Item",
                        "displayOrder": 0,
                        "valueList": [
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001832,
                                "shortCode": "false",
                                "charValue": "false",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": true
                            },
                            {
                                "charId": 200000528,
                                "charShortCode": "implicitItem",
                                "charValueId": 200001831,
                                "shortCode": "true",
                                "charValue": "true",
                                "minValue": 0,
                                "maxValue": 0,
                                "charValueLabel": "Implicit Item",
                                "visible": true,
                                "disabled": false,
                                "default": false
                            }
                        ],
                        "visible": false,
                        "editable": true,
                        "optional": true,
                        "valueType": "STR",
                        "displayType": "STR",
                        "charType": "CONFIG",
                        "valueValidated": false,
                        "autoValidate": false,
                        "effectsPrice": false,
                        "effectsTo": [],
                        "effectsQuote": false,
                        "lov": true
                    }
                ],
                "involvementEditorList": [
                    {
                        "prodOfrCategoryRel": {
                            "mvProdOfrRoleRelId": 2,
                            "prodOfrId": 1003623,
                            "prodOfrName": "Network Service Specification",
                            "gnlRoleSpecId": 594,
                            "relTpId": 1231221,
                            "relCode": "REQ",
                            "dataTpId": 110,
                            "rowId": 2374,
                            "gnlSpecRolRelId": 2125,
                            "cDate": 1600184790000,
                            "cUser": 1,
                            "name": "lineCategory",
                            "descr": "lineCategory",
                            "maxCrdnty": 1,
                            "minCrdnty": 1,
                            "isGovAddr": 1,
                            "isGovOwner": 1,
                            "rsrcKey": "gnl_role_spec_594",
                            "roleCode": "lineCategory",
                            "gnlTpId": 1231221,
                            "lang": "tr"
                        },
                        "minCardinality": 1,
                        "maxCardinality": 1,
                        "potentialInvolvementItems": [
                            {
                                "offerInstanceKey": {
                                    "customerOrderItemId": -19
                                },
                                "involvementKey": {
                                    "involvementId": 594,
                                    "involvementName": "lineCategory",
                                    "involvementCode": "lineCategory"
                                },
                                "fictitious": false,
                                "label": "19 - Line"
                            }
                        ]
                    }
                ],
                "charValueOfferInstanceRelations": [],
                "additionalParameters": [],
                "byodOffer": false,
                "equipment": false,
                "shipmentOffer": false,
                "rentalOffer": false,
                "purchaseOffer": false,
                "vaporized": false,
                "inclusiveChannel": false,
                "quoteTemplate": false,
                "transferred": false,
                "offerInstancePrice": {
                    "oneTime": 0,
                    "recurring": 0,
                    "usage": 0,
                    "total": 0,
                    "taxOneTime": 0,
                    "taxRecurring": 0,
                    "taxUsage": 0,
                    "taxTotal": 0,
                    "vat": 0,
                    "delivery": 0,
                    "voucherDiscount": 0,
                    "taxInfos": [],
                    "oneTimeSubItems": [],
                    "recurringSubItems": [],
                    "usageSubItems": [],
                    "oneTimeTaxInfos": [],
                    "recurringTaxInfos": [],
                    "nextRecurringTaxInfos": [],
                    "usageTaxInfos": [],
                    "discountAppliedOneTime": 0,
                    "discountAppliedRecurring": 0,
                    "discountAppliedUsage": 0,
                    "discountAppliedTotal": 0,
                    "discountAppliedTaxOneTime": 0,
                    "discountAppliedTaxRecurring": 0,
                    "discountAppliedTaxUsage": 0,
                    "discountAppliedTaxTotal": 0,
                    "monthlyTotalWithoutFirstMonthDisc": 0
                }
            }
        ],
        "user": {
            "userId": 1128958,
            "name": "DİLEK MARİA",
            "uname": "B136518",
            "saleCnlId": 1109,
            "saleCnlName": "BAYI",
            "employeeId": 7782679,
            "employeeNumber": "7782679",
            "preferredCollation": "en",
            "userType": "CSR",
            "userScreenName": "DİLEK MARİA",
            "employeeName": "DİLEK MARİA",
            "employeeFirstName": "DİLEK",
            "id": 1128958
        },
        "customer": {
            "custId": 437130,
            "name": "AHMET",
            "surname": "MEHTAP"
        },
        "channel": {
            "channelId": 1109,
            "name": "BAYI",
            "shortCode": "BAYI",
            "anonymous": false
        },
        "createDate": 1716317102320,
        "updateDate": 1716317180573,
        "status": "QUOTE",
        "statusName": "Sepet",
        "bsnInter": {
            "bsnInterId": 293057,
            "shortCode": "REAL_SALE",
            "user": {
                "userId": 1128958,
                "name": "DİLEK MARİA",
                "saleCnlId": 1109,
                "saleCnlName": "BAYI",
                "employeeId": 7782679,
                "employeeNumber": "7782679",
                "preferredCollation": "en",
                "userType": "CSR",
                "userScreenName": "DİLEK MARİA",
                "employeeName": "DİLEK MARİA",
                "employeeFirstName": "DİLEK",
                "id": 1128958
            },
            "customer": {
                "custId": 437130,
                "name": "AHMET",
                "surname": "MEHTAP"
            },
            "channel": {
                "channelId": 1109,
                "name": "BAYİ",
                "shortCode": "BAYI",
                "anonymous": false
            },
            "createDate": 1716317102320,
            "status": "OPEN",
            "statusName": "Open",
            "documents": [
                {
                    "documentId": 21005356,
                    "documentName": "Hat İptal Talebi Formu",
                    "documentShortCode": "LN_CNCL_REQ_DOC",
                    "documentFormat": "application/octet-stream",
                    "mandatory": true,
                    "uploadRequired": false,
                    "uploadApplicable": true,
                    "documentType": "BSN_INTER_DOC",
                    "shipmentRequired": false,
                    "externalShortCode": "LN_CNCL_REQ_DOC",
                    "taken": false,
                    "attachment": false
                }
            ],
            "reasonTypeList": [],
            "quoteChars": []
        },
        "businessFlowSpecShortCode": "LINE_ACTIVATION",
        "forwardDated": false,
        "calculatedPrices": {
            "oneTime": 0,
            "recurring": 111.17,
            "usage": 0,
            "total": 111.17,
            "taxOneTime": 0,
            "taxRecurring": 111.17,
            "taxUsage": 0,
            "taxTotal": 111.17,
            "vat": 0,
            "delivery": 0,
            "voucherDiscount": 0,
            "currency": {
                "curId": 2,
                "currencyCode": "CAD"
            },
            "taxInfos": [],
            "oneTimeSubItems": [],
            "recurringSubItems": [],
            "usageSubItems": [],
            "oneTimeTaxInfos": [],
            "recurringTaxInfos": [],
            "nextRecurringTaxInfos": [],
            "usageTaxInfos": [],
            "discountAppliedOneTime": 0,
            "discountAppliedRecurring": 111.17,
            "discountAppliedUsage": 0,
            "discountAppliedTotal": 111.17,
            "discountAppliedTaxOneTime": 0,
            "discountAppliedTaxRecurring": 111.17,
            "discountAppliedTaxUsage": 0,
            "discountAppliedTaxTotal": 111.17,
            "monthlyTotalWithoutFirstMonthDisc": 0
        },
        "referenceOrderId": 0,
        "touchedByUser": false,
        "language": "tr",
        "componentGroupReferenceList": [],
        "partyPrivileges": [],
        "relatedAddonOffers": [],
        "portInAbility": false,
        "portOutAbility": false,
        "custTpId": 10,
        "techOnSiteVisible": false,
        "techOnSiteSelected": false,
        "crossSaleOrder": false,
        "compGrpPriceMap": {},
        "deliverInstallationRetrieveConfig": {
            "deliverMethods": [],
            "installationMethods": [],
            "retrieveMethods": []
        },
        "quoteChars": [
            {
                "capturedValue": {
                    "charId": 61232,
                    "charShortCode": "invoiceUnderLimit",
                    "charValueId": 61231,
                    "shortCode": "0",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 61232,
                "shortCode": "invoiceUnderLimit",
                "charName": "invoiceUnderLimit",
                "description": "invoiceUnderLimit",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61232,
                        "charShortCode": "invoiceUnderLimit",
                        "charValueId": 61231,
                        "shortCode": "0",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61232,
                        "charShortCode": "invoiceUnderLimit",
                        "charValueId": 61230,
                        "shortCode": "1",
                        "charValue": "1",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "INT",
                "displayType": "BOOLEAN_ON_OFF",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 61251,
                    "charShortCode": "autoPaymentSelected",
                    "charValueId": 61213,
                    "shortCode": "0",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 61251,
                "shortCode": "autoPaymentSelected",
                "charName": "autoPaymentSelected",
                "description": "autoPaymentSelected",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61251,
                        "charShortCode": "autoPaymentSelected",
                        "charValueId": 61213,
                        "shortCode": "0",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61251,
                        "charShortCode": "autoPaymentSelected",
                        "charValueId": 61212,
                        "shortCode": "1",
                        "charValue": "1",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "INT",
                "displayType": "BOOLEAN_ON_OFF",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 61252,
                    "charShortCode": "billAddrIsDiffContractAddr",
                    "charValueId": 61215,
                    "shortCode": "0",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 61252,
                "shortCode": "billAddrIsDiffContractAddr",
                "charName": "billAddrIsDiffContractAddr",
                "description": "billAddrIsDiffContractAddr",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61252,
                        "charShortCode": "billAddrIsDiffContractAddr",
                        "charValueId": 61215,
                        "shortCode": "0",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61252,
                        "charShortCode": "billAddrIsDiffContractAddr",
                        "charValueId": 61214,
                        "shortCode": "1",
                        "charValue": "1",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "INT",
                "displayType": "BOOLEAN_ON_OFF",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 61233,
                    "charShortCode": "invoiceSendingEmail",
                    "charValueId": 61232,
                    "shortCode": "invoiceSendingEmail",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 61233,
                "shortCode": "invoiceSendingEmail",
                "charName": "invoiceSendingEmail",
                "description": "invoiceSendingEmail",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61233,
                        "charShortCode": "invoiceSendingEmail",
                        "charValueId": 61232,
                        "shortCode": "invoiceSendingEmail",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 61231,
                    "charShortCode": "invoiceSendingMedium",
                    "charValueId": 200001342,
                    "shortCode": "smsFatura",
                    "charValue": "smsFatura",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "SMS-Fatura",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 61231,
                "shortCode": "invoiceSendingMedium",
                "charName": "invoiceSendingMedium",
                "description": "invoiceSendingMedium",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61231,
                        "charShortCode": "invoiceSendingMedium",
                        "charValueId": 200001342,
                        "shortCode": "smsFatura",
                        "charValue": "smsFatura",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "SMS-Fatura",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 61231,
                        "charShortCode": "invoiceSendingMedium",
                        "charValueId": 7777777,
                        "shortCode": "printed",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Basılı Fatura",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61231,
                        "charShortCode": "invoiceSendingMedium",
                        "charValueId": 61189,
                        "shortCode": "email",
                        "charValue": "E-Fatura",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "E-Fatura",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "INT",
                "displayType": "STR",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000503,
                    "charShortCode": "dig_cour_fee_pref",
                    "charValueId": 200001213,
                    "shortCode": "dig_cour_fee_pref",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000503,
                "shortCode": "dig_cour_fee_pref",
                "charName": "Dijital Kurye Ücret Tercihi",
                "description": "Dijital Kurye Ücret Tercihi",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000503,
                        "charShortCode": "dig_cour_fee_pref",
                        "charValueId": 200001213,
                        "shortCode": "dig_cour_fee_pref",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 200000503,
                        "charShortCode": "dig_cour_fee_pref",
                        "charValueId": 200001212,
                        "shortCode": "dig_cour_fee_pref",
                        "charValue": "1",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 1210,
                    "charShortCode": "aa_cust_info_msisdn",
                    "charValueId": 1210,
                    "shortCode": "aa_cust_info_msisdn",
                    "charValue": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 1210,
                "shortCode": "aa_cust_info_msisdn",
                "charName": "Müşteri Bilgilendirme Numarası",
                "description": "Müşteri Bilgilendirme Numarası",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 1210,
                        "charShortCode": "aa_cust_info_msisdn",
                        "charValueId": 1210,
                        "shortCode": "aa_cust_info_msisdn",
                        "charValue": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000114,
                    "charShortCode": "deliveryAddressType",
                    "charValueId": 200000288,
                    "shortCode": "nochoice",
                    "charValue": "nochoice",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "Teslimat tercihi yok",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000114,
                "shortCode": "deliveryAddressType",
                "charName": "Teslimat Adres Tipi",
                "description": "Teslimat Adres Tipi",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000114,
                        "charShortCode": "deliveryAddressType",
                        "charValueId": 200000288,
                        "shortCode": "nochoice",
                        "charValue": "nochoice",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Teslimat tercihi yok",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 200000114,
                        "charShortCode": "deliveryAddressType",
                        "charValueId": 200000115,
                        "shortCode": "nonbill",
                        "charValue": "nonbill",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Müşteri teslimat adresine teslim",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 200000114,
                        "charShortCode": "deliveryAddressType",
                        "charValueId": 200000114,
                        "shortCode": "bill",
                        "charValue": "bill",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Müşteri fatura adresine teslim",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000114,
                        "charShortCode": "deliveryAddressType",
                        "charValueId": 200000113,
                        "shortCode": "dealer",
                        "charValue": "dealer",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Bayiden teslim",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "LIST",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000298,
                    "charShortCode": "invoiceSendingSms",
                    "charValueId": 200001341,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 200000298,
                "shortCode": "invoiceSendingSms",
                "charName": "invoiceSendingSms",
                "description": "invoiceSendingSms",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000298,
                        "charShortCode": "invoiceSendingSms",
                        "charValueId": 200001341,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000294,
                    "charShortCode": "SMSBILL_MSISDN",
                    "charValueId": 200001338,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 200000294,
                "shortCode": "SMSBILL_MSISDN",
                "charName": "SMSBILL_MSISDN",
                "description": "SMSBILL_MSISDN",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000294,
                        "charShortCode": "SMSBILL_MSISDN",
                        "charValueId": 200001338,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000295,
                    "charShortCode": "SMSBILL_REQ",
                    "charValueId": 200001339,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 200000295,
                "shortCode": "SMSBILL_REQ",
                "charName": "SMSBILL_REQ",
                "description": "SMSBILL_REQ",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000295,
                        "charShortCode": "SMSBILL_REQ",
                        "charValueId": 200001339,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 800,
                    "charShortCode": "aa_omni_price",
                    "charValueId": 829,
                    "shortCode": "aa_omni_price",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "scrOrd": 0,
                    "default": true
                },
                "updated": false,
                "charId": 800,
                "shortCode": "aa_omni_price",
                "charName": "aa_omni_price",
                "description": "aa_omni_price",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 800,
                        "charShortCode": "aa_omni_price",
                        "charValueId": 829,
                        "shortCode": "aa_omni_price",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "scrOrd": 0,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 1051,
                    "charShortCode": "aa_pgw_token",
                    "charValueId": 55000050,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 1051,
                "shortCode": "aa_pgw_token",
                "charName": "PGW Token",
                "description": "PGW Token",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 1051,
                        "charShortCode": "aa_pgw_token",
                        "charValueId": 55000050,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 1052,
                    "charShortCode": "aa_payment_status",
                    "charValueId": 55000051,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 1052,
                "shortCode": "aa_payment_status",
                "charName": "Payment Status",
                "description": "Payment Status",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 1052,
                        "charShortCode": "aa_payment_status",
                        "charValueId": 55000051,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 1209,
                    "charShortCode": "aa_pgw_transaction_id",
                    "charValueId": 1209,
                    "shortCode": "aa_pgw_transaction_id",
                    "charValue": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 1209,
                "shortCode": "aa_pgw_transaction_id",
                "charName": "Provizyonlama transaction id",
                "description": "Provizyonlama transaction id",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 1209,
                        "charShortCode": "aa_pgw_transaction_id",
                        "charValueId": 1209,
                        "shortCode": "aa_pgw_transaction_id",
                        "charValue": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "LIST",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000393,
                    "charShortCode": "invoiceSendingEmailIsVerified",
                    "charValueId": 200000963,
                    "shortCode": "invoiceSendingEmailIsVerified",
                    "charValue": "NONVERIFIED",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000393,
                "shortCode": "invoiceSendingEmailIsVerified",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000393,
                        "charShortCode": "invoiceSendingEmailIsVerified",
                        "charValueId": 200000962,
                        "shortCode": "invoiceSendingEmailIsVerified",
                        "charValue": "VERIFIED",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000393,
                        "charShortCode": "invoiceSendingEmailIsVerified",
                        "charValueId": 200000965,
                        "shortCode": "invoiceSendingEmailIsVerified",
                        "charValue": "NO_VERIFY",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000393,
                        "charShortCode": "invoiceSendingEmailIsVerified",
                        "charValueId": 200000964,
                        "shortCode": "invoiceSendingEmailIsVerified",
                        "charValue": "NONVERIFIED_TECH",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000393,
                        "charShortCode": "invoiceSendingEmailIsVerified",
                        "charValueId": 200000963,
                        "shortCode": "invoiceSendingEmailIsVerified",
                        "charValue": "NONVERIFIED",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000394,
                    "charShortCode": "invoiceSendingSmsIsVerified",
                    "charValueId": 200000967,
                    "shortCode": "invoiceSendingSmsIsVerified",
                    "charValue": "NONVERIFIED",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000394,
                "shortCode": "invoiceSendingSmsIsVerified",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000394,
                        "charShortCode": "invoiceSendingSmsIsVerified",
                        "charValueId": 200000966,
                        "shortCode": "invoiceSendingSmsIsVerified",
                        "charValue": "VERIFIED",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000394,
                        "charShortCode": "invoiceSendingSmsIsVerified",
                        "charValueId": 200000969,
                        "shortCode": "invoiceSendingSmsIsVerified",
                        "charValue": "NO_VERIFY",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000394,
                        "charShortCode": "invoiceSendingSmsIsVerified",
                        "charValueId": 200000968,
                        "shortCode": "invoiceSendingSmsIsVerified",
                        "charValue": "NONVERIFIED_TECH",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000394,
                        "charShortCode": "invoiceSendingSmsIsVerified",
                        "charValueId": 200000967,
                        "shortCode": "invoiceSendingSmsIsVerified",
                        "charValue": "NONVERIFIED",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000400,
                    "charShortCode": "holdOrder",
                    "charValueId": 200001701,
                    "shortCode": "false",
                    "charValue": "false",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "Hayır",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000400,
                "shortCode": "holdOrder",
                "charName": "holdTheOrder",
                "description": "holdTheOrder",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000400,
                        "charShortCode": "holdOrder",
                        "charValueId": 200001701,
                        "shortCode": "false",
                        "charValue": "false",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Hayır",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 200000400,
                        "charShortCode": "holdOrder",
                        "charValueId": 200001700,
                        "shortCode": "true",
                        "charValue": "true",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Evet",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000558,
                    "charShortCode": "DGTL_COUR",
                    "charValueId": 200001897,
                    "shortCode": "DGTL_COUR",
                    "charValue": "40",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000558,
                "shortCode": "DGTL_COUR",
                "charName": "Dijital Kurye Ücreti",
                "description": "Dijital Kurye Ücreti",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000558,
                        "charShortCode": "DGTL_COUR",
                        "charValueId": 200001897,
                        "shortCode": "DGTL_COUR",
                        "charValue": "40",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000273,
                    "charShortCode": "quotaInfoSendingSms",
                    "charValueId": 200000823,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000273,
                "shortCode": "quotaInfoSendingSms",
                "charName": "Kota Bilgi SMS Numarası",
                "description": "Kota Bilgi SMS Numarası",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000273,
                        "charShortCode": "quotaInfoSendingSms",
                        "charValueId": 200000823,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 61580,
                    "charShortCode": "scl_ctgry",
                    "charValueId": 61769,
                    "shortCode": "empty",
                    "charValue": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 61580,
                "shortCode": "scl_ctgry",
                "charName": "Özel Kategori",
                "description": "Özel Kategori",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61580,
                        "charShortCode": "scl_ctgry",
                        "charValueId": 61753,
                        "shortCode": "hear_impr_ref",
                        "charValue": "İşitme ve Konuşma Engelli/yakını",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "İşitme ve Konuşma Engelli/yakını",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61580,
                        "charShortCode": "scl_ctgry",
                        "charValueId": 61749,
                        "shortCode": "martyr_ref",
                        "charValue": "Sehit Yakınıları",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Şehit Yakınları",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61580,
                        "charShortCode": "scl_ctgry",
                        "charValueId": 61769,
                        "shortCode": "empty",
                        "charValue": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 61580,
                        "charShortCode": "scl_ctgry",
                        "charValueId": 61751,
                        "shortCode": "veteran_ref",
                        "charValue": "Gazi/yakını",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Gazi/yakını",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61580,
                        "charShortCode": "scl_ctgry",
                        "charValueId": 61752,
                        "shortCode": "vslly_impr_ref",
                        "charValue": "Görme Engelli/yakını",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Görme Engelli/yakını",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 61580,
                        "charShortCode": "scl_ctgry",
                        "charValueId": 61750,
                        "shortCode": "other_dsbld_ref",
                        "charValue": "Diğer Engelli/yakını",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Diğer Engelli/yakını",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 61582,
                    "charShortCode": "scl_ctgry_ref_nat_id",
                    "charValueId": 61754,
                    "shortCode": "scl_ctgry_ref_nat_id",
                    "charValue": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "scl_ctgry_ref_nat_id",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 61582,
                "shortCode": "scl_ctgry_ref_nat_id",
                "charName": "scl_ctgry_ref_nat_id",
                "description": "scl_ctgry_ref_nat_id",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 61582,
                        "charShortCode": "scl_ctgry_ref_nat_id",
                        "charValueId": 61754,
                        "shortCode": "scl_ctgry_ref_nat_id",
                        "charValue": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "scl_ctgry_ref_nat_id",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000510,
                    "charShortCode": "msisdn_rez_duration",
                    "charValueId": 200001800,
                    "shortCode": "259200",
                    "charValue": "259200",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000510,
                "shortCode": "msisdn_rez_duration",
                "charName": "msisdn_rez_duration",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000510,
                        "charShortCode": "msisdn_rez_duration",
                        "charValueId": 200001801,
                        "shortCode": "115200",
                        "charValue": "115200",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000510,
                        "charShortCode": "msisdn_rez_duration",
                        "charValueId": 200001800,
                        "shortCode": "259200",
                        "charValue": "259200",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 200000510,
                        "charShortCode": "msisdn_rez_duration",
                        "charValueId": 200001802,
                        "shortCode": "7200",
                        "charValue": "7200",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000493,
                    "charShortCode": "digital_kurye_pricetypeId",
                    "charValueId": 200001202,
                    "shortCode": "digital_kurye_pricetypeId",
                    "charValue": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 200000493,
                "shortCode": "digital_kurye_pricetypeId",
                "charName": "Dijital Kurye Price Type Id",
                "description": "Dijital Kurye Price Type Id",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000493,
                        "charShortCode": "digital_kurye_pricetypeId",
                        "charValueId": 200001202,
                        "shortCode": "digital_kurye_pricetypeId",
                        "charValue": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 400019,
                    "charShortCode": "aa_tax_exemp",
                    "charValueId": 200001808,
                    "shortCode": "false",
                    "charValue": "false",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 400019,
                "shortCode": "aa_tax_exemp",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 400019,
                        "charShortCode": "aa_tax_exemp",
                        "charValueId": 200001807,
                        "shortCode": "true",
                        "charValue": "true",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 400019,
                        "charShortCode": "aa_tax_exemp",
                        "charValueId": 200001808,
                        "shortCode": "false",
                        "charValue": "false",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000195,
                    "charShortCode": "ovit_permission",
                    "charValueId": 200000743,
                    "shortCode": "0",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000195,
                "shortCode": "ovit_permission",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000195,
                        "charShortCode": "ovit_permission",
                        "charValueId": 200000726,
                        "shortCode": "1",
                        "charValue": "1",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000195,
                        "charShortCode": "ovit_permission",
                        "charValueId": 200000743,
                        "shortCode": "0",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 200000195,
                        "charShortCode": "ovit_permission",
                        "charValueId": 200000728,
                        "shortCode": "3",
                        "charValue": "3",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000195,
                        "charShortCode": "ovit_permission",
                        "charValueId": 200000727,
                        "shortCode": "2",
                        "charValue": "2",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 100110000009,
                    "charShortCode": "matchingId",
                    "charValueId": 100000000166,
                    "shortCode": "matchingId",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "scrOrd": 2,
                    "default": true
                },
                "updated": false,
                "charId": 100110000009,
                "shortCode": "matchingId",
                "charName": "matchingId",
                "description": "matchingId",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 100110000009,
                        "charShortCode": "matchingId",
                        "charValueId": 100000000166,
                        "shortCode": "matchingId",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "scrOrd": 2,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "DATE",
                "displayType": "DATE",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 200000125,
                    "charShortCode": "deliveryAddressId",
                    "charValueId": 200000274,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000125,
                "shortCode": "deliveryAddressId",
                "charName": "Sipariş Teslimat Adres Idsi",
                "description": "Sipariş Teslimat Adres Idsi",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000125,
                        "charShortCode": "deliveryAddressId",
                        "charValueId": 200000274,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 290840,
                    "charShortCode": "aa_payment_type",
                    "charValueId": 50000505,
                    "shortCode": "POSTPAID",
                    "charValue": "POSTPAID",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "Faturalı",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 290840,
                "shortCode": "aa_payment_type",
                "charName": "Ödeme Tipi",
                "description": "Ödeme Tipi",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 290840,
                        "charShortCode": "aa_payment_type",
                        "charValueId": 50000505,
                        "shortCode": "POSTPAID",
                        "charValue": "POSTPAID",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Faturalı",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 290840,
                        "charShortCode": "aa_payment_type",
                        "charValueId": 50000504,
                        "shortCode": "PREPAID",
                        "charValue": "PREPAID",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Faturasız",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 1040,
                    "charShortCode": "aa_payment_pref",
                    "charValueId": 55000010,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 1040,
                "shortCode": "aa_payment_pref",
                "charName": "Ödeme tipi",
                "description": "Ödeme tipi",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 1040,
                        "charShortCode": "aa_payment_pref",
                        "charValueId": 55000010,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 1040,
                        "charShortCode": "aa_payment_pref",
                        "charValueId": 55000012,
                        "shortCode": "BALANCE",
                        "charValue": "BALANCE",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Bakiye",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 1040,
                        "charShortCode": "aa_payment_pref",
                        "charValueId": 55000011,
                        "shortCode": "CREDITCARD",
                        "charValue": "CREDITCARD",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Kredi kartı",
                        "visible": true,
                        "disabled": false,
                        "default": false
                    }
                ],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 100119,
                    "charShortCode": "orderDate",
                    "charValueId": 100166,
                    "shortCode": "orderDate",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "scrOrd": 2,
                    "default": true
                },
                "updated": false,
                "charId": 100119,
                "shortCode": "orderDate",
                "charName": "Order Date",
                "description": "Order Date",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 100119,
                        "charShortCode": "orderDate",
                        "charValueId": 100166,
                        "shortCode": "orderDate",
                        "charValue": "0",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "scrOrd": 2,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "DATE",
                "displayType": "DATE",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 3346148,
                    "charShortCode": "aa_pts_down",
                    "charValueId": 50065272,
                    "shortCode": "TRUE",
                    "charValue": "true",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "Evet",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 3346148,
                "shortCode": "aa_pts_down",
                "charName": "PTS Down",
                "description": "PTS Down",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 3346148,
                        "charShortCode": "aa_pts_down",
                        "charValueId": 50065272,
                        "shortCode": "TRUE",
                        "charValue": "true",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Evet",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    },
                    {
                        "charId": 3346148,
                        "charShortCode": "aa_pts_down",
                        "charValueId": 50065271,
                        "shortCode": "FALSE",
                        "charValue": "false",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "Hayır",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 200000555,
                    "charShortCode": "aa_pts_down_line_cancel",
                    "charValueId": 200001843,
                    "shortCode": "FALSE",
                    "charValue": "false",
                    "minValue": 0,
                    "maxValue": 0,
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 200000555,
                "shortCode": "aa_pts_down_line_cancel",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 200000555,
                        "charShortCode": "aa_pts_down_line_cancel",
                        "charValueId": 200001844,
                        "shortCode": "TRUE",
                        "charValue": "true",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": false
                    },
                    {
                        "charId": 200000555,
                        "charShortCode": "aa_pts_down_line_cancel",
                        "charValueId": 200001843,
                        "shortCode": "FALSE",
                        "charValue": "false",
                        "minValue": 0,
                        "maxValue": 0,
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": true,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": true
            },
            {
                "capturedValue": {
                    "charId": 6000009,
                    "charShortCode": "dependentProductType",
                    "charValueId": 600023,
                    "shortCode": "EMPTY",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "EMPTY",
                    "visible": true,
                    "disabled": false,
                    "default": true
                },
                "updated": false,
                "charId": 6000009,
                "shortCode": "dependentProductType",
                "charName": "bağımlı ürün türü",
                "description": "bağımlı ürün türü",
                "displayOrder": 0,
                "valueList": [
                    {
                        "charId": 6000009,
                        "charShortCode": "dependentProductType",
                        "charValueId": 600023,
                        "shortCode": "EMPTY",
                        "minValue": 0,
                        "maxValue": 0,
                        "charValueLabel": "EMPTY",
                        "visible": true,
                        "disabled": false,
                        "default": true
                    }
                ],
                "visible": true,
                "editable": false,
                "optional": false,
                "valueType": "STR",
                "displayType": "STR_AREA",
                "derivationFormula": "etiya.commerce.backend.odf.order.service.deriveredformula.offerinstance.OdfDependentProductTypeDerivedFormula",
                "charType": "CONFIG",
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            },
            {
                "capturedValue": {
                    "charId": 290621,
                    "charShortCode": "aa_special_number_price",
                    "charValueId": 5525331,
                    "shortCode": "aa_special_number_price",
                    "charValue": "0",
                    "minValue": 0,
                    "maxValue": 0,
                    "charValueLabel": "aa_special_number_price",
                    "visible": true,
                    "disabled": false,
                    "default": false
                },
                "updated": false,
                "charId": 290621,
                "shortCode": "aa_special_number_price",
                "displayOrder": 0,
                "valueList": [],
                "visible": false,
                "editable": false,
                "optional": false,
                "valueValidated": false,
                "autoValidate": false,
                "effectsPrice": false,
                "effectsTo": [],
                "effectsQuote": false,
                "lov": false
            }
        ],
        "nextCustomerOrderItemId": -22,
        "operationList": [],
        "businessFlowSpec": {
            "businessFlowSpecId": 26,
            "bsnInterSpecId": 2,
            "shortCode": "LINE_ACTIVATION",
            "handlerClass": "etiya.commerce.backend.odf.order.service.handler.businessflow.OdfLineActivationBusinessFlowHandler",
            "contentList": [],
            "pageList": [],
            "charValueList": []
        },
        "customerKey": {
            "custId": 437130
        },
        "custQuote": false,
        "mnp": false,
        "initialChannelSelection": false,
        "organizationalQuote": false,
        "mnpRetry": false,
        "inflightChange": false
    }
        })
    })

    if (!response.ok) {
        throw new Error(`ICCID doğrulama isteği başarısız: ${response.status}`)
    }

    const data = await response.json()
    
    // MSISDN kontrolü
    if (!data.data?.generalParameterList?.some(param => param.shortCode === 'aa_msisdn')) {
        throw new Error('MSISDN bulunamadı')
    }

    return data
}

export const sendDocumentConfirmation = async (environment, tid, customerOrder) => {
    const baseUrl = API_CONFIG[environment].baseUrl
    const endpoint = API_ENDPOINTS.documentConfirmation
    const url = `${baseUrl}${endpoint}`

    const currentDate = new Date().toLocaleDateString('tr-TR')
    const currentDateTime = `${currentDate} 00:00:00`

    const response = await fetch(url, {
        method: 'POST',
        headers: commonHeaders,
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
        headers: commonHeaders,
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

export const getAuthToken = async (baseUrl) => {
    const endpoint = API_ENDPOINTS.auth
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: "B136474",
            password: "aa1234"
        })
    })

    if (!response.ok) {
        throw new Error(`Auth token isteği başarısız: ${response.status}`)
    }

    // Authorization header'ı al
    const authHeader = response.headers.get('Authorization')
    if (!authHeader) {
        throw new Error('Authorization header bulunamadı')
    }

    return authHeader
}

export const getIccid = async () => {
    const url = EXTERNAL_ENDPOINTS.iccidSet

    const response = await fetch(url)

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('ICCID kalmamış olabilir')
        }
        throw new Error(`ICCID isteği başarısız: ${response.status}`)
    }

    const iccid = await response.text()
    return iccid
} 