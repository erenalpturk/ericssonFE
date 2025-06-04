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

export const EXTERNAL_ENDPOINTS = {
    iccidSet: 'https://iccid.vercel.app/iccid/getIccid/fonkpos',
    mernisSet: 'https://iccid.vercel.app/mernis/getmernis/fonkmernis',
    iccidSold: 'https://iccid.vercel.app/iccid/setSold',
    addActivation: 'https://iccid.vercel.app/iccid/EnesVeAlpDataniziCikti'
}

export const DECRYPT_ENDPOINTS = {
    auth: 'https://omni-zone-uat.turktelekom.com.tr/OdfCommerceBackendTtgTest2/auth',
    decrypt: 'https://omni-zone-uat.turktelekom.com.tr/OdfCommerceBackendTtgTest2/marvel/admin/utility/crypto/decrypt'
} 