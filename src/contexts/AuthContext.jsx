import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
    
    // Base URL'i ortam değişkenine göre belirle
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://iccid.vercel.app'
        : 'http://localhost:5432';
    
    // Axios baseURL'ini ayarla
    axios.defaults.baseURL = baseUrl;
    
    const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);

    // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et ve otomatik giriş yap
    useEffect(() => {
        const storedUsername = localStorage.getItem('currentUserSicilNo');
        const storedPassword = localStorage.getItem('currentPassword');
        
        if (storedUsername && storedPassword) {
            login(storedUsername, storedPassword)
                .then(result => {
                    if (!result.success) {
                        // Giriş başarısız olursa localStorage'ı temizle
                        localStorage.removeItem('currentUserSicilNo');
                        localStorage.removeItem('currentPassword');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            // Users tablosundan kullanıcıyı kontrol et
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('sicil_no', username)
                .single();

            if (userError) throw userError;
            if (!userData) {
                return { success: false, error: 'Kullanıcı bulunamadı' };
            }

            // Şifre kontrolü
            if (userData.password !== password) {
                return { success: false, error: 'Hatalı şifre' };
            }

            // Şifre sicil no ile aynı mı kontrol et
            if (userData.password === userData.sicil_no) {
                setNeedsPasswordChange(true);
                setUser(userData);
                localStorage.setItem('currentUserSicilNo', username);
                localStorage.setItem('currentUsername', userData.full_name);
                localStorage.setItem('currentPassword', password);
                
                return { 
                    success: true, 
                    needsPasswordChange: true,
                    userData 
                };
            }

            setUser(userData);
            localStorage.setItem('currentUserSicilNo', username);
            localStorage.setItem('currentPassword', password);
            localStorage.setItem('currentUsername', userData.full_name);
            
            // Son giriş zamanını güncelle
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    last_login: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', userData.id)
                .select()
                .single();

            if (updateError) throw updateError;

            return { success: true, userData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updatePassword = async (userId, newPassword) => {
        try {
            if (newPassword === user?.sicil_no) {
                return { 
                    success: false, 
                    error: 'Yeni şifre sicil numarası ile aynı olamaz' 
                };
            }

            const { error } = await supabase
                .from('users')
                .update({ 
                    password: newPassword,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;

            // Kullanıcı bilgilerini güncelle
            const updatedUser = { ...user, password: newPassword };
            setUser(updatedUser);
            localStorage.setItem('currentPassword', newPassword);
            setNeedsPasswordChange(false);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            localStorage.removeItem('currentUserSicilNo');
            localStorage.removeItem('currentPassword');
            localStorage.removeItem('currentUsername');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        needsPasswordChange,
        updatePassword,
        setNeedsPasswordChange,
        baseUrl,
        isWorkflowRunning,
        setIsWorkflowRunning
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 