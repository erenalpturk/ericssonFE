export const API_CONFIG = {
    regresyon: {
        baseUrl: 'https://omni-oab-uat.turktelekom.com.tr'
    },
    fonksiyonel: {
        baseUrl: 'https://omni-oab-bau.turktelekom.com.tr'
    },
    hotfix: {
        baseUrl: 'https://omni-oab-hotfix.turktelekom.com.tr'
    }
}

export const API_ENDPOINTS = {
    courierNotification: '/asb-rest/shipment/digital/courier/notification',
    validateIccid: '/asb-rest/iccid/validate/order',
    documentConfirmation: '/asb-rest/document/confirmation',
    submitQuote: '/odf/quote/submitQuote',
    auth: '/auth',
    iccidValidate: '/odf/quote/char/validate',
    checkBlackGreyList: '/odf/customer/checkBlackGreyList',
    inquireMernis: '/odf/customer/mernis/inquireMernis',
    customerSearch: '/odf/customerSearchInfo/search',
    checkNatId: '/odf/customer/checkNatId',
    validateMernisInfo: '/odf/customer/mernis/validateCustMernisInfo',
    createCustomer: '/odf/customer/createCustomerWithNatId',
    inquireActiveLine: '/odf/customer/inquireCustomerActiveLine',
    blacklistValidation: '/odf/security/validation/blacklist',
    validateChannel: '/odf/validate/validateChannel',
    searchCustomerOrder: '/odf/customerorder/searchCustomerOrder',
    catalog: '/odf/productQualification/catalog',
    offering: '/odf/productQualification/offering',
    retrieveOfferDetails: '/odf/quote/retrieveOfferDetails',
    initialize: '/businessFlow/initialize',
    saveUserActionLog: '/odf/utility/log/saveUserActionLog',
    retrieveMsisdnReservation: '/odf/resourceReservation/retrieveMsisdnReservationForCancelReason',
    inquireStandardMsisdn: '/odf/msisdn/inquireStandardMsisdnSearch',
    updateQuotePlan: '/odf/quote/updateQuotePlan',
    ongoingQuote: '/odf/quote/ongoingQuote',
    categorizedCharacteristics: '/odf/char/categorizedCharacteristics',
    validateQuoteChar: '/odf/quote/char/validate',
    updateQuote: '/odf/quote/updateQuote',
    inquireVkl: '/odf/deputy/inquire/vkl',
    inquireVasi: '/odf/deputy/inquire/vasi',
    addressList: '/odf/customer/addressList',
    inquireLineuser: '/odf/deputy/inquire/lineuser',
    deputyCheckout: '/odf/deputy/checkout',
    securityQuestions: '/odf/security/verification/questions',
    checkMsisdn: '/odf/quote/checkMsisdn',
    contactInfo: '/odf/cntcMedium/contactInfo',
    inquireTariffType: '/odf/product/inquireTariffType',
    sendDocumentToDFM: '/odf/report/sendDocumentToDFM',
    resumeCallback: '/odf/quote/resume/callback/notification',
    documents: '/odf/report/documents',
}

export const EXTERNAL_ENDPOINTS = {
    iccidSet: 'https://iccid.vercel.app/iccid/getIccid/fonkpos',
    mernisSet: 'https://iccid.vercel.app/mernis/getmernis/fonkmernis',
    iccidSold: 'https://iccid.vercel.app/iccid/setSold',
    addActivation: 'https://iccid.vercel.app/iccid/EnesVeAlpDataniziCikti'
} 