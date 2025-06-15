// Contacts API Service
const API_ENDPOINTS = {
    CONTACTS: '/api/contacts'
};

// Tüm kontakları getir
const getAllContacts = async (baseUrl) => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.CONTACTS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': user
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kontaklar yüklenirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Get all contacts error:', error);
        throw error;
    }
};

// Yeni kontak oluştur
const createContact = async (baseUrl, contactData) => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.CONTACTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': user
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kontak oluşturulurken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Create contact error:', error);
        throw error;
    }
};

// Kontak güncelle
const updateContact = async (baseUrl, contactId, contactData) => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.CONTACTS}/${contactId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': user
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kontak güncellenirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Update contact error:', error);
        throw error;
    }
};

// Kontak sil
const deleteContact = async (baseUrl, contactId) => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.CONTACTS}/${contactId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': user
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Kontak silinirken hata oluştu');
        }

        return await response.json();
    } catch (error) {
        console.error('Delete contact error:', error);
        throw error;
    }
};

export const contactsService = {
    getAllContacts,
    createContact,
    updateContact,
    deleteContact
};

export default contactsService; 