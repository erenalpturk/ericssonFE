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

// Environment detection fonksiyonları
export const ENVIRONMENT_CONFIG = {
    isProduction: () => {
        return window.location.hostname.includes('vercel.app') || 
               window.location.hostname.includes('netlify.app') ||
               window.location.hostname.includes('github.io') ||
               window.location.protocol === 'https:' && !window.location.hostname.includes('localhost');
    },
    
    isLocalhost: () => {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.startsWith('192.168.');
    },
    
    canAccessInternalNetworks: () => {
        return !ENVIRONMENT_CONFIG.isProduction() || ENVIRONMENT_CONFIG.isLocalhost();
    },
    
    shouldUseProxy: (endpoint) => {
        const isInternalNetwork = endpoint.includes('turktelekom.com.tr') || 
                                 endpoint.includes('10.') || 
                                 endpoint.includes('192.168.') || 
                                 endpoint.includes('172.');
        
        return isInternalNetwork && ENVIRONMENT_CONFIG.isProduction();
    },
    
    getErrorMessage: (endpoint) => {
        if (ENVIRONMENT_CONFIG.shouldUseProxy(endpoint)) {
            return {
                title: 'İç Ağ Erişim Hatası',
                message: 'Bu endpoint sadece yerel ağdan erişilebilir. Lütfen yerel geliştirme ortamında çalıştırın.',
                suggestion: 'Alternatif olarak VPN kullanabilir veya başka bir environment seçebilirsiniz.'
            };
        }
        return null;
    }
}; 