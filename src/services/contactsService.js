import { useAuth } from '../contexts/AuthContext';

// Contacts API Service
const API_ENDPOINTS = {
    CONTACTS: '/api/contacts'
};

// Tüm kontakları getir
const getAllContacts = async (baseUrl, user) => {
    console.log(user, 'user')
    try {
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
const createContact = async (baseUrl, contactData, user) => {
    console.log(user, 'userasd')
    try {
        if (!user) {
            throw new Error('Kullanıcı girişi yapılmamış');
        }

        const response = await fetch(`${baseUrl}${API_ENDPOINTS.CONTACTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Data': JSON.stringify(user)
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
const updateContact = async (baseUrl, contactId, contactData, user) => {
    try {
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
const deleteContact = async (baseUrl, contactId, user) => {
    try {
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