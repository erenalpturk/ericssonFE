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
    submitQuote: '/asb-rest/quote/submit',
    auth: '/auth',
    iccidValidate: '/odf/quote/char/validate'
}

export const EXTERNAL_ENDPOINTS = {
    iccidSet: 'https://iccid.vercel.app/iccid/getIccid/fonkpos'
} 