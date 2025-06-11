import axios from 'axios';

// Backend URL'ini belirle
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com' // Production URL'inizi buraya yazın
  : 'http://localhost:5432'; // Development URL

// Axios varsayılan konfigürasyonu
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor - tüm isteklere '/api' prefix'i ekle
axios.interceptors.request.use(
  (config) => {
    // Eğer URL '/api' ile başlamıyorsa, ekle
    if (!config.url.startsWith('/api') && !config.url.startsWith('http')) {
      config.url = `/api${config.url}`;
    }
    
    // Debug için URL'yi console'a yazdır
    console.log('API Request URL:', config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // 401 durumunda login sayfasına yönlendir
    if (error.response?.status === 401) {
      // sessionStorage'ı temizle
      sessionStorage.clear();
      // Login sayfasına yönlendir
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axios; 