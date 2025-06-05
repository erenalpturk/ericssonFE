import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
     const baseUrl = 'https://iccid.vercel.app';
    //const baseUrl = 'http://localhost:5432';
    useEffect(() => {
        // Local storage'dan kullanıcı bilgisini al
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
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
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Kullanıcı adını localStorage'e user değişkeni olarak kaydet
                localStorage.setItem('currentUsername', userData.full_name);
                console.log('[AuthContext] User logged in:', userData.full_name);
                
                return { 
                    success: true, 
                    needsPasswordChange: true,
                    userData 
                };
            }

            // Normal giriş işlemi
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('currentUserSicilNo', userData.sicil_no);
            // Kullanıcı adını localStorage'e user değişkeni olarak kaydet
            localStorage.setItem('currentUsername', userData.full_name);
            console.log('[AuthContext] User logged in:', userData.full_name);
            
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
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setNeedsPasswordChange(false);
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            localStorage.removeItem('user');
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
        baseUrl
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