// API call helper function - baseUrl dinamik olarak alınacak
const apiCall = async (baseUrl, endpoint, options = {}) => {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

// Scripts API service - baseUrl parametresi eklendi
export const scriptsService = {
    // Tüm scriptleri getir
    getAllScripts: async (baseUrl, params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.category) queryParams.append('category', params.category);
        if (params.project_name) queryParams.append('project_name', params.project_name);
        if (params.user_name) queryParams.append('user_name', params.user_name);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const queryString = queryParams.toString();
        const endpoint = `/api/scripts${queryString ? `?${queryString}` : ''}`;
        
        return await apiCall(baseUrl, endpoint);
    },

    // Proje listesini getir
    getProjects: async (baseUrl) => {
        return await apiCall(baseUrl, '/api/scripts/projects');
    },

    // Kullanıcının scriptlerini getir
    getUserScripts: async (baseUrl, userSicilNo, params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const queryString = queryParams.toString();
        const endpoint = `/api/scripts/user/${userSicilNo}${queryString ? `?${queryString}` : ''}`;
        
        return await apiCall(baseUrl, endpoint);
    },

    // Script ara
    searchScripts: async (baseUrl, searchTerm, params = {}) => {
        const queryParams = new URLSearchParams();
        
        queryParams.append('q', searchTerm);
        if (params.category) queryParams.append('category', params.category);
        if (params.project_name) queryParams.append('project_name', params.project_name);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const endpoint = `/api/scripts/search?${queryParams.toString()}`;
        
        return await apiCall(baseUrl, endpoint);
    },

    // Yeni script oluştur
    createScript: async (baseUrl, scriptData) => {
        return await apiCall(baseUrl, '/api/scripts', {
            method: 'POST',
            body: JSON.stringify(scriptData),
        });
    },

    // Script güncelle
    updateScript: async (baseUrl, id, scriptData) => {
        return await apiCall(baseUrl, `/api/scripts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(scriptData),
        });
    },

    // Script sil
    deleteScript: async (baseUrl, id, userSicilNo) => {
        return await apiCall(baseUrl, `/api/scripts/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ user_sicil_no: userSicilNo }),
        });
    },
};

export default scriptsService; 