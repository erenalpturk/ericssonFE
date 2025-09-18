// Projects API Service
const API_ENDPOINTS = {
    PROJECTS: '/api/projects',
    PROJECT_NAMES: '/api/projects/names'
};

// Tüm projeleri getir
const getAllProjects = async (baseUrl, params = {}, user) => {
    try {
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);

        const url = `${baseUrl}${API_ENDPOINTS.PROJECTS}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': typeof user === 'string' ? user : JSON.stringify(user)
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Projeler yüklenirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Get all projects error:', error);
        throw error;
    }
};

// Aktif proje isimlerini getir (dropdown için)
const getProjectNames = async (baseUrl, user) => {
    try {
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.PROJECT_NAMES}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': typeof user === 'string' ? user : JSON.stringify(user)
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Proje isimleri yüklenirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Get project names error:', error);
        throw error;
    }
};

// Yeni proje oluştur (sadece admin)
const createProject = async (baseUrl, projectData, user) => {
    try {
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.PROJECTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': typeof user === 'string' ? user : JSON.stringify(user)
            },
            body: JSON.stringify(projectData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Proje oluşturulurken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Create project error:', error);
        throw error;
    }
};

// Proje güncelle (sadece admin)
const updateProject = async (baseUrl, projectId, projectData, user) => {
    try {
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.PROJECTS}/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': typeof user === 'string' ? user : JSON.stringify(user)
            },
            body: JSON.stringify(projectData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Proje güncellenirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Update project error:', error);
        throw error;
    }
};

// Proje sil (sadece admin)
const deleteProject = async (baseUrl, projectId, user) => {
    try {
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.PROJECTS}/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': typeof user === 'string' ? user : JSON.stringify(user)
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Proje silinirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Delete project error:', error);
        throw error;
    }
};

export const projectsService = {
    getAllProjects,
    getProjectNames,
    createProject,
    updateProject,
    deleteProject
};

export default projectsService; 