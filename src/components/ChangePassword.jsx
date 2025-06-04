import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { user, needsPasswordChange, setNeedsPasswordChange, baseUrl } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!needsPasswordChange) {
            navigate('/');
        }
    }, [needsPasswordChange, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword === user.password) {
            setError('Yeni şifre eski şifre ile aynı olamaz');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        if (newPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/user/updatePassword`, {
                sicil_no: user.sicil_no,
                password: newPassword
            });
            if (response.data.message) {
                setNeedsPasswordChange(false);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Şifre güncellenirken bir hata oluştu');
        }
    };

    return (
        <div className="modern-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-key-fill text-emerald-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Şifre Değiştirme</h1>
                        <p>Hoşgeldiniz {user.full_name}! Güvenliğiniz için yeni bir şifre belirleyin</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-section">
                <div className="card">
                    <div className="card-body">
                        {error && (
                            <div className="result-alert error">
                                <div className="alert-icon">
                                    <i className="bi bi-x-circle-fill"></i>
                                </div>
                                <div className="alert-content">
                                    <strong>Hata!</strong>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="modern-form">
                            <div className="form-group">
                                <label htmlFor="new-password">
                                    <i className="bi bi-lock-fill text-emerald-500"></i>
                                    Yeni Şifre
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    className="modern-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Yeni şifrenizi girin"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password">
                                    <i className="bi bi-lock-fill text-emerald-500"></i>
                                    Şifre Tekrar
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    className="modern-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Şifrenizi tekrar girin"
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="action-btn primary"
                                >
                                    <i className="bi bi-check-circle"></i>
                                    Şifreyi Güncelle
                                </button>
                                <button
                                    type="button"
                                    className="action-btn secondary"
                                    onClick={() => navigate('/')}
                                >
                                    <i className="bi bi-x-circle"></i>
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Help Section */}
                <div className="help-card">
                    <div className="help-header">
                        <i className="bi bi-shield-lock text-emerald-500"></i>
                        <span>Güvenlik Önerileri</span>
                    </div>
                    <div className="help-content">
                        <div className="help-steps">
                            <div className="help-step">
                                <span className="step-number">1</span>
                                <span>En az 6 karakter uzunluğunda bir şifre seçin</span>
                            </div>
                            <div className="help-step">
                                <span className="step-number">2</span>
                                <span>Büyük ve küçük harfler kullanın</span>
                            </div>
                            <div className="help-step">
                                <span className="step-number">3</span>
                                <span>Rakam ve özel karakterler ekleyin</span>
                            </div>
                            <div className="help-step">
                                <span className="step-number">4</span>
                                <span>Sicil numaranızı şifre olarak kullanmayın</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword; 