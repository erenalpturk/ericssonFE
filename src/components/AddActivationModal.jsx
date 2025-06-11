import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../contexts/AuthContext';

const AddActivationModal = ({ open, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        msisdn: '',
        tckn: '',
        birth_date: '',
        activationtype: '',
        prod_ofr_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { baseUrl, user } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // MSISDN format kontrolü
        const msisdnRegex = /^5\d{9}$/;
        if (!msisdnRegex.test(formData.msisdn)) {
            setError('MSISDN 5 ile başlamalı ve 10 haneli olmalıdır');
            setLoading(false);
            return;
        }

        // Zorunlu alanları kontrol et
        if (!formData.msisdn || !formData.activationtype || !formData.prod_ofr_id) {
            setError('MSISDN, Aktivasyon Tipi ve Tarife alanları zorunludur');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/iccid/enesVeAlpDataniziCikti`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    user: user.sicil_no,
                    isAutomation: 0
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Bir hata oluştu');
            }

            onSuccess();
            onClose();
            setFormData({
                msisdn: '',
                tckn: '',
                birth_date: '',
                activationtype: '',
                prod_ofr_id: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setFormData({
            msisdn: '',
            tckn: '',
            birth_date: '',
            activationtype: '',
            prod_ofr_id: ''
        });
        setError('');
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: '12px',
                    padding: '8px'
                }
            }}
        >
            <DialogTitle sx={{
                m: 0,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 500 }}>Yeni Aktivasyon Ekle</span>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        required
                        label="MSISDN"
                        name="msisdn"
                        value={formData.msisdn}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        error={error && (!formData.msisdn || !/^5\d{9}$/.test(formData.msisdn))}
                        helperText={
                            error && !formData.msisdn 
                                ? 'MSISDN zorunludur' 
                                : error && !/^5\d{9}$/.test(formData.msisdn)
                                ? 'MSISDN 5 ile başlamalı ve 10 haneli olmalıdır'
                                : ''
                        }
                        inputProps={{
                            maxLength: 10,
                            pattern: '^5\\d{9}$',
                            inputMode: 'numeric',
                            onKeyPress: (e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }
                        }}
                    />

                    <TextField
                        label="TCKN"
                        name="tckn"
                        value={formData.tckn}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        inputProps={{
                            maxLength: 11,
                            pattern: '^\\d{11}$',
                            inputMode: 'numeric',
                            onKeyPress: (e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }
                        }}
                    />

                    <TextField
                        label="Doğum Tarihi"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <FormControl fullWidth size="small" required error={error && !formData.activationtype}>
                        <InputLabel>Aktivasyon Tipi</InputLabel>
                        <Select
                            name="activationtype"
                            value={formData.activationtype}
                            onChange={handleChange}
                            label="Aktivasyon Tipi"
                        >
                            <MenuItem value="RegPost">RegPost</MenuItem>
                            <MenuItem value="RegPre">RegPre</MenuItem>
                            <MenuItem value="FonkPost">FonkPost</MenuItem>
                            <MenuItem value="FonkPre">FonkPre</MenuItem>
                        </Select>
                        {error && !formData.activationtype && (
                            <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                                Aktivasyon Tipi zorunludur
                            </Box>
                        )}
                    </FormControl>

                    <FormControl fullWidth size="small" required error={error && !formData.prod_ofr_id}>
                        <InputLabel>Tarife</InputLabel>
                        <Select
                            name="prod_ofr_id"
                            value={formData.prod_ofr_id}
                            onChange={handleChange}
                            label="Tarife"
                        >
                            <MenuItem value="400041110">Ailece 15GB</MenuItem>
                            <MenuItem value="400079751">Uygun 10GB</MenuItem>
                            <MenuItem value="100000071879">Kral</MenuItem>
                            <MenuItem value="0">Diğer</MenuItem>
                        </Select>
                        {error && !formData.prod_ofr_id && (
                            <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                                Tarife seçimi zorunludur
                            </Box>
                        )}
                    </FormControl>

                    {error && (
                        <Box sx={{ color: 'error.main', mt: 1 }}>
                            {error}
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Button onClick={onClose} color="inherit">
                    İptal
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        minWidth: '100px',
                        textTransform: 'none'
                    }}
                >
                    {loading ? 'Ekleniyor...' : 'Ekle'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddActivationModal; 